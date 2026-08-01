import { useCallback, useMemo, useState } from 'react';
import type { Artifact } from '@/data/types';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';

interface ProjectGridProps {
  artifacts: Artifact[];
}

/** Fallback sort key from the static dataset when GitHub data is unavailable. */
function staticKey(a: Artifact): string {
  const raw = (a.endDate === 'current' ? new Date().toISOString() : a.endDate || a.date || '') as string;
  // Normalise "2025" / "2025-04" into a comparable YYYY-MM-DD string.
  const parts = raw.split('-');
  const y = parts[0] ?? '0000';
  const m = parts[1] ?? '01';
  const d = parts[2] ?? '01';
  return `${y}-${m}-${d}`;
}

export function ProjectGrid({ artifacts }: ProjectGridProps) {
  const [selected, setSelected] = useState<Artifact | null>(null);
  const [pushed, setPushed] = useState<Record<string, string>>({});

  const handlePushedAt = useCallback((id: string, iso: string) => {
    setPushed((prev) => (prev[id] === iso ? prev : { ...prev, [id]: iso }));
  }, []);

  // Newest first, preferring the verified GitHub last-push date.
  const ordered = useMemo(() => {
    return [...artifacts].sort((a, b) => {
      const ka = (pushed[a.id] ?? staticKey(a)).slice(0, 10);
      const kb = (pushed[b.id] ?? staticKey(b)).slice(0, 10);
      return kb.localeCompare(ka);
    });
  }, [artifacts, pushed]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
        {ordered.map((a) => (
          <div key={a.id} className="bg-background">
            <ProjectCard artifact={a} onOpen={() => setSelected(a)} onPushedAt={handlePushedAt} />
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
