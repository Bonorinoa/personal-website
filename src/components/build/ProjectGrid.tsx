import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Artifact } from '@/data/types';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';

interface ProjectGridProps {
  artifacts: Artifact[];
}

export function ProjectGrid({ artifacts }: ProjectGridProps) {
  const [selected, setSelected] = useState<Artifact | null>(null);

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          'gap-px bg-border border border-border'
        )}
      >
        {artifacts.map((artifact, i) => (
          <div
            key={artifact.id ?? i}
            className={cn(
              'bg-background',
              artifact.featured && i === 0 && 'sm:col-span-2'
            )}
          >
            <ProjectCard artifact={artifact} onOpen={() => setSelected(artifact)} />
          </div>
        ))}
      </div>

      <ProjectModal
        artifact={selected}
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </>
  );
}
