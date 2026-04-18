'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { registerGsap } from '@/lib/gsap';

/**
 * Mounts Lenis + syncs with GSAP ScrollTrigger.
 *
 * - Registers a `lenis.on('scroll', ScrollTrigger.update)` subscription.
 * - Drives `lenis.raf(time * 1000)` from `gsap.ticker.add`.
 * - Disables itself entirely under `prefers-reduced-motion: reduce`.
 * - Refreshes ScrollTrigger once fonts/images finish loading to avoid
 *   triggers being computed against pre-layout heights.
 *
 * Safe to mount alongside the legacy `components/shared/SmoothScroll` helper
 * during the transition — both guard against reduced-motion and clean up on
 * unmount. Prefer this Provider in new code.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const { gsap, ScrollTrigger } = registerGsap();

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      smoothWheel: true,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState === 'complete') {
      requestAnimationFrame(onLoad);
    } else {
      window.addEventListener('load', onLoad, { once: true });
    }

    return () => {
      window.removeEventListener('load', onLoad);
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
