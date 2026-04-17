'use client';

import type { ReactNode } from 'react';

export function Marquee({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div className="u-marquee-track">
        <div className="flex shrink-0 items-center gap-12 pr-12">{children}</div>
        <div className="flex shrink-0 items-center gap-12 pr-12">{children}</div>
      </div>
    </div>
  );
}
