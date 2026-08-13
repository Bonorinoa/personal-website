# Add cvprofiles + LeanEcon v4, and split Build into Software / Research

## What changes

### 1. Two new project cards

**cvprofiles** (`Bonorinoa/cvprofiles`, Python, created Aug 2026, last push Aug 10 2026)
Construct-validity profiles: treats construct validity as partial identification over a
menu of measurement functions, disciplined by a researcher-authored nomological network.
Returns an admissible measurement set and a construct-identified range for a target
functional; empty sets and wide ranges are reported as findings, not failures. v3.0.0
ships the WVS/GPS patience flagship application under a verifier-gated frozen run.
Categorised as **Research**.

**LeanEcon v4** (`Bonorinoa/LeanEcon_v4`, Python, created Aug 2026, last push Aug 13 2026)
Clean-room rebuild: a Mistral-backed economics-formalization collaborator that takes
English claims through reviewed interpretation, Lean 4 formalization, and kernel-checked
verification, emitting auditable bundles rather than bare "it compiles" claims. Semantic
approval stays with an accountable reviewer; models draft. Categorised as **Software**.

The **LeanEcon v3** card is removed; v4's card carries a secondary "v3 (archived)" link so
the historical evidence stays reachable.

### 2. Software vs Research sections

The single project grid becomes two labelled sections, each sorted newest-first by verified
GitHub push date:

```text
03 / Software     tools, agents, applications that run
04 / Research     analyses, replications, methods work
```

Assignment: Software = LeanEcon v4, Quals Arena, Silicus TA 2.0, Health-E, Personal Site.
Research = cvprofiles, Water Scarcity replication, Institutions & Prosperity.
The existing tag filter and "Last synced" stamp stay above the first section and filter
both. The trailing "What you're looking at" legend moves below the last section.

### 3. Agent contributor data (the hermes experiment)

The `github-commits` function starts returning a per-author contribution breakdown from
GitHub's `stats/contributors` endpoint (commits, additions, deletions per login), plus a
flag marking which logins are declared agent accounts.

- **Card**: a thin two-segment share bar (human / agent) with a `NN% agent-authored` label,
  rendered only for repos where an agent contributor exists — so today only LeanEcon v4.
- **Modal**: a "Contributors" block listing each login with commit count, lines changed,
  and an `agent` badge, above the existing Credit block.
- No classifier yet. We surface raw shares and revisit thresholds once v4 has enough
  history (currently 42 commits, 1 from `hermessinho`).

## On the attribution strategy

Naming the account after the **agent/harness** rather than the model is the right call:
the harness is the stable unit, models rotate per task, and Git already records author vs
committer so co-authorship is expressible without inventing a schema. Two caveats worth
knowing before leaning on it:

- GitHub attributes a commit to the account matching the author email. Anything you commit
  from your own machine after an agent wrote it lands under your name, so the share
  measures *who pushed the diff*, not who produced it. Keeping the agent as the git author
  and yourself as committer (or a `Co-authored-by:` trailer) is the honest encoding.
- Commit and line counts are a proxy for volume, not for judgment. The share bar should sit
  next to the written Credit block, never replace it.

A deterministic classifier is feasible later: `stats/contributors` gives weekly commits and
additions/deletions per author, so modes like human-led / co-authored / agent-led can be cut
from the agent share plus review evidence (PRs, reverts). Worth defining once there is a
real distribution rather than fitting thresholds to one commit.

## Technical notes

- `src/data/types.ts`: add `category?: 'software' | 'research'` to `Artifact`; add
  `Contributor` and `ContributorStats` types to `useCommitActivity`.
- `src/data/artifacts.json`: add `project-cvprofiles` and `project-leanecon-v4` with
  summary, details, credit attribution, links and category; delete `project-leanecon-v3`;
  backfill `category` on the six existing Build artifacts.
- `supabase/functions/github-commits/index.ts`: add `fetchContributors()` hitting
  `stats/contributors` (handle the 202 warm-up the same way commit activity already does),
  return `contributors` in the cached payload, mark known agent logins (`hermessinho`).
- `src/hooks/useCommitActivity.ts`: pass `contributors` through state.
- `src/components/build/ProjectGrid.tsx`: accept a category and render one section; new
  `AgentShareBar` component for the card.
- `src/components/build/ProjectCard.tsx` / `ProjectModal.tsx`: render the share bar and the
  contributors block using existing design tokens.
- `src/pages/Build.tsx`: renumber sections and render the two grids.
- Verify both new cards pull live GitHub data (languages, stars, last commit, heatmap) at
  1280px and 390px before finishing.
