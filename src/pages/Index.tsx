import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useMode, type Mode } from '@/hooks/useMode';
import { useWorld } from '@/hooks/useWorld';
import { InkTrail } from '@/components/landing/InkTrail';
import { FolioCard } from '@/components/landing/FolioCard';
import { Footer } from '@/components/shared/Footer';

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
          <section className="pl-8 sm:pl-16 lg:pl-28 pr-5 sm:pr-10 lg:pr-16 pt-16 sm:pt-24 lg:pt-28 pb-12 sm:pb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="max-w-5xl"
            >
              <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-oxblood mb-6 sm:mb-8">
                Economist &amp; builder
              </div>
              <h1 className="font-serif text-[clamp(2.25rem,8.5vw,7.5rem)] leading-[0.9] tracking-[-0.02em] text-ink break-words whitespace-pre-line">
                <span className="italic font-medium">Augusto</span>{' '}
                <span className="font-medium">{"\n"}González</span>
                <span className="text-oxblood">-</span>
                <span className="font-medium">Bonorino</span>
              </h1>
              <p className="mt-6 sm:mt-8 font-serif italic text-lg sm:text-xl lg:text-2xl text-ink/65 max-w-3xl leading-snug">
                I study how people decide, and I build the instruments I use to
                study them.
              </p>

            </motion.div>
          </section>


          {/* Two folios */}
          <section className="flex-1 pl-8 sm:pl-16 lg:pl-28 pr-5 sm:pr-10 lg:pr-16 pb-10">
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

          <Footer />

        </div>
      </div>
    </>
  );
};

export default Index;
