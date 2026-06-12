# Build mode overhaul + live GitHub sync + mobile polish

Four scoped changes, all shipped together. No backend schema changes — the existing `artifacts` and `inbox_items` tables are sufficient.

---

## 1. Replace the horizontal carousel with a real vertical grid

**Problem.** The current `ProjectShowcase` / `ExpandableProjectCard` is a horizontal scroll-snap row. `BentoGrid.tsx` is referenced from `src/pages/Build.tsx` but the file does not exist on disk, so the page is currently broken or rendering stale placeholders.

**Fix.**

- Create `src/components/build/ProjectGrid.tsx` — a real CSS grid:
  - `grid-cols-1` on mobile, `sm:grid-cols-2`, `lg:grid-cols-3`.
  - `gap-px` over a `bg-rule` background, so cards are separated by single hairline rules (Quiet Modernist, no shadow stacks).
  - Featured artifacts get `lg:col-span-2` to break the rhythm, otherwise uniform.
  - Sorted newest-first, paged in groups of 12 with a "Load more" button (no virtualization needed at current scale).
- Delete `ProjectShowcase.tsx` and `ExpandableProjectCard.tsx` (the horizontal-snap component). `ProjectModal` and `ProjectCard` stay.
- Update `src/pages/Build.tsx` to import `ProjectGrid` instead of `BentoGrid` and drop the `-mx-px hairline` wrapper.

**Card design (`ProjectCard` redesign).**

```text
┌────────────────────────────────────┐
│ [thumb / demo strip]               │
│                                    │
│ leanecon-v3        2025-11         │  ← title / date row
│ TypeScript · 14★                   │  ← github meta (lang, stars)
│                                    │
│ One-line summary clipped to 2…     │
│                                    │
│ [tag] [tag]              ↗ repo    │  ← tag + link cluster
└────────────────────────────────────┘
```

No card-level shadow, no scale-on-hover. Hover state = cobalt 1px outline + summary expands inline. Tap target on the whole card opens the modal.

---

## 2. Per-card AI matrix hover preview

**Behavior.**

- **Desktop (>= md):** Hovering a card for >200ms opens a Radix `HoverCard` anchored to the card's right edge containing:
  - Mini `CollaborationMatrix` (compact mode reused from `CollaborationMatrix.tsx`).
  - Human / verification text from `collaboration_breakdown` (truncated to ~2 lines each).
  - Footer row: "Click card for full details →".
