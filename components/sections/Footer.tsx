'use client';

import { useTheme } from '@/components/theme/ThemeProvider';
import { SITE } from '@/lib/seo';

export function Footer() {
  const { theme } = useTheme();
  const isBatman = theme === 'batman';
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-theme-accent/10 px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        {/* Left — name and tagline */}
        <div className="text-center sm:text-left">
          <p className="font-display text-lg text-theme-ink">{SITE.name}</p>
          <p className="mt-0.5 text-xs text-theme-ink/40">
            {isBatman
              ? 'Order. Discipline. Precision.'
              : 'Chaos. Madness. Genius.'}
          </p>
        </div>

        {/* Center — multilingual */}
        <p className="text-xs text-theme-ink/20">
          {isBatman ? '\u6697\u95C7 \u00B7 \u6B63\u7FA9 \u00B7 \u5F71' : '\u091C\u094B\u0915\u0930 \u00B7 \u0905\u0930\u093E\u091C\u0915\u0924\u093E \u00B7 \u0916\u0947\u0932'}
        </p>

        {/* Right — copyright */}
        <p className="text-xs text-theme-ink/30">
          &copy; {year} {SITE.alias}
        </p>
      </div>
    </footer>
  );
}
