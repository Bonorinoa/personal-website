# Narrative reframe + resume update

## The story

Drop the "almanac in two volumes" idea. It implies chapters and turning pages. The
real story is one practice with two outputs: economics research, and the systems
built to do that research. The site should read as *one person who does both at
once*, not a person choosing between them.

Emotion to evoke: quiet confidence and craft. A visitor should think "this person
has taste and knows what they're doing" before reading a single credential.

## Naming

Settle on **Resume / Portfolio** everywhere — it is honest about what each page is.

- Landing cards: `Resume` and `Portfolio` (already the titles; remove Vol. I / Vol. II
  roman numerals and the "Research"/"Build" eyebrow labels that conflict).
- Nav mode toggle: `Resume` / `Portfolio` instead of `Research` / `Build`.
- Routes stay `/academic` and `/build` (no link breakage). Page titles and meta
  descriptions update to the new naming.
- Resume page top label becomes `Curriculum vitae`; Portfolio page keeps its
  numbered sections but the hero label reads `Portfolio`.

## Landing copy

Replace `A personal almanac — in two volumes` with a plain, non-metaphorical line:

> Economist and builder. I build the instruments I use to do the research.

Subhead stays close to the current one but tightened, no "volumes" language.
Card captions restated so each says what it contains, not what room you enter:

- Resume — "Training, research, teaching, and publications."
- Portfolio — "Software and research systems, with commit-level provenance."

## Where research work lives (the split you asked about)

Today the Portfolio holds two research entries — the water-scarcity Stata
replication and the institutions-and-prosperity essay — alongside six software
projects. Both research entries are backed by GitHub repos, so they currently get
commit heatmaps and live metadata like everything else.

Proposal: **list them in both places, with different jobs.**

- Resume gains a `Working Papers & Essays` section (separate from Publications),
  with a typed label per entry: Journal, Conference, Proceedings, Book chapter,
  Essay, Replication. Entries there are citations — title, venue/status, year, link.
- Portfolio keeps the same two items in `04 / Research`, but the card is about the
  artifact: repo, commit history, method, provenance. The Resume entry links to it.
- Portfolio's `03 / Software` becomes strictly things that ship — package, API,
  CLI, app.

### Tradeoffs

**For moving them out of the Portfolio entirely**
- Cleaner promise: Portfolio = software that runs. Easier to judge at a glance.
- The CV becomes the single complete record of scholarship, closer to a real CV.
- Research entries stop competing with software for grid attention.

**Against**
- You lose the strongest differentiator on those two items: a replication with a
  visible commit history is far more convincing than a line in a CV. Moved to a
  citation list, that evidence disappears.
- It re-imposes the split you just said you don't want — "research over here,
  building over there" — when the whole point is that you do them together.
- The Portfolio's Research section is thin but load-bearing: it is what proves the
  building serves the science.

**Cost of listing in both**
- Duplication: one artifact, two surfaces, so descriptions must be kept in sync.
  Mitigated by both reading from the same `artifacts.json` entry with different
  renderers, which is already how the data layer works.
- Slight risk of the CV looking padded if essays sit too close to peer-reviewed
  work — solved by the typed labels and a separate section.

Recommendation: list in both. If you'd rather have the hard split, say so and I'll
change the plan to move them and delete `04 / Research`.

## Publication typing on the Resume

Split the current single Publications list into labelled groups, matching the PDF:
Book Chapters, Journal Publications, Conference Presentations, Conference
Proceedings — plus the new Working Papers & Essays group. Each entry carries a
small monospace type tag so the kind of output is legible without reading the venue.

## Resume page content updates (from the new PDF)

**Education**
- ASU entry: change title `PhD in Economics` to `M.Sc Economics (PhD track)`,
  Aug 2025 – Dec 2026, note terminal degree, passed the micro qualifier,
  specialization Microeconomic Theory and AI, GPA 3.4/4.0.
- Other entries unchanged.

**Research & Work** — add JD Power consulting, in chronological position:
- Data Science and Causal Inference Consultant, JD Power (Remote), May 2025 – Jul 2025.
  Interpretable churn-probability models, outlier-based high-risk classification,
  feature-importance analysis; XGBoost, LightGBM, zero-inflated Poisson, fixed effects.
  Weekly findings to the data science team.

Everything else on the page (publications, teaching, grants, certifications) already
matches the PDF and stays as is.

## Technical notes

- Content edits: `src/data/artifacts.json` (`edu-asu-phd` entry, new `role-jdpower`
  entry with `section: "experience"`).
- Naming/copy: `src/pages/Index.tsx`, `src/components/landing/FolioCard.tsx`,
  `src/components/shared/ModeToggle.tsx`, `src/pages/Academic.tsx`,
  `src/pages/Build.tsx` (labels, `<title>`, meta descriptions).
- No route, data-schema, or backend changes.
- Verify the landing and both pages with Playwright screenshots at 1280px and 390px
  after the copy changes, since the card rows are height-matched.
