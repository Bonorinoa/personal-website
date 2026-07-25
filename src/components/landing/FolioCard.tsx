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
      whileHover={isAcademic ? { y: -2 } : { y: -4, rotate: -0.15 }}
      whileTap={{ scale: 0.995 }}
      className="group relative text-left block w-full focus:outline-none focus-visible:ring-1 focus-visible:ring-oxblood"
      aria-label={`Enter ${label}`}
    >
      {/* Folio frame */}
      <div
        className={
          'relative border bg-[hsl(var(--paper))]/60 backdrop-blur-[2px] p-6 sm:p-8 lg:p-10 min-h-[320px] sm:min-h-[380px] flex flex-col justify-between transition-[border-color,background-color,box-shadow] duration-300 ' +
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
            {roman} · {label}
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

        {/* Middle: title */}
        <div className="py-8 sm:py-10">
          {isAcademic ? (
            <>
              <h3 className="font-serif italic text-5xl sm:text-6xl lg:text-7xl leading-[0.92] tracking-tight text-ink">
                {title}
              </h3>
              {/* Engraved rule beneath title — asserts order */}
              <div className="mt-5 flex items-center gap-3">
                <span className="h-px w-10 bg-ink/40" />
                <span className="font-serif italic text-xs text-ink/45">§</span>
                <span className="h-px w-6 bg-ink/25" />
              </div>
              <p className="mt-4 font-serif italic text-sm sm:text-base text-ink/55">
                {preview}
              </p>
            </>
          ) : (
            <>
              <h3 className="font-mono text-4xl sm:text-5xl lg:text-6xl leading-[0.92] tracking-tight text-ink flex items-baseline pt-[0.12em]">
                <span className="text-oxblood/70 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">/</span>
                <span className="whitespace-pre-line">{title}</span>
                <motion.span
                  aria-hidden
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1.05, repeat: Infinity, ease: 'linear' }}
                  className="ml-2 inline-block w-[0.5em] h-[0.9em] bg-oxblood align-baseline opacity-0 group-hover:opacity-100"
                />
              </h3>
              <p className="mt-4 font-mono text-xs sm:text-sm text-ink/55 uppercase tracking-[0.18em]">
                {preview}
              </p>
            </>
          )}
        </div>

        {/* Bottom: meta + animated rule */}
        <div>
          <motion.div
            initial={false}
            animate={{ width: dimmed ? '1.5rem' : '4rem' }}
            transition={{ duration: 0.32, ease: EASE }}
            className={
              'h-px mb-3 transition-[width] ' +
              (isAcademic
                ? 'bg-oxblood group-hover:!w-24'
                : 'bg-oxblood group-hover:!w-32')
            }
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
            {meta}
          </span>
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
