'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTheme } from '@/components/theme/ThemeProvider';
import { WireframeDecal } from '@/components/shared/WireframeDecal';

const LogoMarkScene = dynamic(
  () => import('@/components/three/LogoMark').then((m) => m.LogoMarkScene),
  { ssr: false },
);

const NF_COPY = {
  batman: {
    eyebrow: 'Case file missing',
    heading: 'Signal',
    headingAccent: 'lost.',
    body: "Even the world\u2019s greatest detective can\u2019t find this page. It doesn\u2019t exist in the Gotham archive.",
    cta: 'Return to base',
    status: 'ERR / 404',
  },
  'ancient-india': {
    eyebrow: 'The chronicle is missing',
    heading: 'A path',
    headingAccent: 'unwritten.',
    body: 'This route has drifted beyond the reach of dharma. Nothing inscribed here. Return to the ashrama.',
    cta: 'Return to the ashrama',
    status: '४०४',
  },
  futuristic: {
    eyebrow: '404 / signal lost',
    heading: 'Route',
    headingAccent: 'null.',
    body: 'The endpoint returned an empty payload. Re-align to root and try a different path.',
    cta: 'Return to root://',
    status: 'HTTP 404',
  },
} as const;

export default function NotFound() {
  const { theme } = useTheme();
  const copy = NF_COPY[theme];

  return (
    <main className="relative flex min-h-screen flex-col bg-theme-bg px-6 py-10 text-theme-ink sm:px-12">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <span className="u-mono text-[11px] uppercase tracking-[0.3em] text-theme-ink/60">
          Satya Tarun K
        </span>
        <span className="u-mono text-[11px] uppercase tracking-[0.3em] text-theme-accent">
          {copy.status}
        </span>
      </div>

      {/* Center */}
      <div className="grid flex-1 grid-cols-12 items-center gap-6 py-16">
        <div className="col-span-12 lg:col-span-7">
          <p className="u-mono mb-6 text-[11px] uppercase tracking-[0.3em] text-theme-accent">
            <span className="inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-theme-accent align-middle" />
            <span className="ml-3 align-middle">{copy.eyebrow}</span>
          </p>
          <h1 className="u-h1">
            <span className="block text-theme-ink">{copy.heading}</span>
            <span className="block text-theme-accent">{copy.headingAccent}</span>
          </h1>
          <div className="relative mt-8">
            {theme === 'batman' && (
              <>
                <WireframeDecal
                  variant="triangle"
                  opacity={0.45}
                  className="bat-wireframe-decal"
                  style={{ top: '-10%', left: '-4%', width: '28%', height: '120%' }}
                />
                <WireframeDecal
                  variant="ring"
                  opacity={0.55}
                  className="bat-wireframe-decal"
                  style={{ top: '-12%', right: '8%', width: '28%', height: '130%' }}
                />
              </>
            )}
            <p
              className={theme === 'batman' ? 'bat-stencil--accent' : 'font-display leading-[0.85] text-theme-ink/90'}
              style={
                theme === 'batman'
                  ? {
                      fontFamily: 'var(--font-stencil), var(--font-display), sans-serif',
                      fontWeight: 700,
                      fontSize: 'clamp(5rem, 22vw, 16rem)',
                      letterSpacing: '-0.045em',
                      lineHeight: 0.82,
                      color: 'hsl(var(--accent))',
                    }
                  : { fontSize: 'clamp(4rem, 18vw, 13rem)', letterSpacing: '-0.04em' }
              }
            >
              404
            </p>
          </div>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-theme-ink/65">
            {copy.body}
          </p>
          <Link
            href="/"
            data-cursor-hover
            className="mt-10 inline-flex items-center gap-2 u-mono text-[11px] uppercase tracking-[0.28em] text-theme-ink transition-colors hover:text-theme-accent"
          >
            <span className="border-b border-transparent pb-0.5 hover:border-theme-accent">
              {copy.cta}
            </span>
            <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="col-span-12 h-64 sm:h-80 lg:col-span-5 lg:h-[28rem]">
          <LogoMarkScene mode="hero" />
        </div>
      </div>

      <div className="u-rule" />
      <p className="mt-4 u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/40">
        Lost route · {new Date().getFullYear()} · Satya Tarun K
      </p>
    </main>
  );
}
