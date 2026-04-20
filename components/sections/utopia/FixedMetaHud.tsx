'use client';

import { useEffect, useState } from 'react';

/**
 * Persistent fixed chrome over the scroll — utopiatokyo.com style.
 *
 * - Top-left:    coords badge
 * - Top-right:   version tag
 * - Bottom-left: terminal protocol line
 * - Bottom-right: live UTC clock
 *
 * All typography leans on `font-code` (JetBrains Mono), 10px, tracking-[0.3em],
 * `theme-ink-subtle`. Each corner prefixes a single `theme-accent` character
 * so the palette reads even at this size. Pointer-events disabled — the
 * custom TargetCursor rides above.
 */

function useLiveClock() {
  const [now, setNow] = useState<string>('--:--:--');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hh = String(d.getUTCHours()).padStart(2, '0');
      const mm = String(d.getUTCMinutes()).padStart(2, '0');
      const ss = String(d.getUTCSeconds()).padStart(2, '0');
      setNow(`${hh}:${mm}:${ss} UTC`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

const HUD_BASE =
  'pointer-events-none fixed z-40 font-code text-[10px] uppercase tracking-[0.3em] text-theme-ink-subtle';

export function FixedMetaHud() {
  const clock = useLiveClock();

  return (
    <>
      {/* TOP-LEFT */}
      <div
        aria-hidden
        className={`${HUD_BASE} left-4 top-4 inline-flex items-center gap-2 sm:left-6 sm:top-6`}
      >
        <span className="text-theme-accent">&bull;</span>
        <span className="tabular-nums">40.7306&deg;N / 74.0000&deg;W</span>
      </div>

      {/* TOP-RIGHT */}
      <div
        aria-hidden
        className={`${HUD_BASE} right-4 top-4 inline-flex items-center gap-2 sm:right-6 sm:top-6`}
      >
        <span className="tabular-nums">BATCOMPUTER v2.0.0-RC.1</span>
        <span className="text-theme-accent">&bull;</span>
      </div>

      {/* BOTTOM-LEFT */}
      <div
        aria-hidden
        className={`${HUD_BASE} bottom-4 left-4 inline-flex items-center gap-2 sm:bottom-6 sm:left-6`}
      >
        <span className="text-theme-accent">&gt;</span>
        <span>_EXECUTE_PROTOCOL</span>
        <span
          className="u-flicker inline-block h-[1em] w-[0.5em] translate-y-[1px] bg-theme-accent"
        />
      </div>

      {/* BOTTOM-RIGHT */}
      <div
        aria-hidden
        className={`${HUD_BASE} bottom-4 right-4 inline-flex items-center gap-2 sm:bottom-6 sm:right-6`}
      >
        <span className="tabular-nums">{clock}</span>
        <span className="text-theme-accent">&bull;</span>
      </div>
    </>
  );
}
