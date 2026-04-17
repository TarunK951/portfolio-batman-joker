'use client';

/**
 * FuturisticSceneryLayer
 * ------------------------------------------------------------------
 * Full-viewport fixed layer. Dense dot grid + traveling pulse rings +
 * drifting monospace code particles + CRT scanlines + sweep beams.
 *
 * Mounts unconditionally; CSS in globals.css gates visibility to
 * [data-theme='futuristic']. Pointer-events: none throughout.
 */

import { useMemo } from 'react';

const GLYPHS = ['0', '1', '<', '>', '/', '*', '{', '}', ';', '='];

interface Particle {
  glyph: string;
  left: number;
  top: number;
  delay: number;
  duration: number;
  size: number;
}

export function FuturisticSceneryLayer({ count = 96 }: { count?: number }) {
  const particles = useMemo<Particle[]>(() => {
    const out: Particle[] = [];
    for (let i = 0; i < count; i += 1) {
      out.push({
        glyph: GLYPHS[i % GLYPHS.length] ?? '0',
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * -30,
        duration: 14 + Math.random() * 22,
        size: 10 + Math.random() * 8,
      });
    }
    return out;
  }, [count]);

  return (
    <div aria-hidden className="fx-scenery">
      <div className="fx-grid" />

      {/* Traveling pulse rings */}
      <div className="fx-rings">
        <span className="fx-ring fx-ring--a" />
        <span className="fx-ring fx-ring--b" />
        <span className="fx-ring fx-ring--c" />
      </div>

      {/* Sweep beam */}
      <div className="fx-beam" />

      {/* Monospace drift particles */}
      <div className="fx-particles">
        {particles.map((p, i) => (
          <span
            key={i}
            className="fx-particle"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              fontSize: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          >
            {p.glyph}
          </span>
        ))}
      </div>

      <div className="fx-scanlines" />
      <div className="fx-pulse" />
    </div>
  );
}
