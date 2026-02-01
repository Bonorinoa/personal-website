# Augusto González-Bonorino Personal Website

## Current Status: Phase 1 Complete ✅

### Implemented Features

#### 1. Dual-Mode Architecture
- **Landing Page (`/`)**: Pond-inspired aesthetic with mode selection buttons
- **Academic Mode (`/academic`)**: Professor-style typographic CV layout
- **Build Mode (`/build`)**: Project showcase with AI collaboration transparency
- **Persistent Mode Toggle**: localStorage-based mode persistence

#### 2. Grounded Content (from verified resume)
- **Education**: ASU PhD, CGU MA (4.0 GPA), Marist BA Honors (3.93 GPA, Summa Cum Laude)
- **Experience**: EconLLM Lab, Computational Justice Lab, Marist Data Science
- **Teaching**: Pomona College Visiting Lecturer (200+ students, 7 courses)
- **Publications**: Book chapters, journal articles, SSRN preprints, conference proceedings
- **Certifications**: BESLab, IBM Data Science, Imperial Linear Algebra, etc.
- **Grants**: $80,000+ total (BLAIS, AIER, Iceland Rannis, CGU Crossing Boundaries)
- **Awards**: Best Presentation, Hackathon placements, Academic honors

#### 3. AI Collaboration Matrix System
- **Task Taxonomy** (`src/data/llm-tasks.ts`): 12 defined task types
  - code-generation, code-review, data-processing, literature-review
  - writing-drafting, writing-editing, brainstorming, data-analysis
  - survey-design, translation, simulation, ux-design
- **LLM Models**: GPT-4/4o/3.5, Claude 3 variants, Gemini, LLaMA, Mistral, Cohere
- **Per-Project Matrix**: Structured `TaskUsage[]` in `collaboration_breakdown`
- **Aggregate Matrix**: Global heatmap showing (model, task) usage patterns

#### 4. Profile Links (verified)
- ORCID: 0000-0002-9355-0831
- Google Scholar: xdO0FqwAAAAJ
- GitHub: Bonorinoa
- LinkedIn: augustogbono
- Email: agonz439@asu.edu (+ 3 aliases)

### File Structure

```
src/
├── data/
│   ├── artifacts.json      # All grounded content
│   ├── inbox.json          # Phase 2 config (ORCID, GitHub ready)
│   ├── types.ts            # Canonical Artifact schema + new types
│   └── llm-tasks.ts        # Task taxonomy + model definitions
├── components/
│   ├── build/
│   │   ├── ProjectCard.tsx         # Enhanced with DemoEmbed + Matrix
│   │   ├── TagLegend.tsx           # Collaboration tag filter
│   │   ├── CollaborationMatrix.tsx # Per-project matrix view
│   │   ├── AggregateMatrix.tsx     # Global usage heatmap
│   │   └── DemoEmbed.tsx           # Smart demo preview (Colab, Vercel, etc.)
│   ├── academic/
│   │   ├── Section.tsx
│   │   └── PublicationList.tsx
│   └── shared/
│       ├── Navigation.tsx
│       └── ModeToggle.tsx
├── pages/
│   ├── Index.tsx           # Landing (pond)
│   ├── Academic.tsx        # Professor CV with ORCID/Scholar links
│   ├── Build.tsx           # Projects + Aggregate Matrix
│   └── Admin.tsx           # Password-protected scaffold
└── lib/
    └── artifacts.ts        # Data helpers + aggregation functions
```

### Phase 2 Ready
- ORCID ID configured: `0000-0002-9355-0831`
- GitHub username configured: `Bonorinoa`
- Google Scholar ID configured: `xdO0FqwAAAAJ`
- OpenAlex email aliases documented (needs deduplication)

### Next Steps
1. Add profile photo
2. Add more projects with real demos/screenshots
3. Implement Phase 2 ORCID/GitHub API fetching
4. Add timeline view for AI usage evolution
5. Dark mode support
