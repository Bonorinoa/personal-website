import { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SectionProps {
  title: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export function Section({ title, children, collapsible = false, defaultOpen = true }: SectionProps) {
  const heading = (
    <h2 className="font-serif text-2xl tracking-tight">
      {title}
    </h2>
  );

  if (collapsible) {
    return (
      <Collapsible defaultOpen={defaultOpen} className="mb-10 hairline-t pt-8">
        <CollapsibleTrigger className="flex items-center justify-between gap-2 w-full text-left group">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cobalt">§</span>
            {heading}
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-6">
          <div className="pl-5 border-l border-border">
            {children}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <section className="mb-10 hairline-t pt-8">
      <div className="flex items-baseline gap-3 mb-6">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cobalt">§</span>
        {heading}
      </div>
      <div className="pl-5 border-l border-border">
        {children}
      </div>
    </section>
  );
}

interface SectionItemProps {
  title: string;
  subtitle?: string;
  organization?: string;
  location?: string;
  date?: string;
  summary?: string;
  details?: string[];
  links?: { label: string; url: string }[];
}

export function SectionItem({
  title,
  subtitle,
  organization,
  location,
  date,
  summary,
  details,
  links,
}: SectionItemProps) {
  return (
    <div className="mb-7 last:mb-0">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
        <h3 className="text-base font-medium leading-snug">
          {title}
          {subtitle && (
            <span className="ml-2 text-sm font-normal text-cobalt">
              {subtitle}
            </span>
          )}
        </h3>
        {date && (
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground shrink-0">
            {date}
          </span>
        )}
      </div>

      {(organization || location) && (
        <p className="text-sm text-muted-foreground mt-1">
          {organization}
          {organization && location && ' · '}
          {location}
        </p>
      )}

      {summary && (
        <p className="text-[15px] mt-2 leading-relaxed text-foreground/85">
          {summary}
        </p>
      )}

      {details && details.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {details.map((detail, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2.5">
              <span className="text-cobalt mt-1.5 leading-none">·</span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      )}

      {links && links.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-4">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-cobalt text-sm"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
