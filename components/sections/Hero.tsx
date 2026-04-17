'use client';

import { useEffect, useRef, useState } from 'react';
import { registerGsap } from '@/lib/gsap';
import { useTheme, type Theme } from '@/components/theme/ThemeProvider';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { DepthText } from '@/components/shared/DepthText';
import { LogoDock } from '@/components/three/PersistentLogo';
import { ancientIndiaCopy } from '@/data/ancientIndiaCopy';

/**
 * Hero — the centerpiece is the spinning 3D logo (PersistentLogo, docked
 * here via LogoDock id="hero"). Beneath it, the name TARUN is carved in
 * stacked-shadow DepthText, flanked by theme-aware eyebrow / subtext.
 *
 * The only word visually shown at display size is "TARUN". The full
 * identity "Satya Tarun K — Creative Developer" survives as a semantic
 * but visually-subdued block for SEO continuity.
 */

type HeroCopy = {
  eyebrow: string;
  subline: string;
  cta: string;
  tag: string;
};

const HERO_COPY: Record<Theme, HeroCopy> = {
  batman: {
    eyebrow: '[01] arrival · gotham',
    subline:
      'In a world that breaks everyone — some choose to become the darkness that protects the light.',
    cta: 'Enter the case files',
    tag: 'Creative developer / Hyderabad',
  },
  'ancient-india': {
    eyebrow: '[01] ' + ancientIndiaCopy.hero.eyebrow,
    subline: ancientIndiaCopy.hero.bio,
    cta: ancientIndiaCopy.hero.ctaLabel,
    tag: 'सत्य तरुण · shilpi · Bhārata',
  },
  futuristic: {
    eyebrow: '[ 01 / arrival ] :: system online',
    subline:
      '[ engineer@edge ] shipping real-time, high-signal surfaces. latency low, intent high.',
    cta: '> view.work',
    tag: '[ node: hyderabad-01 ] [ uptime: infinite ]',
  },
};

function formatClock(d: Date): string {
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Kolkata',
  });
}

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { theme } = useTheme();
  const copy = HERO_COPY[theme];
  const [clock, setClock] = useState<string>('');

  useEffect(() => {
    setClock(formatClock(new Date()));
    const id = window.setInterval(() => setClock(formatClock(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = sectionRef.current;
    if (!node) return;

    const ctx = gsap.context(() => {
      gsap.set('.hero-reveal', { opacity: 0, y: 20, force3D: true });
      gsap.to('.hero-reveal', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
        stagger: 0.08,
        delay: 0.15,
        force3D: true,
      });
    }, node);

    return () => ctx.revert();
  }, []);

  const isFuturistic = theme === 'futuristic';

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen w-full flex-col bg-theme-bg text-theme-ink"
      style={{ willChange: 'transform' }}
    >
      <ThemeToggle />

      {/* ── TOP BAR ─────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between gap-4 px-6 pt-8 sm:px-12 sm:pt-10">
        <span className="hero-reveal u-mono text-[11px] uppercase tracking-[0.22em] text-theme-ink/70">
          {isFuturistic ? '[ satyatarun ]' : 'satyatarun'}
        </span>

        {/* Futuristic terminal status pill */}
        {isFuturistic ? (
          <div className="hero-reveal hidden items-center gap-3 md:flex">
            <span className="u-mono text-[10px] uppercase tracking-[0.22em] text-theme-accent">
              <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] animate-pulse rounded-full bg-theme-accent align-middle" />
              [ system: online ]
            </span>
            <span className="u-mono text-[10px] uppercase tracking-[0.22em] text-theme-ink/50">
              [ uptime: {clock || '--:--:--'} ]
            </span>
          </div>
        ) : (
          <nav className="hero-reveal hidden items-center gap-8 md:flex">
            {(['Work', 'About', 'Contact'] as const).map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="u-mono text-[11px] uppercase tracking-[0.22em] text-theme-ink/70 transition-colors hover:text-theme-ink"
                data-cursor-hover
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* ── CENTER BLOCK ────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 py-10 text-center sm:px-12">
        {/* Eyebrow */}
        <p className="hero-reveal u-mono text-[10px] uppercase tracking-[0.32em] text-theme-ink/55">
          <span className="inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-theme-accent align-middle" />
          <span className="ml-3 align-middle">{copy.eyebrow}</span>
        </p>

        {/* Logo dock — PersistentLogo canvas floats onto this anchor */}
        <div
          className="hero-reveal"
          style={{ willChange: 'transform' }}
          aria-hidden
        >
          <LogoDock id="hero" size="large" />
        </div>

        {/* Carved TARUN wordmark */}
        <DepthText
          as="div"
          layers={8}
          className="hero-reveal font-display leading-[0.85]"
          style={{
            fontSize: 'clamp(4rem, 16vw, 12rem)',
            letterSpacing: '-0.04em',
          }}
        >
          TARUN
        </DepthText>

        {/* Full identity — semantic H1, visually subdued */}
        <p className="hero-reveal u-mono text-[11px] uppercase tracking-[0.3em] text-theme-ink/55">
          {isFuturistic ? '[ ' : ''}Satya Tarun K
          <span className="mx-2 text-theme-accent">·</span>
          Creative Developer{isFuturistic ? ' ]' : ''}
        </p>

        {/* Subline */}
        <p className="hero-reveal max-w-[560px] text-[15px] leading-relaxed text-theme-ink/70">
          {copy.subline}
        </p>

        {/* CTA */}
        <a
          href="#work"
          className="hero-reveal inline-flex items-center gap-2 u-mono text-[11px] uppercase tracking-[0.3em] text-theme-ink transition-colors hover:text-theme-accent"
          data-cursor-hover
        >
          <span className="border-b border-transparent pb-0.5 transition-colors hover:border-theme-accent">
            {copy.cta}
          </span>
          <span aria-hidden>→</span>
        </a>
      </div>

      {/* ── BOTTOM META ─────────────────────────────────── */}
      <footer className="relative z-10 px-6 pb-8 sm:px-12 sm:pb-10">
        <div className="u-rule mb-5" />
        <div className="flex items-center justify-between gap-4">
          <span className="u-mono text-[10px] uppercase tracking-[0.28em] text-theme-ink/55">
            {copy.tag}
          </span>
          <span className="u-mono text-[10px] uppercase tracking-[0.28em] text-theme-ink/55">
            {isFuturistic ? '[ ist ' : 'IST '}
            {clock || '—'}
            {isFuturistic ? ' ]' : ''}
          </span>
        </div>
      </footer>
    </section>
  );
}
