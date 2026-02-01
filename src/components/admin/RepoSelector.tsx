import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Search, Star, GitFork, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface RepoItem {
  id: string;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  isFork: boolean;
  isArchived: boolean;
}

interface RepoSelectorProps {
  repos: RepoItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (items: unknown[]) => void;
  username: string;
}

export function RepoSelector({ repos, open, onOpenChange, onImport, username }: RepoSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);
  const [minStars, setMinStars] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  // Get unique languages
  const languages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach(repo => {
      if (repo.language) langs.add(repo.language);
    });
    return Array.from(langs).sort();
  }, [repos]);

  // Filter repos
  const filteredRepos = useMemo(() => {
    return repos.filter(repo => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = repo.name.toLowerCase().includes(query);
        const matchesDesc = repo.description?.toLowerCase().includes(query);
        const matchesTopics = repo.topics.some(t => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesTopics) return false;
      }
      
      // Language filter
      if (languageFilter && repo.language !== languageFilter) return false;
      
      // Stars filter
      if (repo.stars < minStars) return false;
      
      return true;
    });
  }, [repos, searchQuery, languageFilter, minStars]);

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    setSelectedIds(new Set(filteredRepos.map(r => r.id)));
  };

  const selectNone = () => {
    setSelectedIds(new Set());
  };

  const handleImport = async () => {
    if (selectedIds.size === 0) return;
    
    setIsImporting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('sync-github', {
        body: { 
          username,
          selected_repos: Array.from(selectedIds),
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      
      onImport(data.items || []);
      onOpenChange(false);
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Import error:', err);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Repositories to Import</DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search repos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={languageFilter || ''}
                onChange={(e) => setLanguageFilter(e.target.value || null)}
                className="px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="">All Languages</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  min={0}
                  value={minStars}
                  onChange={(e) => setMinStars(parseInt(e.target.value) || 0)}
                  className="w-16"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {filteredRepos.length} repos • {selectedIds.size} selected
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={selectAll}>
                Select All
              </Button>
              <Button variant="ghost" size="sm" onClick={selectNone}>
                Select None
              </Button>
            </div>
          </div>
        </div>

        {/* Repo List */}
        <ScrollArea className="h-[400px] border rounded-md">
          <div className="p-2 space-y-1">
            {filteredRepos.map(repo => (
              <div
                key={repo.id}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedIds.has(repo.id) 
                    ? 'bg-primary/10 border border-primary/30' 
                    : 'hover:bg-muted/50 border border-transparent'
                }`}
                onClick={() => toggleSelect(repo.id)}
              >
                <Checkbox
                  checked={selectedIds.has(repo.id)}
                  onCheckedChange={() => toggleSelect(repo.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{repo.name}</span>
                    {repo.language && (
                      <Badge variant="secondary" className="text-xs">
                        {repo.language}
                      </Badge>
                    )}
                    {repo.isArchived && (
                      <Badge variant="outline" className="text-xs">
                        Archived
                      </Badge>
                    )}
                  </div>
                  {repo.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3 h-3" />
                      {repo.forks}
                    </span>
                    {repo.topics.length > 0 && (
                      <span className="truncate">
                        {repo.topics.slice(0, 3).join(', ')}
                        {repo.topics.length > 3 && '...'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredRepos.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No repos match your filters
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={selectedIds.size === 0 || isImporting}
          >
            {isImporting ? 'Importing...' : `Import ${selectedIds.size} Repos`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
