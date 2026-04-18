'use client';

import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { registerGsap } from '@/lib/gsap';

type ParallaxLayerProps = {
  children: ReactNode;
  speed?: number; // -1..1 — negative moves up slower than scroll
  className?: string;
  style?: CSSProperties;
  as?: keyof JSX.IntrinsicElements;
};

/**
 * ScrollTrigger-driven translateY. `speed` is the multiplier applied to the
 * element's scroll distance through its own viewport span.
 *
 *   speed = -0.3  -> drifts upward by 30% of its own height across its span
 *   speed =  0.4  -> settles downward by 40% as user scrolls through it
 */
export function ParallaxLayer({
  children,
  speed = -0.3,
  className,
  style,
  as = 'div',
}: ParallaxLayerProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const { gsap } = registerGsap();
    const ctx = gsap.context(() => {
      gsap.to(node, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: node,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, node);
    return () => ctx.revert();
  }, [speed]);

  return createElement(
    as,
    {
      ref: ref as React.Ref<HTMLElement>,
      className,
      style: { willChange: 'transform', ...style },
    },
    children,
  );
}
