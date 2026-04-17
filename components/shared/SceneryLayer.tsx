'use client';

/**
 * Full-viewport fixed layer that renders theme-specific ambient visuals.
 * Active styles are gated in globals.css via [data-theme='futuristic'].
 * Purely decorative, pointer-events: none.
 */
export function SceneryLayer() {
  return (
    <div aria-hidden className="fx-scenery">
      <div className="fx-grid" />
      <div className="fx-scanlines" />
      <div className="fx-pulse" />
    </div>
  );
}
