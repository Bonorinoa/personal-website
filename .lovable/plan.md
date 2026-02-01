

# Augusto González-Bonorino Personal Website
## One Brand, Two Modes (Academic + Build)

---

## 🎯 Overview

A minimal, elegant personal website with a unified brand identity rendered in two distinct modes:
- **Academic Mode**: Professor-style, typographic, scholarly presentation
- **Build Mode**: Project cards with AI-human collaboration transparency

---

## 📍 Page Structure

### 1. Landing Page (`/`)
**The "Pond" Experience**

- Abstract pond/water-inspired background with subtle CSS-based ripple animations
- Two floating buttons: "Academic" and "Build" centered over the water surface
- **Hover interactions**:
  - Academic → ordered, calm ripple pattern + serif typography preview
  - Build → slightly more energetic ripples + grid/technical feel
- **Mobile fallback**: Gentle idle ripple animation with two large tap-friendly buttons
- Mode selection persists in localStorage for return visits

---

### 2. Academic Mode Page (`/academic`)
**Professor Profile Aesthetic**

Clean, typographic layout inspired by Google Scholar / university faculty pages:

**Sections (rendered as structured lists, no cards):**
- **About/Bio** — Brief introduction with profile photo placeholder
- **Education**
  - ASU PhD Economics (Aug 2025 – current)
  - CGU MA Economics, PhD track (Aug 2022 – May 2024) — GPA: 4.0
  - Marist College BA Honors, Summa Cum Laude (Aug 2019 – May 2022) — GPA: 3.93
- **Research & Work Experience**
  - EconLLM Lab, CGU — Lead graduate researcher
  - Computational Justice Lab — Research Assistant
  - Marist College Data Science — Lead AI student analyst
- **Teaching**
  - Pomona College Visiting Lecturer — ECON 57, 101, 167
- **Publications & Presentations**
  - Book chapters, journal articles, SSRN preprints, conference papers
  - Links to full texts where available
- **Certifications & Skills** (collapsed by default, expandable)
- **Honors, Grants & Awards** (collapsed by default)

**Design elements:**
- Paper-ish subtle background texture
- Classic serif headlines (e.g., Playfair Display) + clean sans-serif body
- Neutral warm palette (off-white, charcoal, muted gold accents)
- Restrained motion (subtle fade-ins only)
- External links: GitHub, EconLLM Lab, Perwell Group consulting

---

### 3. Build Mode Page (`/build`)
**Project Showcase with AI Transparency**

**Hero Section:**
- "AI-Human Collaboration Principles" placeholder text area
- Brief philosophy about how you work with AI tools (content TBD)

**Tag Legend (sticky at top):**
| Tag | Ratio | Meaning |
|-----|-------|---------|
| `vibe-coded` | ~20/80 | Mostly AI-generated; I provided direction/design feedback |
| `vibe-engineered` | ~50/50 | I designed systems + analyses; AI executed substantial work |
| `ai-assisted` | ~80/20 | I did most implementation; AI as pair programmer |

Each tag has a tooltip with the approximate ratio and explanation.

**Project Cards (filtered by tags):**
Each card includes:
- Title, date, summary
- Demo/preview slot (image/video placeholder)
- Tags (clickable to filter)
- Expandable "Collaboration Breakdown":
  - **Me**: What I designed/implemented
  - **AI Tools**: Which tools assisted and how
  - **Verification**: Tests, benchmarks, or evidence of quality
- Links: Repo, Demo, Paper (where applicable)

**Initial Build Mode artifacts** (based on your resume):
- EconLLM Lab research platform → `vibe-engineered`
- ODQA/Kevin AI assistant (Marist) → `ai-assisted`
- Smart Surveys tool → `ai-assisted`
- Any GitHub projects with demos → TBD tags

**Design elements:**
- Faint grid/dot pattern background
- Subtle frosted glass on cards and nav
- Technical but minimal aesthetic
- Slightly more motion (card hover lifts, tag filters)

---

## 🔄 Persistent Mode Toggle

