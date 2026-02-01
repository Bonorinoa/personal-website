import type { InboxItem } from '@/data/types';

export const mockPendingItem: InboxItem = {
  id: 'test-inbox-1',
  source: 'orcid',
  discoveredAt: '2024-01-15T00:00:00Z',
  status: 'pending',
  rawData: {
    'put-code': 12345,
    'work-summary': [{
      title: { title: { value: 'Test Publication Title' } },
      'publication-date': { year: { value: '2024' }, month: { value: '01' } },
      type: 'JOURNAL_ARTICLE',
      'external-ids': {
        'external-id': [{
          'external-id-type': 'doi',
          'external-id-value': '10.1234/test.2024.001',
          'external-id-url': { value: 'https://doi.org/10.1234/test.2024.001' },
        }],
      },
      'journal-title': { value: 'Journal of Testing' },
    }],
  },
  suggestedArtifact: {
    title: 'Test Publication Title',
    type: 'paper',
    date: '2024-01-01',
    summary: 'Published in Journal of Testing (2024)',
    mode_visibility: 'both',
    section: 'publications',
    source_ids: {
      doi: '10.1234/test.2024.001',
      orcid: '0000-0000-0000-0001/12345',
    },
    links: {
      paper: 'https://doi.org/10.1234/test.2024.001',
    },
  },
};

export const mockApprovedItem: InboxItem = {
  id: 'test-inbox-2',
  source: 'github',
  discoveredAt: '2024-02-10T00:00:00Z',
  status: 'approved',
  rawData: {
    id: 'github-98765',
    name: 'approved-project',
    description: 'An already approved project',
    url: 'https://github.com/testuser/approved-project',
    stars: 42,
  },
  suggestedArtifact: {
    title: 'Approved Project',
    type: 'project',
    date: '2024-02-01',
    summary: 'An already approved project',
    mode_visibility: 'build',
  },
};

export const mockRejectedItem: InboxItem = {
  id: 'test-inbox-3',
  source: 'orcid',
  discoveredAt: '2024-03-01T00:00:00Z',
  status: 'rejected',
  rawData: {},
  suggestedArtifact: {
    title: 'Rejected Publication',
    type: 'paper',
    date: '2024-03-01',
    summary: 'This was rejected',
    mode_visibility: 'academic',
  },
  notes: 'Not relevant to portfolio',
};

export const mockGitHubPendingItem: InboxItem = {
  id: 'test-inbox-4',
  source: 'github',
  discoveredAt: '2024-04-01T00:00:00Z',
  status: 'pending',
  rawData: {
    id: 'github-11111',
    name: 'ai-project',
    description: 'A project built with AI assistance',
    url: 'https://github.com/testuser/ai-project',
    homepage: 'https://ai-project.vercel.app',
    language: 'TypeScript',
    topics: ['ai', 'llm', 'react'],
    stars: 15,
    forks: 3,
    createdAt: '2024-03-15T00:00:00Z',
    pushedAt: '2024-04-01T00:00:00Z',
  },
  suggestedArtifact: {
    title: 'AI Project',
    type: 'project',
    date: '2024-03-15',
    summary: 'A project built with AI assistance',
    mode_visibility: 'build',
    tags: ['vibe-engineered'],
    links: {
      repo: 'https://github.com/testuser/ai-project',
      demo: 'https://ai-project.vercel.app',
    },
  },
};

export const mockPendingItems: InboxItem[] = [
  mockPendingItem,
  mockGitHubPendingItem,
];

export const mockAllItems: InboxItem[] = [
  mockPendingItem,
  mockApprovedItem,
  mockRejectedItem,
  mockGitHubPendingItem,
];

// DB row format (snake_case) for testing transformations
export interface DbInboxItemRow {
  id: string;
  source: string;
  external_id: string;
  status: string;
  raw_data: unknown;
  suggested_artifact: unknown;
  notes: string | null;
  discovered_at: string;
  reviewed_at: string | null;
  created_at: string;
}

export const mockDbRow: DbInboxItemRow = {
  id: 'test-inbox-1',
  source: 'orcid',
  external_id: 'orcid-12345',
  status: 'pending',
  raw_data: mockPendingItem.rawData,
  suggested_artifact: mockPendingItem.suggestedArtifact,
  notes: null,
  discovered_at: '2024-01-15T00:00:00Z',
  reviewed_at: null,
  created_at: '2024-01-15T00:00:00Z',
};

export const mockDbRows: DbInboxItemRow[] = [
  mockDbRow,
  {
    id: 'test-inbox-4',
    source: 'github',
    external_id: 'github-11111',
    status: 'pending',
    raw_data: mockGitHubPendingItem.rawData,
    suggested_artifact: mockGitHubPendingItem.suggestedArtifact,
    notes: null,
    discovered_at: '2024-04-01T00:00:00Z',
    reviewed_at: null,
    created_at: '2024-04-01T00:00:00Z',
  },
];
