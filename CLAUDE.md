# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Satya Tarun K — Batman × Joker Portfolio.** A dual-theme personal portfolio for Satya Tarun K (`satyatarun`, satyatarun.951@gmail.com). Batman = order (dark red on near-black); Joker = chaos (toxic green on near-black). The theme duality is the product, not decoration — every section should read intentionally under both palettes, and the toggle transition is part of the experience.

- Deploy target: Vercel (auto-detected Next.js, no `vercel.json` needed)
- Package manager: **npm** — do not add `pnpm-lock.yaml` or `yarn.lock`

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (also type-checks)
npm run start        # serve built app
npm run lint         # eslint (next/core-web-vitals)
npm run typecheck    # tsc --noEmit — run before pushing
```

No test runner is configured yet. If adding one, prefer **Vitest + React Testing Library** (co-locate `Foo.test.tsx` next to source). Avoid Jest — R3F testing utilities and Next 14 play more cleanly with Vite-style tooling.

## Architecture

### Theme system is the spine, not a skin

`ThemeProvider` (`components/theme/ThemeProvider.tsx`) owns `theme: 'batman' | 'joker'`, persists to `localStorage` under `portfolio-theme`, and mirrors the value onto `<html data-theme="...">`. A tiny inline script in `app/layout.tsx` (`themeInitScript`) runs **before paint** to avoid a Batman→Joker flash on reload; if you refactor the layout, preserve that script or replace it with an equivalent pre-hydration mechanism.

Palette flows through CSS custom properties in `app/globals.css` (`--bg`, `--surface`, `--accent`, `--ink`) exposed to Tailwind as the `theme-*` color aliases (`bg-theme-bg`, `text-theme-ink`, `border-theme-accent`, `shadow-glow`). **Never hardcode `#b00020` or `#39ff14` in components** — use the `theme-*` utilities. The one exception: Three.js materials, which can't read CSS vars and must `useTheme()` to select a hex color imperatively (see `components/three/Scene.tsx`).

### Client-boundary discipline

Keep `'use client'` at the leaves. Only these need it:
1. Anything touching `window` / `localStorage` / `document` (theme code, `registerGsap`).
2. React Three Fiber trees — **always** imported via `next/dynamic` with `ssr: false` (see `Hero.tsx` importing `Scene`). SSR'ing a WebGL canvas will crash the build.
3. Framer Motion components animating on mount.

Pages (`app/**/page.tsx`) and new section wrappers should stay server components where possible.

### GSAP + ScrollTrigger

Register via `registerGsap()` from `lib/gsap.ts` — it guards against double-registration and SSR. Always wrap animations in `gsap.context(..., scopeNode)` inside `useEffect` and return `ctx.revert()` for cleanup; `revert()` also kills ScrollTriggers scoped to that context, so don't manually `kill()` them. Capture the ref into a local variable before the cleanup returns (see `Hero.tsx`) — React 19-style ref-cleanup semantics make stale refs in teardown a real footgun.

### Three.js / R3F conventions

- `components/three/` is the only place R3F lives. `Scene.tsx` owns the `<Canvas>`; meshes are separate components that call `useFrame`.
- Colors come from `useTheme()` and are passed as hex strings to materials.
- Keep `dpr={[1, 2]}` on the Canvas; uncapped DPR destroys retina perf.
- Prefer `meshStandardMaterial` with `emissive` over post-processing until perf budget justifies `@react-three/postprocessing`.

### SEO is load-bearing

Identity keywords — **"Satya Tarun", "Satya Tarun K", "satyatarun"** — must survive in `metadata.keywords` (`app/layout.tsx`), the `<Person>` JSON-LD in `app/page.tsx`, `alternateName`, and the site description. The canonical site record lives in `lib/seo.ts` (`SITE`); new routes and metadata must import from there, never hardcode the URL, name, or email. `sitemap.ts` and `robots.ts` in `app/` are the crawler source of truth — add new public routes to `sitemap.ts` when you create them.

### Path alias

`@/*` resolves to the repo root (`tsconfig.json` paths). Use it for every cross-directory import (`@/components/...`, `@/lib/...`). Relative `../../` imports are discouraged and should be refactored on sight.

### Strict TS is strict

`tsconfig.json` enables `strict`, `noUncheckedIndexedAccess`, and `noImplicitOverride`. Array/record access returns `T | undefined` — narrow before use. Don't weaken these flags to pass a build; fix the types.

## Deployment

