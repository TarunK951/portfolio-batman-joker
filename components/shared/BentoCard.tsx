'use client';

/**
 * BentoCard
 * ------------------------------------------------------------------
 * Rounded thin-border card used to compose the ancient-india bento
 * grid. `size` affects grid-span on md+ screens. Accent variant uses
 * accent-soft as background.
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BentoSize = 'sm' | 'md' | 'lg' | 'wide' | 'tall';

interface BentoCardProps {
  size?: BentoSize;
  variant?: 'paper' | 'accent' | 'ink';
  className?: string;
  children: ReactNode;
  as?: 'div' | 'button' | 'article';
  onClick?: () => void;
  ariaLabel?: string;
  active?: boolean;
}

const SIZE_CLASS: Record<BentoSize, string> = {
  sm: 'md:col-span-1 md:row-span-1',
  md: 'md:col-span-2 md:row-span-1',
  lg: 'md:col-span-2 md:row-span-2',
  wide: 'md:col-span-3 md:row-span-1',
  tall: 'md:col-span-1 md:row-span-2',
};

export function BentoCard({
  size = 'sm',
  variant = 'paper',
  className,
  children,
  as = 'div',
  onClick,
  ariaLabel,
  active = false,
}: BentoCardProps) {
  const variantClass =
    variant === 'accent'
      ? 'ai-bento-card--accent'
      : variant === 'ink'
      ? 'ai-bento-card--ink'
      : 'ai-bento-card--paper';

  const commonClass = cn(
    'ai-bento-card',
    variantClass,
    SIZE_CLASS[size],
    active && 'ai-bento-card--active',
    className,
  );

  if (as === 'button' || onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        aria-pressed={onClick ? active : undefined}
        data-cursor-hover="true"
        className={commonClass}
      >
        {children}
      </button>
    );
  }
  if (as === 'article') {
    return (
      <article aria-label={ariaLabel} className={commonClass}>
        {children}
      </article>
    );
  }
  return (
    <div aria-label={ariaLabel} className={commonClass}>
      {children}
    </div>
  );
}
