'use client';

/**
 * Fixed-viewport low-opacity grain texture.
 *
 * Uses an inline SVG `feTurbulence` data-URI so there's no extra asset fetch
 * and the grain renders immediately on first paint. Mounted once in
 * `app/layout.tsx` inside the ThemeProvider tree (so any future theme-aware
 * tweaks are possible) but above children so it sits beneath interactive UI.
 *
 * Notes:
 * - `pointer-events: none` — never blocks the cursor or clicks.
 * - `mix-blend-mode: overlay` — mutes on true black, brightens on mid-tones,
 *   which matches utopiatokyo.com's subtle-grain film feel.
 * - Respects prefers-reduced-motion by rendering static grain (the SVG is
 *   already static; no animation to gate).
 * - z-index 30: beneath fixed chrome (coords HUD at 40, cursor at 9999) but
 *   above regular page content. Adjust if any new chrome lands below this.
 */

// Inline SVG grain — baseFrequency 0.9 gives a fine film grain. Single octave
// keeps it cheap. Data URI — not a CSS var — so Next can ship it in one payload.
const GRAIN_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0.9  0 0 0 0 0.9  0 0 0 0 0.85  0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23g)' opacity='1'/></svg>\")";

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 30,
        opacity: 0.06,
        mixBlendMode: 'overlay',
        backgroundImage: GRAIN_SVG,
        backgroundRepeat: 'repeat',
        backgroundSize: '220px 220px',
      }}
    />
  );
}
