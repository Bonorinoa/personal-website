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
