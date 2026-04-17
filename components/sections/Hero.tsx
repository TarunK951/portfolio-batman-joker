'use client';

import { useEffect, useRef, useState } from 'react';
import { registerGsap } from '@/lib/gsap';
import { useTheme, type Theme } from '@/components/theme/ThemeProvider';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { DepthText } from '@/components/shared/DepthText';
import { LogoDock } from '@/components/three/PersistentLogo';
import { ancientIndiaCopy } from '@/data/ancientIndiaCopy';
import { StackHeadline } from '@/components/shared/StackHeadline';
import { LogoCard } from '@/components/shared/LogoCard';
import { Compass } from '@/components/shared/Compass';
import { UnrollText } from '@/components/shared/UnrollText';

/**
 * Hero — multi-theme. Futuristic branch mirrors 8bit.ai + ascend:
 * wordmark / hamburger chrome, scroll-cycling stacked headline on the
 * left, bright white R3F logo centre, italic-serif mission line right,
 * mono scroll-prompt + copyright rail at the bottom.
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
  const isAI = theme === 'ancient-india';

  if (isFuturistic) {
    return <FuturisticHero sectionRef={sectionRef} clock={clock} />;
  }

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
/*                              Futuristic branch                             */
/* -------------------------------------------------------------------------- */

function FuturisticHero({
  sectionRef,
  clock,
}: {
  sectionRef: React.Ref<HTMLElement>;
  clock: string;
}) {
  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen w-full flex-col bg-theme-bg text-theme-ink"
      style={{ willChange: 'transform' }}
    >
      <ThemeToggle />

      <header className="relative z-10 flex items-center justify-between gap-4 px-6 pt-6 sm:px-10 sm:pt-8">
        <span className="hero-reveal fx-wordmark">satyatarun</span>
        <div className="hero-reveal flex items-center gap-5">
          <span className="fx-hamburger" aria-hidden>
            <span />
            <span />
            <span />
          </span>
          <span className="fx-avatar" aria-hidden />
        </div>
      </header>

      <div className="relative z-10 grid flex-1 grid-cols-12 items-center gap-6 px-6 py-10 sm:px-10">
        <div className="hero-reveal col-span-12 md:col-span-5">
          <p className="u-mono mb-5 text-[10px] uppercase tracking-[0.3em] text-theme-ink/55">
            [ 01 / arrival ]
          </p>
          <StackHeadline
            stateA={['Accelerating', 'Enterprise', '*Creative* Developer']}
            stateB={['AI-as-a-Service', 'Bespoke Solutions', 'for *You.*']}
          />
          <p className="u-mono mt-6 text-[11px] uppercase tracking-[0.28em] text-theme-ink/55">
            Satya Tarun K <span className="mx-2 text-theme-ink/30">·</span>
            Hyderabad / IN
          </p>
        </div>

        <div className="col-span-12 flex items-center justify-center gap-6 md:col-span-4">
          <div className="hero-reveal" style={{ willChange: 'transform' }} aria-hidden>
            <LogoDock id="hero" size="xl" />
          </div>
          <div className="hero-reveal hidden flex-col gap-2 md:flex" aria-hidden>
            <span className="fx-hex">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.2" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.5 2.5M16.5 16.5L19 19M5 19l2.5-2.5M16.5 7.5L19 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </span>
            <span className="fx-hex">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 17l5-5 4 4 7-9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>

        <div className="hero-reveal col-span-12 md:col-span-3">
          <p className="u-mono mb-4 text-[10px] uppercase tracking-[0.3em] text-theme-ink/45">
            [ mission ]
          </p>
          <p className="text-[22px] leading-[1.2] text-theme-ink/90">
            <span className="fx-italic-emph">Order meets chaos.</span>
            <br />
            <span className="text-[15px] leading-[1.55] text-theme-ink/65">
              Shipping real-time, high-signal surfaces — latency low, intent
              high.
            </span>
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <LogoCard size="sm">
              <div className="flex flex-col items-start gap-1 text-left">
                <span className="u-mono text-[9px] uppercase tracking-[0.24em] text-theme-ink/50">
                  Latency
                </span>
                <span className="u-mono text-[14px] text-theme-ink">12ms</span>
              </div>
            </LogoCard>
            <LogoCard size="sm">
              <div className="flex flex-col items-start gap-1 text-left">
                <span className="u-mono text-[9px] uppercase tracking-[0.24em] text-theme-ink/50">
                  Region
                </span>
                <span className="u-mono text-[14px] text-theme-ink">BLR-1</span>
              </div>
            </LogoCard>
          </div>
        </div>
      </div>

      <footer className="relative z-10 px-6 pb-6 sm:px-10 sm:pb-8">
        <div className="mb-5 flex items-center justify-center">
          <span className="u-mono text-[10px] uppercase tracking-[0.32em] text-theme-ink/55">
            Scroll Down To Continue{' '}
            <span className="ml-2 align-middle text-theme-ink/80">↓</span>
          </span>
        </div>
        <div className="u-rule mb-4" />
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <span className="u-mono text-[10px] uppercase tracking-[0.28em] text-theme-ink/50">
            © {new Date().getFullYear()} Satya Tarun K — This site uses
            technical cookies only.
          </span>
          <span className="u-mono text-[10px] uppercase tracking-[0.28em] text-theme-ink/50">
            [ ist {clock || '—'} ]
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
            satyatarun · est. mmxxv
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
