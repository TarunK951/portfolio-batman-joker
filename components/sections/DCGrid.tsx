'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { registerGsap } from '@/lib/gsap';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useHeroes, useVillains, type Character } from '@/hooks/useCharacters';
import { ErrorState } from '@/components/shared/ErrorState';

function StatBar({ label, value }: { label: string; value: number }) {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = barRef.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { scaleX: 0 },
        {
          scaleX: value / 100,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.1,
        },
      );
    }, node);
    return () => ctx.revert();
  }, [value]);

  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-xs uppercase tracking-wider text-theme-ink/50">
        {label}
      </span>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-theme-surface">
        <div
          ref={barRef}
          className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-theme-accent"
          style={{
            boxShadow: '0 0 12px hsl(var(--accent) / 0.4)',
          }}
        />
      </div>
      <span className="w-8 text-right font-display text-sm text-theme-accent">
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
        duration: 0.5,
        ease: 'power2.out',
      });
    }, node);
    return () => ctx.revert();
  }, [character.id]);

  return (
    <div ref={panelRef} className="flex flex-col gap-6 lg:flex-row lg:gap-10">
      {/* Character image */}
      <div className="relative mx-auto w-full max-w-[280px] shrink-0 overflow-hidden rounded-2xl border border-theme-accent/20 lg:mx-0 lg:w-72">
        {character.images ? (
          <Image
            src={character.images.lg}
            alt={character.name}
            width={400}
            height={600}
            className="h-auto w-full object-cover"
            unoptimized
          />
        ) : (
          <div className="flex aspect-[2/3] items-center justify-center bg-theme-surface text-theme-ink/30">
            No image
          </div>
        )}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow: 'inset 0 0 40px hsl(var(--accent) / 0.15)',
          }}
        />
      </div>

      {/* Character info + stats */}
      <div className="flex flex-1 flex-col justify-center gap-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-theme-accent">
            {character.title}
          </p>
          <h3 className="mt-1 font-display text-4xl text-theme-ink sm:text-5xl">
            {character.name}
          </h3>
          <p className="mt-1 text-sm text-theme-ink/50">
            {character.realName}
          </p>
        </div>

        <p className="max-w-md text-sm leading-relaxed text-theme-ink/70">
          {character.bio}
        </p>

        <div className="rounded-xl border border-theme-accent/10 bg-theme-surface/50 p-4">
          <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-theme-accent/60">
            Skill mapped
          </p>
          <p className="font-display text-lg text-theme-ink">
            {character.skillMapped}
          </p>
        </div>

        {/* API Powerstats */}
        {character.powerstats && (
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-theme-ink/40">
              Powerstats
            </p>
            {Object.entries(character.powerstats).map(([key, val]) => (
              <StatBar key={key} label={key} value={val} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function DCGrid() {
  const { theme } = useTheme();
  const { heroes, loading: heroesLoading, error: heroesError } = useHeroes();
  const {
    villains,
    loading: villainsLoading,
    error: villainsError,
  } = useVillains();

  // Heroes for order-leaning themes (batman, samurai); villains for disruption (futuristic).
  const showHeroes = theme !== 'futuristic';
  const characters = showHeroes ? heroes : villains;
  const loading = showHeroes ? heroesLoading : villainsLoading;
  const error = showHeroes ? heroesError : villainsError;

  const gridCopy = {
    batman: { eyebrow: 'Justice League', title: 'Heroes.' },
    samurai: { eyebrow: 'The Order', title: 'Guardians.' },
    futuristic: { eyebrow: 'Rogue Signals', title: 'Outliers.' },
  }[theme];

  const [selectedIdx, setSelectedIdx] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Reset selection when theme changes
  useEffect(() => {
    setSelectedIdx(0);
  }, [theme]);

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = sectionRef.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.from('.dc-grid-title', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: node,
          start: 'top 80%',
        },
      });
    }, node);
    return () => ctx.revert();
  }, []);

  const selected = characters[selectedIdx];

  return (
    <section
      ref={sectionRef}
      id="characters"
      className="relative u-section bg-theme-bg"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header — Utopia style */}
        <div className="dc-grid-title grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 lg:col-span-9">
            <p className="u-mono mb-6 text-[11px] uppercase tracking-[0.3em] text-theme-accent">
              (01) {gridCopy.eyebrow}
            </p>
            <h2 className="u-h2 text-theme-ink">{gridCopy.title}</h2>
          </div>
          <div className="col-span-12 lg:col-span-3 lg:text-right">
            <p className="u-mono text-[11px] uppercase tracking-[0.3em] text-theme-ink/40">
              {characters.length.toString().padStart(2, '0')} Subjects
            </p>
          </div>
        </div>
        <div className="u-rule mt-10 mb-12" />

        {/* Loading / Error states */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-theme-accent border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="py-10">
            <ErrorState
              variant="network"
              onRetry={() => {
                if (typeof window !== 'undefined') window.location.reload();
              }}
              error={new Error(error)}
            />
          </div>
        )}

        {/* Grid */}
        {!loading && !error && characters.length > 0 && (
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 lg:w-24 lg:flex-col lg:overflow-x-visible lg:overflow-y-auto">
              {characters.map((char, idx) => (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  aria-label={`Select ${char.name}`}
                  className={`relative shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    idx === selectedIdx
                      ? 'border-theme-accent shadow-glow'
                      : 'border-theme-surface hover:border-theme-accent/30'
                  }`}
                  style={{ width: 72, height: 72 }}
                >
                  {char.images ? (
                    <Image
                      src={char.images.sm}
                      alt={char.name}
                      width={100}
                      height={100}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-theme-surface text-xs text-theme-ink/30">
                      {char.name[0]}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Main panel */}
            {selected && <CharacterPanel character={selected} />}
          </div>
        )}
      </div>
    </section>
  );
}
