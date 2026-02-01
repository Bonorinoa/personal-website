import type { Artifact } from '@/data/types';
import { ExternalLink, FileText } from 'lucide-react';

interface PublicationListProps {
  publications: Artifact[];
}

export function PublicationList({ publications }: PublicationListProps) {
  if (publications.length === 0) {
    return <p className="text-stone-500 italic">No publications to display.</p>;
  }

  return (
    <div className="space-y-4">
      {publications.map((pub) => (
        <div key={pub.id} className="group">
          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
            <div className="flex-1">
              <h4 className="text-stone-700 font-medium leading-snug">
                {pub.title}
              </h4>
              <p className="text-sm text-stone-500 mt-0.5">
                {pub.organization} · {pub.date}
              </p>
              {pub.summary && (
                <p className="text-sm text-stone-600 mt-1">
                  {pub.summary}
                </p>
              )}
              {pub.links?.paper && (
                <a
                  href={pub.links.paper}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm text-amber-700 hover:text-amber-900"
                >
                  View Paper <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
