import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Liquid-glass pill toggle for switching between Research (Academic) and Build modes.
 * Uses backdrop-blur, layered highlights, and a motion-shared thumb for the slide.
 */
export function ModeToggle() {
  const { pathname } = useLocation();
  const active: 'academic' | 'build' =
    pathname.startsWith('/build') ? 'build' : 'academic';

  const options: Array<{ key: 'academic' | 'build'; to: string; label: string; font: string }> = [
    { key: 'academic', to: '/academic', label: 'Research', font: 'font-serif italic' },
    { key: 'build', to: '/build', label: 'Build', font: 'font-mono tracking-[0.14em] uppercase text-[11px]' },
  ];

  return (
    <div
      className="relative inline-flex items-center rounded-full p-1 isolate
                 bg-foreground/[0.04]
                 shadow-[inset_0_1px_0_hsl(var(--background)/0.6),inset_0_-1px_2px_hsl(var(--foreground)/0.06),0_1px_2px_hsl(var(--foreground)/0.04)]
                 backdrop-blur-xl backdrop-saturate-150
                 ring-1 ring-foreground/10"
      role="tablist"
      aria-label="Site mode"
    >
      {/* Specular highlight overlay */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full overflow-hidden"
      >
        <span className="absolute inset-x-2 top-0 h-1/2 rounded-full bg-gradient-to-b from-background/50 to-transparent opacity-70" />
        <span className="absolute inset-x-6 bottom-0 h-1/3 rounded-full bg-gradient-to-t from-foreground/[0.04] to-transparent" />
      </span>

      {options.map((opt) => {
        const isActive = active === opt.key;
        return (
          <Link
            key={opt.key}
            to={opt.to}
            role="tab"
            aria-selected={isActive}
            className="relative z-10 px-4 sm:px-5 h-8 inline-flex items-center justify-center text-[13px] leading-none"
          >
            {isActive && (
              <motion.span
                layoutId="mode-toggle-thumb"
                transition={{ type: 'spring', stiffness: 380, damping: 32, mass: 0.7 }}
                className="absolute inset-0 rounded-full
                           bg-background/70
                           shadow-[inset_0_1px_0_hsl(var(--background)),inset_0_-1px_1px_hsl(var(--foreground)/0.08),0_4px_14px_-4px_hsl(var(--foreground)/0.18),0_1px_2px_hsl(var(--foreground)/0.08)]
                           ring-1 ring-foreground/10
                           backdrop-blur-md"
              >
                {/* Thumb sheen */}
                <span
                  aria-hidden
                  className="absolute inset-x-1 top-[1px] h-1/2 rounded-full bg-gradient-to-b from-background to-transparent opacity-80"
                />
              </motion.span>
            )}
            <span
              className={`relative ${opt.font} transition-colors ${
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
              }`}
            >
              {opt.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
