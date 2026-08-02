import { useEffect, useMemo, useRef, useState, type TouchEvent as ReactTouchEvent } from 'react';
import { useCommitActivity } from '@/hooks/useCommitActivity';
import { useIsMobile } from '@/hooks/use-mobile';

interface Props {
  owner: string;
  repo: string;
}

const DAY_MS = 86400000;

function dayLabel(date: Date) {
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

interface DayCell {
  key: string;
  date: Date;
  count: number;
}

interface MonthGroup {
  key: string;
  label: string;
  days: DayCell[];
}

// GitHub-style contribution calendar. Desktop: 52-week × 7-day grid.
// Mobile: one month at a time, swipe left/right to change months.
export function CommitCalendar({ owner, repo }: Props) {
  const { status, weeks, error } = useCommitActivity(owner, repo);
  const isMobile = useIsMobile();
  const [hover, setHover] = useState<{ count: number; label: string } | null>(null);
  const [selected, setSelected] = useState<{ key: string; count: number; label: string } | null>(null);
  const active = hover ?? selected;

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

  const months: MonthGroup[] = useMemo(() => {
    const map = new Map<string, MonthGroup>();
    weeks.forEach((wk, i) => {
      wk.days.forEach((count, j) => {
        const date = new Date(wk.w * 1000 + j * DAY_MS);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!map.has(key)) {
          map.set(key, {
            key,
            label: date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
            days: [],
          });
        }
        map.get(key)!.days.push({ key: `${i}-${j}`, date, count });
      });
    });
    return Array.from(map.values());
  }, [weeks]);

  const [monthIndex, setMonthIndex] = useState(0);
  useEffect(() => {
    if (months.length) setMonthIndex(months.length - 1);
  }, [months.length]);

  const month = months[Math.min(monthIndex, Math.max(0, months.length - 1))];

  const goMonth = (delta: number) => {
    setMonthIndex(prev => Math.min(months.length - 1, Math.max(0, prev + delta)));
    setSelected(null);
    setHover(null);
  };

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: ReactTouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: ReactTouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    goMonth(dx < 0 ? 1 : -1);
  };

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-3 gap-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cobalt">
          {isMobile && status === 'ready' && month ? month.label : 'Commit activity · last 52 weeks'}
        </div>
        <div className="font-mono text-[11px] tabular-nums text-muted-foreground text-right">
          {status === 'ready'
            ? active
              ? `${active.count} commit${active.count === 1 ? '' : 's'} · ${active.label}`
              : `${total} commits`
            : status === 'error' ? 'unavailable' : 'loading…'}
        </div>
      </div>

      {status === 'error' && (
        <p className="text-xs text-muted-foreground">Could not load commit activity{error ? ` — ${error}` : ''}.</p>
      )}

      {status !== 'error' && isMobile && (
        <div
          className="select-none"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {status === 'ready' && month ? (
            <>
              <div className="grid grid-cols-7 gap-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <span key={i} className="text-center">{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: month.days[0].date.getDay() }).map((_, i) => (
                  <span key={`pad-${i}`} />
                ))}
                {month.days.map(d => {
                  const label = dayLabel(d.date);
                  const isSelected = selected?.key === d.key;
                  return (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() =>
                        setSelected(prev => (prev?.key === d.key ? null : { key: d.key, count: d.count, label }))
                      }
                      aria-label={`${d.count} commits on ${label}`}
                      className={`aspect-square w-full rounded-[3px] touch-manipulation transition-transform ${shade[bucket(d.count)]} ${
                        isSelected ? 'scale-[1.12] ring-1 ring-cobalt' : ''
                      }`}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <button
                  type="button"
                  onClick={() => goMonth(-1)}
                  disabled={monthIndex <= 0}
                  className="min-h-[32px] px-2 -ml-2 disabled:opacity-30"
                >
                  ← prev
                </button>
                <span className="tabular-nums">{monthIndex + 1}/{months.length} · swipe</span>
                <button
                  type="button"
                  onClick={() => goMonth(1)}
                  disabled={monthIndex >= months.length - 1}
                  className="min-h-[32px] px-2 -mr-2 disabled:opacity-30"
                >
                  next →
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <span key={i} className="aspect-square w-full rounded-[3px] bg-muted/30 animate-pulse" />
              ))}
            </div>
          )}
        </div>
      )}

      {status !== 'error' && !isMobile && (
        <div className="overflow-x-auto -mx-1 px-1">
          <div
            className="inline-flex gap-[2px]"
            aria-hidden={status !== 'ready'}
            onMouseLeave={() => setHover(null)}
          >
            {(status === 'ready' ? weeks : Array.from({ length: 52 }, () => ({ w: 0, days: [0,0,0,0,0,0,0], total: 0 })))
              .map((wk, i) => (
                <div key={i} className="flex flex-col gap-[2px]">
                  {wk.days.map((d, j) => {
                    const key = `${i}-${j}`;
                    const label = dayLabel(new Date(wk.w * 1000 + j * DAY_MS));
                    const isSelected = selected?.key === key;
                    return (
                      <button
                        key={j}
                        type="button"
                        disabled={status !== 'ready'}
                        onMouseEnter={
                          status === 'ready' ? () => setHover({ count: d, label }) : undefined
                        }
                        onClick={
                          status === 'ready'
                            ? () => setSelected(prev => (prev?.key === key ? null : { key, count: d, label }))
                            : undefined
                        }
                        aria-label={status === 'ready' ? `${d} commits on ${label}` : 'loading'}
                        className={`w-[10px] h-[10px] rounded-[2px] transition-transform ${
                          status === 'ready'
                            ? `${shade[bucket(d)]} hover:scale-[1.6] hover:ring-1 hover:ring-cobalt/60 ${
                                isSelected ? 'scale-[1.6] ring-1 ring-cobalt' : ''
                              }`
                            : 'bg-muted/30 animate-pulse'
                        }`}
                        title={status === 'ready' ? `${d} commits · ${label}` : ''}
                      />
                    );
                  })}
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
