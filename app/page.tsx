import dynamic from 'next/dynamic';
import { SITE } from '@/lib/seo';

// Hero is a client-only leaf (uses useTheme + GSAP + an R3F LogoDock anchor).
// Wrapping it in ssr:false matches every other section and eliminates an
// entire class of SSR edge cases (Date.now / window-read / .map-over-undefined
// during server render). A minimal semantic fallback keeps the initial HTML
// crawlable for SEO even if JS is disabled.
const Hero = dynamic(
  () => import('@/components/sections/Hero').then((m) => m.Hero),
  {
    ssr: false,
    loading: () => (
      <section
        id="hero"
        className="relative flex min-h-screen w-full items-center justify-center bg-theme-bg text-theme-ink"
        aria-hidden
      />
    ),
  },
);

const Cursor = dynamic(
  () => import('@/components/shared/Cursor').then((m) => m.Cursor),
  { ssr: false },
);
const SmoothScroll = dynamic(
  () => import('@/components/shared/SmoothScroll').then((m) => m.SmoothScroll),
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
const FuturisticSceneryLayer = dynamic(
  () =>
    import('@/components/shared/FuturisticSceneryLayer').then(
      (m) => m.FuturisticSceneryLayer,
    ),
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
const Starfield = dynamic(
  () => import('@/components/shared/Starfield').then((m) => m.Starfield),
  { ssr: false },
);
const ScrollProgressLine = dynamic(
  () =>
    import('@/components/shared/ScrollProgressLine').then(
      (m) => m.ScrollProgressLine,
    ),
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
            <a href={`mailto:${SITE.email}`} style={{ color: '#b00020' }}>
              {SITE.email}
            </a>
          </p>
        </div>
      </noscript>
      <SmoothScroll />
      <PersistentLogo />
      <Cursor />
      <AmbientAudio />
      <LoadingScreen />
      <FuturisticSceneryLayer />
      <Starfield />
      <ScrollProgressLine />
      <ParchmentFrame />
      <FpsRail />
      <Hero />
      {/* DCGrid gates itself to batman + futuristic themes. */}
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
