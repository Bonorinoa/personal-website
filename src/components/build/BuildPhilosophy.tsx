import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

const PRINCIPLES = [
  {
    label: 'Design the system first',
    body: 'The design doc with failure modes and metrics of success are a v0 deliverable shipped in the first commit.',
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
              I&apos;ve always been pulled toward the whole — the economy behind
              the model, the assumptions behind the measure, the design behind the
              number. The behavior that matters usually emerges from how the
              pieces relate, not from any piece in isolation. A systems mindset
              lets me abstract my workflows into clear interfaces, feedback
              loops, and decision rules, which is exactly what makes collaboration
              with AI agents productive rather than chaotic.
            </p>
            <p>
              Agents write most of the code I ship. It sounds like I am
              automating myself out of a job, but in reality my job moves
              upstream: less implementation, more deciding what the system is
              allowed to conclude. I set the constraints, define the
              observability standards, and design the evaluation experiments;
              the agents implement against that specification. This workflow
              let&apos;s me focus on the objects that matter, a user behind a
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
