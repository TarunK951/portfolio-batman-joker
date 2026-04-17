'use client';

import { useTheme } from '@/components/theme/ThemeProvider';
import { SITE } from '@/lib/seo';
import { ScrambleText } from '@/components/shared/ScrambleText';

const FOOTER_COPY = {
  batman: { wordmark: 'GOTHAM', locale: '\u6697\u95C7 \u00B7 \u6B63\u7FA9' },
  samurai: { wordmark: '\u6C5F\u6238', locale: '\u4F8D \u00B7 \u9759\u5BC2' }, // 江戸 · 侍 静寂
  futuristic: { wordmark: 'NEO//GRID', locale: 'SYS \u00B7 NET \u00B7 PULSE' },
} as const;

export function Footer() {
  const { theme } = useTheme();
  const copy = FOOTER_COPY[theme];
  const year = new Date().getFullYear();

  return (
    <footer className="bg-theme-bg text-theme-ink">
      {/* Oversize wordmark */}
      <div className="border-t border-theme-line px-6 py-16 sm:px-10">
        <p
          className="u-h1 break-all leading-[0.85] text-theme-ink/90"
          style={{ fontSize: 'clamp(3rem, 18vw, 16rem)' }}
        >
          {copy.wordmark}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6 border-t border-theme-line px-6 py-10 sm:px-10">
        <div className="col-span-12 sm:col-span-4">
          <p className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/40">
            Site
          </p>
          <p className="mt-2 text-sm">{SITE.name}</p>
          <p className="text-sm text-theme-ink/55">@{SITE.alias}</p>
        </div>
        <div className="col-span-6 sm:col-span-3">
          <p className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/40">
            Index
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            <li><a href="#work" data-cursor-hover className="hover:text-theme-accent"><ScrambleText text="Work" /></a></li>
            <li><a href="#about" data-cursor-hover className="hover:text-theme-accent"><ScrambleText text="About" /></a></li>
            <li><a href="#contact" data-cursor-hover className="hover:text-theme-accent"><ScrambleText text="Contact" /></a></li>
          </ul>
        </div>
        <div className="col-span-6 sm:col-span-3">
          <p className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/40">
            Elsewhere
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            <li><a href={`mailto:${SITE.email}`} data-cursor-hover className="hover:text-theme-accent"><ScrambleText text="Email" /></a></li>
            <li><a href={`https://github.com/${SITE.alias}`} data-cursor-hover className="hover:text-theme-accent"><ScrambleText text="GitHub" /></a></li>
            <li><a href="#" data-cursor-hover className="hover:text-theme-accent"><ScrambleText text="Twitter" /></a></li>
          </ul>
        </div>
        <div className="col-span-12 sm:col-span-2 sm:text-right">
          <p className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/40">
            Locale
          </p>
          <p className="mt-2 u-mono text-[11px] tracking-[0.15em] text-theme-ink/55">
            {copy.locale}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 border-t border-theme-line px-6 py-5 sm:flex-row sm:items-center sm:px-10">
        <p className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/40">
          &copy; {year} {SITE.name} — All rights reserved
        </p>
        <p className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/40">
          Built with Next.js · R3F · GSAP
        </p>
      </div>
    </footer>
  );
}
