'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { registerGsap } from '@/lib/gsap';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useHeroes, useVillains, type Character } from '@/hooks/useCharacters';
import { SmartImage } from '@/components/shared/SmartImage';
import { LogoDock } from '@/components/three/PersistentLogo';
import { CornerReticle } from '@/components/shared/CornerReticle';
import { WireframeDecal } from '@/components/shared/WireframeDecal';
import { HudChip } from '@/components/shared/HudChip';
import { LogoCard } from '@/components/shared/LogoCard';

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

/* ------------------------------------------------------------------
 * BatmanCharacterPanel — hex-radar HUD + flanking vertical stat cards.
 * Six axes map to Akabab powerstats.
 * ------------------------------------------------------------------ */

type BatAxis = { key: keyof Character['powerstats']; label: string };
const BAT_AXES: readonly BatAxis[] = [
  { key: 'strength', label: 'STRENGTH' },
  { key: 'speed', label: 'AGILITY' },
  { key: 'power', label: 'FEROCITY' },
  { key: 'intelligence', label: 'INTELLECT' },
  { key: 'durability', label: 'SPIRIT' },
  { key: 'combat', label: 'VITALITY' },
];

function hexPoint(i: number, n: number, r: number, cx: number, cy: number) {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
  return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
}

function HexRadar({ values }: { values: readonly number[] }) {
  const size = 340;
  const cx = size / 2;
  const cy = size / 2;
  const rMax = size * 0.4;
  const rings = [0.25, 0.5, 0.75, 1];
  const n = values.length;

  const axisPts = BAT_AXES.map((_, i) => hexPoint(i, n, rMax, cx, cy));
  const valuePts = values.map((v, i) => hexPoint(i, n, (Math.max(0, Math.min(100, v)) / 100) * rMax, cx, cy));
  const polyPath = valuePts.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="block h-auto w-full max-w-[380px]"
      aria-hidden
    >
      {rings.map((r, i) => {
        const pts = BAT_AXES.map((_, j) => hexPoint(j, n, r * rMax, cx, cy));
        return (
          <polygon
            key={i}
            points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth={i === rings.length - 1 ? 1.1 : 0.6}
            opacity={0.35}
          />
        );
      })}
      {axisPts.map((p, i) => (
        <line
          key={`ax-${i}`}
          x1={cx}
          y1={cy}
          x2={p.x}
          y2={p.y}
          stroke="hsl(var(--accent))"
          strokeWidth={0.6}
          opacity={0.35}
        />
      ))}
      <polygon
        points={polyPath}
        fill="hsl(var(--accent) / 0.5)"
        stroke="hsl(var(--accent))"
        strokeWidth={1.2}
      />
      {BAT_AXES.map((ax, i) => {
        const p = hexPoint(i, n, rMax + 18, cx, cy);
        return (
          <text
            key={ax.key}
            x={p.x}
            y={p.y}
            fontFamily="var(--font-mono)"
            fontSize={9}
            letterSpacing={1.5}
            fill="hsl(var(--accent))"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ textTransform: 'uppercase' }}
          >
            {ax.label}
          </text>
        );
      })}
    </svg>
  );
}

function BatStatCard({ label, value }: { label: string; value: number }) {
  const ticks = 10;
  const filled = Math.round((Math.max(0, Math.min(100, value)) / 100) * ticks);
  return (
    <div className="bat-stat-card">
      <div className="bat-stat-card__num">{value.toString().padStart(2, '0')}</div>
      <div className="bat-stat-card__ticks" aria-hidden>
        {Array.from({ length: ticks }).map((_, i) => (
          <span
            key={i}
            className="bat-stat-card__tick"
            style={{
              height: `${20 + (i / ticks) * 28}px`,
              opacity: i < filled ? 1 : 0.15,
            }}
          />
        ))}
      </div>
      <div className="bat-stat-card__label">{label}</div>
      <div className="bat-stat-card__rail" aria-hidden>
        <span>{label.slice(0, 3)}</span>
      </div>
    </div>
  );
}

