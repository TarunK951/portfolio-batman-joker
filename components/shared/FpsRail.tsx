'use client';

/**
 * FpsRail
 * ------------------------------------------------------------------
 * Decorative left-edge vertical mono readout. Under ancient-india
 * theme only. Reads live window.scrollY for the TOP: value. FPS is
 * cosmetic (approximated from rAF deltas).
 */

import { useEffect, useState } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';

export function FpsRail() {
  const { theme } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    if (theme !== 'ancient-india') return;
    let raf = 0;
    let last = performance.now();
    let frames = 0;
    let acc = 0;

    const onScroll = () => setScrollY(Math.round(window.scrollY));

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      acc += dt;
      frames += 1;
      if (acc >= 500) {
        setFps(Math.min(120, Math.round((frames * 1000) / acc)));
        frames = 0;
        acc = 0;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [theme]);

  if (theme !== 'ancient-india') return null;

  return (
    <div aria-hidden className="ai-fps-rail u-mono">
      <span>FPS: {fps}</span>
      <span className="ai-fps-rail__divider">/</span>
      <span>TOP: {scrollY} PX</span>
    </div>
  );
}
