'use client';

import { useEffect, useRef } from 'react';
import { registerGsap } from '@/lib/gsap';

/**
 * TargetCursor — reticle that always tracks the real pointer 1:1.
 * On hover over `[data-cursor="target"]` / `.cursor-target` it scales up
 * and brightens, but position stays locked to the mouse so the centre dot
 * and the brackets never separate.
 */

export function TargetCursor() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mql.matches) {
      if (rootRef.current) rootRef.current.style.display = 'none';
      if (dotRef.current) dotRef.current.style.display = 'none';
      return;
    }

    const { gsap } = registerGsap();
    const root = rootRef.current;
    const dot = dotRef.current;
    if (!root || !dot) return;

    gsap.set(root, { xPercent: -50, yPercent: -50, x: 0, y: 0, opacity: 0 });
    gsap.set(dot, { xPercent: -50, yPercent: -50, x: 0, y: 0, opacity: 0 });

    // Tight follow so reticle + dot track pointer without perceptible lag.
    const xTo = gsap.quickTo(root, 'x', { duration: 0.12, ease: 'power3.out' });
    const yTo = gsap.quickTo(root, 'y', { duration: 0.12, ease: 'power3.out' });
    const xDot = gsap.quickTo(dot, 'x', { duration: 0.05, ease: 'power2.out' });
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.05, ease: 'power2.out' });

    const handleMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xDot(e.clientX);
      yDot(e.clientY);
    };

    const isTarget = (el: Element | null): boolean => {
      let node: Element | null = el;
      while (node && node !== document.body) {
        if (
          node instanceof HTMLElement &&
          (node.dataset['cursor'] === 'target' || node.classList.contains('cursor-target'))
        ) {
          return true;
        }
        node = node.parentElement;
      }
      return false;
    };

    const handleOver = (e: MouseEvent) => {
      if (isTarget(e.target as Element | null)) {
        gsap.to(root, { scale: 1.8, duration: 0.25, ease: 'power3.out', overwrite: 'auto' });
        root.dataset['snapped'] = 'true';
      }
    };
    const handleOut = (e: MouseEvent) => {
      if (!isTarget(e.relatedTarget as Element | null)) {
        gsap.to(root, { scale: 1, duration: 0.25, ease: 'power3.out', overwrite: 'auto' });
        delete root.dataset['snapped'];
      }
    };

    const handleDocEnter = () => {
      gsap.to([root, dot], { opacity: 1, duration: 0.2 });
    };
    const handleDocLeave = () => {
      gsap.to([root, dot], { opacity: 0, duration: 0.2 });
    };

    const primer = (e: MouseEvent) => {
      gsap.set(root, { x: e.clientX, y: e.clientY, opacity: 1 });
      gsap.set(dot, { x: e.clientX, y: e.clientY, opacity: 1 });
      window.removeEventListener('mousemove', primer);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseover', handleOver, { passive: true });
    window.addEventListener('mouseout', handleOut, { passive: true });
    document.addEventListener('mouseenter', handleDocEnter);
    document.addEventListener('mouseleave', handleDocLeave);
    window.addEventListener('mousemove', primer, { once: true, passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
      window.removeEventListener('mouseout', handleOut);
      document.removeEventListener('mouseenter', handleDocEnter);
      document.removeEventListener('mouseleave', handleDocLeave);
      window.removeEventListener('mousemove', primer);
    };
  }, []);

  return (
    <>
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
          willChange: 'transform',
        }}
      >
        <span style={{ position: 'absolute', top: '50%', left: '-6px', width: 12, height: 1, background: 'hsl(var(--accent))', transform: 'translateY(-50%)' }} />
        <span style={{ position: 'absolute', top: '50%', right: '-6px', width: 12, height: 1, background: 'hsl(var(--accent))', transform: 'translateY(-50%)' }} />
        <span style={{ position: 'absolute', left: '50%', top: '-6px', height: 12, width: 1, background: 'hsl(var(--accent))', transform: 'translateX(-50%)' }} />
        <span style={{ position: 'absolute', left: '50%', bottom: '-6px', height: 12, width: 1, background: 'hsl(var(--accent))', transform: 'translateX(-50%)' }} />
        {([
          { corner: 'tl' },
          { corner: 'tr' },
          { corner: 'bl' },
          { corner: 'br' },
        ] as const).map(({ corner }) => {
          const style: React.CSSProperties = {
            position: 'absolute',
            width: 8,
            height: 8,
            borderColor: 'hsl(var(--accent))',
            borderStyle: 'solid',
            borderWidth: 0,
          };
          if (corner === 'tl') { style.top = 0; style.left = 0; style.borderTopWidth = 1; style.borderLeftWidth = 1; }
          else if (corner === 'tr') { style.top = 0; style.right = 0; style.borderTopWidth = 1; style.borderRightWidth = 1; }
          else if (corner === 'bl') { style.bottom = 0; style.left = 0; style.borderBottomWidth = 1; style.borderLeftWidth = 1; }
          else { style.bottom = 0; style.right = 0; style.borderBottomWidth = 1; style.borderRightWidth = 1; }
          return <span key={corner} style={style} />;
        })}
      </div>
    </>
  );
}
