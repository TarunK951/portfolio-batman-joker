import { Hero } from '@/components/sections/Hero';
import { SITE } from '@/lib/seo';

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
      <Hero />
    </main>
  );
}
