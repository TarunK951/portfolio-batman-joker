'use client';

import { useEffect, useRef } from 'react';
import { registerGsap } from '@/lib/gsap';
import { useTheme, type Theme } from '@/components/theme/ThemeProvider';
import { projects } from '@/data/projects';

const statusLabel: Record<string, string> = {
  live: 'Live',
  development: 'In Dev',
  'this-site': 'This Site',
  'coming-soon': 'Soon',
};

type ProjectsCopy = {
  title: string;
  intro: string;
};

const PROJECTS_COPY: Record<Theme, ProjectsCopy> = {
  batman: {
    title: 'Case files.',
    intro:
      'A selection of recent work — products, interfaces, and experiments at the intersection of engineering and cinema.',
  },
  samurai: {
    title: 'The scrolls.',
    intro:
      'A quiet catalogue. Each piece shaped patiently, finished only when nothing more can be removed.',
  },
  futuristic: {
    title: 'The systems.',
    intro:
      'Shipped systems. Throughput, latency, and clarity — measured and optimized end to end.',
  },
};

function projectLabel(
  theme: Theme,
  project: { batmanName: string; jokerName: string },
  index: number,
): string {
  if (theme === 'batman') return project.batmanName;
  const n = String(index + 1).padStart(3, '0');
  if (theme === 'samurai') return `Scroll #${n}`;
  return `SYS.${n}`;
}

export function Projects() {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement | null>(null);
  const copy = PROJECTS_COPY[theme];

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
        {/* ── INTRO ─────────────────────────────────────── */}
        <div className="grid grid-cols-12 items-start gap-6">
          <div className="col-span-12 lg:col-span-12">
            <p className="u-mono mb-6 text-[11px] uppercase tracking-[0.3em] text-theme-accent">
              <span className="inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-theme-accent align-middle" />
              <span className="ml-3 align-middle">(03) Selected work</span>
            </p>
            <h2 className="u-h2 text-theme-ink">{copy.title}</h2>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <p className="mt-8 text-[15px] leading-relaxed text-theme-ink/65">
              {copy.intro}
            </p>
          </div>
        </div>

        <div className="u-rule mt-20" />

        {/* ── ROW LIST ──────────────────────────────────── */}
        <ul className="group/list">
          {projects.map((project, i) => (
            <li
              key={project.id}
              className="project-row group/row grid cursor-pointer grid-cols-12 items-baseline gap-6 py-10 transition-opacity duration-500 ease-out md:py-14 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-theme-ink/[0.08] group-hover/list:opacity-40 hover:!opacity-100"
              data-cursor-hover
            >
              <span className="col-span-2 u-mono text-[11px] tracking-[0.2em] text-theme-ink/45 transition-colors duration-300 sm:col-span-1 group-hover/row:text-theme-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="col-span-10 sm:col-span-6">
                <h3 className="u-h3 text-theme-ink transition-colors duration-300 group-hover/row:text-theme-accent">
                  {project.name}
                </h3>
                <p className="mt-3 u-mono text-[10px] uppercase tracking-[0.25em] text-theme-ink/50">
                  {projectLabel(theme, project, i)}
                </p>
              </div>
              <p className="col-span-12 max-w-md text-sm leading-relaxed text-theme-ink/65 sm:col-span-3">
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
            </li>
          ))}
        </ul>

        <div className="u-rule" />
      </div>
    </section>
  );
}
