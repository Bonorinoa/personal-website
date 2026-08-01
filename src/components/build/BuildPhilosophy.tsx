import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

const PRINCIPLES = [
  {
    label: 'Systems over parts',
    body: 'A faster agent moves the bottleneck; it rarely removes it. Design for wherever it lands next.',
  },
  {
    label: 'Observable by default',
    body: "If I can't see what a step did, I don't trust it, no matter how good the output looks.",
  },
  {
    label: 'Cheap to reject',
    body: "Scope the work so throwing it out costs nothing. That's what makes it safe to let an agent run.",
  },
];

export const BuildPhilosophy = () => {
  const reduce = useReducedMotion();

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: EASE }}
      className="mb-14 sm:mb-20"
      aria-labelledby="how-i-work"
    >
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cobalt mb-5 sm:mb-6">
        02 / How I work
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-7">
          <h2
            id="how-i-work"
            className="font-mono text-2xl sm:text-3xl leading-[1.15] tracking-tight font-medium mb-5"
          >
            Most AI work is reductionist.
          </h2>
          <div className="space-y-4 max-w-xl text-base leading-relaxed text-foreground/85">
            <p>
              You shrink a task until a model can do it, then call the shrinking
              progress. That works fine for a function. It&apos;s a bad way to think
              about a research pipeline, a classroom, or an economy.
            </p>
            <p>
              What I actually care about is what happens to the whole system when
              one part gets ten times faster. Usually the bottleneck doesn&apos;t
              disappear, it just moves somewhere less visible. In my own work it
              moved from writing code to reading it.
            </p>
            <p>
              So I build the parts so I can see them: small, logged, replaceable,
              and cheap to throw away when they&apos;re wrong. That&apos;s the whole
              method. It has outlived every model I&apos;ve used it with.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">
            Principles
          </div>
          <ul className="hairline-t">
            {PRINCIPLES.map((p, i) => (
              <li key={p.label} className="hairline-b py-4">
                <div className="flex gap-3">
                  <span className="font-mono text-[11px] text-cobalt pt-[3px] shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="font-mono text-sm text-foreground mb-1">
                      {p.label}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.section>
  );
};
