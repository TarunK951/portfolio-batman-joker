import dynamic from 'next/dynamic';
import { SITE } from '@/lib/seo';

// NOTE: the old <Hero /> has been removed in favour of <UtopiaHero /> below —
// we were rendering two stacked heroes. Smooth scrolling is now handled by
// the layout-level <SmoothScrollProvider />; the page-level <SmoothScroll />
// shim has been dropped (double-init caused Lenis race conditions).

const FixedMetaHud = dynamic(
  () =>
    import('@/components/sections/utopia/FixedMetaHud').then(
      (m) => m.FixedMetaHud,
    ),
  { ssr: false },
);
const AmbientAudio = dynamic(
  () => import('@/components/shared/AmbientAudio').then((m) => m.AmbientAudio),
  { ssr: false },
);
const LoadingScreen = dynamic(
  () => import('@/components/sections/LoadingScreen').then((m) => m.LoadingScreen),
  { ssr: false },
);
const PersistentLogo = dynamic(
  () => import('@/components/three/PersistentLogo').then((m) => m.PersistentLogo),
  { ssr: false },
);
const ParchmentFrame = dynamic(
  () => import('@/components/shared/ParchmentFrame').then((m) => m.ParchmentFrame),
  { ssr: false },
);
const FpsRail = dynamic(
  () => import('@/components/shared/FpsRail').then((m) => m.FpsRail),
  { ssr: false },
);
const DCGrid = dynamic(
  () => import('@/components/sections/DCGrid').then((m) => m.DCGrid),
  { ssr: false },
);
const MahabharataGrid = dynamic(
  () =>
    import('@/components/sections/MahabharataGrid').then((m) => m.MahabharataGrid),
  { ssr: false },
);
const Projects = dynamic(
  () => import('@/components/sections/Projects').then((m) => m.Projects),
  { ssr: false },
);
const About = dynamic(
  () => import('@/components/sections/About').then((m) => m.About),
  { ssr: false },
);
const Contact = dynamic(
  () => import('@/components/sections/Contact').then((m) => m.Contact),
  { ssr: false },
);
const Footer = dynamic(
  () => import('@/components/sections/Footer').then((m) => m.Footer),
  { ssr: false },
);

// Utopia-Tokyo reskin sections (Batman). All client-only leaves.
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
      <PersistentLogo />
      <AmbientAudio />
      <LoadingScreen />
      <ParchmentFrame />
      <FpsRail />
      <FixedMetaHud />

      {/* Utopia-Tokyo reskin (Batman) — ORDER MEETS CHAOS + stanzas + marquee +
          lore + horizontal case files. Wrapped in BackgroundColorMorph so
          the canvas shifts tone as sections scroll into view. Stops tuned to
          the new tonal palette (#0A0A0A -> #0E0E0E -> #111111 -> #0A0A0A). */}
      <BackgroundColorMorph
        initial="hsl(var(--bg))"
        stops={[
          { selector: '[data-morph-stop="stanza"]', color: 'hsl(0 0% 5%)' },
          { selector: '[data-morph-stop="marquee"]', color: 'hsl(0 0% 6%)' },
          { selector: '[data-morph-stop="lore"]', color: 'hsl(0 0% 7%)' },
          { selector: '[data-morph-stop="gallery"]', color: 'hsl(0 0% 4%)' },
        ]}
      >
        <UtopiaHero />
        <StanzaBlock />
        <VersionMarquee />
        <LoreParallax />
        <CaseFileGallery />
      </BackgroundColorMorph>

      {/* DCGrid gates itself to batman theme. */}
      <DCGrid />
      {/* MahabharataGrid gates itself to ancient-india theme. */}
      <MahabharataGrid />
      <Projects />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
