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
  const software = filtered.filter((a) => a.category !== 'research');
  const research = filtered.filter((a) => a.category === 'research');

  return (
    <>
      <Helmet>
        <title>Portfolio — Augusto González-Bonorino</title>
        <meta
          name="description"
          content="Software and research systems built by Augusto González-Bonorino, with live commit history and provenance pulled from GitHub."
        />
        <link rel="canonical" href="/build" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-8">
          {/* Top label */}
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cobalt mb-6">
            01 / Portfolio
          </div>


          {/* Hero */}
          <motion.header
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-14 sm:mb-20"
          >
            <h1 className="font-mono text-4xl sm:text-5xl md:text-7xl leading-[1.05] tracking-tight font-medium">
              Things I&apos;ve<br />built.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-foreground/85 max-w-xl">
              Research tools, teaching software, and experiments. Most of it built
              with agents, all of it under version control. The commit history sits
              on each card, so you can check the shape of the work yourself instead
              of taking my word for it.
            </p>
          </motion.header>

          {/* Philosophy */}
          <BuildPhilosophy />
          <WorkspaceStrip />

          {/* Selected projects */}
          <section className="mt-16 sm:mt-24 mb-16 sm:mb-20" aria-labelledby="software-projects">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cobalt mb-5 sm:mb-6">
              03 / Software
            </div>
            <h2 id="software-projects" className="sr-only">
              Software
            </h2>

            {/* Filter bar */}
            <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
              <TagLegend activeTag={activeTag} onTagSelect={setActiveTag} />
              <LastSynced />
            </div>

            {software.length > 0 ? (
              <ProjectGrid artifacts={software} />
            ) : (
              <p className="py-12 text-sm text-muted-foreground">
                No software projects match the selected filter.
              </p>
            )}
          </section>

          <section className="mb-16 sm:mb-20" aria-labelledby="research-projects">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cobalt mb-5 sm:mb-6">
              04 / Research
            </div>
            <h2 id="research-projects" className="sr-only">
              Research
            </h2>

            {research.length > 0 ? (
              <ProjectGrid artifacts={research} />
            ) : (
              <p className="py-12 text-sm text-muted-foreground">
                No research projects match the selected filter.
              </p>
            )}

            {filtered.length === 0 && (
              <button
                onClick={() => setActiveTag(null)}
                className="mt-3 link-cobalt font-mono text-xs uppercase tracking-[0.14em] min-h-[44px] px-3"
              >
                ← clear filter
              </button>
            )}

            {/* Legend */}
            <div className="mt-10 sm:mt-12 pt-6 hairline-t max-w-2xl">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
                What you&apos;re looking at
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every card pulls live from GitHub: languages, stars, the last commit,
                and a commit heatmap. Hover the sparkline for weekly counts, or click
                a card for the full history. Where an agent account is a formal
                contributor, the human/agent commit split is shown too.
              </p>
            </div>
          </section>



        </main>

        <Footer />
      </div>
    </>
  );
};

export default Build;
