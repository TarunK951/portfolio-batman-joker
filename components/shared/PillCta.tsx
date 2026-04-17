'use client';

/**
 * PillCta — white-filled rounded-full call-to-action with a dark circular
 * inset on the right containing an arrow. Ascend/8bit.ai style, used as
 * the single bright UI element under the futuristic theme.
 */

import type { ReactNode, MouseEventHandler } from 'react';

interface PillCtaProps {
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  icon?: ReactNode;
  className?: string;
}

const DEFAULT_ICON = (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
    <path
      d="M2 7 H11 M7 3 L11 7 L7 11"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function PillCta({
  children,
  href,
  onClick,
  icon = DEFAULT_ICON,
  className = '',
}: PillCtaProps) {
  const content = (
    <>
      <span className="fx-pill__label">{children}</span>
      <span className="fx-pill__iconwrap" aria-hidden>
        {icon}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
        className={`fx-pill ${className}`}
        data-cursor-hover
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick as MouseEventHandler<HTMLButtonElement>}
      className={`fx-pill ${className}`}
      data-cursor-hover
    >
      {content}
    </button>
  );
}
