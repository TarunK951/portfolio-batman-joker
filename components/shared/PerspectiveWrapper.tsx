'use client';

/**
 * PerspectiveWrapper
 * ------------------------------------------------------------------
 * CSS 3D tilt container. Reads mouse position relative to the wrapper,
 * clamps to ±`maxDeg` degrees, smooths with lerp on requestAnimationFrame.
 */

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';

interface PerspectiveWrapperProps {
  children: ReactNode;
  maxDeg?: number;
  perspective?: number;
  className?: string;
  style?: CSSProperties;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function PerspectiveWrapper({
  children,
  maxDeg = 8,
  perspective = 1200,
  className,
  style,
}: PerspectiveWrapperProps) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const r = outer.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      target.x = -py * maxDeg * 2;
      target.y = px * maxDeg * 2;
    };

    const onLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    const tick = () => {
      current.x = lerp(current.x, target.x, 0.08);
      current.y = lerp(current.y, target.y, 0.08);
      inner.style.transform = `perspective(${perspective}px) rotateX(${current.x.toFixed(
        3,
      )}deg) rotateY(${current.y.toFixed(3)}deg)`;
      raf = window.requestAnimationFrame(tick);
    };

    outer.addEventListener('mousemove', onMove);
    outer.addEventListener('mouseleave', onLeave);
    raf = window.requestAnimationFrame(tick);

    return () => {
      outer.removeEventListener('mousemove', onMove);
      outer.removeEventListener('mouseleave', onLeave);
      window.cancelAnimationFrame(raf);
    };
  }, [maxDeg, perspective]);

  return (
    <div
      ref={outerRef}
      className={cn('perspective-wrapper', className)}
      style={{ perspective: `${perspective}px`, ...style }}
    >
      <div
        ref={innerRef}
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}
