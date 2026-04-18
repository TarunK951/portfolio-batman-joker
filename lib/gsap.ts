'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function registerGsap() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

/**
 * Scoped gsap.context hook.
 *
 * Usage:
 *   const ref = useGsapScope<HTMLDivElement>((ctx, { gsap }) => {
 *     gsap.from('.reveal', { y: 20, opacity: 0, stagger: 0.08 });
 *   });
 *   return <div ref={ref}>...</div>;
 *
 * The callback runs inside a gsap.context bound to the returned ref's node.
 * Cleanup is automatic via ctx.revert() — ScrollTriggers created inside the
 * callback are killed with the context.
 *
 * The callback identity is NOT tracked. This hook runs once per mount so that
 * ScrollTrigger positions are stable. If you need reactive animations, read
 * fresh values from a ref inside the callback.
 */
export function useGsapScope<T extends HTMLElement>(
  callback: (
    ctx: gsap.Context,
    tools: { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger },
  ) => void,
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const tools = registerGsap();
    const ctx = tools.gsap.context((self) => {
      callback(self, tools);
    }, node);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
