import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

const PRINCIPLES = [
  {
    label: 'Design the system first',
    body: 'Interfaces, failure modes, and what "done" means are settled before code is written. The design doc is a v0 deliverable.',
  },
  {
    label: 'Observability is a first-class citizen',
    body: 'Treat every system as a state machine: named states, logged transitions, frozen runs, and clear task allocations. The record of traces enables precise budget tracking and empowers decision-making.',
  },
  {
    label: 'Open-source by default',
    body: 'Every person should own their intelligence; I strive to build workflows optimized for local AI, design systems that are auditable, and ship public tools for educators and researchers. .  ',
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
            I design the system, not just the result.
          </h2>
          <div className="space-y-4 max-w-xl text-base leading-relaxed text-foreground/85">
            <p>
              Agents write most of the code I ship. That moves my job upstream:
              less typing, more deciding what the system is allowed to conclude.
              I set the interfaces, the failure modes, and the gates; my agent
              implements against that specification and commits under its own
              GitHub account, so the split is in the record rather than in a
              claim I make about myself.
            </p>
            <p>
              It also makes the systems view affordable. I&apos;ve always been
              pulled toward the whole — the economy behind the model, the
              pipeline behind the number — because the interesting behaviour
              lives in how the pieces interact. Component-level speed is worth
              little if nobody is checking the joins.
            </p>
            <p>
              So the apparatus is the deliverable, not a by-product of it: a
              formalizer that only says VERIFIED when a kernel agrees, an
              estimator that returns an empty set when theory rejects every
              candidate measure, a protocol that names the results that would
              sink it before the experiment runs. The repositories below are
              those systems, built to be inspected.
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