function BatmanCharacterPanel({ character }: { character: Character }) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { gsap } = registerGsap();
    const node = panelRef.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.from(node, {
        opacity: 0,
        y: 20,
        duration: 0.55,
        ease: 'power2.out',
      });
    }, node);
    return () => ctx.revert();
  }, [character.id]);

  const left = BAT_AXES.slice(0, 3);
  const right = BAT_AXES.slice(3, 6);
  const radarValues = BAT_AXES.map((a) => character.powerstats[a.key]);
  const level = Math.min(
    99,
    Math.round(
      (BAT_AXES.reduce((s, a) => s + character.powerstats[a.key], 0) / (BAT_AXES.length * 100)) * 99,
    ),
  );
  const skillPoints = Math.max(
    ...BAT_AXES.map((a) => character.powerstats[a.key]),
  );
  const ctaName = character.name.replace(/\s+/g, '_').toUpperCase();

  return (
    <div ref={panelRef} className="relative flex-1">
      {/* Oversize red stencil header */}
      <div className="relative mb-10">
        <WireframeDecal
          variant="ring"
          opacity={0.45}
          className="bat-wireframe-decal"
          style={{ top: '-20%', right: '4%', width: '20%', height: '140%' }}
        />
        <WireframeDecal
          variant="triangle"
          opacity={0.35}
          className="bat-wireframe-decal"
          style={{ top: '-5%', left: '2%', width: '12%', height: '110%' }}
        />
        <p
          className="bat-stencil--accent"
          style={{
            fontFamily: 'var(--font-stencil), var(--font-display), sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.4rem, 2.6vw, 2.2rem)',
            letterSpacing: '-0.02em',
            color: 'hsl(var(--accent))',
            lineHeight: 1,
          }}
        >
          THE STORY BEHIND
        </p>
        <h3
          className="bat-stencil--accent"
          style={{
            fontFamily: 'var(--font-stencil), var(--font-display), sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(3rem, 8vw, 6.5rem)',
            letterSpacing: '-0.045em',
            color: 'hsl(var(--accent))',
            lineHeight: 0.85,
            marginTop: 4,
          }}
        >
          {character.name}
        </h3>
        <p className="mt-2 u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/55">
          {character.title} · {character.realName}
        </p>
      </div>

      {/* 3-col portrait + bio strip */}
      <div className="mb-8 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-4">
          <CornerReticle inset={0} size={24}>
            <div className="px-3 py-3">
              <SmartImage
                src={character.images.lg}
                alt={character.name}
                name={character.name}
                aspectClassName="aspect-[2/3]"
              />
            </div>
          </CornerReticle>
        </div>
        <div className="col-span-12 md:col-span-8 flex flex-col justify-center gap-4">
          <p className="text-[14px] leading-relaxed text-theme-ink/80">{character.bio}</p>
          <div className="flex flex-wrap items-center gap-3">
            <HudChip accent>FIRST APP · {character.firstAppearance}</HudChip>
            {character.nemesis ? (
              <HudChip>NEMESIS · {character.nemesis}</HudChip>
            ) : null}
          </div>
        </div>
      </div>

      {/* HUD grid: 3 left cards | radar | 3 right cards */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-3 flex flex-col gap-3">
          {left.map((a) => (
            <BatStatCard key={a.key} label={a.label} value={character.powerstats[a.key]} />
          ))}
        </div>

        <div className="col-span-12 md:col-span-6">
          <CornerReticle inset={0} size={28}>
            <div className="flex items-center justify-center px-6 py-6">
              <HexRadar values={radarValues} />
            </div>
          </CornerReticle>
        </div>

        <div className="col-span-12 md:col-span-3 flex flex-col gap-3">
          {right.map((a) => (
            <BatStatCard key={a.key} label={a.label} value={character.powerstats[a.key]} />
          ))}
        </div>
      </div>

      {/* Level / SkillPoints / CTA bottom row */}
      <div className="mt-6 grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 md:col-span-3 bat-stat-card">
          <div className="bat-stat-card__num">{level.toString().padStart(2, '0')}</div>
          <div className="bat-stat-card__label" style={{ padding: '8px 10px' }}>
            LEVEL
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 flex justify-center">
          <a
            href={`mailto:hello@example.com?subject=${ctaName}`}
            data-cursor-hover
            className="bat-cta-bracket"
          >
            &gt;_DISCOVER_{ctaName}_MASK
          </a>
        </div>
        <div className="col-span-6 md:col-span-3 bat-stat-card">
          <div className="bat-stat-card__num">{skillPoints.toString().padStart(2, '0')}</div>
          <div className="bat-stat-card__label" style={{ padding: '8px 10px' }}>
            SKILL POINTS
          </div>
        </div>
      </div>
    </div>
  );
}

function CharacterPanel({
  character,
  futuristic = false,
}: {
  character: Character;
  futuristic?: boolean;
}) {
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
      <div
        className={`relative mx-auto w-full max-w-[280px] shrink-0 overflow-hidden lg:mx-0 lg:w-72 ${
          futuristic
            ? 'fx-corner-frame rounded-[16px] border border-white/15 bg-[hsl(var(--surface)/0.4)] p-2'
            : 'border border-theme-ink/15'
        }`}
      >
        {futuristic ? (
          <>
            <span className="fx-corner--bl" aria-hidden />
            <span className="fx-corner--br" aria-hidden />
          </>
        ) : null}
        <SmartImage
          src={character.images.lg}
          alt={character.name}
          name={character.name}
          aspectClassName="aspect-[2/3]"
        />
        {!futuristic ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ boxShadow: 'inset 0 0 40px hsl(var(--accent) / 0.15)' }}
          />
        ) : null}
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
            {isFuturistic ? (
              <div className="flex gap-3 overflow-x-auto pb-2 lg:w-40 lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:max-h-[680px] lg:pr-2">
                {characters.map((char, idx) => {
                  const active = idx === selectedIdx;
                  return (
                    <LogoCard
                      key={`${char.id}-${idx}`}
                      size="sm"
                      active={active}
                      onClick={() => setSelectedIdx(idx)}
                      ariaLabel={`Select ${char.name}`}
                      className="shrink-0"
                      style={{ width: 136, minHeight: 132 }}
                    >
                      <div className="flex w-full flex-col items-center gap-2">
                        <div className="h-16 w-16 overflow-hidden rounded-md">
                          <SmartImage
                            src={char.images.sm}
                            alt={char.name}
                            name={char.name}
                            aspectClassName="aspect-square"
                          />
                        </div>
                        <span className="u-mono w-full truncate text-[9px] uppercase tracking-[0.18em] text-theme-ink/70">
                          {char.name}
                        </span>
                      </div>
                    </LogoCard>
                  );
                })}
              </div>
            ) : (
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
            )}

            {selected && (isFuturistic
              ? <CharacterPanel character={selected} futuristic />
              : <BatmanCharacterPanel character={selected} />)}
          </div>
        )}
      </div>
    </section>
  );
}
