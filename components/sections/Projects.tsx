'use client';

import { useEffect, useRef } from 'react';
import { registerGsap } from '@/lib/gsap';
import { useTheme } from '@/components/theme/ThemeProvider';
import { projects } from '@/data/projects';
import { ScrambleText } from '@/components/shared/ScrambleText';

const statusLabel: Record<string, string> = {
  live: 'Live',
  development: 'In Dev',
  'this-site': 'This Site',
  'coming-soon': 'Soon',
};

export function Projects() {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement | null>(null);
  const isBatman = theme === 'batman';

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = sectionRef.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.project-row').forEach((row, i) => {
        gsap.from(row, {
          y: 48,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: i * 0.06,
          scrollTrigger: { trigger: row, start: 'top 88%' },
        });
      });
    }, node);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" className="u-section bg-theme-bg">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 lg:col-span-9">
            <p className="u-mono mb-6 text-[11px] uppercase tracking-[0.3em] text-theme-accent">
              <ScrambleText text="(03) Selected Work" trigger="inview" />
            </p>
            <h2 className="u-h2 text-theme-ink">
              {isBatman ? 'Case files.' : 'The heists.'}
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-3 lg:text-right">
            <p className="u-mono text-[11px] uppercase tracking-[0.3em] text-theme-ink/40">
              {projects.length.toString().padStart(2, '0')} Entries
            </p>
          </div>
        </div>

        <div className="u-rule mt-12" />

        {/* Utopia-style horizontal "row" cards */}
        <ul>
          {projects.map((project, i) => (
            <li
              key={project.id}
              className="project-row group grid cursor-pointer grid-cols-12 items-baseline gap-6 border-b border-theme-line py-8 transition-colors hover:bg-theme-surface/40"
              data-cursor-hover
            >
              <span className="col-span-2 u-mono text-[11px] tracking-[0.2em] text-theme-ink/45 sm:col-span-1">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="col-span-10 sm:col-span-5">
                <h3 className="u-h3 text-theme-ink transition-colors group-hover:text-theme-accent">
                  {project.name}
                </h3>
                <p className="mt-2 u-mono text-[10px] uppercase tracking-[0.25em] text-theme-ink/50">
                  {isBatman ? project.batmanName : project.jokerName}
                </p>
              </div>
              <p className="col-span-12 max-w-md text-sm leading-relaxed text-theme-ink/65 sm:col-span-4">
                {project.description}
              </p>
              <div className="col-span-12 flex items-center justify-between gap-3 sm:col-span-2 sm:flex-col sm:items-end">
                <span className="u-mono text-[10px] uppercase tracking-[0.2em] text-theme-accent">
                  {statusLabel[project.status] ?? project.status}
                </span>
                <span className="u-mono text-[10px] uppercase tracking-[0.2em] text-theme-ink/45">
                  {project.type}
                </span>
              </div>

              {/* tech stack — secondary line */}
              <div className="col-span-12 mt-2 flex flex-wrap gap-2 sm:col-start-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="u-mono text-[10px] uppercase tracking-[0.2em] text-theme-ink/40"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
