'use client';

/**
 * LogoCard — a rounded dark card with hairline border, used as the
 * building block for the futuristic card mosaic. Wraps any centred
 * content (logo, icon, thumbnail + label).
 */

import type { ReactNode, CSSProperties } from 'react';

export interface LogoCardProps {
  children: ReactNode;
  size?: 'sm' | 'md';
  notched?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  ariaLabel?: string;
  active?: boolean;
}

export function LogoCard({
  children,
  size = 'md',
  notched = false,
  className = '',
  style,
  onClick,
  ariaLabel,
  active = false,
}: LogoCardProps) {
  const classes = [
    'fx-card',
    size === 'sm' ? 'fx-card--sm' : 'fx-card--md',
    notched ? 'fx-card--notched' : '',
    active ? 'fx-card--active' : '',
    onClick ? 'fx-card--interactive' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={classes}
        style={style}
        data-cursor-hover
      >
        {children}
      </button>
    );
  }

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}
