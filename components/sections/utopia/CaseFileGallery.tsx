'use client';

import { HorizontalGallery } from '@/components/motion/HorizontalGallery';

type CaseFile = {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  date: string;
};

const FILES: readonly CaseFile[] = [
  { id: '01', code: 'W.E.-0731', title: 'Narrows Blackout', subtitle: 'Surveillance grid degraded for 47 minutes.', date: '2019.03.14' },
  { id: '02', code: 'W.E.-0812', title: 'Pier 8 Inventory', subtitle: 'Uncounted containers, counted heartbeats.', date: '2019.07.02' },
  { id: '03', code: 'W.E.-0931', title: 'Arkham Ledger', subtitle: 'Three names removed without explanation.', date: '2020.01.28' },
  { id: '04', code: 'W.E.-1044', title: 'Bleake Island', subtitle: 'Transformer hum at 61Hz. Everything else silent.', date: '2020.06.19' },
  { id: '05', code: 'W.E.-1122', title: 'Crime Alley Archive', subtitle: 'A pearl recovered. Not returned.', date: '2021.02.11' },
  { id: '06', code: 'W.E.-1207', title: 'Gotham Light & Power', subtitle: 'Redacted line items totalling $1.4M.', date: '2021.09.30' },
];

/**
 * Case-file horizontal gallery.
 *
 * utopiatokyo.com style: square cards, hairline border only (no filled panel),
 * mono number label in the top-left, serif title in the bottom-left. Numbered
 * `NN / 06` with tabular-nums. Cards are `cursor-target` snap points for the
 * custom reticle.
 */
export function CaseFileGallery() {
  return (
    <section
      data-morph-stop="gallery"
      className="relative w-full border-t border-theme-hairline bg-theme-bg"
    >
      <div className="px-6 pt-[20vh] pb-10 sm:px-12">
        <div className="mx-auto flex w-full max-w-[1600px] items-end justify-between gap-6 border-t border-theme-hairline pt-10">
          <div>
            <span className="font-code text-[10px] uppercase tracking-[0.3em] text-theme-accent">
              [ 03 ] / case files
            </span>
            <h3
              className="mt-3 font-display text-theme-ink"
              style={{
                fontSize: 'clamp(2.4rem, 6vw, 5rem)',
                letterSpacing: '-0.03em',
                lineHeight: 0.92,
              }}
            >
              Filed under <span className="text-theme-accent">unfinished</span>.
            </h3>
          </div>
          <span className="hidden font-code text-[10px] uppercase tracking-[0.3em] text-theme-ink-subtle sm:inline tabular-nums">
            {FILES.length.toString().padStart(2, '0')} / ENTRIES
          </span>
        </div>
      </div>

      <HorizontalGallery className="pb-[20vh]">
        {FILES.map((file, idx) => (
          <article
            key={file.id}
            data-cursor="target"
            className="relative mx-4 flex aspect-square w-[min(560px,80vw)] flex-shrink-0 flex-col border border-theme-hairline bg-transparent p-7"
          >
            {/* TOP-LEFT number label (mono) */}
            <span className="font-code text-[11px] uppercase tracking-[0.3em] text-theme-ink-subtle tabular-nums">
              {String(idx + 1).padStart(2, '0')} / {String(FILES.length).padStart(2, '0')}
            </span>

            {/* TOP-RIGHT date + code */}
            <div className="absolute right-7 top-7 flex flex-col items-end gap-1 font-code text-[10px] uppercase tracking-[0.3em] text-theme-ink-subtle">
              <span className="text-theme-accent">{file.code}</span>
              <span className="tabular-nums">{file.date}</span>
            </div>

            {/* Oversize ghost numeral, centred */}
            <div className="flex flex-1 items-center justify-center">
              <span
                aria-hidden
                className="font-display text-theme-ink/[0.07]"
                style={{ fontSize: 'clamp(8rem, 22vw, 18rem)', lineHeight: 1, letterSpacing: '-0.04em' }}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
            </div>

            {/* BOTTOM-LEFT serif title + subtitle */}
            <footer className="flex flex-col gap-2">
              <h4
                className="font-lore text-theme-ink"
                style={{
                  fontSize: 'clamp(1.5rem, 2.6vw, 2.4rem)',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.05,
                  fontStyle: 'italic',
                }}
              >
                {file.title}
              </h4>
              <p className="font-lore text-[14px] leading-[1.55] text-theme-ink/60">
                {file.subtitle}
              </p>
              <div className="mt-3 flex items-center gap-2 font-code text-[10px] uppercase tracking-[0.28em] text-theme-accent-dim">
                <span aria-hidden className="inline-block h-px w-6 bg-theme-accent-dim" />
                OPEN FILE
              </div>
            </footer>
          </article>
        ))}
        {/* Trailing spacer so last card clears the right edge */}
        <div className="w-[20vw] flex-shrink-0" aria-hidden />
      </HorizontalGallery>
    </section>
  );
}
