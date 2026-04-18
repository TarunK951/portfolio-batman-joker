# Batman Palette — Utopia Tokyo Reskin

**Scope:** Batman theme only. The project also ships an `ancient-india` branch;
this document intentionally ignores it. Tokens live in `app/globals.css` as HSL
CSS variables and are mirrored as Tailwind color aliases under `theme-*` via
`tailwind.config.ts`. Components must consume the `theme-*` utilities, never
raw hex. Three.js materials are the single exception and must read hex via
`useTheme()`.

## Core tokens (current — deep near-black + bright crimson)

| Token              | Role                                  | HSL                  | Hex        |
|--------------------|---------------------------------------|----------------------|------------|
| `--bg`             | Page background (deep near-black)     | `0 0% 4%`            | `#0A0A0A`  |
| `--surface`        | Layered secondary dark                | `0 0% 7%`            | `#111111`  |
| `--surface-raised` | Elevated card / pinned panel          | `0 0% 9%`            | `#161616`  |
| `--accent`         | Bright red (CTAs, warnings, glitch)   | `354 70% 50%`        | `#D72638`  |
| `--accent-soft`    | Accent hover / lifted                 | `354 70% 60%`        | `#E85464`  |
| `--accent-dim`     | Desaturated idle accent               | `354 71% 32%`        | `#8A1824`  |
| `--ink`            | Off-white cream text                  | `45 22% 90%`         | `#EDEAE0`  |
| `--ink-muted`      | Second-tier text                      | `49 5% 52%`          | `#8A8880`  |
| `--ink-subtle`     | Captions / timestamps                 | `49 5% 52%`          | `#8A8880`  |
| `--line`           | Hairline / border neutral             | `0 0% 9%`            | `#161616`  |
| `--hairline`       | 1px rule @ cream 8% alpha             | `45 22% 90% / 0.08`  | `rgba(237,234,224,0.08)` |
| `--paper`          | Cream "breaker" section (= ink)        | `45 22% 90%`         | `#EDEAE0`  |

> The prior Utopia saturated-red (`#ff1919`) on blue-black (`#14171f`) has been
> retired in favour of the tonal reference shown above — matches the true
> feel of utopiatokyo.com (near-pure black, single warm red, cream ink).

## Tailwind aliases

```
bg-theme-bg                    // #0A0A0A
bg-theme-surface               // #111111
bg-theme-surface-raised        // #161616
text-theme-ink                 // #EDEAE0
text-theme-ink-subtle          // #8A8880
text-theme-accent              // #D72638
text-theme-accent-dim          // #8A1824
border-theme-hairline          // rgba(237,234,224,0.08)
border-theme-line              // #161616
```

## Usage guidance

- **Backgrounds**: default `bg-theme-bg`. Raised surfaces use
  `bg-theme-surface` or `bg-theme-surface-raised`. Never stack more than two
  elevation steps.
- **Accent**: reserve `text-theme-accent` / `bg-theme-accent` for signal
  (links, active state, terminal cursor, version tag highlight, CTA). Use
  `text-theme-accent-dim` for idle frames / corner reticles / decorative rules
  so the true accent keeps its punch.
- **Text hierarchy**:
  - Headline / hero: `text-theme-ink`
  - Body / lore: `text-theme-ink/80` or `/75` under Crimson Text
  - Meta / coords / version / timestamp: `text-theme-ink-subtle`
- **Rules**: prefer `border-theme-hairline` for the Utopia-style 1px dividers
  (cream at 8% reads clean on near-black). Use `border-theme-accent/40` for
  active separators (marquee bands, stat frames).
- **Glow**: `shadow-glow` / `shadow-glow-lg` are token-driven via `--accent`;
  tuned for the new `#D72638` warm red.

## Three.js caveat

`components/three/*` imports hex via `useTheme()` because GLSL materials can't
read CSS vars. Updated files:

- `components/three/LogoMark.tsx` — `accent: '#D72638'`, `glow: '#F04757'`,
  `base: '#0A0A0A'`.
- `components/shared/DepthText.tsx` — `batman: { color: '#EDEAE0', shadow: '#D72638' }`.

Keep these in lockstep with the HSL vars above on every palette move.
