import { useState, useMemo, useEffect } from 'react';
import type { Artifact, ModeVisibility } from '@/data/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Star, Download, Plus } from 'lucide-react';
import { ArtifactFilters, type FilterState } from './ArtifactFilters';
import { ArtifactEditor } from './ArtifactEditor';
import { BulkActions } from './BulkActions';
import { useToast } from '@/hooks/use-toast';

interface ContentEditorProps {
  artifacts: Artifact[];
  onUpdate?: (artifact: Artifact) => void;
}

const STORAGE_KEY = 'portfolio-artifacts-edits';

export function ContentEditor({ artifacts: initialArtifacts, onUpdate }: ContentEditorProps) {
  const { toast } = useToast();
  const [artifacts, setArtifacts] = useState<Artifact[]>(initialArtifacts);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'all',
    visibility: 'all',
    section: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Load saved edits from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const edits = JSON.parse(saved) as Record<string, Partial<Artifact>>;
        const merged = initialArtifacts.map(a => ({ ...a, ...edits[a.id] }));
        setArtifacts(merged);
        if (Object.keys(edits).length > 0) {
          setHasUnsavedChanges(true);
        }
      } catch (e) {
        console.error('Failed to load saved edits:', e);
      }
    }
  }, [initialArtifacts]);

  // Get unique sections and types for filters
  const sections = useMemo(() => {
    const s = new Set<string>();
    artifacts.forEach(a => a.section && s.add(a.section));
    return Array.from(s);
  }, [artifacts]);

  const types = useMemo(() => {
    const t = new Set<string>();
    artifacts.forEach(a => t.add(a.type));
    return Array.from(t);
  }, [artifacts]);

  // Filter and sort artifacts
  const filteredArtifacts = useMemo(() => {
    let result = [...artifacts];

    // Text search
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(query) ||
        a.summary.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      result = result.filter(a => a.type === filters.type);
    }

    // Visibility filter
    if (filters.visibility !== 'all') {
      result = result.filter(a => a.mode_visibility === filters.visibility);
    }

    // Section filter
    if (filters.section !== 'all') {
      result = result.filter(a => a.section === filters.section);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'date':
          comparison = a.date.localeCompare(b.date);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [artifacts, filters]);

  const selectedArtifact = artifacts.find(a => a.id === selectedId) || null;

  const handleSaveArtifact = (updated: Artifact) => {
    setArtifacts(prev => prev.map(a => a.id === updated.id ? updated : a));
    
    // Save to localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    const edits = saved ? JSON.parse(saved) : {};
    edits[updated.id] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
    
    setHasUnsavedChanges(true);
    onUpdate?.(updated);
    
    toast({
      title: "Changes saved locally",
      description: "Export JSON to persist permanently.",
    });
  };

  const toggleSelectArtifact = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkVisibility = (visibility: ModeVisibility) => {
    const updated = artifacts.map(a => 
      selectedIds.has(a.id) ? { ...a, mode_visibility: visibility } : a
    );
    setArtifacts(updated);
    setHasUnsavedChanges(true);
    setSelectedIds(new Set());
    
    toast({
      title: "Visibility updated",
      description: `${selectedIds.size} artifacts updated to ${visibility}.`,
    });
  };

  const handleBulkFeatured = (featured: boolean) => {
    const updated = artifacts.map(a => 
      selectedIds.has(a.id) ? { ...a, featured } : a
    );
    setArtifacts(updated);
    setHasUnsavedChanges(true);
    setSelectedIds(new Set());
    
    toast({
      title: featured ? "Marked as featured" : "Removed from featured",
      description: `${selectedIds.size} artifacts updated.`,
    });
  };

  const handleBulkDelete = () => {
    const updated = artifacts.filter(a => !selectedIds.has(a.id));
    setArtifacts(updated);
    setHasUnsavedChanges(true);
    setSelectedIds(new Set());
    
    toast({
      title: "Artifacts deleted",
      description: `${selectedIds.size} artifacts removed from local storage.`,
      variant: "destructive",
    });
  };

  const handleExportJson = () => {
    const json = JSON.stringify({ artifacts }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'artifacts.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exported",
      description: "artifacts.json downloaded. Replace your src/data/artifacts.json with this file.",
    });
  };

  const handleClearEdits = () => {
    localStorage.removeItem(STORAGE_KEY);
    setArtifacts(initialArtifacts);
    setHasUnsavedChanges(false);
    
    toast({
      title: "Edits cleared",
      description: "All local changes have been discarded.",
    });
  };

  return (
    <div className="space-y-4">
      {/* Header with export/clear */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              Unsaved Changes
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleClearEdits}>
            Clear Edits
          </Button>
          <Button variant="default" size="sm" onClick={handleExportJson} className="gap-1">
            <Download className="w-4 h-4" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Bulk actions */}
      <BulkActions
        selectedCount={selectedIds.size}
        onClearSelection={() => setSelectedIds(new Set())}
        onSetVisibility={handleBulkVisibility}
        onToggleFeatured={handleBulkFeatured}
        onDelete={handleBulkDelete}
      />

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ minHeight: 600 }}>
        {/* Left: Artifact List */}
        <div className="space-y-4">
          <ArtifactFilters
            filters={filters}
            onFiltersChange={setFilters}
            sections={sections}
            types={types}
          />

          <ScrollArea className="h-[500px] border rounded-lg">
            <div className="p-2 space-y-1">
              {filteredArtifacts.map((artifact) => (
                <div
                  key={artifact.id}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedId === artifact.id 
                      ? 'bg-primary/10 border border-primary/30' 
                      : 'hover:bg-muted/50 border border-transparent'
                  }`}
                  onClick={() => setSelectedId(artifact.id)}
                >
                  <Checkbox
                    checked={selectedIds.has(artifact.id)}
                    onCheckedChange={() => toggleSelectArtifact(artifact.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{artifact.title}</span>
                      {artifact.featured && (
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {artifact.type}
                      </Badge>
                      <span>{artifact.mode_visibility}</span>
                      <span>·</span>
                      <span>{artifact.date}</span>
                    </div>
                  </div>
                </div>
              ))}

              {filteredArtifacts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No artifacts match your filters
                </div>
              )}
            </div>
          </ScrollArea>

          <p className="text-xs text-muted-foreground">
            {artifacts.length} total artifacts · {filteredArtifacts.length} shown
          </p>
        </div>

        {/* Right: Editor Panel */}
        <ArtifactEditor
          artifact={selectedArtifact}
          onSave={handleSaveArtifact}
          onCancel={() => setSelectedId(null)}
        />
      </div>
    </div>
  );
}
