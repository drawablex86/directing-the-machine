# Kepano Stone & Paper Design System Specification

> *A Curated, High-Legibility Visual Identity for Deliberate Practice and Creative Direction.*
>
> **Conceived, written, engineered, and maintained by [Rahul Rajeev](https://github.com/drawablex86).**

---

## 1. Design Philosophy: The Kepano Stone & Paper Ethos

The visual language of **Directing the Machine** is inspired by traditional archival printcraft and Steph Ango's (Kepano) **Obsidian Minimal** design philosophy. 

### Core Principles
1. **Zero-Adjective Aesthetics**:
   The user interface does not shout, distract, or perform aesthetic fireworks. It provides quiet, distraction-free legibility where the practitioner's thinking, making, and diagnostic vision take center stage.
2. **Archival Tactility**:
   Digital tools often feel sterile and ephemeral. Stone & Paper evokes physical slate, volcanic stone, warm unbleached paper, carbon ink, and heated amber illumination.
3. **Uncompromising Legibility (WCAG 2.1 & 2.2 AAA)**:
   Every contrast ratio—across both Dark (Stone) and Light (Paper) modes—is audited and engineered to surpass 7:1 contrast on reading surfaces and alerts.
4. **Cognitive Inclusivity**:
   First-class accommodation for ADHD (Single-Task Horizon), dyslexia (OpenDyslexic typography), and vestibular disorders (strict reduced motion).

---

## 2. Color Tokens & Theme System

The design system operates on two curated palettes defined as CSS custom properties in `src/app.css` and dynamically bound to Tailwind CSS v4 via `@theme`.

### A. Stone Mode (Dark Mode — Volcanic Slate & Amber)
Activated by default or via `.theme-dark` / `html.theme-dark`.

```css
:root,
html.theme-dark,
.theme-dark {
  color-scheme: dark;

  /* Surfaces */
  --bg-primary: #161615;      /* Deep volcanic slate */
  --bg-surface: #1e1d1b;      /* Warm charcoal panel background */
  --bg-card: #252422;         /* Elevated card surface */
  --bg-card-hover: #2d2b28;   /* Interactive card hover */
  --bg-card-muted: #1c1b1a;   /* Recessed container */

  /* Hairline Borders */
  --border-primary: #2e2c29;  /* Standard structural border */
  --border-highlight: #3d3a36;/* Elevated card border */
  --border-strong: #4f4b45;   /* Active border / divider */

  /* Typography */
  --text-primary: #edeae3;    /* Warm parchment ink (high contrast) */
  --text-secondary: #b5b0a2;  /* Secondary descriptive copy */
  --text-muted: #7d796e;      /* Metadata, timestamps, labels */
  --text-faint: #57544c;      /* Disabled or faint captions */

  /* Accents */
  --accent-gold: #f59e0b;     /* Primary amber/gold accent */
  --accent-hover: #fbbf24;    /* Amber hover highlight */
  --accent-focus: #fbbf24;    /* Focus ring color */
  --accent-subtle: rgba(245, 158, 11, 0.12); /* Subtle glow */
  --accent-border: rgba(245, 158, 11, 0.28); /* Accent hairline */

  /* Badges & Selection */
  --badge-bg: #252422;
  --badge-text: #edeae3;
  --selection-bg: rgba(245, 158, 11, 0.3);
  --selection-text: #edeae3;
}
```

### B. Paper Mode (Light Mode — Archival Parchment & Carbon Ink)
Activated via `.theme-light` / `html.theme-light`.

```css
html.theme-light,
.theme-light {
  color-scheme: light;

  /* Surfaces */
  --bg-primary: #fbf9f5;      /* Archival unbleached paper */
  --bg-surface: #f4f0e8;      /* Warm parchment panel background */
  --bg-card: #ece6dc;         /* Elevated card surface */
  --bg-card-hover: #e3dccd;   /* Interactive card hover */
  --bg-card-muted: #f7f4ee;   /* Recessed container */

  /* Hairline Borders */
  --border-primary: #ded7cb;  /* Standard paper boundary */
  --border-highlight: #cec4b2;/* Elevated card border */
  --border-strong: #b8ac98;   /* Darker divider border */

  /* Typography */
  --text-primary: #1f1e1c;    /* Deep carbon black ink */
  --text-secondary: #4a4742;  /* Secondary readable copy */
  --text-muted: #78746c;      /* Neutral metadata */
  --text-faint: #a19b90;      /* Faint decorative caption */

  /* Accents */
  --accent-gold: #b45309;     /* Warm dark bronze (WCAG AAA on paper) */
  --accent-hover: #92400e;    /* Deep roasted amber hover */
  --accent-focus: #b45309;    /* Focus ring color */
  --accent-subtle: rgba(180, 83, 9, 0.08);
  --accent-border: rgba(180, 83, 9, 0.25);

  /* Badges & Selection */
  --badge-bg: #ece6dc;
  --badge-text: #1f1e1c;
  --selection-bg: rgba(180, 83, 9, 0.18);
  --selection-text: #1f1e1c;
}
```

### C. Tailwind CSS v4 `@theme` Dynamic Mapping
In `src/app.css`, Tailwind v4 utility classes (`bg-neutral-950`, `text-neutral-100`, `border-neutral-800`, `text-amber-500`) are mapped dynamically to the active CSS variables:

```css
@theme {
  --color-neutral-950: var(--bg-primary);
  --color-neutral-900: var(--bg-surface);
  --color-neutral-850: var(--bg-card);
  --color-neutral-800: var(--border-primary);
  --color-neutral-700: var(--border-highlight);
  --color-neutral-600: var(--text-faint);
  --color-neutral-500: var(--text-muted);
  --color-neutral-400: var(--text-muted);
  --color-neutral-300: var(--text-secondary);
  --color-neutral-200: var(--text-secondary);
  --color-neutral-100: var(--text-primary);
  --color-amber-500: var(--accent-gold);
  --color-amber-400: var(--accent-hover);
  --font-serif: var(--font-app-serif);
}
```

---

## 3. WCAG AA/AAA Accessibility Normalization Rules

Standard Tailwind utilities (like `text-emerald-400` or `text-rose-400`) look vibrant on dark slate, but wash out into unreadable low-contrast pastel on light paper. 

To solve this, `src/app.css` includes an automated **Paper Mode Legibility Normalizer**:

```css
/* Deep Ink Normalization in Light Mode */
.theme-light .text-emerald-400 { color: #047857 !important; } /* Rich emerald header */
.theme-light .text-emerald-200, 
.theme-light .text-emerald-300 { color: #064e3b !important; } /* Deep forest green */

.theme-light .text-red-400,
.theme-light .text-rose-400    { color: #b91c1c !important; } /* Saturated red header */
.theme-light .text-red-200,
.theme-light .text-rose-200    { color: #7f1d1d !important; } /* Deep crimson text */

.theme-light .text-amber-400   { color: #92400e !important; } /* Saturated bronze */
.theme-light .text-amber-200,
.theme-light .text-amber-300   { color: #78350f !important; } /* Deep bronze text */

.theme-light .text-blue-400    { color: #1d4ed8 !important; } /* Saturated cobalt */
.theme-light .text-blue-200,
.theme-light .text-blue-300    { color: #1e3a8a !important; } /* Deep navy ink */
```

### Focus Indicators & Touch Boundaries
- **Focus Rings (WCAG 2.4.7 & 2.4.11)**:
  ```css
  :focus-visible {
    outline: 2px solid var(--accent-focus) !important;
    outline-offset: 2px !important;
  }
  ```
- **Minimum Touch Targets**:
  Interactive controls (`button`, `a`, `input`) enforce `min-height: 1.5rem` (24px) preventing touch target collapse.
- **Skip Link**:
  An accessible `.skip-to-content` element sits at the top of the DOM, hidden until tabbed into focus.

---

## 4. Typography System

### Typeface Stacks
```css
:root {
  --font-app-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  --font-app-dyslexic: 'OpenDyslexic', 'Lexend', sans-serif;
  --font-app-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-app-serif: 'Newsreader', 'Georgia', 'Charter', 'Palatino Linotype', 'Book Antiqua', serif;
}
```

### Font Mode Classes
- `.font-mode-sans`: Clean modern interface font for general studio operations.
- `.font-mode-dyslexic`: Uses local/web `OpenDyslexic` with weighted bottoms and `0.025em` tracking for dyslexia accommodation.
- `.font-mode-mono`: Monospaced typography for telemetry, Brier calculations, code, and logs.
- `.reader-font-serif`: High-craft editorial serif typeface for long-form curriculum reading and field essays.

### Font Sizing & Line Spacing Scales
Users can tune font size and line leading dynamically via `LearnerPreferencesModal.svelte`:
- **Sizes**: `.size-sm` (`0.925rem`), `.size-base` (`1rem`), `.size-lg` (`1.125rem`), `.size-xl` (`1.25rem`).
- **Leading**: `.spacing-normal` (`line-height: 1.55`), `.spacing-relaxed` (`line-height: 1.75`), `.spacing-loose` (`line-height: 2.1; word-spacing: 0.05em`).

---

## 5. UI Component Primitives & Patterns

### 1. Buttons
- **Primary Action (Gold Accent)**:
  ```html
  <button class="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-4 py-2 rounded-lg text-sm transition-colors">
    Action Label
  </button>
  ```
- **Secondary Action (Surface Card)**:
  ```html
  <button class="bg-neutral-900 hover:bg-neutral-850 text-neutral-200 border border-neutral-800 px-3 py-2 rounded-lg text-sm transition-colors">
    Secondary Label
  </button>
  ```
- **Ghost / Minimal Action**:
  ```html
  <button class="text-neutral-400 hover:text-neutral-100 hover:bg-neutral-850/50 px-2.5 py-1.5 rounded text-xs transition-colors">
    Ghost Label
  </button>
  ```

### 2. Badges & Status Dots
- **Pill Badge**:
  ```html
  <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono bg-neutral-850 text-neutral-300 border border-neutral-800">
    STATUS
  </span>
  ```
- **Active Status Dot (e.g. BYOK Connected)**:
  ```html
  <span class="relative flex h-2 w-2">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
  </span>
  ```

### 3. Studio Modality Cards
Every laboratory view (M0 through M7) uses a standard structural shell:
- Header containing the Modality ID (`M0`–`M7`), title, purpose description, and assigned Part/Layer tags.
- Main interactive canvas featuring zero-adjective inputs, timers, or visualizers.
- Persistent guardrail banner at the footer.

### 4. Guardrail Timers (Anti-Productivity Theatre)
- The **10-Minute Log Timer** displays an amber countdown (`MM:SS`).
- Upon reaching `00:00`, input areas are disabled, state is auto-saved, and a locking message renders:
  > *"The document is not the practice. Go make something."*

### 5. Modals & Overlays
- Backdrop: `bg-black/80 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center p-4`.
- Modal Window: `bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden`.
- Global hotkey listener automatically binds <kbd>Esc</kbd> to close any open modal.

---

## 6. Animation & Motion Guidelines

1. **Subtlety First**:
   All transitions must use subtle, quick timings: `transition-all duration-150 ease-out` or `transition-colors duration-200`.
2. **Strict Reduced Motion**:
   When `.reduce-motion` is active (or the user's OS specifies `prefers-reduced-motion`):
   ```css
   .reduce-motion * {
     animation-duration: 0.001ms !important;
     animation-iteration-count: 1 !important;
     transition-duration: 0.001ms !important;
     scroll-behavior: auto !important;
   }
   ```
   All keyframe animations, pulsing indicators, and smooth scrolling are immediately suppressed.

---

## 7. Design System Update Rules for Agents

Whenever creating or modifying UI components:
1. **Never hardcode hex values** into Tailwind classes (e.g. avoid `bg-[#1a1a1a]`). Always use semantic Tailwind variables mapped to tokens (`bg-neutral-900`, `border-neutral-800`, `text-amber-500`).
2. **Always test or verify both Stone (Dark) and Paper (Light) modes**. Ensure that light mode does not render white text on paper surfaces or dark grey on charcoal.
3. **If adding a new semantic alert color**, you must add corresponding `.theme-light` deep-ink contrast overrides in `src/app.css` to guarantee WCAG AAA contrast.
4. **Update this document (`docs/DESIGN_SYSTEM.md`)** whenever introducing new typography classes, component patterns, or design tokens.