- Small toggle in navigation header on all pages
- Allows switching between Academic ↔ Build without returning to landing
- Mode state saved in localStorage
- Subtle transition animation on toggle

---

## 📦 Data Architecture

### Canonical Artifact Schema
```
artifact:
  id: unique-identifier
  type: paper | project | talk | role | award | certification | education
  title: string
  date: ISO date
  summary: short description
  links:
    repo: URL | null
    demo: URL | null
    paper: URL | null
  tags: [vibe-coded | vibe-engineered | ai-assisted]
  featured: boolean
  mode_visibility: academic | build | both
  collaboration_breakdown:
    human: string (what you did)
    ai_tools: string (tools used)
    verification: string (tests/evidence)
  evidence:
    tests: string | null
    benchmarks: string | null
  source_ids:
    doi: string | null
    arxiv: string | null
    ssrn: string | null
    orcid: string | null
    github: string | null
```

### Phase 1: Local JSON
- `src/data/artifacts.json` — all content in one place
- `src/data/inbox.json` — scaffold for Phase 2 candidate items
- TypeScript types for schema validation

---

## 🔐 Admin Panel (`/admin`)

**Access:** Password-protected stub (simple client-side prompt)

**UI Sections (scaffolded, limited functionality):**
1. **Inbox** — List of pending candidate artifacts (from Phase 2 automation)
   - Approve / Reject / Edit actions (placeholder)
2. **Content Management** — View/edit existing artifacts
   - Toggle featured, tags, mode visibility
3. **Analytics** — Placeholder dashboard area
4. **Private Widgets** — Beta section (default OFF)

**Note:** Full authentication will be implemented in a later phase. Clear TODO comments will mark where to add Supabase auth.

---

## 📡 Phase 2 Scaffolding (Structure Only)

**Inbox collection structure created for:**
- ORCID discovered works
- Crossref citations
- GitHub repository activity

**After scaffolding is complete, I will tell you exactly:**
- Where to add your ORCID ID
- Where to add your GitHub username/token
- Where to add Crossref email (optional)
- Where to add analytics tokens

**No API calls will be made until you provide these credentials.**

---

## ⚡ Quality & Performance

- **Lightweight CSS ripples** (no heavy 3D/WebGL)
- **Reduced motion support** via `prefers-reduced-motion` media query
- **Semantic HTML** with proper heading hierarchy
- **Keyboard navigation** for all interactive elements
- **Lazy loading** for images and expandable sections
- **Dark mode ready** (can be added later via existing theme system)

---

## 📁 File Structure

```
src/
├── data/
│   ├── artifacts.json       # All content
│   ├── inbox.json           # Phase 2 candidates
│   └── types.ts             # Artifact schema types
├── pages/
│   ├── Index.tsx            # Landing (pond)
│   ├── Academic.tsx         # Academic mode
│   ├── Build.tsx            # Build mode
│   └── Admin.tsx            # Admin panel
├── components/
│   ├── landing/
│   │   ├── PondBackground.tsx
│   │   ├── ModeButton.tsx
│   │   └── RippleEffect.tsx
│   ├── academic/
│   │   ├── Section.tsx
│   │   └── PublicationList.tsx
│   ├── build/
│   │   ├── TagLegend.tsx
│   │   ├── ProjectCard.tsx
│   │   └── CollaborationBreakdown.tsx
│   ├── shared/
│   │   ├── ModeToggle.tsx
│   │   └── Navigation.tsx
│   └── admin/
│       ├── InboxList.tsx
│       └── ContentEditor.tsx
├── hooks/
│   └── useMode.ts           # Mode state management
└── lib/
    └── artifacts.ts         # Data loading utilities
```

---

## 🚀 Deliverables

1. ✅ Functional landing page with pond/ripple aesthetic
2. ✅ Academic mode with full typographic resume layout
3. ✅ Build mode with filterable project cards + AI collaboration tags
4. ✅ Persistent mode toggle across site
5. ✅ Canonical artifact data model with seed content
6. ✅ Password-protected admin scaffold
7. ✅ Phase 2 inbox structure (ready for automation)
8. ✅ Mobile-responsive design throughout

