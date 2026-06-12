import { useState } from 'react';
import { ExternalLink, Github, FileText, ChevronUp, ChevronDown, Star } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import type { Artifact } from '@/data/types';
import { TagBadge } from './TagLegend';
import { CollaborationMatrix } from './CollaborationMatrix';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  artifact: Artifact;
  onOpen?: () => void;
}

function MatrixPreview({ artifact }: { artifact: Artifact }) {
  const bd = artifact.collaboration_breakdown!;
  return (
    <div className="space-y-3 text-left">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cobalt mb-1.5">
          AI × Task matrix
        </div>
        {bd.matrix && bd.matrix.length > 0 && (
          <CollaborationMatrix matrix={bd.matrix} compact />
        )}
      </div>
      {bd.human && (
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">
            Human
          </div>
          <p className="text-xs text-foreground/85 line-clamp-2 leading-relaxed">{bd.human}</p>
        </div>
      )}
      {bd.verification && (
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">
            Verification
          </div>
          <p className="text-xs text-foreground/85 line-clamp-2 leading-relaxed">{bd.verification}</p>
        </div>
      )}
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground pt-1 hairline-t">
        Tap card for full details →
      </p>
    </div>
  );
}

export function ProjectCard({ artifact, onOpen }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();
  const hasMatrix =
    !!artifact.collaboration_breakdown?.matrix &&
    artifact.collaboration_breakdown.matrix.length > 0;

  // GitHub metadata sometimes lives on `source_ids` / `links`
  const lang = (artifact as any).language as string | undefined;
  const stars = (artifact as any).stars as number | undefined;

  const card = (
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

      {/* Footer row: links + expand chevron */}
      <div className="mt-auto pt-4 hairline-t flex items-center justify-between gap-3">
        <div className="flex items-center gap-4">
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

        {hasMatrix && isMobile && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((x) => !x);
            }}
            aria-label={expanded ? 'Hide AI matrix' : 'Show AI matrix'}
            aria-expanded={expanded}
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-cobalt hover:underline min-h-[44px] min-w-[44px] justify-center px-2"
          >
            AI {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* Mobile inline disclosure */}
      {hasMatrix && isMobile && expanded && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-4 pt-4 hairline-t"
        >
          <MatrixPreview artifact={artifact} />
        </div>
      )}
    </article>
  );

  // Desktop hover card; mobile just renders card (disclosure handled inline above)
  if (!hasMatrix || isMobile) return card;

  return (
    <HoverCard openDelay={200} closeDelay={120}>
      <HoverCardTrigger asChild>{card}</HoverCardTrigger>
      <HoverCardContent
        side="right"
        align="start"
        className="w-80 hairline bg-background border-border"
      >
        <MatrixPreview artifact={artifact} />
      </HoverCardContent>
    </HoverCard>
  );
}
