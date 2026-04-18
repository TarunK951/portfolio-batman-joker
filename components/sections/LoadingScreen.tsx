'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { registerGsap } from '@/lib/gsap';
import { useTheme } from '@/components/theme/ThemeProvider';

const LogoMarkScene = dynamic(
  () => import('@/components/three/LogoMark').then((m) => m.LogoMarkScene),
  { ssr: false },
);

const LottiePlayer = dynamic(
  () =>
    import('@lottiefiles/dotlottie-react').then((m) => ({
      default: m.DotLottieReact,
    })),
  { ssr: false },
);

/**
 * Loading screen — batman theme renders the utopiatokyo-style crossed-blade
 * loader with scattered SATYA TARUN letters and an [ ENTER PORTFOLIO ] CTA.
 * Ancient-india keeps the simpler R3F logo + hairline bar treatment.
 */

// Scattered letter positions: vertical columns along the left and right edges.
// Spells out "SATYA TARUN" twice — once per edge — at fixed vertical percents.
type ScatterLetter = { ch: string; top: string; side: 'left' | 'right'; x: string };
const SCATTER_LETTERS: ScatterLetter[] = [
  // Left edge, top half — "SATYA"
  { ch: 'S', top: '19%', side: 'left', x: '5.5%' },
  { ch: 'A', top: '27%', side: 'left', x: '4.2%' },
  { ch: 'T', top: '35%', side: 'left', x: '5.8%' },
  { ch: 'Y', top: '43%', side: 'left', x: '3.9%' },
  { ch: 'A', top: '51%', side: 'left', x: '5.2%' },
  // Left edge, bottom half — "TARUN"
  { ch: 'T', top: '62%', side: 'left', x: '4.6%' },
  { ch: 'A', top: '70%', side: 'left', x: '5.9%' },
  { ch: 'R', top: '78%', side: 'left', x: '3.8%' },
  { ch: 'U', top: '86%', side: 'left', x: '5.4%' },
  // Right edge — mirror
  { ch: 'N', top: '19%', side: 'right', x: '5.5%' },
  { ch: 'U', top: '27%', side: 'right', x: '4.2%' },
  { ch: 'R', top: '35%', side: 'right', x: '5.8%' },
  { ch: 'A', top: '43%', side: 'right', x: '3.9%' },
  { ch: 'T', top: '51%', side: 'right', x: '5.2%' },
  { ch: 'A', top: '62%', side: 'right', x: '4.6%' },
  { ch: 'Y', top: '70%', side: 'right', x: '5.9%' },
  { ch: 'T', top: '78%', side: 'right', x: '3.8%' },
  { ch: 'A', top: '86%', side: 'right', x: '5.4%' },
  // Sparse center-column letters (like reference: T / I / K at left of center, Y / O at right)
  { ch: 'T', top: '27%', side: 'left', x: '40%' },
  { ch: 'I', top: '43%', side: 'left', x: '40%' },
  { ch: 'K', top: '60%', side: 'left', x: '40%' },
  { ch: 'Y', top: '27%', side: 'right', x: '40%' },
  { ch: 'O', top: '43%', side: 'right', x: '40%' },
  { ch: 'K', top: '60%', side: 'right', x: '40%' },
];

