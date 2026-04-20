'use client';

import { HorizontalGallery } from '@/components/motion/HorizontalGallery';

type CaseFile = {
  id: string;
  title: string;
};

const FILES: readonly CaseFile[] = [
  { id: '01', title: 'Echoes of Arkham' },
  { id: '02', title: 'The Narrows Ledger' },
  { id: '03', title: 'Pier Eight Inventory' },
  { id: '04', title: 'Bleake Island Frequency' },
  { id: '05', title: 'Crime Alley Archive' },
  { id: '06', title: 'Gotham Light & Power' },
];

/**
 * Case-file horizontal gallery.
 *
 * utopiatokyo.com style:
 *  - Section title: mono eyebrow `// CASE FILES` + Bebas headline "DOSSIERS"
 *  - Square cards with hairline border, `theme-surface` background
 *  - Top-left mono index `NN / 06`
 *  - Bottom-left serif italic title (font-lore)
 *  - Ghost giant numeral centered in background at 12rem, opacity 0.06
 */
export function CaseFileGallery() {
  return (
    <section
      data-morph-stop="gallery"
      className="relative w-full border-t border-theme-hairline bg-theme-bg"
    >
      <div className="px-6 py-[25vh] sm:px-12">
        <div className="mx-auto mb-16 flex w-full max-w-[1600px] flex-col gap-4">
          <span className="font-code text-xs uppercase tracking-[0.3em] text-theme-accent">
            // CASE FILES
          </span>
          <h3
            className="font-display text-theme-ink"
            style={{
              fontSize: 'clamp(3rem, 9vw, 9rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.03em',
            }}
          >
            DOSSIERS
          </h3>
        </div>

        <HorizontalGallery>
          {FILES.map((file, idx) => (
            <article
              key={file.id}
              data-cursor="target"
              className="relative mx-3 flex aspect-square w-[min(520px,78vw)] flex-shrink-0 flex-col justify-between overflow-hidden border border-theme-hairline bg-theme-surface p-7"
            >
              {/* Top-left mono index */}
              <span className="relative z-10 font-code text-[11px] uppercase tracking-[0.3em] text-theme-ink-subtle tabular-nums">
                {String(idx + 1).padStart(2, '0')} / {String(FILES.length).padStart(2, '0')}
              </span>

              {/* Ghost giant numeral centered in background */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-theme-ink"
                style={{
                  fontSize: '12rem',
                  opacity: 0.06,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                }}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* Bottom-left serif italic title */}
              <h4
                className="relative z-10 font-lore italic text-theme-ink"
                style={{
                  fontSize: 'clamp(1.5rem, 2.4vw, 2.2rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                }}
              >
                {file.title}
              </h4>
            </article>
          ))}
          {/* Trailing spacer so the final card clears the right edge. */}
          <div className="w-[20vw] flex-shrink-0" aria-hidden />
        </HorizontalGallery>
      </div>
    </section>
  );
}
