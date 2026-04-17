'use client';

import { useEffect, useRef } from 'react';
import { registerGsap } from '@/lib/gsap';
import { useTheme } from '@/components/theme/ThemeProvider';
import { projects } from '@/data/projects';

const statusLabel: Record<string, string> = {
  live: 'Live',
  development: 'In Development',
  'this-site': 'This Site',
  'coming-soon': 'Coming Soon',
};

const statusColor: Record<string, string> = {
  live: 'bg-green-500/20 text-green-400',
  development: 'bg-yellow-500/20 text-yellow-400',
  'this-site': 'bg-theme-accent/20 text-theme-accent',
  'coming-soon': 'bg-theme-ink/10 text-theme-ink/40',
};

export function Projects() {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement | null>(null);
  const isBatman = theme === 'batman';

  useEffect(() => {
    const { gsap, ScrollTrigger } = registerGsap();
    const node = sectionRef.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.project-card').forEach((card, i) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          delay: i * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        });
      });
    }, node);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-theme-accent">
            {isBatman ? 'Case Files' : 'The Heists'}
          </p>
          <h2 className="mt-2 font-display text-4xl text-theme-ink sm:text-6xl">
            Projects
          </h2>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card group relative overflow-hidden rounded-2xl border border-theme-accent/10 bg-theme-surface/50 p-6 transition-colors hover:border-theme-accent/30"
            >
              {/* Status badge */}
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display text-xs uppercase tracking-[0.3em] text-theme-accent/60">
                  {isBatman ? project.batmanName : project.jokerName}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${statusColor[project.status] ?? ''}`}
                >
                  {statusLabel[project.status] ?? project.status}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-2xl text-theme-ink">
                {project.name}
              </h3>
              <p className="mt-1 text-xs uppercase tracking-wider text-theme-ink/40">
                {project.type}
              </p>

              {/* Description */}
              <p className="mt-4 text-sm leading-relaxed text-theme-ink/60">
                {project.description}
              </p>

              {/* Stack */}
              <div className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-theme-accent/15 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-theme-ink/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Hover glow */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  background:
                    'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(var(--accent) / 0.06), transparent 40%)',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
