# Animation timings

Single source of truth for durations, eases, and staggers across the motion
primitives and Utopia-Tokyo reskin sections. Tune here; each entry maps to a
literal in the indicated file.

## Global eases

| Token    | Curve                                  | Use                                        |
|----------|----------------------------------------|--------------------------------------------|
| utopia   | `cubic-bezier(.2, .8, .2, 1)`           | Page-level transitions, bg morph            |
| power2.out | GSAP built-in                         | Enter reveals, settled states               |
| power2.inOut | GSAP built-in                       | Headline scale during pin                   |
| power1.in  | GSAP built-in                         | Fade-out of meta rows at end of pin         |
| none       | linear                                | Scrub-driven parallax / horizontal track    |

## Motion primitives

### `RevealOnScroll` (components/motion/RevealOnScroll.tsx)

| Param         | Default      | Notes                                           |
|---------------|--------------|-------------------------------------------------|
| `y`           | `32`         | Pixels translated from below                    |
| `duration`    | `0.9`        | Seconds                                         |
| `delay`       | `0`          | Seconds                                         |
| `ease`        | `power2.out` | Hardcoded                                       |
| `start`       | `top 82%`    | ScrollTrigger start                             |
| `once`        | `true`       | `toggleActions: 'play none none none'`           |

### `ScrambleText` (components/motion/ScrambleText.tsx)

| Param         | Default  | Notes                                             |
|---------------|----------|---------------------------------------------------|
| `tickMs`      | `40`     | ms between glyph swaps                            |
| `revealStepMs`| `55`     | ms per resolved character                         |
| `trigger`     | `mount`  | or `scroll` (uses ScrollTrigger at `top 85%`)     |

Total resolve time ~= `text.length * revealStepMs`.

### `Marquee` (components/motion/Marquee.tsx)

| Param          | Default | Notes                                     |
|----------------|---------|-------------------------------------------|
| `speed`        | `32`    | seconds per full loop                     |
| `direction`    | `left`  | `left` = translateX 0 -> -50%             |
| `pauseOnHover` | `true`  | Sets `animation-play-state` on hover      |

### `ParallaxLayer` (components/motion/ParallaxLayer.tsx)

| Param    | Default | Notes                                              |
|----------|---------|----------------------------------------------------|
| `speed`  | `-0.3`  | yPercent applied over `top bottom -> bottom top`   |
| `scrub`  | `true`  | Hardcoded to scrub; ease `none`                    |

### `PinnedHero` (components/motion/PinnedHero.tsx)

Timeline built from data attributes inside children.

| Label           | Start | Duration | Ease          | Tween                                   |
|-----------------|-------|----------|---------------|-----------------------------------------|
| `data-pin-sub`  | 0     | 0.5      | power2.out    | `y: 40 -> 0`, `opacity: 0 -> 1`         |
| `data-pin-headline` | 0.35 | 1.0  | power2.inOut  | `scale: 1 -> 0.82`, `opacity: 1 -> 0.3` |
| `data-pin-meta` | 0.75  | 0.35     | power1.in     | `opacity: 1 -> 0`                       |

ScrollTrigger: `start: 'top top'`, `end: '+=120%'`, `scrub: 1`.

### `HorizontalGallery` (components/motion/HorizontalGallery.tsx)

| Param  | Default | Notes                                               |
|--------|---------|-----------------------------------------------------|
| `tail` | `0`     | Extra scroll distance after track finishes          |
| scrub  | `1`     | Hardcoded; ease `none`                              |
| pin    | `true`  | Section pins while inner track translates in X      |

`end` = `+=(trackWidth - viewportWidth + tail)` px. Recomputed on resize via
`invalidateOnRefresh`.

### `BackgroundColorMorph` (components/motion/BackgroundColorMorph.tsx)

| Param      | Default                 | Notes                                        |
|------------|-------------------------|----------------------------------------------|
| morph dur  | `0.8s`                  | GSAP tween to new backgroundColor            |
| ease       | `power2.out`            |                                              |
| CSS fallback | `800ms cubic-bezier(.2,.8,.2,1)` | inline on wrapper for flash-proofing |
| trigger    | `start: top 60%`, `end: bottom 40%` | onEnter + onEnterBack both set bg  |

## Route transition

### `app/template.tsx`

| Phase    | Values                                      |
|----------|---------------------------------------------|
| initial  | `opacity: 0, y: 12`                         |
| animate  | `opacity: 1, y: 0`                          |
| exit     | `opacity: 0, y: -8`                         |
| duration | `0.45s`                                     |
| ease     | `[0.2, 0.8, 0.2, 1]` (utopia)                |

## Utopia section compositions

### `UtopiaHero` (components/sections/utopia/UtopiaHero.tsx)

Composes `PinnedHero` with default timeline. Terminal caret uses the
`.u-flicker` CSS keyframe (`4.2s ease-in-out infinite`, 40% dip to 0.6 opacity).

### `StanzaBlock` (components/sections/utopia/StanzaBlock.tsx)

Each stanza row:
- Triplet words: `ScrambleText` with `tickMs: 42`, `revealStepMs: 48`,
  `trigger: 'scroll'`. 3 words resolve in parallel when the row enters.
- Caption line: `RevealOnScroll` with `delay: 0.2`, otherwise default (`y: 32`,
  `duration: 0.9`, `power2.out`).
- Eyebrow column: `RevealOnScroll` default.

### `VersionMarquee` (components/sections/utopia/VersionMarquee.tsx)

`Marquee speed={38}`. 6 items duplicated once for loop continuity.

### `LoreParallax` (components/sections/utopia/LoreParallax.tsx)

- Heading column: `RevealOnScroll` default.
- Lore column: wrapped in `ParallaxLayer speed={-0.18}`. Each `<p>` is a
  `RevealOnScroll` with `delay: idx * 0.08` (natural cascade 0 / 0.08 / 0.16).

### `CaseFileGallery` (components/sections/utopia/CaseFileGallery.tsx)

Uses `HorizontalGallery` with `tail: 0` and default scrub. 6 cards at
`h-[64vh] w-[min(420px,80vw)]` separated by `mx-4`. Trailing `20vw` spacer so
the last card clears before the pin releases.

## Recommended tuning order

1. Global scroll feel: adjust Lenis `duration` in `SmoothScrollProvider` (1.15
   default). Lower = snappier, higher = floatier.
2. Hero pin scroll distance: `endOffset` on `UtopiaHero`'s `PinnedHero`
   (`+=120%`).
3. Stanza rhythm: `revealStepMs` on the three words per row.
4. Gallery pace: adjust `tail` on `HorizontalGallery` (adds scroll time after
   translate completes).
5. Parallax intensity: flip `speed` sign or magnitude (-0.1..-0.4 is the
   useful range before it looks disconnected).
