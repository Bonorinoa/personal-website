import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SyncButton } from './SyncButton';

// Create a standalone mock function that we'll use
const mockInvoke = vi.fn();

// Mock the supabase client module before any imports
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: (...args: unknown[]) => mockInvoke(...args),
    },
  },
}));

describe('SyncButton', () => {
  beforeEach(() => {
    mockInvoke.mockReset();
  });

  describe('rendering', () => {
    it('renders idle state with "Sync" label', () => {
      render(<SyncButton source="orcid" sourceId="0000-0000-0000-0001" />);
      expect(screen.getByRole('button')).toHaveTextContent('Sync');
    });

    it('is disabled when no sourceId provided', () => {
      render(<SyncButton source="orcid" sourceId="" />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('is disabled when disabled prop is true', () => {
      render(<SyncButton source="orcid" sourceId="0000-0000-0000-0001" disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('syncing state', () => {
    it('shows loading spinner during sync', async () => {
      // Never resolve to keep in syncing state
      mockInvoke.mockImplementation(() => new Promise(() => {}));

      render(<SyncButton source="orcid" sourceId="0000-0000-0000-0001" />);
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Syncing...')).toBeInTheDocument();
      });
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('success state', () => {
    it('shows success state with item count after ORCID sync', async () => {
      mockInvoke.mockResolvedValue({
        data: { inserted: 5, skipped: 2 },
        error: null,
      });

      const onSyncComplete = vi.fn();
      render(
        <SyncButton
          source="orcid"
          sourceId="0000-0000-0000-0001"
          onSyncComplete={onSyncComplete}
        />
      );

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Found 5')).toBeInTheDocument();
      });

      expect(onSyncComplete).toHaveBeenCalledWith({ inserted: 5, skipped: 2 });
    });

    it('shows success state with repo count for GitHub', async () => {
      mockInvoke.mockResolvedValue({
        data: { repos: [{}, {}, {}], count: 3 },
        error: null,
      });

      const onReposFetched = vi.fn();
      render(
        <SyncButton
          source="github"
          sourceId="testuser"
          onReposFetched={onReposFetched}
        />
      );

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Found 3')).toBeInTheDocument();
      });

      expect(onReposFetched).toHaveBeenCalledWith([{}, {}, {}]);
    });
  });

  describe('error state', () => {
    it('shows error state for function error', async () => {
      mockInvoke.mockResolvedValue({
        data: null,
        error: new Error('Network error'),
      });

      render(<SyncButton source="orcid" sourceId="0000-0000-0000-0001" />);
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Failed')).toBeInTheDocument();
      });
    });

    it('shows error for data.error response', async () => {
      mockInvoke.mockResolvedValue({
        data: { error: 'ORCID API error: 404' },
        error: null,
      });

      render(<SyncButton source="orcid" sourceId="invalid-id" />);
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Failed')).toBeInTheDocument();
        expect(screen.getByText('ORCID API error: 404')).toBeInTheDocument();
      });
    });

    it('shows message for google_scholar source', async () => {
      render(<SyncButton source="google_scholar" sourceId="some-id" />);
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Failed')).toBeInTheDocument();
        expect(screen.getByText('Google Scholar sync requires manual setup')).toBeInTheDocument();
      });
    });
  });

  describe('callbacks', () => {
    it('calls onSyncComplete with counts for ORCID', async () => {
      mockInvoke.mockResolvedValue({
        data: { inserted: 3, skipped: 1 },
        error: null,
      });

      const onSyncComplete = vi.fn();
      render(
        <SyncButton
          source="orcid"
          sourceId="0000-0000-0000-0001"
          onSyncComplete={onSyncComplete}
        />
      );

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(onSyncComplete).toHaveBeenCalledWith({ inserted: 3, skipped: 1 });
      });
    });

    it('calls onReposFetched for GitHub two-step flow', async () => {
      const repos = [
        { id: 'github-1', name: 'repo1' },
        { id: 'github-2', name: 'repo2' },
      ];
      mockInvoke.mockResolvedValue({
        data: { repos },
        error: null,
      });

      const onReposFetched = vi.fn();
      render(
        <SyncButton
          source="github"
          sourceId="testuser"
          onReposFetched={onReposFetched}
        />
      );

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(onReposFetched).toHaveBeenCalledWith(repos);
      });
    });
  });

  describe('edge function calls', () => {
    it('calls sync-orcid with orcid_id', async () => {
      mockInvoke.mockResolvedValue({
        data: { inserted: 0, skipped: 0 },
        error: null,
      });

      render(<SyncButton source="orcid" sourceId="0000-0000-0000-0001" />);
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(mockInvoke).toHaveBeenCalledWith('sync-orcid', {
          body: { orcid_id: '0000-0000-0000-0001' },
        });
      });
    });

    it('calls sync-github with username', async () => {
      mockInvoke.mockResolvedValue({
        data: { repos: [] },
        error: null,
      });

      render(<SyncButton source="github" sourceId="testuser" />);
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(mockInvoke).toHaveBeenCalledWith('sync-github', {
          body: { username: 'testuser' },
        });
      });
    });
  });
});
