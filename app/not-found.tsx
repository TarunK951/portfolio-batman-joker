'use client';

import Link from 'next/link';
import { useTheme } from '@/components/theme/ThemeProvider';

export default function NotFound() {
  const { theme } = useTheme();
  const isBatman = theme === 'batman';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-[8rem] leading-none text-theme-accent/20 sm:text-[12rem]">
        404
      </p>
      <h1 className="mt-2 font-display text-3xl text-theme-ink sm:text-5xl">
        {isBatman ? 'Case File Not Found' : 'Wrong Punchline'}
      </h1>
      <p className="mt-4 max-w-md text-sm text-theme-ink/50">
        {isBatman
          ? "Even the world's greatest detective can't find this page. It doesn't exist."
          : "Ha ha ha... this page is gone. Like a bad joke nobody remembers."}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full border border-theme-accent/40 bg-theme-surface/50 px-6 py-3 font-display text-sm uppercase tracking-[0.3em] text-theme-ink transition-all hover:border-theme-accent hover:shadow-glow"
      >
        {isBatman ? 'Return to the Batcave' : 'Back to the Funhouse'}
      </Link>
    </main>
  );
}
