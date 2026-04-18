'use client';

/**
 * DepthText
 * ------------------------------------------------------------------
 * Stacked text-shadow layers produce a blocky extruded look — like
 * the distressed BATMAN title in classic comic covers.
 */

import type { CSSProperties, ReactNode } from 'react';
import { useTheme, type Theme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/cn';

interface DepthTextProps {
  children: ReactNode;
  layers?: number;
  color?: string;
  shadowColor?: string;
  className?: string;
  style?: CSSProperties;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
}

const THEME_DEFAULTS: Record<Theme, { color: string; shadow: string }> = {
  batman: { color: '#e8e8e8', shadow: '#ff1919' },
  'ancient-india': { color: '#14120f', shadow: '#8a1a1a' },
};

export function DepthText({
  children,
  layers = 6,
  color,
  shadowColor,
  className,
  style,
  as = 'span',
}: DepthTextProps) {
  const { theme } = useTheme();
  const defaults = THEME_DEFAULTS[theme];
  const finalColor = color ?? defaults.color;
  const finalShadow = shadowColor ?? defaults.shadow;

  // Build N stacked shadows, 2px offset each, x = y for a diagonal extrude.
  const shadows: string[] = [];
  for (let i = 1; i <= layers; i += 1) {
    const offset = i * 2;
    // Alternate shadow color between accent and a darker fade for depth
    const isAccentLayer = i <= Math.ceil(layers / 2);
    const col = isAccentLayer
      ? finalShadow
      : // darken accent via alpha composite → semi-transparent layers
        `${finalShadow}${Math.max(20, 100 - i * 12).toString(16).padStart(2, '0')}`;
    shadows.push(`${offset}px ${offset}px 0 ${col}`);
  }

  const Tag = as;
  return (
    <Tag
      className={cn('depth-text', className)}
      style={{
        color: finalColor,
        textShadow: shadows.join(', '),
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
