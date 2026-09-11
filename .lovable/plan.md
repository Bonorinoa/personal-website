# Consulting page — `/consulting`

## What the page is

A third surface on the site: independent review for a named decision. It lives in the Academic visual world — cream paper, Fraunces serif, oxblood accents — so it reads as an extension of the resume side rather than a new product. The page opens with a kicker, the word **Consulting**, and a short lede. Below it sits a bordered two-column stage: on the left a sparse nomological net of three numbered nodes joined by hairlines, on the right the copy for whichever node is selected. Node 01, *Fit to rely*, is selected on first paint, so the lead offer is fully readable without a click. Selecting 02 or 03 rewrites the right panel only — the net itself never moves. Under the stage, a fixed three-item writing rail, then the CTA form, and a notes band that stays hidden until at least two real notes exist. No prices, no calendars, no testimonials placeholders.

## Files

Add:
- `src/data/consulting.ts` — node copy, writing items, `notes: []`, `CONSULTING_INBOX`
- `src/components/consulting/NomologicalNet.tsx` — net + right panel
- `src/components/consulting/DecisionForm.tsx` — CTA form
- `src/pages/Consulting.tsx` — page shell, Helmet, writing rail, notes band

Touch:
- `src/App.tsx` — add the `/consulting` route
- `src/components/shared/Navigation.tsx` — quiet serif "Consulting" link beside the toggle
- `src/pages/Index.tsx` — one italic line under the folio grid
- `scripts/generate-sitemap.ts` — `/consulting`, monthly, 0.8

Academic and Build page bodies are untouched. No new tokens, fonts, or `data-world`.

## Reuse

- `useWorld('academic')` at the top of `Consulting.tsx`. No new world attribute, so the page inherits the aged-cream/oxblood/Fraunces token set for free.
- `useMode` is left alone — Consulting does not join that union and does not force a mode. `Navigation` and `Footer` are imported exactly as Academic imports them.
- All colour, rule, shadow, and duration values come from existing CSS variables (`--paper`, `--paper-deep`, `--ink`, `--muted-ink`, `--oxblood`, `--rule`, `--shadow-lift`, `--dur`, `--ease-out`). Radius stays 2px.

## Net + panel implementation

Plain React state, no physics or graph library.

- `const [active, setActive] = useState('01')` in `NomologicalNet`.
- The left pane is a `relative` box. Three `<button>` nodes are absolutely positioned by percentage: 01 top-centre, 02 bottom-left, 03 bottom-right. 01 renders slightly larger with an offset oxblood shadow.
- One SVG overlay sits behind the buttons at `inset-0`, `preserveAspectRatio="none"`, with three `<line>` elements in the same percentage coordinate space. Strokes use `vector-effect: non-scaling-stroke` so the hairline stays 1.1px at any pane width. Edges incident to the active node darken by raising stroke opacity.
- Selected node: `aria-current="true"`, oxblood border, offset shadow, `scale(1.04)`. Unselected sit at 0.72 opacity. Clicking the active node is a no-op, so the panel can never be empty.
- Right panel is keyed on `active` and cross-fades with a short Framer Motion opacity/translate transition; the net has no transition of its own. All transitions are wrapped so `@media (prefers-reduced-motion: reduce)` drops them to zero duration.
- Keyboard: nodes are real buttons in DOM order 01, 02, 03, so tab and enter work without extra handling.
- Mobile: the grid collapses to one column, net on top at ~300px min-height, panel below.

## Omitting empty notes

`consulting.ts` exports `notes: Note[] = []`. `Consulting.tsx` renders the band as `{notes.length >= 2 && <NotesBand notes={notes.slice(0, 2)} />}`. With an empty array nothing renders — no heading, no border, no reserved space. The component is written and typed now so adding two real notes later is a data-only change.

## Form

Four fields (decision, deadline, cost of being wrong, optional email), submitted via `mailto:` with a structured body built from the field values and `encodeURIComponent`. No backend, no Supabase. Helper line under the button as specified.

## Open questions

1. **Inbox address.** The site already uses `agbonorino@proton.me` for the Academic contact link. I plan to set `CONSULTING_INBOX = 'agbonorino@proton.me'` unless you want a different address — say the word and I will swap it.
2. **Nav on Consulting.** `Navigation` picks its wordmark font from `useMode`, so on `/consulting` the name renders in mono if the visitor last used Portfolio. Since Consulting is an Academic-world page, I would render the wordmark in serif whenever the path is `/consulting`, without touching the stored mode. Flag if you would rather leave it inheriting.
3. **La Gaceta column** ships with `href="#"` and no external-link affordance until you supply a public URL.
