import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

interface FolioCardProps {
  kind: 'academic' | 'build';
  label: string;
  title: string;
  preview: string;
  onSelect: () => void;
  onHover: (k: 'academic' | 'build' | null) => void;
  dimmed: boolean;
}

export function FolioCard({
  kind,
  label,
  title,
  preview,
  onSelect,
  onHover,
  dimmed,
}: FolioCardProps) {
  const isAcademic = kind === 'academic';
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => onHover(kind)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(kind)}
      onBlur={() => onHover(null)}
      animate={{ opacity: dimmed ? 0.5 : 1 }}
      transition={{ duration: 0.32, ease: EASE }}
      whileHover={isAcademic ? { y: -2 } : { y: -4, rotate: -0.15 }}
      whileTap={{ scale: 0.995 }}
      className="group relative text-left block w-full md:h-full focus:outline-none focus-visible:ring-1 focus-visible:ring-oxblood"
      aria-label={`Enter ${label}`}
    >
      {/* Folio frame */}
      <div
        className={
          'relative overflow-hidden border bg-[hsl(var(--paper))]/60 backdrop-blur-[2px] p-5 sm:p-7 lg:p-8 min-h-[240px] sm:min-h-[280px] md:h-full flex flex-col justify-between transition-[border-color,background-color,box-shadow] duration-300 ' +
          (isAcademic
            ? 'border-ink/25 group-hover:border-ink/60 group-hover:bg-[hsl(var(--paper))]/90'
            : 'border-ink/25 group-hover:border-oxblood/70 group-hover:bg-[hsl(var(--paper))]/85 group-hover:shadow-[6px_6px_0_0_hsl(var(--oxblood)/0.18)]')
        }
      >
        {/* Corner ticks — printer's marks */}
        <Ticks animated={!isAcademic} />

        {/* Top: roman + arrow */}
        <div className="flex items-start justify-between">
          <span
            className={
              'font-mono text-[10px] uppercase tracking-[0.28em] text-ink/55 ' +
              (isAcademic ? '' : 'group-hover:text-oxblood transition-colors')
            }
          >
            {label}
          </span>
          <motion.span
            initial={false}
            animate={{ x: 0, y: 0 }}
            whileHover={{}}
            className={
              'transition-colors ' +
              (isAcademic
                ? 'text-ink/40 group-hover:text-oxblood'
                : 'text-ink/50 group-hover:text-oxblood group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform')
            }
          >
            <ArrowUpRight className="w-4 h-4" strokeWidth={isAcademic ? 1.25 : 1.75} />
          </motion.span>
        </div>

        {/* Bottom-anchored stack — identical rows in both cards so baselines align */}
        <div className="mt-auto">
          {/* Row 1: title — fixed height, content sits on a shared baseline */}
          <div className="flex items-end min-h-[3.25rem] sm:min-h-[4rem] lg:min-h-[4.5rem]">
            {isAcademic ? (
              <h3 className="relative inline-block font-serif italic text-4xl sm:text-5xl lg:text-6xl leading-[0.82] tracking-tight text-ink">
                {title}
                {/* Calligraphic signature flourish — draws itself on hover */}
                <svg
                  aria-hidden
                  viewBox="0 0 220 40"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute left-0 right-0 -bottom-3 w-full h-5 overflow-visible"
                >
                  <path
                    d="M4 22 C 40 6, 80 34, 120 18 S 200 10, 216 26"
                    fill="none"
                    stroke="hsl(var(--oxblood))"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    className="folio-sign"
                  />
                </svg>
              </h3>
            ) : (
              <h3 className="relative font-mono text-[2.25rem] sm:text-[2.9rem] lg:text-[3.5rem] leading-[0.82] tracking-tight text-ink">
                {/* Decorations positioned absolutely so they never affect resting layout */}
                <span
                  aria-hidden
                  className="absolute right-full mr-0 top-0 text-oxblood/70 opacity-0 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"
                >
                  /
                </span>
                <span className="whitespace-pre-line">{title}</span>
                <span
                  aria-hidden
                  className="absolute left-full ml-1.5 top-[0.05em] inline-block w-[0.5em] h-[0.85em] bg-oxblood opacity-0 group-hover:opacity-100 group-hover:cursor-blink"
                />
              </h3>
            )}
          </div>

          {/* Row 2: divider — same height in both, different mark */}
          <div className="mt-5 h-4 flex items-center gap-3">
            {isAcademic ? (
              <>
                <span className="h-px w-10 bg-ink/40" />
                <span className="font-serif italic text-xs text-ink/45 leading-none">§</span>
                <span className="h-px w-6 bg-ink/25" />
              </>
            ) : (
              <>
                <span className="h-px w-10 bg-ink/40" />
                <span className="flex items-center gap-[3px]" aria-hidden>
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-px h-2 bg-ink/40 group-hover:bg-oxblood/70 transition-colors" />
                  ))}
                </span>
                <span className="h-px w-6 bg-ink/25" />
              </>
            )}
          </div>

          {/* Row 3: caption — fixed height so the footer rule aligns */}
          <p
            className={
              'mt-3 min-h-[2.5rem] ' +
              (isAcademic
                ? 'font-serif italic text-sm sm:text-base text-ink/55 leading-relaxed'
                : 'font-mono text-xs sm:text-sm text-ink/55 uppercase tracking-[0.18em] leading-relaxed')
            }
          >
            {preview}
          </p>

          {/* Row 4: animated rule */}
          <motion.div
            initial={false}
            animate={{ width: dimmed ? '1.5rem' : '4rem' }}
            transition={{ duration: 0.32, ease: EASE }}
            className={
              'h-px mt-2 transition-[width] ' +
              (isAcademic
                ? 'bg-oxblood group-hover:!w-24'
                : 'bg-oxblood group-hover:!w-32')
            }
          />
        </div>

      </div>
    </motion.button>
  );
}

function Ticks({ animated = false }: { animated?: boolean }) {
  const t = 'absolute w-2.5 h-px bg-ink/40 transition-colors';
  const v = 'absolute w-px h-2.5 bg-ink/40 transition-colors';
  const hoverColor = animated ? 'group-hover:bg-oxblood/80' : '';
  return (
    <>
      <span className={`${t} top-0 left-0 ${hoverColor}`} />
      <span className={`${v} top-0 left-0 ${hoverColor}`} />
      <span className={`${t} top-0 right-0 ${hoverColor}`} />
      <span className={`${v} top-0 right-0 ${hoverColor}`} />
      <span className={`${t} bottom-0 left-0 ${hoverColor}`} />
      <span className={`${v} bottom-0 left-0 ${hoverColor}`} />
      <span className={`${t} bottom-0 right-0 ${hoverColor}`} />
      <span className={`${v} bottom-0 right-0 ${hoverColor}`} />
    </>
  );
}
