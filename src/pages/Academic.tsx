import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMode } from '@/hooks/useMode';
import { Navigation } from '@/components/shared/Navigation';
import { Section, SectionItem } from '@/components/academic/Section';
import { PublicationList } from '@/components/academic/PublicationList';
import { getArtifactsBySection, sortByDate } from '@/lib/artifacts';
import { Github, ExternalLink, Mail } from 'lucide-react';

const Academic = () => {
  const { mode, setMode, isLoading } = useMode();
  const navigate = useNavigate();

  // Set mode if coming directly to this page
  useEffect(() => {
    if (!isLoading && mode !== 'academic') {
      setMode('academic');
    }
  }, [isLoading, mode, setMode]);

  const education = sortByDate(getArtifactsBySection('education'));
  const experience = sortByDate(getArtifactsBySection('experience'));
  const teaching = sortByDate(getArtifactsBySection('teaching'));
  const publications = sortByDate(getArtifactsBySection('publications'));
  const skills = getArtifactsBySection('skills');
  const certifications = getArtifactsBySection('certifications');
  const honors = sortByDate(getArtifactsBySection('honors'));
  const grants = sortByDate(getArtifactsBySection('grants'));

  const formatDateRange = (start: string, end?: string) => {
    const formatDate = (d: string) => {
      if (d === 'current') return 'Present';
      const date = new Date(d);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };
    if (!end) return formatDate(start);
    return `${formatDate(start)} – ${formatDate(end)}`;
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Paper texture background */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <Navigation />
      
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header / Bio */}
        <header className="mb-12 animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Profile photo placeholder */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center shrink-0">
              <span className="text-2xl font-serif text-stone-500">AG</span>
            </div>
            
            <div>
              <h1 className="text-3xl font-serif text-stone-800 mb-2">
                Augusto González-Bonorino
              </h1>
              <p className="text-lg text-stone-600 mb-3">
                PhD Student in Economics · Arizona State University
              </p>
              <p className="text-stone-600 leading-relaxed">
                Economist and researcher specializing in computational methods, behavioral economics, 
                and the application of large language models to economic research.
              </p>
              
              {/* Contact links */}
              <div className="flex flex-wrap gap-4 mt-4">
                <a 
                  href="https://github.com/Bonorinoa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-amber-700"
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
                <a 
                  href="https://www.econllm-lab.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-amber-700"
                >
                  <ExternalLink className="w-4 h-4" /> EconLLM Lab
                </a>
                <a 
                  href="https://perwellgroup.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-amber-700"
                >
                  <ExternalLink className="w-4 h-4" /> Consulting
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Education */}
        <Section title="Education">
          {education.map((edu) => (
            <SectionItem
              key={edu.id}
              title={edu.title}
              subtitle={edu.subtitle}
              organization={edu.organization}
              location={edu.location}
              date={formatDateRange(edu.date, edu.endDate)}
              details={edu.details}
            />
          ))}
        </Section>

        {/* Research & Work Experience */}
        <Section title="Research & Work Experience">
          {experience.map((exp) => (
            <SectionItem
              key={exp.id}
              title={exp.title}
              organization={exp.organization}
              location={exp.location}
              date={formatDateRange(exp.date, exp.endDate)}
              summary={exp.summary}
              details={exp.details}
              links={exp.links?.website ? [{ label: 'Website', url: exp.links.website }] : undefined}
            />
          ))}
        </Section>

        {/* Teaching */}
        <Section title="Teaching">
          {teaching.map((teach) => (
            <SectionItem
              key={teach.id}
              title={teach.title}
              organization={teach.organization}
              location={teach.location}
              date={formatDateRange(teach.date, teach.endDate)}
              details={teach.details}
            />
          ))}
        </Section>

        {/* Publications */}
        <Section title="Publications & Presentations">
          <PublicationList publications={publications} />
        </Section>

        {/* Skills - Collapsible */}
        <Section title="Computational Skills" collapsible defaultOpen={false}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="text-sm">
                <span className="font-medium text-stone-700">{skill.title}</span>
                {skill.summary && (
                  <p className="text-stone-500 text-xs mt-0.5">{skill.summary}</p>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Certifications - Collapsible */}
        {certifications.length > 0 && (
          <Section title="Certifications" collapsible defaultOpen={false}>
            {certifications.map((cert) => (
              <SectionItem
                key={cert.id}
                title={cert.title}
                organization={cert.organization}
                date={cert.date}
              />
            ))}
          </Section>
        )}

        {/* Honors & Awards - Collapsible */}
        <Section title="Honors & Awards" collapsible defaultOpen={false}>
          {honors.map((honor) => (
            <SectionItem
              key={honor.id}
              title={honor.title}
              organization={honor.organization}
              date={honor.date}
              summary={honor.summary}
            />
          ))}
        </Section>

        {/* Grants & Fellowships - Collapsible */}
        <Section title="Grants & Fellowships" collapsible defaultOpen={false}>
          {grants.map((grant) => (
            <SectionItem
              key={grant.id}
              title={grant.title}
              organization={grant.organization}
              date={grant.date}
              summary={grant.summary}
            />
          ))}
        </Section>
      </main>
    </div>
  );
};

export default Academic;
