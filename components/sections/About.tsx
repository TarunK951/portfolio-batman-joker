'use client';

import { useEffect, useRef } from 'react';
import { registerGsap } from '@/lib/gsap';
import { useTheme } from '@/components/theme/ThemeProvider';
import { ScrambleText } from '@/components/shared/ScrambleText';
import { LogoDock } from '@/components/three/PersistentLogo';
import { AiDivider } from '@/components/shared/AiDivider';
import { LogoCard } from '@/components/shared/LogoCard';

const skills = [
  { name: 'Next.js / React', level: 95 },
  { name: 'TypeScript', level: 92 },
  { name: 'Three.js / R3F', level: 85 },
  { name: 'GSAP / Motion', level: 90 },
  { name: 'Tailwind CSS', level: 95 },
  { name: 'UI/UX Design', level: 88 },
  { name: 'Supabase / Backend', level: 80 },
  { name: 'Product Thinking', level: 90 },
];

const timeline = [
  { year: 'Now', label: 'Building world-class products' },
  { year: '2024', label: 'Full-stack product development' },
  { year: '2023', label: 'Frontend engineering & design systems' },
  { year: '2022', label: 'Started coding journey' },
];

const ABOUT_COPY = {
  batman: {
    lead: 'The detective',
    tail: 'discipline.',
    bio: "I'm Satya Tarun K — a full-stack product developer who builds with the discipline Batman brings to Gotham. Every pixel planned, every interaction deliberate.",
  },
  'ancient-india': {
    lead: 'The bow-smith',
    tail: 'dharma.',
    bio: "I'm Satya Tarun K — a full-stack product developer who builds like a dhanush-smith on the field of Kurukshetra. Few arrows, each loosed with intent. Craft is the quiet between the strings.",
  },
  futuristic: {
    lead: 'The operator',
    tail: 'the signal.',
    bio: "I'm Satya Tarun K — a full-stack product developer engineering interfaces at the edge. Real-time systems, clean data paths, tomorrow's surface today.",
  },
} as const;

