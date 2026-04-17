'use client';

/**
 * ScrollProgressLine — fixed right-edge hairline indicator.
 * Fills from top to bottom based on scroll progress. Mounted once under
 * the futuristic theme gate. White with subtle opacity.
 */

import { useEffect, useRef } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';

export function ScrollProgressLine() {
  const { theme } = useTheme();
  const fillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (theme !== 'futuristic') return;
    let rafId = 0;
    const update = () => {
      const doc = document.documentElement;
      const max = (doc.scrollHeight || 1) - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleY(${p})`;
      }
      rafId = 0;
    };
    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [theme]);

  if (theme !== 'futuristic') return null;

  return (
    <div aria-hidden className="fx-scroll-progress">
      <div ref={fillRef} className="fx-scroll-progress__fill" />
    </div>
  );
}
