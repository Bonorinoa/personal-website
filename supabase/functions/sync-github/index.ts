import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Account → workspace label used by Build mode UI
const ACCOUNTS: Array<{ login: string; kind: 'user' | 'org'; org: string }> = [
  { login: 'Bonorinoa',     kind: 'user', org: 'Personal' },
  { login: 'EconLLM-Lab',   kind: 'org',  org: 'EconLLM-Lab' },
  { login: 'Perwell',       kind: 'org',  org: 'Perwell' },
  { login: 'Cognitio-EDU',  kind: 'org',  org: 'Cognitio-EDU' },
];

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  visibility: string;
}

interface RepoItem {
  id: string;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  isFork: boolean;
  isArchived: boolean;
  ownerLogin: string;
  org: string;
}

function ghHeaders() {
  const token = Deno.env.get('GITHUB_TOKEN');
  const h: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Lovable-Portfolio-Sync',
  };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

async function fetchRepos(login: string, kind: 'user' | 'org'): Promise<GitHubRepo[]> {
  const path = kind === 'org' ? `orgs/${login}/repos` : `users/${login}/repos`;
  const res = await fetch(`https://api.github.com/${path}?per_page=100&sort=updated`, {
    headers: ghHeaders(),
  });
  if (!res.ok) {
    console.error(`GitHub fetch failed for ${login}: ${res.status} ${await res.text()}`);
    return [];
  }
  return await res.json() as GitHubRepo[];
}

function toRepoItem(r: GitHubRepo, ownerLogin: string, org: string): RepoItem {
  return {
    id: `github-${r.id}`,
    name: r.name,
    description: r.description,
    url: r.html_url,
    homepage: r.homepage,
    language: r.language,
    topics: r.topics || [],
    stars: r.stargazers_count,
    forks: r.forks_count,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    pushedAt: r.pushed_at,
    isFork: r.fork,
    isArchived: r.archived,
    ownerLogin,
    org,
  };
}

function inferCollaborationTag(repo: RepoItem): string[] {
  const topics = repo.topics.map(t => t.toLowerCase());
  if (topics.some(t => ['ai','llm','gpt','chatgpt','langchain','ml','machine-learning'].includes(t))) return ['vibe-engineered'];
  if (topics.some(t => ['template','boilerplate','starter'].includes(t))) return ['vibe-coded'];
  const isRecent = (Date.now() - new Date(repo.pushedAt).getTime()) < 365*24*60*60*1000;
  return isRecent ? ['ai-assisted'] : [];
}

function suggestArtifact(repo: RepoItem) {
  return {
    title: repo.name.replace(/[-_]/g, ' '),
    type: 'project',
    date: repo.createdAt.split('T')[0],
    summary: repo.description || `A ${repo.language || 'code'} project`,
    mode_visibility: 'build',
    section: 'experience',
    tags: inferCollaborationTag(repo),
    org: repo.org,
    language: repo.language,
    stars: repo.stars,
    source_ids: { github: repo.url },
    links: { repo: repo.url, demo: repo.homepage || null },
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const { username, selected_repos, scope, include_archived } = body as {
      username?: string;
      selected_repos?: string[];
      scope?: 'all';
      include_archived?: boolean;
    };

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // ===== Multi-account fan-out =====
    if (scope === 'all') {
      const all: RepoItem[] = [];
      for (const acct of ACCOUNTS) {
        const repos = await fetchRepos(acct.login, acct.kind);
        repos
          .filter(r => !r.fork && (include_archived || !r.archived))
          .forEach(r => all.push(toRepoItem(r, acct.login, acct.org)));
      }

      const { data: existingItems } = await supabase
        .from('inbox_items').select('external_id').eq('source', 'github');
      const existing = new Set(existingItems?.map(i => i.external_id) || []);

      const newItems = all
        .filter(r => !existing.has(r.id))
        .map(r => ({
          source: 'github',
          external_id: r.id,
          status: 'pending',
          raw_data: r,
          suggested_artifact: suggestArtifact(r),
          discovered_at: new Date().toISOString(),
        }));

      let inserted = 0;
      if (newItems.length > 0) {
        const { data, error } = await supabase.from('inbox_items').insert(newItems).select();
        if (error) {
          console.error('Insert error:', error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        inserted = data?.length || 0;
      }

      return new Response(JSON.stringify({
        success: true,
        scope: 'all',
        accounts: ACCOUNTS.map(a => a.login),
        scanned: all.length,
        inserted,
        skipped: all.length - inserted,
        syncedAt: new Date().toISOString(),
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ===== Legacy single-user flow =====
    if (!username) {
      return new Response(JSON.stringify({ error: 'username or scope:"all" required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const acct = ACCOUNTS.find(a => a.login.toLowerCase() === username.toLowerCase());
    const kind = acct?.kind ?? 'user';
    const org = acct?.org ?? 'Other';
    const rawRepos = await fetchRepos(username, kind);
    const repoItems = rawRepos
      .filter(r => !r.fork && (include_archived || !r.archived))
      .map(r => toRepoItem(r, username, org));

    if (selected_repos && Array.isArray(selected_repos) && selected_repos.length > 0) {
      const picked = repoItems.filter(r => selected_repos.includes(r.id) || selected_repos.includes(r.name));
      const { data: existingItems } = await supabase
        .from('inbox_items').select('external_id').eq('source', 'github');
      const existing = new Set(existingItems?.map(i => i.external_id) || []);

      const newItems = picked
        .filter(r => !existing.has(r.id))
        .map(r => ({
          source: 'github',
          external_id: r.id,
          status: 'pending',
          raw_data: r,
          suggested_artifact: suggestArtifact(r),
          discovered_at: new Date().toISOString(),
        }));

      let inserted = 0;
      if (newItems.length > 0) {
        const { data, error } = await supabase.from('inbox_items').insert(newItems).select();
        if (error) return new Response(JSON.stringify({ error: error.message }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
        inserted = data?.length || 0;
      }

      return new Response(JSON.stringify({
        success: true, inserted, skipped: picked.length - inserted,
        syncedAt: new Date().toISOString(),
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({
      success: true, repos: repoItems, count: repoItems.length,
      message: 'Select repos to import',
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('sync-github error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
