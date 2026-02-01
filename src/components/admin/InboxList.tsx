import type { InboxItem } from '@/data/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Edit, Loader2, RefreshCw } from 'lucide-react';
import { useInboxItems, useApproveInboxItem, useRejectInboxItem } from '@/hooks/useInboxItems';
import { useToast } from '@/hooks/use-toast';

interface InboxListProps {
  onEdit?: (item: InboxItem) => void;
}

export function InboxList({ onEdit }: InboxListProps) {
  const { data: items = [], isLoading, error, refetch } = useInboxItems('pending');
  const approveMutation = useApproveInboxItem();
  const rejectMutation = useRejectInboxItem();
  const { toast } = useToast();

  const handleApprove = async (item: InboxItem) => {
    try {
      await approveMutation.mutateAsync({
        itemId: item.id,
        artifactData: item.suggestedArtifact as Record<string, unknown>,
      });
      toast({
        title: 'Approved',
        description: `"${item.suggestedArtifact?.title}" has been published.`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to approve item',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (item: InboxItem) => {
    try {
      await rejectMutation.mutateAsync(item.id);
      toast({
        title: 'Rejected',
        description: 'Item removed from inbox.',
        variant: 'destructive',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to reject item',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Loading inbox items...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="py-12 text-center">
          <p className="text-destructive mb-2">Failed to load inbox items</p>
          <p className="text-sm text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-2">No pending items in inbox</p>
          <p className="text-sm text-muted-foreground">
            Click "Sync" on a source below to discover new items from ORCID or GitHub.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {items.length} pending item{items.length !== 1 ? 's' : ''} for review
        </p>
        <Button variant="ghost" size="sm" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>
      
      {items.map((item) => (
        <Card key={item.id} className="bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">
                  {item.suggestedArtifact?.title || 'Untitled Item'}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {item.source}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Discovered: {new Date(item.discoveredAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <StatusBadge status={item.status} />
            </div>
          </CardHeader>
          <CardContent>
            {item.suggestedArtifact?.summary && (
              <p className="text-sm text-muted-foreground mb-4">
                {item.suggestedArtifact.summary}
              </p>
            )}
            
            {item.status === 'pending' && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleApprove(item)}
                  disabled={approveMutation.isPending}
                  className="gap-1"
                >
                  {approveMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onEdit?.(item)}
                  className="gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleReject(item)}
                  disabled={rejectMutation.isPending}
                  className="gap-1"
                >
                  {rejectMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  Reject
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: InboxItem['status'] }) {
  switch (status) {
    case 'pending':
      return <Badge variant="secondary">Pending</Badge>;
    case 'approved':
      return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return null;
  }
}
