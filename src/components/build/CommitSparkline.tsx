import { useMemo, useState } from 'react';
import { useCommitActivity } from '@/hooks/useCommitActivity';

interface Props {
  owner: string;
  repo: string;
  weeks?: number; // how many trailing weeks to show
  className?: string;
}

function fmtWeek(unixSec: number) {
  const d = new Date(unixSec * 1000);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function relTime(unixSec: number) {
  const days = Math.round((Date.now() / 1000 - unixSec) / 86400);
  if (days < 7) return `${days}d ago`;
  const w = Math.round(days / 7);
  if (w < 8) return `${w}w ago`;
  const m = Math.round(days / 30);
  if (m < 12) return `${m}mo ago`;
  return `${Math.round(days / 365)}y ago`;
}

// Compact sparkline of weekly commit counts with hover tooltip + live summary.
export function CommitSparkline({ owner, repo, weeks = 52, className }: Props) {
  const { status, weeks: data } = useCommitActivity(owner, repo);
  const [hover, setHover] = useState<number | null>(null);

  const slice = useMemo(() => data.slice(-weeks), [data, weeks]);
  const max = Math.max(1, ...slice.map(w => w.total));
  const total = slice.reduce((a, w) => a + w.total, 0);
  const activeWeeks = slice.filter(w => w.total > 0).length;
  const peak = slice.reduce<{ i: number; total: number; w: number } | null>(
    (best, w, i) => (best && best.total >= w.total ? best : { i, total: w.total, w: w.w }),
    null,
  );
  const lastActive = [...slice].reverse().find(w => w.total > 0);

  const hovered = hover != null ? slice[hover] : null;

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

      <div className="relative">
        <div
          className="flex items-end gap-[1px] h-8 hairline-b"
          aria-label={`${total} commits in the last ${weeks} weeks`}
          role="img"
          onMouseLeave={() => setHover(null)}
        >
          {status !== 'ready' && (
            <div className="w-full h-full bg-muted/30 animate-pulse" />
          )}
          {status === 'ready' && slice.map((w, i) => {
            const h = w.total === 0 ? 2 : Math.max(2, Math.round((w.total / max) * 30));
            const isHover = hover === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setHover(i)}
                className={`flex-1 transition-colors cursor-crosshair ${
                  isHover ? 'bg-cobalt' : 'bg-cobalt/70 hover:bg-cobalt'
                }`}
                style={{ height: `${h}px`, minWidth: '2px' }}
              />
            );
          })}
        </div>

        {hovered && (
          <div
            className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap
                       bg-foreground text-background font-mono text-[10px] px-2 py-1 rounded-sm
                       shadow-sm tabular-nums"
          >
            {hovered.total} {hovered.total === 1 ? 'commit' : 'commits'} · week of {fmtWeek(hovered.w)}
          </div>
        )}
      </div>

      {status === 'ready' && (
        <div className="mt-1.5 font-mono text-[10px] text-muted-foreground tabular-nums min-h-[14px]">
          {hovered ? (
            <span>
              {hovered.total} {hovered.total === 1 ? 'commit' : 'commits'} · {fmtWeek(hovered.w)}
            </span>
          ) : (
            <span>
              {activeWeeks}/{slice.length} active wks
              {peak && peak.total > 0 && <> · peak {peak.total} ({fmtWeek(peak.w)})</>}
              {lastActive && <> · last {relTime(lastActive.w)}</>}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
