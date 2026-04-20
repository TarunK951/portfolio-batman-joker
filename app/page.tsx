import dynamic from 'next/dynamic';
import { SITE } from '@/lib/seo';

// Lean homepage — utopiatokyo.com-style single scroll of Utopia sections only.
// All legacy dual-theme machinery (LoadingScreen, AmbientAudio, ParchmentFrame,
// FpsRail, PersistentLogo, DCGrid, MahabharataGrid, Projects, About, Contact,
// Footer) has been removed from this page. Their files remain on disk for
// future reintroduction — see components/sections/ and components/shared/.

const FixedMetaHud = dynamic(
  () =>
    import('@/components/sections/utopia/FixedMetaHud').then(
      (m) => m.FixedMetaHud,
    ),
  { ssr: false },
);

const UtopiaHero = dynamic(
  () =>
    import('@/components/sections/utopia/UtopiaHero').then((m) => m.UtopiaHero),
  { ssr: false },
);
const StanzaBlock = dynamic(
  () =>
    import('@/components/sections/utopia/StanzaBlock').then((m) => m.StanzaBlock),
  { ssr: false },
);
const VersionMarquee = dynamic(
  () =>
    import('@/components/sections/utopia/VersionMarquee').then(
      (m) => m.VersionMarquee,
    ),
  { ssr: false },
);
const LoreParallax = dynamic(
  () =>
    import('@/components/sections/utopia/LoreParallax').then(
      (m) => m.LoreParallax,
    ),
  { ssr: false },
);
const CaseFileGallery = dynamic(
  () =>
    import('@/components/sections/utopia/CaseFileGallery').then(
      (m) => m.CaseFileGallery,
    ),
  { ssr: false },
);
const BackgroundColorMorph = dynamic(
  () =>
    import('@/components/motion/BackgroundColorMorph').then(
      (m) => m.BackgroundColorMorph,
    ),
  { ssr: false },
);

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.name,
    givenName: 'Satya Tarun',
    familyName: 'K',
    alternateName: ['Satya Tarun', 'satyatarun', 'Satya Tarun K'],
    email: `mailto:${SITE.email}`,
    url: SITE.url,
    image: `${SITE.url}/og.png`,
    jobTitle: 'Creative Developer',
    description:
      'Satya Tarun K (satyatarun) is a creative developer and full-stack engineer building cinematic, performant web experiences with Next.js, React Three Fiber, and GSAP.',
    knowsAbout: [
      'Next.js',
      'React',
      'TypeScript',
      'React Three Fiber',
      'Three.js',
      'GSAP',
      'Framer Motion',
      'Tailwind CSS',
      'UI/UX Design',
      'Creative Development',
      'WebGL',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hyderabad',
      addressCountry: 'IN',
    },
    nationality: 'Indian',
    sameAs: [
      SITE.socials.github,
      SITE.socials.linkedin,
      SITE.socials.twitter,
      `mailto:${SITE.email}`,
    ].filter(Boolean),
  };

  return (
    <main id="top" className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Crawlable H1 — visually subdued, semantically present for SEO. */}
      <h1 className="sr-only">
        Satya Tarun K — Creative Developer Portfolio. Satya Tarun (satyatarun),
        full-stack engineer building cinematic web experiences with Next.js,
        React Three Fiber, and GSAP.
      </h1>
      {/* No-JS fallback — identity survives even without client hydration. */}
      <noscript>
        <div style={{ padding: '4rem 1.5rem', textAlign: 'center', color: '#e8e8e8' }}>
          <h2 style={{ fontSize: '2rem', letterSpacing: '-0.02em' }}>Satya Tarun K</h2>
          <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>
            Creative Developer — Hyderabad, IN. Order meets chaos.
          </p>
          <p style={{ marginTop: '1rem' }}>
            <a href={`mailto:${SITE.email}`} style={{ color: '#D72638' }}>
              {SITE.email}
            </a>
          </p>
        </div>
      </noscript>

      <FixedMetaHud />

      {/* Utopia-Tokyo reskin (Batman) — single-scroll composition.
          Morph stops widened for more perceptible tonal drift. */}
      <BackgroundColorMorph
        initial="hsl(0 0% 4%)"
        stops={[
          { selector: '[data-morph-stop="stanza"]', color: 'hsl(0 0% 7%)' },
          { selector: '[data-morph-stop="marquee"]', color: 'hsl(0 0% 9%)' },
          { selector: '[data-morph-stop="lore"]', color: 'hsl(0 0% 7%)' },
          { selector: '[data-morph-stop="gallery"]', color: 'hsl(0 0% 5%)' },
        ]}
      >
        <UtopiaHero />
        <StanzaBlock />
        <VersionMarquee />
        <LoreParallax />
        <CaseFileGallery />
      </BackgroundColorMorph>

      {/* Minimal footer — closes the page without reintroducing a full
          Footer component. Hairline divider + mono caption + mailto. */}
      <footer className="relative w-full border-t border-theme-hairline bg-theme-bg px-6 py-16 sm:px-12">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-start justify-between gap-6 font-code text-[10px] uppercase tracking-[0.3em] text-theme-ink-subtle sm:flex-row sm:items-center">
          <a
            href={`mailto:${SITE.email}`}
            data-cursor="target"
            className="text-theme-ink hover:text-theme-accent transition-colors"
          >
            {SITE.email}
          </a>
          <span className="tabular-nums">BATCOMPUTER v2.0.0-RC.1</span>
          <span className="tabular-nums text-theme-ink/50">
            &copy; {new Date().getFullYear()} {SITE.name}
          </span>
        </div>
      </footer>
    </main>
  );
}
