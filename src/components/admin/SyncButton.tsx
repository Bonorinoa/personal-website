import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface SyncButtonProps {
  source: 'orcid' | 'github' | 'google_scholar';
  sourceId: string;
  onSyncComplete?: (items: unknown[]) => void;
  onReposFetched?: (repos: unknown[]) => void;
  disabled?: boolean;
  className?: string;
}

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export function SyncButton({ 
  source, 
  sourceId, 
  onSyncComplete, 
  onReposFetched,
  disabled,
  className 
}: SyncButtonProps) {
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [itemCount, setItemCount] = useState<number | null>(null);

  const handleSync = async () => {
    setStatus('syncing');
    setError(null);
    setItemCount(null);

    try {
      let functionName: string;
      let payload: Record<string, string>;

      switch (source) {
        case 'orcid':
          functionName = 'sync-orcid';
          payload = { orcid_id: sourceId };
          break;
        case 'github':
          functionName = 'sync-github';
          payload = { username: sourceId };
          break;
        case 'google_scholar':
          // Google Scholar doesn't have a public API - show message
          setError('Google Scholar sync requires manual setup');
          setStatus('error');
          return;
        default:
          throw new Error(`Unknown source: ${source}`);
      }

      const { data, error: fnError } = await supabase.functions.invoke(functionName, {
        body: payload,
      });

      if (fnError) {
        throw fnError;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // GitHub returns repos for selection
      if (source === 'github' && data.repos) {
        onReposFetched?.(data.repos);
        setItemCount(data.repos.length);
        setStatus('success');
        return;
      }

      // ORCID returns items directly
      if (data.items) {
        onSyncComplete?.(data.items);
        setItemCount(data.items.length);
      }

      setStatus('success');
      
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);

    } catch (err) {
      console.error(`Sync error for ${source}:`, err);
      setError(err instanceof Error ? err.message : 'Sync failed');
      setStatus('error');
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'syncing':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'success':
        return <Check className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <RefreshCw className="w-4 h-4" />;
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'syncing':
        return 'Syncing...';
      case 'success':
        return itemCount !== null ? `Found ${itemCount}` : 'Synced';
      case 'error':
        return 'Failed';
      default:
        return 'Sync';
    }
  };

  return (
    <div className="space-y-1">
      <Button
        size="sm"
        variant={status === 'error' ? 'destructive' : status === 'success' ? 'default' : 'outline'}
        onClick={handleSync}
        disabled={disabled || status === 'syncing' || !sourceId}
        className={cn('gap-2', className)}
      >
        {getIcon()}
        {getLabel()}
      </Button>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
