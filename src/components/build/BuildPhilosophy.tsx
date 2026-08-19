import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

const PRINCIPLES = [
  {
    label: 'Design the system first',
    body: 'Interfaces, failure modes, and what "done" means are settled before code is written. The design doc is a deliverable, not a warm-up.',
  },
  {
    label: 'Observability is a first-class citizen',
    body: 'Every system can report what it is doing while it runs and explain itself afterwards. Logs and decision trails ship with the deliverable.',
  },
  {
    label: 'Open-source by default',
    body: 'Code, data, and write-ups ship together. If something stays private, it has to explain why.',
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
            I keep looking at the whole system.
          </h2>
          <div className="space-y-4 max-w-xl text-base leading-relaxed text-foreground/85">
            <p>
              Modern science leans reductionist, and for good reason: breaking a
              hard problem into tractable pieces is how most of the last century&apos;s
              progress happened. The cost is that the interesting behaviour usually
              lives in how the pieces interact, and that part gets assumed away.
            </p>
            <p>
              I&apos;ve always been pulled toward the bigger picture — the economy
              behind the model, the system behind the software. That means favouring
              general knowledge over deep specialisation, which used to be a bad
              trade. Specialists had the tools.
            </p>
            <p>
              I think AI changes that trade. A lot of reductionism was a budget
              constraint: proxies because the real variable was unmeasurable,
              pre-specified questions because exploration was expensive. Less of that
              binds now. So the work is to actually go after the messy questions —
              and to build things I can see into, because complex systems punish you
              for guessing.
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