- **Mobile / touch:** Add a small cobalt `△` chevron in the card's bottom-right. Tapping the chevron toggles an in-card disclosure with the same content (no hover, no layout shift on the grid — the card grows inside its own grid cell).
- For cards without a `collaboration_breakdown.matrix`, the chevron is hidden and no hover card opens (avoids empty popovers for GitHub-synced repos that don't have a matrix yet).

**New file.** `src/components/build/CardMatrixPreview.tsx` — wraps `HoverCard` + the matrix and the touch-disclosure variant behind a `useIsMobile()` check.

---

## 3. Live GitHub sync across user + three orgs

**Scope of accounts.** Personal `Bonorinoa` + orgs `EconLLM-Lab`, `Perwell`, `Cognitio-EDU`. Sync brings repos into `inbox_items`; one-click "Approve all" inserts them as `artifacts` so they show up on `/build` immediately.

**Edge function changes (`supabase/functions/sync-github/index.ts`).**

- Accept either `{ username }` (existing) or `{ scope: 'all' }`. When `scope: 'all'`, the function fans out across `["Bonorinoa", "EconLLM-Lab", "Perwell", "Cognitio-EDU"]`, using `/users/{u}/repos` for the user and `/orgs/{o}/repos` for orgs.
- Tag each `suggested_artifact.org` with the matching `OrgScope` value so the Build workspace filter works without manual editing.
- Skip archived + forked repos by default; expose `include_archived: true` flag for the admin.
- De-dupe on `external_id` (already implemented for single-user; extend to the fanned-out set).
- Add a `GITHUB_TOKEN` secret check — if present, send it as `Authorization: Bearer …` to lift the 60 req/hr unauthenticated rate limit to 5 000. The function still works without the token; we'll prompt the user to add it the first time they hit a 403.

**Admin UI (`src/pages/Admin.tsx` + new component).**

- Add a single "Sync all GitHub (personal + orgs)" button at the top of the Inbox tab that calls the edge function with `scope: 'all'` and skips the repo-picker dialog (it auto-imports everything that isn't a fork or archived).
- Keep the existing per-username SyncButton + RepoSelector flow for fine-grained control.
- Add an "Approve all pending GitHub items" bulk action that loops `approve_inbox_item` for any inbox row with `source = 'github'`.

**Scheduled sync (optional, fire-and-forget).**

- Add a cron entry in `supabase/config.toml` running `sync-github` with `scope: 'all'` every 6 hours, so the inbox stays fresh without manual clicks. Items still require admin approval (or one click of the bulk-approve button) before they appear on `/build`.

**Frontend data path.**

- `useArtifacts.ts` already prefers DB rows and falls back to local JSON. Confirm `getBuildArtifacts()` in `src/lib/artifacts.ts` reads from the merged source (it does — no change needed). After bulk-approve, React Query refetches and the grid updates automatically.
- Remove placeholder GitHub-only entries from `src/data/artifacts.json` (anything whose only source is a `github` URL with no human content) once real DB rows exist; keep them as fallback for offline dev by gating on `import.meta.env.DEV`.

---

## 4. Mobile polish for Academic + Build (390px target)

Audited current state at 390 CSS px. Specific fixes:

**Global.**

- Bump base body padding: `px-4` is fine but the `pt-24 sm:pt-28` collides with the fixed nav on small phones — drop to `pt-20 sm:pt-28` and add `scroll-mt-20` to section anchors.
- Enforce min tap target of `44×44` for all icon links in `Navigation`, `Footer`, Academic links row, and card chevrons. Use `min-h-[44px] min-w-[44px] inline-flex items-center justify-center` on icon-only anchors.

**Academic (`src/pages/Academic.tsx`).**

- Hero `text-5xl md:text-6xl` → `text-4xl sm:text-5xl md:text-6xl` to prevent the name wrapping mid-word at 390px.
- Links row: change `gap-x-6 gap-y-3` to `gap-x-5 gap-y-4` and stack to a 2-column grid (`grid grid-cols-2 sm:flex sm:flex-wrap`) so each link gets a real tap zone instead of crowding.
- `PublicationList`: sticky year column hides on `<sm` (it currently shifts content). Inline the year as a small label above each entry instead.
- `Section` headings: reduce vertical rhythm on mobile (`mt-12 sm:mt-16` → applied via Section component prop, no per-page change).

**Build (`src/pages/Build.tsx`).**

- Hero: drop `text-5xl md:text-7xl` → `text-4xl sm:text-5xl md:text-7xl`. Sidebar `aside` stacks below hero on mobile (it already does via `grid-cols-1 lg:grid-cols-3`), but the `border-l` shows as a stray rule on stacked layout — switch to `hairline-t pt-6 lg:border-l lg:border-t-0 lg:pt-0 lg:pl-6`.
- `TagLegend`: horizontal scroll on overflow (`overflow-x-auto` + `snap-x`), each chip `min-h-[36px] px-3` (still meets 44px when combined with vertical padding of the strip).
- `ProjectGrid` (new): single column on mobile, `gap-px` over `bg-rule`. Card content `p-5` to give comfortable line lengths; thumb aspect ratio `aspect-[16/10]` so cards don't grow too tall on a phone.
- `AggregateMatrix`: wrap in `overflow-x-auto` so it can scroll horizontally on narrow screens instead of forcing a layout shift.

**Verification.**

- Run Playwright at `viewport={"width": 390, "height": 844}` against `/academic` and `/build`, screenshot top + middle + bottom of each, confirm no horizontal scroll on the page itself (only on the tag legend + matrix), confirm hero text doesn't truncate, and confirm tap targets render at >= 44px via DOM measurements.

---

## Out of scope

- Per-user OAuth for visitors to view private repos.
- Inline editing of synced GitHub repos from the public page (still done via admin Content tab).
- New AI-task taxonomy — reuses existing `llm-tasks.ts` enums.

---

## Files touched

**New:** `src/components/build/ProjectGrid.tsx`, `src/components/build/CardMatrixPreview.tsx`.

**Edited:** `src/pages/Build.tsx`, `src/pages/Academic.tsx`, `src/pages/Admin.tsx`, `src/components/build/ProjectCard.tsx`, `src/components/build/TagLegend.tsx`, `src/components/build/AggregateMatrix.tsx`, `src/components/shared/Navigation.tsx`, `src/components/shared/Footer.tsx`, `src/components/academic/PublicationList.tsx`, `src/lib/artifacts.ts`, `src/data/artifacts.json` (prune placeholders), `supabase/functions/sync-github/index.ts`, `supabase/config.toml` (cron).

**Deleted:** `src/components/build/ProjectShowcase.tsx`, `src/components/build/ExpandableProjectCard.tsx`.

**Optional secret:** `GITHUB_TOKEN` (only needed if rate limits bite).
