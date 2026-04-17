'use client';

/**
 * Last-resort fallback that runs outside the root layout.
 * It must render its own <html> and <body>. No ThemeProvider is available here,
 * so styles are inlined and theme-agnostic.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" data-theme="batman">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: '#14171f',
          color: '#ebe5ce',
          fontFamily:
            'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div style={{ maxWidth: 560, width: '100%' }}>
          <p
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              fontSize: 11,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#ff1919',
              margin: 0,
            }}
          >
            Critical fault
          </p>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              margin: '18px 0 12px',
              fontWeight: 500,
            }}
          >
            The site crashed.
          </h1>
          <p style={{ opacity: 0.7, margin: '0 0 24px', lineHeight: 1.6 }}>
            A critical error escaped all boundaries. Satya Tarun K apologises
            for the break in transmission. Try reloading the page.
          </p>
          {error?.message && (
            <code
              style={{
                display: 'block',
                fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                fontSize: 11,
                color: '#888',
                marginBottom: 24,
                wordBreak: 'break-word',
              }}
            >
              {error.message}
            </code>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              background: '#ff1919',
              color: '#14171f',
              border: 'none',
              padding: '12px 18px',
              borderRadius: 8,
              fontFamily: 'inherit',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
