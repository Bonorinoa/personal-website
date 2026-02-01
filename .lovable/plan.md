

# Content Grounding & Collaboration Matrix Enhancement

## Overview

This update grounds the website with verified data from your resume and official profiles, and introduces a structured **AI Task Collaboration Matrix** to replace the free-text "AI Tools Used" field with a many-to-many mapping of LLMs to tasks.

---

## Part 1: Grounded Content Updates

### Personal Information
- **Name**: Augusto González-Bonorino
- **Origin**: Tucumán, Argentina
- **Email aliases**: agonz439@asu.edu, augusto.gonzalez-bonorino@cgu.edu, augusto.gonzalezbonorino1@marist.edu, agbonorino21@gmail.com
- **ORCID**: 0000-0002-9355-0831
- **Google Scholar ID**: xdO0FqwAAAAJ
- **LinkedIn**: augustogbono
- **GitHub**: Bonorinoa

### Education (verified from resume)
| Degree | Institution | Dates | GPA | Specialization |
|--------|-------------|-------|-----|----------------|
| PhD Economics | Arizona State University | Aug 2025 – Current | – | Microeconomic Theory and AI |
| MA Economics (PhD Track) | Claremont Graduate University | Aug 2022 – May 2024 | 4.0/4.0 | Applied Microeconomics - Experimental |
| BA Honors (Summa Cum Laude) | Marist College | Aug 2019 – May 2022 | 3.93/4.0 | Economics, Data Science & Analytics; Minor: Mathematics |

### Research Experience (verified)
- **EconLLM Lab, CGU** (Fall 2023 – Ongoing): Lead graduate researcher. Pioneered lab with Dr. Monica Capra exploring LLMs in experimental economics.
- **Computational Justice Lab, CGU** (Fall 2022 – June 2023): Collaborated with Riverside County DA Office on causal implications of sentencing.
- **Marist Data Science** (Fall 2020 – May 2022): Led team of 5 students + 2 faculty on ODQA system "Kevin."

### Teaching (verified)
- **Pomona College** (Fall 2024 – Spring 2025): Full-Time Visiting Lecturer
  - ECON 57: Economic Statistics with R
  - ECON 101: Intermediate Macroeconomics (4 sections)
  - ECON 167: Econometrics with Linear Algebra
  - Taught/mentored 200+ students across 7 courses

### Publications (verified from Google Scholar & resume)

**Book Chapters:**
- Olafsson, B., Martin, D., & Gonzalez-Bonorino, A. (2025). "Enhancing well-being by leveraging artificial intelligence in coaching practices." In *The Health and Wellbeing Coaches' Handbook*. Taylor & Francis.

**Journal Articles:**
- Bonorino, A. G., Ndiaye, M., & DeCusatis, C. (2022). "Near term hybrid quantum computing solution to the matrix Riccati equations." *Journal of Quantum Computing*, 4(3), 135-146.
- Capra, C. M., Gonzalez-Bonorino, A., & Pantoja, E. (2024). "LLMs Model Non-WEIRD Populations." *SSRN* + arXiv:2501.06834.

**Conference Proceedings:**
- Gonzalez-Bonorino, A., & Lauría, E. J. M. (2023). "Adaptive Kevin: A Multipurpose AI Assistant for Higher Education." *CSEDU 2022, CCIS Vol. 1817*. Springer.
- González Bonorino, A., Lauría, E. J. M., & Presutti, E. (2022). "Implementing Open-Domain Question-Answering in a College Setting." *CSEDU 2022*.
- Gonzalez Bonorino, A. (2023). "Smart Surveys: An Automatic Survey Generation and Analysis Tool." *CSEDU 2023*.

**Conference Presentations:**
- ESA North American Meeting (Charlotte, NC, 2023): "Large Language Models for Non-WEIRD Populations"
- WPPA 8th Annual Conference (Albuquerque, NM, 2024): "PERMA+4 in Action: AI Facilitated Coaching"
- ECC 2023 (Poughkeepsie, NY): "AutoKevin: Semi-Autonomous AI Architecture" – **Best Presentation Award**

### Certifications (verified)
- BESLab Experimental and Computational Economics (Universitat Pompeu Fabra, June 2024)
- Social Network Analysis (CGU, Aug 2022)
- Quantum Computing Algorithms (Marist, Fall 2021)
- IBM Data Science Professional (Summer 2020)
- Linear Algebra for ML (Imperial College London, Summer 2020)
- IBM Applied AI (Summer 2020)

