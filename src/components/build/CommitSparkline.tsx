import { useCommitActivity } from '@/hooks/useCommitActivity';

interface Props {
  owner: string;
  repo: string;
  weeks?: number; // how many trailing weeks to show
  className?: string;
}

// Compact 52-week sparkline of weekly commit counts. Cobalt bars, hairline baseline.
export function CommitSparkline({ owner, repo, weeks = 52, className }: Props) {
  const { status, weeks: data } = useCommitActivity(owner, repo);

  const slice = data.slice(-weeks);
  const max = Math.max(1, ...slice.map(w => w.total));
  const total = slice.reduce((a, w) => a + w.total, 0);

  return (
    <div className={className}>
      <div className="flex items-end justify-between mb-1">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Commits · {weeks}w
        </div>
        <div className="font-mono text-[10px] tabular-nums text-muted-foreground">
          {status === 'ready' ? total : status === 'error' ? '—' : '…'}
        </div>
      </div>
      <div
        className="flex items-end gap-[1px] h-8 hairline-b"
        aria-label={`${total} commits in the last ${weeks} weeks`}
        role="img"
      >
        {status !== 'ready' && (
          <div className="w-full h-full bg-muted/30 animate-pulse" />
        )}
        {status === 'ready' && slice.map((w, i) => {
          const h = w.total === 0 ? 2 : Math.max(2, Math.round((w.total / max) * 30));
          return (
            <div
              key={i}
              className="flex-1 bg-cobalt/70 hover:bg-cobalt transition-colors"
              style={{ height: `${h}px`, minWidth: '2px' }}
              title={`${w.total} commits · week of ${new Date(w.w * 1000).toISOString().slice(0, 10)}`}
            />
          );
        })}
      </div>
    </div>
  );
}
