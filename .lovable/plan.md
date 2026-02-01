
# Data Pipeline: Database-Backed Inbox & Content Management

## Overview

Transform the current "demo" pipeline into a fully functional system where:
- Synced items persist in the database
- Approved items become visible artifacts on your site
- The entire flow survives page refreshes

---

## Architecture

```text
                    PROPOSED FLOW (Complete)
                    
[ORCID/GitHub API] ──► [Edge Function] ──► [Supabase DB] ◄──► [Admin UI]
                                                │
                                                ├── inbox_items table
                                                │   (pending review)
                                                │
                                                └── artifacts table
                                                    (published content)
                                                          │
                                                          ▼
                                            [Academic/Build Pages]
                                              (read from DB)
```

---

## Database Schema

### Table 1: `inbox_items`
Holds discovered items awaiting review.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| source | text | 'orcid', 'github', 'crossref' |
| external_id | text | Source-specific ID for deduplication |
| status | text | 'pending', 'approved', 'rejected' |
| raw_data | jsonb | Original API response |
| suggested_artifact | jsonb | Pre-populated artifact fields |
| notes | text | Admin notes |
| discovered_at | timestamptz | When synced |
| reviewed_at | timestamptz | When approved/rejected |
| created_at | timestamptz | Record creation |

### Table 2: `artifacts`
The main content table powering both Academic and Build modes.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| slug | text | URL-friendly identifier |
| type | text | 'paper', 'project', 'role', etc. |
| title | text | Display title |
| subtitle | text | Optional subtitle |
| organization | text | Institution/company |
| location | text | City, State |
| date | date | Start date |
| end_date | date | End date (null = current) |
| summary | text | Short description |
| details | jsonb | Array of bullet points |
| links | jsonb | {repo, demo, paper, website} |
| tags | text[] | Collaboration tags |
| mode_visibility | text | 'academic', 'build', 'both' |
| section | text | For Academic grouping |
| collaboration_breakdown | jsonb | Human/AI work split |
| source_ids | jsonb | {doi, arxiv, github, orcid} |
| featured | boolean | Show prominently |
| preview_image | text | Image URL |
| demo_info | jsonb | {type, url, thumbnail} |
| year | integer | For timeline grouping |
| created_at | timestamptz | Record creation |
| updated_at | timestamptz | Last modification |

---

## Implementation Steps

### Phase 1: Database Setup
1. Create `inbox_items` table with RLS policies (admin-only access)
2. Create `artifacts` table with RLS policies (public read, admin write)
3. Add unique constraint on `inbox_items.external_id` to prevent duplicates
4. Create database function for approving items (moves from inbox to artifacts)

### Phase 2: Update Edge Functions
1. Modify `sync-orcid` to:
   - Check for existing items by external_id before inserting
   - Insert new items directly into `inbox_items` table
   - Return count of new vs. existing items

2. Modify `sync-github` to:
   - Same deduplication logic
   - Handle the two-step flow (fetch repos → select → insert)

### Phase 3: Update Admin UI
1. Replace local state with database queries using React Query
2. Implement real approve/reject that updates database
3. Add "Edit before approving" flow (edit suggested_artifact, then approve)
4. Show sync history and last sync timestamps

### Phase 4: Update Frontend Pages
1. Replace `getArtifacts()` (reads JSON) with database query
2. Keep JSON as fallback/seed data
3. Add loading states for database queries

---

## Security Considerations

### RLS Policies

**inbox_items:**
- No public access (admin only via service role or future auth)
- Edge functions use service role key

**artifacts:**
- Public can SELECT (anyone can view portfolio)
- No public INSERT/UPDATE/DELETE
- Edge functions/admin use service role

### Authentication Options

Two approaches for admin access:

1. **Simple (Current):** Password check in frontend + service role in edge functions
   - Quick to implement
   - Adequate for single-user portfolio

2. **Proper Auth (Recommended):** Supabase Auth with email/password
   - Add login page
   - RLS policies based on user ID
   - More secure, audit trail

---

## Data Migration

### Seeding from artifacts.json
1. Create migration script that reads current JSON
2. Insert all existing artifacts into database
3. Keeps JSON as backup/version control

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `migrations/*.sql` | Create | Database tables, RLS, functions |
| `supabase/functions/sync-orcid/index.ts` | Modify | Write to DB instead of returning items |
| `supabase/functions/sync-github/index.ts` | Modify | Write to DB instead of returning items |
| `src/hooks/useInboxItems.ts` | Create | React Query hook for inbox |
| `src/hooks/useArtifacts.ts` | Create | React Query hook for artifacts |
| `src/components/admin/InboxList.tsx` | Modify | Use database queries |
| `src/pages/Admin.tsx` | Modify | Wire up real CRUD operations |
| `src/lib/artifacts.ts` | Modify | Add database fetching with JSON fallback |
| `src/pages/Academic.tsx` | Modify | Use database-backed artifacts |
| `src/pages/Build.tsx` | Modify | Use database-backed artifacts |

---

## Estimated Effort

| Phase | Complexity | Notes |
|-------|------------|-------|
| Database Setup | Medium | ~2 migrations, RLS policies |
| Edge Function Updates | Low | Straightforward DB inserts |
| Admin UI Updates | Medium | Replace state with queries |
| Frontend Integration | Low | Swap data source |
| **Total** | ~4-5 iterations | |

---

## Quick Wins (Can Do First)

1. **Database tables** - Foundation for everything else
2. **Make approve/reject persist** - Most visible improvement
3. **Deduplication** - Prevent syncing same items repeatedly

---

## Decision Points for You

1. **Authentication**: Keep simple password or add proper login?
2. **Data seeding**: Auto-import all current JSON artifacts to DB?
3. **Fallback behavior**: If DB fails, show JSON data or error?
