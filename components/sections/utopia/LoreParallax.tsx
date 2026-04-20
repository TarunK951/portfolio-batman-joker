'use client';

import { RevealOnScroll } from '@/components/motion/RevealOnScroll';

/**
 * Lore passage — single narrow centered column.
 *
 * - `py-[30vh]` for theatrical vertical breathing room.
 * - Mono eyebrow (`// LORE // 001`) above the paragraph.
 * - Paragraph in Crimson Text, text-xl, 1.8 leading. First sentence reads in
 *   full ink; the rest softens to `theme-ink-subtle` for a long-form cadence
 *   that echoes utopiatokyo.com's contemplative passages.
 */
export function LoreParallax() {
  return (
    <section
      data-morph-stop="lore"
      className="relative w-full border-t border-theme-hairline bg-theme-bg px-6 py-[30vh] sm:px-12"
    >
      <div className="mx-auto flex w-full max-w-[680px] flex-col gap-10">
        <RevealOnScroll as="div" className="flex items-center gap-3">
          <span
            aria-hidden
            className="inline-block h-px w-8 bg-theme-accent"
          />
          <span className="font-code text-xs uppercase tracking-[0.3em] text-theme-accent">
            // LORE // 001
          </span>
        </RevealOnScroll>

        <RevealOnScroll
          as="p"
          delay={0.1}
          className="font-lore text-xl leading-[1.8]"
          data-cursor="target"
        >
          <span className="text-theme-ink">
            Gotham keeps its ledgers in the dark.
          </span>{' '}
          <span className="text-theme-ink-subtle">
            Wayne Enterprises pays for the light nobody asked for &mdash; the
            flicker above a loading dock, the cold glow of an elevator call
            button on a floor that no one rents. The corridors whisper back in
            meter readings and the dull hum of a transformer that was supposed
            to be replaced last winter. Somewhere between the commissioner&rsquo;s
            memo and the contractor&rsquo;s silence, the city forgets what it
            agreed to. The cowl remembers. The archive remembers. And every
            redacted line item is a door waiting to be opened.
          </span>
        </RevealOnScroll>
      </div>
    </section>
  );
}
