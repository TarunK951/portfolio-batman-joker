'use client';

/**
 * GlassCard
 * ------------------------------------------------------------------
 * Glassmorphism wrapper: backdrop-blur, hairline border, theme-aware
 * accent glow on hover. Ideal for project cards, stat panels, etc.
 */

import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Disables hover glow — useful when the card is static. */
  interactive?: boolean;
  as?: 'div' | 'article' | 'section' | 'li';
}

export function GlassCard({
  children,
  className,
  style,
  interactive = true,
  as = 'div',
}: GlassCardProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        'glass-card',
        interactive && 'glass-card--interactive',
        className,
      )}
      style={style}
    >
      {children}
    </Tag>
  );
}
