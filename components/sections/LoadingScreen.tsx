'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { registerGsap } from '@/lib/gsap';
import { useTheme } from '@/components/theme/ThemeProvider';

const LogoMarkScene = dynamic(
  () => import('@/components/three/LogoMark').then((m) => m.LogoMarkScene),
  { ssr: false },
);

/**
 * Loading screen — R3F batman_logo.glb centered, with a 000→100 counter
 * and hairline progress bar. Fades out + lifts on completion, signals ready
 * on <body class="loaded">.
 */
export function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const numRef = useRef<HTMLSpanElement | null>(null);
  const [visible, setVisible] = useState(true);
  const { theme } = useTheme();
  const loadingCopy = {
    batman: { mode: 'BAT_MODE', engaged: 'Order', edition: 'Edition 2026' },
    'ancient-india': { mode: 'DHR_MODE', engaged: 'Dharma', edition: '२०२६' },
    futuristic: { mode: 'SYS_MODE', engaged: 'Signal', edition: 'v.2026.Q2' },
  }[theme];

  useEffect(() => {
    const { gsap, ScrollTrigger } = registerGsap();
    const node = containerRef.current;
    if (!node) return;

    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          setVisible(false);
          if (typeof document !== 'undefined') {
            document.body.classList.add('loaded');
          }
          // Recompute ScrollTrigger positions once the overlay is gone.
          requestAnimationFrame(() => ScrollTrigger.refresh());
        },
      });

      tl.from('.ls-meta', {
        y: 16,
        opacity: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power2.out',
      });
      tl.from(
        '.ls-logo',
        {
          opacity: 0,
          scale: 0.85,
          duration: 0.9,
          ease: 'power3.out',
        },
        '<',
      );
      tl.to(
        counter,
        {
          v: 100,
          duration: 1.8,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (numRef.current)
              numRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0');
          },
        },
        '-=0.3',
      );
      tl.to(
        '.ls-bar',
        {
          scaleX: 1,
          duration: 1.8,
          ease: 'power2.inOut',
        },
        '<',
      );
      tl.to('.ls-content', {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
      }, '+=0.2');
      tl.to(node, {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut',
      }, '-=0.1');
    }, node);

    return () => ctx.revert();
  }, []);

  if (!visible) return null;

  const isBatman = theme === 'batman';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col bg-theme-bg text-theme-ink"
    >
      <div className="ls-content flex flex-1 flex-col">
        {/* Top meta */}
        <div className="flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
          <span className="ls-meta u-mono text-[11px] uppercase tracking-[0.3em] text-theme-ink/60">
            {isBatman ? '[ LOADING ]' : 'Satya Tarun K'}
          </span>
          <span className="ls-meta u-mono text-[11px] uppercase tracking-[0.3em] text-theme-accent">
            {isBatman ? `[ ${loadingCopy.mode} / BOOTING ]` : `${loadingCopy.mode} / Booting`}
          </span>
        </div>

        {/* Center — R3F logo + counter */}
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
          <div
            className="ls-logo relative"
            style={{ width: 'min(42vw, 320px)', height: 'min(42vw, 320px)' }}
          >
            {isBatman ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  aria-hidden
                  className="absolute"
                  style={{
                    width: 3,
                    height: '82%',
                    background: 'hsl(var(--accent))',
                    transform: 'rotate(45deg)',
                    boxShadow: '0 0 18px hsl(var(--accent) / 0.85), 0 0 36px hsl(var(--accent) / 0.5)',
                  }}
                />
                <span
                  aria-hidden
                  className="absolute"
                  style={{
                    width: 3,
                    height: '82%',
                    background: 'hsl(var(--accent))',
                    transform: 'rotate(-45deg)',
                    boxShadow: '0 0 18px hsl(var(--accent) / 0.85), 0 0 36px hsl(var(--accent) / 0.5)',
                  }}
                />
              </div>
            ) : (
              <LogoMarkScene mode="hero" />
            )}
          </div>
          <p
            className="ls-meta font-display leading-none text-theme-ink"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', letterSpacing: '-0.02em' }}
          >
            <span ref={numRef}>000</span>
            <span className="text-theme-accent">.</span>
          </p>
          <p className="ls-meta u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/45">
            {loadingCopy.edition}
          </p>
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
            <div
              className="ls-bar absolute inset-y-0 left-0 h-px w-full origin-left bg-theme-accent"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
