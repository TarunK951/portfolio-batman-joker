# Batman x Joker Portfolio — Progress Log

## Setup Complete
- [x] Next.js 14 App Router project initialized
- [x] Theme system (ThemeProvider, ThemeToggle, CSS vars, localStorage persistence)
- [x] Pre-paint theme init script (no FOUC)
- [x] Three.js canvas with BatSymbol wireframe (Scene.tsx + BatSymbol.tsx)
- [x] Hero section (GSAP + Framer Motion animated headline)
- [x] SEO (metadata, JSON-LD Person schema, sitemap, robots)
- [x] Tailwind theme-* color aliases with HSL CSS vars
- [x] CLAUDE.md architecture documentation
- [x] DC Heroes / Villains / Projects data
- [x] DC API service + hooks
- [x] @gsap/react and split-type installed

## Sections Built (initial)
- [x] Loading Screen, DC Grid, Projects, About, Contact, Footer, 404
- [x] All wired into app/page.tsx with dynamic imports

## Utopia Tokyo Redesign (this pass)
Strategy chosen: **Overlay Utopia Tokyo aesthetic onto existing dual-theme spine.**
Batman accent shifted from `#b00020` to Utopia red `#ff1919`. Background shifted to
Utopia black `#14171f`. Cream `#ebe5ce` exposed as `--paper` for breaker sections.
Joker palette retained but rotated to match new bg/ink rhythm.

### Tokens / foundation
- [x] `app/globals.css` — full token rewrite, Utopia type scale, cursor styles, paper section, button system, marquee keyframes
- [x] `tailwind.config.ts` — `utopia.*`, `theme.paper`, `theme.line`, fluid font sizes, `font-mono`, utopia easing
- [x] `app/layout.tsx` — added Space Mono (`--font-mono`) as Zpix stand-in; theme color updated to `#14171f`

### Shared components (new)
- [x] `components/shared/Cursor.tsx` — dot + 4 corner brackets, lerp follow, hover-grow, hidden on touch / reduced-motion
- [x] `components/shared/ScrambleText.tsx` — left-to-right glyph resolve on hover/inview/mount
- [x] `components/shared/UButton.tsx` — dark / red / cream variants with built-in scramble label
- [x] `components/shared/Marquee.tsx` — seamless infinite track

### Sections rebuilt
- [x] `components/sections/Hero.tsx` — Utopia 12-col layout, oversize fluid h1, mono nav, corner-marked 3D mark, meta row, marquee footer
- [x] `components/sections/About.tsx` — numbered eyebrow, 3-line stacked h2, hairline skill bars (1px), bordered timeline rows
- [x] `components/sections/Projects.tsx` — Utopia "row card" list with index numbers, h3 titles, hover bg shift
- [x] `components/sections/Contact.tsx` — cream paper breaker section, dark-on-cream inversion
- [x] `components/sections/Footer.tsx` — oversize wordmark, 4-col link grid, hairline rules, multilingual mono row
- [x] `components/sections/LoadingScreen.tsx` — counter 000→100, hairline progress bar, mono meta, vertical wipe-out
- [x] `components/sections/DCGrid.tsx` — header swapped to Utopia eyebrow + h2 + count
- [x] `app/not-found.tsx` — oversize 404 with red zero, mono nav, UButton CTA
- [x] `app/page.tsx` — Cursor mounted globally

### Verification
- [x] `npm run typecheck` — clean
- [x] `npm run build` — successful, all 6 static pages generated, /  = 149 kB First Load JS

## Remaining / Next Pass
- [ ] Split Landing pre-Hero ("choose your side") — still missing from roadmap
- [ ] Self-host PPMori-equivalent and a true pixel font (Zpix or VT323) — currently using Inter + Space Mono as the closest free Google Fonts substitutes
- [ ] Disclaimer modal (Utopia opens with a Safe-Mode / Glitch toggle)
- [ ] Mask builder / generative visual section (Utopia signature)
- [ ] Image-rich gallery for Projects (currently text-only rows)
- [ ] Mobile QA pass on the cursor and oversize type

## Phase 3 — Tunnel removal + Loading/404 rebuild + SEO hardening

### Deleted
- `components/sections/BatCaveTunnel.tsx`
- `components/three/BatCaveTunnel.tsx`

### Added
- `components/three/LogoMark.tsx` — shared R3F scene for batman_logo.glb with per-theme material
  (batman: red metallic; samurai: matte ink-brushed; futuristic: cyan wireframe). Two modes: hero / tiny.
- `components/shared/HeaderLogo.tsx` — fixed top-left persistent brand mark (48px, dynamic SSR-off).
- `components/shared/SceneryLayer.tsx` + globals.css `.fx-*` — dotted grid + CRT scanlines + pulse
  dot, gated to `[data-theme='futuristic']` via CSS selectors.
- `components/shared/ErrorState.tsx` — themed runtime/network error card with onRetry.
- `app/error.tsx` — runtime error boundary using ErrorState.
- `app/global-error.tsx` — last-resort fallback, fully inlined styles (no ThemeProvider available).
- `app/opengraph-image.tsx` — next/og edge route generating 1200x630 OG card.
- `.ink-brush` utility in globals.css — hand-drawn hairline divider, theme-aware stroke color.

