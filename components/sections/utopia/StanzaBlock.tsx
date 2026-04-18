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

export function StanzaBlock() {
  return (
    <section
      data-morph-stop="stanza"
      className="relative w-full border-t border-theme-hairline bg-theme-bg px-6 py-28 sm:px-12 sm:py-40"
    >
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-12 gap-6">
        <RevealOnScroll
          as="div"
          className="col-span-12 md:col-span-3"
        >
          <span className="font-code text-[10px] uppercase tracking-[0.3em] text-theme-accent">
            [ 01 ] / stanzas
          </span>
          <p className="mt-3 font-code text-[11px] uppercase tracking-[0.24em] text-theme-ink-subtle">
            Observed. Catalogued. Filed.
          </p>
        </RevealOnScroll>

        <div className="col-span-12 flex flex-col gap-16 md:col-span-9">
          {STANZAS.map((stanza, idx) => (
            <div key={idx} className="flex flex-col gap-4">
              <RevealOnScroll
                as="div"
                delay={0.05}
                className="flex flex-wrap items-baseline gap-x-6 gap-y-2 font-display text-theme-ink"
                style={{
                  fontSize: 'clamp(2.4rem, 6vw, 5rem)',
                  letterSpacing: '-0.03em',
                  lineHeight: 0.95,
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
                className="max-w-[640px] font-lore text-[17px] leading-[1.55] text-theme-ink/70"
              >
                {stanza.line}
              </RevealOnScroll>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
