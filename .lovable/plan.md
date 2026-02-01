
# Test Suite Plan: Admin Panel & Data Pipeline

## Overview

This plan outlines a comprehensive test suite covering the admin panel functionality and the data collection/sync pipeline. Tests are organized by layer: unit tests for utilities and hooks, integration tests for edge functions, and component tests for the admin UI.

---

## Test Architecture

```text
src/
├── hooks/
│   ├── useInboxItems.test.ts       # Hook tests (mocked Supabase)
│   └── useArtifacts.test.ts        # Hook tests with JSON fallback
├── lib/
│   └── artifacts.test.ts           # Pure utility function tests
├── components/admin/
│   ├── InboxList.test.tsx          # Component rendering & interactions
│   ├── SyncButton.test.tsx         # Sync button state machine
│   ├── RepoSelector.test.tsx       # Repo filtering & selection
│   └── ContentEditor.test.tsx      # Content management UI
└── test/
    └── setup.ts                    # Existing setup file

supabase/functions/
├── sync-orcid/
│   └── index.test.ts               # Edge function tests (Deno)
└── sync-github/
    └── index.test.ts               # Edge function tests (Deno)
```

---

## Test Categories

### 1. Unit Tests: Utility Functions

**File: `src/lib/artifacts.test.ts`**

| Test Case | Description |
|-----------|-------------|
| `getArtifacts` returns all artifacts from JSON | Verify JSON loading works |
| `getAcademicArtifacts` filters by mode_visibility | Only 'academic' or 'both' returned |
| `getBuildArtifacts` filters by mode + links/tags | Correct filtering logic |
| `filterByTag` returns artifacts matching tag | Tag filtering works |
| `filterByTag(null)` returns all artifacts | Null tag returns unfiltered |
| `sortByDate` orders newest first | Date sorting, handles 'current' |
| `groupByType` creates correct buckets | Grouping logic |
| `getAggregateMatrixData` extracts matrix info | Collaboration matrix aggregation |

---

### 2. Hook Tests: Data Fetching Layer

**File: `src/hooks/useInboxItems.test.ts`**

| Test Case | Description |
|-----------|-------------|
| `useInboxItems()` fetches all items | No filter returns all |
| `useInboxItems('pending')` filters by status | Status filter applied |
| transforms DB rows to InboxItem interface | Field mapping correct |
| handles empty result gracefully | Returns empty array |
| handles DB error | Error state exposed |

**File: `src/hooks/useArtifacts.test.ts`**

| Test Case | Description |
|-----------|-------------|
| `useArtifacts()` fetches from database | DB is primary source |
| `useArtifacts({ mode: 'academic' })` filters correctly | Mode filter SQL |
| falls back to JSON when DB is empty | Fallback triggers |
| falls back to JSON on DB error | Error recovery |
| `useAllArtifacts()` returns combined data | All artifacts accessible |

---

### 3. Mutation Tests: Approve/Reject Flow

**File: `src/hooks/useInboxItems.test.ts` (continued)**

| Test Case | Description |
|-----------|-------------|
| `useApproveInboxItem` calls RPC correctly | Correct RPC params |
| `useApproveInboxItem` invalidates queries | Cache refresh |
| `useRejectInboxItem` updates status to 'rejected' | Status change |
| `useRejectInboxItem` sets reviewed_at timestamp | Timestamp set |
| `useUpdateInboxItem` updates suggested_artifact | Edit before approve |

---

### 4. Component Tests: Admin UI

**File: `src/components/admin/InboxList.test.tsx`**

| Test Case | Description |
|-----------|-------------|
| renders loading state initially | Spinner shown |
| renders empty state when no items | "No pending items" message |
| renders error state with retry button | Error + retry works |
| renders pending items with title/source | Item cards shown |
| Approve button calls mutation | Click triggers approve |
| Approve button shows loading during mutation | Disabled + spinner |
| Reject button calls mutation with confirmation | Rejection flow |
| Edit button calls onEdit callback | Edit handler invoked |
| Refresh button refetches data | Refetch triggered |

**File: `src/components/admin/SyncButton.test.tsx`**

| Test Case | Description |
|-----------|-------------|
| renders idle state with "Sync" label | Initial state |
| shows loading spinner during sync | Syncing state |
| shows success state with item count | Success feedback |
| shows error state with message | Error display |
| disabled when no sourceId provided | Validation |
| disabled for google_scholar source | Not implemented |
| calls onSyncComplete with counts | Callback params |
| calls onReposFetched for GitHub | Two-step flow |
| resets to idle after 3 seconds | Auto-reset |

**File: `src/components/admin/RepoSelector.test.tsx`**

| Test Case | Description |
|-----------|-------------|
| renders repo list when open | Modal content |
| filters repos by search query | Name/desc/topics |
| filters repos by language | Language dropdown |
| filters repos by minimum stars | Star threshold |
| Select All selects filtered repos | Bulk select |
| Select None clears selection | Bulk deselect |
| toggles individual repo selection | Checkbox click |
| Import button disabled when none selected | Validation |
| Import calls edge function with selected IDs | API call |
| closes dialog after successful import | Modal closes |

**File: `src/components/admin/ContentEditor.test.tsx`**

| Test Case | Description |
|-----------|-------------|
| renders artifact list | Left panel |
| filters artifacts by search | Text search |
| filters artifacts by type | Type dropdown |
| filters artifacts by visibility | Mode filter |
| sorts artifacts by date/title/type | Sort options |
| clicking artifact opens editor | Selection |
| editor shows all fields | Form fields |
| saving updates local storage | Persistence |
| Export JSON downloads file | Export works |
| Clear Edits resets to initial | Reset function |

