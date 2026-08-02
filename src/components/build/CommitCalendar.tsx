import { useState } from 'react';
import { useCommitActivity } from '@/hooks/useCommitActivity';

interface Props {
  owner: string;
  repo: string;
}

const DAY_MS = 86400000;

function dayLabel(weekStart: number, dayIndex: number) {
  const d = new Date(weekStart * 1000 + dayIndex * DAY_MS);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

// GitHub-style 52-week × 7-day contribution calendar.
export function CommitCalendar({ owner, repo }: Props) {
  const { status, weeks, error } = useCommitActivity(owner, repo);
  const [hover, setHover] = useState<{ count: number; label: string } | null>(null);

  const allDays = weeks.flatMap(w => w.days);
  const max = Math.max(1, ...allDays);
  const total = allDays.reduce((a, b) => a + b, 0);

  const bucket = (n: number) => {
    if (n === 0) return 0;
    const r = n / max;
    if (r < 0.2) return 1;
    if (r < 0.45) return 2;
    if (r < 0.75) return 3;
    return 4;
  };
  const shade = ['bg-muted/30', 'bg-cobalt/20', 'bg-cobalt/40', 'bg-cobalt/70', 'bg-cobalt'];

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-3 gap-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cobalt">
          Commit activity · last 52 weeks
        </div>
        <div className="font-mono text-[11px] tabular-nums text-muted-foreground text-right">
          {status === 'ready'
            ? hover
              ? `${hover.count} commit${hover.count === 1 ? '' : 's'} · ${hover.label}`
              : `${total} commits`
            : status === 'error' ? 'unavailable' : 'loading…'}
        </div>
      </div>

      {status === 'error' && (
        <p className="text-xs text-muted-foreground">Could not load commit activity{error ? ` — ${error}` : ''}.</p>
      )}

      {status !== 'error' && (
        <div className="overflow-x-auto">
          <div
            className="inline-flex gap-[2px]"
            aria-hidden={status !== 'ready'}
            onMouseLeave={() => setHover(null)}
          >
            {(status === 'ready' ? weeks : Array.from({ length: 52 }, () => ({ w: 0, days: [0,0,0,0,0,0,0], total: 0 })))
              .map((wk, i) => (
                <div key={i} className="flex flex-col gap-[2px]">
                  {wk.days.map((d, j) => (
                    <div
                      key={j}
                      onMouseEnter={
                        status === 'ready'
                          ? () => setHover({ count: d, label: dayLabel(wk.w, j) })
                          : undefined
                      }
                      className={`w-[10px] h-[10px] rounded-[2px] transition-transform ${
                        status === 'ready'
                          ? `${shade[bucket(d)]} hover:scale-[1.6] hover:ring-1 hover:ring-cobalt/60`
                          : 'bg-muted/30 animate-pulse'
                      }`}
                      title={status === 'ready' ? `${d} commits · ${dayLabel(wk.w, j)}` : ''}
                    />
                  ))}
                </div>
              ))}
          </div>
        </div>
      )}


      <div className="flex items-center gap-2 mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>less</span>
        {shade.map((c, i) => <span key={i} className={`w-[10px] h-[10px] rounded-[2px] ${c}`} />)}
        <span>more</span>
        <a
          href={`https://github.com/${owner}/${repo}/graphs/commit-activity`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto link-cobalt"
        >
          verify on github ↗
        </a>
      </div>
    </div>
  );
}
