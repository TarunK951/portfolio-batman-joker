import type { Metadata, Viewport } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { SITE } from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Portfolio`,
    template: `%s · ${SITE.name}`,
  },
  description: `${SITE.name} (${SITE.alias}) — dual-theme Batman × Joker portfolio showcasing interactive 3D, motion, and product engineering.`,
  keywords: [
    'Satya Tarun',
    'Satya Tarun K',
    'satyatarun',
    'Satya Tarun portfolio',
    'Satya Tarun developer',
    'Batman Joker portfolio',
    'Next.js portfolio',
    'Three.js portfolio',
    'GSAP portfolio',
    'React Three Fiber',
    'creative developer India',
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { canonical: SITE.url },
  openGraph: {
    type: 'website',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Batman × Joker Portfolio`,
    description: 'Dual-theme portfolio: Batman (dark red) vs Joker (toxic green).',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — Portfolio`,
    description: 'Batman × Joker dual-theme portfolio.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }],
  width: 'device-width',
  initialScale: 1,
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('portfolio-theme');if(t==='batman'||t==='joker'){document.documentElement.dataset.theme=t;}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="batman"
      className={`${inter.variable} ${bebas.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