export function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const numRef = useRef<HTMLSpanElement | null>(null);
  const [visible, setVisible] = useState(true);
  const [done, setDone] = useState(false);
  const { theme } = useTheme();
  const isBatman = theme === 'batman';

  const loadingCopy = {
    batman: { mode: 'BAT_MODE', engaged: 'Order', edition: 'Edition 2026' },
    'ancient-india': { mode: 'DHR_MODE', engaged: 'Dharma', edition: '२०२६' },
  }[theme];

  const exit = () => {
    const { gsap, ScrollTrigger } = registerGsap();
    const node = containerRef.current;
    if (!node) {
      setVisible(false);
      if (typeof document !== 'undefined') document.body.classList.add('loaded');
      return;
    }
    gsap.to(node, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power3.inOut',
      onComplete: () => {
        setVisible(false);
        if (typeof document !== 'undefined') document.body.classList.add('loaded');
        requestAnimationFrame(() => ScrollTrigger.refresh());
      },
    });
  };

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = containerRef.current;
    if (!node) return;

    let autoExitTimer: ReturnType<typeof setTimeout> | undefined;

    const ctx = gsap.context(() => {
      if (isBatman) {
        // Lottie scales + fades in.
        gsap.fromTo(
          '.bat-loader-lottie',
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.0, ease: 'power3.out', force3D: true },
        );
        // Scattered letters fade in.
        gsap.fromTo(
          '.bat-loader-letter',
          { opacity: 0, y: 6 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
            stagger: { amount: 0.9, from: 'random' },
            delay: 0.3,
          },
        );
        // Meta labels fade in.
        gsap.from('.bat-loader-meta', {
          opacity: 0,
          y: 8,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power2.out',
          delay: 0.2,
        });
      } else {
        gsap.from('.ls-meta', {
          y: 16,
          opacity: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power2.out',
        });
        gsap.from('.ls-logo', {
          opacity: 0,
          scale: 0.85,
          duration: 0.9,
          ease: 'power3.out',
        });
      }

      // Counter 000 -> 100.
      const counter = { v: 0 };
      gsap.to(counter, {
        v: 100,
        duration: 2.8,
        ease: 'power2.inOut',
        delay: isBatman ? 0.6 : 0.3,
        onUpdate: () => {
          if (numRef.current)
            numRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0');
        },
        onComplete: () => {
          setDone(true);
          // Ancient-india has no CTA — auto-dismiss.
          if (!isBatman) {
            gsap.to('.ls-content', {
              opacity: 0,
              duration: 0.4,
              ease: 'power2.in',
              delay: 0.2,
              onComplete: exit,
            });
          } else {
            // Batman: auto-exit after 5s if the user doesn't click.
            autoExitTimer = setTimeout(exit, 5000);
          }
        },
      });

      if (!isBatman) {
        gsap.to('.ls-bar', {
          scaleX: 1,
          duration: 2.8,
          ease: 'power2.inOut',
          delay: 0.3,
        });
      }
    }, node);

    return () => {
      if (autoExitTimer) clearTimeout(autoExitTimer);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // CTA pulse once loading completes.
  useEffect(() => {
    if (!done || !isBatman) return;
    const { gsap } = registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.bat-loader-cta',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      );
      gsap.to('.bat-loader-cta', {
        scale: 1.04,
        duration: 0.9,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 0.5,
      });
    }, containerRef);
    return () => ctx.revert();
  }, [done, isBatman]);

  if (!visible) return null;

  if (!isBatman) {
    return (
      <div
        ref={containerRef}
        className="fixed inset-0 z-[100] flex flex-col bg-theme-bg text-theme-ink"
      >
        <div className="ls-content flex flex-1 flex-col">
          <div className="flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
            <span className="ls-meta u-mono text-[11px] uppercase tracking-[0.3em] text-theme-ink/60">
              Satya Tarun K
            </span>
            <span className="ls-meta u-mono text-[11px] uppercase tracking-[0.3em] text-theme-accent">
              {loadingCopy.mode} / Booting
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
            <div
              className="ls-logo relative"
              style={{ width: 'min(42vw, 320px)', height: 'min(42vw, 320px)' }}
            >
              <LogoMarkScene mode="hero" />
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

  // ---------- Batman: crossed-blade loader ----------
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] overflow-hidden bg-theme-bg text-theme-ink"
    >
      {/* Horizontal scan sweep */}
      <div className="bat-loader-sweep pointer-events-none absolute inset-x-0 h-px" aria-hidden />

      {/* Centered Lottie animation */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="bat-loader-lottie"
          style={{ width: 'min(60vmin, 560px)', height: 'min(60vmin, 560px)' }}
          aria-hidden
        >
          <LottiePlayer src="/lottie/loader.lottie" autoplay loop />
        </div>
      </div>

      {/* Scattered letters */}
      {SCATTER_LETTERS.map((l, i) => (
        <span
          key={`${l.side}-${i}`}
          className="bat-loader-letter u-mono"
          style={{
            top: l.top,
            [l.side]: l.x,
          } as React.CSSProperties}
        >
          {l.ch}
        </span>
      ))}

      {/* Top-left [ LOADING ] */}
      <span className="bat-loader-meta u-mono absolute left-6 top-6 text-[11px] uppercase tracking-[0.28em]"
        style={{ color: 'hsl(var(--accent))' }}>
        [ LOADING ]
      </span>
      {/* Top-right [ LOADING ] */}
      <span className="bat-loader-meta u-mono absolute right-6 top-6 text-[11px] uppercase tracking-[0.28em]"
        style={{ color: 'hsl(var(--accent))' }}>
        [ LOADING ]
      </span>

      {/* Mid-left and Mid-right [ LOADING ] */}
      <span
        className="bat-loader-meta u-mono absolute left-6 text-[11px] uppercase tracking-[0.28em]"
        style={{ top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--accent))' }}
      >
        [ LOADING ]
      </span>
      <span
        className="bat-loader-meta u-mono absolute right-6 text-[11px] uppercase tracking-[0.28em]"
        style={{ top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--accent))' }}
      >
        [ LOADING ]
      </span>

      {/* Bottom-left VERSION */}
      <span
        className="bat-loader-meta u-mono absolute bottom-6 left-6 text-[11px] uppercase tracking-[0.28em]"
        style={{ color: 'hsl(var(--paper) / 0.6)' }}
      >
        VERSION 1.0.0
      </span>

      {/* Bottom-right counter */}
      <span
        className="bat-loader-meta u-mono absolute bottom-6 right-6 text-[11px] uppercase tracking-[0.28em]"
        style={{ color: 'hsl(var(--paper) / 0.8)' }}
      >
        <span ref={numRef}>000</span>
        <span style={{ color: 'hsl(var(--accent))' }}> / 100</span>
      </span>

      {/* Bottom-center CTA — appears after counter hits 100 */}
      {done && (
        <button
          type="button"
          onClick={exit}
          className="bat-loader-cta u-mono absolute bottom-10 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em]"
          style={{
            color: 'hsl(var(--accent))',
            border: '1px solid hsl(var(--accent))',
            background: 'hsl(var(--accent) / 0.1)',
            padding: '12px 22px',
            willChange: 'transform',
          }}
        >
          [ ENTER PORTFOLIO ]
        </button>
      )}
    </div>
  );
}
