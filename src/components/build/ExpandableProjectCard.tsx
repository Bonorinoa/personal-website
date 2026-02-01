import { useState } from 'react';
import { ExternalLink, Github, FileText } from 'lucide-react';
import type { Artifact } from '@/data/types';
import { TagBadge } from './TagLegend';
import { DemoEmbed } from './DemoEmbed';
import { CollaborationMatrix } from './CollaborationMatrix';
import { cn } from '@/lib/utils';

interface ExpandableProjectCardProps {
  artifact: Artifact;
  onClick: () => void;
}

export function ExpandableProjectCard({ artifact, onClick }: ExpandableProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const hasMatrix = artifact.collaboration_breakdown?.matrix && artifact.collaboration_breakdown.matrix.length > 0;

  return (
    <div
      className={cn(
        "relative flex-shrink-0 snap-start cursor-pointer rounded-xl overflow-hidden border border-slate-200/50 bg-white/70 backdrop-blur-sm transition-all duration-300 ease-out",
        isHovered 
          ? "w-[420px] shadow-2xl scale-[1.02] z-10 border-blue-200/80" 
          : "w-[280px] shadow-lg hover:shadow-xl"
      )}
      style={{ height: isHovered ? 420 : 340 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Preview Image / Demo */}
      <div className={cn(
        "relative bg-gradient-to-br from-slate-100 to-slate-200 transition-all duration-300",
        isHovered ? "h-40" : "h-32"
      )}>
        {artifact.demoInfo ? (
          <div className="w-full h-full overflow-hidden">
            <DemoEmbed demoInfo={artifact.demoInfo} title={artifact.title} compact />
          </div>
        ) : artifact.previewImage && artifact.previewImage !== '/placeholder.svg' ? (
          <img 
            src={artifact.previewImage} 
            alt={artifact.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-mono text-slate-300">
              {artifact.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Tag indicator */}
        {artifact.tags && artifact.tags.length > 0 && (
          <div className={cn(
            "absolute top-3 right-3 flex flex-wrap gap-1 transition-opacity",
            isHovered ? "opacity-100" : "opacity-80"
          )}>
            {artifact.tags.slice(0, isHovered ? 3 : 1).map((tag) => (
              <TagBadge key={tag} tag={tag} size="sm" />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-full" style={{ height: isHovered ? 280 : 208 }}>
        {/* Title and date */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className={cn(
            "font-semibold text-slate-800 transition-all",
            isHovered ? "text-lg" : "text-base line-clamp-1"
          )}>
            {artifact.title}
          </h3>
          <span className="text-xs text-slate-500 shrink-0">
            {artifact.date}
          </span>
        </div>

        {/* Summary - expands on hover */}
        <p className={cn(
          "text-slate-600 text-sm leading-relaxed transition-all",
          isHovered ? "line-clamp-3" : "line-clamp-2"
        )}>
          {artifact.summary}
        </p>

        {/* Expanded content */}
        <div className={cn(
          "mt-auto space-y-3 transition-all duration-300",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}>
          {/* Mini collaboration matrix */}
          {hasMatrix && (
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                AI Tools Used
              </p>
              <CollaborationMatrix matrix={artifact.collaboration_breakdown!.matrix!} compact />
            </div>
          )}

          {/* Quick links */}
          <div className="flex gap-3">
            {artifact.links?.repo && (
              <a
                href={artifact.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-blue-600 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Repo</span>
              </a>
            )}
            {artifact.links?.demo && (
              <a
                href={artifact.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-blue-600 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Demo</span>
              </a>
            )}
            {artifact.links?.paper && (
              <a
                href={artifact.links.paper}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-blue-600 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Paper</span>
              </a>
            )}
          </div>
        </div>

        {/* "Click to expand" hint when not hovered */}
        <div className={cn(
          "mt-auto pt-2 text-center text-xs text-slate-400 transition-opacity",
          isHovered ? "opacity-0" : "opacity-100"
        )}>
          Click for details
        </div>
      </div>
    </div>
  );
}
