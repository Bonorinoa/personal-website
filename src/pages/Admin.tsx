import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InboxList } from '@/components/admin/InboxList';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { SyncButton } from '@/components/admin/SyncButton';
import { RepoSelector } from '@/components/admin/RepoSelector';
import { getArtifacts, getInboxItems, getInboxConfig } from '@/lib/artifacts';
import { Inbox, FileEdit, BarChart3, FlaskConical, LogOut, Lock, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { InboxItem } from '@/data/types';

const ADMIN_PASSWORD = 'admin123'; // TODO: Replace with proper auth

interface RepoItem {
  id: string;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  isFork: boolean;
  isArchived: boolean;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pendingItems, setPendingItems] = useState<InboxItem[]>([]);
  const [githubRepos, setGithubRepos] = useState<RepoItem[]>([]);
  const [showRepoSelector, setShowRepoSelector] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const artifacts = getArtifacts();
  const inboxItems = getInboxItems();
  const config = getInboxConfig() as {
    sources?: {
      orcid?: { enabled: boolean; id?: string; lastSync?: string | null };
      google_scholar?: { enabled: boolean; user_id?: string; lastSync?: string | null };
      github?: { enabled: boolean; username?: string; lastSync?: string | null };
      openalex?: { enabled: boolean; email_aliases?: string[]; lastSync?: string | null };
    };
    profile?: {
      name?: string;
      emails?: { primary?: string; aliases?: string[] };
    };
  };

  const allInboxItems = [...inboxItems, ...pendingItems];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleSyncComplete = (items: unknown[]) => {
    const newItems = items as InboxItem[];
    setPendingItems(prev => [...prev, ...newItems]);
    toast({
      title: 'Sync complete',
      description: `Found ${newItems.length} new items for review.`,
    });
  };

  const handleReposFetched = (repos: unknown[]) => {
    setGithubRepos(repos as RepoItem[]);
    setShowRepoSelector(true);
  };

  const handleRepoImport = (items: unknown[]) => {
    const newItems = items as InboxItem[];
    setPendingItems(prev => [...prev, ...newItems]);
    setShowRepoSelector(false);
    toast({
      title: 'Repos imported',
      description: `${newItems.length} repositories added to inbox.`,
    });
  };

  const handleApprove = (item: InboxItem) => {
    console.log('Approve:', item);
    setPendingItems(prev => prev.filter(i => i.id !== item.id));
    toast({
      title: 'Approved',
      description: `"${item.suggestedArtifact?.title}" will be added after Supabase integration.`,
    });
  };

  const handleReject = (item: InboxItem) => {
    setPendingItems(prev => prev.filter(i => i.id !== item.id));
    toast({
      title: 'Rejected',
      description: 'Item removed from inbox.',
      variant: 'destructive',
    });
  };

  // Password prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>
              Enter the admin password to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error ? 'border-destructive' : ''}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button type="submit" className="w-full">
                Access Dashboard
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              TODO: Replace with proper authentication
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              View Site
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="inbox" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="inbox" className="gap-2">
              <Inbox className="w-4 h-4" />
              <span className="hidden sm:inline">Inbox</span>
              {allInboxItems.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                  {allInboxItems.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <FileEdit className="w-4 h-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="widgets" className="gap-2">
              <FlaskConical className="w-4 h-4" />
              <span className="hidden sm:inline">Widgets</span>
            </TabsTrigger>
          </TabsList>

          {/* Inbox Tab */}
          <TabsContent value="inbox" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Inbox</h2>
                <p className="text-sm text-muted-foreground">
                  Review and approve discovered artifacts from external sources.
                </p>
              </div>
            </div>
            <InboxList 
              items={allInboxItems}
              onApprove={handleApprove}
              onReject={handleReject}
              onEdit={(item) => console.log('Edit:', item)}
            />

            {/* Source Configuration Panel with Sync */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-base">Source Configuration</CardTitle>
                <CardDescription>
                  Configure external sources for automatic artifact discovery. Click "Sync" to fetch new items.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <SourceCard
                    name="ORCID"
                    enabled={config?.sources?.orcid?.enabled ?? false}
                    configValue={config?.sources?.orcid?.id}
                    lastSync={config?.sources?.orcid?.lastSync}
                    description="Sync publications from your ORCID profile"
                    configNeeded="ORCID ID"
                    syncButton={
                      <SyncButton
                        source="orcid"
                        sourceId={config?.sources?.orcid?.id || ''}
                        onSyncComplete={handleSyncComplete}
                      />
                    }
                  />
                  <SourceCard
                    name="Google Scholar"
                    enabled={config?.sources?.google_scholar?.enabled ?? false}
                    configValue={config?.sources?.google_scholar?.user_id}
                    lastSync={config?.sources?.google_scholar?.lastSync}
                    description="Import citations and h-index data"
                    configNeeded="Scholar User ID"
                    syncButton={
                      <SyncButton
                        source="google_scholar"
                        sourceId={config?.sources?.google_scholar?.user_id || ''}
                        onSyncComplete={handleSyncComplete}
                        disabled // No public API
                      />
                    }
                  />
                  <SourceCard
                    name="GitHub"
                    enabled={config?.sources?.github?.enabled ?? false}
                    configValue={config?.sources?.github?.username}
                    lastSync={config?.sources?.github?.lastSync}
                    description="Import repositories and activity"
                    configNeeded="Username"
                    syncButton={
                      <SyncButton
                        source="github"
                        sourceId={config?.sources?.github?.username || ''}
                        onReposFetched={handleReposFetched}
                      />
                    }
                  />
                  <SourceCard
                    name="OpenAlex"
                    enabled={config?.sources?.openalex?.enabled ?? false}
                    configValue={
                      config?.sources?.openalex?.email_aliases && config.sources.openalex.email_aliases.length > 0 
                        ? `${config.sources.openalex.email_aliases.length} aliases` 
                        : undefined
                    }
                    lastSync={config?.sources?.openalex?.lastSync}
                    description="Discover works across email aliases"
                    configNeeded="Email aliases"
                  />
                </div>
                
                {/* Profile info */}
                {config?.profile && (
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                    <h4 className="text-sm font-medium text-foreground mb-2">Profile Configuration</h4>
                    <div className="grid gap-2 text-xs text-muted-foreground">
                      <p><strong>Name:</strong> {config.profile.name}</p>
                      <p><strong>Primary Email:</strong> {config.profile.emails?.primary}</p>
                      <p><strong>Aliases:</strong> {config.profile.emails?.aliases?.join(', ')}</p>
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Edit <code className="bg-muted px-1 rounded">src/data/inbox.json</code> to update source configuration.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Content Management</h2>
              <p className="text-sm text-muted-foreground">
                Edit visibility, tags, and featured status for your artifacts.
              </p>
            </div>
            <ContentEditor 
              artifacts={artifacts}
              onUpdate={(artifact) => console.log('Update:', artifact)}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Analytics</h2>
              <p className="text-sm text-muted-foreground">
                Track visitors and engagement across your site.
              </p>
            </div>
            <Card>
              <CardContent className="py-12 text-center">
                <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground font-medium">Analytics require a published app</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  Analytics will be available after you publish your site. Lovable's built-in analytics will track 
                  page views, visitors, and engagement automatically.
                </p>
                <Button variant="outline" className="mt-4 gap-2" onClick={() => window.open('https://docs.lovable.dev/features/analytics', '_blank')}>
                  <ExternalLink className="w-4 h-4" />
                  Learn about Analytics
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Widgets Tab */}
          <TabsContent value="widgets" className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Private Widgets</h2>
              <p className="text-sm text-muted-foreground">
                Experimental features and beta widgets (private only).
              </p>
            </div>
            <Card>
              <CardContent className="py-12 text-center">
                <FlaskConical className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No widgets enabled</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Future: News mentions, influence experiments, and more.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* GitHub Repo Selector Modal */}
      <RepoSelector
        repos={githubRepos}
        open={showRepoSelector}
        onOpenChange={setShowRepoSelector}
        onImport={handleRepoImport}
        username={config?.sources?.github?.username || ''}
      />
    </div>
  );
};

function SourceCard({ 
  name, 
  enabled, 
  configValue,
  lastSync,
  description, 
  configNeeded,
  syncButton,
}: { 
  name: string; 
  enabled: boolean; 
  configValue?: string;
  lastSync?: string | null;
  description: string;
  configNeeded: string;
  syncButton?: React.ReactNode;
}) {
  const isConfigured = !!configValue;
  
  return (
    <div className={`p-4 rounded-lg border ${enabled ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' : isConfigured ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800' : 'bg-muted/50 border-border'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-foreground">{name}</span>
        <span className={`text-xs px-2 py-0.5 rounded ${enabled ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' : isConfigured ? 'bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200' : 'bg-muted text-muted-foreground'}`}>
          {enabled ? 'Active' : isConfigured ? 'Ready' : 'Not configured'}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{description}</p>
      {configValue ? (
        <p className="text-xs font-mono bg-muted px-2 py-1 rounded truncate mb-2" title={configValue}>
          {configValue}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground mb-2">
          Needs: <code className="bg-muted px-1 rounded">{configNeeded}</code>
        </p>
      )}
      {lastSync && (
        <p className="text-xs text-muted-foreground mb-2">
          Last sync: {new Date(lastSync).toLocaleDateString()}
        </p>
      )}
      {syncButton && (
        <div className="mt-2">
          {syncButton}
        </div>
      )}
    </div>
  );
}

export default Admin;
