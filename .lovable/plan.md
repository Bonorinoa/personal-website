## Direction

**Editorial Atelier** — a rare-books-room landing that opens onto two visually distinct worlds: a warm cream "Academic" press and a cool graphite "Build" studio. Light-only, fully tuned. Cursor leaves a slow ink-bleed trail across the paper.

## 1. Remove dark mode

- Delete `src/hooks/useTheme.ts`, `ModeToggle.tsx`, and the theme-init script in `main.tsx`.
- Strip `.dark { … }` block and `darkMode: ["class"]` from `index.css` / `tailwind.config.ts`.
- Drop any `dark:` utilities currently in components (audit pass).
- Remove theme toggle from `Navigation.tsx` and `Footer.tsx`.

## 2. Two-world tokens

Replace the single Quiet Modernist palette with **three scoped token sets** on `:root`, `[data-world="academic"]`, `[data-world="build"]`.

```text
shared (landing)
  --paper      #f6f1e7   warm cream
  --ink        #1a1410   dark sepia-black
  --accent     #6b2c1f   oxblood

academic
  --paper      #f3ecdc   aged cream
  --ink        #2a1f15   warm ink
  --accent     #6b2c1f   oxblood red
  --rule       #d9cfb8
  font display = Fraunces (italic-leaning)
  font body    = Fraunces text
  feel: letterpress, wide margins, drop caps, marginalia

build
  --paper      #ececec   cool graphite paper
  --ink        #111315   near-black
  --accent     #2348ff   electric cobalt (kept)
  --rule       #c8ccd1
  font display = Geist Mono
  font body    = Geist Sans
  feel: technical grid, hairlines, monospaced metadata
```

`Academic.tsx` and `Build.tsx` set `<html data-world="…">` on mount (cleared on unmount). All shared components read semantic tokens, so swapping `data-world` re-skins everything without component edits.

## 3. Landing page — Editorial Atelier

Rebuild `src/pages/Index.tsx` and `PondBackground` family. New structure:

```text
┌──────────────────────────────────────────────────────────────┐
│  AGB · MMXXVI                              Tempe / Tucumán   │  ← small caps meta
├──────────────────────────────────────────────────────────────┤
│                                                              │
│            Augusto González-Bonorino                         │  ← Fraunces 96px italic
│                                                              │
│       economist · builder · writer on language models        │  ← single line, muted
│                                                              │
│   ╔═══════════════════╗      ╔═══════════════════╗           │
│   ║   Research        ║      ║   Build           ║           │  ← two folio cards
│   ║   ——————          ║      ║   ——————          ║           │     hairline frames
│   ║   serif preview   ║      ║   mono preview    ║           │     hover: warm/cool
│   ║   "The Academy"   ║      ║   "The Studio"    ║           │     ink bleed
│   ╚═══════════════════╝      ╚═══════════════════╝           │
│                                                              │
│   colophon · set in Fraunces & Geist · est. 2024             │  ← footer marginalia
└──────────────────────────────────────────────────────────────┘
```

### Background
- Cream paper base with subtle SVG paper-grain noise (already exists, retune opacity).
- Faint horizontal baseline grid (8px) at 4% opacity — invisible until you look.
- One restrained ornament: a single hand-drawn flourish in the top-right corner (SVG, oxblood).
- **Remove** `NodeCanvas`, gradient mesh, shimmer, scan grid — they fight the editorial tone.

### Cursor ink-bleed trail
New `src/components/landing/InkTrail.tsx` — full-screen `<canvas>` behind content:
- Track cursor with `requestAnimationFrame`, sample every ~16ms.
- Each sample = a soft ink droplet: radial gradient (warm sepia, ~24px), alpha 0.06.
- Per frame, draw a translucent paper-colored rect over the canvas (alpha ~0.04) so old drops fade.
- On mouse stop, droplet "bleeds" — small Perlin offsets expand it for ~600ms.
- Respects `prefers-reduced-motion` (disables canvas entirely).

### Folio card interactions (framer-motion)
- Idle: hairline border + tiny serif/mono preview text inside.
- Hover: card lifts 2px, hairline thickens to 1.5px, accent rule appears beneath the title, ink trail intensifies toward that side of screen.
- Click: 480ms page transition — chosen card scales up, paper tint cross-fades to that world's palette, route changes.

### Transitions
- Add `<AnimatePresence>` in `App.tsx` route layer.
- Landing → Academic: cream paper warms; serif title slides up from behind divider.
- Landing → Build: paper cools to graphite; mono grid fades in.
- Back to landing: reverse with the same 480ms ease.

## 4. Academic page polish

- Wrap content in centered `max-w-[680px]` measure (book column).
- Add Fraunces drop-cap to first section paragraph (`::first-letter` 5em float-left, oxblood).
- Section titles: small-caps, hairline above, year aligned right in muted ink.
- Replace any `bg-card` / generic shadcn surfaces with the `--paper` token so the page reads as one continuous sheet.

## 5. Build page polish

- Keep the vertical grid from the last turn; restyle with cool tokens.
- Project card metadata typeset in Geist Mono uppercase 10px / tracking 0.18em (catalog feel).
- Hairlines stay 1px cool gray; cobalt only on interaction (hover underline, focus ring).
- Aggregate matrix gains a thin Mono caption ("Fig. 1 — human/AI task distribution").

## 6. Files

**Create**
- `src/components/landing/InkTrail.tsx` — cursor ink canvas
- `src/components/landing/FolioCard.tsx` — the two large landing cards
- `src/components/landing/Flourish.tsx` — SVG ornament
- `src/hooks/useWorld.ts` — sets `data-world` on `<html>`

**Edit**
- `src/index.css` — strip `.dark`, add `[data-world]` blocks, oxblood accent
- `tailwind.config.ts` — remove `darkMode`, add `oxblood` color
- `src/pages/Index.tsx` — full rebuild per layout above
- `src/pages/Academic.tsx` / `Build.tsx` — call `useWorld('academic' | 'build')`
- `src/App.tsx` — wrap routes in `AnimatePresence` with paper-tint transition
- `src/main.tsx` — drop theme-init IIFE
- `src/components/shared/Navigation.tsx`, `Footer.tsx` — remove ModeToggle
- `src/styles/fonts.ts` — add Fraunces 400-italic & 600-italic weights

**Delete**
- `src/hooks/useTheme.ts`
- `src/components/shared/ModeToggle.tsx`
- `src/components/landing/PondBackground.tsx`
- `src/components/landing/background/` (NodeCanvas, useNodePhysics, types)
- `src/components/landing/ModeButton.tsx` (replaced by FolioCard)

## Out of scope

- No glassmorphism (rejected as fighting the editorial tone — happy to revisit if you want a hybrid).
- No content/data changes; this is presentation only.
- GitHub sync and per-card matrix preview already shipped — left untouched.
