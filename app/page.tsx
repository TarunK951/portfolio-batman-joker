import dynamic from 'next/dynamic';
import { Hero } from '@/components/sections/Hero';
import { SITE } from '@/lib/seo';

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
      <SmoothScroll />
      <PersistentLogo />
      <Cursor />
      <AmbientAudio />
      <LoadingScreen />
      <FuturisticSceneryLayer />
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
