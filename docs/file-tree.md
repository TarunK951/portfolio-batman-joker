# File tree — Utopia Tokyo Reskin (Batman)

Files created or modified by this task. Paths are repo-root relative.

```
docs/
  palette.md                               [NEW] Batman palette + extended tokens
  fonts.md                                 [NEW] Font loadout + usage rules
  file-tree.md                             [NEW] This file
  animation-timings.md                     [NEW] Durations / eases / staggers per component

app/
  globals.css                              [MOD] Extended batman tokens (surface-raised, accent-dim, ink-subtle, hairline)
  layout.tsx                               [MOD] Load Crimson Text + JetBrains Mono; mount SmoothScrollProvider
  page.tsx                                 [MOD] Wire new sections into the home composition
  template.tsx                             [NEW] Route transition wrapper (AnimatePresence fade + Y)

components/
  providers/
    SmoothScrollProvider.tsx               [NEW] Lenis + ScrollTrigger bridge; wraps children
  motion/
    RevealOnScroll.tsx                     [NEW] Fade + translateY on intersect (GSAP ScrollTrigger)
    ScrambleText.tsx                       [NEW] Left-to-right character scramble resolver
    Marquee.tsx                            [NEW] Infinite horizontal marquee
    ParallaxLayer.tsx                      [NEW] ScrollTrigger scrub translateY parallax
    PinnedHero.tsx                         [NEW] Pinned section with scrubbed internal timeline
    HorizontalGallery.tsx                  [NEW] Vertical pin + horizontal translate
    BackgroundColorMorph.tsx               [NEW] Body/wrapper bg morph between surface tones
  sections/
    utopia/
      UtopiaHero.tsx                       [NEW] "ORDER MEETS CHAOS" pinned hero composition
      StanzaBlock.tsx                      [NEW] MASKED / MARKED / WATCHED triplet section
      VersionMarquee.tsx                   [NEW] BATCOMPUTER version tag strip
      LoreParallax.tsx                     [NEW] Gotham corruption paragraph with ParallaxLayer
      CaseFileGallery.tsx                  [NEW] Horizontal-scroll case file cards

lib/
  gsap.ts                                  [MOD] Added useGsapScope hook

tailwind.config.ts                         [MOD] New theme-* color aliases for extended tokens
```

## Annotations

- `components/motion/*` are the generic primitives — reusable and composable.
  They are all client components at the leaf; each owns its own `gsap.context`
  and teardown.
- `components/sections/utopia/*` are this task's concrete compositions built
  from those primitives. Keeping them in their own subfolder avoids colliding
  with the existing `Hero.tsx`, `DCGrid.tsx`, etc. — the original sections are
  untouched.
- `app/page.tsx` is still a server component. Every motion/utopia import is
  added via `next/dynamic(..., { ssr: false })` to stay on the established
  client-boundary discipline.
- `app/template.tsx` is a client component (required by `usePathname` +
  framer-motion). It wraps children in a `<motion.div>` keyed by pathname.
- `components/providers/SmoothScrollProvider.tsx` is mounted **once** in
  `app/layout.tsx` around children; the pre-existing `SmoothScroll` shared
  component is kept for now but the Provider is the canonical lifecycle owner
  going forward. If they ever overlap they both guard on reduced-motion and
  both clean up; the Provider is harmless to stack over.
