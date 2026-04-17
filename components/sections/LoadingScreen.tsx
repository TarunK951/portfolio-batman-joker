'use client';

import { useEffect, useRef, useState } from 'react';
import { registerGsap } from '@/lib/gsap';
import { useTheme } from '@/components/theme/ThemeProvider';

/**
 * Utopia-style entry: bold mono number counter, scramble caption, then wipe.
 */
export function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const numRef = useRef<HTMLSpanElement | null>(null);
  const [visible, setVisible] = useState(true);
  const { theme } = useTheme();
  const loadingCopy = {
    batman: { mode: 'BAT_MODE', engaged: 'Order' },
    samurai: { mode: 'SMR_MODE', engaged: 'Restraint' },
    futuristic: { mode: 'SYS_MODE', engaged: 'Signal' },
  }[theme];

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = containerRef.current;
    if (!node) return;

    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      const tl = gsap.timeline({ onComplete: () => setVisible(false) });

      tl.from('.ls-meta', {
        y: 16,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
      });
      tl.to(counter, {
        v: 100,
        duration: 1.4,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (numRef.current)
            numRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0');
        },
      }, '-=0.2');
      tl.to('.ls-bar', {
        scaleX: 1,
        duration: 1.4,
        ease: 'power2.inOut',
      }, '<');
      tl.to('.ls-content', {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      }, '+=0.15');
      tl.to(node, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
      });
    }, node);

    return () => ctx.revert();
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col bg-theme-bg text-theme-ink"
    >
      <div className="ls-content flex flex-1 flex-col">
        {/* Top meta */}
        <div className="flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
          <span className="ls-meta u-mono text-[11px] uppercase tracking-[0.3em] text-theme-ink/60">
            Satya Tarun K
          </span>
          <span className="ls-meta u-mono text-[11px] uppercase tracking-[0.3em] text-theme-accent">
            {loadingCopy.mode} / Booting
          </span>
        </div>

        {/* Center counter */}
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="ls-meta u-mono mb-6 text-[11px] uppercase tracking-[0.3em] text-theme-ink/50">
              Loading edition 2026
            </p>
            <p
              className="font-display leading-none text-theme-ink"
              style={{ fontSize: 'clamp(5rem, 18vw, 14rem)' }}
            >
              <span ref={numRef}>000</span>
              <span className="text-theme-accent">.</span>
            </p>
          </div>
        </div>

        {/* Bottom progress bar */}
        <div className="px-6 pb-8 sm:px-10">
          <div className="ls-meta mb-3 flex items-center justify-between">
            <span className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/45">
              Initializing scene
            </span>
            <span className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/45">
              {loadingCopy.engaged} engaged
            </span>
          </div>
          <div className="relative h-px w-full bg-theme-ink/15">
            <div className="ls-bar absolute inset-y-0 left-0 h-px w-full origin-left bg-theme-accent" style={{ transform: 'scaleX(0)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
