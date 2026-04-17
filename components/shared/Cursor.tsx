'use client';

import { useEffect, useRef } from 'react';
import { registerGsap } from '@/lib/gsap';

/**
 * Dot + lagging ring cursor.
 * - Small solid dot tracks the mouse 1:1 (quickTo)
 * - Larger ring trails behind with eased quickTo
 * - Grows + inverts on interactive elements (a, button, [data-cursor-hover])
 * - mix-blend-mode: difference flips over light "paper" sections automatically
 * - Hidden on touch / reduced-motion
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const { gsap } = registerGsap();
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // initial off-screen
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const hover = t.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor-hover]',
      );
      if (hover) {
        ring.classList.add('is-hover');
        dot.classList.add('is-hover');
      } else {
        ring.classList.remove('is-hover');
        dot.classList.remove('is-hover');
      }
    };

    const onDown = () => {
      ring.classList.add('is-down');
    };
    const onUp = () => {
      ring.classList.remove('is-down');
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="u-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="u-cursor-dot" aria-hidden="true" />
    </>
  );
}
