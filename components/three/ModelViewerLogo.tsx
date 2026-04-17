'use client';

/**
 * ModelViewerLogo
 * ------------------------------------------------------------------
 * Client leaf wrapping the <model-viewer> custom element (loaded once
 * via next/script in app/layout.tsx). Renderer choice for the non-
 * futuristic themes per the Wave 3 renderer-split plan (design doc
 * §2.1).
 *
 * Explicitly configured to NOT auto-rotate. Rotation is driven by the
 * imperative setRotation(yaw, pitch) handle, which mutates the
 * element's `camera-orbit` attribute. Hooked up from the consumer
 * (PersistentLogo → useLogoRotation) via a requestAnimationFrame loop.
 *
 * Exposed slots:
 *  - <img slot="poster"> fallback image shown while the GLB streams.
 */

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type CSSProperties,
} from 'react';

export interface ModelViewerLogoHandle {
  setRotation(yawDeg: number, pitchDeg: number): void;
}

type LogoTheme = 'batman' | 'ancient-india';

interface ModelViewerLogoProps {
  theme: LogoTheme;
  src?: string;
  posterSrc?: string;
  className?: string;
  style?: CSSProperties;
}

const THEME_CONFIG: Record<
  LogoTheme,
  { exposure: string; environmentImage: string }
> = {
  batman: {
    exposure: '0.95',
    environmentImage: 'neutral',
  },
  'ancient-india': {
    exposure: '1.25',
    environmentImage: 'neutral',
  },
};

// Clamp pitch to stay within the configured min/max-camera-orbit band
// (85deg ± 20deg is a comfortable readable range for the emblem).
const clampPitch = (p: number): number => Math.max(-20, Math.min(20, p));

export const ModelViewerLogo = forwardRef<
  ModelViewerLogoHandle,
  ModelViewerLogoProps
>(function ModelViewerLogo(
  {
    theme,
    src = '/models/batman_logo.glb',
    posterSrc = '/models/batman_logo_poster.png',
    className,
    style,
  },
  ref,
) {
  const elRef = useRef<HTMLElement | null>(null);
  const config = THEME_CONFIG[theme];

  useImperativeHandle(
    ref,
    () => ({
      setRotation(yawDeg: number, pitchDeg: number) {
        const el = elRef.current;
        if (!el) return;
        const pitch = 85 + clampPitch(pitchDeg);
        // Negative yaw to match Lightweight "tyre rim" convention
        // (scroll forward → logo turns toward the viewer's left).
        el.setAttribute(
          'camera-orbit',
          `${-yawDeg}deg ${pitch}deg 4.2m`,
        );
      },
    }),
    [],
  );

  return (
    <model-viewer
      // `ref` on a custom element requires any, and this is the only
      // place we allow it — constrained via the typed handle above.
      ref={elRef as unknown as React.Ref<HTMLElement>}
      src={src}
      alt="Satya Tarun K — Batman emblem, sculpted"
      camera-controls
      disable-zoom
      interaction-prompt="none"
      touch-action="pan-y"
      camera-orbit="0deg 85deg 4.2m"
      min-camera-orbit="auto auto 3.6m"
      max-camera-orbit="auto auto 5m"
      field-of-view="32deg"
      shadow-intensity="1.1"
      shadow-softness="0.9"
      environment-image={config.environmentImage}
      exposure={config.exposure}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        ['--poster-color' as string]: 'transparent',
        ...style,
      }}
    >
      <img
        slot="poster"
        src={posterSrc}
        alt=""
        aria-hidden
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </model-viewer>
  );
});
