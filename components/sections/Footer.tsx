'use client';

import { useTheme } from '@/components/theme/ThemeProvider';
import { SITE } from '@/lib/seo';
import { ScrambleText } from '@/components/shared/ScrambleText';
import { LogoDock } from '@/components/three/PersistentLogo';
import { WireframeDecal } from '@/components/shared/WireframeDecal';
import { AiDivider } from '@/components/shared/AiDivider';

const FOOTER_COPY = {
  batman: { wordmark: 'GOTHAM', locale: 'SHADOW \u00B7 ORDER' },
  // कुरुक्षेत्र (Kurukshetra) — धर्म · कर्म · मोक्ष (dharma · karma · moksha)
  'ancient-india': { wordmark: '\u0915\u0941\u0930\u0941\u0915\u094D\u0937\u0947\u0924\u094D\u0930', locale: '\u0927\u0930\u094D\u092E \u00B7 \u0915\u0930\u094D\u092E \u00B7 \u092E\u094B\u0915\u094D\u0937' },
  futuristic: { wordmark: 'NEO//GRID', locale: 'SYS \u00B7 NET \u00B7 PULSE' },
} as const;

export function Footer() {
  const { theme } = useTheme();
  const copy = FOOTER_COPY[theme];
  const year = new Date().getFullYear();

  const isBatman = theme === 'batman';
  const isAI = theme === 'ancient-india';

  if (theme === 'futuristic') {
    return (
      <footer className="bg-theme-bg text-theme-ink">
        <div className="u-rule" />
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-6 sm:flex-row sm:items-center sm:px-10">
          <span className="fx-wordmark">satyatarun</span>
          <p className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/55">
            © {year} {SITE.name} — All rights reserved.
          </p>
          <nav className="flex items-center gap-5">
            {(['Discover', 'About', 'Contact'] as const).map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                data-cursor-hover
                className="u-mono text-[10px] uppercase tracking-[0.28em] text-theme-ink/55 transition-colors hover:text-theme-ink"
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-theme-bg text-theme-ink">
      {isAI ? (
        <div className="px-6 py-6 sm:px-10">
          <AiDivider />
        </div>
      ) : null}
      {/* Oversize wordmark */}
      <div className="relative border-t border-theme-line px-6 py-16 sm:px-10">
        {isBatman && (
          <WireframeDecal
            variant="diamond"
            opacity={0.45}
            className="bat-wireframe-decal"
            style={{ top: 12, right: 12, width: 140, height: 140 }}
          />
        )}
        <p
          className={
            isBatman
              ? 'bat-stencil break-all'
              : isAI
              ? 'ai-serif break-all leading-[0.85] text-theme-ink/90'
              : 'u-h1 break-all leading-[0.85] text-theme-ink/90'
          }
          style={{ fontSize: 'clamp(3rem, 18vw, 16rem)' }}
        >
          {isBatman ? 'GOTHAM' : copy.wordmark}
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
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <LogoDock id="footer" size="small" />
            <p className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/40">
              Locale
            </p>
            <p className="u-mono text-[11px] tracking-[0.15em] text-theme-ink/55">
              {copy.locale}
            </p>
          </div>
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
