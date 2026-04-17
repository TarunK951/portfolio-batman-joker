'use client';

import { useEffect, useRef } from 'react';
import { registerGsap } from '@/lib/gsap';
import { useTheme } from '@/components/theme/ThemeProvider';

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

export function About() {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement | null>(null);
  const isBatman = theme === 'batman';

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = sectionRef.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.from('.about-title', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: node, start: 'top 80%' },
      });

      gsap.utils.toArray<HTMLElement>('.skill-bar-fill').forEach((bar) => {
        const level = Number(bar.dataset.level) || 0;
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: level / 100,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: { trigger: bar, start: 'top 90%' },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
          x: -30,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.15,
          ease: 'power2.out',
          scrollTrigger: { trigger: item, start: 'top 90%' },
        });
      });
    }, node);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="about-title mb-16 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-theme-accent">
            {isBatman ? 'The Detective' : 'The Chaos Agent'}
          </p>
          <h2 className="mt-2 font-display text-4xl text-theme-ink sm:text-6xl">
            About
          </h2>
        </div>

        <div className="grid gap-16 lg:grid-cols-2">
          {/* Bio */}
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-theme-ink/80">
              {isBatman
                ? "I'm Satya Tarun K — a full-stack product developer who believes great software is built with the same discipline Batman brings to Gotham. Every pixel planned, every interaction deliberate."
                : "I'm Satya Tarun K — a full-stack product developer who believes the best ideas come from breaking the rules. Like the Joker, I challenge conventions and create experiences nobody expects."}
            </p>
            <p className="text-sm leading-relaxed text-theme-ink/60">
              I build production-grade web applications with Next.js, Three.js,
              and GSAP. I care about craft — performance, accessibility, and
              visual polish aren&rsquo;t afterthoughts, they&rsquo;re the
              foundation.
            </p>

            {/* Timeline */}
            <div className="mt-8 space-y-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-theme-ink/40">
                Journey
              </p>
              {timeline.map((item) => (
                <div
                  key={item.year}
                  className="timeline-item flex items-center gap-4"
                >
                  <span className="w-14 shrink-0 font-display text-sm text-theme-accent">
                    {item.year}
                  </span>
                  <div className="h-px flex-1 bg-theme-accent/15" />
                  <span className="text-sm text-theme-ink/60">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-theme-ink/40">
              Arsenal
            </p>
            {skills.map((skill) => (
              <div key={skill.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-theme-ink/70">{skill.name}</span>
                  <span className="font-display text-xs text-theme-accent">
                    {skill.level}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-theme-surface">
                  <div
                    className="skill-bar-fill h-full w-full origin-left rounded-full bg-theme-accent"
                    data-level={skill.level}
                    style={{
                      boxShadow: '0 0 8px hsl(var(--accent) / 0.3)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
