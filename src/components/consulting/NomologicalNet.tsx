import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { NODES, EDGES, type ConsultingNode } from '@/data/consulting';

const EASE = [0.16, 1, 0.3, 1] as const;

function nodeById(id: ConsultingNode['id']) {
  return NODES.find((n) => n.id === id)!;
}

export function NomologicalNet() {
  const [active, setActive] = useState<ConsultingNode['id']>('01');
  const reduce = useReducedMotion();
  const current = nodeById(active);

  const dur = reduce ? 0 : 0.32;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(280px,0.85fr)_1.15fr] border border-[hsl(var(--rule))] md:min-h-[420px]">
      {/* Net pane */}
      <div className="relative min-h-[300px] md:min-h-[420px] bg-[hsl(var(--paper-deep))] border-b md:border-b-0 md:border-r border-[hsl(var(--rule))] overflow-hidden">
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {EDGES.map(([a, b]) => {
            const na = nodeById(a);
            const nb = nodeById(b);
            const incident = a === active || b === active;
            return (
              <line
                key={`${a}-${b}`}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke={`hsl(var(--oxblood) / ${incident ? 0.55 : 0.22})`}
                strokeWidth={1.1}
                vectorEffect="non-scaling-stroke"
                style={{ transition: reduce ? 'none' : 'stroke var(--dur) var(--ease-out)' }}
              />
            );
          })}
        </svg>

        {NODES.map((node) => {
          const isActive = node.id === active;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setActive(node.id)}
              aria-current={isActive ? 'true' : undefined}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-left bg-[hsl(var(--paper))] px-3 py-2 sm:px-4 sm:py-3 border"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                borderColor: isActive ? 'hsl(var(--oxblood))' : 'hsl(var(--rule))',
                boxShadow: isActive ? '6px 6px 0 0 hsl(var(--oxblood) / 0.16)' : 'none',
                opacity: isActive ? 1 : 0.72,
                transform: `translate(-50%, -50%) scale(${isActive ? 1.04 : 1})`,
                transition: reduce
                  ? 'none'
                  : 'transform var(--dur) var(--ease-out), opacity var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)',
                borderRadius: 2,
                minWidth: node.lead ? 148 : 132,
              }}
            >
              <span className="block font-mono text-[11px] tracking-[0.14em] text-[hsl(var(--oxblood))]">
                {node.id}
              </span>
              <span className="block whitespace-nowrap font-serif text-[15px] sm:text-base font-medium leading-snug mt-0.5">
                {node.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div className="bg-[hsl(var(--paper))] p-6 sm:p-8 lg:p-10 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: dur, ease: EASE }}
            className="w-full"
          >
            <div className="font-mono text-[11px] tracking-[0.22em] text-[hsl(var(--oxblood))]">
              {current.id}
            </div>
            <h2 className="mt-3 font-serif text-xl sm:text-2xl font-medium leading-snug tracking-tight">
              {current.question}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground/85 max-w-prose">
              {current.body}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {current.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="text-[14px] text-[hsl(var(--oxblood))] underline underline-offset-4 decoration-[hsl(var(--oxblood)/0.4)] hover:decoration-[hsl(var(--oxblood))]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
