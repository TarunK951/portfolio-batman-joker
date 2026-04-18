'use client';

import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { registerGsap } from '@/lib/gsap';

type RevealOnScrollProps = {
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
  delay?: number;
  y?: number;
  duration?: number;
  start?: string;
  once?: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * Fades + translates children into view when the element enters the viewport.
 * Uses GSAP ScrollTrigger, scoped via gsap.context for correct teardown.
 */
export function RevealOnScroll({
  children,
  as = 'div',
  delay = 0,
  y = 32,
  duration = 0.9,
  start = 'top 82%',
  once = true,
  className,
  style,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const { gsap } = registerGsap();
    const ctx = gsap.context(() => {
      gsap.set(node, { opacity: 0, y, force3D: true });
      gsap.to(node, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: 'power2.out',
        force3D: true,
        scrollTrigger: {
          trigger: node,
          start,
          toggleActions: once ? 'play none none none' : 'play reverse play reverse',
        },
      });
    }, node);
    return () => ctx.revert();
  }, [delay, y, duration, start, once]);

  return createElement(
    as,
    {
      ref: ref as React.Ref<HTMLElement>,
      className,
      style,
    },
    children,
  );
}
