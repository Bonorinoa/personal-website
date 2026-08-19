# Landing page: fix name wrapping, fit one screen

## Why the name splits

Confirmed in `src/pages/Index.tsx` and by screenshots at 1440x900, 999x806, and 390x844:

1. The `<h1>` contains a literal `\n` before "González" plus `whitespace-pre-line`, so a line break after "Augusto" is hard-coded — it happens even when the whole name would fit.
2. The heading also carries `break-words`, and the hyphen between "González" and "Bonorino" is a natural break opportunity. At 1440px the clamp resolves to ~122px type, so the surname no longer fits one line and the browser breaks at the hyphen — producing the three-row "González-" / "Bonorino" split you saw.

So the name is wrapping for two independent reasons: a forced break and an unconstrained font size.

## Vertical overflow

Measured document height vs viewport height: 1168/900 desktop, 944/806 at your current window, 1072/844 mobile. Every size scrolls. The main consumers are hero top padding (7rem), the oversized name block, card `min-h` of 320-380px plus 4.5-6.5rem title rows, and the footer's 3.5rem top padding.

## What changes

**Name (`src/pages/Index.tsx`)**
- Remove the hard-coded `\n` and `whitespace-pre-line`; let the layout decide.
- Remove `break-words`; wrap "González-Bonorino" (including the oxblood hyphen) in an inline-block with `whitespace-nowrap` so it never splits mid-surname.
- Retune the clamp so the surname fits one line at common widths and drops cleanly to a two-line "Augusto" / "González-Bonorino" only on narrow screens: roughly `clamp(2rem, 6.2vw, 5.25rem)`.

**One-screen spec (no scrolling)**
- Switch the page shell to `h-[100svh]` with `overflow-hidden` so the three bands (hero, folios, footer) share the viewport instead of stacking past it.
- Hero: reduce top padding to about `pt-10 / sm:pt-14 / lg:pt-16`, bottom to `pb-8 / sm:pb-10`; tagline down one step (`text-base / sm:text-lg / lg:text-xl`) and eyebrow margin from `mb-8` to `mb-4`.
- Folio cards (`src/components/landing/FolioCard.tsx`): drop `min-h` to a fluid height so the pair fills leftover space rather than forcing it; title rows to `min-h-[3.25rem] / sm:min-h-[4rem]`, titles to about `text-4xl / sm:text-5xl / lg:text-6xl`, padding to `p-5 / sm:p-7 / lg:p-8`, caption row to `min-h-[2.5rem]`, and tighten the divider/caption margins.
- Footer: `pt-6 sm:pt-8 pb-4 sm:pb-6`.
- Mobile (390px): cards stack, so the grid gets `gap-4`, and the shell allows scrolling below `md` if the stacked layout still exceeds one screen — a squashed card is worse than a short scroll on phones. Desktop and tablet stay strictly no-scroll.

## Verification

Re-run the Playwright check at 1440x900, 1280x800, 999x806, 768x1024, and 390x844: assert `document.body.scrollHeight <= window.innerHeight` for every size at and above 768px wide, confirm the `<h1>` renders on at most two lines with the surname intact, and capture screenshots at each size for a visual pass.
