'use client';

import dynamic from 'next/dynamic';

const LogoMarkScene = dynamic(
  () => import('@/components/three/LogoMark').then((m) => m.LogoMarkScene),
  { ssr: false },
);

/**
 * Persistent top-left brand mark — the batman_logo.glb rendered tiny,
 * restyled per theme via LogoMark. Positioned fixed so it survives
 * section transitions. Purely decorative, not interactive.
 */
export function HeaderLogo() {
  return (
    <a
      href="#top"
      aria-label="Satya Tarun K — home"
      data-cursor-hover
      className="fixed left-5 top-5 z-40 block h-11 w-11 sm:left-6 sm:top-6 sm:h-12 sm:w-12"
      style={{ pointerEvents: 'auto' }}
    >
      <LogoMarkScene mode="tiny" />
    </a>
  );
}
