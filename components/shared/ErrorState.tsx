'use client';

import { useTheme } from '@/components/theme/ThemeProvider';
import { UButton } from '@/components/shared/UButton';

type Variant = 'runtime' | 'network';

const COPY: Record<Variant, Record<'batman' | 'samurai' | 'futuristic', { eyebrow: string; heading: string; body: string; cta: string }>> = {
  runtime: {
    batman: {
      eyebrow: 'System fault',
      heading: 'The signal broke.',
      body: 'Something went wrong on the client. The shadows returned a fault. Try again, or head back to base.',
      cta: 'Retry',
    },
    samurai: {
      eyebrow: 'The brush slipped',
      heading: 'A stroke out of place.',
      body: 'The page took a wrong turn. Stillness first — then try again.',
      cta: 'Try again',
    },
    futuristic: {
      eyebrow: 'runtime / exception',
      heading: 'Unhandled exception.',
      body: 'The client crashed. The trace has been captured locally. Replay the request or return to root.',
      cta: 'Replay',
    },
  },
  network: {
    batman: {
      eyebrow: 'Comms down',
      heading: 'No response from the field.',
      body: 'Couldn\u2019t reach the source. The network is dark. Check your connection and try again.',
      cta: 'Try again',
    },
    samurai: {
      eyebrow: 'The messenger is late',
      heading: 'The path is quiet.',
      body: 'No word came back. The network is still. Wait, then try again.',
      cta: 'Retry',
    },
    futuristic: {
      eyebrow: 'net / offline',
      heading: 'Network unreachable.',
      body: 'Upstream returned no payload. Reconnect and retry the handshake.',
      cta: 'Reconnect',
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
