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
