'use client';

/**
 * PersistentLogo + LogoDock
 * ------------------------------------------------------------------
 * A single Batman-logo rendering instance mounted once at the root.
 * Its fixed wrapper tweens its bounding box to match whichever
 * `<LogoDock />` is currently active in the viewport.
 *
 * Both themes (batman + ancient-india) use <model-viewer> via
 * `ModelViewerLogo` (see design doc §2.1). Rotation is driven from
 * the shared `useLogoRotation()` hook (scroll-coupled, with "tyre
 * rim" idle coast — design doc §2.3).
 */

import { useEffect, useRef } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { registerGsap } from '@/lib/gsap';
import { useLogoRotation } from '@/hooks/useLogoRotation';
import {
  ModelViewerLogo,
  type ModelViewerLogoHandle,
} from '@/components/three/ModelViewerLogo';

/* -------------------------------------------------------------------------- */
/*                                   Dock                                     */
/* -------------------------------------------------------------------------- */

export type LogoDockSize = 'small' | 'medium' | 'large' | 'xl' | 'xxl';

/**
 * Values can be numbers (legacy pixel sizes) or CSS strings (responsive
 * clamps). GSAP accepts both via its CSS plugin — string values are set
 * via `gsap.set` rather than `quickTo` since quickTo operates on
 * numeric tweens (see the sync() branch below).
 */
const DOCK_DIMENSIONS: Record<LogoDockSize, { w: number | string; h: number | string }> = {
  small: { w: 96, h: 96 },
  medium: { w: 160, h: 160 },
  large: { w: 420, h: 420 },
  xl: { w: 'min(62vmin, 680px)', h: 'min(62vmin, 680px)' },
  xxl: { w: 'min(82vmin, 920px)', h: 'min(82vmin, 920px)' },
};

export function LogoDock({
  id,
  size = 'small',
  className,
}: {
  id: string;
  size?: LogoDockSize;
  className?: string;
}) {
  const dims = DOCK_DIMENSIONS[size];
  const widthVal = typeof dims.w === 'number' ? `${dims.w}px` : dims.w;
  const heightVal = typeof dims.h === 'number' ? `${dims.h}px` : dims.h;
  return (
    <div
      aria-hidden
      data-logo-dock={id}
      data-logo-dock-size={size}
      className={className}
      style={{
        width: widthVal,
        height: heightVal,
        pointerEvents: 'none',
        opacity: 0,
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                        Shared dock travel controller                       */
/* -------------------------------------------------------------------------- */

/**
 * Wires a fixed-positioned wrapper to travel between `[data-logo-dock]`
 * anchors as the user scrolls. Returns a cleanup function.
 */
function wireDockTravel(wrapper: HTMLDivElement): () => void {
  const { gsap, ScrollTrigger } = registerGsap();

  const quickX = gsap.quickTo(wrapper, 'x', { duration: 0.9, ease: 'power3.out' });
  const quickY = gsap.quickTo(wrapper, 'y', { duration: 0.9, ease: 'power3.out' });
  const quickW = gsap.quickTo(wrapper, 'width', {
    duration: 0.9,
    ease: 'power3.out',
  });
  const quickH = gsap.quickTo(wrapper, 'height', {
    duration: 0.9,
    ease: 'power3.out',
  });

  let activeDock: HTMLElement | null = null;

  const sync = () => {
    if (!activeDock) return;
    const r = activeDock.getBoundingClientRect();
    quickX(r.left);
    quickY(r.top);
    quickW(r.width);
    quickH(r.height);
  };

  const docks = Array.from(
    document.querySelectorAll<HTMLElement>('[data-logo-dock]'),
  );

  if (docks.length === 0) {
    gsap.set(wrapper, { autoAlpha: 0 });
    return () => {
      /* no triggers to kill */
    };
  }

  gsap.set(wrapper, { autoAlpha: 1 });

  activeDock = docks[0] ?? null;
  if (activeDock) {
    const r = activeDock.getBoundingClientRect();
    gsap.set(wrapper, {
      x: r.left,
      y: r.top,
      width: r.width,
      height: r.height,
    });
  }

  const triggers: ScrollTrigger[] = [];

  docks.forEach((dock) => {
    const st = ScrollTrigger.create({
      trigger: dock,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (self.isActive) {
          activeDock = dock;
          sync();
        }
      },
      onRefresh: () => {
        if (activeDock === dock) sync();
      },
    });
    triggers.push(st);
  });

  const onResize = () => {
    if (!activeDock) return;
    const r = activeDock.getBoundingClientRect();
    gsap.set(wrapper, {
      x: r.left,
      y: r.top,
      width: r.width,
      height: r.height,
    });
  };

  const onScroll = () => sync();

  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', onScroll, { passive: true });

  const rafId = window.requestAnimationFrame(sync);

  return () => {
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onScroll);
    window.cancelAnimationFrame(rafId);
    triggers.forEach((t) => t.kill());
  };
}

/* -------------------------------------------------------------------------- */
/*                    Model-viewer branch (batman / ancient)                  */
/* -------------------------------------------------------------------------- */

function ModelViewerPersistent({
  theme,
}: {
  theme: 'batman' | 'ancient-india';
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<ModelViewerLogoHandle | null>(null);
  const { yaw, pitch } = useLogoRotation();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    if (typeof window === 'undefined') return;

    const cleanupTravel = wireDockTravel(wrapper);

    // Rotation application loop — drives the imperative handle on the
    // model-viewer element every frame. Cheap: just an attribute write.
    let rafId = 0;
    const tick = () => {
      logoRef.current?.setRotation(yaw.current, pitch.current);
      rafId = window.requestAnimationFrame(tick);
    };
    rafId = window.requestAnimationFrame(tick);

    return () => {
      cleanupTravel();
      window.cancelAnimationFrame(rafId);
    };
  }, [yaw, pitch]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        pointerEvents: 'none',
        zIndex: 40,
        willChange: 'transform, width, height',
      }}
    >
      <ModelViewerLogo ref={logoRef} theme={theme} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Router component                              */
/* -------------------------------------------------------------------------- */

export function PersistentLogo() {
  const { theme } = useTheme();
  // The bat-logo GLB is meaningful only under the batman theme.
  // Under ancient-india the compass / hero composes its own visual mark.
  if (theme !== 'batman') return null;
  return <ModelViewerPersistent theme={theme} />;
}
