import { useState } from 'react';
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
        {artifacts.map((a) => (
          <div key={a.id} className="bg-background">
            <ProjectCard artifact={a} onOpen={() => setSelected(a)} />
          </div>
        ))}
      </div>
      <ProjectModal
        artifact={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </>
  );
}
