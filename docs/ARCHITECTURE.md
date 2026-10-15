# Code Architecture & Technical Blueprint

> *Directing the Machine: A Deliberate Practice Environment for Creative Authorship, Diagnostic Vision, and Calibrated Direction in an AI-Augmented World.*
>
> **Conceived, written, engineered, and maintained by [Rahul Rajeev](https://github.com/drawablex86).**

---

## 1. Architectural Philosophy & Core Constraints

Directing the Machine is engineered around a set of non-negotiable architectural invariants:

1. **Local-First & Client-Side Privacy**:
   - Zero remote databases or tracking servers.
   - All state—including practice drills, 10-minute logs, baseline competencies, brief formulations, calibration forecasts, and BYOK API keys—persists exclusively in the client's browser via `localStorage`.
   - The application functions 100% offline once downloaded.

2. **Static Edge Delivery**:
   - Built with **SvelteKit 2** using `@sveltejs/adapter-auto` with static pre-rendering enforced globally via `src/routes/+layout.ts` (`export const prerender = true`).
   - Every route (`/`, `/app`, `/logs`, `/blog`, `/blog/[slug]`, `/sitemap.xml`, `/blog/rss.xml`) is compiled to immutable static HTML/JSON/XML snapshots during `pnpm run build` and served from Vercel's Global Edge Network with 0ms serverless cold-start overhead.

3. **Modern Reactive Primitives (Svelte 5 Runes Only)**:
   - Built on **Svelte 5**.
   - Reactive state is managed exclusively via modern Runes (`$state`, `$derived`, `$effect`, `$props`).
   - Legacy Svelte 3/4 stores (`writable`, `derived`, `readable`, `get(store)`) and deprecated `<slot />` elements are strictly forbidden.

4. **Zero-Runtime Tailwind CSS v4 Engine**:
   - Configured via `@tailwindcss/vite` and `src/app.css` using modern `@import "tailwindcss";` and `@theme` directives.
   - No `tailwind.config.js` exists or is needed.
   - Design tokens map directly to CSS custom properties defined in the Kepano Stone & Paper design system.

5. **Client-Side BYOK (Bring Your Own Key) Inference**:
   - AI generation and diagnostic feedback are performed client-side using direct browser `fetch()` calls to LLM providers (OpenRouter, OpenAI, Google Gemini, Anthropic, and local endpoints like Ollama).
   - Keys remain in local browser memory and are never transmitted to any third-party intermediary backend.

---

## 2. High-Level System Topology

```mermaid
flowchart TD
    subgraph Client_Browser["Client Browser (Local-First Runtime)"]
        subgraph UI_Presentation["UI Presentation Layer (Svelte 5 Runes)"]
            HomeRoute["/ (Ogilvy Landing Page & Discovery)"]
            StudioRoute["/app (Deliberate Practice Studio M0–M7)"]
            LogsRoute["/logs (Unified Logbook & Appendix L Exporter)"]
            BlogRoute["/blog & /blog/[slug] (Field Essays Reader)"]
        end

        subgraph Reactive_State["Reactive State Engine (`src/lib/state/`)"]
            PracticeStore["PracticeEngine Singleton (`practice.svelte.ts`)\n• temporal state (week, day, part)\n• baseline competencies\n• problems, briefs, decisions, calibrations\n• BYOK provider settings"]
            LearnerPrefs["LearnerPreferences (`dtm_learner_prefs_v1`)\n• theme (stone / paper)\n• typography (sans, mono, dyslexic)\n• ADHD single-task mode\n• audio sound cues"]
        end

        subgraph Domain_Engines["Domain Utilities & Engines (`src/lib/engine/`)"]
            BrierCalc["`calibration-math.ts`\nBrier Score & Taste-Narrowness"]
            Linter["`adjective-linter.ts`\nZero-Adjective Regex Checker"]
            BYOKEngine["`inference.ts`\nMulti-Provider LLM Client"]
            SoundFX["`sound-system.ts`\nWeb Audio Oscillator Cues"]
            ArchExport["`archive-exporter.ts`\nAppendix L Markdown/JSON Packager"]
            MdRender["`markdown-renderer.ts`\nLightweight Markdown Formatter"]
        end

        subgraph Static_Data["Static Curriculum & Content Layer (`src/lib/data/`)"]
            Curriculum["`curriculum.ts` (19 Weeks, 133 Day Plans, 7-Step Tasks)"]
            Projects["`projects.ts` (Projects 1–12 Rubrics & Deliverables)"]
            Appendices["`appendices.ts` (Appendices A–O Full Protocols)"]
            Essays["`blog/posts.ts` (Long-Form Editorial Essays)"]
            Drills["`drills.ts` & `core-readings.ts`"]
        end

        subgraph Local_Storage["Browser Storage (`localStorage`)"]
            LS_State[("`dtm_practice_store_v1`")]
            LS_Prefs[("`dtm_learner_prefs_v1`")]
        end
    end

    subgraph External_APIs["Direct Client-to-API Endpoints (BYOK)"]
        OpenRouterAPI["OpenRouter API (`openrouter.ai/api/v1`)"]
        OpenAIAPI["OpenAI API (`api.openai.com/v1`)"]
        GoogleAPI["Google Gemini API (`generativelanguage.googleapis.com`)"]
        AnthropicAPI["Anthropic API (`api.anthropic.com/v1`)"]
        LocalOllama["Custom / Ollama (`localhost:11434/v1`)"]
    end

    %% Wiring
    UI_Presentation --> PracticeStore
    UI_Presentation --> LearnerPrefs
    PracticeStore <--> LS_State
    LearnerPrefs <--> LS_Prefs
    PracticeStore --> BrierCalc
    UI_Presentation --> Linter
    UI_Presentation --> SoundFX
    UI_Presentation --> MdRender
    LogsRoute --> ArchExport
    UI_Presentation --> Curriculum
    UI_Presentation --> Projects
    UI_Presentation --> Appendices
    BlogRoute --> Essays

    PracticeStore --> BYOKEngine
    BYOKEngine --> OpenRouterAPI
    BYOKEngine --> OpenAIAPI
    BYOKEngine --> GoogleAPI
    BYOKEngine --> AnthropicAPI
    BYOKEngine --> LocalOllama
```

---

## 3. Directory Taxonomy

```
directing-the-machine/
├── docs/                               # Dedicated architecture and design system documentation
│   ├── ARCHITECTURE.md                 # This technical blueprint
│   └── DESIGN_SYSTEM.md                # Kepano Stone & Paper design system specification
├── src/
│   ├── app.css                         # Tailwind CSS v4 stylesheet & CSS custom properties
│   ├── app.html                        # HTML shell with accessibility anchors & FOUC prevention
│   ├── app.d.ts                        # SvelteKit TypeScript environmental declarations
│   ├── routes/                         # SvelteKit route hierarchy
│   │   ├── +layout.svelte              # Global app wrapper (theme initialization, shortcuts, audio)
│   │   ├── +layout.ts                  # Static prerender declaration (export const prerender = true)
│   │   ├── +page.svelte                # Flagship editorial landing page (Ogilvy hero, theses, syllabus)
│   │   ├── app/
│   │   │   └── +page.svelte            # Deliberate Practice Studio workspace (Today loop & M0–M7)
│   │   ├── logs/
│   │   │   └── +page.svelte            # Unified studio logbook with 10-minute timer & exporter
│   │   ├── blog/
│   │   │   ├── +page.svelte            # Field Essays catalog with category filters & search
│   │   │   ├── rss.xml/+server.ts      # Prerendered RSS 2.0 feed generator
│   │   │   └── [slug]/
│   │   │       ├── +page.svelte        # Long-form essay reader with reading progress & sticky TOC
│   │   │       └── +page.ts            # Dynamic slug loader and SEO schema generator
│   │   └── sitemap.xml/
│   │       └── +server.ts              # Prerendered XML sitemap generator
│   └── lib/
│       ├── index.ts                    # Barrel exports
│       ├── assets/
│       │   └── favicon.svg             # Minimalist aperture brandmark
│       ├── config/
│       │   └── site.ts                 # SITE_CONFIG (canonical domain, social handles, metadata)
│       ├── types/
│       │   ├── inference.ts            # Type definitions for BYOK inference providers & requests
│       │   └── llm-prompts.ts          # Type system for prompt templates, roles, and critique results
│       ├── schemas/
│       │   ├── course.schema.ts        # Zod schemas for logs, briefs, baseline, calibrations
│       │   └── competency-details.ts   # Definitions for the 12 deliberate practice competencies
│       ├── state/
│       │   └── practice.svelte.ts      # Reactive PracticeEngine store with localStorage sync
│       ├── engine/
│       │   ├── adjective-linter.ts     # Zero-adjective regex validator & violation locator
│       │   ├── calibration-math.ts     # Brier score calculator & taste-narrowness detector
│       │   ├── archive-exporter.ts     # Appendix L Markdown/JSON bundle generator
│       │   ├── inference.ts            # Client-side multi-provider LLM executor & latency tester
│       │   ├── prompt-registry.ts      # Central system prompt catalog & execution pipeline
│       │   ├── sound-system.ts         # Synthesized Web Audio API sound cues
│       │   └── markdown-renderer.ts    # Lightweight markdown-to-HTML parser for modal readers
│       ├── data/
│       │   ├── curriculum.ts           # 19 weeks, 133 daily schedules, 7 daily tasks each
│       │   ├── projects.ts             # Specifications and evaluation rubrics for Projects 1–12
│       │   ├── appendices.ts           # Unabridged text and protocols for Appendices A–O
│       │   ├── core-readings.ts        # Core theoretical readings and textbook excerpts
│       │   ├── drills.ts               # Structured micro-drills for deliberate practice
│       │   └── blog/
│       │       └── posts.ts            # Long-form editorial essays with rich markdown content
│       └── components/
│           ├── home/                   # Landing page components (OgilvyHero, Theses, Linter demo)
│           ├── shell/                  # Studio shell components (TodayLoop, DailyPractice, Modals)
│           ├── modalities/             # M0 through M7 interactive practice laboratories
│           ├── assessment/             # CompetencyRadar16 and TwoAxisQuadrant visualizers
│           ├── course/                 # CourseSyllabusView, ProjectBriefModal, ProjectWorkspace
│           ├── settings/               # ByokSettingsTab and provider configuration controls
│           ├── llm/                    # Standardized LLM primitives (LlmTriggerButton, LlmCritiqueCard)
│           ├── blog/                   # BlogHeader, BlogCard, BlogStudioCallout
│           └── seo/                    # SeoHead with JSON-LD structured data
├── static/
│   ├── favicon.svg                     # Browser favicon
│   └── robots.txt                      # Crawler directive referencing canonical sitemap
├── Directing the Machine.md            # Master course textbook & curriculum reference
├── Instructions.md                     # Studio UI/UX paradigm and anti-overbuilding spec
├── Project 7–12.md                     # Master capstone dossiers for Months 4–9
├── SEO_STRATEGY.md                     # Comprehensive search engine & discovery strategy
├── TASKS.md                            # Sequential engineering task and commit log
├── AGENT.md                            # AI Agent Operating Manual & Documentation Sync Protocol
├── README.md                           # Repository overview, quickstart & hosting guide
├── package.json                        # Scripts and dependencies
├── tsconfig.json                       # TypeScript compiler configuration extending SvelteKit
├── vercel.json                         # Vercel hosting rules, OWASP headers & static caching
└── vite.config.ts                      # Bundler config with @tailwindcss/vite & SvelteKit
```

---

## 4. State Management & Data Flow

### The Reactive Practice Engine (`src/lib/state/practice.svelte.ts`)
The `PracticeEngine` class acts as the singleton state store for the entire application. It is instantiated and exported as `practiceStore`:

```typescript
export class PracticeEngine {
    // Temporal coordinates in curriculum
    activeWeek = $state<number>(0);
    activeDay = $state<number>(1);
    activePart = $state<number>(0);
    currentStepIndex = $state<number>(0);

    // Progression state
    completedTaskIds = $state<string[]>([]);
    intensityPath = $state<IntensityPath>('full_time');
    baselineCompetencies = $state<BaselineCompetency[]>([]);

    // Deliberate Practice Collections
    problems = $state<ProblemEntry[]>([]);
    practiceSessions = $state<PracticeSession[]>([]);
    decisions = $state<DecisionEntry[]>([]);
    calibrations = $state<CalibrationEntry[]>([]);
    briefs = $state<Brief[]>([]);
    projects = $state<Record<string, ProjectProgress>>({});

    // Client-Side BYOK Settings
    byokSettings = $state<ByokSettings>(DEFAULT_BYOK_SETTINGS);
}
```

### Derived Calculations (`$derived`)
- **`scaffolding`**:
  Dynamically controls the progressive removal of user interface support structures based on `activePart`:
  ```typescript
  scaffolding = $derived({
      ladder: this.activePart < 2,      // Ladder hidden in Part II (Wks 3–4)+
      template: this.activePart < 3,    // Brief templates hidden in Part III (Wks 5–6)+
      exercise: this.activePart < 4,    // Pre-written exercise removed in Part IV+
      category: this.activePart < 5,    // Broad category removed in Part V+
      situation: this.activePart < 6    // Situations removed in Part VI (Wks 11–12)+
  });
  ```
- **`masteryLayer`**: Computes current layer:
  - `Layer 1: Capability` (Weeks 0–6)
  - `Layer 2: Independence` (Weeks 7–12)
  - `Layer 3: Agency` (Months 4–9)
- **`brierScore`**: Computes real-time mathematical forecasting error across all entries in `calibrations`.
- **`activeDayPlan`** & **`activeWeekData`**: Resolves the full daily plan and weekly syllabus from `src/lib/data/curriculum.ts`.

### Local-First Persistence Lifecycle
1. **Hydration**: On client mount (`isBrowser === true`), the constructor checks for `localStorage.getItem('dtm_practice_store_v1')`. If present, it deserializes the JSON state and repopulates the reactive properties.
2. **Auto-Saving**: A debounced `$effect.root` listener serializes the reactive state back to `localStorage` on every mutation.
3. **Backup & Restore**: Users can export the complete state JSON file or restore from a previous JSON backup via `LearnerPreferencesModal.svelte`.

---

## 5. Domain Engines & Subsystems

### 1. Mathematical Calibration & Brier Engine (`src/lib/engine/calibration-math.ts`)
Calculates practitioner forecast accuracy:
$$\text{Brier} = \frac{1}{N} \sum_{t=1}^{N} (f_t - o_t)^2$$
- $f_t$: Forecasted subjective probability ($0.00 \dots 1.00$).
- $o_t$: Actual outcome ($1$ for success, $0$ for failure).
- **Taste-Narrowness Detection**: Flags practitioners whose average confidence clusters in a safe band ($\ge 70\%$) with low variance, indicating risk aversion and lack of exploratory range.

### 2. Zero-Adjective Observation Linter (`src/lib/engine/adjective-linter.ts`)
Scans textual inputs in Studio Modalities (especially `M2DiagnosticVision.svelte`) against an extensible regex of evaluative shortcuts (*amazing, beautiful, bad, awful, clean, slick, clunky, nice, perfect, terrible, good, boring, polished, strong, weak*). Returns character offsets to visually highlight violations, requiring users to use descriptive structural vocabulary.

### 3. Client-Side BYOK Inference Engine (`src/lib/engine/inference.ts`)
Provides unified access to LLMs without a backend:
- **Supported Providers**:
  1. `openrouter`: `https://openrouter.ai/api/v1` (with `HTTP-Referer` and `X-Title` headers).
  2. `openai`: `https://api.openai.com/v1` with Bearer auth.
  3. `google`: `https://generativelanguage.googleapis.com/v1beta` with `?key=` query authentication.
  4. `anthropic`: `https://api.anthropic.com/v1` with `x-api-key`, `anthropic-version: 2023-06-01`, and `dangerously-allow-browser: true`.
  5. `custom`: Custom base URL (e.g. `http://localhost:11434/v1` for local Ollama) using OpenAI-compatible payload format.
- **Dynamic Model Enumeration**: `fetchAvailableModels(provider, config)` queries provider `/models` endpoints to fetch live model lists and populate the UI dropdown.
- **Connection & Latency Tester**: `testInferenceConnection(provider, config)` sends a 1-token ping to verify keys and measure round-trip ping time in milliseconds.

### 4. Prompt Registry & Diagnostic Interlocutor Engine (`src/lib/engine/prompt-registry.ts`)
Houses the central catalog of calibrated system personas, prompt formatters, and output parsers across all studio touchpoints:
- **Strict Anti-Slop Directive**: Enforces zero-adjective discipline, bans empty affirmation ("Great job!"), prevents the model from generating student work, and isolates the single highest unresolved structural defect.
- **Surgical Diff Protocol & Large-Context Architecture**: Solves the long-text/essay scalability problem without arbitrary token cutoffs. System prompts instruct the LLM never to echo or rewrite clean paragraphs; instead, the model outputs targeted `[PATCHES]` pairs (`ORIGINAL` / `REPLACEMENT`). `applySurgicalPatches` applies in-place sentence replacements client-side, leaving 95%+ of long essays, formatting, and authorial voice intact.
- **Universal Reasoning Isolation (`sanitizeInferenceResponse`)**: Automatically strips `<think>...</think>` and `<thought>...</thought>` tags from reasoning models (e.g. Nemotron, DeepSeek R1, o1) across OpenRouter, OpenAI, Google Gemini, and Anthropic. Clean output is rendered in the critique card while internal monologue is isolated in an accessible collapsible drawer.
- **Dynamic Free-Model Discovery**: Automatically identifies and badges zero-cost OpenRouter models (`:free`) in Settings with a 1-click filter toggle. Default completion token ceiling is set to `8192` tokens to ensure reasoning models never run out of generation budget.
- **Diagnostic Ladder Auditor**: Validates practitioner diagnoses against the canonical 7-level Top-Down Diagnostic Ladder and emits machine-readable `[LADDER_VERDICT]` blocks to flag premature polish and propose promotions to higher intent/structural levels.
- **Unified Pipeline (`executePrompt`)**: Accepts a typed `PromptTemplateId`, user context payload, and optional overrides, and executes inference via `runInference`, packaging results into a structured `CritiqueResult` with latency, model metadata, token usage, thoughts, and parsed patches.
- **Typed Prompt Primitives**: `src/lib/components/llm/LlmTriggerButton.svelte` (accessible trigger with BYOK check and loading spinner) and `src/lib/components/llm/LlmCritiqueCard.svelte` (standardized critique card with markdown rendering, metadata bar, copy, truncation alert, reasoning drawer, and action hooks).

### 5. Synthesized Web Audio Sound System (`src/lib/engine/sound-system.ts`)
Uses the browser's native `AudioContext` to synthesize tactile audio cues (drill completion bells, 10-minute timer alerts, button confirmations) using pure sine/triangle oscillators—eliminating heavy external sound assets.

### 6. Appendix L Archive Exporter (`src/lib/engine/archive-exporter.ts`)
Packages the practitioner's local-first records into a structured GitHub-Flavored Markdown dossier and raw JSON archive matching Appendix L specifications for one-click downloading.

---

## 6. Route Architecture & Edge Optimization

| Route | Pre-rendered | Purpose | Key Components |
| :--- | :--- | :--- | :--- |
| `/` | `true` | Flagship Ogilvy editorial landing page, 5 theses, syllabus preview, interactive sensibility diagnostic. | `OgilvyHero`, `ThesesSection`, `CurriculumProjectsExplorer`, `SensibilityDiagnostic`, `LabsShowcase` |
| `/app` | `true` | The deliberate practice studio workspace. Dynamic tabs (`today`, `manual`, `radar`, `m0`–`m7`, `settings`). | `TodayLoopHeader`, `DailyPracticeView`, `FieldManualView`, `M0`–`M7` Modalities, `ByokSettingsTab` |
| `/logs` | `true` | Unified deliberate practice logbook with 10-minute timer, tabbed history, and Appendix L exporter. | `TenMinuteLogTimer`, `archive-exporter` |
| `/blog` | `true` | High-craft editorial essay index with topical pillar filters and search. | `BlogCard`, `posts.ts` |
| `/blog/[slug]` | `true` | Long-form essay reader with reading progress bar, sticky TOC, author colophon, and JSON-LD schema. | `BlogHeader`, `BlogStudioCallout`, `SeoHead` |
| `/sitemap.xml` | `true` | Edge endpoint generating canonical XML sitemap for search crawlers. | `site.ts`, `posts.ts` |
| `/blog/rss.xml` | `true` | Edge endpoint generating valid RSS 2.0 feed with full essay content. | `site.ts`, `posts.ts` |

---

## 7. Extension Workflows for Developers & Agents

### Adding a New Studio Modality
1. Create `src/lib/components/modalities/M8NewStudio.svelte`.
2. Bind internal form states to `practiceStore` methods or collections.
3. Import the component into `src/routes/app/+page.svelte` and register its tab key in the studio tab switcher.
4. Add the modality link into `src/lib/components/home/LabsShowcase.svelte` and `src/lib/components/shell/LabDirectory.svelte`.
5. Update `docs/ARCHITECTURE.md` and `docs/DESIGN_SYSTEM.md`.

### Adding a New Course Appendix
1. Add the raw markdown and protocol metadata into `src/lib/data/appendices.ts` under the next key (e.g., `app-p`).
2. Add reference links into `ReferenceDrawer.svelte` and `FieldManualView.svelte`.
3. Update `docs/ARCHITECTURE.md`.

### Adding a New Blog Post
1. Append a new typed `BlogPost` object to `src/lib/data/blog/posts.ts` with `slug`, `title`, `metaDescription`, `readingTime`, `publishedDate`, `pillar`, and `content`.
2. The static prerender crawler will automatically discover the new route at `/blog/<slug>`, include it in `/sitemap.xml`, and add it to `/blog/rss.xml`.
3. Update `docs/ARCHITECTURE.md` and `README.md`.

---

## 8. Verification & Build Commands

```bash
# SvelteKit Typecheck (must yield 0 errors and 0 warnings)
pnpm run check

# Production Static Prerender Build
pnpm run build

# Preview Local Production Build
pnpm run preview
```
