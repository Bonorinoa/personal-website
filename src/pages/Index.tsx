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

      <div className="relative min-h-[100svh] md:h-[100svh] md:overflow-hidden paper-grain text-ink">
        {/* Background layers */}
        <div className="absolute inset-0 baseline-grid opacity-60 pointer-events-none" aria-hidden />
        <InkTrail />

        {/* Content */}
        <div className="relative z-10 min-h-[100svh] md:h-full flex flex-col">
          {/* Hero */}
          <section className="pl-8 sm:pl-16 lg:pl-28 pr-5 sm:pr-10 lg:pr-16 pt-10 sm:pt-14 lg:pt-16 pb-8 sm:pb-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="max-w-5xl"
            >
              <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-oxblood mb-4">
                Economist &amp; builder
              </div>
              <h1 className="font-serif text-[clamp(2rem,6.2vw,5.25rem)] leading-[0.95] tracking-[-0.02em] text-ink">
                <span className="italic font-medium">Augusto</span>{' '}
                <span className="inline-block whitespace-nowrap font-medium">
                  González<span className="text-oxblood">-</span>Bonorino
                </span>
              </h1>
              <p className="mt-4 sm:mt-5 font-serif italic text-base sm:text-lg lg:text-xl text-ink/65 max-w-3xl leading-snug">
                I study how people decide, and I build the instruments I use to
                study them.
              </p>

            </motion.div>
          </section>


          {/* Two folios */}
          <section className="flex-1 min-h-0 pl-8 sm:pl-16 lg:pl-28 pr-5 sm:pr-10 lg:pr-16 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 lg:gap-16 max-w-6xl md:h-full"
            >
              <FolioCard
                kind="academic"
                label="Curriculum vitae"
                title="Resume"
                preview={`Training, research, teaching, and publications. ${academicCount}+ entries.`}
                dimmed={hovered !== null && hovered !== 'academic'}
                onHover={(k) => setHovered(k)}
                onSelect={() => handleSelect('academic')}
              />
              <FolioCard
                kind="build"
                label="Software & systems"
                title="Portfolio"
                preview={`${buildCount} PROJECTS · COMMIT-LEVEL PROVENANCE`}
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
