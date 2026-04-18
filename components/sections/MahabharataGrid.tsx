'use client';

/**
 * MahabharataGrid (ancient-india only)
 * ------------------------------------------------------------------
 * Roster directory with two view modes:
 *   - GRID  : 80px square tiles, dense 4/6/8-col responsive grid
 *   - LIST  : 56px-tall single-column rows with thumbnail + stats
 * Selecting a character slides a detail panel down above the roster.
 * Chronicles (event paintings) live in their own row beneath.
 *
 * Persists view mode to localStorage `mahabharata-view`.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
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
import { KineticSerif } from '@/components/shared/KineticSerif';
import { UnrollText } from '@/components/shared/UnrollText';
import { mahabharataEvents, type MahabharataEvent } from '@/data/mahabharataEvents';

type ViewMode = 'grid' | 'list';
const STORAGE_KEY = 'mahabharata-view';

const STAT_LABELS: Array<{ key: keyof MahabharataCharacter['stats']; label: string }> = [
  { key: 'valor', label: 'Valor' },
  { key: 'wisdom', label: 'Wisdom' },
  { key: 'devotion', label: 'Devotion' },
  { key: 'strategy', label: 'Strategy' },
  { key: 'martial', label: 'Martial' },
  { key: 'influence', label: 'Influence' },
];

/** Real (non-fallback) image heuristic: must exist and not be a known
 *  placeholder path. Currently only Karna ships a real asset. */
function hasRealImage(c: MahabharataCharacter): boolean {
  if (!c.image) return false;
  if (c.image.includes('/characters/')) return false;
  // Static dataset uses /mahabharata/{id}.jpg as a TODO placeholder;
  // accept .png (provided assets) and any explicit non-placeholder path.
  return c.image.endsWith('.png');
}

function getInitials(name: string): string {
  const cleaned = name.replace(/^The\s+/i, '').trim();
  const parts = cleaned.split(/\s+/);
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return (parts[0][0]! + parts[1][0]!).toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase();
}

// ─── GRID TILE ───────────────────────────────────────────────────
function RosterTile({
  character,
  active,
  onSelect,
}: {
  character: MahabharataCharacter;
  active: boolean;
  onSelect: () => void;
}) {
  const real = hasRealImage(character);
  return (
    <div className="ai-roster-tile-wrap">
      <button
        type="button"
        onClick={onSelect}
        aria-label={`Select ${character.name}`}
        aria-pressed={active}
        data-cursor-hover="true"
        data-name={`${character.name} · ${character.nameDevanagari}`}
        className={`ai-roster-tile${active ? ' ai-roster-tile--active' : ''}`}
      >
        {real ? (
          <SmartImage
            src={character.image}
            alt={character.name}
            name={character.name}
            aspectClassName="aspect-square"
            className="ai-roster-tile__img"
          />
        ) : (
          <span className="ai-roster-tile__initials">{getInitials(character.name)}</span>
        )}
      </button>
      <p className="ai-roster-tile__name">{character.name}</p>
    </div>
  );
}

// ─── LIST ROW ───────────────────────────────────────────────────
function RosterListRow({
  character,
  active,
  onSelect,
}: {
  character: MahabharataCharacter;
  active: boolean;
  onSelect: () => void;
}) {
  const real = hasRealImage(character);
  const faction = mahabharataFactions[character.faction];
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      data-cursor-hover="true"
      className={`ai-roster-list-row${active ? ' ai-roster-list-row--active' : ''}`}
    >
      <span className="ai-roster-list-row__thumb">
        {real ? (
          <SmartImage
            src={character.image}
            alt={character.name}
            name={character.name}
            aspectClassName="aspect-square"
          />
        ) : (
          <span className="ai-roster-list-row__initials">
            {getInitials(character.name)}
          </span>
        )}
      </span>
      <span className="ai-roster-list-row__name">{character.name}</span>
      <span className="ai-roster-list-row__deva">
        <span className="ai-devanagari">{character.nameDevanagari}</span>
        <span aria-hidden className="ai-roster-list-row__dot">·</span>
        <span
          className="u-mono text-[9px] uppercase tracking-[0.22em]"
          style={{ color: faction.color }}
        >
          {faction.label}
        </span>
      </span>
      <span className="ai-roster-list-row__stats u-mono">
        <span>{character.stats.martial}</span>
        <span>{character.stats.strategy}</span>
        <span>{character.stats.wisdom}</span>
      </span>
    </button>
  );
}

