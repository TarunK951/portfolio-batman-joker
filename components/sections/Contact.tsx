'use client';

import { useEffect, useRef } from 'react';
import { registerGsap } from '@/lib/gsap';
import { useTheme } from '@/components/theme/ThemeProvider';
import { SITE } from '@/lib/seo';
import { UButton } from '@/components/shared/UButton';
import { ScrambleText } from '@/components/shared/ScrambleText';
import { LogoDock } from '@/components/three/PersistentLogo';
import { WireframeDecal } from '@/components/shared/WireframeDecal';
import { CornerReticle } from '@/components/shared/CornerReticle';
import { AiDivider } from '@/components/shared/AiDivider';
import { PillCta } from '@/components/shared/PillCta';

const CONTACT_COPY = {
  batman: {
    heading: 'Light',
    body: 'Got a project that needs precision engineering and obsessive attention to detail? Let\u2019s talk.',
  },
  'ancient-india': {
    heading: 'Speak',
    body: 'Seeking work shaped by dharma — patient craft, restrained form, and quiet intent? I\u2019m listening.',
  },
  futuristic: {
    heading: 'Ping',
    body: 'Building something at the edge of the web? Real-time, spatial, data-heavy? Let\u2019s wire it up.',
  },
} as const;

export function Contact() {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement | null>(null);
  const copy = CONTACT_COPY[theme];

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

  const isBatman = theme === 'batman';
  const isFuturistic = theme === 'futuristic';

  if (isFuturistic) {
    return (
      <section
        ref={sectionRef}
        id="contact"
        className="relative u-section bg-theme-bg"
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
          <p className="contact-line u-mono text-[11px] uppercase tracking-[0.3em] text-theme-ink/55">
            [ 05 / the_signal ]
          </p>
          <h2
            className="contact-line text-theme-ink"
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 5rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              fontWeight: 500,
            }}
          >
            Ready to <span className="fx-italic-emph">ascend</span> your next
            project?
          </h2>
          <p className="contact-line max-w-xl text-[15px] leading-relaxed text-theme-ink/65">
            {copy.body}
          </p>
          <div className="contact-line mt-2 flex flex-wrap items-center justify-center gap-4">
            <PillCta href={`mailto:${SITE.email}`}>Get in Touch</PillCta>
            <a
              href={`https://github.com/${SITE.alias}`}
              data-cursor-hover
              className="u-mono text-[11px] uppercase tracking-[0.28em] text-theme-ink/60 transition-colors hover:text-theme-ink"
            >
              [ github / {SITE.alias} ]
            </a>
          </div>

          <div className="mt-16 w-full">
            <div className="u-rule mb-5" />
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <span className="fx-wordmark">satyatarun</span>
              <nav className="flex items-center gap-6">
                {(['Discover', 'About', 'Contact'] as const).map((l) => (
                  <a
                    key={l}
                    href={`#${l.toLowerCase()}`}
                    data-cursor-hover
                    className="u-mono text-[10px] uppercase tracking-[0.28em] text-theme-ink/55 transition-colors hover:text-theme-ink"
                  >
                    {l}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isBatman) {
    return (
      <section ref={sectionRef} id="contact" className="relative u-section u-paper">
        <div className="mx-auto max-w-7xl">
          <div className="relative">
            <WireframeDecal
              variant="ring"
              stroke="hsl(var(--accent))"
              opacity={0.45}
              className="bat-wireframe-decal"
              style={{ top: '-6%', right: '4%', width: '24%', height: '120%' }}
            />
            <WireframeDecal
              variant="diamond"
              opacity={0.3}
              className="bat-wireframe-decal"
              style={{ top: '10%', left: '2%', width: '12%', height: '80%' }}
            />
            <p className="contact-line u-mono mb-6 text-[11px] uppercase tracking-[0.3em]" style={{ color: 'hsl(var(--accent))' }}>
              [ 05 / THE_SIGNAL · CONTACT ]
            </p>
            <h2
              className="contact-line bat-stencil--accent"
              style={{
                fontFamily: 'var(--font-stencil), var(--font-display), sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(4.5rem, 17vw, 13.5rem)',
                letterSpacing: '-0.045em',
                lineHeight: 0.82,
                textTransform: 'uppercase',
                color: 'hsl(var(--accent))',
              }}
            >
              CONTACT
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-12 gap-6">
            <div className="col-span-12 sm:col-span-7">
              <p className="contact-line max-w-lg text-lg leading-relaxed">
                {copy.body}
              </p>
            </div>

            <div className="col-span-12 sm:col-span-5 flex flex-col gap-4 sm:items-end">
              <CornerReticle inset={0} size={20}>
                <a
                  href={`mailto:${SITE.email}`}
                  data-cursor-hover
                  className="bat-cta-bracket"
                  style={{ padding: '14px 22px' }}
                >
                  [ {SITE.email} ]
                </a>
              </CornerReticle>
              <a
                href={`https://github.com/${SITE.alias}`}
                data-cursor-hover
                className="u-mono text-[11px] uppercase tracking-[0.28em]"
                style={{ color: 'hsl(var(--bg) / 0.7)' }}
              >
                &gt;_GITHUB / {SITE.alias}
              </a>
            </div>
          </div>

          <div className="u-rule mt-20" />
          <div className="mt-6 grid grid-cols-12 gap-6">
            <p className="col-span-6 u-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
              [ AVAILABLE FOR FREELANCE · {new Date().getFullYear()} ]
            </p>
            <p className="col-span-6 u-mono text-right text-[10px] uppercase tracking-[0.3em] opacity-60">
              [ HYDERABAD · INDIA ]
            </p>
          </div>
        </div>
      </section>
    );
  }

  const isAI = theme === 'ancient-india';
  // Cream "breaker" treatment — Utopia uses paper sections for emphasis.
  // Under ancient-india the bg is already cream, so skip u-paper swap.
  return (
    <section
      ref={sectionRef}
      id="contact"
      className={isAI ? 'u-section bg-theme-bg' : 'u-section u-paper'}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 lg:col-span-8">
            <p className="u-mono mb-6 text-[11px] uppercase tracking-[0.3em] text-utopia-red">
              <ScrambleText text="[05] the signal · contact" trigger="inview" />
            </p>
            <h2 className="u-h2">
              <span className="contact-line block">{copy.heading}</span>
              <span className="contact-line block">
                <span className="text-utopia-red">the signal.</span>
              </span>
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:text-right">
            <div className="flex flex-col items-end gap-4">
              <LogoDock id="contact" size="small" />
              <p className="u-mono text-[11px] uppercase tracking-[0.3em] opacity-50">
                Response / 24h
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-12 gap-6">
          <div className="col-span-12 sm:col-span-7">
            <p className="contact-line max-w-lg text-lg leading-relaxed">
              {copy.body}
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

        {theme === 'ancient-india' ? (
          <div className="mt-20"><AiDivider /></div>
        ) : (
          <div className="u-rule mt-20" />
        )}
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
