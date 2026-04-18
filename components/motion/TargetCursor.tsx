'use client';

import { useEffect, useRef } from 'react';
import { registerGsap } from '@/lib/gsap';

/**
 * TargetCursor — hand-written from the react-bits pattern.
 *
 * A small reticle (crosshair + four corner brackets) that:
 *  - Replaces the native cursor on hover-capable devices.
 *  - Follows `mousemove` via GSAP `quickTo` (smoother and cheaper than
 *    framer-motion springs for pixel-perfect cursor work — see
 *    docs/animation-timings.md).
 *  - Grows + snaps onto any element with `data-cursor="target"` or the
 *    `.cursor-target` class, using that element's bounding box so the
 *    reticle brackets hug the corners of the target.
 *  - Hides entirely on touch devices (`@media (hover: none)`).
 *  - Colour comes from the CSS token `--accent` (currently `#D72638`).
 *
 * The global native cursor is hidden via `html * { cursor: none !important }`
 * in `globals.css` (guarded by `@media (hover: hover) and (pointer: fine)`).
 */

type Target = HTMLElement;

export function TargetCursor() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Guard touch / coarse pointer — render nothing.
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mql.matches) {
      if (rootRef.current) rootRef.current.style.display = 'none';
      return;
    }

    const { gsap } = registerGsap();
    const root = rootRef.current;
    const dot = dotRef.current;
    if (!root || !dot) return;

    gsap.set(root, { xPercent: -50, yPercent: -50, x: 0, y: 0, opacity: 0 });
    gsap.set(dot, { xPercent: -50, yPercent: -50, x: 0, y: 0 });

    const xTo = gsap.quickTo(root, 'x', { duration: 0.28, ease: 'power3.out' });
    const yTo = gsap.quickTo(root, 'y', { duration: 0.28, ease: 'power3.out' });
    // Dot tracks 1:1 so the centre dot feels pinned to the real pointer.
    const xDot = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });

    let currentTarget: Target | null = null;
    let lastX = 0;
    let lastY = 0;

    const applyTargetRect = () => {
      if (!currentTarget || !root) return;
      const rect = currentTarget.getBoundingClientRect();
      // Snap reticle to the target's bbox — brackets hug corners.
      gsap.to(root, {
        width: rect.width + 16,
        height: rect.height + 16,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        duration: 0.35,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    const handleMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      xDot(lastX);
      yDot(lastY);
      if (currentTarget) {
        // While snapped, the reticle's size/pos is locked to the target —
        // we only move the centre dot.
        return;
      }
      xTo(lastX);
      yTo(lastY);
    };

    const handleEnter = () => {
      gsap.to(root, { opacity: 1, duration: 0.2 });
    };
    const handleLeave = () => {
      gsap.to(root, { opacity: 0, duration: 0.2 });
    };

    const isTarget = (el: Element | null): el is Target =>
      !!el &&
      el instanceof HTMLElement &&
      (el.dataset['cursor'] === 'target' || el.classList.contains('cursor-target'));

    const findTarget = (start: Element | null): Target | null => {
      let node: Element | null = start;
      while (node && node !== document.body) {
        if (isTarget(node)) return node;
        node = node.parentElement;
      }
      return null;
    };

    const handleOver = (e: MouseEvent) => {
      const t = findTarget(e.target as Element | null);
      if (t && t !== currentTarget) {
        currentTarget = t;
        root.dataset['snapped'] = 'true';
        applyTargetRect();
      }
    };
    const handleOut = (e: MouseEvent) => {
      const t = findTarget(e.relatedTarget as Element | null);
      if (!t && currentTarget) {
        currentTarget = null;
        delete root.dataset['snapped'];
        // Restore small reticle, re-attach to cursor position.
        gsap.to(root, {
          width: 28,
          height: 28,
          x: lastX,
          y: lastY,
          duration: 0.3,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    };

    const handleScrollOrResize = () => {
      if (currentTarget) applyTargetRect();
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseover', handleOver, { passive: true });
    window.addEventListener('mouseout', handleOut, { passive: true });
    document.addEventListener('mouseenter', handleEnter);
    document.addEventListener('mouseleave', handleLeave);
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize);

    // Prime opacity so the reticle appears on first move (avoids a flash at 0,0).
    const primer = (e: MouseEvent) => {
      gsap.set(root, { x: e.clientX, y: e.clientY, opacity: 1 });
      gsap.set(dot, { x: e.clientX, y: e.clientY });
      window.removeEventListener('mousemove', primer);
    };
    window.addEventListener('mousemove', primer, { once: true, passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
      window.removeEventListener('mouseout', handleOut);
      document.removeEventListener('mouseenter', handleEnter);
      document.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('mousemove', primer);
    };
  }, []);

  return (
    <>
      {/* Centre dot — 1:1 with real pointer */}
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 4,
          height: 4,
          borderRadius: 999,
          background: 'hsl(var(--accent))',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
        }}
      />
      {/* Reticle — crosshair + brackets. Sized via GSAP (default 28x28). */}
      <div
        ref={rootRef}
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 28,
          height: 28,
          pointerEvents: 'none',
          zIndex: 9998,
          willChange: 'transform, width, height',
          mixBlendMode: 'normal',
        }}
      >
        {/* Crosshair lines */}
        <span
          style={{
            position: 'absolute',
            top: '50%',
            left: '-6px',
            width: '12px',
            height: 1,
            background: 'hsl(var(--accent))',
            transform: 'translateY(-50%)',
          }}
        />
        <span
          style={{
            position: 'absolute',
            top: '50%',
            right: '-6px',
            width: '12px',
            height: 1,
            background: 'hsl(var(--accent))',
            transform: 'translateY(-50%)',
          }}
        />
        <span
          style={{
            position: 'absolute',
            left: '50%',
            top: '-6px',
            height: '12px',
            width: 1,
            background: 'hsl(var(--accent))',
            transform: 'translateX(-50%)',
          }}
        />
        <span
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '-6px',
            height: '12px',
            width: 1,
            background: 'hsl(var(--accent))',
            transform: 'translateX(-50%)',
          }}
        />

        {/* Corner brackets */}
        {([
          { corner: 'tl' },
          { corner: 'tr' },
          { corner: 'bl' },
          { corner: 'br' },
        ] as const).map(({ corner }) => {
          const base: React.CSSProperties = {
            position: 'absolute',
            width: 8,
            height: 8,
            borderColor: 'hsl(var(--accent))',
            borderStyle: 'solid',
            borderWidth: 0,
          };
          const style: React.CSSProperties = { ...base };
          if (corner === 'tl') {
            style.top = 0;
            style.left = 0;
            style.borderTopWidth = 1;
            style.borderLeftWidth = 1;
          } else if (corner === 'tr') {
            style.top = 0;
            style.right = 0;
            style.borderTopWidth = 1;
            style.borderRightWidth = 1;
          } else if (corner === 'bl') {
            style.bottom = 0;
            style.left = 0;
            style.borderBottomWidth = 1;
            style.borderLeftWidth = 1;
          } else {
            style.bottom = 0;
            style.right = 0;
            style.borderBottomWidth = 1;
            style.borderRightWidth = 1;
          }
          return <span key={corner} style={style} />;
        })}
      </div>
    </>
  );
}
