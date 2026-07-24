import { ExternalLink, Github, FileText, Star } from 'lucide-react';
import type { Artifact } from '@/data/types';
import { TagBadge } from './TagLegend';
import { CommitSparkline } from './CommitSparkline';
import { parseGithubRepo } from '@/lib/github';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  artifact: Artifact;
  onOpen?: () => void;
}

export function ProjectCard({ artifact, onOpen }: ProjectCardProps) {
  const gh = parseGithubRepo(artifact.links?.repo);
  const lang = (artifact as unknown as { language?: string }).language;
  const stars = (artifact as unknown as { stars?: number }).stars;

  return (
    <article
      onClick={onOpen}
      className={cn(
        'group relative h-full flex flex-col p-5 sm:p-6 cursor-pointer bg-background',
        'transition-colors duration-200',
        'hover:bg-secondary/40 focus-within:bg-secondary/40',
        'outline-none focus-visible:ring-1 focus-visible:ring-cobalt'
      )}
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onOpen) {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      {/* Header row: org/year monoline */}
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
        <span className="text-cobalt">{artifact.org ?? 'Project'}</span>
        <span>{(artifact.date || '').slice(0, 7)}</span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-xl sm:text-2xl leading-tight tracking-tight mb-2 group-hover:text-cobalt transition-colors">
        {artifact.title}
      </h3>

      {/* Tech meta (language + stars from GitHub sync) */}
      {(lang || stars !== undefined) && (
        <div className="font-mono text-[11px] text-muted-foreground mb-3 flex items-center gap-3">
          {lang && <span>{lang}</span>}
          {stars !== undefined && (
            <span className="inline-flex items-center gap-1">
              <Star className="w-3 h-3" /> {stars}
            </span>
          )}
        </div>
      )}

      {/* Summary */}
      <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3 mb-4">
        {artifact.summary}
      </p>

      {/* Tags */}
      {artifact.tags && artifact.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {artifact.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} size="sm" />
          ))}
        </div>
      )}

      {/* Commit sparkline (real signal) */}
      {gh && (
        <div className="mb-4" onClick={(e) => e.stopPropagation()}>
          <CommitSparkline owner={gh.owner} repo={gh.repo} />
        </div>
      )}

      {/* Footer row: links */}
      <div className="mt-auto pt-4 hairline-t flex items-center gap-4">
        {artifact.links?.repo && (
          <a
            href={artifact.links.repo}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cobalt transition-colors min-h-[44px] py-2"
            aria-label="Open repository"
          >
            <Github className="w-3.5 h-3.5" /> repo
          </a>
        )}
        {artifact.links?.demo && (
          <a
            href={artifact.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cobalt transition-colors min-h-[44px] py-2"
            aria-label="Open demo"
          >
            <ExternalLink className="w-3.5 h-3.5" /> demo
          </a>
        )}
        {artifact.links?.paper && (
          <a
            href={artifact.links.paper}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cobalt transition-colors min-h-[44px] py-2"
            aria-label="Open paper"
          >
            <FileText className="w-3.5 h-3.5" /> paper
          </a>
        )}
      </div>
    </article>
  );
}
