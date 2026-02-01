import { useEffect, useState } from 'react';
import { useMode } from '@/hooks/useMode';
import { Navigation } from '@/components/shared/Navigation';
import { TagLegend } from '@/components/build/TagLegend';
import { ProjectCard } from '@/components/build/ProjectCard';
import { getBuildArtifacts, filterByTag, sortByDate } from '@/lib/artifacts';
import type { CollaborationTag } from '@/data/types';

const Build = () => {
  const { mode, setMode, isLoading } = useMode();
  const [activeTag, setActiveTag] = useState<CollaborationTag | null>(null);

  // Set mode if coming directly to this page
  useEffect(() => {
    if (!isLoading && mode !== 'build') {
      setMode('build');
    }
  }, [isLoading, mode, setMode]);

  const allArtifacts = sortByDate(getBuildArtifacts());
  const filteredArtifacts = filterByTag(allArtifacts, activeTag);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Grid pattern background */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(100,116,139,0.15) 1px, transparent 0)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <Navigation />
      
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Hero Section */}
        <header className="mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Build Portfolio
          </h1>
          
          {/* AI-Human Collaboration Philosophy */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 p-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-700 mb-3">
              AI-Human Collaboration Principles
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              I believe in transparent collaboration between humans and AI. Each project here 
              is tagged to show the approximate balance of human direction versus AI execution. 
              This isn't about credit—it's about honesty in how modern work gets done.
            </p>
            <div className="text-sm text-slate-500 space-y-1">
              <p>
                <strong>Why this matters:</strong> AI tools are transforming how we build and research. 
                By being explicit about my collaboration patterns, I hope to contribute to honest 
                discourse about AI's role in academic and technical work.
              </p>
            </div>
          </div>
        </header>

        {/* Tag Legend / Filter */}
        <TagLegend activeTag={activeTag} onTagSelect={setActiveTag} />

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtifacts.map((artifact) => (
            <ProjectCard key={artifact.id} artifact={artifact} />
          ))}
        </div>

        {/* Empty state */}
        {filteredArtifacts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500">
              No projects match the selected filter.
            </p>
            <button
              onClick={() => setActiveTag(null)}
              className="mt-4 text-blue-600 hover:text-blue-700 underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Build;
