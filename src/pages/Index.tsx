import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useMode, type Mode } from '@/hooks/useMode';
import { getAcademicArtifacts, getBuildArtifacts } from '@/lib/artifacts';
import { ArrowUpRight } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

const Index = () => {
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
        <link rel="canonical" href="/" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Top meta strip */}
        <div className="hairline-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="font-mono">Personal Site / 2026</span>
            <span className="hidden sm:inline font-mono">Tempe · Tucumán</span>
          </div>
        </div>

        {/* Main split */}
        <main className="flex-1 grid grid-cols-1 md:grid-cols-2 relative">
          {/* Center hairline divider on desktop */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-border" />

          {/* LEFT — Research */}
          <ChoicePanel
            label="Research"
            sub="Economics · Experimental · LLMs"
            tagline="A scholar's site."
            description={`PhD work in microeconomic theory, experimental economics, and language models as engines of human behavior. ${academicCount}+ items across publications, roles, and teaching.`}
            href="academic"
            display="serif"
            isActive={hovered === 'academic'}
            isDimmed={hovered !== null && hovered !== 'academic'}
            onHover={() => setHovered('academic')}
            onSelect={() => handleSelect('academic')}
          />

          {/* Mobile divider */}
          <div className="md:hidden hairline-t" />

          {/* RIGHT — Build */}
          <ChoicePanel
            label="Build"
            sub="Projects · Tools · AI-collab"
            tagline="A builder's lab."
            description={`Shipped projects with transparent human/AI collaboration breakdowns. ${buildCount} projects with demos, repos, and a real provenance matrix.`}
            href="build"
            display="mono"
            isActive={hovered === 'build'}
            isDimmed={hovered !== null && hovered !== 'build'}
            onHover={() => setHovered('build')}
            onSelect={() => handleSelect('build')}
          />
        </main>

        {/* Bottom meta strip */}
        <div className="hairline-t">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="font-mono">Augusto González-Bonorino</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={hovered ?? 'idle'}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.24, ease: EASE }}
                className="font-mono"
              >
                {hovered === 'academic'
                  ? '→ enter research'
                  : hovered === 'build'
                  ? '→ enter build'
                  : 'choose a door'}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

interface ChoiceProps {
  label: string;
  sub: string;
  tagline: string;
  description: string;
  href: string;
  display: 'serif' | 'mono';
  isActive: boolean;
  isDimmed: boolean;
  onHover: () => void;
  onSelect: () => void;
}

function ChoicePanel({
  label,
  sub,
  tagline,
  description,
  href,
  display,
  isActive,
  isDimmed,
  onHover,
  onSelect,
}: ChoiceProps) {
  return (
    <motion.button
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onSelect}
      animate={{ opacity: isDimmed ? 0.5 : 1 }}
      transition={{ duration: 0.24, ease: EASE }}
      className="group relative text-left p-8 sm:p-12 lg:p-16 min-h-[60vh] md:min-h-[calc(100vh-96px)] flex flex-col justify-between focus:outline-none focus:bg-secondary/40"
      aria-label={`Enter ${label} mode`}
    >
      {/* Top: tiny label */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {sub}
        </span>
        <motion.span
          animate={{ x: isActive ? 4 : 0, y: isActive ? -4 : 0 }}
          transition={{ duration: 0.32, ease: EASE }}
          className="text-muted-foreground group-hover:text-cobalt"
        >
          <ArrowUpRight className="w-5 h-5" />
        </motion.span>
      </div>

      {/* Middle: huge wordmark */}
      <div className="my-12 md:my-0">
        <h2
          className={`leading-[0.85] tracking-tight ${
            display === 'serif'
              ? 'font-serif text-7xl sm:text-8xl lg:text-[10rem] font-medium'
              : 'font-mono text-6xl sm:text-7xl lg:text-9xl font-medium'
          }`}
        >
          {label}
        </h2>
        <p
          className={`mt-6 text-xl sm:text-2xl ${
            display === 'serif' ? 'font-serif italic' : 'font-mono'
          } text-muted-foreground max-w-md`}
        >
          {tagline}
        </p>
      </div>

      {/* Bottom: description + animated underline */}
      <div className="max-w-md">
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        <div className="mt-6 flex items-center gap-3">
          <motion.div
            animate={{ width: isActive ? 64 : 24 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="h-px bg-cobalt"
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cobalt">
            /{href}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

export default Index;
