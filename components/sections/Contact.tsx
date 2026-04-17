'use client';

import { useEffect, useRef } from 'react';
import { registerGsap } from '@/lib/gsap';
import { useTheme } from '@/components/theme/ThemeProvider';
import { SITE } from '@/lib/seo';

export function Contact() {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement | null>(null);
  const isBatman = theme === 'batman';

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = sectionRef.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.from('.contact-title', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: node, start: 'top 80%' },
      });
      gsap.from('.contact-content', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        delay: 0.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: node, start: 'top 75%' },
      });
    }, node);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        {/* Header */}
        <div className="contact-title">
          <p className="text-xs uppercase tracking-[0.4em] text-theme-accent">
            {isBatman ? 'The Signal' : 'Drop a Note'}
          </p>
          <h2 className="mt-2 font-display text-4xl text-theme-ink sm:text-6xl">
            {isBatman ? 'Light the Signal' : 'Leave a Card'}
          </h2>
        </div>

        <div className="contact-content mt-10 space-y-8">
          <p className="mx-auto max-w-lg text-base leading-relaxed text-theme-ink/60">
            {isBatman
              ? "Got a project that needs precision engineering and obsessive attention to detail? Let's talk."
              : "Got a wild idea that needs someone crazy enough to build it? I'm in."}
          </p>

          {/* CTA */}
          <a
            href={`mailto:${SITE.email}`}
            className="group inline-flex items-center gap-3 rounded-full border border-theme-accent/40 bg-theme-surface/50 px-8 py-4 font-display text-sm uppercase tracking-[0.3em] text-theme-ink transition-all hover:border-theme-accent hover:shadow-glow"
          >
            <span>{SITE.email}</span>
            <svg
              className="h-4 w-4 text-theme-accent transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>

          {/* Social hint */}
          <p className="text-xs text-theme-ink/30">
            Or find me where the signal reaches.
          </p>
        </div>
      </div>
    </section>
  );
}
