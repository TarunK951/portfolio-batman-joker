'use client';

/**
 * ParchmentFrame
 * -----------------------------------------------------------------
 * Fixed hand-drawn border inset 16px from viewport edges. Mounts
 * only under [data-theme='ancient-india']. Corner four-petal lotus
 * ornaments; brush-like dashed stroke gives the ink-on-paper feel.
 */

import { useTheme } from '@/components/theme/ThemeProvider';

const STROKE = 'currentColor';

function Corner({ style }: { style: React.CSSProperties }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 40"
      width={24}
      height={24}
      style={{ position: 'fixed', color: 'hsl(var(--ink) / 0.55)', ...style }}
    >
      <g fill="none" stroke={STROKE} strokeWidth="1" strokeLinecap="round">
        {/* four-petal lotus */}
        <path d="M20 6 C 24 12, 24 16, 20 20 C 16 16, 16 12, 20 6 Z" />
        <path d="M34 20 C 28 24, 24 24, 20 20 C 24 16, 28 16, 34 20 Z" />
        <path d="M20 34 C 16 28, 16 24, 20 20 C 24 24, 24 28, 20 34 Z" />
        <path d="M6 20 C 12 16, 16 16, 20 20 C 16 24, 12 24, 6 20 Z" />
        <circle cx="20" cy="20" r="1.2" fill={STROKE} stroke="none" />
      </g>
    </svg>
  );
}

export function ParchmentFrame() {
  const { theme } = useTheme();
  if (theme !== 'ancient-india') return null;

  const common: React.CSSProperties = {
    position: 'fixed',
    pointerEvents: 'none',
    color: 'hsl(var(--ink) / 0.35)',
    zIndex: 30,
  };

  return (
    <div aria-hidden className="ai-parchment-frame" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 30 }}>
      {/* top */}
      <svg
        viewBox="0 0 1200 4"
        preserveAspectRatio="none"
        style={{ ...common, top: 16, left: 16, right: 16, width: 'calc(100vw - 32px)', height: 3 }}
      >
        <path
          d="M0 2 Q 200 0.5, 400 2 T 800 2 T 1200 1.6"
          fill="none"
          stroke={STROKE}
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="1 0"
          opacity="0.9"
        />
      </svg>
      {/* bottom */}
      <svg
        viewBox="0 0 1200 4"
        preserveAspectRatio="none"
        style={{ ...common, bottom: 16, left: 16, right: 16, width: 'calc(100vw - 32px)', height: 3 }}
      >
        <path
          d="M0 2 Q 200 3.5, 400 2 T 800 2 T 1200 2.4"
          fill="none"
          stroke={STROKE}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
      {/* left */}
      <svg
        viewBox="0 0 4 1200"
        preserveAspectRatio="none"
        style={{ ...common, top: 16, bottom: 16, left: 16, width: 3, height: 'calc(100vh - 32px)' }}
      >
        <path
          d="M2 0 Q 0.5 200, 2 400 T 2 800 T 1.6 1200"
          fill="none"
          stroke={STROKE}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
      {/* right */}
      <svg
        viewBox="0 0 4 1200"
        preserveAspectRatio="none"
        style={{ ...common, top: 16, bottom: 16, right: 16, width: 3, height: 'calc(100vh - 32px)' }}
      >
        <path
          d="M2 0 Q 3.5 200, 2 400 T 2 800 T 2.4 1200"
          fill="none"
          stroke={STROKE}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>

      {/* corners */}
      <Corner style={{ top: 4, left: 4 }} />
      <Corner style={{ top: 4, right: 4 }} />
      <Corner style={{ bottom: 4, left: 4 }} />
      <Corner style={{ bottom: 4, right: 4 }} />
    </div>
  );
}
