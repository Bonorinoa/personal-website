import { useState } from 'react';
import type { Artifact, CollaborationTag, ModeVisibility } from '@/data/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Edit, Save, Star, Eye } from 'lucide-react';

interface ContentEditorProps {
  artifacts: Artifact[];
  onUpdate?: (artifact: Artifact) => void;
}

export function ContentEditor({ artifacts, onUpdate }: ContentEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleToggleFeatured = (artifact: Artifact) => {
    onUpdate?.({ ...artifact, featured: !artifact.featured });
  };

  const handleVisibilityChange = (artifact: Artifact, visibility: ModeVisibility) => {
    onUpdate?.({ ...artifact, mode_visibility: visibility });
  };

  return (
    <div className="space-y-4">
      {artifacts.map((artifact) => (
        <Card key={artifact.id} className="bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{artifact.title}</CardTitle>
                  {artifact.featured && (
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {artifact.type} · {artifact.date}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingId(editingId === artifact.id ? null : artifact.id)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          {editingId === artifact.id && (
            <CardContent className="border-t pt-4 space-y-4">
              {/* Featured toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor={`featured-${artifact.id}`} className="text-sm">
                  Featured
                </Label>
                <Switch
                  id={`featured-${artifact.id}`}
                  checked={artifact.featured}
                  onCheckedChange={() => handleToggleFeatured(artifact)}
                />
              </div>

              {/* Mode visibility */}
              <div className="space-y-2">
                <Label className="text-sm">Visibility</Label>
                <div className="flex gap-2">
                  {(['academic', 'build', 'both'] as ModeVisibility[]).map((vis) => (
                    <Button
                      key={vis}
                      size="sm"
                      variant={artifact.mode_visibility === vis ? 'default' : 'outline'}
                      onClick={() => handleVisibilityChange(artifact, vis)}
                    >
                      {vis.charAt(0).toUpperCase() + vis.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tags display */}
              {artifact.tags && artifact.tags.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm">Tags</Label>
                  <div className="flex gap-2">
                    {artifact.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Note: Full editing functionality will be available after Supabase integration.
              </p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