export function About() {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement | null>(null);
  const copy = ABOUT_COPY[theme];

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = sectionRef.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.from('.about-title-line', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: node, start: 'top 75%' },
      });
      gsap.utils.toArray<HTMLElement>('.skill-bar-fill').forEach((bar) => {
        const level = Number(bar.dataset.level) || 0;
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: level / 100,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: bar, start: 'top 90%' },
          },
        );
      });
      gsap.utils.toArray<HTMLElement>('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
          x: -30,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: item, start: 'top 92%' },
        });
      });
    }, node);
    return () => ctx.revert();
  }, []);

  if (theme === 'futuristic') {
    return (
      <section ref={sectionRef} id="about" className="u-section bg-theme-bg">
        <div className="mx-auto max-w-6xl">
          <p className="u-mono mb-8 text-[11px] uppercase tracking-[0.3em] text-theme-ink/55">
            [ 04 / the_operator ]
          </p>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-8">
              <p
                className="text-theme-ink/90"
                style={{
                  fontSize: 'clamp(1.8rem, 4.5vw, 3.6rem)',
                  lineHeight: 1.08,
                  letterSpacing: '-0.02em',
                }}
              >
                <span className="fx-italic-emph">One bad day</span> is all it
                takes to build{' '}
                <span className="fx-italic-emph">something</span> that outlives
                the noise.
              </p>
              <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-theme-ink/65">
                {copy.bio}
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 flex justify-end">
              <LogoDock id="about" size="small" />
            </div>
          </div>

          <div className="u-rule mt-16 mb-10" />

          <p className="u-mono mb-6 text-[10px] uppercase tracking-[0.3em] text-theme-ink/45">
            [ arsenal ] :: capabilities
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {skills.map((skill, i) => (
              <LogoCard
                key={skill.name}
                size="sm"
                notched={i % 5 === 0}
                className="!items-stretch !justify-start !text-left"
                style={{ minHeight: 110 }}
              >
                <div className="flex h-full w-full flex-col justify-between gap-3 text-left">
                  <span className="u-mono text-[9px] uppercase tracking-[0.24em] text-theme-ink/45">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[14px] text-theme-ink">
                    {skill.name}
                  </span>
                  <span className="u-mono text-[10px] tracking-[0.14em] text-theme-ink/70">
                    {skill.level}/100
                  </span>
                </div>
              </LogoCard>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-4">
            {timeline.map((item) => (
              <LogoCard
                key={item.year}
                size="sm"
                className="!items-stretch !justify-start"
              >
                <div className="flex w-full flex-col gap-1 text-left">
                  <span className="u-mono text-[10px] uppercase tracking-[0.24em] text-theme-ink/80">
                    {item.year}
                  </span>
                  <span className="text-[13px] leading-snug text-theme-ink/70">
                    {item.label}
                  </span>
                </div>
              </LogoCard>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="about" className="u-section bg-theme-bg">
      <div className="mx-auto max-w-7xl">
        {/* Header — Utopia oversize numbered */}
        <div className="grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 lg:col-span-8">
            <p className="u-mono mb-6 text-[11px] uppercase tracking-[0.3em] text-theme-accent">
              <ScrambleText text="[04] the journey · about" trigger="inview" />
            </p>
            <h2 className="u-h2">
              <span className="about-title-line block text-theme-ink">
                {copy.lead}
              </span>
              <span className="about-title-line block text-theme-ink/35">
                behind the
              </span>
              <span className="about-title-line block text-theme-accent">
                {copy.tail}
              </span>
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:text-right">
            <div className="flex flex-col items-end gap-4">
              <LogoDock id="about" size="small" />
              <div>
                <p className="u-mono text-[11px] uppercase tracking-[0.3em] text-theme-ink/40">
                  File / Personnel
                </p>
                <p className="mt-1 u-mono text-[11px] tracking-[0.2em] text-theme-ink/70">
                  ID-0951 · Hyderabad / IN
                </p>
              </div>
            </div>
          </div>
        </div>

        {theme === 'ancient-india' ? (
          <div className="mt-10"><AiDivider /></div>
        ) : (
          <div className="u-rule mt-10" />
        )}

        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-16">
          {/* Bio + Timeline */}
          <div className="col-span-12 lg:col-span-7">
            <p className="text-xl leading-relaxed text-theme-ink/85 sm:text-2xl">
              {copy.bio}
            </p>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-theme-ink/55">
              I ship production-grade web applications with Next.js, Three.js,
              and GSAP. Performance, accessibility, and visual polish aren&rsquo;t
              afterthoughts — they&rsquo;re the foundation.
            </p>

            <div className="mt-12 space-y-3">
              <p className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/40">
                Journey
              </p>
              {timeline.map((item) => (
                <div
                  key={item.year}
                  className="timeline-item flex items-baseline gap-6 border-b border-theme-line py-3"
                >
                  <span className="w-16 shrink-0 u-mono text-xs uppercase tracking-[0.2em] text-theme-accent">
                    {item.year}
                  </span>
                  <span className="flex-1 text-sm text-theme-ink/75">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="col-span-12 lg:col-span-5">
            <p className="u-mono mb-6 text-[10px] uppercase tracking-[0.3em] text-theme-ink/40">
              Arsenal / Capabilities
            </p>
            <div className="space-y-5">
              {skills.map((skill) => (
                <div key={skill.name} className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-theme-ink/85">
                      {skill.name}
                    </span>
                    <span className="u-mono text-[11px] tracking-[0.15em] text-theme-accent">
                      {skill.level}/100
                    </span>
                  </div>
                  <div className="relative h-px bg-theme-ink/15">
                    <div
                      className="skill-bar-fill absolute inset-y-0 left-0 h-px w-full origin-left bg-theme-accent"
                      data-level={skill.level}
                      style={{ boxShadow: '0 0 6px hsl(var(--accent) / 0.6)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
