'use client';

import { useEffect, useRef, useState } from 'react';
import { registerGsap } from '@/lib/gsap';
import { useTheme, type Theme } from '@/components/theme/ThemeProvider';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

/**
 * Hero — string-tune.fiddle.digital minimalism.
 * Full viewport, centered content, enormous whitespace,
 * typography doing all the heavy lifting. No 3D, no marquee,
 * no decorative frames, no radial-dot texture.
 */
type HeroCopy = {
  headlineLines: [string, string];
  accentWord: string; // the single word that gets the accent color
  bio: string;
};

const HERO_COPY: Record<Theme, HeroCopy> = {
  batman: {
    headlineLines: ['Order meets', 'chaos.'],
    accentWord: 'chaos.',
    bio: 'Creative developer building precise, cinematic interfaces from Hyderabad.',
  },
  samurai: {
    headlineLines: ['Stillness in', 'motion.'],
    accentWord: 'motion.',
    bio: 'Interface craftsman. Every line has weight, every pause has reason.',
  },
  futuristic: {
    headlineLines: ['Systems in', 'signal.'],
    accentWord: 'signal.',
    bio: 'Systems engineer for the web. Shipping high-signal products at the edge.',
  },
};

const NAV_LINKS = ['Work', 'About', 'Contact'] as const;

function formatClock(d: Date): string {
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
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
    const id = window.setInterval(() => setClock(formatClock(new Date())), 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = sectionRef.current;
    if (!node) return;

    const ctx = gsap.context(() => {
      gsap.set('.hero-reveal', { opacity: 0, y: 16 });
      gsap.to('.hero-reveal', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.08,
        delay: 0.1,
      });
    }, node);

    return () => ctx.revert();
  }, []);

  const [line1, line2] = copy.headlineLines;
  const accentIsLine2 = line2 === copy.accentWord;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col bg-theme-bg text-theme-ink"
    >
      <ThemeToggle />

      {/* ── TOP BAR ─────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-8 sm:px-12 sm:pt-10">
        <span className="u-mono text-[11px] uppercase tracking-[0.22em] text-theme-ink/70">
          satyatarun
        </span>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((label) => (
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
      </header>

      {/* ── CENTER BLOCK ────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 items-center px-6 sm:px-12">
        <div className="mx-auto w-full max-w-[900px]">
          <p className="hero-reveal u-mono mb-10 text-[10px] uppercase tracking-[0.3em] text-theme-ink/55">
            <span className="inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-theme-accent align-middle" />
            <span className="ml-3 align-middle">2026 — Portfolio</span>
          </p>

          <h1 className="hero-reveal u-h1">
            <span className={`block ${accentIsLine2 ? 'text-theme-ink' : 'text-theme-accent'}`}>
              {line1}
            </span>
            <span className={`block ${accentIsLine2 ? 'text-theme-accent' : 'text-theme-ink'}`}>
              {line2}
            </span>
          </h1>

          <p className="hero-reveal mt-10 max-w-[440px] text-[15px] leading-relaxed text-theme-ink/65">
            {copy.bio}
          </p>

          <a
            href="#work"
            className="hero-reveal mt-12 inline-flex items-center gap-2 u-mono text-[11px] uppercase tracking-[0.28em] text-theme-ink transition-colors hover:text-theme-accent"
            data-cursor-hover
          >
            <span className="border-b border-transparent pb-0.5 transition-colors hover:border-theme-accent">
              View work
            </span>
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>

      {/* ── BOTTOM META ─────────────────────────────────── */}
      <footer className="relative z-10 px-6 pb-8 sm:px-12 sm:pb-10">
        <div className="u-rule mb-5" />
        <div className="flex items-center justify-between">
          <span className="u-mono text-[10px] uppercase tracking-[0.28em] text-theme-ink/55">
            Creative developer / Hyderabad
          </span>
          <span className="u-mono text-[10px] uppercase tracking-[0.28em] text-theme-ink/55">
            IST {clock || '—'}
          </span>
        </div>
      </footer>
    </section>
  );
}
