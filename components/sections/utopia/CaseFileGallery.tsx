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

export function CaseFileGallery() {
  return (
    <section
      data-morph-stop="gallery"
      className="relative w-full border-t border-theme-hairline bg-theme-bg"
    >
      <div className="px-6 pt-28 pb-10 sm:px-12">
        <div className="mx-auto flex w-full max-w-[1600px] items-end justify-between gap-6">
          <div>
            <span className="font-code text-[10px] uppercase tracking-[0.3em] text-theme-accent">
              [ 03 ] / case files
            </span>
            <h3
              className="mt-3 font-display text-theme-ink"
              style={{
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                letterSpacing: '-0.025em',
                lineHeight: 0.95,
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

      <HorizontalGallery className="pb-32">
        {FILES.map((file, idx) => (
          <article
            key={file.id}
            className="relative mx-4 flex h-[64vh] w-[min(420px,80vw)] flex-shrink-0 flex-col justify-between border border-theme-hairline bg-theme-surface-raised p-8"
          >
            <header className="flex items-start justify-between gap-4 font-code text-[10px] uppercase tracking-[0.3em] text-theme-ink-subtle">
              <span className="text-theme-accent">{file.code}</span>
              <span className="tabular-nums">{file.date}</span>
            </header>

            <div
              aria-hidden
              className="my-6 flex flex-1 items-center justify-center border border-theme-hairline bg-theme-bg/60"
            >
              <span
                className="font-display text-theme-ink/15"
                style={{ fontSize: 'clamp(6rem, 12vw, 10rem)', lineHeight: 1 }}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
            </div>

            <footer className="flex flex-col gap-3">
              <h4
                className="font-display text-theme-ink"
                style={{
                  fontSize: 'clamp(1.4rem, 2.2vw, 2rem)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {file.title}
              </h4>
              <p className="font-lore text-[14px] leading-[1.5] text-theme-ink/65">
                {file.subtitle}
              </p>
              <div className="mt-2 flex items-center gap-2 font-code text-[10px] uppercase tracking-[0.28em] text-theme-accent-dim">
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
