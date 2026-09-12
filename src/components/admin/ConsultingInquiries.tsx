import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

interface Inquiry {
  id: string;
  decision: string;
  deadline: string;
  cost: string;
  email: string | null;
  status: string;
  created_at: string;
}

export function ConsultingInquiries() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.functions.invoke('consulting-inquiries', {
      body: { action: 'list' },
    });
    if (error) setError(error.message);
    else setItems((data as { inquiries: Inquiry[] })?.inquiries ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markRead = async (id: string) => {
    await supabase.functions.invoke('consulting-inquiries', {
      body: { action: 'mark', id, status: 'read' },
    });
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'read' } : i)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {items.length} submission{items.length === 1 ? '' : 's'} from /consulting
        </p>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Refresh
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && items.length === 0 && !error && (
        <p className="text-sm text-muted-foreground">No inquiries yet.</p>
      )}

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-md border p-4 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">
                {new Date(item.created_at).toLocaleString()}
                {item.status === 'new' && ' · new'}
              </span>
              {item.status === 'new' && (
                <Button variant="ghost" size="sm" onClick={() => markRead(item.id)}>
                  Mark read
                </Button>
              )}
            </div>
            <p className="text-sm whitespace-pre-wrap">{item.decision}</p>
            <p className="text-xs text-muted-foreground">Deadline: {item.deadline}</p>
            <p className="text-xs text-muted-foreground">Cost of being wrong: {item.cost}</p>
            {item.email && (
              <a className="text-xs underline" href={`mailto:${item.email}`}>
                {item.email}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
