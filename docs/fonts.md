# Fonts — Batman Reskin

Fonts are loaded exclusively through `next/font/google` in `app/layout.tsx`.
Each family is exposed as a CSS variable on `<html>` and consumed via Tailwind
`font-*` aliases or `var(--font-*)` inside `globals.css`.

## Loaded today (pre-existing)

| Family                           | CSS var               | Tailwind alias   | Role                                  |
|----------------------------------|-----------------------|------------------|---------------------------------------|
| Inter                            | `--font-body`         | `font-body`      | Paragraphs, UI, buttons               |
| Bebas Neue                       | `--font-display`      | `font-display`   | Hero caps, section titles             |
| Caveat                           | `--font-chaotic`      | `font-chaotic`   | (Ancient-India accent, kept for parity) |
| Space Mono                       | `--font-mono`         | `font-mono`      | Eyebrows, coords, HUD chips           |
| Big Shoulders Stencil Display    | `--font-stencil`      | n/a (use var)    | Oversize stencil headlines            |
| Crimson Pro                      | `--font-serif`        | n/a (use var)    | Serif accents                         |
| Noto Serif Devanagari            | `--font-devanagari`   | n/a (use var)    | Hindi / Sanskrit copy                 |

## Added for this build

| Family         | CSS var               | Tailwind alias   | Role                                           |
|----------------|-----------------------|------------------|------------------------------------------------|
| Crimson Text   | `--font-lore`         | `font-lore`      | Lore paragraphs (Gotham corruption stanza)     |
| JetBrains Mono | `--font-code`         | `font-code`      | Terminal line, coords block, version tag       |

Both are wired in `app/layout.tsx` via `next/font/google` with `display: 'swap'`
and appropriate subsets, and attached to `<html>`'s `className`.

Crimson Text sits alongside the pre-existing Crimson Pro. The distinction is
deliberate: Crimson Pro is the variable-font serif used by the
ancient-india branch; Crimson Text is the optical-sized static serif that
better matches Utopia Tokyo's lore-paragraph weight in the Batman reskin.

JetBrains Mono is used in addition to Space Mono. Space Mono is kept for the
shorter HUD chips (10–11px, wide tracking) where its tall x-height reads
better; JetBrains Mono handles longer technical runs (terminal strings,
`v2.0.0-RC.1` style version tags, coordinate rows) where its more neutral
letterforms improve legibility at small sizes.

## Usage guidance

- **Hero caps** (`ORDER MEETS CHAOS`): `font-display` (Bebas Neue) via
  `.u-h1`.
- **Lore paragraph**: `font-lore`, 16–18px, 1.55 line-height,
  `text-theme-ink/80`. Avoid italics — Crimson Text's roman is the house style.
- **Terminal line** (`>_EXECUTE_PROTOCOL`): `font-code`, 12px,
  `tracking-[0.24em]`, uppercase, `text-theme-accent`.
- **Coords block** (`40.7306°N / 74.0000°W / GOTHAM`): `font-code`, 10–11px,
  `tracking-[0.28em]`, `text-theme-ink-subtle`, tabular-nums
  (`font-variant-numeric: tabular-nums`).
- **Version tag** (`BATCOMPUTER v2.0.0-RC.1`): `font-code`, 11px,
  `tracking-[0.24em]`, uppercase. Inside the marquee row, alternate
  `text-theme-ink` and `text-theme-accent` items for rhythm.

## Do not

- Do not add `font-display: block`. Every Google Font here uses `swap`.
- Do not inline a `<link>` to fonts.googleapis.com — `next/font` self-hosts.
- Do not introduce a new mono family without removing Space Mono or
  JetBrains Mono first — four sans/mono families is the ceiling.
