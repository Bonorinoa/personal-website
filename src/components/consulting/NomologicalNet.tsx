import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NODES, type ConsultingNode } from '@/data/consulting';

function nodeById(id: ConsultingNode['id']) {
  return NODES.find((node) => node.id === id) ?? NODES[1];
}

export function NomologicalNet() {
  const [active, setActive] = useState<ConsultingNode['id']>('02');
  const current = nodeById(active);

  if (!current) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(290px,.86fr)_1.14fr] border border-[hsl(var(--rule))] rounded-[2px] overflow-hidden">
      <div className="bg-[hsl(var(--paper-deep))] px-5 py-6 sm:px-7 sm:py-8 md:border-r border-b md:border-b-0 border-[hsl(var(--rule))]">
        <div role="list" aria-label="Empirical research stages">
          {NODES.map((node, index) => {
          const isActive = node.id === active;
          return (
            <div key={node.id} role="listitem">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setActive(node.id)}
                aria-pressed={isActive}
                className={`h-auto min-h-[92px] w-full justify-start whitespace-normal rounded-[2px] border bg-[hsl(var(--paper))] px-4 py-3 text-left hover:bg-[hsl(var(--paper))] hover:text-foreground focus-visible:ring-[hsl(var(--oxblood))] ${
                  isActive
                    ? 'border-[hsl(var(--oxblood))] opacity-100 shadow-[5px_5px_0_0_hsl(var(--oxblood)/0.16)]'
                    : 'border-[hsl(var(--rule))] opacity-50 hover:opacity-75'
                }`}
              >
                <span className="grid w-full grid-cols-[2rem_1fr] gap-x-3">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-[hsl(var(--oxblood))]">
                    {node.id}
                  </span>
                  <span>
                    <span className="block font-serif text-[18px] font-medium leading-none">{node.title}</span>
                    <span className="mt-2 block font-serif text-[13px] font-normal leading-snug text-[hsl(var(--muted-ink))]">
                      {node.scope}
                    </span>
                  </span>
                </span>
              </Button>
              {index < NODES.length - 1 && (
                <div className="pipeline-connector" aria-hidden="true">
                  <span className={`pipeline-glint ${index === 1 ? 'pipeline-glint-late' : ''}`} />
                </div>
              )}
            </div>
          );
          })}
        </div>
      </div>

      <div className="flex min-h-[410px] items-center bg-[hsl(var(--paper))] p-6 sm:p-9 lg:p-12 md:min-h-[460px]">
          <div className="w-full" aria-live="polite">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--oxblood))]">
              {current.id} · {current.title}
            </div>
            <h2 className="mt-4 max-w-[18ch] font-serif text-2xl sm:text-[28px] font-medium leading-tight">
              {current.question}
            </h2>
            <p className="mt-5 max-w-[56ch] font-serif text-[15px] leading-relaxed text-foreground/85">
              {current.body}
            </p>
            <p className="mt-5 max-w-[56ch] font-serif text-[15px] leading-relaxed text-foreground/85">
              <strong className="font-semibold">The reduction:</strong> {current.reduction}
            </p>
            {current.links.length > 0 && (
              <div className="mt-7 border-t border-[hsl(var(--rule))] pt-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--muted-ink))]">Evidence</div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                  {current.links.map((link) =>
                    link.href ? (
                      <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="font-serif text-[14px] text-[hsl(var(--oxblood))] underline decoration-[hsl(var(--oxblood)/0.35)] underline-offset-4 hover:decoration-[hsl(var(--oxblood))]">
                        {link.label}
                      </a>
                    ) : (
                      <span key={link.label} className="font-serif text-[14px] italic text-[hsl(var(--muted-ink))]">{link.label}</span>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
