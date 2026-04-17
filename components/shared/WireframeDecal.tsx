'use client';

import type { CSSProperties } from 'react';

type Variant = 'triangle' | 'arrow' | 'ring' | 'diamond';

/**
 * Thin red wireframe SVG decal overlays used under/over oversize stencil
 * titles. Adopts the "demon" DNA of the utopiatokyo batman reference.
 */
export function WireframeDecal({
  variant,
  stroke = 'hsl(var(--accent))',
  strokeWidth = 1,
  opacity = 0.5,
  className = '',
  style,
}: {
  variant: Variant;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const common = {
    fill: 'none' as const,
    stroke,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    vectorEffect: 'non-scaling-stroke' as const,
  };

  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ opacity, ...style }}
      preserveAspectRatio="none"
    >
      {variant === 'triangle' && (
        <>
          <polygon points="100,20 180,170 20,170" {...common} />
          <line x1="100" y1="20" x2="100" y2="170" {...common} />
        </>
      )}
      {variant === 'arrow' && (
        <>
          <line x1="10" y1="100" x2="180" y2="100" {...common} />
          <polyline points="140,60 180,100 140,140" {...common} />
        </>
      )}
      {variant === 'ring' && (
        <>
          <circle cx="100" cy="100" r="82" {...common} />
          <circle cx="100" cy="100" r="52" {...common} />
          <line x1="100" y1="8" x2="100" y2="192" {...common} />
        </>
      )}
      {variant === 'diamond' && (
        <>
          <polygon points="100,20 180,100 100,180 20,100" {...common} />
          <polygon points="100,55 145,100 100,145 55,100" {...common} />
        </>
      )}
    </svg>
  );
}
