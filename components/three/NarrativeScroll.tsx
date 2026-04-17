'use client';

/**
 * NarrativeScroll
 * ------------------------------------------------------------------
 * Wraps a section and emits scroll progress (0→1) from section
 * top→bottom via a render prop. Thin wrapper over GSAP ScrollTrigger.
 *
 * Usage:
 *   <NarrativeScroll>
 *     {(progress) => <div style={{ opacity: progress }} />}
 *   </NarrativeScroll>
 */

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { registerGsap } from '@/lib/gsap';

interface NarrativeScrollProps {
  children: (progress: number) => ReactNode;
  start?: string;
  end?: string;
  className?: string;
  style?: CSSProperties;
}

export function NarrativeScroll({
  children,
  start = 'top bottom',
  end = 'bottom top',
  className,
  style,
}: NarrativeScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const { ScrollTrigger } = registerGsap();

    const st = ScrollTrigger.create({
      trigger: node,
      start,
      end,
      scrub: true,
      onUpdate: (self) => setProgress(self.progress),
    });

    return () => {
      st.kill();
    };
  }, [start, end]);

  return (
    <div ref={ref} className={className} style={style}>
      {children(progress)}
    </div>
  );
}
