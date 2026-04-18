'use client';

/**
 * SmartImage
 * ------------------------------------------------------------------
 * Wraps a native <img>. On error, swaps to a themed fallback tile
 * showing the first 2 letters of `name`, over a theme-accent
 * gradient. Safe for placeholder paths that 404.
 */

import { useState } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/cn';

interface SmartImageProps {
  src: string;
  alt: string;
  name: string;
  className?: string;
  aspectClassName?: string;
}

export function SmartImage({
  src,
  alt,
  name,
  className,
  aspectClassName = 'aspect-[2/3]',
}: SmartImageProps) {
  const [errored, setErrored] = useState(false);
  const { theme } = useTheme();

  const initials = name
    .replace(/^The\s+/i, '')
    .trim()
    .slice(0, 2)
    .toUpperCase();

  const gradient =
    theme === 'ancient-india'
      ? 'linear-gradient(135deg, hsl(var(--surface)) 0%, hsl(var(--accent) / 0.35) 100%)'
      : 'linear-gradient(135deg, hsl(var(--surface)) 0%, hsl(var(--accent) / 0.3) 100%)';

  if (errored) {
    return (
      <div
        className={cn(
          'relative flex w-full items-center justify-center overflow-hidden border border-theme-accent/20',
          aspectClassName,
          className,
        )}
        style={{ background: gradient }}
        role="img"
        aria-label={alt}
      >
        <span
          className="font-display text-theme-ink/80"
          style={{
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            letterSpacing: '-0.04em',
            textShadow: '0 2px 12px hsl(var(--accent) / 0.4)',
          }}
        >
          {initials}
        </span>
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 40px hsl(var(--accent) / 0.18)',
          }}
        />
      </div>
    );
  }

  return (
    // Next/Image can't handle unknown-dim broken URLs gracefully;
    // a bare <img> + onError is the clean primitive here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className={cn('h-full w-full object-cover', className)}
      loading="lazy"
      decoding="async"
    />
  );
}
