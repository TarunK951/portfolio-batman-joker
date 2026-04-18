'use client';

import { createElement, useEffect, useRef, useState, type CSSProperties } from 'react';
import { registerGsap } from '@/lib/gsap';

const GLYPHS = '!<>-_\\/[]{}=+*^?#@%&ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function pickGlyph(): string {
  const i = Math.floor(Math.random() * GLYPHS.length);
  return GLYPHS[i] ?? 'X';
}

type ScrambleTextProps = {
  text: string;
  trigger?: 'mount' | 'scroll';
  tickMs?: number;
  revealStepMs?: number;
  start?: string;
  className?: string;
  style?: CSSProperties;
  as?: keyof JSX.IntrinsicElements;
};

/**
 * Reveals `text` by cycling random glyphs and resolving the real character
 * left-to-right. No GSAP text plugin dependency.
 *
 * - tickMs: interval between glyph swaps (default 40ms)
 * - revealStepMs: time between each character becoming "resolved" (default 55ms)
 */
export function ScrambleText({
  text,
  trigger = 'mount',
  tickMs = 40,
  revealStepMs = 55,
  start = 'top 85%',
  className,
  style,
  as = 'span',
}: ScrambleTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [display, setDisplay] = useState<string>(() => text.replace(/[^\s]/g, ' '));
  const resolvedCountRef = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let tickId: number | null = null;
    let revealId: number | null = null;
    let done = false;
    resolvedCountRef.current = 0;

    const run = () => {
      if (tickId !== null) return;
      tickId = window.setInterval(() => {
        if (done) return;
        const resolved = resolvedCountRef.current;
        const chars = new Array(text.length);
        for (let i = 0; i < text.length; i++) {
          const real = text[i] ?? '';
          if (i < resolved || real === ' ') {
            chars[i] = real;
          } else {
            chars[i] = pickGlyph();
          }
        }
        setDisplay(chars.join(''));
      }, tickMs);

      revealId = window.setInterval(() => {
        if (resolvedCountRef.current >= text.length) {
          done = true;
          if (tickId !== null) {
            window.clearInterval(tickId);
            tickId = null;
          }
          if (revealId !== null) {
            window.clearInterval(revealId);
            revealId = null;
          }
          setDisplay(text);
          return;
        }
        resolvedCountRef.current += 1;
      }, revealStepMs);
    };

    if (trigger === 'mount') {
      run();
      return () => {
        done = true;
        if (tickId !== null) window.clearInterval(tickId);
        if (revealId !== null) window.clearInterval(revealId);
      };
    }

    const { ScrollTrigger } = registerGsap();
    const st = ScrollTrigger.create({
      trigger: node,
      start,
      once: true,
      onEnter: run,
    });

    return () => {
      done = true;
      if (tickId !== null) window.clearInterval(tickId);
      if (revealId !== null) window.clearInterval(revealId);
      st.kill();
    };
  }, [text, trigger, tickMs, revealStepMs, start]);

  return createElement(
    as,
    {
      ref: ref as React.Ref<HTMLElement>,
      className,
      style,
      'aria-label': text,
    },
    display,
  );
}
