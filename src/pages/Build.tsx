import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useMode } from '@/hooks/useMode';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { TagLegend } from '@/components/build/TagLegend';
import { BentoGrid } from '@/components/build/BentoGrid';
import { AggregateMatrix } from '@/components/build/AggregateMatrix';
import { getBuildArtifacts, filterByTag, sortByDate } from '@/lib/artifacts';
import type { CollaborationTag } from '@/data/types';

const EASE = [0.16, 1, 0.3, 1] as const;

const Build = () => {
  const { mode, setMode, isLoading } = useMode();
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
          content="Projects, tools, and experiments by Augusto González-Bonorino, with transparent human/AI collaboration breakdowns."
        />
        <link rel="canonical" href="/build" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-8">
          {/* Top label */}
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cobalt mb-6">
            Build / portfolio
          </div>

          {/* Hero */}
          <motion.header
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16"
          >
            <div className="lg:col-span-2">
              <h1 className="font-mono text-5xl md:text-7xl leading-[1.05] tracking-tight font-medium">
                Things I&apos;ve<br />built.
              </h1>
              <p className="mt-6 text-base leading-relaxed text-foreground/85 max-w-xl">
                A working portfolio of research tools, experiments, and shipped
                projects. Each one is tagged with an honest human/AI collaboration
                ratio — not for credit, for clarity about how modern work gets done.
              </p>
            </div>

            {/* Permanent collaboration principles sidebar */}
            <aside className="hairline-l pl-6 lg:border-l">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-cobalt mb-3">
                Method note
              </div>
              <h2 className="font-serif text-xl mb-3 leading-snug">
                AI–Human collaboration, in the open.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Tags indicate the rough split between human direction and AI
                execution per project. The matrix below aggregates which models
                did which classes of work, across everything shown.
              </p>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
                Workspaces
              </div>
              <ul className="text-xs font-mono space-y-1 text-foreground/80">
                <li><span className="text-cobalt">/</span> Personal — leanecon-v3 et al.</li>
                <li><span className="text-cobalt">/</span> EconLLM-Lab — research tooling</li>
                <li><span className="text-cobalt">/</span> Perwell — wellbeing × AI</li>
                <li><span className="text-cobalt">/</span> Cognitio-EDU — teaching</li>
              </ul>
            </aside>
          </motion.header>

          {/* Filter bar */}
          <TagLegend activeTag={activeTag} onTagSelect={setActiveTag} />

          {/* Bento grid */}
          {filtered.length > 0 ? (
            <section className="mb-20 -mx-px hairline">
              <BentoGrid artifacts={filtered} />
            </section>
          ) : (
            <div className="text-center py-20 hairline-b">
              <p className="text-muted-foreground text-sm">
                No projects match the selected filter.
              </p>
              <button
                onClick={() => setActiveTag(null)}
                className="mt-3 link-cobalt font-mono text-xs uppercase tracking-[0.14em]"
              >
                ← clear filter
              </button>
            </div>
          )}

          {/* Aggregate matrix */}
          <section className="mb-12">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cobalt mb-6">
              Provenance / aggregate matrix
            </div>
            <AggregateMatrix />
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Build;
