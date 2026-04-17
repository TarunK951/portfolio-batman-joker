'use client';

import type { ReactNode } from 'react';

/**
 * Bracketed mono HUD label pill — `[ 01 / intro ]` or counter pair `0737 : 0496`.
 * variant='bracket' wraps children in `[ … ]`.
 * variant='counter' renders children as a tabular-nums counter pair.
 */
export function HudChip({
  children,
  variant = 'bracket',
  className = '',
  accent = false,
}: {
  children: ReactNode;
  variant?: 'bracket' | 'counter';
  className?: string;
  accent?: boolean;
}) {
  const base =
    'u-mono inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] leading-none';
  const tone = accent ? 'text-theme-accent' : 'text-theme-ink/70';

  if (variant === 'counter') {
    return (
      <span
        className={`${base} ${tone} ${className}`}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`${base} ${tone} ${className}`}
      style={{
        border: '1px solid hsl(var(--accent) / 0.45)',
        padding: '6px 10px',
        color: accent ? 'hsl(var(--accent))' : undefined,
      }}
    >
      <span aria-hidden style={{ color: 'hsl(var(--accent))' }}>[</span>
      <span>{children}</span>
      <span aria-hidden style={{ color: 'hsl(var(--accent))' }}>]</span>
    </span>
  );
}
