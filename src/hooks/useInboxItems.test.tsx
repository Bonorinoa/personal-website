import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { mockDbRows, mockDbRow } from '@/test/fixtures/inbox-items';

// Mock Supabase client
const mockFrom = vi.fn();
const mockRpc = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
    rpc: (...args: unknown[]) => mockRpc(...args),
  },
}));

// Import after mocking
import { useInboxItems, useApproveInboxItem, useRejectInboxItem, useUpdateInboxItem } from './useInboxItems';

// Create test wrapper with QueryClientProvider
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useInboxItems', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('fetching', () => {
    it('fetches all items when no status filter provided', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockDbRows, error: null }),
      };
      mockFrom.mockReturnValue(mockQuery);

      const { result } = renderHook(() => useInboxItems(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockFrom).toHaveBeenCalledWith('inbox_items');
      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(mockQuery.order).toHaveBeenCalledWith('discovered_at', { ascending: false });
      expect(result.current.data).toHaveLength(2);
    });

    it('filters by status when provided', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [mockDbRow], error: null }),
      };
      mockFrom.mockReturnValue(mockQuery);

      const { result } = renderHook(() => useInboxItems('pending'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockQuery.eq).toHaveBeenCalledWith('status', 'pending');
      expect(result.current.data).toHaveLength(1);
    });

    it('transforms DB rows to InboxItem interface', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [mockDbRow], error: null }),
      };
      mockFrom.mockReturnValue(mockQuery);

      const { result } = renderHook(() => useInboxItems(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const item = result.current.data?.[0];
      expect(item).toMatchObject({
        id: mockDbRow.id,
        source: mockDbRow.source,
        status: mockDbRow.status,
        discoveredAt: mockDbRow.discovered_at, // camelCase transformation
        rawData: mockDbRow.raw_data,
        suggestedArtifact: mockDbRow.suggested_artifact,
      });
    });

    it('handles empty result gracefully', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
      mockFrom.mockReturnValue(mockQuery);

      const { result } = renderHook(() => useInboxItems(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual([]);
    });

    it('handles DB error', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: new Error('DB connection failed') }),
      };
      mockFrom.mockReturnValue(mockQuery);

      const { result } = renderHook(() => useInboxItems(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBeDefined();
    });
  });

  describe('useApproveInboxItem', () => {
    it('calls RPC with correct parameters', async () => {
      mockRpc.mockResolvedValue({ data: 'new-artifact-id', error: null });

      const { result } = renderHook(() => useApproveInboxItem(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({
        itemId: 'test-inbox-1',
        artifactData: { title: 'Test', type: 'paper' },
      });

      expect(mockRpc).toHaveBeenCalledWith('approve_inbox_item', {
        p_inbox_id: 'test-inbox-1',
        p_artifact_data: { title: 'Test', type: 'paper' },
      });
    });

    it('throws on RPC error', async () => {
      mockRpc.mockResolvedValue({ data: null, error: new Error('RPC failed') });

      const { result } = renderHook(() => useApproveInboxItem(), {
        wrapper: createWrapper(),
      });

      await expect(
        result.current.mutateAsync({
          itemId: 'test-inbox-1',
          artifactData: { title: 'Test' },
        })
      ).rejects.toThrow();
    });
  });

  describe('useRejectInboxItem', () => {
    it('updates status to rejected', async () => {
      const mockUpdate = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      };
      mockFrom.mockReturnValue(mockUpdate);

      const { result } = renderHook(() => useRejectInboxItem(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync('test-inbox-1');

      expect(mockFrom).toHaveBeenCalledWith('inbox_items');
      expect(mockUpdate.update).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'rejected',
          reviewed_at: expect.any(String),
        })
      );
      expect(mockUpdate.eq).toHaveBeenCalledWith('id', 'test-inbox-1');
    });
  });

  describe('useUpdateInboxItem', () => {
    it('updates suggested_artifact', async () => {
      const mockUpdate = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      };
      mockFrom.mockReturnValue(mockUpdate);

      const { result } = renderHook(() => useUpdateInboxItem(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({
        itemId: 'test-inbox-1',
        updates: { suggested_artifact: { title: 'Updated Title' } },
      });

      expect(mockUpdate.update).toHaveBeenCalledWith({
        suggested_artifact: { title: 'Updated Title' },
      });
    });

    it('updates notes field', async () => {
      const mockUpdate = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      };
      mockFrom.mockReturnValue(mockUpdate);

      const { result } = renderHook(() => useUpdateInboxItem(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({
        itemId: 'test-inbox-1',
        updates: { notes: 'Review notes here' },
      });

      expect(mockUpdate.update).toHaveBeenCalledWith({
        notes: 'Review notes here',
      });
    });
  });
});
