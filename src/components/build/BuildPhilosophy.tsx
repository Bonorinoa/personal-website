import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

const PRINCIPLES = [
  {
    label: 'Design the system first',
    body: 'The design doc with failure modes and metrics of success is a v0 deliverable shipped in the first commit.',
  },
  {
    label: 'Observability is a first-class citizen',
    body: 'Agentic systems are easier to inspect when modeled as State Machines.\u00a0States, transitions, and frozen runs make a system observable.',
  },
  {
    label: 'Open-source by default',
    body: 'Every person should own their intelligence; I strive to build workflows optimized for local AI, design systems that are auditable, and ship public tools for educators and researchers.\u00a0',
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
            A systems mindset
          </h2>
          <div className="space-y-4 max-w-xl text-base leading-relaxed text-foreground/85">
            <p>
              I abstract every workflow into interfaces, feedback loops, and
              decision rules, then let agents handle implementation. That
              division of labor lets me stay upstream — deciding what the system
              is allowed to conclude, how it should explain itself, and what
              would falsify it. A systems mindset is not about drawing boxes; it
              is about making the work inspectable, repeatable, and
              accountable. It makes agentic work productive rather than messy,
              and lets me focus on the object that matters — a user behind a
              product or a question behind a research project.&nbsp;
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