### Skills (verified)
- **Languages**: Python, R, SQL, NetLogo, Java, LaTeX, Stata, Excel
- **Frameworks**: TensorFlow, Scikit-learn, LangChain, Hugging Face, Statsmodels, pandas, dplyr
- **Applications**: Machine Learning, NLP, Reinforcement Learning, Algorithmic Game Theory

### Grants & Fellowships (verified amounts)
- CGU BLAIS Grant ($35,000)
- American Institute of Economic Research Award ($14,000)
- Iceland Ministry of Education Rannis Frae Grant ($15,000)
- CGU Crossing Boundaries Transdisciplinary Grant ($10,000)
- Marist Data Science Summer Research Fellowship ($5,000)
- CofC Honors Summer Grant ($750)

### Awards (verified)
- Vassar DataFest Best Statistical Analysis Award
- LabLab.ai + Cohere Hackathon 2nd Place
- ECC 2023 Best Presentation Award
- CGU Drucker-Kravis Business Competition 1st Place
- President's Academic Achievement Award (Marist, highest GPA among student-athletes)
- Dean's List (Fall 2019 – Spring 2022)
- NCAA D1 Public Recognition, ITA Scholar Athlete (2020/22)

---

## Part 2: Collaboration Matrix Design

### The Core Concept
Replace the free-text "AI Tools Used" with a structured **Task Taxonomy** that maps LLMs to specific task categories. This enables:
1. Quantifiable patterns of (model, task) usage
2. Aggregate statistics across all projects
3. Time-series analysis of AI usage evolution

### Task Taxonomy (finite set)

```text
Tasks I Use AI For:
+----------------------+--------------------------------------------------+
| Task ID              | Description                                      |
+----------------------+--------------------------------------------------+
| code-generation      | Writing code from specifications                 |
| code-review          | Reviewing/debugging existing code                |
| data-processing      | Cleaning, transforming, parsing data             |
| literature-review    | Summarizing papers, finding relevant work        |
| writing-drafting     | First drafts of prose, documentation             |
| writing-editing      | Refining, improving existing text                |
| brainstorming        | Ideation, exploring solution spaces              |
| data-analysis        | Statistical analysis, visualization              |
| survey-design        | Crafting questions, survey logic                 |
| translation          | Multi-language support                           |
| simulation           | Running agent-based/synthetic experiments        |
| ux-design            | UI/UX suggestions, prototyping                   |
+----------------------+--------------------------------------------------+
```

### LLM Models (rows)
- GPT-4/GPT-4o
- GPT-3.5
- Claude 3 (Opus/Sonnet/Haiku)
- Claude 2
- Gemini
- LLaMA/Mistral (open-source)
- Cohere
- Custom fine-tuned models

### Data Structure Update

```text
CollaborationBreakdown (updated):
  human: string           // What I did
  matrix: [               // Many-to-many LLM-Task mapping
    { model: "GPT-4", tasks: ["code-generation", "brainstorming"] },
    { model: "Claude 3", tasks: ["writing-drafting", "literature-review"] }
  ]
  verification: string    // Quality assurance methods
```

---

## Part 3: Build Page Redesign

### Project Cards Enhancement

**Current design**: Catalog grid with preview placeholder + collapsible text breakdown.

**Enhanced design**:
1. **Embedded Demo Preview**: For projects with demos, show interactive previews
   - Google Colab notebooks: Embed thumbnail with "Open in Colab" badge
   - Vercel/deployed apps: Show iframe or screenshot with "Live Demo" overlay
   - Streamlit apps: Preview image with quick-launch link
   - Papers: Show abstract snippet with PDF/DOI links

2. **Mini Collaboration Matrix** (in collapsed view): Visual dot-matrix showing which models were used for which tasks
   
3. **Expandable Details**: Full breakdown on expand

### Aggregate Collaboration Dashboard

Add a new section above/below the project grid showing:

1. **Usage Heatmap**: A matrix visualization (LLMs x Tasks) where cell intensity = frequency of use across all projects

2. **Model Preference Pie/Bar Chart**: Distribution of LLM usage

3. **Task Distribution**: Which tasks I most commonly delegate to AI

4. **Timeline View** (optional): Evolution of AI tool usage over time by year

### Build Page Layout

