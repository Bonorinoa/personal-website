import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Artifact } from '@/data/types';
import artifactsJson from '@/data/artifacts.json';

interface DbArtifact {
  id: string;
  slug: string;
  type: string;
  title: string;
  subtitle: string | null;
  organization: string | null;
  location: string | null;
  date: string;
  end_date: string | null;
  summary: string;
  details: unknown;
  links: unknown;
  tags: string[] | null;
  mode_visibility: string;
  section: string | null;
  collaboration_breakdown: unknown;
  source_ids: unknown;
  featured: boolean;
  preview_image: string | null;
  preview_video: string | null;
  demo_info: unknown;
  year: number | null;
  created_at: string;
  updated_at: string;
}

// Transform DB row to Artifact
function toArtifact(row: DbArtifact): Artifact {
  return {
    id: row.id,
    type: row.type as Artifact['type'],
    title: row.title,
    subtitle: row.subtitle || undefined,
    organization: row.organization || undefined,
    location: row.location || undefined,
    date: row.date,
    endDate: row.end_date || undefined,
    summary: row.summary,
    details: (row.details as string[]) || undefined,
    links: row.links as Artifact['links'],
    tags: (row.tags as Artifact['tags']) || undefined,
    featured: row.featured,
    mode_visibility: row.mode_visibility as Artifact['mode_visibility'],
    collaboration_breakdown: row.collaboration_breakdown as Artifact['collaboration_breakdown'],
    source_ids: row.source_ids as Artifact['source_ids'],
    section: row.section as Artifact['section'],
    previewImage: row.preview_image || undefined,
    previewVideo: row.preview_video || undefined,
    demoInfo: row.demo_info as Artifact['demoInfo'],
    year: row.year || undefined,
  };
}

export function useArtifacts(options?: { 
  mode?: 'academic' | 'build' | 'both';
  section?: string;
  featured?: boolean;
}) {
  return useQuery({
    queryKey: ['artifacts', options],
    queryFn: async () => {
      let query = supabase
        .from('artifacts')
        .select('*')
        .order('date', { ascending: false });
      
      if (options?.mode && options.mode !== 'both') {
        query = query.or(`mode_visibility.eq.${options.mode},mode_visibility.eq.both`);
      }
      
      if (options?.section) {
        query = query.eq('section', options.section);
      }
      
      if (options?.featured !== undefined) {
        query = query.eq('featured', options.featured);
      }

      const { data, error } = await query;
      
      if (error) {
        console.warn('Failed to fetch artifacts from DB, using JSON fallback:', error.message);
        // Fallback to JSON file
        return (artifactsJson.artifacts as unknown as Artifact[]).filter(a => {
          if (options?.mode && options.mode !== 'both') {
            return a.mode_visibility === options.mode || a.mode_visibility === 'both';
          }
          if (options?.section) {
            return a.section === options.section;
          }
          if (options?.featured !== undefined) {
            return a.featured === options.featured;
          }
          return true;
        });
      }
      
      // If DB is empty, fallback to JSON
      if (!data || data.length === 0) {
        return (artifactsJson.artifacts as unknown as Artifact[]).filter(a => {
          if (options?.mode && options.mode !== 'both') {
            return a.mode_visibility === options.mode || a.mode_visibility === 'both';
          }
          if (options?.section) {
            return a.section === options.section;
          }
          if (options?.featured !== undefined) {
            return a.featured === options.featured;
          }
          return true;
        });
      }
      
      return (data as DbArtifact[]).map(toArtifact);
    },
  });
}

// Combined function for pages - DB first, JSON fallback
export function useAllArtifacts() {
  return useQuery({
    queryKey: ['all-artifacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artifacts')
        .select('*')
        .order('date', { ascending: false });
      
      if (error || !data || data.length === 0) {
        // Fallback to JSON
        return artifactsJson.artifacts as unknown as Artifact[];
      }
      
      return (data as DbArtifact[]).map(toArtifact);
    },
  });
}
