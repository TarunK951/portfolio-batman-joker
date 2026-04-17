# Wave 3 Design Direction — Satya Tarun K Portfolio

> Authored by product-designer agent. References were not live-fetched in the producing run; anywhere a visual detail needs pixel-match confirmation it is flagged **[VERIFY]**. Before Wave 3.5 lands, record 30-second screen captures of each reference site and park under `.claude/refs/`.

## 1. Executive summary

- Three themes share one R3F `PersistentLogo` that docks across sections. Coherent but the logo auto-spins, themes rhyme more than differentiate, and Split Landing / disclaimer / mask-builder are still missing.
- Target: one weighted, scroll-driven bat-logo (Lightweight-style, no autospin), rendered via `<model-viewer>` for batman + ancient-india and R3F for futuristic (which needs shader-based wireframe/glitch FX).
- Each theme gets distinct motion DNA: Utopia/demon ritual (batman), torn-parchment frame + kinetic-type (ancient-india), 8bit.ai grid-card choreography (futuristic).
- New infrastructure: GSAP Observer for a global section bus; SplitText on every headline; Flip powers the dock handoff (replacing the current bounding-rect tween, the weakest link in persistence flow).
- Perf budget: stay under 500 kB first-load JS. `<model-viewer>` replacing one R3F canvas should be net-negative (~90 kB gz vs drei+postprocessing we'd otherwise pull in).

## 2. 3D rendering strategy

### Renderer per theme

| Theme | Renderer | Why |
|---|---|---|
| batman | `<model-viewer>` 4.2.0 | Utopia/demon look is a cinematic product-shot: HDRI-lit metal, weighted motion, no custom shaders. Built-in skybox/env-maps, better mobile memory. |
| ancient-india | `<model-viewer>` with matte override | Sculpted object over parchment, no shader needs. Warm IBL + key light. Brushed-bronze via `metallicFactor ~0.4, roughness ~0.55`. |
| futuristic | R3F (keep `PersistentLogo.tsx`) | Cyan wireframe/scanline/holographic needs custom shaderMaterial + selective bloom. `<model-viewer>` would fight us. |

Babylon.js: recommended against. Overkill for a hero object; two renderers already stress cognitive budget.

### Implementation shape

- Load the custom element once via `next/script` (`strategy="afterInteractive"`) in `app/layout.tsx`. Do NOT inject from a component — causes double-loads on client nav.
- New `components/three/ModelViewerLogo.tsx` — client leaf wrapping `<model-viewer>` with imperative `setRotation(y, x)` API.
- `components/three/PersistentLogo.tsx` becomes a router: `if (theme === 'futuristic') → R3F`, else → `ModelViewerLogo`.
- TypeScript shim in `types/model-viewer.d.ts` for the custom element.

### `<model-viewer>` config (batman + ancient-india)

```html
<model-viewer
  src="/models/batman_logo.glb"
  alt="Batman emblem, sculpted"
  camera-controls
  disable-zoom
  interaction-prompt="none"
  touch-action="pan-y"
  camera-orbit="0deg 85deg 4.2m"
  min-camera-orbit="auto auto 3.6m"
  max-camera-orbit="auto auto 5m"
  field-of-view="32deg"
  shadow-intensity="1.1"
  shadow-softness="0.9"
  environment-image="neutral"
  exposure="0.95"
></model-viewer>
```

Explicit omissions: `auto-rotate`, `auto-rotate-delay`, `rotation-per-second`. Never set them.

Sizing: hero dock → `min(62vmin, 680px)` desktop, `min(86vmin, 520px)` mobile. Add an `'xl'` entry to `DOCK_DIMENSIONS` in `components/three/PersistentLogo.tsx:80` and update `LogoDock id="hero"` in `Hero.tsx` to `size="xl"`.

Per-theme shift: batman `exposure=0.95`, ancient-india `exposure=1.25` with a warmer env (`/env/warm.hdr`).

Fallback: `<img slot="poster">` with a pre-rendered PNG to avoid flash while the GLB streams.

### Motion spec — "cycle tyre rim" from lightweight.info

A scroll-coupled, low-frequency, overdamped rotation. Not a spin, not parallax.

1. Primary axis: Y (yaw).
2. Secondary axis: X (pitch), ~15% of Y amplitude. Adds weight.
3. `scrollY` via ScrollTrigger `scrub: 1.2` → yaw; roughly one revolution per ~2400 vh (~0.15 rad per viewport). Deliberately slow.
4. Rotational damper: `gsap.quickTo(target, 'rotationY', { duration: 0.9, ease: 'power3.out' })` driven from ScrollTrigger `onUpdate` so scroll pauses land softly.
5. Idle drift: when scrolling stops, continue at ~0.01 rad/sec for ~1.2s before easing to rest. The "tyre still spinning from momentum" feel.
6. Hover on hero dock only: cursor X nudges yaw ±0.12 rad, pitch ±0.06 rad over 0.8s ease-out. Release → return to scroll-bound rest.
7. Remove the `useFrame` spinner currently in `PersistentLogo.tsx:166–172` (`rotation.y = t * 0.3`). Replace with a single ScrollTrigger writing to a shared rotation target ref.

For `<model-viewer>`: tween `cameraOrbit = '${-yaw}deg 85deg 4.2m'` from ScrollTrigger. Recent versions expose `turntableRotation` [VERIFY 4.2.0].

Reduced motion: pin rotation to `0deg 85deg`, skip idle drift.

## 3. Per-theme specs

### 3.1 Batman — utopiatokyo.com/clan/demon deepening

Utopia/demon DNA: near-black `#14171f`, one saturated red accent, oversize display crowding the frame, pixel-mono eyebrows, slow marquee strips, cursor ring that swallows the dot on hover, cream "paper" breaker, hairline rules as structural separators, ritual-quality motion (nothing bounces; things arrive and settle).

Much is already in `app/globals.css` (cursor 184–220, buttons 225–256, rules/paper 270–290). The gap is the **motion vocabulary** — it hasn't been pushed into section transitions.

Deepening:

- Hero h1: `clamp(4.5rem, 17vw, 13.5rem)` (currently 4rem/14vw/11rem). Utopia's hero overflows horizontally; ours still has margin.
- Tracking: h1 `-0.045em`, h2 `-0.035em`.
- Red discipline: max ≤1 `text-theme-accent` usage per section. Audit and trim.
- Add a second paper breaker between Projects and About — oversize pull-quote section, one sentence of the batman tagline. Highest-impact single lift for batman.
- Cursor: reinstate the four corner-bracket reticle form (current simpler ring is a regression from earlier pass).
- Scroll choreography: every section enters with a horizontal wipe mask. `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)`, 0.9s `power3.out`, 0.08s stagger across children. The Utopia move.
- Per section:
  - Hero: SplitText char-reveal on "TARUN" with stagger; scroll-driven logo rotation; pinned right-rail side-marquee `"ORDER · ORDER · ORDER ·"`.
  - Projects: `mix-blend-mode: difference` on index numbers for consistent readout across paper transitions.
  - Contact: SplitText per-word reveal on "Light / the signal."
  - Footer: oversize wordmark under an inset corner-bracket frame that draws itself on entry (stroke-dashoffset, 1.4s).

### 3.2 Ancient India — string-tune.fiddle.digital

User called out: page-border treatment and text animations.

**Page-border** — thin hand-drawn border inset from viewport edges, fixed to viewport (not document), subtle thick/thin brushwork variation, tiny corner ornaments. Four absolute-positioned SVGs (or one full-viewport SVG mask).

**Text animations** — headline words unroll left-to-right character by character with a subtle vertical sinusoidal bob (letters pulled off a scroll). Nav-item hover → per-char jitter (±2px vertical, random, easing back in 0.3s).

Spec:

- `components/shared/ParchmentFrame.tsx` — new, mounted once at root under `[data-theme='ancient-india']` only. Four fixed SVGs using existing `.ink-brush` style (`app/globals.css:413–425`). Corner ornaments: a four-petal lotus mark or adjacent glyph. `z-index: 30` (above content, below cursor at 9999).
- `components/shared/UnrollText.tsx` — new. `SplitText` by chars → `gsap.from(chars, { y: 14, opacity: 0, rotationZ: -8, stagger: 0.035, ease: 'back.out(1.6)' })` + infinite low-amplitude bob: `{ yoyo: true, duration: 2.4, stagger: { each: 0.12, from: 'random' }, y: '+=1.5' }`. Use it on every ancient-india headline in `MahabharataGrid.tsx`, `Hero.tsx` eyebrow, and section titles under the theme.
- Palette: `--bg: #efe9dd` stays. Bump `--accent-soft` from `#d14a4a` to `#b2432f` [VERIFY]. Vermillion `#8a1a1a` stays.
- Type: load Noto Serif Devanagari + Crimson Pro. Bebas reads too industrial here — swap h2/h3 font under `[data-theme='ancient-india']` via `body[data-theme='ancient-india'] .u-h2, .u-h3 { font-family: var(--font-serif); }`.
- Cursor: replace dot with `॰` glyph (or drawn kalam tip). Same ref pipeline, only rendered mark changes.
- Section choreography: parchment unfurl — `clip-path: inset(50% 50% 50% 50%)` → `inset(0 0 0 0)`, gentle `power2.out`, 1.2s. No horizontal wipes (those are batman).
- MahabharataGrid: death card accepts `<UnrollText>` headline (currently static).

### 3.3 Futuristic — 8bit.ai (user emphasis: pixel to pixel)

User re-emphasized 8bit.ai is the futuristic north-star — match it hard. Without live fetch the spec below is inferred; Wave 3.5 must reconcile against a live capture in `.claude/refs/`.

8bit.ai DNA:

- Dotted-grid background (already in `.fx-grid`, `globals.css:364`).
- Modular card-dense landing: sections read as grid tiles with hairline borders + top-left mono labels.
- Type mixing: oversize geometric-grotesque display + pixel/monospace labels and numbers. Swap Bebas → `Inter Display 700` (or similar) under futuristic only. Keep Space Mono for labels.
- Section transitions: "card deal" — ~6 stacked rectangles slide/rotate into final positions, 0.05s stagger, ~0.7s total, `power4.out`.
- Hover: card border "runs" (SVG stroke-dashoffset loop) + 1px inward scale. Cursor becomes `+`.

Pixel-to-pixel anchors:

- Grid gutter: 24px.
- Card border: 1px `hsl(var(--line))`.
- Card padding: 24px.
- Label: top-left mono, 10px, 0.24em tracking, uppercase, bracketed `[ 01 / intro ]`.
- Notched top-right corner on one card per section: `clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)`. Accent, not all.
- Scroll indicator: `position: fixed; left: 0; top: 0; width: 2px; height: ${scrollProgress}vh`. Formalise from the half-built state in `FuturisticSceneryLayer`.

Per section:

- Hero: keep `[ system: online ]` pill + uptime clock. Add a bottom ticker row (not marquee — fixed row, stats rotate every 4s with glitch transition): `LATENCY 12ms | BUILD #af3c | REGION BLR-1`.
- DCGrid: left thumbnail rail becomes a vertical card stack with a tracking line between cards; HUD targeting brackets overlay the main portrait.
- Projects: switch to 2-col card grid under futuristic only (gate on `theme`).
- Cursor: morph to `+` center-mark overlay on interactive hover.

## 4. GSAP timeline plan

### Plugins to register in `lib/gsap.ts`

| Plugin | Purpose | Where |
|---|---|---|
| ScrollTrigger | (already) | all |
| SplitText | per-char/word reveals on every headline | all sections |
| Flip | replaces `PersistentLogo.tsx:228–235` tween; correct aspect/padding handoff | PersistentLogo |
| Observer | global section-change + theme-toggle bus | `hooks/useSectionObserver.ts` |
| ScrollToPlugin | nav smooth-scroll that respects SmoothScroll | Hero nav, Footer |
| CustomEase | `u-demon`, `u-parchment`, `u-circuit` named eases per theme | `lib/gsap.ts` |
| MotionPathPlugin (optional) | ancient-india floating petals/embers | new scenery layer |

License: SplitText + Flip are in the free GSAP 3.12+ bundle [VERIFY commercial use].

### Per-section timelines

**Hero (all themes)** — `heroIn` autoplay after `LoadingScreen.onComplete`:

1. Eyebrow: y 12→0, opacity 0→1, `power2.out` 0.6s.
2. LogoDock: scale 0.85→1, opacity 0→1, 1.2s, theme-keyed ease. Entrance only — scroll rotation takes over after.
3. TARUN DepthText: SplitText chars, stagger 0.05, y 40→0, rotationX -25→0, `power4.out`, 1.0s. (Upgrade from current basic y-translate.)
4. Subline: word-by-word, stagger 0.04.
5. CTA: border-bottom width 0%→100%, 0.5s.

Scroll-coupled: logo rotation per §2.

**DCGrid / MahabharataGrid**

- `ScrollTrigger.batch()` for thumbnail reveal (much lighter than per-item triggers).
- Character-select panel swap via Flip: snapshot → swap DOM → `Flip.from(state, { duration: 0.6, absolute: true, ease: 'power3.out' })`. Replaces `gsap.from(panel, { x: 20 })` at `DCGrid.tsx:66–71`.
- Powerstat bars: sequential, 0.12s stagger (currently simultaneous).

**Projects** — row cards via theme-keyed animation (wipe / unfurl / card-deal). Index numbers count 00→final via `roundProps`.

**About** — skill bars scrub-bound to section scroll; widths fill as you read down. Gives the section length narrative purpose.

**Contact** — horizontal red line draws across on enter (1px div width tween, fake for drawSVG which is paid). Email button gets glow pulse on `mouseenter`.

**Footer** — oversize wordmark SplitText chars, vertical scrub bound to last 100vh; characters rise into place as you hit the bottom.

**PersistentLogo dock handoff — the big one**

Current: four `quickTo`s on x/y/width/height. Problem: dock aspect-ratio differences squash the logo mid-transit.

Replacement shape:
```ts
ScrollTrigger.create({
  trigger: dock,
  start: 'top center',
  end: 'bottom center',
  onToggle: (self) => {
    if (!self.isActive) return;
    const state = Flip.getState(wrapper);
    updateWrapperToMatch(dock);
    Flip.from(state, { duration: 0.9, ease: 'power3.inOut', absolute: true });
  },
});
```

Material UX improvement — logo glides respecting aspect.

### Theme toggle transition

Full-viewport overlay `div` with `mix-blend-mode: difference`, fill `hsl(var(--accent))` from the **incoming** theme, 0% → 18% (0.2s) → 0% (0.4s). Flip `document.documentElement.dataset.theme` at the 0.2s peak, not at click. CSS crossfade runs underneath.

## 5. Implementation roadmap

Six waves. Keep `typecheck && build` green after each. Budget: ≤500 kB first-load.

- **Wave 3.1** — Renderer split. `app/layout.tsx` next/script, new `ModelViewerLogo.tsx`, router change in `PersistentLogo.tsx`, new `hooks/useLogoRotation.ts`, `types/model-viewer.d.ts`. **Risk: medium** (custom element typing, double-load traps).
- **Wave 3.2** — GSAP plugin uplift. Register SplitText/Flip/Observer/ScrollToPlugin/CustomEase in `lib/gsap.ts`. New `UnrollText.tsx`. Swap Hero TARUN manual animation for SplitText timeline. **Risk: low** (purely additive).
- **Wave 3.3** — PersistentLogo handoff = Flip. `PersistentLogo.tsx` 208–307 rewrite. Keep quickTo as reduced-motion fallback. **Risk: medium** (layout thrash).
- **Wave 3.4** — Ancient-India parchment frame + UnrollText rollout. New `ParchmentFrame.tsx`, mount under theme gate, `--font-serif` + Crimson Pro + Noto Serif Devanagari via `next/font/google`, serif override block in globals, swap ancient-india headlines. **Risk: low**.
- **Wave 3.5** — Futuristic 8bit.ai card-grid refit. `Projects.tsx` theme-gated alt layout, `DCGrid.tsx` HUD brackets + vertical rail, new `Card.tsx` with notched-corner prop, `.fx-ticker` + `.fx-corner-cut` utilities in globals, bottom ticker in Hero. **Risk: medium-high** (biggest visual shift, four sections). **Requires live 8bit.ai reference captures before starting.**
- **Wave 3.6** — Outstanding Wave 2 backlog: Split Landing → disclaimer modal → Projects image gallery → mask builder. **Risk: high** (new surface, not refactor).

## 6. Open questions

1. `<model-viewer>` — third-party CDN (ajax.googleapis.com) vs self-host under `/public/vendor/`? Recommend self-host (~90 kB, no third-party cache/cookies).
2. Babylon.js — recommending against. OK, or does user want a POC in one section (e.g. GaussianSplatting cameo in futuristic)?
3. Ancient-India fonts — Crimson Pro + Noto Serif Devanagari (OFL, free). Any preference for paid (Tiempos, GT Super)?
4. Split Landing / disclaimer / mask-builder — OK in Wave 3.6 after renderer/GSAP/theme upgrades, or jump queue?
5. Logo rotation coupling — scroll-coupled (recommended, matches Lightweight) vs. idle breathing loop with scroll affecting speed. Pick one.
6. Reference verification — before Wave 3.5 lands, record 30s captures of all four reference sites and park under `.claude/refs/`.
7. Reduced motion — full disable for spins/marquees (poster for logo) + keep SplitText word reveals? Or blanket fallback?
8. Cursor per theme — bracket-reticle (batman) / kalam-dot (ancient-india) / plus-mark (futuristic). OK, or keep current cursor with only hover-colour varying?
