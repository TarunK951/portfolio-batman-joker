'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { ScrambleText } from './ScrambleText';

type Variant = 'dark' | 'red' | 'cream';

type Props = {
  variant?: Variant;
  href?: string;
  scramble?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'className'>;

/**
 * Utopia-style button: dark / red / cream variants, optional scramble-on-hover label.
 */
export function UButton({
  variant = 'dark',
  href,
  scramble = true,
  children,
  className = '',
  ...rest
}: Props) {
  const cls = `u-btn u-btn--${variant} ${className}`.trim();

  const inner =
    typeof children === 'string' && scramble ? (
      <ScrambleText text={children} className="u-mono" />
    ) : (
      children
    );

  if (href) {
    return (
      <a href={href} className={cls} data-cursor-hover>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={cls} data-cursor-hover {...rest}>
      {inner}
    </button>
  );
}
