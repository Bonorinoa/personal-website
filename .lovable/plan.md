# Portfolio systems narrative + homepage card art

## Goal

Bring the Portfolio "How I work" section in line with the Joshua Epstein / generative social science framing the user described, and add subtle French Impressionism art backgrounds to the two homepage cards so the visual contrast between Resume and Portfolio matches the conceptual contrast.

## 1. Portfolio copy rewrite

Update `src/components/build/BuildPhilosophy.tsx`.

- Retain the existing two-column layout and the three numbered principles.
- Reframe the section title from "A systems mindset" to something closer to the user's vocabulary (e.g., "I think in systems" or "Generative systems").
- Rewrite the lead paragraph to communicate, in plain language:
  - Integrating AI agents creates interactions that can produce surprising outcomes even when the local steps feel fully understood.
  - The response is not to predict every outcome but to design the harness — interfaces, feedback loops, decision rules, observability — so the system can be steered and audited.
  - Emergence is treated as "things we don't know yet"; the systems are built to generate deducible outcomes.
  - Reference Joshua Epstein's *Generative Social Science* as an influence, without turning the page into a book report.
- Keep jargon at level 2/5: avoid heavy terms like "Markov Chain," "state machines," "partial identification," etc. in the main paragraph. Use accessible words: "feedback loops," "local rules," "surprising whole," "steer rather than determine."
- Optionally tighten the three principles so they echo the new framing:
  1. Design the system first (keep current).
  2. Build for surprise (observability / traceability rephrased around seeing what the system is doing).
  3. Ship the work in the open (open-source by default, keep current).

## 2. Homepage card art backgrounds

Add generated art images behind the two `FolioCard` components on the landing page.

### Art direction

- **Portfolio card**: French Impressionism, evoking emergence from local brushstrokes — a Monet-style garden, poppy field, or riverside scene where the whole image resolves from dappled parts. This visualizes "can't determine the state of the world from a few local interactions."
- **Resume card**: A more structured, academic-style painting. Proposal: a classical library/study interior or an architectural/courtyard scene with balanced composition and clear perspective, still in a painterly style but calmer and more ordered than the Portfolio card.

### Implementation

- Generate two images and save to `src/assets/`:
  - `src/assets/portfolio-impressionism.jpg`
  - `src/assets/resume-academic-painting.jpg`
- Update `FolioCard.tsx` to accept an optional `backgroundImage` prop and render it as a `pointer-events-none` absolute background layer.
- Keep text legible:
  - Add a warm cream/ink overlay (e.g., `bg-paper/80` or a gradient overlay) so the art is visible but does not compete with the type.
  - Ensure hover states and the existing calligraphic flourish / cursor-blink decoration still read clearly.
- Preserve the existing card dimensions, alignment, and animations. The art should sit behind everything, not displace the anchored bottom stack.
- Mobile check: verify at 390px that the background does not reduce contrast or make captions hard to read.

## 3. Technical details

- Files changed:
  - `src/components/build/BuildPhilosophy.tsx`
  - `src/components/landing/FolioCard.tsx`
  - `src/pages/Index.tsx` (pass new `backgroundImage` props)
  - New assets: `src/assets/portfolio-impressionism.jpg`, `src/assets/resume-academic-painting.jpg`
- No data-schema, backend, or route changes.
- Use the agent-side image generator (standard or premium tier) for the two card backgrounds.
- Verify with `bun run build` and Playwright screenshots at desktop (1280px) and mobile (390px).

## 4. Verification

- Build passes without errors.
- Desktop screenshot: Portfolio card shows impressionist background, Resume card shows structured academic painting, both cards remain aligned and readable.
- Mobile screenshot: no contrast or layout regressions at 390px width.
- Portfolio page "How I work" copy reads as plain-language generative-systems thinking and references Epstein naturally.
