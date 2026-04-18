'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { registerGsap } from '@/lib/gsap';

type Stop = {
  /** CSS selector (scoped to this wrapper) that, when entered, applies `color`. */
  selector: string;
  /** Any CSS color — usually `hsl(var(--bg))` or a tone shift. */
  color: string;
};

type BackgroundColorMorphProps = {
  children: ReactNode;
  stops: Stop[];
  /** Optional initial background — defaults to the theme bg. */
  initial?: string;
  className?: string;
};

/**
 * Morphs the wrapper's background color between tones as each matching
 * section enters the viewport. Uses ScrollTrigger onEnter / onEnterBack so
 * the change is durable in both scroll directions.
 */
export function BackgroundColorMorph({
  children,
  stops,
  initial = 'hsl(var(--bg))',
  className,
}: BackgroundColorMorphProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const { gsap, ScrollTrigger } = registerGsap();

    const ctx = gsap.context(() => {
      const triggers: ScrollTrigger[] = [];
      stops.forEach((stop) => {
        const targets = wrap.querySelectorAll(stop.selector);
        targets.forEach((target) => {
          const st = ScrollTrigger.create({
            trigger: target,
            start: 'top 60%',
            end: 'bottom 40%',
            onEnter: () => {
              gsap.to(wrap, {
                backgroundColor: stop.color,
                duration: 0.8,
                ease: 'power2.out',
              });
            },
            onEnterBack: () => {
              gsap.to(wrap, {
                backgroundColor: stop.color,
                duration: 0.8,
                ease: 'power2.out',
              });
            },
          });
          triggers.push(st);
        });
      });

      return () => {
        triggers.forEach((st) => st.kill());
      };
    }, wrap);

    return () => ctx.revert();
  }, [stops]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ backgroundColor: initial, transition: 'background-color 800ms cubic-bezier(.2,.8,.2,1)' }}
    >
      {children}
    </div>
  );
}
