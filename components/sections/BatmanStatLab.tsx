'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { registerGsap } from '@/lib/gsap';
import { useHeroes, useVillains, type Character } from '@/hooks/useCharacters';
import { SmartImage } from '@/components/shared/SmartImage';
import { CornerReticle } from '@/components/shared/CornerReticle';
import { ErrorState } from '@/components/shared/ErrorState';

/* ------------------------------------------------------------------
 * Types + axis mapping
 * ------------------------------------------------------------------ */

type StatKey = keyof Character['powerstats'];

interface AxisDef {
  readonly key: StatKey;
  readonly label: string;
  readonly kanji: string;
  readonly short: string;
}

const AXES: readonly AxisDef[] = [
  { key: 'strength', label: 'STRENGTH', kanji: '強', short: 'STR' },
  { key: 'speed', label: 'AGILITY', kanji: '速', short: 'AGI' },
  { key: 'power', label: 'FEROCITY', kanji: '烈', short: 'FER' },
  { key: 'intelligence', label: 'INTELLECT', kanji: '智', short: 'INT' },
  { key: 'durability', label: 'SPIRIT', kanji: '魂', short: 'SPR' },
  { key: 'combat', label: 'VITALITY', kanji: '耐', short: 'VIT' },
] as const;

type StatValues = [number, number, number, number, number, number];

type ViewMode = 'grid' | 'list';

function clamp01to100(v: number): number {
  if (v < 0) return 0;
  if (v > 100) return 100;
  return Math.round(v);
}

function valuesFromCharacter(c: Character): StatValues {
  return [
    c.powerstats.strength,
    c.powerstats.speed,
    c.powerstats.power,
    c.powerstats.intelligence,
    c.powerstats.durability,
    c.powerstats.combat,
  ];
}

const MAX_STAT_DISTANCE = Math.sqrt(6 * 100 * 100);

interface MatchResult {
  index: number;
  character: Character;
  distance: number;
  score: number;
}

function findClosestMatch(
  values: StatValues,
  roster: readonly Character[],
): MatchResult | null {
  let best: MatchResult | null = null;
  for (let i = 0; i < roster.length; i += 1) {
    const c = roster[i];
    if (!c) continue;
    const v = valuesFromCharacter(c);
    let sumSq = 0;
    for (let j = 0; j < 6; j += 1) {
      const a = values[j as 0 | 1 | 2 | 3 | 4 | 5];
      const b = v[j as 0 | 1 | 2 | 3 | 4 | 5];
      const d = a - b;
      sumSq += d * d;
    }
    const distance = Math.sqrt(sumSq);
    const score = Math.round(100 - (distance / MAX_STAT_DISTANCE) * 100);
    if (best === null || distance < best.distance) {
      best = { index: i, character: c, distance, score };
    } else if (
      distance === best.distance &&
      c.alignment === 'hero' &&
      best.character.alignment !== 'hero'
    ) {
      best = { index: i, character: c, distance, score };
    }
  }
  return best;
}

function hexVertex(i: number, n: number, r: number, cx: number, cy: number) {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
  return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
}

