'use client';

import { ParallaxLayer } from '@/components/motion/ParallaxLayer';
import { RevealOnScroll } from '@/components/motion/RevealOnScroll';

const LORE = [
  'Gotham was never built; it was bargained for &mdash; each brick an I.O.U. pressed into the palm of a tired alderman.',
  'Wayne Enterprises watches the corridors the commissioner forgot to light, and the archives sing back in a dialect of meter readings, CCTV stills, and receipts pressed between the pages of a dead man&rsquo;s calendar.',
  'To walk the city after midnight is to consult an older version of yourself: still convinced the law would be enough, still willing to be proven wrong.',
];

/**
 * Lore passage.
 *
 * utopiatokyo.com renders its long-form passages as a single narrow column
 * centred in a very tall section. We match that here:
 * - `py-[20vh]` for generous vertical breathing room.
 * - Eyebrow + heading stack centred above the column.
 * - One narrow column (`max-w-[680px]`, ~68ch at this font size), font-lore
 *   (Crimson Text) at 19px with 1.75 leading.
 * - Hairline top border only — no boxes, no panels.
 */
export function LoreParallax() {
  return (
    <section
      data-morph-stop="lore"
      className="relative w-full overflow-hidden border-t border-theme-hairline bg-theme-bg px-6 py-[20vh] sm:px-12"
    >
      <div className="mx-auto flex w-full max-w-[680px] flex-col items-center gap-10 text-center">
        <RevealOnScroll as="div" className="flex flex-col items-center gap-4">
          <span className="font-code text-[10px] uppercase tracking-[0.3em] text-theme-accent">
            [ 02 ] / lore
          </span>
          <h3
            className="font-display text-theme-ink"
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4.4rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.025em',
            }}
          >
            The quiet <span className="text-theme-accent">corrosion.</span>
          </h3>
          <span
            aria-hidden
            className="mt-2 inline-block h-px w-16 bg-theme-hairline"
          />
        </RevealOnScroll>

        <ParallaxLayer speed={-0.12} className="flex flex-col gap-8 text-left">
          {LORE.map((para, idx) => (
            <RevealOnScroll
              as="p"
              key={idx}
              delay={idx * 0.08}
              className="font-lore text-[19px] leading-[1.75] text-theme-ink/80"
              data-cursor="target"
            >
              <span dangerouslySetInnerHTML={{ __html: para }} />
            </RevealOnScroll>
          ))}

          <RevealOnScroll
            as="div"
            delay={0.3}
            className="mt-6 inline-flex items-center gap-3 self-center font-code text-[10px] uppercase tracking-[0.3em] text-theme-ink-subtle"
          >
            <span
              aria-hidden
              className="inline-block h-px w-10 bg-theme-accent"
            />
            <span>file: W.E.-INT-0731</span>
          </RevealOnScroll>
        </ParallaxLayer>
      </div>
    </section>
  );
}
