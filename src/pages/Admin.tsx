import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InboxList } from '@/components/admin/InboxList';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { getArtifacts, getInboxItems, getInboxConfig } from '@/lib/artifacts';
import { Inbox, FileEdit, BarChart3, FlaskConical, LogOut, Lock } from 'lucide-react';

const ADMIN_PASSWORD = 'admin123'; // TODO: Replace with proper auth

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const artifacts = getArtifacts();
  const inboxItems = getInboxItems();
  const config = getInboxConfig();

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
              TODO: Replace with Supabase authentication
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
              items={inboxItems}
              onApprove={(item) => console.log('Approve:', item)}
              onReject={(item) => console.log('Reject:', item)}
              onEdit={(item) => console.log('Edit:', item)}
            />

            {/* Phase 2 Configuration Panel */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-base">Source Configuration</CardTitle>
                <CardDescription>
                  Configure external sources for automatic artifact discovery.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <ConfigSource
                    name="ORCID"
                    enabled={(config as any)?.sources?.orcid?.enabled}
                    configValue={(config as any)?.sources?.orcid?.id}
                    description="Sync publications from your ORCID profile"
                    configNeeded="ORCID ID"
                  />
                  <ConfigSource
                    name="Google Scholar"
                    enabled={(config as any)?.sources?.google_scholar?.enabled}
                    configValue={(config as any)?.sources?.google_scholar?.user_id}
                    description="Import citations and h-index data"
                    configNeeded="Scholar User ID"
                  />
                  <ConfigSource
                    name="GitHub"
                    enabled={(config as any)?.sources?.github?.enabled}
                    configValue={(config as any)?.sources?.github?.username}
                    description="Import repositories and activity"
                    configNeeded="Username"
                  />
                  <ConfigSource
                    name="OpenAlex"
                    enabled={(config as any)?.sources?.openalex?.enabled}
                    configValue={(config as any)?.sources?.openalex?.email_aliases?.length > 0 ? `${(config as any).sources.openalex.email_aliases.length} aliases` : undefined}
                    description="Discover works across email aliases"
                    configNeeded="Email aliases"
                  />
                </div>
                
                {/* Profile info */}
                {(config as any)?.profile && (
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                    <h4 className="text-sm font-medium text-foreground mb-2">Profile Configuration</h4>
                    <div className="grid gap-2 text-xs text-muted-foreground">
                      <p><strong>Name:</strong> {(config as any).profile.name}</p>
                      <p><strong>Primary Email:</strong> {(config as any).profile.emails?.primary}</p>
                      <p><strong>Aliases:</strong> {(config as any).profile.emails?.aliases?.join(', ')}</p>
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
                <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Configure your analytics token in Phase 2 to enable tracking.
                </p>
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
    </div>
  );
};

function ConfigSource({ 
  name, 
  enabled, 
  configValue,
  description, 
  configNeeded 
}: { 
  name: string; 
  enabled: boolean; 
  configValue?: string;
  description: string;
  configNeeded: string;
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
        <p className="text-xs font-mono bg-muted px-2 py-1 rounded truncate" title={configValue}>
          {configValue}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Needs: <code className="bg-muted px-1 rounded">{configNeeded}</code>
        </p>
      )}
    </div>
  );
}

export default Admin;