// ─── DETAIL PANEL ───────────────────────────────────────────────
function StatBar({ label, value }: { label: string; value: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const { gsap } = registerGsap();
    const node = ref.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { scaleX: 0 },
        { scaleX: value / 100, duration: 0.8, ease: 'power2.out' },
      );
    }, node);
    return () => ctx.revert();
  }, [value]);
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 u-mono text-[9px] uppercase tracking-[0.22em] text-theme-ink/55">
        {label}
      </span>
      <div className="relative h-px flex-1 bg-theme-ink/15">
        <div
          ref={ref}
          className="absolute inset-y-0 left-0 w-full origin-left bg-theme-accent"
          style={{ boxShadow: '0 0 6px hsl(var(--accent) / 0.5)' }}
        />
      </div>
      <span className="w-7 text-right u-mono text-[10px] text-theme-accent">{value}</span>
    </div>
  );
}

function DetailPanel({
  character,
  onClose,
}: {
  character: MahabharataCharacter;
  onClose: () => void;
}) {
  const real = hasRealImage(character);
  const faction = mahabharataFactions[character.faction];
  return (
    <div className="ai-roster-detail">
      <button
        type="button"
        onClick={onClose}
        data-cursor-hover="true"
        className="u-mono mb-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-theme-accent hover:opacity-80"
      >
        <span aria-hidden>←</span> back to roster
      </button>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="ai-roster-detail__portrait">
            {real ? (
              <SmartImage
                src={character.image}
                alt={character.name}
                name={character.name}
                aspectClassName="aspect-square"
              />
            ) : (
              <span className="ai-roster-detail__initials">
                {getInitials(character.name)}
              </span>
            )}
          </div>
        </div>
        <div className="md:col-span-4">
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
          <span
            className="mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 u-mono text-[9px] uppercase tracking-[0.24em]"
            style={{
              borderColor: faction.color,
              color: faction.color,
            }}
          >
            <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: faction.color }} />
            {faction.label} · {faction.devanagari}
          </span>
          <p className="mt-4 text-[14px] leading-relaxed text-theme-ink/80">
            {character.bio}
          </p>
          <p className="ai-serif-italic mt-4 text-[14px] leading-snug text-theme-ink/70">
            &ldquo;{character.keyMoment}&rdquo;
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="u-mono mb-3 text-[10px] uppercase tracking-[0.28em] text-theme-ink/55">
            attributes · गुण
          </p>
          <div className="space-y-2.5">
            {STAT_LABELS.map((s) => (
              <StatBar
                key={`${character.id}-${s.key}`}
                label={s.label}
                value={character.stats[s.key]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EVENT (chronicles) CARD — kept from prior impl ────────────
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
        <div className="pointer-events-none absolute right-4 top-4 rounded-md bg-theme-bg/70 px-2 py-1 backdrop-blur-sm">
          <span className="ai-devanagari text-[14px] text-theme-accent">{event.hindi}</span>
        </div>
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

// ─── MAIN ───────────────────────────────────────────────────────
export function MahabharataGrid() {
  const { theme } = useTheme();
  const [view, setView] = useState<ViewMode>('grid');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  // hydrate persisted view
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'grid' || stored === 'list') setView(stored);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, view);
  }, [view]);

  useEffect(() => {
    if (theme !== 'ancient-india') return;
    const { gsap } = registerGsap();
    const node = sectionRef.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.from('.ai-roster-tile-wrap, .ai-roster-list-row', {
        y: 12,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.015,
        scrollTrigger: { trigger: node, start: 'top 80%' },
      });
    }, node);
    return () => ctx.revert();
  }, [theme, view]);

  const selected = useMemo(
    () => mahabharataCharacters.find((c) => c.id === selectedId) ?? null,
    [selectedId],
  );

  if (theme !== 'ancient-india') return null;

  const copy = ancientIndiaCopy.dcGrid;
  const total = mahabharataCharacters.length;
  const padded = String(total).padStart(3, '0');

  return (
    <section
      ref={sectionRef}
      id="mahabharata"
      className="u-section bg-theme-bg"
    >
      <div className="mx-auto max-w-[1280px]">
        {/* ── HEADER ───────────────────────────────────── */}
        <div className="mb-10 grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 md:col-span-8">
            <p className="u-mono mb-6 text-[11px] uppercase tracking-[0.3em] text-theme-accent">
              [ 03 · the roster ·{' '}
              <span className="ai-devanagari normal-case tracking-normal">पात्रावलि</span>
              {' '}]
              <span aria-hidden className="ml-3 text-theme-ink/30">॥</span>{' '}
              <span className="text-theme-ink/50">{copy.eyebrow}</span>
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
          <div className="col-span-12 flex flex-col items-end gap-3 md:col-span-4">
            <span className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/55">
              {total} / {padded}
            </span>
            {/* view-mode pill toggle */}
            <div className="ai-roster-toggle" role="tablist" aria-label="Roster view mode">
              <button
                type="button"
                role="tab"
                aria-selected={view === 'grid'}
                onClick={() => setView('grid')}
                data-cursor-hover="true"
                className={`ai-roster-toggle__btn${view === 'grid' ? ' ai-roster-toggle__btn--active' : ''}`}
              >
                grid
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={view === 'list'}
                onClick={() => setView('list')}
                data-cursor-hover="true"
                className={`ai-roster-toggle__btn${view === 'list' ? ' ai-roster-toggle__btn--active' : ''}`}
              >
                list
              </button>
            </div>
          </div>
        </div>

        <AiDivider className="mb-10" />

        {/* ── DETAIL PANEL (slides above roster) ──────── */}
        {selected ? (
          <div className="mb-10">
            <DetailPanel character={selected} onClose={() => setSelectedId(null)} />
          </div>
        ) : null}

        {/* ── ROSTER ──────────────────────────────────── */}
        {view === 'grid' ? (
          <div className="grid grid-cols-4 gap-x-3 gap-y-5 md:grid-cols-6 lg:grid-cols-8">
            {mahabharataCharacters.map((c) => (
              <RosterTile
                key={c.id}
                character={c}
                active={selectedId === c.id}
                onSelect={() =>
                  setSelectedId((prev) => (prev === c.id ? null : c.id))
                }
              />
            ))}
          </div>
        ) : (
          <div className="ai-roster-list">
            <div className="ai-roster-list__head u-mono">
              <span />
              <span>name · नाम</span>
              <span>faction · पक्ष</span>
              <span className="ai-roster-list__head-stats">str / agi / int</span>
            </div>
            <div className="ai-roster-list__body">
              {mahabharataCharacters.map((c) => (
                <RosterListRow
                  key={c.id}
                  character={c}
                  active={selectedId === c.id}
                  onSelect={() =>
                    setSelectedId((prev) => (prev === c.id ? null : c.id))
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* ── CHRONICLES (events) ─────────────────────── */}
        <div className="mt-16">
          <p className="u-mono mb-5 text-[11px] uppercase tracking-[0.3em] text-theme-accent">
            [ chronicles ·{' '}
            <span className="ai-devanagari normal-case tracking-normal">प्रसंग</span>
            {' '}]
          </p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {mahabharataEvents.slice(0, 3).map((ev) => (
              <EventBentoCard key={ev.id} event={ev} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
