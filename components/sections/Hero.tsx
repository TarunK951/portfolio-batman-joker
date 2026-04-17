'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { registerGsap } from '@/lib/gsap';
import { useTheme } from '@/components/theme/ThemeProvider';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { ScrambleText } from '@/components/shared/ScrambleText';
import { UButton } from '@/components/shared/UButton';
import { Marquee } from '@/components/shared/Marquee';

const HeroScene = dynamic(
  () => import('@/components/three/HeroScene').then((m) => m.HeroScene),
  { ssr: false },
);

/**
 * Utopia Tokyo inspired hero.
 * - Top: hairline nav with mono labels + theme buttons (dark / red / cream feel)
 * - Center-left: oversized fluid title (clamp 4 → 11rem) with red word accent
 * - Center-right: 3D mark (existing HeroScene)
 * - Bottom: meta line + scramble CTA + scrolling marquee tagline
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { theme } = useTheme();
  const isBatman = theme === 'batman';

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = sectionRef.current;
    if (!node) return;

    const ctx = gsap.context(() => {
      gsap.set(['.hero-row', '.hero-meta', '.hero-cta', '.hero-scene'], {
        opacity: 0,
        y: 24,
      });
      const tl = gsap.timeline({
        delay: 0.15,
        defaults: { ease: 'power3.out', force3D: true },
      });
      gsap.set('.hero-nav-item', { opacity: 0, y: 12 });
      tl.to('.hero-nav-item', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
      });
      tl.to('.hero-row', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.12,
      });
      tl.to('.hero-scene', { opacity: 1, y: 0, duration: 1.0 }, '-=0.6');
      tl.to('.hero-meta', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
      tl.to('.hero-cta', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
    }, node);

    return () => ctx.revert();
  }, []);

  const accentWord = isBatman ? 'Order' : 'Chaos';
  const counterWord = isBatman ? 'Chaos' : 'Order';

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-theme-bg text-theme-ink"
    >
      <ThemeToggle />

      {/* ── NAV ─────────────────────────────────────────── */}
      <header className="relative z-20 flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
        <div className="flex items-center gap-3">
          <span className="hero-nav-item u-mono text-[11px] uppercase tracking-[0.22em] text-theme-ink/70">
            Satya Tarun K
          </span>
          <span className="hero-nav-item h-3 w-px bg-theme-ink/30" />
          <span className="hero-nav-item u-mono text-[11px] uppercase tracking-[0.22em] text-theme-accent">
            {isBatman ? 'BAT_MODE' : 'JKR_MODE'}
          </span>
        </div>
        <nav className="hidden items-center gap-7 md:flex">
          {['Index', 'Work', 'About', 'Contact'].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="hero-nav-item u-mono text-[11px] uppercase tracking-[0.22em] text-theme-ink/70 transition-colors hover:text-theme-accent"
              data-cursor-hover
            >
              <ScrambleText text={l} />
            </a>
          ))}
        </nav>
        <div className="hero-nav-item u-mono text-[11px] uppercase tracking-[0.22em] text-theme-ink/50">
          {new Date().getFullYear()} / Tokyo–Hyderabad
        </div>
      </header>

      {/* ── MAIN GRID ──────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 sm:px-10">
        <div className="grid grid-cols-12 items-center gap-x-6 gap-y-8">
          {/* Title block — left 8 cols */}
          <div className="col-span-12 lg:col-span-8">
            <p className="hero-row u-eyebrow mb-6">
              <span className="inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-theme-accent" />
              <span className="ml-3">Portfolio · Edition 2026</span>
            </p>
            <h1 className="hero-row u-h1">
              <span className="block text-theme-ink/95">{accentWord}</span>
              <span className="block text-theme-ink/40">meets</span>
              <span className="block">
                <span className="text-theme-accent">{counterWord}</span>
                <span className="text-theme-ink/95">.</span>
              </span>
            </h1>
            <p className="hero-row mt-8 max-w-md text-sm leading-relaxed text-theme-ink/65">
              {isBatman
                ? 'In a world that breaks everyone — some choose to become the darkness that protects the light.'
                : 'One bad day is all it takes. Make yours count.'}
            </p>
          </div>

          {/* 3D mark — right 4 cols */}
          <div className="col-span-12 lg:col-span-4">
            <div className="hero-scene relative mx-auto aspect-square w-full max-w-[420px]">
              <div className="absolute inset-0">
                <HeroScene />
              </div>
              {/* corner marks */}
              <CornerMarks />
            </div>
          </div>
        </div>

        {/* Bottom meta row */}
        <div className="mt-16 grid grid-cols-12 items-end gap-6">
          <div className="hero-meta col-span-12 sm:col-span-4">
            <p className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/40">
              Role
            </p>
            <p className="mt-1 text-sm text-theme-ink/85">
              Creative Developer · Product Engineer
            </p>
          </div>
          <div className="hero-meta col-span-6 sm:col-span-4">
            <p className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/40">
              Stack
            </p>
            <p className="mt-1 text-sm text-theme-ink/85">
              Next.js · R3F · GSAP · TypeScript
            </p>
          </div>
          <div className="hero-cta col-span-6 sm:col-span-4 flex sm:justify-end">
            <UButton variant="red" href="#contact">
              Open the signal
            </UButton>
          </div>
        </div>
      </div>

      {/* ── MARQUEE FOOTER ─────────────────────────────── */}
      <div className="relative z-10 border-t border-theme-line py-4">
        <Marquee>
          {[
            'Toggle the mask',
            '— Satya Tarun K —',
            isBatman ? 'I am the night' : 'Why so serious?',
            'satyatarun',
            isBatman ? '正義 · 影 · 規律' : 'अराजकता · हँसी · खेल',
            'Edition 2026',
          ].map((s, i) => (
            <span
              key={i}
              className="u-mono text-[11px] uppercase tracking-[0.3em] text-theme-ink/55"
            >
              {s}
            </span>
          ))}
        </Marquee>
      </div>

      {/* ── BACKGROUND TEXTURE ─────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '4px 4px',
          color: 'hsl(var(--ink))',
        }}
      />
    </section>
  );
}

function CornerMarks() {
  return (
    <>
      {[
        'top-0 left-0 border-t border-l',
        'top-0 right-0 border-t border-r',
        'bottom-0 left-0 border-b border-l',
        'bottom-0 right-0 border-b border-r',
      ].map((pos, i) => (
        <span
          key={i}
          className={`pointer-events-none absolute h-3 w-3 border-theme-ink/40 ${pos}`}
        />
      ))}
    </>
  );
}
