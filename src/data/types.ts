// Canonical Artifact Schema for the personal website
// This schema supports both Academic and Build mode rendering

import type { AITask, LLMModel, TaskUsage } from './llm-tasks';

export type { AITask, LLMModel, TaskUsage };

export type ArtifactType = 
  | 'paper' 
  | 'project' 
  | 'talk' 
  | 'role' 
  | 'award' 
  | 'certification' 
  | 'education'
  | 'grant'
  | 'skill';

export type CollaborationTag = 
  | 'vibe-coded'      // ~20/80 human/AI - mostly AI-generated
  | 'vibe-engineered' // ~50/50 - designed systems, AI executed
  | 'ai-assisted';    // ~80/20 - mostly human, AI as pair programmer

export type ModeVisibility = 'academic' | 'build' | 'both';

// Demo types for embedding
export type DemoType = 'colab' | 'vercel' | 'streamlit' | 'github' | 'iframe' | 'video';

export interface DemoInfo {
  type: DemoType;
  url: string;
  thumbnail?: string;
}

export interface ArtifactLinks {
  repo?: string | null;
  demo?: string | null;
  paper?: string | null;
  website?: string | null;
}

export interface CollaborationBreakdown {
  human: string;                    // What I designed/implemented
  ai_tools?: string;                // Legacy: free-text description
  matrix?: TaskUsage[];             // New: structured LLM-Task mapping
  verification: string;             // Tests, benchmarks, evidence of quality
}

export interface Evidence {
  tests?: string | null;
  benchmarks?: string | null;
}

export type OrgScope = 'Personal' | 'EconLLM-Lab' | 'Perwell' | 'Cognitio-EDU' | 'Academic' | 'Other';

export interface SourceIds {
  doi?: string | null;
  arxiv?: string | null;
  ssrn?: string | null;
  orcid?: string | null;
  github?: string | null;
}

export interface CreditAttribution {
  /** What the human author did. */
  authored: string;
  /** What models/agents contributed. */
  assisted?: string;
  /** Named models or tools involved. */
  tools?: string[];
  /** How the result was checked. */
  verification?: string;
}


export interface Artifact {
  org?: OrgScope;        // GitHub org / workspace for Build mode grouping
  /** Build mode grouping: things that run vs. things that argue. */
  category?: 'software' | 'research';
  id: string;
  type: ArtifactType;
  title: string;
  subtitle?: string;
  organization?: string;
  location?: string;
  date: string;           // ISO date or date range
  endDate?: string;       // For ongoing roles/education
  summary: string;
  details?: string[];     // Bullet points for expanded view
  links?: ArtifactLinks;
  tags?: CollaborationTag[];
  featured?: boolean;
  mode_visibility: ModeVisibility;
  collaboration_breakdown?: CollaborationBreakdown;
  /** Plain-language credit attribution: what I did vs. what models did. */
  credit?: CreditAttribution;
  evidence?: Evidence;
  source_ids?: SourceIds;
  // For grouping in Academic mode
  section?: 'education' | 'experience' | 'teaching' | 'publications' | 'certifications' | 'skills' | 'honors' | 'grants';
  // For media in Build mode
  previewImage?: string;
  previewVideo?: string;
  // Enhanced demo info for Build mode
  demoInfo?: DemoInfo;
  // Year for timeline grouping
  year?: number;
  // Manually curated citation count (from Google Scholar)
  citations?: number;
}


// Phase 2: Inbox item for discovered artifacts pending approval
export interface InboxItem {
  id: string;
  source: 'orcid' | 'crossref' | 'github';
  discoveredAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rawData: unknown;
  suggestedArtifact?: Partial<Artifact>;
  notes?: string;
}

// Tag definitions for Build mode legend
export const TAG_DEFINITIONS: Record<CollaborationTag, { ratio: string; description: string }> = {
  'vibe-coded': {
    ratio: '~20/80',
    description: 'Mostly AI-generated; I provided direction/design feedback'
  },
  'vibe-engineered': {
    ratio: '~50/50',
    description: 'I designed systems + analyses; AI executed substantial work'
  },
  'ai-assisted': {
    ratio: '~80/20',
    description: 'I did most implementation; AI as pair programmer'
  }
};
