import type { Artifact } from '@/data/types';
import { ExternalLink } from 'lucide-react';
import { useMemo } from 'react';

interface PublicationListProps {
  publications: Artifact[];
}

const AUTHOR_PATTERNS = [/Gonzalez[- ]?Bonorino/i, /Bonorino, A/i, /González[- ]?Bonorino/i];

function highlightSelf(text: string) {
  // Bold any token matching the author's name variants
  const parts: (string | JSX.Element)[] = [];
  let remaining = text;
  let idx = 0;
  while (remaining.length > 0) {
    const matches = AUTHOR_PATTERNS.map((p) => remaining.search(p)).filter((i) => i >= 0);
    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }
    const next = Math.min(...matches);
    const pattern = AUTHOR_PATTERNS.find((p) => remaining.search(p) === next)!;
    const matched = remaining.match(pattern)!;
    if (next > 0) parts.push(remaining.slice(0, next));
    parts.push(<strong key={idx++} className="text-foreground">{matched[0]}</strong>);
    remaining = remaining.slice(next + matched[0].length);
  }
  return parts;
}

export function PublicationList({ publications }: PublicationListProps) {
  // Group by year, newest first
  const byYear = useMemo(() => {
    const map = new Map<number, Artifact[]>();
    publications.forEach((p) => {
      const y = p.year ?? (p.date ? new Date(p.date).getFullYear() : 0);
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(p);
    });
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [publications]);

  if (publications.length === 0) {
    return <p className="text-muted-foreground italic text-sm">No publications to display.</p>;
  }

  return (
    <div className="space-y-8">
      {byYear.map(([year, items]) => (
        <div key={year} className="grid grid-cols-[3.5rem_1fr] gap-x-4 sm:gap-x-6">
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-cobalt pt-1 tabular-nums">
            {year || '—'}
          </div>
          <ol className="space-y-5 min-w-0">
            {items.map((pub) => {
              const authors = pub.details?.find((d) => d.toLowerCase().startsWith('author'));
              const authorText = authors?.replace(/^authors?:\s*/i, '');
              return (
                <li key={pub.id} className="leading-relaxed">
                  {authorText && (
                    <p className="text-sm text-muted-foreground">
                      {highlightSelf(authorText)}
                    </p>
                  )}
                  <h4 className="text-[15px] font-serif italic mt-0.5 leading-snug">
                    {pub.title}
                  </h4>
                  {pub.organization && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {pub.organization}
                    </p>
                  )}
                  {pub.links?.paper && (
                    <a
                      href={pub.links.paper}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-cobalt inline-flex items-center gap-1 mt-1.5 text-xs font-mono uppercase tracking-[0.12em]"
                    >
                      {pub.source_ids?.doi ? 'DOI' : pub.source_ids?.arxiv ? 'arXiv' : pub.source_ids?.ssrn ? 'SSRN' : 'Read'}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}