---

### 5. Edge Function Tests (Deno)

**File: `supabase/functions/sync-orcid/index.test.ts`**

| Test Case | Description |
|-----------|-------------|
| returns 400 if orcid_id missing | Input validation |
| fetches works from ORCID API | API call made |
| handles ORCID API errors gracefully | Error propagation |
| transforms ORCID work to inbox item | Field mapping |
| extracts DOI from external IDs | DOI parsing |
| skips existing items (deduplication) | external_id check |
| inserts new items into inbox_items | DB write |
| returns correct inserted/skipped counts | Response format |
| handles CORS preflight | OPTIONS request |

**File: `supabase/functions/sync-github/index.test.ts`**

| Test Case | Description |
|-----------|-------------|
| returns 400 if username missing | Input validation |
| fetches repos from GitHub API | API call made |
| handles GitHub API errors gracefully | Error propagation |
| excludes forked repositories | Fork filtering |
| returns repo list for selection (no selected_repos) | Two-step: step 1 |
| inserts selected repos into inbox_items | Two-step: step 2 |
| skips existing repos (deduplication) | external_id check |
| infers vibe-engineered tag from topics | Tag inference |
| infers ai-assisted tag from recency | Tag inference |
| returns correct inserted/skipped counts | Response format |

---

### 6. Integration Tests: Full Flow

**File: `src/test/admin-integration.test.ts`**

| Test Case | Description |
|-----------|-------------|
| Sync ORCID > Items appear in inbox | End-to-end sync |
| Approve item > Artifact created | Full approval flow |
| Approved artifact visible in useArtifacts | Query sees new data |
| Reject item > Status updated | Rejection persists |
| Edit before approve > Changes saved | Modified approval |
| Duplicate sync > Items skipped | Deduplication works |

---

## Test Implementation Strategy

### Mocking Approach

**Frontend Tests (Vitest)**
- Mock `@/integrations/supabase/client` for all hook tests
- Use `@testing-library/react` with `QueryClientProvider` wrapper
- Mock `localStorage` for ContentEditor tests

**Edge Function Tests (Deno)**
- Use `Deno.test()` with Deno's standard library
- Load credentials from `.env` using dotenv
- Mock external API calls or use live APIs with test data
- Consume all response bodies to avoid resource leaks

### Test Data Fixtures

Create reusable fixtures:

```typescript
// src/test/fixtures/inbox-items.ts
export const mockPendingItem: InboxItem = {
  id: 'test-1',
  source: 'orcid',
  discoveredAt: '2024-01-15T00:00:00Z',
  status: 'pending',
  rawData: { /* ORCID response */ },
  suggestedArtifact: {
    title: 'Test Publication',
    type: 'paper',
    date: '2024-01-01',
    summary: 'A test paper',
    mode_visibility: 'both',
  },
};

// src/test/fixtures/artifacts.ts  
export const mockArtifact: Artifact = {
  id: 'artifact-1',
  type: 'project',
  title: 'Test Project',
  date: '2024-01-01',
  summary: 'A test project',
  mode_visibility: 'build',
  tags: ['ai-assisted'],
};
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/lib/artifacts.test.ts` | Pure function unit tests |
| `src/hooks/useInboxItems.test.ts` | Inbox hook tests |
| `src/hooks/useArtifacts.test.ts` | Artifacts hook tests |
| `src/components/admin/InboxList.test.tsx` | Inbox UI tests |
| `src/components/admin/SyncButton.test.tsx` | Sync button tests |
| `src/components/admin/RepoSelector.test.tsx` | Repo selector tests |
| `src/components/admin/ContentEditor.test.tsx` | Content editor tests |
| `src/test/fixtures/inbox-items.ts` | Test fixtures |
| `src/test/fixtures/artifacts.ts` | Test fixtures |
| `supabase/functions/sync-orcid/index.test.ts` | ORCID sync tests |
| `supabase/functions/sync-github/index.test.ts` | GitHub sync tests |

---

## Priority Order

1. **High Priority** (Core Functionality)
   - `useInboxItems.test.ts` - Approve/reject mutations
   - `sync-orcid/index.test.ts` - ORCID pipeline
   - `sync-github/index.test.ts` - GitHub pipeline
   - `InboxList.test.tsx` - Primary admin interface

2. **Medium Priority** (Supporting Features)
   - `useArtifacts.test.ts` - Data fetching with fallback
   - `SyncButton.test.tsx` - Sync UI states
   - `RepoSelector.test.tsx` - GitHub repo selection

3. **Lower Priority** (Utilities & Secondary UI)
   - `artifacts.test.ts` - Pure utility functions
   - `ContentEditor.test.tsx` - Content management

---

## Technical Considerations

### Supabase Mocking Pattern

```typescript
// Example mock for useInboxItems tests
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ data: mockItems, error: null }))
        }))
      }))
    })),
    rpc: vi.fn(() => Promise.resolve({ data: 'new-artifact-id', error: null })),
  }
}));
```

### React Query Test Wrapper

```typescript
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
```

### Edge Function Test Pattern (Deno)

```typescript
import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;

Deno.test("sync-orcid returns 400 without orcid_id", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/sync-orcid`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const body = await response.text(); // Always consume body
  assertEquals(response.status, 400);
});
```

---

## Estimated Effort

| Category | Test Count | Complexity |
|----------|------------|------------|
| Unit Tests (artifacts.ts) | 8 | Low |
| Hook Tests | 15 | Medium |
| Component Tests | 25 | Medium |
| Edge Function Tests | 18 | Medium |
| Integration Tests | 6 | High |
| **Total** | ~72 tests | ~3-4 iterations |
