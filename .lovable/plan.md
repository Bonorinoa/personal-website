# Plan — Academic content pass

## 0. Verify build first

Run `bun run build:dev` (or equivalent) and confirm no errors before editing. If it fails, fix before proceeding.

## 1. Task list — Academic page changes

### A. `src/pages/Academic.tsx`

1. Remove the ORCID link from the hero links row.
2. Change the GitHub link `href` from `https://github.com/Bonorinoa` → `https://github.com/EconLLM-Lab` (Academic page only; Build page keeps personal profile).
3. Reorder `<Section>` calls so **Grants & Fellowships** renders immediately after **Computational Skills** (new order: Education → Research & Work → Teaching → Publications & Presentations → Computational Skills → Grants & Fellowships → Certifications → Honors & Awards).
4. Make **all** sections collapsible: pass `collapsible defaultOpen` to Education, Research & Work, Teaching, Publications & Presentations, and Computational Skills (currently only the last 4 are collapsible). Keep Education/Research/Teaching/Publications `defaultOpen={true}` so first-load reads the same; the rest stay `defaultOpen={false}`.

### B. Contrast tweak — `src/index.css`

5. Nudge the Academic-world `--foreground` token slightly darker (or `--paper` slightly lighter) so body copy has stronger contrast against the paper background. Small change — one or two token lines under `[data-world='academic']`. Verify visually.

### C. `src/data/artifacts.json` — Education

6. `edu-ma-cgu` (line 20): rename title `"MA in Economics (PhD Track)"` → `"MA in Economics"`; in coursework detail replace `"Mathematical Economics"` → `"Mathematics for Machine Learning"` and `"Industrial Organization"` → `"Neuroeconomics"`.
7. Add new education entry below `edu-ba` (BA in Economics Honors):
  - id: `edu-bsc-cofc`
  - title: `BSc in Economics (Honors)`
  - organization: `College of Charleston`
  - location: `Charleston, SC`
  - date: `2018-08`, endDate: `2019-05`
  - details: `["GPA: 3.6/4.0"]`
  - section: `education`, mode_visibility: `academic`

### D. Publications & Presentations (`artifacts.json`)

8. Add `links.paper` (or update existing) for:
  - "Enhancing well-being by leveraging AI in coaching practices" → `https://www.taylorfrancis.com/chapters/edit/10.4324/9781003319016-28/...`
  - "AutoKevin: A Semi-Autonomous AI Knowledge Discovery Architecture" → `https://ecc.marist.edu/documents/2978505/2980816/...`
  - "LLMs Model Non-WEIRD Populations…" → rename title to `"LLMs Can Model Non-WEIRD Populations: Experiments with Synthetic Cultural Agents"`, add note `(forthcoming in Review of Experimental Economics)` in organization/summary, set `links.paper` to `https://arxiv.org/abs/2501.06834`.
9. Delete the entry titled `"Large Language Models for the Study of Non-WEIRD Populations"` (ESA North American Meeting, 2023-10) at line ~358.

### E. Certifications (`artifacts.json`)

10. Add `links.certificate` (or `links.paper` if schema restricts — will check `types.ts` and extend if needed) to:
  - `cert-quantum` → Credly badge URL
    - `cert-beslab` → LinkedIn overlay URL
    - `cert-ibm-ai` → Coursera share URL (608c6191…)
    - `cert-ibm-ds` → Coursera share URL (277443785…)
11. Delete entries `cert-sna` (Social Network Analysis) and `cert-linear-algebra-ml` (Linear Algebra for ML).
12. If `SectionItem` doesn't currently render cert links, pass them via the existing `links` prop so they appear as `Certificate ↗`.

## 2. Verification

- Rebuild.
- Load `/academic`, confirm: no ORCID, GitHub → EconLLM-Lab, section order correct, all sections collapse, new BSc entry visible, updated coursework, publication links open correctly, deleted entries gone, cert links render.

---

## 3. Discussion (no changes yet)

### CV-alternative display ideas

- **PDF-first hero**: keep the on-page CV lean (name, one-paragraph bio, current focus, contact) and promote a prominent "Download full CV (PDF)" button. Replace dense list sections with narrative blocks — "Research & Work" as 2–3 short prose paragraphs telling a story rather than bullet roles. Trade-off: better reading experience, but recruiters/committees skimming for dates/titles lose scanability.
- **Hybrid "narrative + timeline"**: prose intros per section, followed by a compact right-rail timeline (year · title). Best of both, more design work.
- **Highlights bento**: replace the CV feel with a bento grid of "signals" — latest paper, current teaching, latest talk, current affiliation — each a card. CV lives only as PDF. Very distinctive; may feel too light for academic reviewers.
- **Publications as the centerpiece**: since publications are the currency, make them the dominant section with abstracts-on-hover, and demote Education/Teaching to a small sidebar or a `/cv` sub-route.

### Google Scholar citation counts

- **Feasible but fragile.** Google Scholar has no official API. Options:
  1. `**scholarly` (Python) via a scheduled edge function** — scrape periodically, cache citation counts per work in the DB, render as `Cited by 12 ↗`. Works but Google rate-limits and occasionally blocks scrapers; needs proxy rotation for reliability.
  2. **SerpAPI Google Scholar endpoint** — reliable, official-ish, ~$50/mo for low volume. Simplest and least likely to break.
  3. **Semantic Scholar API** — free, official, has citation counts for most papers via DOI/arXiv ID. Coverage is not 100% of Scholar, but usually close and much more stable. Recommended default.
- Implementation shape: scheduled edge function updates `artifacts.source_ids` → `citation_count` nightly; UI shows a small `Cited by N` chip next to each publication. Low risk with Semantic Scholar.

### Admin panel vs. "just ask Lovable"

An admin panel already exists at `/admin` (magic-link, allowlisted, writes to Lovable Cloud). Two paths:

- **Keep and lean into it**: adds inline edit for the fields you actually touch (publication links, add cert, tweak education). ~½ day of work for a real, ergonomic editor with validation. Wins when edits are frequent (weekly), small, and content-only.
- **Delete it, edit via chat**: every change is a Lovable turn. Wins when edits are infrequent (monthly), often bundled with design/structural tweaks, and you like a code-reviewed history via git. Costs credits per edit and has latency.
- **Recommendation**: keep admin, but scope it strictly to *content mutations that already have a schema* (add/edit/delete artifacts, edit links, toggle featured). Anything structural (new section type, new field, layout) still comes through chat. This keeps the panel small and useful without becoming a second codebase.

I'll wait for your go-ahead before implementing.