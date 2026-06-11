import type { Artifact } from '@/data/types';
import { ExternalLink } from 'lucide-react';

interface PublicationListProps {
  publications: Artifact[];
}

export function PublicationList({ publications }: PublicationListProps) {
  if (publications.length === 0) {
    return <p className="text-muted-foreground italic text-sm">No publications to display.</p>;
  }

  return (
    <ol className="space-y-5">
      {publications.map((pub, idx) => (
        <li key={pub.id} className="group flex gap-4">
          <span className="font-mono text-xs text-muted-foreground pt-1 w-6 shrink-0 tabular-nums">
            {String(publications.length - idx).padStart(2, '0')}
          </span>
          <div className="flex-1">
            <h4 className="text-[15px] font-medium leading-snug">
              {pub.title}
            </h4>
            <p className="text-xs font-mono uppercase tracking-[0.1em] text-muted-foreground mt-1">
              {pub.organization}
              {pub.organization && pub.date && ' · '}
              {pub.date}
            </p>
            {pub.summary && (
              <p className="text-sm text-foreground/80 mt-2 leading-relaxed">
                {pub.summary}
              </p>
            )}
            {pub.links?.paper && (
              <a
                href={pub.links.paper}
                target="_blank"
                rel="noopener noreferrer"
                className="link-cobalt inline-flex items-center gap-1 mt-2 text-sm"
              >
                Read paper <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
