# Wave 3 — Frame Observations from User-Provided Videos

Extracted with ffmpeg into `data/refs/{batman,ancient-india,futuristic-a,futuristic-b}/frame_NN.jpg`. Read these frames (they are JPGs) before implementing the matching theme.

## Batman → utopiatokyo.com + /clan/demon (data/18-43-06.mp4)

- **Landing gate** (`batman/frame_01`): crossed glowing katana over near-black; red bracketed "[ENTER WEBSITE]" pill CTA; tiny red corner-bracket reticle at center bottom; "[LOADING]" mono eyebrow at top-left.
- **Title slab** (`batman/frame_03`): oversize red kanji 東京 crowding the frame; scattered English words as anchor points (FACES / OF / TIME / SHADOWT / TOMORRDH / MASKS / TOKYA / WHERV / PASS / ANL / FUTUYT / COLLIFS); bottom marquee band scrolling uppercase manifesto text — "HIDDEN HISTORIES CONVERGE WITH A REIMAGINED FUTURE…"
- **HUD stats** (`batman/frame_05`): hex-radar chart centered (6 axes — STRENGTH / AGILITY / FEROCITY / INTELLECT / SPIRIT / VITALITY with kanji labels), flanked by two columns of vertical stat bars (30, 17, 20 | 10, 18, 25); "LEVEL 70" card bottom-left; "SKILL POINTS" card bottom-right; ">_DISCOVER_YOUR_INNER_MASK" bracketed CTA center bottom; red corner brackets frame the radar region.
- **Demon title card** (`batman/frame_07`): oversize stencil-font cream "DEMON" with red wireframe geometric overlays draped over it (triangles, arrows, circle); "0737 : 0496" counter pair + "DRAG TO REVEAL" mono top center; corner X icon top-left; bracketed "↓ SCROLL TO REVEAL" bottom CTA; body copy "BRUTAL AND RELENTLESS, THE ONI CLASS…" in mono.
- **Character detail** (`batman/frame_08`): left column — huge red stencil "THE STORY BEHIND DEMON" headline + bracketed red "↓DOWNLOAD_WALLPAPER"; center — 2 paragraphs body; right — rendered mask illustration + prev/next nav pills + stat bars (STRENGTH / INTELLECT / AGILITY / SPIRIT / VITALITY, labeled in kanji).