Vercel picks up Next.js automatically. Before production cutover, update `SITE.url` in `lib/seo.ts` from the placeholder `https://satyatarun.vercel.app` to the final domain — metadata, canonical URL, sitemap, robots, and JSON-LD all read from that single source.

## Taglines

- **Batman:** "In a world that breaks everyone — some choose to become the darkness that protects the light."
- **Joker:** "One bad day is all it takes. Make yours count."
- **Toggle prompt:** "Toggle the mask."
- **Hero headline:** "Order meets chaos."

## Visual Design System

### Color palette (hex equivalents for Three.js / Canvas contexts)

| Token   | Batman    | Joker     |
|---------|-----------|-----------|
| bg      | `#0a0a0a` | `#070a07` |
| surface | `#141414` | `#12180f` |
| accent  | `#b00020` | `#39ff14` |
| ink     | `#e8e8e8` | `#e8ffe8` |

The authoritative source is the HSL vars in `app/globals.css`. Hex values in `tailwind.config.ts` (under `batman.*` / `joker.*`) and `components/three/Scene.tsx` must stay in sync with the HSL vars. Use `theme-*` Tailwind utilities in components; only use hex directly in Three.js materials via `useTheme()`.

### Fonts (currently loaded)

- **Display:** Bebas Neue (`--font-display`) — headings, hero text, section titles
- **Body:** Inter (`--font-body`) — paragraphs, UI text
- Both loaded via `next/font/google` in `app/layout.tsx` with `display: 'swap'`

### Fonts (planned, not yet loaded)

- **Crimson Text** — Batman body serif alternative
- **Caveat** — Joker chaotic handwriting
- **Noto Serif JP** — Japanese accents for Batman theme
- **Noto Sans Devanagari** — Hindi accents for Joker theme
- **Orbitron** — Stats/numbers display font

Add via `next/font/google` with appropriate subsets when needed.

## Sections Roadmap

Target sections for the full portfolio (in scroll order):

1. **Loading Screen** — Cinematic pre-loader with bat/joker motif `[TO BUILD]`
2. **Split Landing** — Dual Batman/Joker panel, "choose your side" `[TO BUILD]`
3. **Hero** — `components/sections/Hero.tsx` — GSAP + Framer Motion animated headline with 3D Scene backdrop `[EXISTS]`
4. **DC Grid** — Character cards for heroes/villains (data from `data/dcHeroes.ts`, `data/dcVillains.ts`) `[TO BUILD]`
5. **Projects** — Portfolio showcase (data from `data/projects.ts`) `[TO BUILD]`
6. **About** — Personal bio, skills, timeline `[TO BUILD]`
7. **Contact** — Form or mailto links `[TO BUILD]`
8. **Footer** — Site credits, social links, multilingual text `[TO BUILD]`
9. **404** — Custom `app/not-found.tsx` with theme awareness `[TO BUILD]`

## DC API (Akabab Superhero API — free, no key)

Base URL: `https://akabab.github.io/superhero-api/api/id/{id}.json`
Images: `character.images.lg` (400px CDN-hosted)

| Hero IDs | | Villain IDs | |
|---|---|---|---|
| batman | 69 | joker | 370 |
| superman | 644 | harley | 301 |
| wonder-woman | 720 | bane | 65 |
| flash | 213 | riddler | 578 |
| green-lantern | 263 | scarecrow | 607 |
| aquaman | 40 | poison-ivy | 543 |
| cyborg | 148 | mr-freeze | 469 |
| nightwing | 496 | two-face | 680 |

### Architecture

- **API service:** `lib/dcApi.ts` — fetch functions, ID maps, TypeScript interfaces
- **Hooks:** `hooks/useCharacters.tsx` — `useHeroes()` and `useVillains()` merge API data (images, powerstats) with static data from `data/dcHeroes.ts` / `data/dcVillains.ts` (bios, skills, titles)
- **Static data is the source of truth** for custom bios, skill mappings, and titles. The API enriches with images and powerstats.
- API powerstats: INTELLIGENCE, STRENGTH, SPEED, DURABILITY, POWER, COMBAT (0–100 scale)

### Character Grid design direction

- Left sidebar: scrollable character thumbnails (`character.images.sm`)
- Click selects character, main panel updates
- Main panel: `character.images.lg` (large image) + stat bars
- Stat bars animate with GSAP using real API powerstats
- Font: Orbitron for numbers, Inter for labels
- Batman theme: red glow HUD aesthetic
- Joker theme: green glow glitch aesthetic
