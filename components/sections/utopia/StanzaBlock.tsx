'use client';

import { RevealOnScroll } from '@/components/motion/RevealOnScroll';
import { ScrambleText } from '@/components/motion/ScrambleText';

const STANZAS: readonly [string, string, string][] = [
  ['MASKED.', 'MARKED.', 'WATCHED.'],
  ['HUNTED.', 'HAUNTED.', 'HOLLOWED.'],
  ['BROKEN.', 'BORN.', 'BAT.'],
];

/**
 * Utopia-Tokyo stanza block — brutally minimal.
 *
 * - Each stanza is a row with a sticky-feeling `NN / NN` mono index on the
 *   left and three words stacked vertically, centered.
 * - `py-[20vh]` between stanzas, hairline between.
 * - Words use ScrambleText, revealed with staggered delays 0, 0.15, 0.3.
 */
export function StanzaBlock() {
  return (
    <section
      data-morph-stop="stanza"
      className="relative w-full border-t border-theme-hairline bg-theme-bg"
    >
      {STANZAS.map((triplet, idx) => (
        <div
          key={idx}
          className="relative mx-auto flex w-full max-w-[1600px] items-center px-6 py-[20vh] sm:px-12"
          style={{
            borderTop: idx === 0 ? undefined : '1px solid hsl(var(--hairline, 45 22% 90%) / 0.08)',
          }}
        >
          {/* Sticky-feeling left index */}
          <span className="absolute left-6 top-[20vh] font-code text-[10px] uppercase tracking-[0.3em] text-theme-ink-subtle tabular-nums sm:left-12">
            {String(idx + 1).padStart(2, '0')} / {String(STANZAS.length).padStart(2, '0')}
          </span>

          {/* Centered vertical triplet */}
          <div
            className="mx-auto flex flex-col items-center font-display text-theme-ink"
            style={{
              fontSize: 'clamp(4rem, 13vw, 14rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.02em',
            }}
          >
            {triplet.map((word, wIdx) => (
              <RevealOnScroll
                key={wIdx}
                as="span"
                delay={wIdx * 0.15}
                y={24}
                className={
                  wIdx === triplet.length - 1
                    ? 'block text-theme-accent'
                    : 'block'
                }
              >
                <ScrambleText
                  as="span"
                  text={word}
                  trigger="scroll"
                  tickMs={42}
                  revealStepMs={48}
                />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
