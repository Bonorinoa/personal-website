import { TAG_DEFINITIONS, type CollaborationTag } from '@/data/types';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TagLegendProps {
  activeTag: CollaborationTag | null;
  onTagSelect: (tag: CollaborationTag | null) => void;
}

export function TagLegend({ activeTag, onTagSelect }: TagLegendProps) {
  const tags = Object.entries(TAG_DEFINITIONS) as [CollaborationTag, { ratio: string; description: string }][];

  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-slate-500 mb-3">
        Filter by collaboration style
      </h3>
      <div className="flex flex-wrap gap-2">
        {/* "All" filter */}
        <button
          onClick={() => onTagSelect(null)}
          className={`
            px-3 py-1.5 rounded-full text-sm font-medium
            transition-all duration-200
            ${activeTag === null
              ? 'bg-slate-800 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }
          `}
        >
          All Projects
        </button>

        {tags.map(([tag, definition]) => (
          <Tooltip key={tag}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onTagSelect(activeTag === tag ? null : tag)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium
                  transition-all duration-200
                  ${activeTag === tag
                    ? getTagActiveStyles(tag)
                    : getTagInactiveStyles(tag)
                  }
                `}
              >
                {formatTagName(tag)}
                <span className="ml-1 opacity-60">{definition.ratio}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="font-medium mb-1">{formatTagName(tag)}</p>
              <p className="text-sm opacity-80">{definition.description}</p>
              <p className="text-xs mt-1 opacity-60">
                Human/AI ratio: {definition.ratio} (approximate)
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

function formatTagName(tag: CollaborationTag): string {
  return tag.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function getTagActiveStyles(tag: CollaborationTag): string {
  switch (tag) {
    case 'vibe-coded':
      return 'bg-purple-600 text-white';
    case 'vibe-engineered':
      return 'bg-blue-600 text-white';
    case 'ai-assisted':
      return 'bg-green-600 text-white';
    default:
      return 'bg-slate-800 text-white';
  }
}

function getTagInactiveStyles(tag: CollaborationTag): string {
  switch (tag) {
    case 'vibe-coded':
      return 'bg-purple-100 text-purple-700 hover:bg-purple-200';
    case 'vibe-engineered':
      return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
    case 'ai-assisted':
      return 'bg-green-100 text-green-700 hover:bg-green-200';
    default:
      return 'bg-slate-100 text-slate-600 hover:bg-slate-200';
  }
}

interface TagBadgeProps {
  tag: CollaborationTag;
  size?: 'sm' | 'default';
}

export function TagBadge({ tag, size = 'default' }: TagBadgeProps) {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : '';
  
  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge className={`${getTagActiveStyles(tag)} ${sizeClasses}`}>
          {formatTagName(tag)}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>{TAG_DEFINITIONS[tag].description}</p>
        <p className="text-xs mt-1 opacity-60">
          Ratio: {TAG_DEFINITIONS[tag].ratio}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
