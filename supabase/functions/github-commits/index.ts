// Returns 52-week commit activity + top languages + latest commit for a public GitHub repo.
// Response: {
//   status: 'ready' | 'pending' | 'error',
//   weeks?: Week[],
//   languages?: { name: string; bytes: number }[],
//   lastCommit?: { sha: string; message: string; date: string; url: string; author?: string },
//   contributors?: { login, commits, additions, deletions, isAgent, avatarUrl }[],
//   message?: string
// }

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

async function fetchLanguages(owner: string, repo: string) {
  try {
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers: ghHeaders() });
    if (!r.ok) return undefined;
    const obj = await r.json() as Record<string, number>;
    return Object.entries(obj)
      .map(([name, bytes]) => ({ name, bytes }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 3);
  } catch { return undefined; }
}

async function fetchLastCommit(owner: string, repo: string) {
  try {
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, { headers: ghHeaders() });
    if (!r.ok) return undefined;
    const arr = await r.json() as Array<{
      sha: string;
      html_url: string;
      commit: { message: string; author: { date: string; name?: string } };
    }>;
    const c = arr[0];
    if (!c) return undefined;
    return {
      sha: c.sha.slice(0, 7),
      message: (c.commit.message ?? '').split('\n')[0].slice(0, 140),
      date: c.commit.author?.date ?? '',
      url: c.html_url,
      author: c.commit.author?.name,
    };
  } catch { return undefined; }
}
// GitHub logins that are declared agent/harness accounts, not humans.
const AGENT_LOGINS = new Set(['hermessinho']);

interface Contributor {
  login: string;
  commits: number;
  additions: number;
  deletions: number;
  isAgent: boolean;
  avatarUrl?: string;
}

/** Per-author contribution totals. Returns undefined while GitHub warms the stats cache. */
async function fetchContributors(owner: string, repo: string): Promise<Contributor[] | undefined> {
  try {
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/stats/contributors`, {
      headers: ghHeaders(),
    });
    if (r.status === 202 || !r.ok) return undefined;
    const arr = await r.json() as Array<{
      total: number;
      author?: { login?: string; avatar_url?: string } | null;
      weeks?: Array<{ a: number; d: number }>;
    }>;
    if (!Array.isArray(arr)) return undefined;
    return arr
      .map((c) => {
        const login = c.author?.login ?? 'unknown';
        const additions = (c.weeks ?? []).reduce((s, w) => s + (w.a ?? 0), 0);
        const deletions = (c.weeks ?? []).reduce((s, w) => s + (w.d ?? 0), 0);
        return {
          login,
          commits: c.total ?? 0,
          additions,
          deletions,
          isAgent: AGENT_LOGINS.has(login.toLowerCase()),
          avatarUrl: c.author?.avatar_url,
        };
      })
      .sort((a, b) => b.commits - a.commits);
  } catch { return undefined; }
}


async function fetchRepoMeta(owner: string, repo: string) {
  try {
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: ghHeaders() });
    if (!r.ok) return undefined;
    const j = await r.json() as {
      created_at: string; pushed_at: string; updated_at: string;
      homepage?: string | null; description?: string | null;
      stargazers_count?: number; html_url: string; default_branch?: string;
    };
    return {
      createdAt: j.created_at,
      pushedAt: j.pushed_at,
      updatedAt: j.updated_at,
      homepage: j.homepage && /^https?:\/\//i.test(j.homepage) ? j.homepage : undefined,
      description: j.description ?? undefined,
      stars: j.stargazers_count,
      url: j.html_url,
      defaultBranch: j.default_branch,
    };
  } catch { return undefined; }
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

    const [statsRes, languages, lastCommit, repoMeta, contributors] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`, { headers: ghHeaders() }),
      fetchLanguages(owner, repo),
      fetchLastCommit(owner, repo),
      fetchRepoMeta(owner, repo),
      fetchContributors(owner, repo),
    ]);

    if (statsRes.status === 202) {
      // Stats still computing — return other signals now, don't cache.
      return new Response(JSON.stringify({ status: 'pending', languages, lastCommit, repo: repoMeta, contributors }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!statsRes.ok) {
      const text = await statsRes.text();
      console.error(`github-commits ${key} failed [${statsRes.status}]: ${text}`);
      return new Response(
        JSON.stringify({ status: 'error', message: `GitHub ${statsRes.status}`, details: text.slice(0, 200) }),
        { status: statsRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const weeks = await statsRes.json() as Array<{ week: number; total: number; days: number[] }>;
    const body = {
      status: 'ready',
      weeks: weeks.map(w => ({ w: w.week, total: w.total, days: w.days })),
      languages,
      lastCommit,
      repo: repoMeta,
      contributors,
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
