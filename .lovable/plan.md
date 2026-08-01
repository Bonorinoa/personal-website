## Goal

Give the Build page a real point of view — a systems-vs-reductionist stance on working with AI — and restructure it into three clean sections instead of a hero with a crowded sidebar.

```text
1. HERO              name the page, short honest framing
2. HOW I WORK        the philosophy (new)  + workspaces
3. SELECTED PROJECTS filters + last-synced + grid
```

## 1. Hero (tighten)

Keep "Things I've built." Rewrite the paragraph — it currently promises an "honest human/AI collaboration ratio," which no longer exists on the page. Replacement, roughly:

> Research tools, teaching software, and experiments — mostly built with agents, all of it under version control. The commit history is on each card, so you can check the shape of the work yourself.

Drop the `Method note` block and the workspace list out of the sidebar so the hero is a single-column statement with breathing room.

## 2. "How I work" section (new)

Sits directly after the hero, above the projects. Two-column on desktop, stacked on mobile. Section label in mono: `02 / How I work`.

Voice: casual and specific, the way a smart student explains something they actually believe — no "leveraging," no "empowering," no em-dash-heavy marketing cadence. Short sentences. One concrete example. Willing to say what's wrong with the common view.

Left column — the stance (~90 words), close to:

> Most AI work is reductionist. You shrink a task until a model can do it, then call the shrinking "progress." That's fine for a function. It's a bad way to think about a research pipeline, a classroom, or an economy.
>
> I care more about what happens to the whole system when one part gets ten times faster. Usually the bottleneck just moves somewhere less visible. So I build the parts so I can see them: small, logged, replaceable, cheap to throw away when they're wrong.

Right column — three short principles as a hairline-ruled list, each a label plus one sentence. Drafts:

- **Systems over parts.** A faster agent moves the bottleneck; it rarely removes it. Design for where it lands next.
- **Observable by default.** If I can't see what a step did, I don't trust it, no matter how good the output looks.
- **Cheap to reject.** Scope agent work so throwing it out costs nothing. That's what makes it safe to let it run.

Model/framework names stay out — this should survive the next release cycle.

## 3. Selected projects

- Rename the old sidebar `Method note` to **`What you're looking at`** and move it *below* the workspaces, at the end of the section. Same content (live GitHub data, hover the sparkline, click for detail) — it's a legend, so it belongs near the thing it explains.
- Workspaces list moves under the philosophy section as a compact horizontal strip on desktop, stacked on mobile.
- Filter bar, `LastSynced`, and `ProjectGrid` stay exactly as they are, under a `03 / Selected projects` label.

## Technical notes

- All edits in `src/pages/Build.tsx`. The philosophy block and workspaces strip get extracted into `src/components/build/BuildPhilosophy.tsx` and `src/components/build/WorkspaceStrip.tsx` to keep the page readable.
- Reuse existing tokens only — `font-mono`, `text-cobalt`, `hairline`, `border-border`, `text-muted-foreground`. No new colors.
- Same `framer-motion` fade/rise as the hero, staggered per section, respecting reduced-motion.
- Verify at 1280px and 390px with screenshots; check no layout shift and 44px tap targets on the workspace links.
- Update the page `<meta name="description">`, which also still references collaboration breakdowns.

Copy above is a draft — I'll write the final wording during implementation and you can redline it.
