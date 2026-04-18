'use client';

import { RevealOnScroll } from '@/components/motion/RevealOnScroll';
import { ScrambleText } from '@/components/motion/ScrambleText';

type Stanza = {
  triplet: [string, string, string];
  line: string;
};

const STANZAS: readonly Stanza[] = [
  {
    triplet: ['MASKED.', 'MARKED.', 'WATCHED.'],
    line: 'Every rooftop is a witness. Every shadow a ledger.',
  },
  {
    triplet: ['PATIENT.', 'PRECISE.', 'PREPARED.'],
    line: 'The city sleeps in shifts. One cowl never does.',
  },
  {
    triplet: ['QUIET.', 'QUICK.', 'QUEEN&rsquo;S GAMBIT.'],
    line: 'Gotham reads like a chessboard after a bad rain.',
  },
];

/**
 * Utopia-Tokyo stanza block.
 *
 * Layout notes:
 * - Section padding `py-[20vh]` for the generous vertical rhythm.
 * - Each word sits on its own line inside a huge Bebas Neue clamp
 *   (`clamp(4rem, 14vw, 16rem)`), tight leading, per-stanza hairline rule
 *   between rows (no box chrome — utopiatokyo.com is brutally minimal).
 * - Lore caption under each stanza is constrained to `max-w-[68ch]` and
 *   centred, font-lore (Crimson Text) with larger leading.
 */
export function StanzaBlock() {
  return (
    <section
      data-morph-stop="stanza"
      className="relative w-full border-t border-theme-hairline bg-theme-bg px-6 py-[20vh] sm:px-12"
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-24">
        <RevealOnScroll
          as="div"
          className="flex items-baseline justify-between gap-6"
        >
          <span className="font-code text-[10px] uppercase tracking-[0.3em] text-theme-accent">
            [ 01 ] / stanzas
          </span>
          <span className="font-code text-[10px] uppercase tracking-[0.24em] text-theme-ink-subtle">
            Observed. Catalogued. Filed.
          </span>
        </RevealOnScroll>

        {STANZAS.map((stanza, idx) => (
          <div
            key={idx}
            className="relative flex flex-col gap-10 border-t border-theme-hairline pt-16"
            data-cursor="target"
          >
            <span className="absolute left-0 top-4 font-code text-[10px] uppercase tracking-[0.3em] text-theme-ink-subtle tabular-nums">
              {String(idx + 1).padStart(2, '0')} / {String(STANZAS.length).padStart(2, '0')}
            </span>

            <RevealOnScroll
              as="div"
              delay={0.05}
              className="flex flex-col font-display text-theme-ink"
              style={{
                fontSize: 'clamp(4rem, 14vw, 16rem)',
                letterSpacing: '-0.04em',
                lineHeight: 0.88,
              }}
            >
              {stanza.triplet.map((word, wIdx) => (
                <ScrambleText
                  key={wIdx}
                  as="span"
                  text={word.replace(/&rsquo;/g, '\u2019')}
                  trigger="scroll"
                  tickMs={42}
                  revealStepMs={48}
                  className={
                    wIdx === stanza.triplet.length - 1
                      ? 'text-theme-accent'
                      : undefined
                  }
                />
              ))}
            </RevealOnScroll>

            <RevealOnScroll
              as="p"
              delay={0.2}
              className="mx-auto max-w-[68ch] text-center font-lore text-[19px] leading-[1.7] text-theme-ink/75"
            >
              {stanza.line}
            </RevealOnScroll>
          </div>
        ))}
      </div>
    </section>
  );
}
