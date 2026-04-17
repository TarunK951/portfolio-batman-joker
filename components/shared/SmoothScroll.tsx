'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { registerGsap } from '@/lib/gsap';

/**
 * Lenis smooth scroll wired into GSAP's ScrollTrigger.
 * Mount once in the root. Disabled on reduced-motion.
 */
export function SmoothScroll() {
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

    // Recompute triggers once fonts + images finish loading — prevents start
    // positions from being computed against pre-layout heights.
    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState === 'complete') {
      requestAnimationFrame(onLoad);
    } else {
      window.addEventListener('load', onLoad, { once: true });
    }

    // Expose for debugging / other components
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      window.removeEventListener('load', onLoad);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return null;
}
