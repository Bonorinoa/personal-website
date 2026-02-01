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
  if (collapsible) {
    return (
      <Collapsible defaultOpen={defaultOpen} className="mb-8">
        <CollapsibleTrigger className="flex items-center gap-2 w-full text-left group">
          <h2 className="text-xl font-serif text-stone-800 tracking-wide">
            {title}
          </h2>
          <ChevronDown className="w-4 h-4 text-stone-400 transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <div className="border-l-2 border-amber-200 pl-6">
            {children}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="text-xl font-serif text-stone-800 tracking-wide mb-4">
        {title}
      </h2>
      <div className="border-l-2 border-amber-200 pl-6">
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
  links 
}: SectionItemProps) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
        <h3 className="text-lg font-medium text-stone-700">
          {title}
          {subtitle && (
            <span className="ml-2 text-sm font-normal text-amber-700">
              {subtitle}
            </span>
          )}
        </h3>
        {date && (
          <span className="text-sm text-stone-500 shrink-0">
            {date}
          </span>
        )}
      </div>
      
      {(organization || location) && (
        <p className="text-sm text-stone-600 mt-0.5">
          {organization}
          {organization && location && ' · '}
          {location}
        </p>
      )}
      
      {summary && (
        <p className="text-stone-600 mt-2 leading-relaxed">
          {summary}
        </p>
      )}
      
      {details && details.length > 0 && (
        <ul className="mt-2 space-y-1">
          {details.map((detail, index) => (
            <li key={index} className="text-sm text-stone-600 flex items-start gap-2">
              <span className="text-amber-400 mt-1.5">•</span>
              {detail}
            </li>
          ))}
        </ul>
      )}
      
      {links && links.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-3">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-amber-700 hover:text-amber-900 underline underline-offset-2"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
