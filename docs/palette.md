# Batman Palette — Utopia Tokyo Reskin

**Scope:** Batman theme only. The project also ships an `ancient-india` branch;
this document intentionally ignores it. Tokens live in `app/globals.css` as HSL
CSS variables and are mirrored as Tailwind color aliases under `theme-*` via
`tailwind.config.ts`. Components must consume the `theme-*` utilities, never
raw hex. Three.js materials are the single exception and must read hex via
`useTheme()`.

## Core tokens (existing — do not regress)

| Token          | Role                       | HSL                 | Hex        |
|----------------|----------------------------|---------------------|------------|
| `--bg`         | Page background (near-black) | `225 18% 10%`       | `#14171f`  |
| `--surface`    | Card / panel surface        | `224 14% 14%`       | `#1c1f28`  |
| `--paper`      | Cream "breaker" section     | `49 30% 86%`        | `#ebe5ce`  |
| `--accent`     | Utopia red (signal)         | `0 100% 55%`        | `#ff1919`  |
| `--accent-soft`| Accent hover / softened     | `0 100% 65%`        | `#ff3333`  |
| `--ink`        | Primary text on dark        | `49 30% 92%`        | `#f2ecd9`  |
| `--ink-muted`  | Secondary text              | `0 0% 60%`          | `#999999`  |
| `--line`       | Hairline / border           | `0 0% 14%`          | `#242424`  |

> Note: CLAUDE.md records `#b00020` as the legacy "dark red". The live tokens
> have since shifted to Utopia's `#ff1919` to match the reskin brief. Both are
> in the same hue family; this doc reflects what is actually in `globals.css`.

## Extended tokens (added for this build)

Added to `[data-theme='batman']` block only — does **not** touch
`ancient-india` to avoid cross-theme regression.

| Token                | Role                                                   | HSL                 | Approx hex |
|----------------------|--------------------------------------------------------|---------------------|------------|
| `--surface-raised`   | Elevated card on surface (modals, pinned heads)         | `224 14% 18%`       | `#252832`  |
| `--accent-dim`       | Desaturated accent for idle chrome                     | `0 55% 38%`         | `#962c2c`  |
| `--ink-subtle`       | Third-level text (captions, timestamps)                | `0 0% 45%`          | `#737373`  |
| `--hairline`         | 1px rule @ 12% ink alpha — pre-baked                   | `0 0% 100% / 0.12`  | rgba white 12% |

Tailwind aliases added:

```
theme-surface-raised
theme-accent-dim
theme-ink-subtle
theme-hairline
```

## Usage guidance

- **Backgrounds**: default `bg-theme-bg`. Raised surfaces and pinned panels
  use `bg-theme-surface-raised`. Never stack more than two elevation steps.
- **Accent**: reserve `text-theme-accent` / `bg-theme-accent` for signal
  (links, active state, terminal cursor, version tag highlight). Use
  `text-theme-accent-dim` for idle frames / corner reticles / decorative rules
  so the true accent keeps its punch.
- **Text hierarchy**:
  - Headline / hero: `text-theme-ink` (or `text-theme-paper` on oversize
    stencil)
  - Body: `text-theme-ink/80`
  - Meta / coords / version: `text-theme-ink-subtle` or raw `u-mono` style
- **Rules**: prefer `border-theme-hairline` for the Utopia-style 1px dividers
  that read against near-black. Use `border-theme-accent/40` for active
  separators (marquee bands, stat frames).
- **Glow**: `shadow-glow` / `shadow-glow-lg` are token-driven via `--accent`;
  safe in either theme but designed for Batman contrast.

## Three.js caveat

`components/three/*` imports hex via `useTheme()` because GLSL materials can't
read CSS vars. When tokens move, update those files manually — keep them in
lockstep with this table.
