import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useMode, type Mode } from '@/hooks/useMode';
import { useWorld } from '@/hooks/useWorld';
import { InkTrail } from '@/components/landing/InkTrail';
import { FolioCard } from '@/components/landing/FolioCard';

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

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col">




          {/* Hero */}
          <section className="px-5 sm:px-10 lg:px-16 pt-16 sm:pt-24 lg:pt-28 pb-12 sm:pb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="max-w-5xl"
            >
              <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-oxblood mb-6 sm:mb-8">
                A personal almanac &mdash; in two volumes
              </div>
              <h1 className="font-serif text-[clamp(2.75rem,8.5vw,7.5rem)] leading-[0.9] tracking-[-0.02em] text-ink">
                <span className="italic font-medium">Augusto</span>{' '}
                <span className="font-medium">González</span>
                <span className="text-oxblood">·</span>
                <span className="font-medium">Bonorino</span>
              </h1>
              <p className="mt-6 sm:mt-8 font-serif italic text-lg sm:text-xl lg:text-2xl text-ink/65 max-w-3xl leading-snug">
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
                title="Resume"
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
                title="Portfolio"
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
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 text-[10px] uppercase tracking-[0.28em] text-ink/50 font-mono">
              <div className="flex flex-col gap-1.5">
                <span className="text-ink/70">© {new Date().getFullYear()} Augusto Gonzalez-Bonorino</span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <a href="mailto:agbonorino@proton.me" className="hover:text-cobalt transition-colors">Email</a>
                  <span className="text-ink/25">·</span>
                  <a href="https://github.com/Bonorinoa" target="_blank" rel="noreferrer" className="hover:text-cobalt transition-colors">GitHub</a>
                  <span className="text-ink/25">·</span>
                  <a href="https://scholar.google.com/citations?user=nGrz2xUAAAAJ" target="_blank" rel="noreferrer" className="hover:text-cobalt transition-colors">Scholar</a>
                  <span className="text-ink/25">·</span>
                  <a href="https://www.linkedin.com/in/augusto-bonorino/" target="_blank" rel="noreferrer" className="hover:text-cobalt transition-colors">LinkedIn</a>
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-1.5 text-ink/40">
                <span>Set in Fraunces &amp; Geist Mono</span>
                <span>Hand-tuned in Claremont, CA</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Index;
