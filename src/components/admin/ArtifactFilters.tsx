import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter, SortAsc } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ArtifactType, ModeVisibility } from '@/data/types';

export interface FilterState {
  search: string;
  type: ArtifactType | 'all';
  visibility: ModeVisibility | 'all';
  section: string | 'all';
  sortBy: 'date' | 'title' | 'type';
  sortOrder: 'asc' | 'desc';
}

interface ArtifactFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  sections: string[];
  types: string[];
}

export function ArtifactFilters({ filters, onFiltersChange, sections, types }: ArtifactFiltersProps) {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      type: 'all',
      visibility: 'all',
      section: 'all',
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters = 
    filters.search !== '' || 
    filters.type !== 'all' || 
    filters.visibility !== 'all' || 
    filters.section !== 'all';

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search artifacts..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filter dropdowns */}
      <div className="flex flex-wrap gap-2">
        <Select
          value={filters.type}
          onValueChange={(value) => updateFilter('type', value as FilterState['type'])}
        >
          <SelectTrigger className="w-[140px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.visibility}
          onValueChange={(value) => updateFilter('visibility', value as FilterState['visibility'])}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="academic">Academic</SelectItem>
            <SelectItem value="build">Build</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.section}
          onValueChange={(value) => updateFilter('section', value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            {sections.map((section) => (
              <SelectItem key={section} value={section}>
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sortBy}
          onValueChange={(value) => updateFilter('sortBy', value as FilterState['sortBy'])}
        >
          <SelectTrigger className="w-[120px]">
            <SortAsc className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="type">Type</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
          className="px-2"
        >
          {filters.sortOrder === 'asc' ? '↑' : '↓'}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Active filter badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.search}"
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('search', '')} 
              />
            </Badge>
          )}
          {filters.type !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Type: {filters.type}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('type', 'all')} 
              />
            </Badge>
          )}
          {filters.visibility !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {filters.visibility}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('visibility', 'all')} 
              />
            </Badge>
          )}
          {filters.section !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {filters.section}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('section', 'all')} 
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