**Adopt for batman theme:**
- Stencil display font with cream fill for hero numerals/titles (DEMON-style). Source candidate: "Big Shoulders Stencil" or similar stencil via Google Fonts.
- Wireframe overlay decals: thin red outlined geometric shapes overlaying title — build as absolute-positioned SVG decals per section.
- Hex radar + vertical bars HUD on DCGrid character detail (this already partially exists; make it match this frame's geometry).
- Corner-bracket frames around feature regions (already planned).
- Full-width marquee band between sections with uppercase manifesto.

## Ancient India → string-tune.fiddle.digital (data/19-03-00.mp4)

- **Hero compass** (`ancient-india/frame_02`): cream bg, "To master the sword is to master the self…" serif headline top center (second clause grayed); centered compass (N/E/S/W labels) around a 45°-rotated katana tile with floral inlay; "FLOW CONTROL" mono label top-right of compass; orange square "Skill Hub" pill top-right; FPS/PX vertical mono rail on left edge; hex divider mark center bottom; "To master the String…" bottom-left and "is to master the code." bottom-right.
- **Bento grid** (`ancient-india/frame_04`): card grid with varied sizes + pixel-art portrait with "AIKA" label + speech-bubble quote; "Performance Supervision" card with Japanese characters フィドル; red-tinted portrait card "Control your Progress Data" with progress bar; "Use Scroll Container. If you want" nested card with StringTune preview; "Safe natural kerning when Splitting" card.
- **Kinetic headline** (`ancient-india/frame_06`): oversize sans-serif "Code With Clarity" left-aligned; tiny monospace marginalia "BUILT TO TUNE YOUR ANIMATIONS, NOT FIGHT YOUR DOM" right side; stacked dot cluster top; "(  ˄  )" parenthesized wave symbol bottom.
- **Style DNA:** cream/parchment bg (#ebe5ce-ish), single orange-vermillion accent (#e5553a-ish), mixed serif (italic for emphasis) + geometric sans + mono for labels; rounded cards with thin borders; FPS counter ornament as decorative UI; hexagonal divider glyph as section separator; pixel-art portraits as diegetic decoration.

**Adopt for ancient-india theme:**
- Cream/parchment bg already matches. Refine accent to orange-vermillion.
- Bento-card grid for MahabharataGrid character rail (replace linear rail).
- Compass layout for hero centerpiece (N/E/S/W labels around the logo/mark).
- Decorative FPS/PX counter on left rail (purely ornamental mono text).
- Hex wave-symbol divider glyph between sections.
- Mix Crimson Pro italic + Inter Display + Space Mono.

## Futuristic → 8bit.ai + ascendmarketing.xyz (data/18-46-35.mp4 + data/18-59-54.mp4)

- **Neon flow scene** (`futuristic-a/frame_01`, `frame_04`, `frame_07`): deep black bg with single glowing white neon-string curve flowing through 3D space (bright highlight at apex, dim at edges); secondary hexagon-frame element floats to the right containing two small fan/gear icons; top-left 8bit.ai wordmark; top-right hamburger; left-column stacked headline fades through states ("Accelerating / Enterprise / Superintelligence" → "AI-as-a-Service / Bespoke Solutions / for Enterprise."); bottom-left copyright; right side has a thin vertical scroll-indicator line; "Scroll Down To Continue" mono bottom-center.
- **Card mosaic** (`futuristic-b/frame_03`): dark bg with faint starfield; left column — uppercase mono eyebrow "CLIENTS", big italic-serif headline "Trusted by Leading Innovators in Web3.", white pill CTA "Get Started ⊕"; right — 2-column grid of rounded dark cards each containing a client logo (MONAD, BLUR, abstract, Seedify, biptf).
- **Closing section** (`futuristic-b/frame_05`): centered italic-serif "Ready to *ascend* your web3 project?"; white pill CTA below; same neon-string bg but blurred/defocused; footer row with wordmark left, "Discover / About / Clients" mini-nav right.
- **Style DNA:** black bg with particles/starfield; ONE bright neon/string visual drives the hero; mixed italic serif (emphasis) + clean sans (body) + mono (labels); rounded dark cards with thin borders; white pill CTAs as the one bright UI element; vertical scroll-progress indicator on right edge.

**Adopt for futuristic theme:**
- Black + single white neon-string/object as the hero 3D centerpiece (the bat logo IS this object — shader it as glowing tube/wireframe in R3F).
- Particle starfield bg (already have dotted grid — add drifting particles on top).
- Italic serif + sans + mono type mixing.
- Vertical scroll-progress indicator on right edge (formalize from FuturisticSceneryLayer).
- Rounded card grid for DCGrid + Projects under this theme.
- White pill CTAs as the single bright UI element (replace current red/cream buttons with white pills under futuristic).
- Left-column stacked headline that cycles through states via scroll (state 1: identity, state 2: offering) — matches the 8bit.ai scroll choreography.

## Cross-theme recurring patterns to standardize

1. **Right-edge vertical scroll indicator** — thin line at `right: 0; top: 0; height: 100vh; width: 2px`; filled portion reflects scroll progress; color per theme.
2. **Corner-bracket reticles** — present in batman (red) and ancient-india (ink). Build once, color per theme via CSS var.
3. **Bracketed mono eyebrows** — `[ 01 / intro ]` style across all themes.
4. **Single "signature object" rendered in 3D** — per-theme material/behavior but same bat_logo.glb underneath.
5. **Oversize italic-or-stencil one-word hero** — DEMON / ascend / Code. Apply to section titles.

## Files to read before implementing each theme

- Batman: `data/refs/batman/frame_03.jpg` (type + marquee), `frame_05.jpg` (HUD radar), `frame_07.jpg` (stencil title + overlay), `frame_08.jpg` (character detail layout).
- Ancient India: `data/refs/ancient-india/frame_02.jpg` (compass hero), `frame_04.jpg` (bento cards), `frame_06.jpg` (kinetic headline).
- Futuristic: `data/refs/futuristic-a/frame_04.jpg` (neon-string hero centerpiece), `data/refs/futuristic-b/frame_03.jpg` (card mosaic), `frame_05.jpg` (closing CTA + footer).
