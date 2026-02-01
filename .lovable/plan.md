
# Admin Panel Upgrade, API Sync, and Build Page Redesign

## Overview

This plan covers three major enhancements:
1. **API Sync System** - Sync buttons for ORCID/GitHub with repository filtering
2. **Content Management Upgrade** - Full CRUD capabilities with filtering and bulk actions
3. **Build Page Redesign** - Grid with expandable cards and horizontal scrolling option

---

## Part 1: API Sync System

### Architecture

The sync system will use Supabase Edge Functions to securely fetch data from external APIs, then surface results in the Admin Inbox for approval before publishing.

```text
+-------------------+     +----------------------+     +------------------+
| Admin Panel       | --> | Edge Function        | --> | External API     |
| (Sync Button)     |     | (ORCID/GitHub fetch) |     | (ORCID, GitHub)  |
+-------------------+     +----------------------+     +------------------+
         |                         |
         v                         v
+-------------------+     +----------------------+
| UI: Loading State |     | inbox.json / Supabase|
| + Progress        |     | (Discovered Items)   |
+-------------------+     +----------------------+
```

### Source Configuration Panel (Enhanced)

Each source card will get:
- **Sync Now** button (triggers fetch)
- **Last Synced** timestamp
- **Status indicator** (syncing, success, error)
- **Items Found** count after sync

### ORCID Sync Implementation

**Edge Function: `sync-orcid`**
- Uses the public ORCID API (no OAuth required for public data)
- Endpoint: `https://pub.orcid.org/v3.0/{ORCID_ID}/works`
- Fetches: Publications, DOIs, titles, dates
- Returns: Array of `InboxItem` suggestions

**Data Flow:**
1. Admin clicks "Sync ORCID"
2. Frontend calls edge function with ORCID ID
3. Edge function fetches works from ORCID API
4. Results mapped to `suggestedArtifact` format
5. Items added to Inbox with status "pending"
6. Admin reviews/approves/rejects each item

### GitHub Sync Implementation

**Edge Function: `sync-github`**
- Uses GitHub REST API (public repos, no token needed; private repos need token)
- Endpoint: `https://api.github.com/users/{username}/repos`
- Fetches: Repository list with metadata (stars, description, language, topics)

**Repository Filter UI:**
After fetching, show a selection modal:
- List all repos with checkboxes
- Filter by: language, stars, recently updated
- Search by name
- "Select All" / "Select None" buttons
- Only selected repos become Inbox items

**Data Mapping:**
```text
GitHub Repo -> InboxItem
- name -> title
- description -> summary
- html_url -> links.repo
- homepage -> links.demo (if exists)
- topics -> suggested tags
- stargazers_count -> metadata for display
```

### Files to Create

| File | Purpose |
|------|---------|
| `supabase/functions/sync-orcid/index.ts` | ORCID API fetch edge function |
| `supabase/functions/sync-github/index.ts` | GitHub API fetch edge function |
| `src/components/admin/SyncButton.tsx` | Reusable sync button with loading state |
| `src/components/admin/RepoSelector.tsx` | Modal for filtering GitHub repos |

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Admin.tsx` | Add sync buttons to source cards |
| `src/data/inbox.json` | Track lastSync timestamps |
| `src/components/admin/InboxList.tsx` | Show source badges, sync metadata |

---

## Part 2: Content Management Upgrade

### Current State Issues
- No filtering or search
- Limited editing (only featured/visibility toggles)
- No bulk operations
- No actual persistence (console.log only)

### New Content Editor Features

**Search and Filter Bar:**
- Text search (title, summary)
- Filter by: type, section, visibility, tags
- Sort by: date, title, type
- Clear filters button

**Enhanced Artifact Editor:**
When editing an artifact, show full form:
- Title (editable)
- Summary (textarea)
- Type dropdown
- Section dropdown
- Visibility toggle buttons
- Tags multi-select (add/remove)
- Links (repo, demo, paper, website)
- Collaboration breakdown editor
- Featured toggle
- Preview image URL

**Bulk Actions:**
- Multi-select checkboxes on each card
- Bulk actions bar appears when items selected:
  - Set visibility (academic/build/both)
  - Toggle featured
  - Delete selected (with confirmation)

**Persistence Strategy (Phase 1):**
- Store edits in localStorage
- Show "Unsaved Changes" indicator
- Export to JSON button (for manual update of artifacts.json)
- Clear message: "Full persistence coming with Supabase integration"

### Layout: Two-Panel Design

```text
+------------------------+---------------------------+
| Artifact List          | Editor Panel              |
| [Search...] [Filters]  |                           |
| +------------------+   | [No artifact selected]    |
| | Paper: LLMs...   |   |                           |
| | Project: Kevin   | <-| or                        |
| | Role: EconLLM    |   |                           |
| +------------------+   | [Full edit form for       |
|                        |  selected artifact]       |
| [+ Add New Artifact]   |                           |
+------------------------+---------------------------+
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/admin/ArtifactEditor.tsx` | Full artifact edit form |
| `src/components/admin/ArtifactFilters.tsx` | Search and filter controls |
| `src/components/admin/BulkActions.tsx` | Multi-select action bar |

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/admin/ContentEditor.tsx` | Complete rewrite with two-panel layout |
| `src/pages/Admin.tsx` | Integrate new content management |

