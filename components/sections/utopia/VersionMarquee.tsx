'use client';

import { Marquee } from '@/components/motion/Marquee';

const ITEMS = [
  'BATCOMPUTER v2.0.0-RC.1',
  '40.7306°N / 74.0000°W',
  'CLEARANCE // OMEGA-7',
  'CHANNEL: WAYNE-ENTERPRISES',
  'FEED: GCPD-INTERCEPT',
  'STATUS: COWL ENGAGED',
];

export function VersionMarquee() {
  return (
    <section
      data-morph-stop="marquee"
      className="relative w-full border-y border-theme-accent/40 bg-theme-bg py-4"
    >
      <Marquee speed={38} pauseOnHover>
        {ITEMS.map((item, idx) => (
          <span
            key={idx}
            className="mx-10 inline-flex items-center gap-4 font-code text-[11px] uppercase tracking-[0.28em] text-theme-ink/85"
          >
            <span
              aria-hidden
              className="inline-block h-1 w-1 rounded-full bg-theme-accent"
            />
            <span
              className={idx % 2 === 0 ? 'text-theme-accent' : 'text-theme-ink'}
            >
              {item}
            </span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
