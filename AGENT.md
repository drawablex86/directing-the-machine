# AGENT.md: Operational Directives & Agent Instructions

> **Directing the Machine** is an interactive deliberate practice studio and curriculum for creative authorship, diagnostic vision, and calibrated direction in an AI-augmented world.
>
> **Conceived, written, engineered, and maintained by [Rahul Rajeev](https://github.com/drawablex86).**

---

## 1. Primary Operating Philosophy

As an autonomous AI agent working in this repository, you must adhere to the core pedagogical and technical philosophy of the project:

1. **Anti-Overbuilding**:
   The studio’s job is *not* to create endless logging bureaucracy or passive reading. Every feature must encourage *making, diagnosing, and calibrating*, not productivity theatre. Enforce the 10-minute logging limits, the Single-Task Horizon, and progressive scaffolding removal.
2. **Zero-Adjective Discipline**:
   Avoid vague, subjective adjectives in code, documentation, and user prompts (*"amazing"*, *"clean"*, *"slick"*, *"nice"*, *"great"*). Use concrete, structural, and descriptive language.
3. **Local-First & Zero-Telemetry**:
   All user progress, notes, problem entries, briefs, and BYOK credentials must remain 100% private in client-side `localStorage`. Never introduce external databases, tracking telemetry, or remote backends.

---

## 2. Strict Tech Stack & Code Conventions

### SvelteKit 2 + Svelte 5 (Runes Only)
- **Always use Svelte 5 Runes**:
  - `$state` and `$state.raw` for reactive state.
  - `$derived` and `$derived.by` for computed values.
  - `$effect` and `$effect.root` for side-effects and debounced persistence.
  - `$props` for component properties.
  - Snippets (`{#snippet ...}`) for slotted content.
- **FORBIDDEN (Deprecated Svelte 3/4 Syntax)**:
  - ❌ NEVER import or use `writable`, `readable`, `derived`, or `get()` from `'svelte/store'`.
  - ❌ NEVER use `export let propName` (use `$props()`).
  - ❌ NEVER use `<slot />` (use Svelte 5 snippets).
  - ❌ NEVER use reactive assignments with `$: ...` (use `$derived` or `$effect`).

### Tailwind CSS v4 (Pure CSS Engine)
- Tailwind v4 uses `@import "tailwindcss";` and `@theme` blocks inside `src/app.css`.
- ❌ **DO NOT create or expect a `tailwind.config.js`** file.
- Always use semantic theme classes (`bg-neutral-950`, `bg-neutral-900`, `bg-neutral-850`, `border-neutral-800`, `text-neutral-100`, `text-amber-500`) which dynamically adapt to Stone and Paper themes.
- ❌ **DO NOT hardcode hex values** into Tailwind utility classes (e.g. avoid `bg-[#18181b]`).

### TypeScript Strictness
- Every code change must cleanly pass the typechecker without any errors or warnings:
  ```bash
  pnpm run check
  ```

### Client-Side BYOK Inference Protocol
- When building or modifying LLM inference features in `src/lib/engine/inference.ts`:
  - Execute API requests directly from the browser using `fetch()`.
  - For Anthropic API calls from the browser, include the required header:
    ```typescript
    'anthropic-dangerous-direct-browser-access': 'true'
    ```
  - For OpenRouter calls, include:
    ```typescript
    'HTTP-Referer': 'https://directing-the-machine.vercel.app',
    'X-Title': 'Directing the Machine'
    ```
  - Never log or transmit user API keys to external loggers or error monitors.

---

## 3. Mandatory Documentation & Architecture References

Before undertaking any significant refactor or feature implementation, you MUST review the following specifications:

- **[Technical Architecture Blueprint](file:///Users/rahulrajeev/Downloads/directing-the-machine/docs/ARCHITECTURE.md)**:
  Complete breakdown of state management (`PracticeEngine`), domain engines (Brier math, adjective linter, audio synthesis), data structures, and edge prerendering.
- **[Kepano Stone & Paper Design System](file:///Users/rahulrajeev/Downloads/directing-the-machine/docs/DESIGN_SYSTEM.md)**:
  Complete token dictionary, WCAG AAA contrast rules, typography scales, touch target minimums, and UI component primitives.
- **[Course UI/UX Specification](file:///Users/rahulrajeev/Downloads/directing-the-machine/Instructions.md)**:
  Comprehensive pedagogical rules, studio modality mechanics, and anti-theatre guardrails.
- **[SEO Strategy & Discovery](file:///Users/rahulrajeev/Downloads/directing-the-machine/SEO_STRATEGY.md)**:
  Topical pillars, keyword matrices, and search discovery infrastructure.

---

## 4. 🚨 MANDATORY PROTOCOL: Updating Documentation on Every Change

Whenever you add a feature, refactor code, modify routes, or adjust UI styling, you **MUST** update the repository's living documentation before concluding your work:

### The Pre-Completion Documentation Checklist
1. **Did you add or modify state, components, routes, or domain engines?**
   $\rightarrow$ Update [`docs/ARCHITECTURE.md`](file:///Users/rahulrajeev/Downloads/directing-the-machine/docs/ARCHITECTURE.md):
   - Add new files to the Directory Taxonomy.
   - Document any new state properties in `PracticeEngine`.
   - Update the System Topology diagram if data flows changed.
2. **Did you add or modify UI components, colors, typography, or styling?**
   $\rightarrow$ Update [`docs/DESIGN_SYSTEM.md`](file:///Users/rahulrajeev/Downloads/directing-the-machine/docs/DESIGN_SYSTEM.md):
   - Document any new tokens or utility classes.
   - Ensure Paper Mode (light mode) contrast was verified for AAA compliance.
   - Document new component patterns or interactions.
3. **Did you introduce user-facing features, routes, or commands?**
   $\rightarrow$ Update [`README.md`](file:///Users/rahulrajeev/Downloads/directing-the-machine/README.md):
   - Update the feature showcase or quickstart instructions.
4. **Did you finish an assigned engineering task?**
   $\rightarrow$ Update [`TASKS.md`](file:///Users/rahulrajeev/Downloads/directing-the-machine/TASKS.md):
   - Add a new numbered task item with bullet points detailing the changes, verification steps, and commit hash.

---

## 5. Standard Verification Commands

Before declaring any task complete or committing code:

```bash
# 1. Typecheck the entire SvelteKit workspace
pnpm run check

# 2. Build the production bundle and verify static pre-rendering
pnpm run build

# 3. Optional: Preview the production build locally
pnpm run preview
```
All commands must exit with code `0`.
