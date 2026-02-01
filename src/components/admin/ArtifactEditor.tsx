import { useState, useEffect } from 'react';
import type { Artifact, ModeVisibility, ArtifactType, CollaborationTag } from '@/data/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, X, Plus, Trash2 } from 'lucide-react';

interface ArtifactEditorProps {
  artifact: Artifact | null;
  onSave: (artifact: Artifact) => void;
  onCancel: () => void;
}

const ARTIFACT_TYPES: ArtifactType[] = ['paper', 'project', 'talk', 'role', 'award', 'certification', 'education', 'grant', 'skill'];
const SECTIONS = ['education', 'experience', 'teaching', 'publications', 'certifications', 'skills', 'honors', 'grants'];
const VISIBILITY_OPTIONS: ModeVisibility[] = ['academic', 'build', 'both'];
const COLLABORATION_TAGS: CollaborationTag[] = ['vibe-coded', 'vibe-engineered', 'ai-assisted'];

export function ArtifactEditor({ artifact, onSave, onCancel }: ArtifactEditorProps) {
  const [formData, setFormData] = useState<Artifact | null>(null);
  const [newDetail, setNewDetail] = useState('');

  useEffect(() => {
    setFormData(artifact ? { ...artifact } : null);
  }, [artifact]);

  if (!formData) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">Select an artifact to edit</p>
        </CardContent>
      </Card>
    );
  }

  const updateField = <K extends keyof Artifact>(key: K, value: Artifact[K]) => {
    setFormData(prev => prev ? { ...prev, [key]: value } : null);
  };

  const updateLink = (key: keyof NonNullable<Artifact['links']>, value: string) => {
    setFormData(prev => prev ? {
      ...prev,
      links: { ...prev.links, [key]: value || undefined }
    } : null);
  };

  const toggleTag = (tag: CollaborationTag) => {
    const currentTags = formData.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    updateField('tags', newTags);
  };

  const addDetail = () => {
    if (newDetail.trim()) {
      const details = formData.details || [];
      updateField('details', [...details, newDetail.trim()]);
      setNewDetail('');
    }
  };

  const removeDetail = (index: number) => {
    const details = formData.details || [];
    updateField('details', details.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Edit Artifact</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1">
        <CardContent className="p-4 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle || ''}
                onChange={(e) => updateField('subtitle', e.target.value)}
                placeholder="Optional subtitle"
              />
            </div>

            <div>
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => updateField('summary', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(v) => updateField('type', v as ArtifactType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ARTIFACT_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="section">Section</Label>
                <Select value={formData.section || ''} onValueChange={(v) => updateField('section', v as Artifact['section'])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTIONS.map(section => (
                      <SelectItem key={section} value={section}>
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  value={formData.endDate || ''}
                  onChange={(e) => updateField('endDate', e.target.value)}
                  placeholder="YYYY-MM-DD or 'current'"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={formData.organization || ''}
                  onChange={(e) => updateField('organization', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => updateField('location', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Visibility & Featured */}
          <div className="space-y-4 border-t pt-4">
            <div>
              <Label>Visibility</Label>
              <div className="flex gap-2 mt-2">
                {VISIBILITY_OPTIONS.map(vis => (
                  <Button
                    key={vis}
                    size="sm"
                    variant={formData.mode_visibility === vis ? 'default' : 'outline'}
                    onClick={() => updateField('mode_visibility', vis)}
                  >
                    {vis.charAt(0).toUpperCase() + vis.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="featured">Featured</Label>
              <Switch
                id="featured"
                checked={formData.featured || false}
                onCheckedChange={(checked) => updateField('featured', checked)}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2 border-t pt-4">
            <Label>Collaboration Tags</Label>
            <div className="flex flex-wrap gap-2">
              {COLLABORATION_TAGS.map(tag => (
                <Badge
                  key={tag}
                  variant={formData.tags?.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4 border-t pt-4">
            <Label>Links</Label>
            <div className="grid gap-3">
              <div>
                <Label htmlFor="link-repo" className="text-xs">Repository</Label>
                <Input
                  id="link-repo"
                  value={formData.links?.repo || ''}
                  onChange={(e) => updateLink('repo', e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <Label htmlFor="link-demo" className="text-xs">Demo</Label>
                <Input
                  id="link-demo"
                  value={formData.links?.demo || ''}
                  onChange={(e) => updateLink('demo', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="link-paper" className="text-xs">Paper</Label>
                <Input
                  id="link-paper"
                  value={formData.links?.paper || ''}
                  onChange={(e) => updateLink('paper', e.target.value)}
                  placeholder="https://doi.org/..."
                />
              </div>
              <div>
                <Label htmlFor="link-website" className="text-xs">Website</Label>
                <Input
                  id="link-website"
                  value={formData.links?.website || ''}
                  onChange={(e) => updateLink('website', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 border-t pt-4">
            <Label>Details (Bullet Points)</Label>
            <div className="space-y-2">
              {formData.details?.map((detail, index) => (
                <div key={index} className="flex gap-2">
                  <Input value={detail} readOnly className="flex-1" />
                  <Button variant="ghost" size="icon" onClick={() => removeDetail(index)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                  placeholder="Add a detail..."
                  onKeyDown={(e) => e.key === 'Enter' && addDetail()}
                />
                <Button variant="outline" size="icon" onClick={addDetail}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Image */}
          <div className="space-y-2 border-t pt-4">
            <Label htmlFor="previewImage">Preview Image URL</Label>
            <Input
              id="previewImage"
              value={formData.previewImage || ''}
              onChange={(e) => updateField('previewImage', e.target.value)}
              placeholder="/images/project-preview.png"
            />
          </div>

          {/* Local storage notice */}
          <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
            <strong>Note:</strong> Changes are saved to local storage. Use "Export JSON" to persist permanently.
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
