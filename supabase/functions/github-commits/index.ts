// Returns 52-week commit activity for a public GitHub repo.
// Response: { status: 'ready', weeks: Week[] } | { status: 'pending' } | { status: 'error', message }
// Week = { w: number (unix seconds, week start), total: number, days: number[7] }

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CACHE = new Map<string, { at: number; body: unknown }>();
const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

function ghHeaders() {
  const token = Deno.env.get('GITHUB_TOKEN');
  const h: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Lovable-Portfolio-CommitActivity',
  };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

function isSafeSegment(s: string) {
  return /^[A-Za-z0-9._-]{1,100}$/.test(s);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    let owner = '', repo = '';
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      owner = String(body.owner ?? '');
      repo = String(body.repo ?? '');
    } else {
      const url = new URL(req.url);
      owner = url.searchParams.get('owner') ?? '';
      repo = url.searchParams.get('repo') ?? '';
    }

    if (!isSafeSegment(owner) || !isSafeSegment(repo)) {
      return new Response(JSON.stringify({ status: 'error', message: 'Invalid owner/repo' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const key = `${owner}/${repo}`;
    const hit = CACHE.get(key);
    if (hit && Date.now() - hit.at < TTL_MS) {
      return new Response(JSON.stringify(hit.body), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
      });
    }

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
      { headers: ghHeaders() },
    );

    if (res.status === 202) {
      return new Response(JSON.stringify({ status: 'pending' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!res.ok) {
      const text = await res.text();
      console.error(`github-commits ${key} failed [${res.status}]: ${text}`);
      return new Response(
        JSON.stringify({ status: 'error', message: `GitHub ${res.status}`, details: text.slice(0, 200) }),
        { status: res.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const weeks = await res.json() as Array<{ week: number; total: number; days: number[] }>;
    const body = {
      status: 'ready',
      weeks: weeks.map(w => ({ w: w.week, total: w.total, days: w.days })),
    };
    CACHE.set(key, { at: Date.now(), body });

    return new Response(JSON.stringify(body), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
    });
  } catch (err) {
    console.error('github-commits error', err);
    return new Response(JSON.stringify({ status: 'error', message: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
