'use client';

import { useEffect, useRef, useState } from 'react';
import { registerGsap } from '@/lib/gsap';
import { useTheme } from '@/components/theme/ThemeProvider';

export function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = containerRef.current;
    if (!node) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setVisible(false),
      });

      // Fade in the symbol
      tl.from('.loading-symbol', {
        scale: 0.6,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Pulse the glow
      tl.to('.loading-symbol', {
        scale: 1.05,
        duration: 0.4,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1,
      });

      // Animate the tagline in
      tl.from(
        '.loading-tagline',
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.3',
      );

      // Hold briefly
      tl.to({}, { duration: 0.4 });

      // Wipe out
      tl.to('.loading-content', {
        opacity: 0,
        scale: 0.95,
        duration: 0.4,
        ease: 'power2.in',
      });

      tl.to(node, {
        yPercent: -100,
        duration: 0.7,
        ease: 'power3.inOut',
      });
    }, node);

    return () => ctx.revert();
  }, []);

  if (!visible) return null;

  const isBatman = theme === 'batman';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-theme-bg"
    >
      <div className="loading-content flex flex-col items-center gap-6">
        {/* Symbol */}
        <div
          className="loading-symbol flex h-24 w-24 items-center justify-center rounded-full border-2 border-theme-accent/40"
          style={{
            boxShadow: `0 0 60px hsl(var(--accent) / 0.3), inset 0 0 30px hsl(var(--accent) / 0.1)`,
          }}
        >
          <span className="font-display text-4xl text-theme-accent">
            {isBatman ? '\u{1F987}' : '\u{1F0CF}'}
          </span>
        </div>

        {/* Tagline */}
        <p className="loading-tagline font-display text-sm uppercase tracking-[0.5em] text-theme-ink/60">
          {isBatman ? 'The Dark Knight Rises' : 'Why So Serious?'}
        </p>
      </div>
    </div>
  );
}
