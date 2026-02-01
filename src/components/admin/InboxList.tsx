import type { InboxItem, Artifact } from '@/data/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Edit, ExternalLink } from 'lucide-react';

interface InboxListProps {
  items: InboxItem[];
  onApprove?: (item: InboxItem) => void;
  onReject?: (item: InboxItem) => void;
  onEdit?: (item: InboxItem) => void;
}

export function InboxList({ items, onApprove, onReject, onEdit }: InboxListProps) {
  if (items.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-2">No pending items in inbox</p>
          <p className="text-sm text-muted-foreground">
            Items discovered from ORCID, Crossref, and GitHub will appear here for review.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
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
                  onClick={() => onApprove?.(item)}
                  className="gap-1"
                >
                  <Check className="w-4 h-4" />
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
                  onClick={() => onReject?.(item)}
                  className="gap-1"
                >
                  <X className="w-4 h-4" />
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
