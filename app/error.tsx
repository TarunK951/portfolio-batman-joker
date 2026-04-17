'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/shared/ErrorState';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to devtools — add telemetry hook here if wired up later
    // eslint-disable-next-line no-console
    console.error('[app/error]', error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-theme-bg px-6 py-16 sm:px-10">
      <div className="mx-auto w-full max-w-3xl">
        <ErrorState variant="runtime" onRetry={reset} error={error} />
      </div>
    </main>
  );
}
