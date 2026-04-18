'use client';

import { useEffect, useRef, useState } from 'react';
import { registerGsap } from '@/lib/gsap';
import { useTheme, type Theme } from '@/components/theme/ThemeProvider';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { DepthText } from '@/components/shared/DepthText';
import { LogoDock } from '@/components/three/PersistentLogo';
import { ancientIndiaCopy } from '@/data/ancientIndiaCopy';
import { hindiCopy } from '@/data/hindiCopy';
import { Compass } from '@/components/shared/Compass';
import { UnrollText } from '@/components/shared/UnrollText';

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

  const isAI = theme === 'ancient-india';

  if (isAI) {
    return <AncientIndiaHero sectionRef={sectionRef} clock={clock} tag={copy.tag} />;
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen w-full flex-col bg-theme-bg text-theme-ink"
      style={{ willChange: 'transform' }}
    >
      <ThemeToggle />

      <header className="relative z-10 flex items-center justify-between gap-4 px-6 pt-8 sm:px-12 sm:pt-10">
        <span className="hero-reveal u-mono text-[11px] uppercase tracking-[0.22em] text-theme-ink/70">
          satyatarun
        </span>

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
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 py-10 text-center sm:px-12">
        <p className="hero-reveal u-mono text-[10px] uppercase tracking-[0.32em] text-theme-ink/55">
          <span className="inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-theme-accent align-middle" />
          <span className="ml-3 align-middle">{copy.eyebrow}</span>
        </p>

        <div className="hero-reveal" style={{ willChange: 'transform' }} aria-hidden>
          <LogoDock id="hero" size="xl" />
        </div>

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

        <p className="hero-reveal u-mono text-[11px] uppercase tracking-[0.3em] text-theme-ink/55">
          Satya Tarun K
          <span className="mx-2 text-theme-accent">·</span>
          Creative Developer
        </p>

        <p className="hero-reveal max-w-[560px] text-[15px] leading-relaxed text-theme-ink/70">
          {copy.subline}
        </p>

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

      <footer className="relative z-10 px-6 pb-8 sm:px-12 sm:pb-10">
        <div className="u-rule mb-5" />
        <div className="flex items-center justify-between gap-4">
          <span className="u-mono text-[10px] uppercase tracking-[0.28em] text-theme-ink/55">
            {copy.tag}
          </span>
          <span className="u-mono text-[10px] uppercase tracking-[0.28em] text-theme-ink/55">
            IST {clock || '—'}
          </span>
        </div>
      </footer>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Ancient-India branch                           */
/* -------------------------------------------------------------------------- */

function AncientIndiaHero({
  sectionRef,
  clock,
  tag,
}: {
  sectionRef: React.Ref<HTMLElement>;
  clock: string;
  tag: string;
}) {
  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen w-full flex-col bg-theme-bg text-theme-ink"
      style={{ willChange: 'transform' }}
    >
      <ThemeToggle />

      {/* TOP BAR */}
      <header className="relative z-10 flex items-start justify-between gap-4 px-8 pt-10 sm:px-16">
        <div className="hero-reveal flex flex-col gap-1">
          <span className="u-mono text-[10px] uppercase tracking-[0.28em] text-theme-ink/55">
            [ 01 ] arrival
            {' '}
            <span aria-hidden className="text-theme-ink/30">॥</span>
            {' '}
            <span className="ai-devanagari text-theme-accent/80">{hindiCopy.arrival}</span>
            {' '}
            <span aria-hidden className="text-theme-ink/30">॥</span>
          </span>
          <span className="ai-devanagari text-[11px] text-theme-accent/80">
            कुरुक्षेत्रम्
          </span>
        </div>
        <a href="#work" data-cursor-hover className="hero-reveal ai-pill-cta">
          <span className="ai-pill-cta__square" aria-hidden />
          <span>Skill Hub</span>
        </a>
      </header>

      {/* TWO-LINE MANIFESTO — second half muted */}
      <div className="relative z-10 mx-auto mt-10 flex max-w-3xl flex-col items-center gap-2 px-6 text-center">
        <UnrollText
          as="p"
          text="To master the code is to"
          className="hero-reveal ai-serif text-theme-ink text-[clamp(1.1rem,2vw,1.6rem)] leading-snug"
          stagger={0.03}
          delay={0.2}
        />
        <UnrollText
          as="p"
          text="master the self."
          className="hero-reveal ai-serif-italic ai-headline-muted text-[clamp(1.1rem,2vw,1.6rem)] leading-snug"
          stagger={0.03}
          delay={0.55}
        />
      </div>

      {/* COMPASS + logo */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
        <div className="hero-reveal" aria-hidden>
          <Compass label="FLOW CONTROL">
            <LogoDock id="hero" size="xl" />
          </Compass>
        </div>
      </div>

      {/* BOTTOM SPLIT MANIFESTO */}
      <footer className="relative z-10 grid grid-cols-12 items-end gap-6 px-8 pb-10 sm:px-16">
        <p className="hero-reveal col-span-12 sm:col-span-4 ai-serif-italic text-[15px] leading-relaxed text-theme-ink/75">
          To master the String…
        </p>
        <p className="hero-reveal col-span-12 sm:col-span-4 text-center u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/50">
          ( ˄ )
        </p>
        <p className="hero-reveal col-span-12 sm:col-span-4 sm:text-right ai-serif-italic text-[15px] leading-relaxed text-theme-ink/75">
          is to master the code.
        </p>
        <div className="col-span-12 mt-4 flex items-center justify-between u-mono text-[10px] uppercase tracking-[0.28em] text-theme-ink/45">
          <span>{tag}</span>
          <span>IST {clock || '—'}</span>
        </div>
      </footer>
    </section>
  );
}
