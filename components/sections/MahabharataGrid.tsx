'use client';

/**
 * MahabharataGrid (ancient-india only) — bento-card rebuild
 * ------------------------------------------------------------------
 * Reference: string-tune.fiddle.digital bento-card grid.
 * - Large stacked "Code With Clarity"-style headline above the grid.
 * - Bento grid of character cards with varied sizes (small/med/large).
 * - One "accent" card with a pixel-art portrait + speech-bubble quote.
 * - One "ink" quote card with a pull-quote in italic serif.
 * - Selecting a character promotes their detail into a sticky hero card.
 * Data wiring to mahabharataCharacters / mahabharataFactions preserved.
 */

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { registerGsap } from '@/lib/gsap';
import { useTheme } from '@/components/theme/ThemeProvider';
import {
  mahabharataCharacters,
  mahabharataFactions,
  type MahabharataCharacter,
} from '@/data/mahabharata';
import { ancientIndiaCopy } from '@/data/ancientIndiaCopy';
import { SmartImage } from '@/components/shared/SmartImage';
import { BentoCard } from '@/components/shared/BentoCard';
import { AiDivider } from '@/components/shared/AiDivider';
import { UnrollText } from '@/components/shared/UnrollText';
import { KineticSerif } from '@/components/shared/KineticSerif';
import { hindiCopy } from '@/data/hindiCopy';
import { mahabharataEvents, type MahabharataEvent } from '@/data/mahabharataEvents';

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
      gsap.fromTo(node, { scaleX: 0 }, { scaleX: value / 100, duration: 0.9, ease: 'power2.out' });
    }, node);
    return () => ctx.revert();
  }, [value, reloadKey]);
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 u-mono text-[9px] uppercase tracking-[0.22em] text-theme-ink/55">
        {label}
      </span>
      <div className="relative h-px flex-1 bg-theme-ink/15">
        <div
          ref={barRef}
          className="absolute inset-y-0 left-0 w-full origin-left bg-theme-accent"
          style={{ boxShadow: '0 0 6px hsl(var(--accent) / 0.5)' }}
        />
      </div>
      <span className="w-6 text-right u-mono text-[10px] text-theme-accent">{value}</span>
    </div>
  );
}

function FactionPill({ character }: { character: MahabharataCharacter }) {
  const faction = mahabharataFactions[character.faction];
  return (
    <span className="inline-flex items-center gap-2 u-mono text-[9px] uppercase tracking-[0.24em] text-theme-ink/60">
      <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: faction.color }} />
      {faction.label}
    </span>
  );
}

function CharacterMiniCard({
  character,
  active,
  onSelect,
  size = 'sm',
}: {
  character: MahabharataCharacter;
  active: boolean;
  onSelect: () => void;
  size?: 'sm' | 'md';
}) {
  return (
    <BentoCard
      as="button"
      onClick={onSelect}
      active={active}
      size={size}
      ariaLabel={`Select ${character.name}`}
    >
      <div className="relative mb-3 overflow-hidden rounded-[14px] border border-theme-ink/10">
        <SmartImage
          src={character.image}
          alt={character.name}
          name={character.name}
          aspectClassName="aspect-[4/5]"
        />
      </div>
      <FactionPill character={character} />
      <p className="ai-serif mt-2 text-[18px] leading-tight text-theme-ink">
        {character.name}
      </p>
      <p className="ai-devanagari text-[12px] text-theme-ink/55">
        {character.nameDevanagari}
      </p>
    </BentoCard>
  );
}

function HeroCharacterCard({ character }: { character: MahabharataCharacter }) {
  return (
    <BentoCard size="lg" className="ai-hero-card">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-5 md:gap-6">
        <div className="md:col-span-2">
          <div className="overflow-hidden rounded-[14px] border border-theme-ink/10">
            <SmartImage
              src={character.image}
              alt={character.name}
              name={character.name}
              aspectClassName="aspect-[3/4]"
            />
          </div>
          <div className="mt-3">
            <FactionPill character={character} />
          </div>
        </div>
        <div className="md:col-span-3">
          <p className="u-mono text-[10px] uppercase tracking-[0.28em] text-theme-accent">
            {character.epithet}
          </p>
          <h3
            className="ai-serif mt-2 leading-[0.95] text-theme-ink"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)' }}
          >
            {character.name}
          </h3>
          <p className="ai-devanagari mt-1 text-theme-ink/55">
            {character.nameDevanagari}
          </p>
          <p className="mt-4 text-[14px] leading-relaxed text-theme-ink/80">
            {character.bio}
          </p>
          <div className="mt-5 space-y-2.5">
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
      </div>
    </BentoCard>
  );
}

