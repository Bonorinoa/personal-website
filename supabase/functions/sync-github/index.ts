import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  visibility: string;
}

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

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username, selected_repos } = await req.json();
    
    if (!username) {
      return new Response(
        JSON.stringify({ error: 'GitHub username is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching repos for GitHub user: ${username}`);

    // Fetch repos from GitHub API (public, no token needed for public repos)
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Lovable-Portfolio-Sync',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GitHub API error: ${response.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ error: `GitHub API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const repos: GitHubRepo[] = await response.json();

    console.log(`Found ${repos.length} repos`);

    // Transform to simplified repo items for selection
    const repoItems: RepoItem[] = repos
      .filter(repo => !repo.fork) // Exclude forks by default
      .map((repo) => ({
        id: `github-${repo.id}`,
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        topics: repo.topics || [],
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
        isFork: repo.fork,
        isArchived: repo.archived,
      }));

    // If selected_repos provided, convert to inbox items
    if (selected_repos && Array.isArray(selected_repos) && selected_repos.length > 0) {
      const selectedRepoItems = repoItems.filter(repo => 
        selected_repos.includes(repo.id) || selected_repos.includes(repo.name)
      );

      const inboxItems = selectedRepoItems.map(repo => ({
        id: repo.id,
        source: 'github' as const,
        discoveredAt: new Date().toISOString(),
        status: 'pending' as const,
        rawData: repo,
        suggestedArtifact: {
          title: repo.name.replace(/-/g, ' ').replace(/_/g, ' '),
          type: 'project' as const,
          date: repo.createdAt.split('T')[0],
          summary: repo.description || `A ${repo.language || 'code'} project`,
          mode_visibility: 'build' as const,
          section: 'experience' as const,
          tags: inferCollaborationTag(repo),
          source_ids: {
            github: repo.url,
          },
          links: {
            repo: repo.url,
            demo: repo.homepage || undefined,
          },
        },
      }));

      return new Response(
        JSON.stringify({ 
          success: true, 
          items: inboxItems,
          count: inboxItems.length,
          syncedAt: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return repo list for selection
    return new Response(
      JSON.stringify({ 
        success: true, 
        repos: repoItems,
        count: repoItems.length,
        message: 'Select repos to import',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sync-github:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Infer collaboration tag based on repo metadata
function inferCollaborationTag(repo: RepoItem): string[] {
  const topics = repo.topics.map(t => t.toLowerCase());
  
  // Check for AI-related topics
  if (topics.some(t => ['ai', 'llm', 'gpt', 'chatgpt', 'langchain', 'ml', 'machine-learning'].includes(t))) {
    return ['vibe-engineered'];
  }
  
  // Check for template/scaffold projects (likely AI-assisted)
  if (topics.some(t => ['template', 'boilerplate', 'starter'].includes(t))) {
    return ['vibe-coded'];
  }
  
  // Default to ai-assisted for recent projects
  const pushedDate = new Date(repo.pushedAt);
  const isRecent = (Date.now() - pushedDate.getTime()) < 365 * 24 * 60 * 60 * 1000; // within 1 year
  
  if (isRecent) {
    return ['ai-assisted'];
  }
  
  return [];
}
