'use client';

import { useEffect, useState } from 'react';

/**
 * Persistent fixed chrome that rides over the scroll — utopiatokyo.com style.
 *
 * - Top-left:   coords badge (lat / lon / CITY)
 * - Top-right:  version tag (project codename + semver)
 * - Bottom-left: terminal line ">_EXECUTE_PROTOCOL" with a blinking caret
 * - Bottom-right: live local timestamp (hh:mm:ss UTC offset)
 *
 * Everything is `position: fixed` with `pointer-events: none` so it never
 * blocks the cursor. z-index 40 sits above the grain overlay (30) but below
 * the custom cursor (9999).
 *
 * Typography leans on `font-code` (JetBrains Mono) — the mono tier we loaded
 * in app/layout.tsx specifically for this HUD.
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

export function FixedMetaHud() {
  const clock = useLiveClock();

  return (
    <>
      {/* TOP-LEFT: coords */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-4 top-4 z-40 flex flex-col gap-1 font-code text-[10px] uppercase tracking-[0.28em] text-theme-ink-subtle sm:left-6 sm:top-6"
      >
        <span className="text-theme-accent">[ S.T.K // 2026 ]</span>
        <span className="tabular-nums">40.7306&deg;N / 74.0000&deg;W</span>
        <span className="tabular-nums text-theme-ink/50">gotham / sector-07</span>
      </div>

      {/* TOP-RIGHT: version */}
      <div
        aria-hidden
        className="pointer-events-none fixed right-4 top-4 z-40 flex flex-col items-end gap-1 font-code text-[10px] uppercase tracking-[0.28em] text-theme-ink-subtle sm:right-6 sm:top-6"
      >
        <span className="text-theme-accent-dim">BATCOMPUTER</span>
        <span className="tabular-nums text-theme-ink/70">v2.0.0-RC.1</span>
        <span className="tabular-nums text-theme-ink/40">build_0731</span>
      </div>

      {/* BOTTOM-LEFT: terminal line */}
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 font-code text-[10px] uppercase tracking-[0.3em] text-theme-accent sm:bottom-6 sm:left-6"
      >
        <span>&gt;_EXECUTE_PROTOCOL</span>
        <span
          className="u-flicker inline-block h-[1em] w-[0.5em] translate-y-[1px] bg-theme-accent"
        />
      </div>

      {/* BOTTOM-RIGHT: live clock */}
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-4 right-4 z-40 flex flex-col items-end gap-1 font-code text-[10px] uppercase tracking-[0.28em] text-theme-ink-subtle sm:bottom-6 sm:right-6"
      >
        <span className="tabular-nums">{clock}</span>
        <span className="text-theme-ink/40">cowl_engaged</span>
      </div>
    </>
  );
}
