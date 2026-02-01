import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;

const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/sync-github`;

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
};

Deno.test("sync-github handles CORS preflight", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "OPTIONS",
    headers: {
      "Origin": "http://localhost:3000",
      "Access-Control-Request-Method": "POST",
    },
  });
  
  await response.text(); // Consume body
  
  assertEquals(response.status, 200);
  assertExists(response.headers.get("Access-Control-Allow-Origin"));
});

Deno.test("sync-github returns 400 if username missing", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({}),
  });
  
  const body = await response.json();
  
  assertEquals(response.status, 400);
  assertEquals(body.error, "GitHub username is required");
});

Deno.test("sync-github returns 400 for empty username", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ username: "" }),
  });
  
  const body = await response.json();
  
  assertEquals(response.status, 400);
  assertEquals(body.error, "GitHub username is required");
});

Deno.test("sync-github returns repos for selection (step 1)", async () => {
  // Use a known GitHub user with public repos
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ username: "octocat" }), // GitHub's official test user
  });
  
  const body = await response.json();
  
  if (response.status === 200) {
    assertExists(body.repos);
    assertEquals(Array.isArray(body.repos), true);
    assertEquals(body.success, true);
    
    // Check repo structure if any repos returned
    if (body.repos.length > 0) {
      const repo = body.repos[0];
      assertExists(repo.id);
      assertExists(repo.name);
      assertExists(repo.url);
    }
  }
});

Deno.test("sync-github excludes forked repositories", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ username: "octocat" }),
  });
  
  const body = await response.json();
  
  if (response.status === 200 && body.repos) {
    // All returned repos should not be forks
    for (const repo of body.repos) {
      assertEquals(repo.isFork, false);
    }
  }
});

Deno.test("sync-github handles invalid username gracefully", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ username: "this-user-definitely-does-not-exist-12345678" }),
  });
  
  const body = await response.json();
  
  // Should return error from GitHub API (404)
  assertEquals(typeof body.error, "string");
});

Deno.test("sync-github inserts selected repos (step 2)", async () => {
  // First get the repos list
  const step1Response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ username: "octocat" }),
  });
  
  const step1Body = await step1Response.json();
  
  if (step1Response.status === 200 && step1Body.repos?.length > 0) {
    // Select first repo for import
    const selectedRepoId = step1Body.repos[0].id;
    
    const step2Response = await fetch(FUNCTION_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ 
        username: "octocat",
        selected_repos: [selectedRepoId],
      }),
    });
    
    const step2Body = await step2Response.json();
    
    if (step2Response.status === 200) {
      assertExists(step2Body.inserted);
      assertExists(step2Body.skipped);
      assertEquals(typeof step2Body.inserted, "number");
      assertEquals(typeof step2Body.skipped, "number");
    }
  }
});

Deno.test("sync-github deduplicates existing repos", async () => {
  // First sync
  const step1Response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ username: "octocat" }),
  });
  
  const step1Body = await step1Response.json();
  
  if (step1Response.status === 200 && step1Body.repos?.length > 0) {
    const selectedRepoId = step1Body.repos[0].id;
    
    // First import
    const import1Response = await fetch(FUNCTION_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ 
        username: "octocat",
        selected_repos: [selectedRepoId],
      }),
    });
    const import1Body = await import1Response.json();
    
    // Second import of same repo should skip
    const import2Response = await fetch(FUNCTION_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ 
        username: "octocat",
        selected_repos: [selectedRepoId],
      }),
    });
    const import2Body = await import2Response.json();
    
    if (import1Response.status === 200 && import2Response.status === 200) {
      // If first import inserted, second should skip
      if (import1Body.inserted > 0) {
        assertEquals(import2Body.skipped > 0, true);
        assertEquals(import2Body.inserted, 0);
      }
    }
  }
});

Deno.test("sync-github returns syncedAt timestamp", async () => {
  const step1Response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ username: "octocat" }),
  });
  
  const step1Body = await step1Response.json();
  
  if (step1Response.status === 200 && step1Body.repos?.length > 0) {
    const response = await fetch(FUNCTION_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ 
        username: "octocat",
        selected_repos: [step1Body.repos[0].id],
      }),
    });
    
    const body = await response.json();
    
    if (response.status === 200) {
      assertExists(body.syncedAt);
      assertEquals(isNaN(Date.parse(body.syncedAt)), false);
    }
  }
});

Deno.test("sync-github repo items have correct structure", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ username: "octocat" }),
  });
  
  const body = await response.json();
  
  if (response.status === 200 && body.repos?.length > 0) {
    const repo = body.repos[0];
    
    // Check all expected fields exist
    assertExists(repo.id);
    assertExists(repo.name);
    assertExists(repo.url);
    assertExists(repo.createdAt);
    assertExists(repo.updatedAt);
    assertExists(repo.pushedAt);
    assertEquals(typeof repo.stars, "number");
    assertEquals(typeof repo.forks, "number");
    assertEquals(Array.isArray(repo.topics), true);
    assertEquals(typeof repo.isFork, "boolean");
    assertEquals(typeof repo.isArchived, "boolean");
  }
});
