import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

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

    // Initialize Supabase client with service role for DB writes
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    // If selected_repos provided, insert into inbox_items
    if (selected_repos && Array.isArray(selected_repos) && selected_repos.length > 0) {
      const selectedRepoItems = repoItems.filter(repo => 
        selected_repos.includes(repo.id) || selected_repos.includes(repo.name)
      );

      // Get existing external_ids to check for duplicates
      const { data: existingItems } = await supabase
        .from('inbox_items')
        .select('external_id')
        .eq('source', 'github');
      
      const existingIds = new Set(existingItems?.map(item => item.external_id) || []);

      // Filter out duplicates and prepare items
      const newItems: Array<{
        source: string;
        external_id: string;
        status: string;
        raw_data: unknown;
        suggested_artifact: unknown;
        discovered_at: string;
      }> = [];

      let skippedCount = 0;

      for (const repo of selectedRepoItems) {
        if (existingIds.has(repo.id)) {
          skippedCount++;
          continue;
        }

        newItems.push({
          source: 'github',
          external_id: repo.id,
          status: 'pending',
          raw_data: repo,
          suggested_artifact: {
            title: repo.name.replace(/-/g, ' ').replace(/_/g, ' '),
            type: 'project',
            date: repo.createdAt.split('T')[0],
            summary: repo.description || `A ${repo.language || 'code'} project`,
            mode_visibility: 'build',
            section: 'experience',
            tags: inferCollaborationTag(repo),
            source_ids: {
              github: repo.url,
            },
            links: {
              repo: repo.url,
              demo: repo.homepage || null,
            },
          },
          discovered_at: new Date().toISOString(),
        });
      }

      // Insert new items into database
      let insertedCount = 0;
      if (newItems.length > 0) {
        const { data: inserted, error } = await supabase
          .from('inbox_items')
          .insert(newItems)
          .select();

        if (error) {
          console.error('Database insert error:', error);
          return new Response(
            JSON.stringify({ error: `Database error: ${error.message}` }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        insertedCount = inserted?.length || 0;
      }

      console.log(`Inserted ${insertedCount} new items, skipped ${skippedCount} duplicates`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          inserted: insertedCount,
          skipped: skippedCount,
          syncedAt: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return repo list for selection (first step of two-step flow)
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
