'use client';

/**
 * AiDivider
 * ------------------------------------------------------------------
 * Hex wave-symbol divider — `( ˄ )` parenthesized chevron between
 * two thin horizontal rules. Ancient-india section separator.
 */

import { cn } from '@/lib/cn';

interface AiDividerProps {
  className?: string;
}

export function AiDivider({ className }: AiDividerProps) {
  return (
    <div
      aria-hidden
      className={cn('ai-divider flex items-center gap-4 text-theme-ink/45', className)}
    >
      <span className="ai-divider__rule" />
      <span className="u-mono ai-divider__glyph">
        <span className="ai-divider__paren">(</span>
        <svg viewBox="0 0 24 12" width="20" height="10" aria-hidden>
          <path
            d="M2 10 L 12 2 L 22 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="ai-divider__paren">)</span>
      </span>
      <span className="ai-divider__rule" />
    </div>
  );
}
