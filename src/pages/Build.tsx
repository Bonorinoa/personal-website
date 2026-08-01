import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useMode } from '@/hooks/useMode';
import { useWorld } from '@/hooks/useWorld';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { TagLegend } from '@/components/build/TagLegend';
import { ProjectGrid } from '@/components/build/ProjectGrid';
import { LastSynced } from '@/components/build/LastSynced';
import { BuildPhilosophy } from '@/components/build/BuildPhilosophy';
import { WorkspaceStrip } from '@/components/build/WorkspaceStrip';

import { getBuildArtifacts, filterByTag, sortByDate } from '@/lib/artifacts';
import type { CollaborationTag } from '@/data/types';

const EASE = [0.16, 1, 0.3, 1] as const;

const Build = () => {
  const { mode, setMode, isLoading } = useMode();
  useWorld('build');
  const [activeTag, setActiveTag] = useState<CollaborationTag | null>(null);

  useEffect(() => {
    if (!isLoading && mode !== 'build') setMode('build');
  }, [isLoading, mode, setMode]);

  const all = sortByDate(getBuildArtifacts());
  const filtered = filterByTag(all, activeTag);

  return (
    <>
      <Helmet>
        <title>Build — Augusto González-Bonorino</title>
        <meta
          name="description"
          content="Research tools, teaching software, and experiments by Augusto González-Bonorino, with live commit history pulled from GitHub."
        />
        <link rel="canonical" href="/build" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-8">
          {/* Top label */}
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cobalt mb-6">
            Build / portfolio
          </div>

          {/* Hero */}
          <motion.header
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 mb-12 sm:mb-16"
          >
            <div className="lg:col-span-2">
              <h1 className="font-mono text-4xl sm:text-5xl md:text-7xl leading-[1.05] tracking-tight font-medium">
                Things I&apos;ve<br />built.
              </h1>
              <p className="mt-6 text-base leading-relaxed text-foreground/85 max-w-xl">
                A working portfolio of research tools, experiments, and shipped
                projects. Each one is tagged with an honest human/AI collaboration
                ratio — not for credit, for clarity about how modern work gets done.
              </p>
            </div>

            {/* Workspaces sidebar */}
            <aside className="pt-6 hairline-t lg:pt-0 lg:pl-6 lg:border-t-0 lg:border-l lg:border-border">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-cobalt mb-3">
                Method note
              </div>
              <h2 className="font-serif text-xl mb-3 leading-snug">
                Verifiable signals, not self-reports.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Each card pulls live data from GitHub — languages, stars, last commit,
                and a commit heatmap. Hover the sparkline for weekly counts; click a
                card for the full breakdown.
              </p>

              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
                Workspaces
              </div>
              <ul className="grid grid-cols-1 gap-2">
                {[
                  { key: 'Personal', desc: 'leanecon-v3 et al.', url: 'https://github.com/Bonorinoa' },
                  { key: 'EconLLM-Lab', desc: 'cultural alignment & open-source tooling', url: 'https://github.com/orgs/EconLLM-Lab/repositories' },
                  { key: 'Perwell', desc: 'wellbeing × AI', url: 'https://github.com/orgs/Perwell/repositories' },
                  { key: 'Cognitio-EDU', desc: 'teaching & learning technology', url: 'https://github.com/orgs/Cognitio-EDU/repositories' },
                ].map((w) => (
                  <li key={w.key}>
                    <a
                      href={w.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block hairline border border-border bg-background hover:bg-foreground/[0.02] hover:border-cobalt/50 transition-colors px-3 py-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs text-foreground">
                          <span className="text-cobalt">/</span> {w.key}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground group-hover:text-cobalt transition-colors">
                          github ↗
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground leading-snug">
                        {w.desc}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>

            </aside>
          </motion.header>

          {/* Filter bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
            <TagLegend activeTag={activeTag} onTagSelect={setActiveTag} />
            <LastSynced />
          </div>


          {/* Project grid */}
          {filtered.length > 0 ? (
            <section className="mb-16 sm:mb-20">
              <ProjectGrid artifacts={filtered} />
            </section>
          ) : (
            <div className="text-center py-20 hairline-b">
              <p className="text-muted-foreground text-sm">
                No projects match the selected filter.
              </p>
              <button
                onClick={() => setActiveTag(null)}
                className="mt-3 link-cobalt font-mono text-xs uppercase tracking-[0.14em] min-h-[44px] px-3"
              >
                ← clear filter
              </button>
            </div>
          )}

        </main>

        <Footer />
      </div>
    </>
  );
};

export default Build;
