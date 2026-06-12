import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InboxList } from '@/components/admin/InboxList';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { SyncButton } from '@/components/admin/SyncButton';
import { RepoSelector } from '@/components/admin/RepoSelector';
import { getInboxConfig } from '@/lib/artifacts';
import { useAllArtifacts } from '@/hooks/useArtifacts';
import { useInboxItems } from '@/hooks/useInboxItems';
import { useAdminAuth, ADMIN_EMAILS } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { Inbox, FileEdit, BarChart3, FlaskConical, LogOut, ExternalLink, Loader2, Mail, RefreshCw, CheckCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


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
  const auth = useAdminAuth();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [signInError, setSignInError] = useState<string | null>(null);

  const [githubRepos, setGithubRepos] = useState<RepoItem[]>([]);
  const [showRepoSelector, setShowRepoSelector] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: artifacts = [], isLoading: artifactsLoading } = useAllArtifacts();
  const { data: pendingItems = [], refetch: refetchInbox } = useInboxItems('pending');

  const config = getInboxConfig() as {
    sources?: {
      orcid?: { enabled: boolean; id?: string; lastSync?: string | null };
      google_scholar?: { enabled: boolean; user_id?: string; lastSync?: string | null };
      github?: { enabled: boolean; username?: string; lastSync?: string | null };
      openalex?: { enabled: boolean; email_aliases?: string[]; lastSync?: string | null };
    };
    profile?: { name?: string; emails?: { primary?: string; aliases?: string[] } };
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    setSending(true);
    const { error } = await auth.signInWithMagicLink(email);
    setSending(false);
    if (error) setSignInError(error);
    else setSentTo(email);
  };

  const handleSyncComplete = (result: { inserted: number; skipped: number }) => {
    refetchInbox();
    toast({ title: 'Sync complete', description: `Added ${result.inserted} new items, ${result.skipped} duplicates skipped.` });
  };

  const handleReposFetched = (repos: unknown[]) => {
    setGithubRepos(repos as RepoItem[]);
    setShowRepoSelector(true);
  };

  const handleRepoImport = (result: { inserted: number; skipped: number }) => {
    setShowRepoSelector(false);
    refetchInbox();
    toast({ title: 'Repos imported', description: `Added ${result.inserted} repositories, ${result.skipped} duplicates skipped.` });
  };

  // ===== Loading =====
  if (auth.status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ===== Unauthorized (signed in with wrong email) =====
  if (auth.status === 'unauthorized') {
    return (
      <>
        <Helmet><title>Admin — not authorized</title><meta name="robots" content="noindex" /></Helmet>
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
          <div className="max-w-md w-full">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cobalt mb-6">Admin / forbidden</div>
            <h1 className="font-serif text-5xl mb-4">Not for you.</h1>
            <p className="text-muted-foreground text-sm mb-6">
              You&rsquo;re signed in as <span className="font-mono">{auth.user?.email}</span>, which isn&rsquo;t on the
              admin allowlist. If this is your site, add this email to <code className="font-mono text-xs bg-secondary px-1.5 py-0.5">ADMIN_EMAILS</code> in <code className="font-mono text-xs bg-secondary px-1.5 py-0.5">src/hooks/useAdminAuth.ts</code>.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => auth.signOut()}>Sign out</Button>
              <Button variant="ghost" onClick={() => navigate('/')}>Back to site</Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ===== Unauthenticated — magic link form =====
  if (auth.status === 'unauthenticated') {
    return (
      <>
        <Helmet><title>Admin — sign in</title><meta name="robots" content="noindex" /></Helmet>
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
          <div className="max-w-md w-full">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cobalt mb-6">Admin / sign in</div>
            <h1 className="font-serif text-5xl mb-2">Magic link.</h1>
            <p className="text-muted-foreground text-sm mb-8">
              Enter your allowlisted email and we&rsquo;ll send a one-time sign-in link. No password.
            </p>

            {sentTo ? (
              <div className="hairline p-6 bg-secondary/40">
                <Mail className="w-5 h-5 text-cobalt mb-3" />
                <p className="text-sm">
                  Link sent to <span className="font-mono">{sentTo}</span>. Check your inbox and click to sign in.
                </p>
                <button
                  onClick={() => { setSentTo(null); setEmail(''); }}
                  className="mt-4 font-mono text-xs uppercase tracking-[0.14em] link-cobalt"
                >
                  ← use a different email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSignIn} className="space-y-4">
                <Input
                  type="email"
                  autoFocus
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={signInError ? 'border-destructive' : ''}
                />
                {signInError && <p className="text-sm text-destructive">{signInError}</p>}
                <Button type="submit" disabled={sending} className="w-full">
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send magic link'}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Allowlist: {ADMIN_EMAILS.length} email{ADMIN_EMAILS.length !== 1 ? 's' : ''} configured.
                </p>
              </form>
            )}
            <div className="mt-10 hairline-t pt-6">
              <button onClick={() => navigate('/')} className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground transition-colors">
                ← back to site
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ===== Authenticated dashboard =====
  return (
    <>
      <Helmet><title>Admin Dashboard</title><meta name="robots" content="noindex" /></Helmet>
      <div className="min-h-screen bg-background">
        <header className="hairline-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-cobalt">Admin</span>
              <span className="font-serif text-lg">Dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline font-mono text-xs text-muted-foreground">{auth.user?.email}</span>
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>View site</Button>
              <Button variant="outline" size="sm" onClick={() => auth.signOut()}>
                <LogOut className="w-3.5 h-3.5 mr-2" /> Sign out
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="inbox" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="inbox" className="gap-2">
                <Inbox className="w-4 h-4" /><span className="hidden sm:inline">Inbox</span>
                {pendingItems.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-cobalt/15 text-cobalt text-xs">{pendingItems.length}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="content" className="gap-2"><FileEdit className="w-4 h-4" /><span className="hidden sm:inline">Content</span></TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2"><BarChart3 className="w-4 h-4" /><span className="hidden sm:inline">Analytics</span></TabsTrigger>
              <TabsTrigger value="widgets" className="gap-2"><FlaskConical className="w-4 h-4" /><span className="hidden sm:inline">Widgets</span></TabsTrigger>
            </TabsList>

            <TabsContent value="inbox" className="space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="font-serif text-2xl">Inbox</h2>
                  <p className="text-sm text-muted-foreground">Review and approve discovered artifacts.</p>
                </div>
                <div className="flex gap-2">
                  <SyncAllGithubButton onDone={(n) => {
                    refetchInbox();
                    toast({ title: 'GitHub sync complete', description: `Added ${n} new repos from Bonorinoa + 3 orgs.` });
                  }} />
                  <ApproveAllGithubButton pendingCount={pendingItems.filter((p: any) => p.source === 'github').length} onDone={(n) => {
                    refetchInbox();
                    toast({ title: 'Bulk approved', description: `Promoted ${n} GitHub items to live artifacts.` });
                  }} />
                </div>
              </div>
              <InboxList onEdit={(item) => console.log('Edit:', item)} />

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="text-base">Source Configuration</CardTitle>
                  <CardDescription>Configure external sources. Click Sync to fetch new items.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <SourceCard name="ORCID" enabled={config?.sources?.orcid?.enabled ?? false} configValue={config?.sources?.orcid?.id} lastSync={config?.sources?.orcid?.lastSync} description="Sync publications from ORCID" configNeeded="ORCID ID"
                      syncButton={<SyncButton source="orcid" sourceId={config?.sources?.orcid?.id || ''} onSyncComplete={handleSyncComplete} />}
                    />
                    <SourceCard name="Google Scholar" enabled={config?.sources?.google_scholar?.enabled ?? false} configValue={config?.sources?.google_scholar?.user_id} lastSync={config?.sources?.google_scholar?.lastSync} description="Citations and h-index" configNeeded="Scholar ID"
                      syncButton={<SyncButton source="google_scholar" sourceId={config?.sources?.google_scholar?.user_id || ''} onSyncComplete={handleSyncComplete} disabled />}
                    />
                    <SourceCard name="GitHub (single)" enabled={config?.sources?.github?.enabled ?? false} configValue={config?.sources?.github?.username} lastSync={config?.sources?.github?.lastSync} description="Per-user pick & choose" configNeeded="Username"
                      syncButton={<SyncButton source="github" sourceId={config?.sources?.github?.username || ''} onReposFetched={handleReposFetched} />}
                    />
                    <SourceCard name="OpenAlex" enabled={config?.sources?.openalex?.enabled ?? false}
                      configValue={config?.sources?.openalex?.email_aliases && config.sources.openalex.email_aliases.length > 0 ? `${config.sources.openalex.email_aliases.length} aliases` : undefined}
                      lastSync={config?.sources?.openalex?.lastSync} description="Works across email aliases" configNeeded="Email aliases"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>


            <TabsContent value="content" className="space-y-4">
              <div>
                <h2 className="font-serif text-2xl">Content</h2>
                <p className="text-sm text-muted-foreground">Edit visibility, tags, and featured status.</p>
              </div>
              {artifactsLoading ? (
                <Card><CardContent className="py-12 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                </CardContent></Card>
              ) : (
                <ContentEditor artifacts={artifacts} onUpdate={(a) => console.log('Update:', a)} />
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div>
                <h2 className="font-serif text-2xl">Analytics</h2>
                <p className="text-sm text-muted-foreground">Visitors and engagement.</p>
              </div>
              <Card><CardContent className="py-12 text-center">
                <BarChart3 className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
                <p className="font-medium">Analytics require a published app</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  Lovable&rsquo;s built-in analytics activate after you publish.
                </p>
                <Button variant="outline" className="mt-4 gap-2" onClick={() => window.open('https://docs.lovable.dev/features/analytics', '_blank')}>
                  <ExternalLink className="w-4 h-4" /> Learn more
                </Button>
              </CardContent></Card>
            </TabsContent>

            <TabsContent value="widgets" className="space-y-4">
              <div>
                <h2 className="font-serif text-2xl">Private widgets</h2>
                <p className="text-sm text-muted-foreground">Experimental features.</p>
              </div>
              <Card><CardContent className="py-12 text-center">
                <FlaskConical className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No widgets enabled.</p>
              </CardContent></Card>
            </TabsContent>
          </Tabs>
        </main>

        <RepoSelector
          repos={githubRepos}
          open={showRepoSelector}
          onOpenChange={setShowRepoSelector}
          onImport={handleRepoImport}
          username={config?.sources?.github?.username || ''}
        />
      </div>
    </>
  );
};

function SourceCard({
  name, enabled, configValue, lastSync, description, configNeeded, syncButton,
}: {
  name: string; enabled: boolean; configValue?: string; lastSync?: string | null;
  description: string; configNeeded: string; syncButton?: React.ReactNode;
}) {
  const isConfigured = !!configValue;
  const status = enabled ? 'Active' : isConfigured ? 'Ready' : 'Not configured';
  const dot = enabled ? 'bg-cobalt' : isConfigured ? 'bg-foreground/60' : 'bg-muted-foreground/40';

  return (
    <div className="p-4 hairline bg-background">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm">{name}</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
          {status}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{description}</p>
      {configValue ? (
        <p className="text-xs font-mono bg-secondary px-2 py-1 truncate mb-3" title={configValue}>{configValue}</p>
      ) : (
        <p className="text-xs text-muted-foreground mb-3">Needs: <code className="font-mono">{configNeeded}</code></p>
      )}
      {lastSync && <p className="text-xs text-muted-foreground mb-2">Last sync: {new Date(lastSync).toLocaleDateString()}</p>}
      {syncButton && <div className="mt-2">{syncButton}</div>}
    </div>
  );
}

export default Admin;
