import { useEffect, useState } from 'react';
import { getLastSyncedAt, subscribeLastSynced } from '@/hooks/useCommitActivity';

function relTime(ms: number) {
  const s = Math.max(1, Math.round((Date.now() - ms) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export function LastSynced({ className = '' }: { className?: string }) {
  const [t, setT] = useState<number | null>(getLastSyncedAt());
  const [, setTick] = useState(0);

  useEffect(() => subscribeLastSynced(setT), []);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground ${className}`}
      title={t ? new Date(t).toLocaleString() : 'Waiting for GitHub sync'}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-cobalt/70 mr-2 align-middle" />
      GitHub · last synced {t ? relTime(t) : '—'}
    </div>
  );
}
