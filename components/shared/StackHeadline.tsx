'use client';

/**
 * StackHeadline — left-aligned 3-line stacked headline that crossfades
 * between two states as the user scrolls. Words wrapped in *asterisks*
 * render as italic-serif emphasis via `.fx-italic-emph`.
 *
 * Used under the futuristic theme for the 8bit.ai-style identity →
 * offering transition.
 */

import { useEffect, useRef, useState } from 'react';

type State = readonly string[];

interface StackHeadlineProps {
  stateA: State;
  stateB: State;
  className?: string;
}

function renderLine(line: string): React.ReactNode {
  // Split on *emph* markers — odd indices render as italic-serif emphasis.
  const parts = line.split(/\*([^*]+)\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <span key={i} className="fx-italic-emph">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function StackHeadline({
  stateA,
  stateB,
  className = '',
}: StackHeadlineProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [showB, setShowB] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const onScroll = () => {
      const r = node.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Progress: 0 when top of node at viewport top, 1 when we've scrolled
      // ~80vh past. Crossfade crosses at ~40vh.
      const p = Math.min(1, Math.max(0, (-r.top + vh * 0.15) / (vh * 0.6)));
      setShowB(p > 0.5);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div ref={rootRef} className={`fx-stack-headline ${className}`}>
      <div
        className="fx-stack-headline__state"
        style={{ opacity: showB ? 0 : 1 }}
        aria-hidden={showB}
      >
        {stateA.map((line, i) => (
          <span key={`a-${i}`} className="fx-stack-headline__line">
            {renderLine(line)}
          </span>
        ))}
      </div>
      <div
        className="fx-stack-headline__state"
        style={{ opacity: showB ? 1 : 0 }}
        aria-hidden={!showB}
      >
        {stateB.map((line, i) => (
          <span key={`b-${i}`} className="fx-stack-headline__line">
            {renderLine(line)}
          </span>
        ))}
      </div>
    </div>
  );
}
