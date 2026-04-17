'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { registerGsap } from '@/lib/gsap';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useHeroes, useVillains, type Character } from '@/hooks/useCharacters';
import { SmartImage } from '@/components/shared/SmartImage';
import { LogoDock } from '@/components/three/PersistentLogo';

type Filter = 'all' | 'heroes' | 'villains';

const FILTERS: Filter[] = ['all', 'heroes', 'villains'];

function StatBar({
  label,
  value,
  reloadKey,
}: {
  label: string;
  value: number;
  reloadKey: string;
}) {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = barRef.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { scaleX: 0 },
        { scaleX: value / 100, duration: 0.85, ease: 'power2.out' },
      );
    }, node);
    return () => ctx.revert();
  }, [value, reloadKey]);

  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 u-mono text-[10px] uppercase tracking-[0.25em] text-theme-ink/50">
        {label}
      </span>
      <div className="relative h-px flex-1 bg-theme-ink/15">
        <div
          ref={barRef}
          className="absolute inset-y-0 left-0 w-full origin-left bg-theme-accent"
          style={{ boxShadow: '0 0 6px hsl(var(--accent) / 0.55)' }}
        />
      </div>
      <span className="w-8 text-right u-mono text-[11px] text-theme-accent">
        {value}
      </span>
    </div>
  );
}

function CharacterPanel({ character }: { character: Character }) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = panelRef.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.from(node, {
        opacity: 0,
        x: 20,
        duration: 0.55,
        ease: 'power2.out',
      });
    }, node);
    return () => ctx.revert();
  }, [character.id]);

  return (
    <div ref={panelRef} className="flex flex-col gap-8 lg:flex-row lg:gap-10">
      <div className="relative mx-auto w-full max-w-[280px] shrink-0 overflow-hidden border border-theme-ink/15 lg:mx-0 lg:w-72">
        <SmartImage
          src={character.images.lg}
          alt={character.name}
          name={character.name}
          aspectClassName="aspect-[2/3]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: 'inset 0 0 40px hsl(var(--accent) / 0.15)' }}
        />
      </div>

      <div className="flex flex-1 flex-col justify-center gap-5">
        <div>
          <p className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-accent">
            {character.title}
          </p>
          <h3 className="mt-1 font-display leading-[0.95] text-theme-ink" style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)' }}>
            {character.name}
          </h3>
          <p className="mt-1 text-sm text-theme-ink/55">{character.realName}</p>
        </div>

        <p className="max-w-md text-[14px] leading-relaxed text-theme-ink/75">
          {character.bio}
        </p>

        <div className="border border-theme-ink/12 bg-theme-surface/40 p-4">
          <p className="u-mono mb-1 text-[10px] uppercase tracking-[0.3em] text-theme-accent/80">
            First appearance
          </p>
          <p className="text-sm text-theme-ink/80">{character.firstAppearance}</p>
          {character.nemesis ? (
            <p className="mt-2 u-mono text-[10px] uppercase tracking-[0.25em] text-theme-ink/55">
              nemesis · {character.nemesis}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <p className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/45">
            Powerstats
          </p>
          {Object.entries(character.powerstats).map(([key, val]) => (
            <StatBar
              key={key}
              label={key}
              value={val as number}
              reloadKey={character.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function DCGrid() {
  const { theme } = useTheme();
  const { heroes } = useHeroes();
  const { villains } = useVillains();

  const [filter, setFilter] = useState<Filter>('all');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  const characters = useMemo<readonly Character[]>(() => {
    if (filter === 'heroes') return heroes;
    if (filter === 'villains') return villains;
    return [...heroes, ...villains];
  }, [filter, heroes, villains]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [filter, theme]);

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = sectionRef.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.from('.dc-grid-title', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: node, start: 'top 80%' },
      });
    }, node);
    return () => ctx.revert();
  }, []);

  // Gate: only render under batman or futuristic.
  if (theme !== 'batman' && theme !== 'futuristic') return null;

  const isFuturistic = theme === 'futuristic';
  const copy = isFuturistic
    ? { eyebrow: '[ 03 / the_mythos ] :: rogue signals', title: 'Outliers.' }
    : { eyebrow: '[03] the mythos · Justice & Rogues', title: 'Heroes & villains.' };

  const selected = characters[selectedIdx];

  return (
    <section ref={sectionRef} id="characters" className="relative u-section bg-theme-bg">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="dc-grid-title grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 lg:col-span-8">
            <p className="u-mono mb-6 text-[11px] uppercase tracking-[0.3em] text-theme-accent">
              {copy.eyebrow}
            </p>
            <h2 className="font-display leading-[0.9] text-theme-ink" style={{ fontSize: 'clamp(2.6rem, 7vw, 5.6rem)' }}>
              {copy.title}
            </h2>
          </div>
          <div className="col-span-12 flex items-start justify-end lg:col-span-4">
            <LogoDock id="dc" size="small" />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          {FILTERS.map((f) => {
            const active = filter === f;
            if (isFuturistic) {
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  data-cursor-hover
                  className={`u-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
                    active
                      ? 'text-theme-accent'
                      : 'text-theme-ink/55 hover:text-theme-ink'
                  }`}
                  style={
                    active
                      ? { borderBottom: '1px solid currentColor', paddingBottom: 3 }
                      : undefined
                  }
                >
                  [ {f} ]
                </button>
              );
            }
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                data-cursor-hover
                className={`u-mono text-[11px] uppercase tracking-[0.28em] transition-colors ${
                  active
                    ? 'text-theme-accent'
                    : 'text-theme-ink/55 hover:text-theme-ink'
                }`}
              >
                {f}
              </button>
            );
          })}
          <span className="ml-auto u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/40">
            {characters.length.toString().padStart(2, '0')} subjects
          </span>
        </div>

        <div className="u-rule mt-6 mb-12" />

        {characters.length > 0 && (
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 lg:w-24 lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:max-h-[680px]">
              {characters.map((char, idx) => {
                const active = idx === selectedIdx;
                return (
                  <button
                    key={`${char.id}-${idx}`}
                    type="button"
                    onClick={() => setSelectedIdx(idx)}
                    aria-label={`Select ${char.name}`}
                    data-cursor-hover
                    className={`relative shrink-0 overflow-hidden border-2 transition-all ${
                      active
                        ? 'border-theme-accent shadow-glow'
                        : 'border-theme-surface hover:border-theme-accent/40'
                    }`}
                    style={{ width: 72, height: 72 }}
                  >
                    <SmartImage
                      src={char.images.sm}
                      alt={char.name}
                      name={char.name}
                      aspectClassName="aspect-square"
                    />
                  </button>
                );
              })}
            </div>

            {selected && <CharacterPanel character={selected} />}
          </div>
        )}
      </div>
    </section>
  );
}
