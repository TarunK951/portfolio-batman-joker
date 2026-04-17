'use client';

import { useEffect, useRef, useState, type ElementType } from 'react';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  trigger?: 'hover' | 'mount' | 'inview';
  duration?: number;
};

/**
 * Utopia-style text scramble effect.
 * Resolves characters left-to-right with random glyphs in flight.
 */
export function ScrambleText({
  text,
  as,
  className,
  trigger = 'hover',
  duration = 600,
}: Props) {
  const Tag = (as ?? 'span') as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [display, setDisplay] = useState(text);
  const rafRef = useRef<number>(0);

  const run = () => {
    const start = performance.now();
    const total = text.length;
    cancelAnimationFrame(rafRef.current);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const resolved = Math.floor(t * total);
      let out = '';
      for (let i = 0; i < total; i++) {
        if (i < resolved) {
          out += text[i] ?? '';
        } else if (text[i] === ' ') {
          out += ' ';
        } else {
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? '';
        }
      }
      setDisplay(out);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else setDisplay(text);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (trigger === 'mount') run();
    if (trigger === 'inview') {
      const node = ref.current;
      if (!node) return;
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) if (e.isIntersecting) run();
        },
        { threshold: 0.4 },
      );
      io.observe(node);
      return () => io.disconnect();
    }
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, trigger]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <Tag
      ref={ref}
      className={className}
      onMouseEnter={trigger === 'hover' ? run : undefined}
      onFocus={trigger === 'hover' ? run : undefined}
      data-cursor-hover
    >
      {display}
    </Tag>
  );
}
