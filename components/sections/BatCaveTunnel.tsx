'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { registerGsap } from '@/lib/gsap';
import { useTheme } from '@/components/theme/ThemeProvider';

const BatCaveTunnelScene = dynamic(
  () =>
    import('@/components/three/BatCaveTunnel').then((m) => m.BatCaveTunnelScene),
  { ssr: false },
);

/**
 * BatCaveTunnel section.
 * - Outer wrapper is ~180vh tall.
 * - Inner stage is pinned for the duration via ScrollTrigger.
 * - During pin, scroll progress (0..1) is written to `--tunnel-progress` on
 *   <html>, which the R3F scene reads each frame to drive camera FOV + dolly.
 * - Title fades in on entry, fades out on exit.
 * - Sparse "blood" drips run as CSS overlay (not WebGL).
 */
export function BatCaveTunnel() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const outroRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const tunnelCopy = {
    batman: {
      eyebrow: '02 / Descent',
      headTop: 'Into the',
      headBottom: 'Bat Cave',
      outro: 'Beyond the dark, the work begins.',
    },
    samurai: {
      eyebrow: '02 / 道',
      headTop: 'Into the',
      headBottom: 'Dojo',
      outro: 'Silence sharpens the blade.',
    },
    futuristic: {
      eyebrow: '02 / INIT',
      headTop: 'Into the',
      headBottom: 'Mainframe',
      outro: 'Signal locked. Entering the grid.',
    },
  }[theme];

  useEffect(() => {
    const { gsap, ScrollTrigger } = registerGsap();
    const node = sectionRef.current;
    const stage = stageRef.current;
    if (!node || !stage) return;

    const ctx = gsap.context(() => {
      // Pin the stage and write scroll progress to a CSS var on <html>
      ScrollTrigger.create({
        trigger: node,
        start: 'top top',
        end: 'bottom bottom',
        pin: stage,
        pinSpacing: false,
        scrub: true,
        onUpdate: (self) => {
          document.documentElement.style.setProperty(
            '--tunnel-progress',
            self.progress.toFixed(4),
          );
        },
      });

      // Title: visible at start, fades out by 40% scroll
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: node,
            start: 'top 70%',
            end: 'top top',
            scrub: true,
          },
        },
      );
      gsap.to(titleRef.current, {
        opacity: 0,
        y: -40,
        ease: 'power1.in',
        scrollTrigger: {
          trigger: node,
          start: 'top top',
          end: '40% bottom',
          scrub: true,
        },
      });

      // Outro caption appears past 70% scroll
      gsap.fromTo(
        outroRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: node,
            start: '70% bottom',
            end: 'bottom bottom',
            scrub: true,
          },
        },
      );
    }, node);

    return () => {
      ctx.revert();
      document.documentElement.style.removeProperty('--tunnel-progress');
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cave"
      className="relative w-full bg-theme-bg text-theme-ink"
      style={{ height: '200vh' }}
    >
      <div
        ref={stageRef}
        className="relative h-screen w-full overflow-hidden"
      >
        {/* WebGL stage */}
        <div className="absolute inset-0 z-0">
          <BatCaveTunnelScene />
        </div>

        {/* Vignette */}
        <div className="tunnel-vignette" />

        {/* Blood drips — batman-only theatrical flair */}
        {theme === 'batman' && <BloodDrips />}

        {/* Top eyebrow + title */}
        <div
          ref={titleRef}
          className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col items-center px-6 pt-16 text-center"
        >
          <p className="u-eyebrow mb-4">
            <span className="inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-theme-accent" />
            <span className="ml-3">{tunnelCopy.eyebrow}</span>
          </p>
          <h2 className="u-h2 max-w-4xl">
            <span className="block text-theme-ink/95">{tunnelCopy.headTop}</span>
            <span className="block text-theme-accent">
              {tunnelCopy.headBottom}
            </span>
          </h2>
          <p className="u-mono mt-6 text-[11px] uppercase tracking-[0.3em] text-theme-ink/55">
            Scroll to descend
          </p>
        </div>

        {/* Bottom outro */}
        <div
          ref={outroRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-6 pb-16 text-center"
        >
          <p className="u-mono mb-3 text-[10px] uppercase tracking-[0.3em] text-theme-accent">
            Signal acquired
          </p>
          <p className="max-w-md text-sm leading-relaxed text-theme-ink/75">
            {tunnelCopy.outro}
          </p>
        </div>

        {/* Side rails — Utopia hairline frame */}
        <div className="pointer-events-none absolute inset-y-0 left-4 z-10 flex flex-col items-start justify-between py-6">
          <span className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/40">
            CAVE.SYS
          </span>
          <span className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/40 [writing-mode:vertical-rl]">
            depth ▼
          </span>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-4 z-10 flex flex-col items-end justify-between py-6">
          <span className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-accent">
            REC ●
          </span>
          <span className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/40">
            42°N
          </span>
        </div>
      </div>
    </section>
  );
}

function BloodDrips() {
  // Predetermined sparse positions/timings — feels theatrical, not random
  const drips = [
    { left: '8%', delay: '0s', duration: '14s' },
    { left: '23%', delay: '6s', duration: '18s' },
    { left: '41%', delay: '11s', duration: '16s' },
    { left: '67%', delay: '3s', duration: '20s' },
    { left: '82%', delay: '9s', duration: '15s' },
    { left: '94%', delay: '14s', duration: '17s' },
  ];
  return (
    <div className="bat-drips" aria-hidden="true">
      {drips.map((d, i) => (
        <span
          key={i}
          className="bat-drip"
          style={{
            left: d.left,
            animationDelay: d.delay,
            animationDuration: d.duration,
          }}
        />
      ))}
    </div>
  );
}
