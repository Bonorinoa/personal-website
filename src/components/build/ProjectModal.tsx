import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, FileText, Calendar, MapPin, Building } from 'lucide-react';
import type { Artifact } from '@/data/types';
import { TagBadge, TAG_DEFINITIONS } from './TagLegend';
import { DemoEmbed } from './DemoEmbed';
import { CommitCalendar } from './CommitCalendar';
import { parseGithubRepo } from '@/lib/github';
import { ContributorTable } from './AgentShare';
import { useCommitActivity } from '@/hooks/useCommitActivity';

interface ProjectModalProps {
  artifact: Artifact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ModalContributors({ owner, repo }: { owner: string; repo: string }) {
  const { contributors } = useCommitActivity(owner, repo);
  if (!contributors || contributors.length === 0) return null;
  return (
    <div className="space-y-3 border-t pt-4">
      <h3 className="font-semibold">Contributors</h3>
      <ContributorTable contributors={contributors} />
    </div>
  );
}

export function ProjectModal({ artifact, open, onOpenChange }: ProjectModalProps) {
  if (!artifact) return null;

  const gh = parseGithubRepo(artifact.links?.repo);



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl">{artifact.title}</DialogTitle>
              {artifact.subtitle && (
                <p className="text-muted-foreground mt-1">{artifact.subtitle}</p>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {artifact.date}{artifact.endDate && ` – ${artifact.endDate}`}
          </div>
          {artifact.organization && (
            <div className="flex items-center gap-1">
              <Building className="w-4 h-4" />
              {artifact.organization}
            </div>
          )}
          {artifact.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {artifact.location}
            </div>
          )}
        </div>

        {/* Tags */}
        {artifact.tags && artifact.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {artifact.tags.map((tag) => (
              <div key={tag} className="flex items-center gap-2">
                <TagBadge tag={tag} />
                <span className="text-xs text-muted-foreground">
                  {TAG_DEFINITIONS[tag].ratio} human/AI
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Demo preview */}
        {artifact.demoInfo && (
          <div className="rounded-lg overflow-hidden border">
            <DemoEmbed demoInfo={artifact.demoInfo} title={artifact.title} />
          </div>
        )}

        {/* Summary */}
        <div>
          <h3 className="font-semibold mb-2">Summary</h3>
          <p className="text-muted-foreground leading-relaxed">{artifact.summary}</p>
        </div>

        {/* Details */}
        {artifact.details && artifact.details.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Details</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {artifact.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Commit activity (real signal) */}
        {gh && (
          <div className="border-t pt-4">
            <CommitCalendar owner={gh.owner} repo={gh.repo} />
          </div>
        )}

        {/* Contributors — verifiable commit split, agent accounts flagged */}
        {gh && <ModalContributors owner={gh.owner} repo={gh.repo} />}

        {/* Credit attribution — who did what */}
        {(artifact.credit || artifact.collaboration_breakdown) && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold">Credit</h3>
            {artifact.credit ? (
              <>
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.16em] text-cobalt mb-1">Mine</h4>
                  <p className="text-sm leading-relaxed">{artifact.credit.authored}</p>
                </div>
                {artifact.credit.assisted && (
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-1">
                      Model-assisted
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{artifact.credit.assisted}</p>
                  </div>
                )}
                {artifact.credit.verification && (
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-1">
                      Verification
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{artifact.credit.verification}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {artifact.collaboration_breakdown?.human && (
                  <p className="text-sm leading-relaxed">{artifact.collaboration_breakdown.human}</p>
                )}
                {artifact.collaboration_breakdown?.verification && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {artifact.collaboration_breakdown.verification}
                  </p>
                )}
              </>
            )}
          </div>
        )}



        {/* Links */}
        {(artifact.links?.repo || artifact.links?.demo || artifact.links?.paper || artifact.links?.website) && (
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            {artifact.links.repo && (
              <a
                href={artifact.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <Github className="w-4 h-4" />
                Repository
              </a>
            )}
            {artifact.links.demo && (
              <a
                href={artifact.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
            {artifact.links.paper && (
              <a
                href={artifact.links.paper}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Paper
              </a>
            )}
            {artifact.links.website && (
              <a
                href={artifact.links.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Website
              </a>
            )}
          </div>
        )}

        {/* Source IDs */}
        {artifact.source_ids && Object.values(artifact.source_ids).some(Boolean) && (
          <div className="flex flex-wrap gap-2 pt-2 text-xs text-muted-foreground">
            {artifact.source_ids.doi && (
              <Badge variant="outline" className="font-mono">DOI: {artifact.source_ids.doi}</Badge>
            )}
            {artifact.source_ids.arxiv && (
              <Badge variant="outline" className="font-mono">arXiv: {artifact.source_ids.arxiv}</Badge>
            )}
            {artifact.source_ids.ssrn && (
              <Badge variant="outline" className="font-mono">SSRN: {artifact.source_ids.ssrn}</Badge>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
