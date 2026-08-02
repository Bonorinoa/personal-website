## What I read

I pulled the repo and the PDF. The repo (`Bonorinoa/Beyond-Regime-Type-How-Institutions-Drive-Prosperity`, created Jan 2025, last pushed Aug 2, 2026, no stars, no homepage) holds `Growth_&_Institutions.Rmd` plus the two raw datasets (Maddison Project `mpd2023_web.xlsx`, Polity `p5v2018.xls`) and the essay PDF.

The essay (~1,270 words) argues that sustained development hinges on *institutional adaptability* — adaptive efficiency plus credible commitments — rather than regime type, using Argentina (democratic but extractive/stagnating) against Singapore (autocratic but market-preserving) as paired counterexamples, grounded in North, Weingast, and Acemoglu/Robinson, with GDP-per-capita and Polity2 series as the empirical backing.

My honest read: it's tight and well-argued for its length, the case selection is the right kind of "most-different" design, and the claim is defensible rather than overreaching. The weak spots are two ThoughtCo citations among otherwise serious sources, and that two cases illustrate rather than test the mechanism. Card copy will describe it as an analytical essay with a reproducible data appendix — no inflated "study" framing.

## Changes

**1. `src/data/artifacts.json`** — add one artifact, modeled on `project-water-scarcity-replication`:

- `id`: `project-institutions-prosperity`
- `title`: "Beyond Regime Type: How Institutions Drive Prosperity"
- `type`: `project`, `org`/`organization`: `Personal`, `date`: `2025`, `year`: 2025 (the live card header will show the verified GitHub `pushed_at` month anyway)
- `mode_visibility`: `build`
- `summary`: authored analytical essay on institutional adaptability versus regime type, testing the argument against Argentina and Singapore using Maddison Project GDP-per-capita and Polity5 regime series, with an R Markdown appendix that reproduces every figure and statistic cited in the text. No mention of the fellowship.
- `tags`: `["human-only"]` if that tag exists in the current taxonomy; otherwise no tags rather than inventing one (I'll match whatever `src/data/types.ts` allows). This was a written piece, so I won't imply agent involvement.
- `links.repo`: the GitHub URL; `links.paper`: the PDF blob URL on GitHub so the essay is one click away
- `source_ids.github`: repo name

**2. No component changes.** `ProjectGrid` sorts by GitHub `pushed_at`, so this lands near the top automatically, and `ProjectCard` will pull languages, last commit, and the commit sparkline from the existing `github-commits` function.

### Technical notes
- Only the JSON data file changes; the entry is added to the same `artifacts` array with the same field shape the Build page already consumes.
- After the edit I'll load `/build` in a headless browser and screenshot the new card to confirm the GitHub signals (date, last commit, sparkline) resolve for this repo, since it has no detected language and may render a sparser signals row.
