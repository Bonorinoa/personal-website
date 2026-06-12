import { TAG_DEFINITIONS, type CollaborationTag } from '@/data/types';
export { TAG_DEFINITIONS } from '@/data/types';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TagLegendProps {
  activeTag: CollaborationTag | null;
  onTagSelect: (tag: CollaborationTag | null) => void;
}

export function TagLegend({ activeTag, onTagSelect }: TagLegendProps) {
  const tags = Object.entries(TAG_DEFINITIONS) as [CollaborationTag, { ratio: string; description: string }][];

  const baseBtn =
    'font-mono text-xs uppercase tracking-[0.12em] px-3 py-2 border transition-colors min-h-[40px] whitespace-nowrap shrink-0';
  const off = 'border-border text-muted-foreground hover:text-foreground hover:border-foreground';
  const on = 'border-cobalt bg-cobalt text-white';

  return (
    <div className="mb-10 hairline-b pb-6">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
        Filter / collaboration mode
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        <button onClick={() => onTagSelect(null)} className={`${baseBtn} ${activeTag === null ? on : off}`}>
          All
        </button>
        {tags.map(([tag, def]) => (
          <Tooltip key={tag}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onTagSelect(activeTag === tag ? null : tag)}
                className={`${baseBtn} ${activeTag === tag ? on : off}`}
              >
                {formatTagName(tag)}
                <span className="ml-1.5 opacity-70 normal-case tracking-normal">{def.ratio}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="font-medium mb-1">{formatTagName(tag)}</p>
              <p className="text-sm opacity-80">{def.description}</p>
              <p className="text-xs mt-1 opacity-60">Human/AI ratio: {def.ratio}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

function formatTagName(tag: CollaborationTag): string {
  return tag.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

interface TagBadgeProps {
  tag: CollaborationTag;
  size?: 'sm' | 'default';
}

export function TagBadge({ tag, size = 'default' }: TagBadgeProps) {
  const sz = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`${sz} font-mono uppercase tracking-[0.1em] bg-foreground text-background inline-block`}>
          {formatTagName(tag)}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>{TAG_DEFINITIONS[tag].description}</p>
        <p className="text-xs mt-1 opacity-60">Ratio: {TAG_DEFINITIONS[tag].ratio}</p>
      </TooltipContent>
    </Tooltip>
  );
}
