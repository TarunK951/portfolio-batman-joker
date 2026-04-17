'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTheme } from '@/components/theme/ThemeProvider';

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
  samurai: {
    eyebrow: 'The scroll is missing',
    heading: 'A path',
    headingAccent: 'unwritten.',
    body: 'This path has drifted beyond the brush. Nothing to read here. Return to the garden.',
    cta: 'Return to the dojo',
    status: '四〇四',
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
          <p
            className="mt-8 font-display leading-[0.85] text-theme-ink/90"
            style={{ fontSize: 'clamp(4rem, 18vw, 13rem)', letterSpacing: '-0.04em' }}
          >
            4<span className="text-theme-accent">0</span>4
          </p>
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
