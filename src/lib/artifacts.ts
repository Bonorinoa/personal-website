import type { Artifact, InboxItem, CollaborationTag } from '@/data/types';
import artifactsData from '@/data/artifacts.json';
import inboxData from '@/data/inbox.json';

// Load all artifacts
export function getArtifacts(): Artifact[] {
  return artifactsData.artifacts as Artifact[];
}

// Get artifacts for Academic mode
export function getAcademicArtifacts(): Artifact[] {
  return getArtifacts().filter(
    (a) => a.mode_visibility === 'academic' || a.mode_visibility === 'both'
  );
}

// Get artifacts for Build mode (only those with demos/repos or collaboration info)
export function getBuildArtifacts(): Artifact[] {
  return getArtifacts().filter(
    (a) => 
      (a.mode_visibility === 'build' || a.mode_visibility === 'both') &&
      (a.links?.demo || a.links?.repo || a.collaboration_breakdown || a.tags?.length)
  );
}

// Get artifacts by section for Academic mode
export function getArtifactsBySection(section: string): Artifact[] {
  return getAcademicArtifacts().filter((a) => a.section === section);
}

// Get featured artifacts
export function getFeaturedArtifacts(): Artifact[] {
  return getArtifacts().filter((a) => a.featured);
}

// Filter Build artifacts by tag
export function filterByTag(artifacts: Artifact[], tag: CollaborationTag | null): Artifact[] {
  if (!tag) return artifacts;
  return artifacts.filter((a) => a.tags?.includes(tag));
}

// Get inbox items (Phase 2)
export function getInboxItems(): InboxItem[] {
  return (inboxData as { items: InboxItem[] }).items;
}

// Get inbox configuration (Phase 2)
export function getInboxConfig() {
  return (inboxData as { config: unknown }).config;
}

// Sort artifacts by date (newest first)
export function sortByDate(artifacts: Artifact[]): Artifact[] {
  return [...artifacts].sort((a, b) => {
    const dateA = a.endDate === 'current' ? new Date().toISOString() : a.endDate || a.date;
    const dateB = b.endDate === 'current' ? new Date().toISOString() : b.endDate || b.date;
    return dateB.localeCompare(dateA);
  });
}

// Group artifacts by type
export function groupByType(artifacts: Artifact[]): Record<string, Artifact[]> {
  return artifacts.reduce((acc, artifact) => {
    const type = artifact.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(artifact);
    return acc;
  }, {} as Record<string, Artifact[]>);
}


// Get artifacts grouped by year for timeline view
export function getArtifactsByYear(): Record<number, Artifact[]> {
  const artifacts = getBuildArtifacts();
  return artifacts.reduce((acc, artifact) => {
    const year = artifact.year || new Date(artifact.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(artifact);
    return acc;
  }, {} as Record<number, Artifact[]>);
}
