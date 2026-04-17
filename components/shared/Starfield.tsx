'use client';

/**
 * Starfield — fixed layer of small white dots drifting slowly.
 * Pure CSS, no WebGL. Renders nothing outside the futuristic theme.
 */

import { useMemo } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';

interface Star {
  left: number;
  top: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
  driftX: number;
  driftY: number;
}

export function Starfield({ count = 80 }: { count?: number }) {
  const { theme } = useTheme();
  const stars = useMemo<Star[]>(() => {
    const out: Star[] = [];
    for (let i = 0; i < count; i += 1) {
      out.push({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 1.8,
        opacity: 0.25 + Math.random() * 0.55,
        delay: Math.random() * -30,
        duration: 28 + Math.random() * 40,
        driftX: (Math.random() - 0.5) * 40,
        driftY: (Math.random() - 0.5) * 40,
      });
    }
    return out;
  }, [count]);

  if (theme !== 'futuristic') return null;

  return (
    <div aria-hidden className="fx-starfield">
      {stars.map((s, i) => (
        <span
          key={i}
          className="fx-star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            // CSS vars read by keyframes
            ['--fx-dx' as string]: `${s.driftX}px`,
            ['--fx-dy' as string]: `${s.driftY}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
