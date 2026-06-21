import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useMode, type Mode } from '@/hooks/useMode';
import { useWorld } from '@/hooks/useWorld';
import { InkTrail } from '@/components/landing/InkTrail';
import { FolioCard } from '@/components/landing/FolioCard';
import { Flourish } from '@/components/landing/Flourish';
import { getAcademicArtifacts, getBuildArtifacts } from '@/lib/artifacts';

const EASE = [0.16, 1, 0.3, 1] as const;

const Index = () => {
  useWorld(null); // shared editorial cream
  const [hovered, setHovered] = useState<Mode | null>(null);
  const { setMode } = useMode();
  const navigate = useNavigate();

  const academicCount = getAcademicArtifacts().filter(
    (a) => a.section === 'publications' || a.section === 'experience'
  ).length;
  const buildCount = getBuildArtifacts().length;

  const handleSelect = (m: Mode) => {
    setMode(m);
    navigate(`/${m}`);
  };

  return (
    <>
      <Helmet>
        <title>Augusto González-Bonorino — Economist & Builder</title>
        <meta
          name="description"
          content="Personal site of Augusto González-Bonorino — economist, builder, writer on language models. An editorial atelier in two volumes: Research and Build."
        />
        <link rel="canonical" href="/" />
      </Helmet>

      <div className="relative min-h-screen overflow-hidden paper-grain text-ink">
        {/* Background layers */}
        <div className="absolute inset-0 baseline-grid opacity-60 pointer-events-none" aria-hidden />
        <InkTrail />

        {/* Top-right ornament */}
        <Flourish className="absolute top-6 right-6 sm:top-10 sm:right-10 w-24 sm:w-32 text-oxblood/70 z-10 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header strip */}
          <header className="px-5 sm:px-10 lg:px-16 pt-6 sm:pt-8">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-ink/55 font-mono">
              <span>AGB &middot; MMXXVI</span>
              <span className="hidden sm:inline">Tempe / Tucumán</span>
            </div>
            <div className="mt-5 h-px bg-ink/25" />
          </header>

          {/* Hero */}
          <section className="px-5 sm:px-10 lg:px-16 pt-10 sm:pt-16 pb-10 sm:pb-14">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="max-w-5xl"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-oxblood mb-5 sm:mb-7">
                A personal almanac &mdash; in two volumes
              </div>
              <h1 className="font-serif text-[clamp(2.6rem,8vw,7rem)] leading-[0.92] tracking-[-0.015em] text-ink">
                <span className="italic font-medium">Augusto</span>{' '}
                <span className="font-medium">González</span>
                <span className="text-oxblood">·</span>
                <span className="font-medium">Bonorino</span>
              </h1>
              <p className="mt-5 sm:mt-7 font-serif italic text-lg sm:text-xl lg:text-2xl text-ink/70 max-w-3xl leading-snug">
                economist, builder, and writer on language models as engines of
                human behavior.
              </p>
            </motion.div>
          </section>

          {/* Two folios */}
          <section className="flex-1 px-5 sm:px-10 lg:px-16 pb-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-16 max-w-6xl"
            >
              <FolioCard
                kind="academic"
                roman="Vol. I"
                label="Research"
                title="The Academy"
                preview={`Microeconomic theory, experimental economics, LLM-driven agents. ${academicCount}+ entries.`}
                meta="→ enter the reading room"
                dimmed={hovered !== null && hovered !== 'academic'}
                onHover={(k) => setHovered(k)}
                onSelect={() => handleSelect('academic')}
              />
              <FolioCard
                kind="build"
                roman="Vol. II"
                label="Build"
                title="The Studio"
                preview={`SHIPPED · ${buildCount} PROJECTS · HUMAN ⋈ AI`}
                meta="→ enter the workshop"
                dimmed={hovered !== null && hovered !== 'build'}
                onHover={(k) => setHovered(k)}
                onSelect={() => handleSelect('build')}
              />
            </motion.div>
          </section>

          {/* Colophon */}
          <footer className="px-5 sm:px-10 lg:px-16 pb-6 sm:pb-8">
            <div className="h-px bg-ink/20 mb-4" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[10px] uppercase tracking-[0.28em] text-ink/50 font-mono">
              <span>Colophon &middot; set in Fraunces &amp; Geist</span>
              <span className="text-ink/40">Est. MMXXIV &middot; hand-tuned</span>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Index;
