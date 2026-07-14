import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useMode } from '@/hooks/useMode';
import { useWorld } from '@/hooks/useWorld';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { Section, SectionItem } from '@/components/academic/Section';
import { PublicationList } from '@/components/academic/PublicationList';
import { getArtifactsBySection, sortByDate } from '@/lib/artifacts';
import { Github, ExternalLink, Linkedin, BookOpen, GraduationCap, Download, Mail } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

const Academic = () => {
  const { mode, setMode, isLoading } = useMode();
  useWorld('academic');

  useEffect(() => {
    if (!isLoading && mode !== 'academic') setMode('academic');
  }, [isLoading, mode, setMode]);

  const education = sortByDate(getArtifactsBySection('education'));
  const experience = sortByDate(getArtifactsBySection('experience'));
  const teaching = sortByDate(getArtifactsBySection('teaching'));
  const publications = sortByDate(getArtifactsBySection('publications'));
  
  const certifications = getArtifactsBySection('certifications');
  const honors = sortByDate(getArtifactsBySection('honors'));
  const grants = sortByDate(getArtifactsBySection('grants'));

  const formatDateRange = (start: string, end?: string, forceUpper = false) => {
    const fmt = (d: string) => {
      if (d === 'current') return 'Present';
      const date = new Date(d);
      const formatted = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      return forceUpper ? formatted.toUpperCase() : formatted;
    };
    if (!end) return fmt(start);
    return `${fmt(start)} – ${fmt(end)}`;
  };

  return (
    <>
      <Helmet>
        <title>Research — Augusto González-Bonorino</title>
        <meta
          name="description"
          content="Research and academic profile of Augusto González-Bonorino: experimental economics, microeconomic theory, and large language models as engines of human behavior."
        />
        <link rel="canonical" href="/academic" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-8">
          {/* Top label */}
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cobalt mb-6">
            Research / curriculum vitae
          </div>

          {/* Hero */}
          <motion.header
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-12 sm:mb-16"
          >
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight font-medium">
              Augusto<br />González-Bonorino
            </h1>
            <p className="mt-6 font-serif italic text-lg sm:text-xl text-muted-foreground">
              PhD Student in Economics · Arizona State University
            </p>

            <div className="mt-8 max-w-2xl space-y-4 text-[15px] leading-relaxed text-foreground/85">
              <p>
                Originally from Tucumán, Argentina. I work at the intersection of
                microeconomic theory, experimental economics, and large language
                models — using LLMs as computational engines of human behavior in
                economic games.
              </p>
              <p className="text-muted-foreground">
                My research spans AI-assisted methodology, behavioral economics, and
                computational approaches to studying non-WEIRD populations.
              </p>
            </div>

            {/* Currently block */}
            <div className="mt-10 hairline-t pt-6">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
                Currently
              </div>
              <p className="text-[15px]">
                Doctoral research at <span className="text-cobalt">ASU</span>; leading{' '}
                <a
                  href="https://www.econllm-lab.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-cobalt"
                >
                  EconLLM Lab
                </a>
                . Open to collaboration on experimental designs that use LLM agents.
              </p>
            </div>

            {/* Links — 2-col grid on mobile, flex on sm+ */}
            <div className="mt-8 grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-x-5 gap-y-1 text-sm">
              <a href="mailto:agbonorino@proton.me" className="inline-flex items-center gap-1.5 text-foreground hover:text-cobalt transition-colors min-h-[44px] py-2">
                <Mail className="w-3.5 h-3.5" /> <span className="truncate">agbonorino@proton.me</span>
              </a>
              <a href="/cv.pdf" className="inline-flex items-center gap-1.5 text-foreground hover:text-cobalt transition-colors min-h-[44px] py-2">
                <Download className="w-3.5 h-3.5" /> CV (PDF)
              </a>
              <a href="https://scholar.google.com/citations?user=xdO0FqwAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] py-2">
                <GraduationCap className="w-3.5 h-3.5" /> Google Scholar
              </a>
              <a href="https://github.com/EconLLM-Lab" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] py-2">
                <Github className="w-3.5 h-3.5" /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/augustogbono/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] py-2">
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
              </a>
            </div>
          </motion.header>


          {/* Sections */}
          <Section title="Education" collapsible defaultOpen>
            {education.map((e) => (
              <SectionItem key={e.id} title={e.title} subtitle={e.subtitle} organization={e.organization} location={e.location} date={formatDateRange(e.date, e.endDate)} details={e.details} />
            ))}
          </Section>

          <Section title="Research & Work" collapsible defaultOpen>
            {experience.map((x) => (
              <SectionItem key={x.id} title={x.title} organization={x.organization} location={x.location} date={formatDateRange(x.date, x.endDate)} summary={x.summary} details={x.details} links={x.links?.website ? [{ label: 'Website', url: x.links.website }] : undefined} />
            ))}
          </Section>

          <Section title="Teaching" collapsible defaultOpen>
            {teaching.map((t) => (
              <SectionItem key={t.id} title={t.title} organization={t.organization} location={t.location} date={formatDateRange(t.date, t.endDate, true)} details={t.details} />
            ))}
          </Section>

          <Section title="Publications & Presentations" collapsible defaultOpen>
            <PublicationList publications={publications} />
          </Section>


          <Section title="Grants & Fellowships" collapsible defaultOpen={false}>
            {grants.map((g) => (
              <SectionItem key={g.id} title={g.title} subtitle={g.subtitle} organization={g.organization} date={g.date} summary={g.summary} />
            ))}
          </Section>

          {certifications.length > 0 && (
            <Section title="Certifications" collapsible defaultOpen={false}>
              {certifications.map((c) => (
                <SectionItem
                  key={c.id}
                  title={c.title}
                  organization={c.organization}
                  date={c.date}
                  links={c.links?.paper ? [{ label: 'Certificate', url: c.links.paper }] : undefined}
                />
              ))}
            </Section>
          )}

          <Section title="Honors & Awards" collapsible defaultOpen={false}>
            {honors.map((h) => (
              <SectionItem key={h.id} title={h.title} organization={h.organization} date={h.date} summary={h.summary} />
            ))}
          </Section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Academic;
