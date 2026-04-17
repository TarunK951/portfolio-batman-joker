'use client';

import { useTheme } from '@/components/theme/ThemeProvider';
import { UButton } from '@/components/shared/UButton';

const NF_COPY = {
  batman: {
    eyebrow: 'Case file missing',
    body: 'Even the world\u2019s greatest detective can\u2019t find this page. It doesn\u2019t exist.',
    cta: 'Return to the Batcave',
  },
  samurai: {
    eyebrow: 'Scroll missing',
    body: 'This path has drifted beyond the brush. Nothing to read here.',
    cta: 'Return to the dojo',
  },
  futuristic: {
    eyebrow: '404 / signal lost',
    body: 'Route not resolved. The endpoint returned a null payload. Re-align to root.',
    cta: 'Return to root://',
  },
} as const;

export default function NotFound() {
  const { theme } = useTheme();
  const copy = NF_COPY[theme];

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
        <p className="u-eyebrow mb-6">{copy.eyebrow}</p>
        <h1
          className="font-display leading-[0.85] text-theme-ink"
          style={{ fontSize: 'clamp(5rem, 22vw, 18rem)', letterSpacing: '-0.04em' }}
        >
          4<span className="text-theme-accent">0</span>4
        </h1>
        <p className="mt-8 max-w-md text-base text-theme-ink/65">{copy.body}</p>
        <div className="mt-10">
          <UButton variant="red" href="/">
            {copy.cta}
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
