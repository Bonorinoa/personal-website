import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { InboxItem } from '@/data/types';

interface DbInboxItem {
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

// Detect whether the Supabase backend is configured for this build.
const BACKEND_READY = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

function toInboxItem(row: DbInboxItem): InboxItem {
  return {
    id: row.id,
    source: row.source as InboxItem['source'],
    discoveredAt: row.discovered_at,
    status: row.status as InboxItem['status'],
    rawData: row.raw_data,
    suggestedArtifact: row.suggested_artifact as InboxItem['suggestedArtifact'],
    notes: row.notes || undefined,
  };
}

export function useInboxItems(status?: 'pending' | 'approved' | 'rejected') {
  return useQuery({
    queryKey: ['inbox-items', status],
    enabled: BACKEND_READY,
    queryFn: async () => {
      let query = supabase
        .from('inbox_items')
        .select('*')
        .order('discovered_at', { ascending: false });

      if (status) query = query.eq('status', status);

      const { data, error } = await query;
      if (error) {
        // Backend likely paused / unreachable — degrade quietly to empty list.
        console.warn('[inbox] backend unreachable, returning empty list:', error.message);
        return [] as InboxItem[];
      }
      return (data as DbInboxItem[]).map(toInboxItem);
    },
  });
}

export function useApproveInboxItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ itemId, artifactData }: { itemId: string; artifactData: Record<string, unknown> }) => {
      const { data, error } = await supabase.rpc('approve_inbox_item', {
        p_inbox_id: itemId,
        p_artifact_data: artifactData as unknown as Record<string, never>,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox-items'] });
      queryClient.invalidateQueries({ queryKey: ['artifacts'] });
    },
  });
}

export function useRejectInboxItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('inbox_items')
        .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
        .eq('id', itemId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inbox-items'] }),
  });
}

export function useUpdateInboxItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      itemId,
      updates,
    }: {
      itemId: string;
      updates: { suggested_artifact?: Record<string, unknown>; notes?: string };
    }) => {
      const { error } = await supabase
        .from('inbox_items')
        .update(updates as { suggested_artifact?: Record<string, never>; notes?: string })
        .eq('id', itemId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inbox-items'] }),
  });
}
