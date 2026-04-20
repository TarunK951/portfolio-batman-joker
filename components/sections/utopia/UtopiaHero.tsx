'use client';

/**
 * "ORDER MEETS CHAOS" hero — utopiatokyo.com composition.
 *
 * - Full-viewport height, center-aligned.
 * - Small mono eyebrow above the headline.
 * - Headline stacked on three lines, huge fluid clamp, tight leading.
 * - Thin 40px hairline centered under the headline.
 * - One-line lore caption in italic serif (Crimson Text).
 *
 * Deliberately NOT using the pinned / scrubbed timeline any more — the spec
 * wants a clean static composition you scroll past, not a scroll-scrubbed
 * camera move. `data-cursor="target"` removed from the headline itself (too
 * big — made the custom reticle feel broken).
 */
export function UtopiaHero() {
  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-theme-bg px-6 text-center text-theme-ink sm:px-12">
      {/* Eyebrow — small mono tag above the headline */}
      <div className="mb-10 flex flex-col items-center gap-1 font-code text-[10px] uppercase tracking-[0.32em] text-theme-ink-subtle">
        <span className="text-theme-accent">&gt;_EXECUTE PROTOCOL</span>
        <span className="tabular-nums">v2.0.0-RC.1</span>
      </div>

      {/* Three-line stacked headline */}
      <h2
        className="flex flex-col items-center font-display text-theme-ink"
        style={{
          fontSize: 'clamp(3.5rem, 11vw, 12rem)',
          lineHeight: 0.85,
          letterSpacing: '-0.03em',
        }}
      >
        <span className="block">ORDER</span>
        <span className="block text-theme-ink/70">MEETS</span>
        <span className="block text-theme-accent">CHAOS</span>
      </h2>

      {/* Thin 40px hairline */}
      <span
        aria-hidden
        className="mt-10 inline-block h-px w-10 bg-theme-accent"
      />

      {/* One-line italic serif lore caption */}
      <p
        className="mt-8 max-w-[52ch] font-lore italic text-theme-ink-subtle"
        style={{ fontSize: '17px', lineHeight: 1.6 }}
      >
        In a world that breaks everyone &mdash; some choose to become the
        darkness that protects the light.
      </p>
    </section>
  );
}
