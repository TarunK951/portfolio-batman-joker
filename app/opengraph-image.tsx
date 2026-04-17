import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/seo';

export const runtime = 'edge';
export const alt = `${SITE.name} — Creative Developer Portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#14171f',
          color: '#ebe5ce',
          padding: '64px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, letterSpacing: 4, textTransform: 'uppercase', opacity: 0.7 }}>
          <span>satyatarun</span>
          <span style={{ color: '#ff1919' }}>Portfolio / 2026</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 28, letterSpacing: 6, textTransform: 'uppercase', color: '#ff1919', marginBottom: 24 }}>
            Creative Developer
          </div>
          <div
            style={{
              fontSize: 140,
              lineHeight: 0.92,
              letterSpacing: '-0.03em',
              fontWeight: 600,
              color: '#ebe5ce',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>Satya Tarun K.</span>
          </div>
          <div style={{ fontSize: 28, marginTop: 28, opacity: 0.75, maxWidth: 900 }}>
            Three-theme portfolio — Next.js, React Three Fiber, GSAP. Hyderabad, India.
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, letterSpacing: 4, textTransform: 'uppercase', opacity: 0.55 }}>
          <span>satyatarun.951@gmail.com</span>
          <span>{SITE.url.replace(/^https?:\/\//, '')}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