function randomHex(len: number): string {
  let s = '';
  const chars = '0123456789ABCDEF';
  for (let i = 0; i < len; i += 1) {
    s += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return s;
}

/* ------------------------------------------------------------------
 * Hex Radar with draggable vertex handles
 * ------------------------------------------------------------------ */

interface HexRadarProps {
  values: StatValues;
  overallNumber: number;
  onChange: (axisIndex: number, value: number) => void;
  animateKey: string;
}

function HexRadar({ values, overallNumber, onChange, animateKey }: HexRadarProps) {
  const size = 420;
  const cx = size / 2;
  const cy = size / 2;
  const rMax = size * 0.36;
  const rings = [0.25, 0.5, 0.75, 1];
  const n = AXES.length;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const polyRef = useRef<SVGPolygonElement | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const axisPts = useMemo(
    () => AXES.map((_, i) => hexVertex(i, n, rMax, cx, cy)),
    [cx, cy, n, rMax],
  );

  const valuePts = useMemo(
    () =>
      values.map((v, i) =>
        hexVertex(i, n, (clamp01to100(v) / 100) * rMax, cx, cy),
      ),
    [values, cx, cy, n, rMax],
  );

  const polyPath = valuePts.map((p) => `${p.x},${p.y}`).join(' ');

  // Entrance animation when animateKey changes (i.e. character switch).
  useEffect(() => {
    const { gsap } = registerGsap();
    const poly = polyRef.current;
    if (!poly) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        poly,
        { scale: 0, transformOrigin: `${cx}px ${cy}px` },
        { scale: 1, duration: 0.7, ease: 'power3.out' },
      );
    }, poly);
    return () => ctx.revert();
  }, [animateKey, cx, cy]);

  const pointFromEvent = useCallback(
    (e: ReactPointerEvent<SVGCircleElement> | PointerEvent): { x: number; y: number } | null => {
      const svg = svgRef.current;
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      const scaleX = size / rect.width;
      const scaleY = size / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    [size],
  );

  const updateFromPoint = useCallback(
    (axisIndex: number, px: number, py: number) => {
      const axisAngle = -Math.PI / 2 + (axisIndex * 2 * Math.PI) / n;
      const ax = Math.cos(axisAngle);
      const ay = Math.sin(axisAngle);
      const dx = px - cx;
      const dy = py - cy;
      // Projection of (dx,dy) onto axis unit vector
      const proj = dx * ax + dy * ay;
      const v = Math.max(0, Math.min(100, (proj / rMax) * 100));
      onChange(axisIndex, clamp01to100(v));
    },
    [cx, cy, n, rMax, onChange],
  );

  const handlePointerDown = useCallback(
    (axisIndex: number) => (e: ReactPointerEvent<SVGCircleElement>) => {
      e.preventDefault();
      const target = e.currentTarget;
      try {
        target.setPointerCapture(e.pointerId);
      } catch {
        /* some browsers throw on captured pointers */
      }
      setDraggingIdx(axisIndex);
      const pt = pointFromEvent(e);
      if (pt) updateFromPoint(axisIndex, pt.x, pt.y);
    },
    [pointFromEvent, updateFromPoint],
  );

  const handlePointerMove = useCallback(
    (axisIndex: number) => (e: ReactPointerEvent<SVGCircleElement>) => {
      if (draggingIdx !== axisIndex) return;
      const pt = pointFromEvent(e);
      if (pt) updateFromPoint(axisIndex, pt.x, pt.y);
    },
    [draggingIdx, pointFromEvent, updateFromPoint],
  );

  const handlePointerUp = useCallback(
    (e: ReactPointerEvent<SVGCircleElement>) => {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
      setDraggingIdx(null);
    },
    [],
  );

  return (
    <div className="relative w-full max-w-[460px]">
      {/* Overall number cream stencil behind radar */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{
          fontFamily: 'var(--font-stencil), var(--font-display), sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(6rem, 16vw, 11rem)',
          color: 'hsl(var(--paper) / 0.08)',
          letterSpacing: '-0.05em',
          lineHeight: 1,
          textTransform: 'uppercase',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        {overallNumber.toString().padStart(2, '0')}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${size} ${size}`}
        className="bat-radar-svg relative block h-auto w-full"
        style={{ zIndex: 1 }}
        role="img"
        aria-label="Adjustable stat radar"
      >
        {/* concentric rings */}
        {rings.map((r, i) => {
          const pts = AXES.map((_, j) => hexVertex(j, n, r * rMax, cx, cy));
          return (
            <polygon
              key={`ring-${i}`}
              points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="hsl(var(--accent))"
              strokeWidth={i === rings.length - 1 ? 1.1 : 0.6}
              opacity={0.35}
            />
          );
        })}
        {/* axes */}
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
        {/* active guide line while dragging */}
        {draggingIdx !== null && axisPts[draggingIdx] !== undefined ? (
          <line
            x1={cx}
            y1={cy}
            x2={axisPts[draggingIdx]!.x}
            y2={axisPts[draggingIdx]!.y}
            stroke="hsl(var(--accent))"
            strokeWidth={1.1}
            opacity={0.9}
            strokeDasharray="4 4"
          />
        ) : null}

        {/* character polygon */}
        <polygon
          ref={polyRef}
          points={polyPath}
          fill="hsl(var(--accent) / 0.35)"
          stroke="hsl(var(--accent))"
          strokeWidth={1.4}
        />

        {/* axis labels */}
        {AXES.map((ax, i) => {
          const p = hexVertex(i, n, rMax + 22, cx, cy);
          return (
            <text
              key={`lbl-${ax.key}`}
              x={p.x}
              y={p.y}
              fontFamily="var(--font-mono)"
              fontSize={10}
              letterSpacing={1.8}
              fill="hsl(var(--accent))"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {ax.label}
            </text>
          );
        })}

        {/* draggable handles */}
        {valuePts.map((p, i) => {
          const active = draggingIdx === i;
          return (
            <circle
              key={`h-${i}`}
              cx={p.x}
              cy={p.y}
              r={active ? 9 : 6}
              fill="hsl(var(--bg))"
              stroke="hsl(var(--accent))"
              strokeWidth={1.6}
              className="bat-slider-handle"
              onPointerDown={handlePointerDown(i)}
              onPointerMove={handlePointerMove(i)}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{ cursor: 'grab', touchAction: 'none' }}
            />
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Stat card — vertical ticks + draggable number
 * ------------------------------------------------------------------ */

interface StatCardProps {
  axis: AxisDef;
  value: number;
  onChange: (next: number) => void;
}

function StatCard({ axis, value, onChange }: StatCardProps) {
  const startY = useRef(0);
  const startVal = useRef(0);
  const [dragging, setDragging] = useState(false);

  const ticks = 20;
  const filled = Math.round((clamp01to100(value) / 100) * ticks);

  const handleDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
      startY.current = e.clientY;
      startVal.current = value;
      setDragging(true);
    },
    [value],
  );

  const handleMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      const dy = startY.current - e.clientY; // drag up → positive
      const next = clamp01to100(startVal.current + dy * 0.4);
      onChange(next);
    },
    [dragging, onChange],
  );

  const handleUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
      setDragging(false);
    },
    [],
  );

  return (
    <div className="bat-stat-card">
      <div
        className="bat-stat-card__num"
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
        style={{
          cursor: dragging ? 'grabbing' : 'ns-resize',
          touchAction: 'none',
          userSelect: 'none',
        }}
        role="slider"
        aria-label={`${axis.label} value`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        tabIndex={0}
      >
        {clamp01to100(value).toString().padStart(2, '0')}
      </div>
      <div className="bat-stat-card__ticks bat-stat-card__ticks--tall" aria-hidden>
        {Array.from({ length: ticks }).map((_, i) => (
          <span
            key={i}
            className="bat-stat-card__tick"
            style={{
              height: `${12 + (i / ticks) * 46}px`,
              opacity: i < filled ? 1 : 0.15,
            }}
          />
        ))}
      </div>
      <div className="bat-stat-card__label">{axis.label}</div>
      <div className="bat-stat-card__rail" aria-hidden>
        <span>{axis.kanji} · {axis.short}</span>
      </div>
      <span aria-hidden className="bat-stat-card__corner bat-stat-card__corner--tl" />
      <span aria-hidden className="bat-stat-card__corner bat-stat-card__corner--tr" />
      <span aria-hidden className="bat-stat-card__corner bat-stat-card__corner--bl" />
      <span aria-hidden className="bat-stat-card__corner bat-stat-card__corner--br" />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Generating Mask overlay — scramble reveal + progress bar
 * ------------------------------------------------------------------ */

interface GeneratingOverlayProps {
  targetName: string;
  onDone: () => void;
}

function GeneratingOverlay({ targetName, onDone }: GeneratingOverlayProps) {
  const [display, setDisplay] = useState('');
  const [progress, setProgress] = useState(0);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const hash = useMemo(() => randomHex(6), []);
  const block = useMemo(() => Math.floor(10 + Math.random() * 89), []);

  useEffect(() => {
    const upper = targetName.toUpperCase();
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
    let locked = 0;
    const total = upper.length;
    const scramble = window.setInterval(() => {
      locked = Math.min(total, locked + 1);
      let out = '';
      for (let i = 0; i < total; i += 1) {
        if (i < locked) {
          out += upper.charAt(i);
        } else {
          const ch = upper.charAt(i);
          if (ch === ' ') out += ' ';
          else out += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      }
      setDisplay(out);
    }, 80);

    const { gsap } = registerGsap();
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: 100,
      duration: 1.2,
      ease: 'power1.inOut',
      onUpdate: () => setProgress(Math.round(obj.v)),
      onComplete: () => {
        window.clearInterval(scramble);
        setDisplay(upper);
        setProgress(100);
        window.setTimeout(onDone, 180);
      },
    });

    return () => {
      window.clearInterval(scramble);
      tween.kill();
    };
  }, [targetName, onDone]);

  return (
    <div ref={overlayRef} className="bat-generating-overlay" role="status" aria-live="polite">
      <div className="bat-generating-overlay__inner">
        <p className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/60">
          [ GENERATING MASK ]
        </p>
        <div className="bat-generating-overlay__name">{display || '\u00A0'}</div>
        <div className="bat-generating-overlay__bar" aria-hidden>
          <div
            className="bat-generating-overlay__fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="bat-generating-overlay__meta u-mono">
          <span>COMPLETION {progress.toString().padStart(2, '0')}%</span>
          <span>HASH: 0x{hash}</span>
          <span>PROCESSING DATA CHUNKS</span>
          <span>BLOCK: B-{block}</span>
          <span>ANALYZING SKILL MATRIX_</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Tile (grid) + list row
 * ------------------------------------------------------------------ */

interface TileProps {
  character: Character;
  index: number;
  hoverIndex: number | null;
  onHover: (i: number | null) => void;
  onSelect: (i: number) => void;
}

function MaskTile({ character, index, hoverIndex, onHover, onSelect }: TileProps) {
  // Compute neighbor-shift displacement when a sibling is hovered.
  let dx = 0;
  let dy = 0;
  if (hoverIndex !== null && hoverIndex !== index) {
    const cols = 4;
    const hc = hoverIndex % cols;
    const hr = Math.floor(hoverIndex / cols);
    const ic = index % cols;
    const ir = Math.floor(index / cols);
    const ddx = ic - hc;
    const ddy = ir - hr;
    const dist = Math.max(Math.abs(ddx), Math.abs(ddy));
    if (dist === 1) {
      dx = Math.sign(ddx) * 4;
      dy = Math.sign(ddy) * 4;
    }
  }

  const style: CSSProperties = {
    transform: `translate(${dx}px, ${dy}px)`,
    transition: 'transform 280ms cubic-bezier(.2,.8,.2,1)',
  };

  return (
    <button
      type="button"
      className="bat-tile"
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(index)}
      onBlur={() => onHover(null)}
      onClick={() => onSelect(index)}
      data-cursor-hover
      aria-label={`Select ${character.name}`}
      style={style}
    >
      <CornerReticle inset={6} size={16} stroke={1}>
        <div className="bat-tile__img">
          <SmartImage
            src={character.images.sm}
            alt={character.name}
            name={character.name}
            aspectClassName="aspect-square"
          />
          <div className="bat-tile__scrim" aria-hidden />
          <span className="bat-tile__label u-mono">
            {(index + 1).toString().padStart(2, '0')} · {character.name}
          </span>
        </div>
      </CornerReticle>
    </button>
  );
}

/* ------------------------------------------------------------------
 * Main component
 * ------------------------------------------------------------------ */

export function BatmanStatLab() {
  const { heroes } = useHeroes();
  const { villains } = useVillains();

  // 4×4 = 16 tiles: 8 heroes + 8 villains.
  const roster = useMemo<readonly Character[]>(
    () => [...heroes.slice(0, 8), ...villains.slice(0, 8)],
    [heroes, villains],
  );

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [values, setValues] = useState<StatValues>([0, 0, 0, 0, 0, 0]);
  const [generatingFor, setGeneratingFor] = useState<number | null>(null);
  const [animateKey, setAnimateKey] = useState('initial');

  const sectionRef = useRef<HTMLElement | null>(null);

  const selected = selectedIdx !== null ? roster[selectedIdx] : undefined;

  // When a tile is clicked, start generating overlay; on completion, commit values.
  const commitSelection = useCallback(
    (idx: number) => {
      const character = roster[idx];
      if (!character) return;
      setSelectedIdx(idx);
      setValues(valuesFromCharacter(character));
      setGeneratingFor(null);
      setAnimateKey(`${character.id}-${Date.now()}`);
    },
    [roster],
  );

  const onSelectTile = useCallback((idx: number) => {
    setGeneratingFor(idx);
  }, []);

  const handleGenerationDone = useCallback(() => {
    if (generatingFor === null) return;
    commitSelection(generatingFor);
  }, [generatingFor, commitSelection]);

  const updateAxis = useCallback((axisIndex: number, next: number) => {
    setValues((prev) => {
      const copy: StatValues = [prev[0], prev[1], prev[2], prev[3], prev[4], prev[5]];
      if (axisIndex < 0 || axisIndex >= copy.length) return prev;
      copy[axisIndex as 0 | 1 | 2 | 3 | 4 | 5] = clamp01to100(next);
      return copy;
    });
  }, []);

  const resetToApi = useCallback(() => {
    if (!selected) return;
    setValues(valuesFromCharacter(selected));
    setAnimateKey(`reset-${selected.id}-${Date.now()}`);
  }, [selected]);

  const randomize = useCallback(() => {
    const next: StatValues = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 6; i += 1) {
      next[i as 0 | 1 | 2 | 3 | 4 | 5] = Math.round(10 + Math.random() * 85);
    }
    setValues(next);
    setAnimateKey(`rand-${Date.now()}`);
  }, []);

  // Scroll-in animation for header.
  useEffect(() => {
    const { gsap } = registerGsap();
    const node = sectionRef.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.from('.bat-lab-title', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: node, start: 'top 80%' },
      });
    }, node);
    return () => ctx.revert();
  }, []);

  // Closest-match prediction (recomputes only when slider values or roster change)
  const match = useMemo(
    () => findClosestMatch(values, roster),
    [values, roster],
  );
  const isPerfectSelfMatch =
    selected !== undefined && match !== null && match.distance === 0
      && match.character.id === selected.id;

  const matchCardRef = useRef<HTMLButtonElement | null>(null);
  const lastMatchIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (!match) return;
    const node = matchCardRef.current;
    if (!node) {
      lastMatchIdRef.current = match.character.id;
      return;
    }
    if (
      lastMatchIdRef.current !== null &&
      lastMatchIdRef.current !== match.character.id
    ) {
      const { gsap } = registerGsap();
      gsap.fromTo(
        node,
        { borderColor: 'hsl(var(--accent))', boxShadow: '0 0 22px hsl(var(--accent) / 0.55)' },
        {
          borderColor: 'hsl(var(--accent) / 0.55)',
          boxShadow: '0 0 0 hsl(var(--accent) / 0)',
          duration: 0.4,
          ease: 'power2.out',
        },
      );
    }
    lastMatchIdRef.current = match.character.id;
  }, [match]);

  // Derived sums
  const sum = values.reduce((a, b) => a + b, 0);
  const level = Math.round(sum / 6);
  const skillPoints = Math.max(0, 100 - Math.round(sum / 6));
  const overall = Math.round(sum / 6);

  if (roster.length === 0) {
    return (
      <section ref={sectionRef} id="dc" className="relative u-section bg-theme-bg">
        <div className="mx-auto max-w-7xl">
          <ErrorState variant="runtime" />
        </div>
      </section>
    );
  }

  const collectionCount = roster.length.toString().padStart(3, '0');
  const ctaName = selected ? selected.name.replace(/\s+/g, '_').toUpperCase() : '';

  return (
    <section
      ref={sectionRef}
      id="dc"
      className="bat-crosshair-bg relative u-section bg-theme-bg"
    >
      <div className="mx-auto max-w-7xl">
        {selected ? (
          // ============ PANE B: Radar + Stat Lab ============
          <div className="relative">
            {/* Row 1 header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setSelectedIdx(null)}
                data-cursor-hover
                className="bat-cta-bracket"
                aria-label="Back to roster"
              >
                [ &larr; BACK TO ROSTER ]
              </button>
              <p className="u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/55">
                [ mask_{(selectedIdx! + 1).toString().padStart(4, '0')} / {selected.id} ]
              </p>
              <span
                className="u-mono inline-flex items-center gap-2 px-3 py-1 text-[10px] uppercase tracking-[0.28em]"
                style={{
                  border: '1px solid hsl(var(--accent))',
                  color: 'hsl(var(--accent))',
                }}
              >
                {selected.alignment === 'hero' ? 'HERO' : 'VILLAIN'}
              </span>
            </div>

            {/* Row 2 title */}
            <div className="bat-lab-title mb-10">
              <p
                className="bat-stencil bat-stencil--accent"
                style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2.2rem)' }}
              >
                THE STORY OF
              </p>
              <h2
                className="bat-stencil bat-stencil--accent"
                style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}
              >
                {selected.name.toUpperCase()}
              </h2>
              <p className="mt-3 u-mono text-[10px] uppercase tracking-[0.3em] text-theme-ink/55">
                {selected.title} · {selected.realName} · {selected.firstAppearance}
              </p>
            </div>

            {/* Row 3 — left stats | radar | right stats */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-3 flex flex-col gap-3">
                {([0, 1, 4] as const).map((i) => {
                  const axis = AXES[i];
                  if (!axis) return null;
                  const v = values[i] ?? 0;
                  return (
                    <StatCard
                      key={axis.key}
                      axis={axis}
                      value={v}
                      onChange={(next) => updateAxis(i, next)}
                    />
                  );
                })}
              </div>

              <div className="col-span-12 md:col-span-6">
                <CornerReticle inset={0} size={28}>
                  <div className="flex items-center justify-center px-4 py-4">
                    <HexRadar
                      values={values}
                      overallNumber={overall}
                      onChange={updateAxis}
                      animateKey={animateKey}
                    />
                  </div>
                </CornerReticle>
              </div>

              <div className="col-span-12 md:col-span-3 flex flex-col gap-3">
                {([3, 5, 2] as const).map((i) => {
                  const axis = AXES[i];
                  if (!axis) return null;
                  const v = values[i] ?? 0;
                  return (
                    <StatCard
                      key={axis.key}
                      axis={axis}
                      value={v}
                      onChange={(next) => updateAxis(i, next)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Row 4 — RANDOM / CTA / RESET */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={randomize}
                data-cursor-hover
                className="u-mono text-[11px] uppercase tracking-[0.3em] text-theme-ink/65 hover:text-theme-accent"
              >
                RANDOM SELECTION
              </button>
              <span className="bat-cta-bracket">
                &gt;_DISCOVER_{ctaName}_PROFILE
              </span>
              <button
                type="button"
                onClick={resetToApi}
                data-cursor-hover
                className="u-mono text-[11px] uppercase tracking-[0.3em] text-theme-ink/65 hover:text-theme-accent"
              >
                RESET
              </button>
            </div>

            {/* Row 5 — LEVEL / SKILL POINTS */}
            <div className="mt-6 grid grid-cols-12 items-stretch gap-4">
              <div className="col-span-6 md:col-span-3 bat-stat-card">
                <div className="bat-stat-card__num">
                  {level.toString().padStart(2, '0')}
                </div>
                <div className="bat-stat-card__label" style={{ padding: '10px' }}>
                  LEVEL
                </div>
              </div>
              <div className="hidden md:block md:col-span-6" />
              <div className="col-span-6 md:col-span-3 bat-stat-card">
                <div className="bat-stat-card__num">
                  {skillPoints.toString().padStart(2, '0')}
                </div>
                <div className="bat-stat-card__label" style={{ padding: '10px' }}>
                  SKILL POINTS
                </div>
              </div>
            </div>

            {/* Row 6 — Closest Match prediction card */}
            {match ? (
              <div className="mt-6 grid grid-cols-12 gap-4">
                <button
                  type="button"
                  ref={matchCardRef}
                  onClick={() => commitSelection(match.index)}
                  data-cursor-hover
                  className="bat-match-card col-span-12 text-left"
                  aria-label={`Switch lab to ${match.character.name}`}
                >
                  <span
                    className="bat-match-bar"
                    aria-hidden
                    style={{ width: `${Math.max(0, Math.min(100, match.score))}%` }}
                  />
                  <div className="bat-match-card__thumb">
                    <SmartImage
                      src={match.character.images.sm}
                      alt={match.character.name}
                      name={match.character.name}
                      aspectClassName="aspect-square"
                    />
                  </div>
                  <div className="bat-match-card__body">
                    <span className="bat-match-card__eyebrow">
                      [ closest match &middot; 0.{match.index.toString().padStart(2, '0')} ]
                    </span>
                    <h3 className="bat-stencil bat-stencil--accent bat-match-card__name">
                      {match.character.name.toUpperCase()}
                    </h3>
                    <span className="bat-match-card__tagline">
                      Closest in temperament to {match.character.title}
                    </span>
                  </div>
                  <div className="bat-match-card__meta">
                    <span className="bat-match-card__pill">
                      {match.character.alignment === 'hero' ? 'HERO' : 'VILLAIN'}
                    </span>
                    <span className="bat-match-card__score">
                      {isPerfectSelfMatch
                        ? 'PERFECT MATCH'
                        : `MATCH SCORE: ${match.score}%`}
                    </span>
                  </div>
                </button>
              </div>
            ) : null}

            {generatingFor !== null && roster[generatingFor] ? (
              <GeneratingOverlay
                targetName={roster[generatingFor]!.name}
                onDone={handleGenerationDone}
              />
            ) : null}
          </div>
        ) : (
          // ============ PANE A: Mask Grid / List ============
          <div className="relative">
            {/* Header */}
            <div className="bat-lab-title grid grid-cols-12 items-end gap-6">
              <div className="col-span-12 lg:col-span-8">
                <p className="u-mono mb-4 text-[11px] uppercase tracking-[0.3em] text-theme-accent">
                  [ 02 &middot; the roster ]
                </p>
                <h2
                  className="bat-stencil bat-stencil--accent"
                  style={{ fontSize: 'clamp(3rem, 9vw, 7rem)' }}
                >
                  THE ROSTER
                </h2>
                <p className="mt-3 u-mono text-[11px] uppercase tracking-[0.3em] text-theme-ink/60">
                  [ &darr; SELECT A MASK ]
                </p>
              </div>
              <div className="col-span-12 lg:col-span-4 flex lg:justify-end">
                <span className="bat-cta-bracket">
                  COLLECTION / {collectionCount}
                </span>
              </div>
            </div>

            {/* Toggle + ruler */}
            <div className="mt-8 flex items-center justify-center">
              <div className="bat-tile-toggle" role="tablist" aria-label="Roster view mode">
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'grid'}
                  onClick={() => setViewMode('grid')}
                  data-cursor-hover
                  className={`bat-tile-toggle__btn ${viewMode === 'grid' ? 'is-active' : ''}`}
                >
                  [ GRID ]
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'list'}
                  onClick={() => setViewMode('list')}
                  data-cursor-hover
                  className={`bat-tile-toggle__btn ${viewMode === 'list' ? 'is-active' : ''}`}
                >
                  [ LIST ]
                </button>
              </div>
            </div>

            <div className="u-rule mt-8 mb-8" />

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {roster.map((character, idx) => (
                  <MaskTile
                    key={`${character.id}-${idx}`}
                    character={character}
                    index={idx}
                    hoverIndex={hoverIdx}
                    onHover={setHoverIdx}
                    onSelect={onSelectTile}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-theme-accent/20 border border-theme-accent/30">
                <div className="grid grid-cols-12 gap-2 bg-theme-accent/10 px-3 py-2 u-mono text-[10px] uppercase tracking-[0.28em] text-theme-accent">
                  <span className="col-span-1">#</span>
                  <span className="col-span-5">MASK</span>
                  {AXES.map((a) => (
                    <span key={a.key} className="col-span-1 text-right">
                      {a.short}
                    </span>
                  ))}
                </div>
                {roster.map((character, idx) => {
                  const v = valuesFromCharacter(character);
                  return (
                    <button
                      type="button"
                      key={`list-${character.id}-${idx}`}
                      onClick={() => onSelectTile(idx)}
                      data-cursor-hover
                      className="grid grid-cols-12 gap-2 px-3 py-3 text-left u-mono text-[11px] uppercase tracking-[0.2em] text-theme-ink/80 transition-colors hover:bg-theme-accent/10 hover:text-theme-accent"
                    >
                      <span className="col-span-1 text-theme-accent">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <span className="col-span-5">{character.name}</span>
                      {v.map((n, i) => (
                        <span key={i} className="col-span-1 text-right tabular-nums">
                          {n.toString().padStart(2, '0')}
                        </span>
                      ))}
                    </button>
                  );
                })}
              </div>
            )}

            {generatingFor !== null && roster[generatingFor] ? (
              <GeneratingOverlay
                targetName={roster[generatingFor]!.name}
                onDone={handleGenerationDone}
              />
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

export default BatmanStatLab;