---

## Part 3: Build Page Redesign

### Design Concept: Expandable Grid with Horizontal Scroll

**Layout Options:**

**Option A: Horizontal Scroll (Recommended)**
- Projects arranged in a horizontal strip
- Cards are compact by default (1:1 or 4:3 aspect ratio)
- On hover, card expands to show demo preview + key info
- Scroll arrows on desktop, swipe on mobile
- Good for: curated collections, visual impact

**Option B: Vertical Grid with Expansion**
- Standard grid layout (2-3 columns)
- Cards expand in-place to cover 1/4 of viewport
- Other cards fade slightly when one is expanded
- Good for: more content, traditional browsing

### Proposed: Horizontal Project Showcase

```text
+------------------------------------------------------------------+
| Build Portfolio                                                   |
|                                                                  |
| AI-Human Collaboration Principles (collapsed header)            |
|                                                                  |
| [Aggregate Matrix - compact view] [Expand]                       |
|                                                                  |
| [Tag Filters: vibe-coded | vibe-engineered | ai-assisted | All] |
|                                                                  |
| <-  +--------+  +--------+  +--------+  +--------+  +-----  ->  |
|     |        |  |   *    |  |        |  |        |  |           |
|     | Smart  |  |EXPANDED|  | Kevin  |  | Website|  |           |
|     |Surveys |  |        |  | ODQA   |  |        |  |           |
|     |        |  |[Demo]  |  |        |  |        |  |           |
|     +--------+  |[Matrix]|  +--------+  +--------+  +-----      |
|                 |[Links] |                                       |
|                 +--------+                                       |
+------------------------------------------------------------------+
```

### Card States

**Default State:**
- Compact square/rectangle
- Project initial or small icon
- Title overlay at bottom
- Subtle tag indicator (colored border or dot)

**Hover/Expanded State:**
- Card grows to ~2x width (or 1/4 viewport)
- Demo preview appears (iframe, image, or styled placeholder)
- Title, date, summary visible
- Mini collaboration matrix
- Quick links (repo, demo, paper)
- Tags with full labels

**Click Action:**
- Full modal or overlay with complete project details
- Full collaboration breakdown
- All links and metadata

### Horizontal Scroll Implementation

**Desktop:**
- CSS scroll-snap for smooth carousel behavior
- Arrow buttons on edges
- Keyboard navigation (arrow keys)
- Mouse wheel horizontal scroll

**Mobile:**
- Native touch swipe
- Pagination dots indicator
- Swipe hint animation on first visit

### Animation Considerations

All animations respect `prefers-reduced-motion`:
- Expansion: scale + fade
- Scroll: smooth scroll-behavior
- Hover effects: subtle transforms only

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/build/ProjectShowcase.tsx` | Horizontal scrolling container |
| `src/components/build/ExpandableProjectCard.tsx` | Card with expand-on-hover |
| `src/components/build/ProjectModal.tsx` | Full details modal |

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Build.tsx` | Replace grid with ProjectShowcase |
| `src/components/build/AggregateMatrix.tsx` | Add compact/expanded toggle |

---

## Part 4: Analytics Clarification

### Current State
The Analytics tab is a placeholder with no actual tracking implementation.

### When Will Analytics Work?
**It will NOT work until:**
1. The app is published to a live domain, AND
2. You integrate an analytics service

### Options for Analytics

| Service | Setup | Notes |
|---------|-------|-------|
| Lovable Analytics | Publish app, enable in settings | Built-in, simplest option |
| Plausible | Add script tag, configure domain | Privacy-friendly, paid |
| Umami | Self-host or cloud, add script | Open source, can self-host |
| Google Analytics | Add GA4 snippet | Free, but privacy concerns |

### Recommendation
- Start with **Lovable's built-in analytics** after publishing
- The Analytics tab can show a message: "Publish your site to enable analytics"
- Phase 2: Add custom dashboard pulling from analytics API

---

## Implementation Order

1. **API Sync System** (high value, enables data discovery)
   - Edge functions for ORCID and GitHub
   - Sync buttons in Admin
   - Repo selection modal

2. **Build Page Redesign** (visual impact, showcases work)
   - Horizontal showcase component
   - Expandable cards
   - Responsive behavior

3. **Content Management Upgrade** (admin productivity)
   - Two-panel layout
   - Full artifact editor
   - Bulk actions

---

## Technical Notes

### Supabase Edge Functions Required
This plan requires Supabase integration for edge functions. You'll need to:
1. Enable Lovable Cloud or connect an external Supabase project
2. Deploy edge functions for API syncing
3. Optionally: store artifacts in Supabase tables instead of JSON

### Local Storage Limitations
Phase 1 content management uses localStorage, meaning:
- Edits are per-device only
- Exporting to JSON is manual
- Full persistence requires Supabase tables

### API Rate Limits
- ORCID: Public API has generous limits
- GitHub: 60 requests/hour unauthenticated, 5000/hour with token

---

## Deliverables Summary

1. ORCID sync edge function with inbox integration
2. GitHub sync edge function with repository filter modal
3. Enhanced source configuration panel with sync buttons
4. Redesigned Content Management with two-panel editor
5. Horizontal scrolling Build page with expandable project cards
6. Analytics tab updated with publishing guidance
