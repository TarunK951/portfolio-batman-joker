'use client';

import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === 'batman' ? 'Joker' : 'Batman';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      className="fixed right-6 top-6 z-50 rounded-full border border-theme-accent/40 bg-theme-surface/60 px-4 py-2 font-display text-sm uppercase tracking-[0.3em] text-theme-ink backdrop-blur transition hover:border-theme-accent hover:shadow-glow"
    >
      {next}
    </button>
  );
}
