'use client';

import { useEffect, useRef } from 'react';
import { registerGsap } from '@/lib/gsap';
import { useTheme } from '@/components/theme/ThemeProvider';
import { SITE } from '@/lib/seo';
import { UButton } from '@/components/shared/UButton';
import { ScrambleText } from '@/components/shared/ScrambleText';

export function Contact() {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement | null>(null);
  const isBatman = theme === 'batman';

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = sectionRef.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.from('.contact-line', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: node, start: 'top 75%' },
      });
    }, node);
    return () => ctx.revert();
  }, []);

  // Cream "breaker" treatment — Utopia uses paper sections for emphasis
  return (
    <section ref={sectionRef} id="contact" className="u-section u-paper">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 lg:col-span-8">
            <p className="u-mono mb-6 text-[11px] uppercase tracking-[0.3em] text-utopia-red">
              <ScrambleText text="(04) Contact" trigger="inview" />
            </p>
            <h2 className="u-h2">
              <span className="contact-line block">
                {isBatman ? 'Light' : 'Drop'}
              </span>
              <span className="contact-line block">
                <span className="text-utopia-red">the signal.</span>
              </span>
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:text-right">
            <p className="u-mono text-[11px] uppercase tracking-[0.3em] opacity-50">
              Response / 24h
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-12 gap-6">
          <div className="col-span-12 sm:col-span-7">
            <p className="contact-line max-w-lg text-lg leading-relaxed">
              {isBatman
                ? 'Got a project that needs precision engineering and obsessive attention to detail? Let\u2019s talk.'
                : 'Got a wild idea that needs someone bold enough to build it? I\u2019m in.'}
            </p>
          </div>

          <div className="col-span-12 sm:col-span-5 flex flex-col gap-4 sm:items-end">
            <UButton variant="red" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </UButton>
            <UButton variant="dark" href={`https://github.com/${SITE.alias}`}>
              GitHub / {SITE.alias}
            </UButton>
          </div>
        </div>

        <div className="u-rule mt-20" />
        <div className="mt-6 grid grid-cols-12 gap-6">
          <p className="col-span-6 u-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
            Available for freelance · {new Date().getFullYear()}
          </p>
          <p className="col-span-6 u-mono text-right text-[10px] uppercase tracking-[0.3em] opacity-60">
            Hyderabad, India
          </p>
        </div>
      </div>
    </section>
  );
}