```text
+----------------------------------------------------------+
| Build Portfolio                                          |
+----------------------------------------------------------+
| AI-Human Collaboration Principles (philosophy text)     |
+----------------------------------------------------------+
| [AGGREGATE COLLABORATION MATRIX]                         |
| ┌────────────────────────────────────────────────────┐  |
| │  Heatmap: Models x Tasks                            │  |
| │  ┌─────┬─────┬─────┬─────┬─────┬─────┐            │  |
| │  │     │code │write│data │brain│...  │            │  |
| │  ├─────┼─────┼─────┼─────┼─────┼─────┤            │  |
| │  │GPT-4│ ●●● │ ●●  │ ●●● │ ●   │     │            │  |
| │  │Claud│ ●●  │ ●●●●│ ●   │ ●●  │     │            │  |
| │  └─────┴─────┴─────┴─────┴─────┴─────┘            │  |
| └────────────────────────────────────────────────────┘  |
+----------------------------------------------------------+
| [TAG LEGEND / FILTER]                                    |
+----------------------------------------------------------+
| ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       |
| │ Smart       │  │ Kevin ODQA  │  │ Personal    │       |
| │ Surveys     │  │             │  │ Website     │       |
| │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │       |
| │ │ Colab   │ │  │ │ GitHub  │ │  │ │ Vercel  │ │       |
| │ │ Preview │ │  │ │ Preview │ │  │ │ Preview │ │       |
| │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │       |
| │ [matrix]    │  │ [matrix]    │  │ [matrix]    │       |
| └─────────────┘  └─────────────┘  └─────────────┘       |
+----------------------------------------------------------+
```

---

## Part 4: Implementation Details

### New Files
- `src/data/llm-tasks.ts`: Task taxonomy definitions
- `src/components/build/CollaborationMatrix.tsx`: Individual project matrix
- `src/components/build/AggregateMatrix.tsx`: Global usage heatmap
- `src/components/build/DemoEmbed.tsx`: Smart demo preview component

### Schema Updates (types.ts)

Add:
- `AITask` type (the task taxonomy enum)
- `LLMModel` type (known models)
- `TaskUsage` interface (model + tasks array)
- Updated `CollaborationBreakdown` with matrix field

### Updated artifacts.json
- Replace placeholder data with verified resume content
- Add source_ids (ORCID, DOI, arXiv, SSRN, GitHub)
- Add collaboration matrices to build-mode artifacts
- Add real demo links where available

### Phase 2 Inbox Configuration
Add to `src/data/inbox.json`:
```text
credentials_needed:
  orcid: "0000-0002-9355-0831"       // READY TO USE
  github: "Bonorinoa"                // READY TO USE  
  scholar_id: "xdO0FqwAAAAJ"         // READY TO USE
  openalex_emails:                   // For deduplication
    - augusto.gonzalezbonorino1@marist.edu
    - augusto.gonzalez-bonorino@cgu.edu
    - agonz439@asu.edu
    - agbonorino21@gmail.com
```

---

## Part 5: Technical Summary

### Files to Create
| File | Purpose |
|------|---------|
| `src/data/llm-tasks.ts` | Task taxonomy + LLM model definitions |
| `src/components/build/CollaborationMatrix.tsx` | Per-project matrix view |
| `src/components/build/AggregateMatrix.tsx` | Global usage heatmap |
| `src/components/build/DemoEmbed.tsx` | Smart demo preview (Colab, Vercel, etc.) |

### Files to Update
| File | Changes |
|------|---------|
| `src/data/types.ts` | Add AITask, LLMModel, TaskUsage types; update CollaborationBreakdown |
| `src/data/artifacts.json` | Ground all content with verified resume data; add matrices |
| `src/data/inbox.json` | Add credentials configuration for Phase 2 |
| `src/components/build/ProjectCard.tsx` | Add matrix visualization, enhanced demo preview |
| `src/pages/Build.tsx` | Add AggregateMatrix section |
| `src/pages/Academic.tsx` | Update bio text, add ORCID/Scholar links |
| `src/lib/artifacts.ts` | Add helper functions for matrix aggregation |

### External Links to Add
- ORCID: https://orcid.org/0000-0002-9355-0831
- Google Scholar: https://scholar.google.com/citations?user=xdO0FqwAAAAJ
- LinkedIn: https://linkedin.com/in/augustogbono/
- Marist Profile: https://www.marist.edu/w/profiles/augusto-gonzalez-bonorino

---

## Deliverables

1. Fully grounded artifacts.json with verified resume content
2. New task taxonomy system for structured AI collaboration tracking
3. Collaboration matrix visualization (per-project + aggregate)
4. Enhanced project cards with embedded demo previews
5. Updated Academic page with complete verified CV
6. Phase 2 inbox configured with your identifiers (ORCID, GitHub, Scholar)

