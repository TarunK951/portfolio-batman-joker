'use client';

import { PinnedHero } from '@/components/motion/PinnedHero';

/**
 * "ORDER MEETS CHAOS" pinned hero.
 *
 * - Oversize stencil headline that scales down as you scroll through the pin
 * - Terminal line beneath: >_EXECUTE_PROTOCOL (accent red, blinking caret)
 * - Coords block in the corner: 40.7306N / 74.0000W / GOTHAM
 * - Version tag in the opposite corner
 */
export function UtopiaHero() {
  return (
    <PinnedHero className="relative min-h-screen w-full overflow-hidden bg-theme-bg text-theme-ink">
      <div className="relative mx-auto flex h-screen w-full max-w-[1600px] flex-col justify-between px-6 py-10 sm:px-12">
        {/* TOP META ROW */}
        <div className="flex items-start justify-between gap-6 font-code text-[10px] uppercase tracking-[0.28em] text-theme-ink-subtle">
          <div data-pin-meta className="flex flex-col gap-1">
            <span className="text-theme-accent">[ 00 ] arrival / gotham</span>
            <span className="tabular-nums">40.7306°N / 74.0000°W / GOTHAM</span>
          </div>
          <div data-pin-meta className="text-right flex flex-col gap-1">
            <span className="text-theme-accent-dim">BATCOMPUTER</span>
            <span className="tabular-nums text-theme-ink/70">v2.0.0-RC.1</span>
          </div>
        </div>

        {/* HEADLINE */}
        <div className="flex flex-col items-center gap-10 text-center">
          <h2
            data-pin-headline
            className="u-h1 font-display text-theme-ink"
            style={{ willChange: 'transform' }}
          >
            ORDER MEETS
            <br />
            <span className="text-theme-accent">CHAOS</span>
          </h2>

          <div
            data-pin-sub
            className="flex flex-col items-center gap-4"
          >
            <span
              className="font-code text-[12px] uppercase tracking-[0.32em] text-theme-accent"
              aria-label="Execute protocol"
            >
              &gt;_EXECUTE_PROTOCOL
              <span
                aria-hidden
                className="ml-1 inline-block h-[1em] w-[0.5em] translate-y-[2px] bg-theme-accent align-middle u-flicker"
              />
            </span>
            <p className="max-w-[520px] font-lore text-[16px] leading-[1.55] text-theme-ink/70">
              In a world that breaks everyone &mdash; some choose to become the
              darkness that protects the light.
            </p>
          </div>
        </div>

        {/* BOTTOM META ROW */}
        <div
          data-pin-meta
          className="flex items-end justify-between gap-6 font-code text-[10px] uppercase tracking-[0.28em] text-theme-ink-subtle"
        >
          <span>satyatarun &middot; creative developer</span>
          <span className="tabular-nums">scroll to descend &darr;</span>
        </div>
      </div>
    </PinnedHero>
  );
}