### Modified
- `app/page.tsx` — removed BatCaveTunnel; mounted SceneryLayer + HeaderLogo; added sr-only H1
  with identity keywords; expanded Person JSON-LD (knowsAbout, address, nationality, sameAs
  filters empty socials, image).
- `app/layout.tsx` — new metadata: richer title template, SEO_DESCRIPTION mentions all three
  identity variants, expanded keyword list, OG + Twitter images point to /opengraph-image.
- `components/sections/LoadingScreen.tsx` — rebuilt: R3F logo center-stage, 000->100 counter,
  hairline bar, onComplete adds body.loaded class and triggers ScrollTrigger.refresh.
- `components/sections/Hero.tsx` — header padding shifted left to leave room for HeaderLogo.
- `components/sections/DCGrid.tsx` — network failures now render themed ErrorState with retry.
- `components/shared/SmoothScroll.tsx` — ScrollTrigger.refresh on window load to fix stale starts.
- `app/not-found.tsx` — rebuilt: oversize dual-line headline + 404 numeral + R3F logo panel.
- `lib/seo.ts` — added `alternateNames`, `locale`, `locality`, `country`, `jobTitle`, `socials`.

### Trade-offs
- OG image route uses `edge` runtime, so it disables static generation for that path only.
  This is acceptable — the rest of the app is fully static.
- Samurai LogoMark uses matte dark material rather than a truly brushed-ink shader; a custom
  shader would be nicer but wasn't worth the dep/perf cost this pass.
- Futuristic wireframe on the GLB depends on the model's mesh density — works but can look
  sparse; acceptable for a logo mark.

### Verified
- `npm run typecheck` — clean
- `npm run build` — clean, / is 104 kB page / 191 kB first-load JS

### Needs human QA
- Browser pass on all three themes for HeaderLogo sizing vs ThemeToggle on narrow viewports.
- Visual polish on the samurai LogoMark under real light.
- Fill in LinkedIn + Twitter URLs in `lib/seo.ts` socials when accounts are set.
- Add Google Search Console verification token in `app/layout.tsx` metadata.verification.
- Update `SITE.url` in `lib/seo.ts` to the final production domain before launch.

## Wave 2 — Narrative rebuild (PersistentLogo travel + Mahabharata twin)

### Created
- `components/shared/SmartImage.tsx` — native <img> + onError fallback to initials tile over theme-accent gradient. Consumed by DC and Mahabharata grids.
- `components/sections/MahabharataGrid.tsx` — ancient-india-only section. 19-character rail, relationship tree, faction pill, 6-axis GSAP stat bars, ink-brush death card, 18-day war footer, right-rail LogoDock.

### Modified
- `app/page.tsx` — swapped SceneryLayer → FuturisticSceneryLayer; removed HeaderLogo; mounted PersistentLogo once at root (dynamic, ssr:false); wired MahabharataGrid alongside DCGrid (each gates itself by theme).
- `components/sections/Hero.tsx` — full rewrite. Center stack: eyebrow, LogoDock id="hero" size="large", DepthText "TARUN" (8 layers, carved feel), semantic "Satya Tarun K · Creative Developer" tag, theme-aware subline, CTA. Futuristic top bar gets `[ system: online ]` pill + live IST uptime counter. IST clock now seconds-accurate.
- `components/sections/DCGrid.tsx` — gated to batman + futuristic (early-return null under ancient-india). Heroes + villains merged via `[all|heroes|villains]` tabs (terminal brackets on futuristic, plain uppercase on batman). Right-rail LogoDock id="dc". SmartImage everywhere. Firstappearance + nemesis card added.
- `components/sections/Projects.tsx` — eyebrow → `[02] the work · selected`; right-rail LogoDock id="projects"; intro moved into left 8-col column.
- `components/sections/About.tsx` — eyebrow → `[04] the journey · about`; right column adds LogoDock id="about".
- `components/sections/Contact.tsx` — eyebrow → `[05] the signal · contact`; right column adds LogoDock id="contact".
- `components/sections/Footer.tsx` — bottom-right cell adds LogoDock id="footer".

### Logo travel flow
PersistentLogo mounts once at root as a fixed-position `<Canvas>`. Six docks in the DOM: `hero` (large, center hero) → `projects` (right rail) → `dc` (right rail) → `mahabharata` (right rail, only in ancient-india) → `about` (right column) → `contact` (right column) → `footer` (bottom-right cell). PersistentLogo's GSAP ScrollTrigger watches each dock's `top center / bottom center` window and tweens the wrapper's x/y/width/height with quickTo for smooth hand-off.

### Image fallback strategy
All character portraits use `/characters/{id}.jpg` or `/mahabharata/{id}.jpg` placeholder paths. SmartImage renders a bare `<img>` and on `error` swaps to a themed fallback: first two letters of the character's name over a theme-accent gradient tile with inset accent glow. Build never breaks on missing assets.

### Human QA needed
- Verify PersistentLogo dock transitions feel smooth when scrolling fast on a trackpad (may need quickTo duration tuning).
- Under ancient-india, the dock flow is hero → projects → mahabharata → about → contact → footer (DC is null). Confirm visually that the logo settles in each dock.
- TARUN DepthText under ancient-india's light background uses the muted-vermillion shadow — verify legibility.
- Mahabharata character images are placeholders; SmartImage fallback is expected.

