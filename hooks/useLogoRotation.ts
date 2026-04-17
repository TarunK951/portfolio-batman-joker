'use client';

/**
 * useLogoRotation
 * ------------------------------------------------------------------
 * Single source of truth for the scroll-coupled "tyre-rim" rotation
 * applied to the persistent bat logo (see Wave 3 design doc §2.3).
 *
 * - Primary yaw is scrubbed from the document scroll position.
 *   720° total over the full scrollable range (two revolutions).
 * - When the user stops scrolling, a brief 1.2s "coast" continues
 *   the yaw at 0.01 rad/sec before easing to rest — gives the object
 *   the feel of a heavy wheel with residual momentum.
 * - Respects `prefers-reduced-motion: reduce` by pinning both axes.
 * - SSR-safe: all window/document access is guarded.
 *
 * Returned refs are mutated imperatively every frame by the hook.
 * Consumers read `.current` inside their own rAF / useFrame loop.
 */

import { useEffect, useRef, type MutableRefObject } from 'react';
import { registerGsap } from '@/lib/gsap';

export interface UseLogoRotation {
  yaw: MutableRefObject<number>;
  pitch: MutableRefObject<number>;
}

const COAST_DURATION_MS = 1200;
const COAST_RATE_DEG_PER_MS = (0.01 * 180) / Math.PI / 1000; // 0.01 rad/sec → deg/ms
const IDLE_DEBOUNCE_MS = 1200;

export function useLogoRotation(): UseLogoRotation {
  const yaw = useRef<number>(0);
  const pitch = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reduceMotion) {
      yaw.current = 0;
      pitch.current = 0;
      return;
    }

    const { ScrollTrigger } = registerGsap();

    let idleTimer: number | null = null;
    let coastRaf: number | null = null;
    let lastScrollYaw = 0;

    const startCoast = () => {
      const start = performance.now();
      const startYaw = yaw.current;
      const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);

      const step = (now: number) => {
        const elapsed = now - start;
        const tNorm = Math.min(1, elapsed / COAST_DURATION_MS);
        const envelope = 1 - easeOut(tNorm);
        const delta = COAST_RATE_DEG_PER_MS * elapsed * envelope;
        yaw.current = startYaw + delta;
        if (tNorm < 1) {
          coastRaf = window.requestAnimationFrame(step);
        } else {
          coastRaf = null;
        }
      };

      if (coastRaf !== null) window.cancelAnimationFrame(coastRaf);
      coastRaf = window.requestAnimationFrame(step);
    };

    const scheduleIdleCoast = () => {
      if (idleTimer !== null) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(startCoast, IDLE_DEBOUNCE_MS);
    };

    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      scrub: 1.2,
      onUpdate: (self) => {
        // 720° across full scroll range
        const next = self.progress * 720;
        yaw.current = next;
        lastScrollYaw = next;
        // Pitch is a gentle 15% amplitude of yaw for weight — keep bounded.
        pitch.current = Math.sin(self.progress * Math.PI * 2) * 6;
        if (coastRaf !== null) {
          window.cancelAnimationFrame(coastRaf);
          coastRaf = null;
        }
        scheduleIdleCoast();
      },
    });

    // Seed state so the first render has meaningful values.
    yaw.current = lastScrollYaw;

    return () => {
      trigger.kill();
      if (idleTimer !== null) window.clearTimeout(idleTimer);
      if (coastRaf !== null) window.cancelAnimationFrame(coastRaf);
    };
  }, []);

  return { yaw, pitch };
}
