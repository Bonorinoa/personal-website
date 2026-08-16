import type { Artifact, PubType } from '@/data/types';
import { ExternalLink } from 'lucide-react';
import { useMemo } from 'react';

interface PublicationListProps {
  publications: Artifact[];
}

const AUTHOR_PATTERNS = [/Gonzalez[- ]?Bonorino/i, /Bonorino, A/i, /González[- ]?Bonorino/i];

function highlightSelf(text: string) {
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

const GROUPS: { key: PubType; label: string }[] = [
  { key: 'journal', label: 'Journal publications' },
  { key: 'chapter', label: 'Book chapters' },
  { key: 'proceedings', label: 'Conference proceedings' },
  { key: 'conference', label: 'Conference presentations' },
  { key: 'working-paper', label: 'Working papers & essays' },
  { key: 'essay', label: 'Working papers & essays' },
  { key: 'replication', label: 'Working papers & essays' },
];

const TYPE_TAG: Record<PubType, string> = {
  journal: 'Journal',
  chapter: 'Chapter',
  proceedings: 'Proceedings',
  conference: 'Presentation',
  'working-paper': 'Working paper',
  essay: 'Essay',
  replication: 'Replication',
};

function yearOf(p: Artifact) {
  return p.year ?? (p.date ? new Date(p.date).getFullYear() : 0);
}

export function PublicationList({ publications }: PublicationListProps) {
  const grouped = useMemo(() => {
    const seen = new Set<string>();
    const out: { label: string; items: Artifact[] }[] = [];
    for (const { key, label } of GROUPS) {
      const items = publications.filter((p) => (p.pubType ?? 'journal') === key);
      if (items.length === 0) continue;
      items.sort((a, b) => yearOf(b) - yearOf(a));
      const existing = seen.has(label) ? out.find((g) => g.label === label) : undefined;
      if (existing) existing.items.push(...items);
      else {
        out.push({ label, items });
        seen.add(label);
      }
    }
    out.forEach((g) => g.items.sort((a, b) => yearOf(b) - yearOf(a)));
    return out;
  }, [publications]);

  if (publications.length === 0) {
    return <p className="text-muted-foreground italic text-sm">No publications to display.</p>;
  }

  return (
    <div className="space-y-9">
      {grouped.map(({ label, items }) => (
        <div key={label} className="sm:grid sm:grid-cols-[9rem_1fr] sm:gap-x-6">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-cobalt mb-3 sm:mb-0 sm:pt-1">
            {label}
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
                  <p className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2">
                    <span className="font-mono tabular-nums">{yearOf(pub) || '—'}</span>
                    {pub.organization && (
                      <>
                        <span aria-hidden>·</span>
                        <span>{pub.organization}</span>
                      </>
                    )}
                  </p>

                  <div className="flex items-center gap-4 flex-wrap">
                    {(pub.links?.paper || pub.links?.repo) && (
                      <a
                        href={(pub.links?.paper || pub.links?.repo) as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-cobalt inline-flex items-center gap-1 mt-2 text-xs font-mono uppercase tracking-[0.12em] min-h-[44px] py-2"
                      >
                        {pub.source_ids?.doi ? 'DOI' : pub.source_ids?.arxiv ? 'arXiv' : pub.source_ids?.ssrn ? 'SSRN' : pub.links?.paper ? 'Read' : 'Repository'}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {typeof pub.citations === 'number' && pub.citations > 0 && (
                      <a
                        href="https://scholar.google.com/citations?user=xdO0FqwAAAAJ&hl=en"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Citations on Google Scholar"
                        className="inline-flex items-center gap-1 mt-2 text-xs font-mono uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors min-h-[44px] py-2"
                      >
                        Cited by {pub.citations}
                      </a>
                    )}
                  </div>

                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}
