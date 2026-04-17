'use client';

import { useTheme } from '@/components/theme/ThemeProvider';
import { UButton } from '@/components/shared/UButton';

export default function NotFound() {
  const { theme } = useTheme();
  const isBatman = theme === 'batman';

  return (
    <main className="flex min-h-screen flex-col bg-theme-bg px-6 py-10 text-theme-ink sm:px-10">
      <div className="flex items-center justify-between">
        <span className="u-mono text-[11px] uppercase tracking-[0.3em] text-theme-ink/60">
          Satya Tarun K
        </span>
        <span className="u-mono text-[11px] uppercase tracking-[0.3em] text-theme-accent">
          ERROR / 404
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <p className="u-eyebrow mb-6">
          {isBatman ? 'Case file missing' : 'Wrong punchline'}
        </p>
        <h1
          className="font-display leading-[0.85] text-theme-ink"
          style={{ fontSize: 'clamp(5rem, 22vw, 18rem)', letterSpacing: '-0.04em' }}
        >
          4<span className="text-theme-accent">0</span>4
        </h1>
        <p className="mt-8 max-w-md text-base text-theme-ink/65">
          {isBatman
            ? "Even the world\u2019s greatest detective can\u2019t find this page. It doesn\u2019t exist."
            : 'Ha ha ha\u2026 this page is gone. Like a bad joke nobody remembers.'}
        </p>
        <div className="mt-10">
          <UButton variant="red" href="/">
            {isBatman ? 'Return to the Batcave' : 'Back to the Funhouse'}
          </UButton>
        </div>
      </div>

      <div className="u-rule" />
      <p className="mt-4 u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/40">
        Lost route · {new Date().getFullYear()}
      </p>
    </main>
  );
}
