'use client';

/**
 * UnrollText
 * ------------------------------------------------------------------
 * Char-splitting headline reveal. Splits the text into spans and
 * staggers a y/rotationZ reveal using GSAP. Stable against SSR —
 * the raw text is rendered server-side inside a sr-only copy.
 */

import { createElement, useEffect, useRef } from 'react';
import { registerGsap } from '@/lib/gsap';
import { cn } from '@/lib/cn';

interface UnrollTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  /** Delay in seconds before the reveal begins */
  delay?: number;
  /** Stagger between chars in seconds */
  stagger?: number;
  /** Fire reveal on scroll-in rather than mount */
  onScroll?: boolean;
}

export function UnrollText({
  text,
  as = 'span',
  className,
  delay = 0,
  stagger = 0.035,
  onScroll = false,
}: UnrollTextProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const setRef = (el: HTMLElement | null) => {
    rootRef.current = el;
  };

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = rootRef.current;
    if (!node) return;
    const chars = node.querySelectorAll<HTMLElement>('[data-char]');
    if (!chars.length) return;

    const ctx = gsap.context(() => {
      gsap.set(chars, { y: 14, opacity: 0, rotationZ: -8, force3D: true });
      const anim = {
        y: 0,
        opacity: 1,
        rotationZ: 0,
        duration: 0.9,
        ease: 'power2.out',
        stagger,
        delay,
        force3D: true,
      } as const;
      if (onScroll) {
        gsap.to(chars, {
          ...anim,
          scrollTrigger: { trigger: node, start: 'top 85%', once: true },
        });
      } else {
        gsap.to(chars, anim);
      }
    }, node);
    return () => ctx.revert();
  }, [delay, stagger, onScroll, text]);

  const words = text.split(' ');

  const children = words.map((word, wi) => (
    <span key={`${word}-${wi}`} className="ai-unroll__word" aria-hidden>
      {word.split('').map((ch, ci) => (
        <span
          key={`${ch}-${ci}`}
          data-char
          className="ai-unroll__char"
          style={{ display: 'inline-block', willChange: 'transform' }}
        >
          {ch}
        </span>
      ))}
      {wi < words.length - 1 ? (
        <span className="ai-unroll__space" aria-hidden>
          &nbsp;
        </span>
      ) : null}
    </span>
  ));

  return createElement(
    as,
    {
      ref: setRef,
      className: cn('ai-unroll', className),
      'aria-label': text,
    },
    children,
  );
}
