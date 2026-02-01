import type { Artifact } from '@/data/types';

export const mockProjectArtifact: Artifact = {
  id: 'artifact-project-1',
  type: 'project',
  title: 'Test Project',
  date: '2024-01-01',
  summary: 'A test project for unit tests',
  mode_visibility: 'build',
  tags: ['ai-assisted'],
  links: {
    repo: 'https://github.com/testuser/test-project',
    demo: 'https://test-project.vercel.app',
  },
};

export const mockPaperArtifact: Artifact = {
  id: 'artifact-paper-1',
  type: 'paper',
  title: 'Test Publication',
  date: '2024-02-15',
  summary: 'Published in Journal of Testing (2024)',
  mode_visibility: 'both',
  section: 'publications',
  source_ids: {
    doi: '10.1234/test.2024.001',
  },
  links: {
    paper: 'https://doi.org/10.1234/test.2024.001',
  },
};

export const mockAcademicOnlyArtifact: Artifact = {
  id: 'artifact-academic-1',
  type: 'education',
  title: 'PhD in Computer Science',
  subtitle: 'Machine Learning',
  organization: 'Test University',
  date: '2020-09-01',
  endDate: '2024-05-15',
  summary: 'Doctoral research in machine learning applications',
  mode_visibility: 'academic',
  section: 'education',
};

export const mockBuildOnlyArtifact: Artifact = {
  id: 'artifact-build-1',
  type: 'project',
  title: 'Vibe-Coded App',
  date: '2024-03-01',
  summary: 'An app built with AI assistance',
  mode_visibility: 'build',
  tags: ['vibe-coded'],
  links: {
    repo: 'https://github.com/testuser/vibe-coded-app',
  },
  collaboration_breakdown: {
    human: 'Designed the UI and wrote specs',
    verification: 'All tests passing',
  },
};

export const mockFeaturedArtifact: Artifact = {
  id: 'artifact-featured-1',
  type: 'project',
  title: 'Featured Project',
  date: '2024-04-01',
  summary: 'A featured showcase project',
  mode_visibility: 'both',
  featured: true,
  tags: ['vibe-engineered'],
  links: {
    repo: 'https://github.com/testuser/featured',
    demo: 'https://featured.app',
  },
  collaboration_breakdown: {
    human: 'Architecture and system design',
    verification: 'Benchmarked and tested',
    matrix: [
      { model: 'gpt-4', tasks: ['code-generation', 'code-review'] },
      { model: 'claude-3-sonnet', tasks: ['code-review', 'writing-drafting'] },
    ],
  },
};

export const mockRoleArtifact: Artifact = {
  id: 'artifact-role-1',
  type: 'role',
  title: 'Senior Engineer',
  organization: 'Tech Company',
  location: 'San Francisco, CA',
  date: '2022-01-01',
  endDate: 'current',
  summary: 'Leading development of ML infrastructure',
  mode_visibility: 'both',
  section: 'experience',
  details: [
    'Led team of 5 engineers',
    'Shipped production ML systems',
    'Mentored junior engineers',
  ],
};

export const mockArtifacts: Artifact[] = [
  mockProjectArtifact,
  mockPaperArtifact,
  mockAcademicOnlyArtifact,
  mockBuildOnlyArtifact,
  mockFeaturedArtifact,
  mockRoleArtifact,
];

export const mockAcademicArtifacts: Artifact[] = [
  mockPaperArtifact,
  mockAcademicOnlyArtifact,
  mockFeaturedArtifact,
  mockRoleArtifact,
];

export const mockBuildArtifacts: Artifact[] = [
  mockProjectArtifact,
  mockPaperArtifact,
  mockBuildOnlyArtifact,
  mockFeaturedArtifact,
  mockRoleArtifact,
];

// DB row format (snake_case) for testing transformations
export interface DbArtifactRow {
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
  featured: boolean | null;
  preview_image: string | null;
  preview_video: string | null;
  demo_info: unknown;
  year: number | null;
  inbox_item_id: string | null;
  created_at: string;
  updated_at: string;
}

export const mockDbArtifactRow: DbArtifactRow = {
  id: 'artifact-project-1',
  slug: 'test-project',
  type: 'project',
  title: 'Test Project',
  subtitle: null,
  organization: null,
  location: null,
  date: '2024-01-01',
  end_date: null,
  summary: 'A test project for unit tests',
  details: [],
  links: { repo: 'https://github.com/testuser/test-project' },
  tags: ['ai-assisted'],
  mode_visibility: 'build',
  section: null,
  collaboration_breakdown: null,
  source_ids: {},
  featured: false,
  preview_image: null,
  preview_video: null,
  demo_info: null,
  year: 2024,
  inbox_item_id: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};
