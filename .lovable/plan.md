# Consulting bubble escape

- Keep **Resume** and **Portfolio** as the only two choices inside the liquid-glass selector; Consulting remains a separate navigation link.
- On `/consulting`, remove the false Resume selection and let the glass thumb perform a deliberately silly escape: squash, hop out of the selector, arc toward Consulting, overshoot slightly, and settle beneath the word with a small wobble.
- Finish the motion as a restrained oxblood glass underline beneath **Consulting**, so the joke resolves into a clear active-page indicator rather than looping indefinitely.
- When leaving Consulting, reverse the hand-off: the underline lifts and fades while the selector thumb appears under the chosen Resume or Portfolio option.
- Keep the animation short enough to feel responsive, run it only on route changes rather than continuously, and avoid moving either navigation label or changing the navigation layout.
- Under reduced-motion preferences, skip the hop and use an immediate crossfade between the Consulting underline and selector thumb.
- Verify direct loading of `/consulting`, navigation into and out of Consulting, rapid clicks, desktop and 390px layouts, and absence of clipping or overlap.

## Files to touch

- `src/components/shared/Navigation.tsx` — coordinate the separate Consulting active marker and shared navigation motion.
- `src/components/shared/ModeToggle.tsx` — support a neutral state on Consulting and animate the selector thumb’s departure/return without adding a third option.

## Technical detail

Use the existing Framer Motion dependency with shared layout identity and route-aware variants. The travel effect will be a fixed keyframed transform between measured navigation elements, with squash/stretch and a small overshoot; no new dependency, global style, mode, or design token is needed.
