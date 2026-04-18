'use client';

import { useTheme } from '@/components/theme/ThemeProvider';
import { UButton } from '@/components/shared/UButton';

type Variant = 'runtime' | 'network';

const COPY: Record<Variant, Record<'batman' | 'ancient-india', { eyebrow: string; heading: string; body: string; cta: string }>> = {
  runtime: {
    batman: {
      eyebrow: 'System fault',
      heading: 'The signal broke.',
      body: 'Something went wrong on the client. The shadows returned a fault. Try again, or head back to base.',
      cta: 'Retry',
    },
    'ancient-india': {
      eyebrow: 'The arrow strayed',
      heading: 'An arrow off its mark.',
      body: 'The page wandered from its dharma. Draw breath — then try the path once more.',
      cta: 'Try again',
    },
  },
  network: {
    batman: {
      eyebrow: 'Comms down',
      heading: 'No response from the field.',
      body: 'Couldn\u2019t reach the source. The network is dark. Check your connection and try again.',
      cta: 'Try again',
    },
    'ancient-india': {
      eyebrow: 'The messenger is delayed',
      heading: 'The path is silent.',
      body: 'No word returned from the field. The network is still. Wait, then try again.',
      cta: 'Retry',
    },
  },
};

type Props = {
  variant?: Variant;
  onRetry?: () => void;
  error?: Error;
};

export function ErrorState({ variant = 'runtime', onRetry, error }: Props) {
  const { theme } = useTheme();
  const copy = COPY[variant][theme];

  return (
    <div className="flex w-full flex-col items-start gap-6 rounded-lg border border-theme-ink/10 bg-theme-surface/40 p-8 text-theme-ink sm:p-12">
      <p className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-accent">
        {copy.eyebrow}
      </p>
      <h3 className="u-h3 max-w-xl text-theme-ink">{copy.heading}</h3>
      <p className="max-w-md text-sm leading-relaxed text-theme-ink/65">{copy.body}</p>
      {error?.message && (
        <code className="u-mono block max-w-full truncate text-[11px] tracking-[0.05em] text-theme-ink/40">
          {error.message}
        </code>
      )}
      {onRetry && (
        <UButton variant="red" onClick={onRetry}>
          {copy.cta}
        </UButton>
      )}
    </div>
  );
}
