'use client';

import { useMemo, type CSSProperties, type ReactNode } from 'react';

type MarqueeProps = {
  children: ReactNode;
  speed?: number; // seconds for one full loop
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
};

/**
 * Pure-CSS infinite horizontal marquee. Duplicates `children` once so the
 * track can loop seamlessly via translateX 0 -> -50%.
 */
export function Marquee({
  children,
  speed = 32,
  direction = 'left',
  pauseOnHover = true,
  className,
  style,
  ariaLabel,
}: MarqueeProps) {
  const trackStyle = useMemo<CSSProperties>(
    () => ({
      animationDuration: `${speed}s`,
      animationDirection: direction === 'left' ? 'normal' : 'reverse',
    }),
    [speed, direction],
  );

  return (
    <div
      className={className}
      style={{ overflow: 'hidden', width: '100%', ...style }}
      role={ariaLabel ? 'marquee' : undefined}
      aria-label={ariaLabel}
      data-pause-on-hover={pauseOnHover ? 'true' : undefined}
    >
      <div
        className="u-marquee-track"
        style={trackStyle}
        onMouseEnter={(e) => {
          if (!pauseOnHover) return;
          (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused';
        }}
        onMouseLeave={(e) => {
          if (!pauseOnHover) return;
          (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running';
        }}
      >
        <div style={{ display: 'flex', flexShrink: 0 }}>{children}</div>
        <div style={{ display: 'flex', flexShrink: 0 }} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
