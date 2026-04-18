'use client';

import { useEffect, useRef } from 'react';
import { registerGsap } from '@/lib/gsap';
import { useTheme, type Theme } from '@/components/theme/ThemeProvider';
import { projects } from '@/data/projects';
import { AiDivider } from '@/components/shared/AiDivider';
import { LogoDock } from '@/components/three/PersistentLogo';
import { WireframeDecal } from '@/components/shared/WireframeDecal';
import { CornerReticle } from '@/components/shared/CornerReticle';
import { KineticSerif } from '@/components/shared/KineticSerif';
import { hindiCopy } from '@/data/hindiCopy';

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
  'ancient-india': {
    title: 'The chronicles.',
    intro:
      'A patient canon. Each work tempered by dharma — shaped with intent, finished only when nothing more can be refined.',
  },
};

function projectLabel(
  theme: Theme,
  project: { batmanName: string; jokerName: string },
  index: number,
): string {
  if (theme === 'batman') return project.batmanName;
  const n = String(index + 1).padStart(3, '0');
  return `Parva ${n}`;
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

  const isBatman = theme === 'batman';
  const isAI = theme === 'ancient-india';

  return (
    <section ref={sectionRef} id="work" className="relative u-section bg-theme-bg">
      <div className="mx-auto max-w-7xl">
        {isBatman && (
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <CornerReticle inset={8} size={28} className="h-full w-full">
              <span className="block h-full w-full" />
            </CornerReticle>
          </div>
        )}
        {/* ── INTRO ─────────────────────────────────────── */}
        <div className="grid grid-cols-12 items-start gap-6">
          <div className="col-span-12 lg:col-span-8">
            <p className="u-mono mb-6 text-[11px] uppercase tracking-[0.3em] text-theme-accent">
              <span className="inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-theme-accent align-middle" />
              <span className="ml-3 align-middle">
                [02] the work · selected
                {isAI ? (
                  <>
                    {' '}
                    <span aria-hidden className="text-theme-ink/30">॥</span>
                    {' '}
                    <span className="ai-devanagari normal-case tracking-normal">{hindiCopy.work}</span>
                    {' '}
                    <span aria-hidden className="text-theme-ink/30">॥</span>
                  </>
                ) : null}
              </span>
            </p>
            {isAI ? (
              <h2 className="text-theme-ink" style={{ fontSize: 'clamp(3rem, 10vw, 9rem)' }}>
                <KineticSerif>{copy.title}</KineticSerif>
              </h2>
            ) : (
              <h2 className="u-h2 text-theme-ink">{copy.title}</h2>
            )}
            <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-theme-ink/65">
              {copy.intro}
            </p>
          </div>
          <div className="col-span-12 flex items-start justify-end lg:col-span-4">
            <LogoDock id="projects" size="small" />
          </div>
        </div>

        {isAI ? (
          <div className="mt-16">
            <AiDivider />
          </div>
        ) : (
          <div className="u-rule mt-20" />
        )}

        {/* ── ROW LIST (batman / ancient-india) ─────────── */}
        <ul className="group/list">
          {projects.map((project, i) => (
            <li
              key={project.id}
              className="project-row group/row relative grid cursor-pointer grid-cols-12 items-baseline gap-6 py-10 transition-opacity duration-500 ease-out md:py-14 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-theme-ink/[0.08] group-hover/list:opacity-40 hover:!opacity-100"
              data-cursor-hover
            >
              {isBatman && (
                <WireframeDecal
                  variant="arrow"
                  opacity={0}
                  className="bat-wireframe-decal transition-opacity duration-300 group-hover/row:opacity-60"
                  style={{ top: '50%', right: 8, width: 96, height: 32, transform: 'translateY(-50%)' }}
                />
              )}
              <span
                className={
                  isBatman
                    ? 'bat-idx-diff col-span-2 tracking-[-0.02em] sm:col-span-1'
                    : 'col-span-2 u-mono text-[11px] tracking-[0.2em] text-theme-ink/45 transition-colors duration-300 sm:col-span-1 group-hover/row:text-theme-accent'
                }
                style={isBatman ? { fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', lineHeight: 0.85 } : undefined}
              >
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
