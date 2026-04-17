'use client';

import { useEffect, useRef } from 'react';

/**
 * Utopia Tokyo style custom cursor.
 * Center dot + 4 corner brackets that expand on hoverable elements.
 * Uses requestAnimationFrame + lerp for buttery follow.
 * Hidden on touch / coarse-pointer devices via CSS.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = ref.current;
    if (!el) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const tick = () => {
      x += (targetX - x) * 0.22;
      y += (targetY - y) * 0.22;
      el.style.transform = `translate3d(${String(x)}px, ${String(y)}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const hover = t.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor-hover]',
      );
      if (hover) el.classList.add('is-hover');
      else el.classList.remove('is-hover');
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="u-cursor" aria-hidden="true">
      <span className="u-cursor__corner tl" />
      <span className="u-cursor__corner tr" />
      <span className="u-cursor__corner bl" />
      <span className="u-cursor__corner br" />
      <span className="u-cursor__dot" />
    </div>
  );
}
