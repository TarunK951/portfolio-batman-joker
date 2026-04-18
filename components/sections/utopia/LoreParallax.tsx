'use client';

import { ParallaxLayer } from '@/components/motion/ParallaxLayer';
import { RevealOnScroll } from '@/components/motion/RevealOnScroll';

const LORE = [
  'Gotham was never built; it was bargained for &mdash; each brick an I.O.U. pressed into the palm of a tired alderman.',
  'Wayne Enterprises watches the corridors the commissioner forgot to light, and the archives sing back in a dialect of meter readings, CCTV stills, and receipts pressed between the pages of a dead man&rsquo;s calendar.',
  'To walk the city after midnight is to consult an older version of yourself: still convinced the law would be enough, still willing to be proven wrong.',
];

export function LoreParallax() {
  return (
    <section
      data-morph-stop="lore"
      className="relative w-full overflow-hidden border-t border-theme-hairline bg-theme-surface/40 px-6 py-40 sm:px-12 sm:py-48"
    >
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-12 gap-6">
        <RevealOnScroll as="div" className="col-span-12 md:col-span-4">
          <span className="font-code text-[10px] uppercase tracking-[0.3em] text-theme-accent">
            [ 02 ] / lore
          </span>
          <h3
            className="mt-4 font-display text-theme-ink"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
            }}
          >
            The quiet
            <br />
            <span className="text-theme-accent">corrosion.</span>
          </h3>
        </RevealOnScroll>

        <ParallaxLayer
          speed={-0.18}
          className="col-span-12 flex flex-col gap-8 md:col-span-7 md:col-start-6"
        >
          {LORE.map((para, idx) => (
            <RevealOnScroll
              as="p"
              key={idx}
              delay={idx * 0.08}
              className="font-lore text-[18px] leading-[1.6] text-theme-ink/75"
              style={{ maxWidth: '56ch' }}
            >
              <span dangerouslySetInnerHTML={{ __html: para }} />
            </RevealOnScroll>
          ))}

          <RevealOnScroll
            as="div"
            delay={0.3}
            className="mt-6 inline-flex items-center gap-3 font-code text-[10px] uppercase tracking-[0.3em] text-theme-ink-subtle"
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
