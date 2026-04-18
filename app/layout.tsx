import type { Metadata, Viewport } from 'next';
import {
  Inter,
  Bebas_Neue,
  Caveat,
  Space_Mono,
  Big_Shoulders_Stencil_Display,
  Crimson_Pro,
  Noto_Serif_Devanagari,
  Crimson_Text,
  JetBrains_Mono,
} from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { SITE } from '@/lib/seo';

// Body sans (Utopia uses PPMori — Inter is the closest free, neutral grotesque)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

// Display — Bebas Neue retained for impact headlines (project signature)
const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

// Joker chaotic accent
const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-chaotic',
  display: 'swap',
});

// Mono — stand-in for Utopia's Zpix pixel monospace (used for eyebrows, labels)
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

// Batman stencil display — Utopia/demon oversize stencil titles
const stencil = Big_Shoulders_Stencil_Display({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-stencil',
  display: 'swap',
});

// Ancient-india serif — Crimson Pro (variable). Used for h2/h3 under that theme.
const crimson = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

// Devanagari serif — fallback for Sanskrit accents and quotes.
const devanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '700'],
  variable: '--font-devanagari',
  display: 'swap',
});

// Batman reskin additions — Crimson Text for lore paragraphs, JetBrains Mono
// for terminal / coords / version strings.
const crimsonText = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-lore',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-code',
  display: 'swap',
});

const SEO_DESCRIPTION =
  'Satya Tarun K (satyatarun, Satya Tarun) — creative developer and full-stack engineer from Hyderabad. Dual-theme portfolio (Batman, Ancient India) built with Next.js, React Three Fiber, GSAP and Framer Motion.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Creative Developer Portfolio`,
    template: `%s | ${SITE.name} — Creative Developer`,
  },
  description: SEO_DESCRIPTION,
  keywords: [
    'Satya Tarun',
    'Satya Tarun K',
    'satyatarun',
    'Satya Tarun portfolio',
    'Satya Tarun developer',
    'Satya Tarun Hyderabad',
    'Satya Tarun creative developer',
    'Satya Tarun Next.js',
    'Satya Tarun React Three Fiber',
    'creative developer India',
    'creative developer Hyderabad',
    'Next.js portfolio',
    'Three.js portfolio',
    'GSAP portfolio',
    'React Three Fiber portfolio',
    'full-stack engineer India',
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  applicationName: `${SITE.name} Portfolio`,
  alternates: { canonical: SITE.url },
  openGraph: {
    type: 'website',
    url: SITE.url,
    siteName: `${SITE.name} — Portfolio`,
    title: `${SITE.name} — Creative Developer Portfolio`,
    description: SEO_DESCRIPTION,
    locale: 'en_US',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: `${SITE.name} — Creative Developer Portfolio`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — Creative Developer`,
    description: SEO_DESCRIPTION,
    creator: `@${SITE.alias}`,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'technology',
  verification: {
    // TODO: Add Google Search Console verification token when available.
  },
};

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#14171f' }],
  width: 'device-width',
  initialScale: 1,
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('portfolio-theme');if(t==='samurai'||t==='futuristic'){t='ancient-india';try{localStorage.setItem('portfolio-theme','ancient-india');}catch(e){}}if(t==='batman'||t==='ancient-india'){document.documentElement.dataset.theme=t;}else{document.documentElement.dataset.theme='batman';}}catch(e){document.documentElement.dataset.theme='batman';}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="batman"
      className={`${inter.variable} ${bebas.variable} ${caveat.variable} ${spaceMono.variable} ${stencil.variable} ${crimson.variable} ${devanagari.variable} ${crimsonText.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-body antialiased">
        {/*
          model-viewer 4.2.0 custom element (loaded once, module script).
          Used by ModelViewerLogo under the batman + ancient-india themes.
          Must be type="module" and sourced from the CDN exactly as
          specified in the Wave 3.1 brief — do not self-host or inject
          from a component (risks double-load on client nav).
        */}
        <Script
          id="model-viewer-cdn"
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.2.0/model-viewer.min.js"
          strategy="afterInteractive"
        />
        <ThemeProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
