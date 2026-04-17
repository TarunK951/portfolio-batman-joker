import dynamic from 'next/dynamic';
import { Hero } from '@/components/sections/Hero';
import { SITE } from '@/lib/seo';

const Cursor = dynamic(
  () => import('@/components/shared/Cursor').then((m) => m.Cursor),
  { ssr: false },
);
const LoadingScreen = dynamic(
  () => import('@/components/sections/LoadingScreen').then((m) => m.LoadingScreen),
  { ssr: false },
);
const DCGrid = dynamic(
  () => import('@/components/sections/DCGrid').then((m) => m.DCGrid),
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
    alternateName: ['Satya Tarun', 'satyatarun'],
    email: `mailto:${SITE.email}`,
    url: SITE.url,
    jobTitle: 'Creative Developer',
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Cursor />
      <LoadingScreen />
      <Hero />
      <DCGrid />
      <Projects />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
