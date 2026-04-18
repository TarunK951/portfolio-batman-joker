'use client';

/**
 * Compass
 * ------------------------------------------------------------------
 * N/E/S/W cardinal labels around a central slot. Faint cross/radial
 * guidelines behind. "FLOW CONTROL" mono label outside top-right.
 * Used on ancient-india Hero to frame the LogoDock.
 */

import type { ReactNode } from 'react';
import { hindiCopy } from '@/data/hindiCopy';

interface CompassProps {
  children: ReactNode;
  label?: string;
  hindiLabel?: string;
}

export function Compass({
  children,
  label = 'FLOW',
  hindiLabel = hindiCopy.flow,
}: CompassProps) {
  return (
    <div className="ai-compass relative flex items-center justify-center">
      {/* Cardinal labels */}
      <span className="ai-compass__label ai-compass__label--n u-mono">N</span>
      <span className="ai-compass__label ai-compass__label--e u-mono">E</span>
      <span className="ai-compass__label ai-compass__label--s u-mono">S</span>
      <span className="ai-compass__label ai-compass__label--w u-mono">W</span>

      {/* Faint cross guideline */}
      <svg
        aria-hidden
        className="ai-compass__guide"
        viewBox="0 0 400 400"
        preserveAspectRatio="none"
      >
        <g stroke="currentColor" strokeWidth="0.4" fill="none" opacity="0.18">
          <line x1="200" y1="10" x2="200" y2="390" />
          <line x1="10" y1="200" x2="390" y2="200" />
          <circle cx="200" cy="200" r="150" strokeDasharray="2 4" />
          <circle cx="200" cy="200" r="90" strokeDasharray="1 3" />
        </g>
      </svg>

      {/* Flow-control mono label outside the top-right — bilingual */}
      <span className="ai-compass__flow u-mono">
        [ {label}
        {' / '}
        <span className="ai-devanagari">{hindiLabel}</span>
        {' ]'}
      </span>

      {/* 45° rotated tile slot wrapping children */}
      <div className="ai-compass__slot">{children}</div>
    </div>
  );
}
