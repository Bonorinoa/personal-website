import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CommitWeek { w: number; total: number; days: number[] }
export interface RepoLanguage { name: string; bytes: number }
export interface LastCommit {
  sha: string;
  message: string;
  date: string;
  url: string;
  author?: string;
}
export interface RepoMeta {
  createdAt: string;
  pushedAt: string;
  updatedAt: string;
  homepage?: string;
  description?: string;
  stars?: number;
  url: string;
  defaultBranch?: string;
}
export type CommitStatus = 'idle' | 'loading' | 'pending' | 'ready' | 'error';

interface State {
  status: CommitStatus;
  weeks: CommitWeek[];
  languages?: RepoLanguage[];
  lastCommit?: LastCommit;
  repo?: RepoMeta;
  error?: string;
}

// Simple in-memory cache across component instances for the session.
const CACHE = new Map<string, State>();
const INFLIGHT = new Map<string, Promise<State>>();

async function fetchOnce(owner: string, repo: string): Promise<State> {
  const { data, error } = await supabase.functions.invoke('github-commits', {
    body: { owner, repo },
  });
  if (error) return { status: 'error', weeks: [], error: error.message };
  const languages = data?.languages;
  const lastCommit = data?.lastCommit;
  const repoMeta = data?.repo;
  if (data?.status === 'ready') return { status: 'ready', weeks: data.weeks ?? [], languages, lastCommit, repo: repoMeta };
  if (data?.status === 'pending') return { status: 'pending', weeks: [], languages, lastCommit, repo: repoMeta };
  return { status: 'error', weeks: [], error: data?.message ?? 'unknown' };
}

export function useCommitActivity(owner?: string | null, repo?: string | null): State {
  const key = owner && repo ? `${owner}/${repo}` : '';
  const [state, setState] = useState<State>(() => (key && CACHE.get(key)) || { status: 'idle', weeks: [] });

  useEffect(() => {
    if (!key) return;
    const cached = CACHE.get(key);
    if (cached && cached.status === 'ready') { setState(cached); return; }

    setState({ status: 'loading', weeks: [] });
    let cancelled = false;

    const run = INFLIGHT.get(key) ?? (async () => {
      let result = await fetchOnce(owner!, repo!);
      // If GitHub is still computing stats, retry once after 2s
      if (result.status === 'pending') {
        await new Promise(r => setTimeout(r, 2000));
        result = await fetchOnce(owner!, repo!);
      }
      CACHE.set(key, result);
      INFLIGHT.delete(key);
      return result;
    })();
    INFLIGHT.set(key, run);

    run.then(r => { if (!cancelled) setState(r); });
    return () => { cancelled = true; };
  }, [key, owner, repo]);

  return state;
}
