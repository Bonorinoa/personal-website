
# Executive Redesign + Stabilization Plan

A single coordinated pass: lock in a real visual identity (Quiet Modernist), fix the bugs that are actively breaking the app, harden admin, and ship the polish a personal site needs to feel "done."

## Visual identity: Quiet Modernist

Paper-white `#fafaf7` and ink-black `#0a0a0a` with a single electric cobalt `#2348ff` accent. Greyscale `#6b6b6b` for secondary. Zero gradients, zero glassmorphism, no purple-on-white. Mode-specific accents stay within this palette — academic leans warm-neutral type weight, build leans tighter mono — so the two modes feel like the same studio, not two skins.

**Typography**: Fraunces (display serif for academic mode) + Geist Sans (UI everywhere) + Geist Mono (build mode + code). Self-hosted via `@fontsource` — kills the Google Fonts request and FOUT.

**Design tokens**: rewrite `index.css` with semantic HSL tokens (`--ink`, `--paper`, `--cobalt`, `--rule`, `--muted-ink`), shadow tokens (`--shadow-hairline`, `--shadow-lift`), radius tokens (mostly `0` and `2px` — Swiss precision, no soft pills), and proper dark mode (`#0a0a0a` paper, `#fafaf7` ink, cobalt stays). Tailwind config consumes them; no hardcoded colors in components.

**Motion**: Framer Motion with a single shared `easeOut [0.16, 1, 0.3, 1]` curve and `120ms / 240ms / 480ms` durations. One hero gesture per page, micro-fades on list items, no parallax theater.

## Landing chooser refinement (keep dual modes)

The pond particle background reads as generic. Replace with a single deliberate gesture: an **animated typographic split** — the name renders once in serif, then on hover/tap a vertical hairline rule slides in from center and the two halves morph (left → Fraunces serif "Research," right → Geist Mono "Build"). Two buttons become two columns of the same screen, each with a one-line preview of what's inside (e.g. "12 publications, 4 working papers" / "9 shipped projects, AI-collab transparency"). Mobile: stacks vertically with the same hairline as a divider. Removes the "which do I pick?" friction by previewing both.

## Per-page improvements

**Academic (`/academic`)**:
- Replace "AG" avatar stub with a real headshot slot (placeholder image now, swap later) + downloadable CV button (PDF link, configurable).
- Add a "Currently" block above Education — one-line status (where you are, what you're working on, contact).
- Publications: real BibTeX / cite-as popover per entry, DOI badges, year-grouped with sticky year column on desktop.
- Section headings: small-caps Fraunces with cobalt hairline underline.
- Mobile spacing fixes (current pt-24 collides with nav on small screens).

**Build (`/build`)**:
- Kill the horizontal scroll-snap pattern — it hides projects below the fold and breaks on touch. Replace with a vertical bento grid (featured project = 2-col, others 1-col) with hover-reveal demo embeds.
- Move the "AI-Human Collaboration Principles" out of a collapsible into a permanent right-column sidebar on desktop (it's the differentiator, not a footnote).
- Tag legend becomes a sticky filter bar with active-state cobalt fill.
- Aggregate matrix gets a real treatment: square cells, monospace labels, intensity ramp from paper to ink with cobalt highlights for top-3.

**Admin (`/admin`)**:
- Replace hardcoded password with **Google sign-in only**, restricted to your email (`hd` + email allowlist check). Unauthorized users see a polite "not for you" screen.
- Fix the `ERR_NAME_NOT_RESOLVED` noise — `useArtifacts`/`useInboxItems` are calling Supabase with placeholder URLs during initial render. Guard the queries on a real `SUPABASE_URL`.
- Add a "Site preview" toggle so you can see exactly how an edit will render in Academic vs Build before approving.

## Bugs / hygiene fixed in this pass

1. **Hardcoded admin password** → Google OAuth with email allowlist (executive decision: your email only).
2. **Supabase ERR_NAME_NOT_RESOLVED** flooding the console on every page → guarded queries + proper env validation.
3. **`index.html` SEO defaults** ("Lovable Generated Project") → real title, meta description, canonical (relative), Open Graph + Twitter card, JSON-LD `Person` schema with your affiliations, ORCID, Google Scholar.
4. **README placeholder** → real project README.
5. **React Router v7 future-flag warnings** → opt into `v7_startTransition` + `v7_relativeSplatPath` (free, silences noise, future-proofs).
6. **No `prefers-color-scheme` dark mode** → wire dark mode through the new tokens; toggle in nav.
7. **No 404 design** → NotFound gets the Quiet Modernist treatment (cobalt 404, hairline rule, return-home link).
8. **Mobile nav** currently overlaps content on Academic at the top — fixed with proper safe-area padding.
9. **`useMode` race** — Academic/Build pages call `setMode` in an effect that re-fires; debounce or move to URL-derived mode.

## Technical specifics

```text
src/
├── index.css                  # rewritten tokens, dark mode, no gradients
├── styles/
│   └── fonts.ts               # @fontsource imports (Fraunces, Geist Sans/Mono)
├── pages/
│   ├── Index.tsx              # new typographic split landing
│   ├── Academic.tsx           # Currently block, CV button, BibTeX, year column
│   ├── Build.tsx              # bento grid, sticky philosophy sidebar
│   ├── Admin.tsx              # Google-auth gate
│   └── NotFound.tsx           # redesigned
├── components/
│   ├── auth/RequireAuth.tsx   # new — Google OAuth + email allowlist
│   ├── shared/Navigation.tsx  # dark-mode toggle, mobile fix
│   ├── shared/Footer.tsx      # new — contact + social, hairline top
│   ├── academic/CitePopover.tsx  # new
│   └── build/BentoGrid.tsx    # replaces ProjectShowcase scroll-snap
├── hooks/
│   ├── useArtifacts.ts        # env-guarded queries
│   ├── useInboxItems.ts       # env-guarded queries
│   └── useTheme.ts            # new — light/dark
└── lib/seo.ts                 # new — JSON-LD Person builder

index.html                     # real meta, OG, JSON-LD
public/cv.pdf                  # placeholder, you swap with real CV
README.md                      # real readme
```

**Auth flow**: `RequireAuth` wraps `/admin`. On mount → check `lovable.auth.getUser()`; if null → render Google sign-in button (`lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/admin" })`); after callback → verify `user.email` against allowlist constant (`AUGUSTO_EMAIL`); on mismatch → sign out + "not for you" view. No password, no localStorage role check.

**Auth setup**: `configure_social_auth({ providers: ["google"], disable_providers: ["email"] })` runs in this build pass.

**Migration**: delete the `ADMIN_PASSWORD` constant, delete the password state, remove the auth memory note about `admin123` after the swap.

## Out of scope (this pass)

- Contact form / email sending (can add later via Lovable AI gateway or Resend).
- Blog / writing section.
- Multi-language support.
- Per-user public profiles (Admin is single-user by design).

## Order of operations

1. Tokens + fonts + Tailwind config + dark mode wiring.
2. Bug sweep (Supabase env guards, router flags, SEO meta, JSON-LD, README).
3. Google auth + `/admin` lockdown.
4. Landing chooser redesign.
5. Academic page refinements.
6. Build page bento + sidebar.
7. NotFound + Footer + nav polish.
8. Browser QA pass at desktop + mobile viewports, screenshot every route.

End state: a site that looks like one designer made it on purpose, with no console errors, real auth, real SEO, and room to grow.