function EventBentoCard({ event }: { event: MahabharataEvent }) {
  return (
    <BentoCard size="lg" className="relative overflow-hidden p-0">
      <div className="relative h-full w-full">
        <SmartImage
          src={event.image}
          alt={event.title}
          name={event.title}
          aspectClassName="aspect-[16/10]"
          className="h-full w-full"
        />
        {/* top-right Hindi title */}
        <div className="pointer-events-none absolute right-4 top-4 rounded-md bg-theme-bg/70 px-2 py-1 backdrop-blur-sm">
          <span className="ai-devanagari text-[14px] text-theme-accent">{event.hindi}</span>
        </div>
        {/* bottom serif caption overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-theme-bg/85 via-theme-bg/50 to-transparent p-5">
          <p className="u-mono text-[9px] uppercase tracking-[0.28em] text-theme-accent">
            {event.id} ॥ {event.hindi}
          </p>
          <p className="ai-serif-italic mt-1 text-[18px] leading-tight text-theme-ink">
            {event.title}
          </p>
          <p className="mt-1 text-[12px] leading-snug text-theme-ink/75">
            {event.caption}
          </p>
        </div>
      </div>
    </BentoCard>
  );
}

export function MahabharataGrid() {
  const { theme } = useTheme();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (theme !== 'ancient-india') return;
    const { gsap } = registerGsap();
    const node = sectionRef.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.from('.mb-bento-card', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.04,
        scrollTrigger: { trigger: node, start: 'top 80%' },
      });
    }, node);
    return () => ctx.revert();
  }, [theme]);

  const selected = useMemo(
    () => mahabharataCharacters[selectedIdx] ?? mahabharataCharacters[0]!,
    [selectedIdx],
  );

  if (theme !== 'ancient-india') return null;

  const copy = ancientIndiaCopy.dcGrid;

  // Build grid: hero card (lg), then ~10 small cards, sprinkled with
  // 1 accent pixel-art card + 1 ink quote card.
  const characterList = mahabharataCharacters;
  const accentChar = characterList[1];
  const quoteChar = characterList[0];

  return (
    <section
      ref={sectionRef}
      id="mahabharata"
      className="u-section bg-theme-bg"
    >
      <div className="mx-auto max-w-[1280px]">
        {/* ── OVERSIZE STACKED HEADLINE ────────────────── */}
        <div className="mb-16 grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 md:col-span-8">
            <p className="u-mono mb-6 text-[11px] uppercase tracking-[0.3em] text-theme-accent">
              [03] {copy.eyebrow} · the mythos
              {' '}
              <span aria-hidden className="text-theme-ink/30">॥</span>
              {' '}
              <span className="ai-devanagari normal-case tracking-normal">{hindiCopy.roster}</span>
              {' '}
              <span aria-hidden className="text-theme-ink/30">॥</span>
            </p>
            <div className="ai-serif leading-[0.92] text-theme-ink" style={{ fontSize: 'clamp(3rem, 8vw, 6.4rem)' }}>
              <UnrollText as="div" text="Code" onScroll />
              <div>
                <KineticSerif className="text-theme-ink/80">With</KineticSerif>
              </div>
              <UnrollText
                as="div"
                text="Clarity."
                className="ai-headline-muted"
                onScroll
              />
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 md:text-right">
            <p className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/50">
              ( ˄ ) Built to tune<br />your narrative,<br />not fight your dom
            </p>
          </div>
        </div>

        <AiDivider className="mb-12" />

        {/* ── HERO CARD — current selection ──────────── */}
        <div className="mb-10">
          <div className="mb-bento-card">
            <HeroCharacterCard character={selected} />
          </div>
        </div>

        {/* ── BENTO GRID ─────────────────────────────── */}
        <div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4 md:auto-rows-[minmax(260px,auto)]"
        >
          {/* Accent pixel-art card */}
          {accentChar ? (
            <div className="mb-bento-card md:col-span-2 md:row-span-2">
              <BentoCard variant="accent" size="lg" className="flex flex-col justify-between gap-4">
                <div>
                  <p className="u-mono text-[10px] uppercase tracking-[0.28em] opacity-80">
                    Performance Supervision · फिडल
                  </p>
                  <p className="ai-serif mt-2 text-[26px] leading-tight">
                    Control your <em className="ai-serif-italic">Progress Data</em>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="ai-pixel-portrait max-w-[120px] flex-1">AIKA</div>
                  <div className="ai-speech flex-1">
                    Eighteen days, eighteen stories —
                    pick a figure and hear their song.
                  </div>
                </div>
              </BentoCard>
            </div>
          ) : null}

          {/* Ink quote card */}
          {quoteChar ? (
            <div className="mb-bento-card md:col-span-2 md:row-span-1">
              <BentoCard variant="ink" size="md">
                <p className="u-mono text-[10px] uppercase tracking-[0.28em] opacity-70">
                  कर्मण्येवाधिकारस्ते — on duty
                </p>
                <p className="ai-serif-italic mt-3 text-[20px] leading-snug">
                  &ldquo;{quoteChar.keyMoment}&rdquo;
                </p>
                <p className="u-mono mt-4 text-[10px] uppercase tracking-[0.28em] opacity-60">
                  — {quoteChar.name}
                </p>
              </BentoCard>
            </div>
          ) : null}

          {/* Remaining character mini-cards — event cards injected at 4/10/16 */}
          {characterList.map((c, idx) => {
            // Inject a large event bento card BEFORE positions 4, 10, 16
            // (i.e. after every 6 character tiles, using events 0/1/2).
            const injectIdx =
              idx === 4 ? 0 : idx === 10 ? 1 : idx === 16 ? 2 : -1;
            const eventToInject =
              injectIdx >= 0 ? mahabharataEvents[injectIdx] : undefined;
            return (
              <Fragment key={c.id}>
                {eventToInject ? (
                  <div
                    key={`event-${eventToInject.id}`}
                    className="mb-bento-card"
                  >
                    <EventBentoCard event={eventToInject} />
                  </div>
                ) : null}
                <div className="mb-bento-card">
                  <CharacterMiniCard
                    character={c}
                    active={idx === selectedIdx}
                    onSelect={() => setSelectedIdx(idx)}
                  />
                </div>
              </Fragment>
            );
          })}

          {/* StringTune-esque helper card */}
          <div className="mb-bento-card md:col-span-2">
            <BentoCard size="md">
              <p className="u-mono text-[10px] uppercase tracking-[0.28em] text-theme-accent">
                Use Scroll Container. If you want
              </p>
              <p className="ai-serif mt-2 text-[18px] leading-snug text-theme-ink">
                eighteen days rolled out — one parva per hour of reading —
                press <span className="ai-serif-italic">Skill Hub</span>.
              </p>
              <div className="mt-4 rounded-[12px] border border-theme-ink/15 bg-theme-bg/40 p-3">
                <p className="u-mono text-[9px] uppercase tracking-[0.24em] text-theme-ink/55">
                  preview · parva 01
                </p>
                <p className="mt-2 text-[12px] text-theme-ink/75">
                  &ldquo;Between two armies, a choice becomes dharma.&rdquo;
                </p>
              </div>
            </BentoCard>
          </div>

          <div className="mb-bento-card md:col-span-2">
            <BentoCard size="md">
              <p className="u-mono text-[10px] uppercase tracking-[0.28em] text-theme-accent">
                Safe natural kerning when Splitting
              </p>
              <p className="ai-serif mt-2 text-[18px] leading-snug text-theme-ink">
                Every name unrolls letter by letter — the
                <span className="ai-serif-italic"> Gandiva </span>
                releases only when the grip is true.
              </p>
            </BentoCard>
          </div>
        </div>
      </div>
    </section>
  );
}
