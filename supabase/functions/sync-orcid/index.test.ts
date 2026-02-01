import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;

const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/sync-orcid`;

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
};

Deno.test("sync-orcid handles CORS preflight", async () => {
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

Deno.test("sync-orcid returns 400 if orcid_id missing", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({}),
  });
  
  const body = await response.json();
  
  assertEquals(response.status, 400);
  assertEquals(body.error, "ORCID ID is required");
});

Deno.test("sync-orcid returns 400 for empty orcid_id", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ orcid_id: "" }),
  });
  
  const body = await response.json();
  
  assertEquals(response.status, 400);
  assertEquals(body.error, "ORCID ID is required");
});

Deno.test("sync-orcid handles invalid ORCID ID gracefully", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ orcid_id: "invalid-orcid-format" }),
  });
  
  const body = await response.json();
  
  // Should return error from ORCID API (404 or similar)
  assertEquals(typeof body.error, "string");
});

Deno.test("sync-orcid returns response with expected structure", async () => {
  // Use a known ORCID ID that exists (this is a public ORCID for testing)
  // Note: This test relies on external API - may be flaky
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ orcid_id: "0000-0002-1825-0097" }), // ORCID test/example ID
  });
  
  const body = await response.json();
  
  // Response should have expected fields (even if empty/zero)
  if (response.status === 200) {
    assertExists(body.inserted);
    assertExists(body.skipped);
    assertEquals(typeof body.inserted, "number");
    assertEquals(typeof body.skipped, "number");
  } else {
    // API might return error for test ORCID, which is acceptable
    assertExists(body.error);
  }
});

Deno.test("sync-orcid deduplicates existing items", async () => {
  const orcidId = "0000-0002-1825-0097"; // ORCID test ID
  
  // First sync
  const response1 = await fetch(FUNCTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ orcid_id: orcidId }),
  });
  const body1 = await response1.json();
  
  // Second sync should skip previously inserted items
  const response2 = await fetch(FUNCTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ orcid_id: orcidId }),
  });
  const body2 = await response2.json();
  
  // If first sync succeeded, second should have more skipped
  if (response1.status === 200 && response2.status === 200) {
    // Second sync should have skipped at least as many as first inserted
    assertEquals(body2.skipped >= body1.inserted, true);
  }
});

Deno.test("sync-orcid returns syncedAt timestamp", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ orcid_id: "0000-0002-1825-0097" }),
  });
  
  const body = await response.json();
  
  if (response.status === 200) {
    assertExists(body.syncedAt);
    // Should be valid ISO date
    assertEquals(isNaN(Date.parse(body.syncedAt)), false);
  }
});
