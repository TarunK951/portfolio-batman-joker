'use client';

import type { CSSProperties, ReactNode } from 'react';

/**
 * Four absolute-positioned L-brackets that decorate the corners of a slot.
 * Wrap any element with <CornerReticle>...</CornerReticle> — children render
 * inside a relative container, the four brackets float above (pointer-events: none).
 */
export function CornerReticle({
  children,
  inset = 12,
  size = 32,
  stroke = 1,
  color = 'hsl(var(--accent))',
  className = '',
}: {
  children?: ReactNode;
  inset?: number;
  size?: number;
  stroke?: number;
  color?: string;
  className?: string;
}) {
  const common: CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    pointerEvents: 'none',
  };

  const arm = (horizontal: CSSProperties, vertical: CSSProperties): CSSProperties => ({
    position: 'absolute',
    background: color,
    ...horizontal,
    ...vertical,
  });

  return (
    <div className={`relative ${className}`}>
      {children}
      {/* TL */}
      <span style={{ ...common, top: inset, left: inset }} aria-hidden>
        <span style={arm({ left: 0, width: size, height: stroke }, { top: 0 })} />
        <span style={arm({ left: 0, width: stroke, height: size }, { top: 0 })} />
      </span>
      {/* TR */}
      <span style={{ ...common, top: inset, right: inset }} aria-hidden>
        <span style={arm({ right: 0, width: size, height: stroke }, { top: 0 })} />
        <span style={arm({ right: 0, width: stroke, height: size }, { top: 0 })} />
      </span>
      {/* BL */}
      <span style={{ ...common, bottom: inset, left: inset }} aria-hidden>
        <span style={arm({ left: 0, width: size, height: stroke }, { bottom: 0 })} />
        <span style={arm({ left: 0, width: stroke, height: size }, { bottom: 0 })} />
      </span>
      {/* BR */}
      <span style={{ ...common, bottom: inset, right: inset }} aria-hidden>
        <span style={arm({ right: 0, width: size, height: stroke }, { bottom: 0 })} />
        <span style={arm({ right: 0, width: stroke, height: size }, { bottom: 0 })} />
      </span>
    </div>
  );
}
