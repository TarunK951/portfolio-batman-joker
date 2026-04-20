'use client';

import { Marquee } from '@/components/motion/Marquee';

const SEPARATOR = '\u00a0\u00a0///\u00a0\u00a0';
const FRAGMENTS = [
  'BATCOMPUTER v2.0.0-RC.1',
  '40.7306\u00b0N / 74.0000\u00b0W',
  'GOTHAM SECTOR 7G',
];
const MARQUEE_STRING = FRAGMENTS.join(SEPARATOR) + SEPARATOR;

/**
 * Thin mono band — repeats a version + coords + sector string. Hairlines on
 * top and bottom. No boxes, no fills. Mirrors the low-contrast utilitarian
 * bands on utopiatokyo.com.
 */
export function VersionMarquee() {
  return (
    <section
      data-morph-stop="marquee"
      data-cursor="target"
      className="relative w-full border-y border-theme-hairline bg-theme-bg py-10"
    >
      <Marquee speed={44}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <span
            key={idx}
            className="whitespace-pre font-code text-xs uppercase tracking-[0.3em] text-theme-ink-subtle"
          >
            {MARQUEE_STRING}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
