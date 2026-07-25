import { useCallback, useEffect, useRef, useState } from 'react';
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
  attempts?: number;
}

// Simple in-memory cache across component instances for the session.
const CACHE = new Map<string, State>();
const INFLIGHT = new Map<string, Promise<State>>();
const SUBSCRIBERS = new Map<string, Set<(s: State) => void>>();

function publish(key: string, s: State) {
  CACHE.set(key, s);
  SUBSCRIBERS.get(key)?.forEach((fn) => fn(s));
}

// Track the most recent successful GitHub sync across all cards.
let LAST_SYNCED_AT: number | null = null;
const SYNC_LISTENERS = new Set<(t: number | null) => void>();
function markSynced() {
  LAST_SYNCED_AT = Date.now();
  SYNC_LISTENERS.forEach((fn) => fn(LAST_SYNCED_AT));
}
export function getLastSyncedAt(): number | null {
  return LAST_SYNCED_AT;
}
export function subscribeLastSynced(fn: (t: number | null) => void): () => void {
  SYNC_LISTENERS.add(fn);
  return () => SYNC_LISTENERS.delete(fn);
}

async function fetchOnce(owner: string, repo: string): Promise<State> {
  try {
    const { data, error } = await supabase.functions.invoke('github-commits', {
      body: { owner, repo },
    });
    if (error) {
      const details = 'context' in error && error.context
        ? await (error.context as Response).text().catch(() => '')
        : '';
      return { status: 'error', weeks: [], error: details || error.message };
    }
    const languages = data?.languages;
    const lastCommit = data?.lastCommit;
    const repoMeta = data?.repo;
    if (data?.status === 'ready') return { status: 'ready', weeks: data.weeks ?? [], languages, lastCommit, repo: repoMeta };
    if (data?.status === 'pending') return { status: 'pending', weeks: [], languages, lastCommit, repo: repoMeta };
    return { status: 'error', weeks: [], error: data?.message ?? 'Unknown response from github-commits' };
  } catch (e) {
    return { status: 'error', weeks: [], error: e instanceof Error ? e.message : String(e) };
  }
}

const MAX_ATTEMPTS = 3;

async function runWithBackoff(key: string, owner: string, repo: string): Promise<State> {
  let attempt = 0;
  let result: State = { status: 'error', weeks: [], error: 'no-attempt' };
  while (attempt < MAX_ATTEMPTS) {
    attempt++;
    publish(key, { status: 'loading', weeks: [], attempts: attempt });
    result = await fetchOnce(owner, repo);
    // Pending: retry once quickly (GitHub is computing stats).
    if (result.status === 'pending') {
      await new Promise((r) => setTimeout(r, 2000));
      result = await fetchOnce(owner, repo);
    }
    if (result.status === 'ready' || result.status === 'pending') {
      result.attempts = attempt;
      publish(key, result);
      markSynced();
      return result;
    }
    // Error → exponential backoff before the next attempt (1s, 2s, 4s).
    if (attempt < MAX_ATTEMPTS) {
      const delay = 1000 * Math.pow(2, attempt - 1);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  result.attempts = attempt;
  publish(key, result);
  return result;
}

function startFetch(key: string, owner: string, repo: string): Promise<State> {
  const existing = INFLIGHT.get(key);
  if (existing) return existing;
  const p = runWithBackoff(key, owner, repo).finally(() => INFLIGHT.delete(key));
  INFLIGHT.set(key, p);
  return p;
}

export interface UseCommitActivityResult extends State {
  retry: () => void;
}

export function useCommitActivity(owner?: string | null, repo?: string | null): UseCommitActivityResult {
  const key = owner && repo ? `${owner}/${repo}` : '';
  const [state, setState] = useState<State>(() => (key && CACHE.get(key)) || { status: 'idle', weeks: [] });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    if (!key) return;
    let subs = SUBSCRIBERS.get(key);
    if (!subs) { subs = new Set(); SUBSCRIBERS.set(key, subs); }
    const listener = (s: State) => { if (mounted.current) setState(s); };
    subs.add(listener);

    const cached = CACHE.get(key);
    if (cached && (cached.status === 'ready' || cached.status === 'error')) {
      setState(cached);
    } else {
      startFetch(key, owner!, repo!);
    }

    return () => {
      subs?.delete(listener);
    };
  }, [key, owner, repo]);

  const retry = useCallback(() => {
    if (!key || !owner || !repo) return;
    CACHE.delete(key);
    startFetch(key, owner, repo);
  }, [key, owner, repo]);

  return { ...state, retry };
}
