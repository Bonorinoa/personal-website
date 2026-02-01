import { useState } from 'react';
import { ChevronDown, ExternalLink, Github, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { Artifact } from '@/data/types';
import { TagBadge } from './TagLegend';
import { CollaborationMatrix } from './CollaborationMatrix';
import { DemoEmbed } from './DemoEmbed';

interface ProjectCardProps {
  artifact: Artifact;
}

export function ProjectCard({ artifact }: ProjectCardProps) {
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);

  const hasMatrix = artifact.collaboration_breakdown?.matrix && artifact.collaboration_breakdown.matrix.length > 0;

  return (
    <Card className="group bg-white/70 backdrop-blur-sm border-slate-200/50 hover:shadow-lg hover:border-blue-200/50 transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        {/* Demo Preview */}
        {artifact.demoInfo ? (
          <DemoEmbed demoInfo={artifact.demoInfo} title={artifact.title} />
        ) : artifact.previewImage && artifact.previewImage !== '/placeholder.svg' ? (
          <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-4 overflow-hidden">
            <img 
              src={artifact.previewImage} 
              alt={artifact.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-4 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-mono text-slate-300">
                {artifact.title.charAt(0)}
              </span>
            </div>
          </div>
        )}

        {/* Title and date */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
            {artifact.title}
          </h3>
          <span className="text-sm text-slate-500 shrink-0">
            {artifact.date}
          </span>
        </div>

        {/* Tags */}
        {artifact.tags && artifact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {artifact.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} size="sm" />
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Summary */}
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          {artifact.summary}
        </p>

        {/* Links */}
        <div className="flex flex-wrap gap-3 mb-4">
          {artifact.links?.repo && (
            <a
              href={artifact.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Repository</span>
            </a>
          )}
          {artifact.links?.demo && (
            <a
              href={artifact.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Demo</span>
            </a>
          )}
          {artifact.links?.paper && (
            <a
              href={artifact.links.paper}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Paper</span>
            </a>
          )}
        </div>

        {/* Collaboration Breakdown */}
        {artifact.collaboration_breakdown && (
          <Collapsible open={isBreakdownOpen} onOpenChange={setIsBreakdownOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors w-full justify-between group/trigger">
              <span>Collaboration Breakdown</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isBreakdownOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3 pt-3 border-t border-slate-100">
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  My Contribution
                </h4>
                <p className="text-sm text-slate-600">
                  {artifact.collaboration_breakdown.human}
                </p>
              </div>
              
              {/* Collaboration Matrix */}
              {hasMatrix && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    AI Tools × Tasks
                  </h4>
                  <CollaborationMatrix matrix={artifact.collaboration_breakdown.matrix!} />
                </div>
              )}
              
              {/* Legacy ai_tools field fallback */}
              {!hasMatrix && artifact.collaboration_breakdown.ai_tools && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    AI Tools Used
                  </h4>
                  <p className="text-sm text-slate-600">
                    {artifact.collaboration_breakdown.ai_tools}
                  </p>
                </div>
              )}
              
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  Verification
                </h4>
                <p className="text-sm text-slate-600">
                  {artifact.collaboration_breakdown.verification}
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}
