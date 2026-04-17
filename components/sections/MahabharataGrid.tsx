'use client';

/**
 * MahabharataGrid
 * ------------------------------------------------------------------
 * Ancient-India theme twin of DCGrid. Only renders when the active
 * theme is `ancient-india`. Shows 19 warriors of Kurukshetra with a
 * relationship chart, faction, death card, key moment, and animated
 * 6-axis stat bars.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { registerGsap } from '@/lib/gsap';
import { useTheme } from '@/components/theme/ThemeProvider';
import {
  mahabharataCharacters,
  mahabharataFactions,
  mahabharataWarDays,
  type MahabharataCharacter,
} from '@/data/mahabharata';
import { ancientIndiaCopy } from '@/data/ancientIndiaCopy';
import { SmartImage } from '@/components/shared/SmartImage';
import { InkBrushDivider } from '@/components/shared/InkBrushDivider';
import { LogoDock } from '@/components/three/PersistentLogo';

const STAT_LABELS: Array<{ key: keyof MahabharataCharacter['stats']; label: string }> = [
  { key: 'valor', label: 'Valor' },
  { key: 'wisdom', label: 'Wisdom' },
  { key: 'devotion', label: 'Devotion' },
  { key: 'strategy', label: 'Strategy' },
  { key: 'martial', label: 'Martial' },
  { key: 'influence', label: 'Influence' },
];

function StatBar({ label, value, reloadKey }: { label: string; value: number; reloadKey: string }) {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = barRef.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { scaleX: 0 },
        { scaleX: value / 100, duration: 0.9, ease: 'power2.out' },
      );
    }, node);
    return () => ctx.revert();
  }, [value, reloadKey]);

  return (
    <div className="flex items-center gap-4">
      <span className="w-24 shrink-0 u-mono text-[10px] uppercase tracking-[0.25em] text-theme-ink/50">
        {label}
      </span>
      <div className="relative h-px flex-1 bg-theme-ink/15">
        <div
          ref={barRef}
          className="absolute inset-y-0 left-0 w-full origin-left bg-theme-accent"
          style={{ boxShadow: '0 0 6px hsl(var(--accent) / 0.5)' }}
        />
      </div>
      <span className="w-8 text-right u-mono text-[11px] text-theme-accent">{value}</span>
    </div>
  );
}

function RelationshipTree({ character }: { character: MahabharataCharacter }) {
  const rows: Array<{ label: string; value: string }> = [];
  rows.push({ label: 'Father', value: character.parents.father });
  rows.push({ label: 'Mother', value: character.parents.mother });
  if (character.spouse && character.spouse.length > 0) {
    rows.push({ label: 'Spouse', value: character.spouse.join(', ') });
  }
  if (character.siblings && character.siblings.length > 0) {
    rows.push({ label: 'Siblings', value: character.siblings.join(', ') });
  }
  if (character.children && character.children.length > 0) {
    rows.push({ label: 'Children', value: character.children.join(', ') });
  }

  return (
    <div className="space-y-0">
      {rows.map((row, i) => (
        <div
          key={row.label}
          className="flex items-baseline gap-4 border-b border-theme-ink/10 py-2.5"
          style={i === rows.length - 1 ? { borderBottom: 'none' } : undefined}
        >
          <span className="w-20 shrink-0 u-mono text-[10px] uppercase tracking-[0.22em] text-theme-accent">
            {row.label}
          </span>
          <span className="flex-1 text-sm text-theme-ink/80">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function CharacterPanel({ character }: { character: MahabharataCharacter }) {
  const faction = mahabharataFactions[character.faction];
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = panelRef.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.from(node, { opacity: 0, x: 16, duration: 0.55, ease: 'power2.out' });
    }, node);
    return () => ctx.revert();
  }, [character.id]);

  return (
    <div ref={panelRef} className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
      {/* Portrait column */}
      <div className="lg:col-span-2">
        <div className="relative overflow-hidden border border-theme-ink/15">
          <SmartImage
            src={character.image}
            alt={character.name}
            name={character.name}
            aspectClassName="aspect-[3/4]"
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: 'inset 0 0 40px hsl(var(--accent) / 0.15)' }}
          />
        </div>

        {/* Faction pill */}
        <div className="mt-5 flex items-center gap-3">
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: faction.color }}
          />
          <span className="u-mono text-[10px] uppercase tracking-[0.28em] text-theme-ink/60">
            {faction.label} · {faction.devanagari}
          </span>
        </div>
        <p className="mt-3 u-mono text-[10px] uppercase tracking-[0.22em] text-theme-ink/45">
          Chose to fight for {character.sideInWar}
        </p>
      </div>

      {/* Narrative column */}
      <div className="lg:col-span-3">
        <p className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-accent">
          {character.epithet}
        </p>
        <h3 className="mt-2 font-display leading-[0.95] text-theme-ink" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)' }}>
          {character.name}
        </h3>
        <p className="mt-1 text-theme-ink/55" style={{ fontSize: '1.05rem' }}>
          {character.nameDevanagari}
        </p>

        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-theme-ink/80">
          {character.bio}
        </p>

        <div className="mt-8">
          <p className="u-mono mb-3 text-[10px] uppercase tracking-[0.3em] text-theme-ink/50">
            Kin
          </p>
          <RelationshipTree character={character} />
        </div>

        <div className="mt-10">
          <p className="u-mono mb-3 text-[10px] uppercase tracking-[0.3em] text-theme-ink/50">
            Stats
          </p>
          <div className="space-y-3">
            {STAT_LABELS.map((s) => (
              <StatBar
                key={s.key}
                label={s.label}
                value={character.stats[s.key]}
                reloadKey={character.id}
              />
            ))}
          </div>
        </div>

        {/* Key moment — quoted */}
        <figure className="mt-10 border-l-2 border-theme-accent/60 pl-5">
          <blockquote className="text-theme-ink/85" style={{ fontSize: '1.05rem', lineHeight: 1.55 }}>
            &ldquo;{character.keyMoment}&rdquo;
          </blockquote>
          <figcaption className="mt-2 u-mono text-[10px] uppercase tracking-[0.25em] text-theme-ink/45">
            — the key moment
          </figcaption>
        </figure>

        {/* Death card */}
        {character.deathCause ? (
          <div className="mt-10">
            <InkBrushDivider className="text-theme-accent/60" />
            <p className="u-mono mt-5 text-[10px] uppercase tracking-[0.3em] text-theme-accent">
              How they fell
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-theme-ink/80">
              {character.deathCause}
            </p>
            {character.deathBy ? (
              <p className="mt-2 u-mono text-[10px] uppercase tracking-[0.22em] text-theme-ink/50">
                by · {character.deathBy}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function MahabharataGrid() {
  const { theme } = useTheme();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = sectionRef.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.from('.mb-title', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: node, start: 'top 80%' },
      });
    }, node);
    return () => ctx.revert();
  }, []);

  const selected = useMemo(
    () => mahabharataCharacters[selectedIdx] ?? mahabharataCharacters[0]!,
    [selectedIdx],
  );

  if (theme !== 'ancient-india') return null;

  const copy = ancientIndiaCopy.dcGrid;

  return (
    <section
      ref={sectionRef}
      id="mahabharata"
      className="u-section bg-theme-bg"
    >
      <div className="mx-auto max-w-7xl">
        {/* Title row + right-rail logo dock */}
        <div className="mb-title grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 lg:col-span-8">
            <p className="u-mono mb-6 text-[11px] uppercase tracking-[0.3em] text-theme-accent">
              [03] {copy.eyebrow} · the mythos
            </p>
            <h2 className="font-display leading-[0.9] text-theme-ink" style={{ fontSize: 'clamp(2.6rem, 7vw, 5.6rem)' }}>
              {copy.headline}
            </h2>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-theme-ink/65">
              {copy.subtitle}
            </p>
          </div>
          <div className="col-span-12 flex items-start justify-end lg:col-span-4">
            <LogoDock id="mahabharata" size="small" />
          </div>
        </div>

        <InkBrushDivider className="mt-10 text-theme-accent/60" />

        <div className="mt-12 grid grid-cols-12 gap-8">
          {/* Thumbnail rail */}
          <aside className="col-span-12 lg:col-span-3">
            <p className="u-mono mb-4 text-[10px] uppercase tracking-[0.3em] text-theme-ink/45">
              {mahabharataCharacters.length.toString().padStart(2, '0')} figures
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2 lg:max-h-[680px] lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:pr-1">
              {mahabharataCharacters.map((c, idx) => {
                const faction = mahabharataFactions[c.faction];
                const isActive = idx === selectedIdx;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedIdx(idx)}
                    data-cursor-hover
                    className={`group flex shrink-0 items-center gap-3 border border-theme-ink/15 px-3 py-2.5 text-left transition-colors ${
                      isActive
                        ? 'border-theme-accent bg-theme-surface/60'
                        : 'hover:border-theme-accent/60 hover:bg-theme-surface/40'
                    }`}
                    style={{ width: '100%', minWidth: 180 }}
                    aria-label={`Select ${c.name}`}
                  >
                    <span
                      aria-hidden
                      className="inline-block h-2 w-2 shrink-0 rounded-full"
                      style={{ background: faction.color }}
                    />
                    <span className="flex flex-col">
                      <span className={`font-display text-sm leading-none ${isActive ? 'text-theme-accent' : 'text-theme-ink/90'}`}>
                        {c.name}
                      </span>
                      <span className="mt-1 text-[10px] text-theme-ink/50">
                        {c.nameDevanagari}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main detail panel */}
          <div className="col-span-12 lg:col-span-9">
            <CharacterPanel character={selected} />
          </div>
        </div>

        {/* War days footer strip */}
        <InkBrushDivider className="mt-20 text-theme-accent/60" />
        <div className="mt-10">
          <p className="u-mono mb-5 text-[10px] uppercase tracking-[0.3em] text-theme-accent">
            Eighteen days · कुरुक्षेत्र
          </p>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mahabharataWarDays.map((d) => (
              <li key={d.day} className="border-l border-theme-accent/40 pl-4">
                <p className="u-mono text-[10px] uppercase tracking-[0.25em] text-theme-ink/45">
                  Day {d.day.toString().padStart(2, '0')}
                </p>
                <p className="mt-1 font-display text-lg text-theme-ink">{d.title}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-theme-ink/65">
                  {d.event}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
