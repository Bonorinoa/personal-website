import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

interface FolioCardProps {
  kind: 'academic' | 'build';
  label: string;
  roman: string;
  title: string;
  preview: string;
  meta: string;
  onSelect: () => void;
  onHover: (k: 'academic' | 'build' | null) => void;
  dimmed: boolean;
}

export function FolioCard({
  kind,
  label,
  roman,
  title,
  preview,
  meta,
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
      whileHover={{ y: -3 }}
      className="group relative text-left block w-full focus:outline-none focus-visible:ring-1 focus-visible:ring-oxblood"
      aria-label={`Enter ${label}`}
    >
      {/* Folio frame */}
      <div className="relative border border-ink/25 bg-[hsl(var(--paper))]/60 backdrop-blur-[2px] p-6 sm:p-8 lg:p-10 min-h-[320px] sm:min-h-[380px] flex flex-col justify-between transition-[border-color,background-color] duration-300 group-hover:border-ink/55 group-hover:bg-[hsl(var(--paper))]/85">
        {/* Corner ticks — printer's marks */}
        <Ticks />

        {/* Top: roman + arrow */}
        <div className="flex items-start justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink/55">
            {roman} · {label}
          </span>
          <motion.span
            animate={{ x: dimmed ? 0 : 0 }}
            className="text-ink/40 group-hover:text-oxblood transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" strokeWidth={1.25} />
          </motion.span>
        </div>

        {/* Middle: title */}
        <div className="py-8 sm:py-10">
          <h3
            className={
              isAcademic
                ? 'font-serif italic text-5xl sm:text-6xl lg:text-7xl leading-[0.92] tracking-tight text-ink'
                : 'font-mono text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight text-ink'
            }
          >
            {title}
          </h3>
          <p
            className={
              isAcademic
                ? 'mt-4 font-serif italic text-sm sm:text-base text-ink/55'
                : 'mt-4 font-mono text-xs sm:text-sm text-ink/55 uppercase tracking-[0.18em]'
            }
          >
            {preview}
          </p>
        </div>

        {/* Bottom: meta + animated rule */}
        <div>
          <motion.div
            initial={false}
            animate={{ width: dimmed ? '1.5rem' : '4rem' }}
            transition={{ duration: 0.32, ease: EASE }}
            className="h-px bg-oxblood mb-3 group-hover:!w-24 transition-[width]"
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
            {meta}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function Ticks() {
  const t = 'absolute w-2.5 h-px bg-ink/40';
  const v = 'absolute w-px h-2.5 bg-ink/40';
  return (
    <>
      <span className={`${t} top-0 left-0`} />
      <span className={`${v} top-0 left-0`} />
      <span className={`${t} top-0 right-0`} />
      <span className={`${v} top-0 right-0`} />
      <span className={`${t} bottom-0 left-0`} />
      <span className={`${v} bottom-0 left-0`} />
      <span className={`${t} bottom-0 right-0`} />
      <span className={`${v} bottom-0 right-0`} />
    </>
  );
}
