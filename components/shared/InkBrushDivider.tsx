'use client';

/**
 * InkBrushDivider
 * ------------------------------------------------------------------
 * SVG hand-drawn stroke divider with tapered ends and slight tremor.
 * Uses `currentColor` so it inherits `text-theme-accent` etc.
 */

import { cn } from '@/lib/cn';

interface InkBrushDividerProps {
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export function InkBrushDivider({
  direction = 'horizontal',
  className,
}: InkBrushDividerProps) {
  if (direction === 'vertical') {
    return (
      <svg
        aria-hidden
        viewBox="0 0 14 1200"
        preserveAspectRatio="none"
        className={cn('ink-brush-svg', className)}
        style={{ display: 'block', width: '14px', height: '100%' }}
      >
        <path
          d="M7 2 Q 2 120, 7 260 T 6 540 T 8 820 T 6 1100 L 7 1198"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.75"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 14"
      preserveAspectRatio="none"
      className={cn('ink-brush-svg', className)}
      style={{ display: 'block', width: '100%', height: '14px' }}
    >
      <path
        d="M2 7 Q 120 2, 260 7 T 540 7 T 820 8 T 1100 6 L 1198 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}
