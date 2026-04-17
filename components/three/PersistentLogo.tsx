'use client';

/**
 * PersistentLogo + LogoDock
 * ------------------------------------------------------------------
 * A single Batman-logo rendering instance mounted once at the root.
 * Its fixed wrapper tweens its bounding box to match whichever
 * `<LogoDock />` is currently active in the viewport.
 *
 * Wave 3.1 renderer split:
 *   - 'futuristic' theme keeps the R3F Canvas (needs shader FX later)
 *   - 'batman' and 'ancient-india' use <model-viewer> via
 *     `ModelViewerLogo` (see design doc §2.1).
 *
 * Rotation is no longer driven by a local useFrame spinner. Both
 * renderer branches read from the shared `useLogoRotation()` hook
 * (scroll-coupled, with "tyre rim" idle coast — design doc §2.3).
 */

import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  MeshTransmissionMaterial,
  useGLTF,
} from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useTheme, type Theme } from '@/components/theme/ThemeProvider';
import { registerGsap } from '@/lib/gsap';
import { useLogoRotation } from '@/hooks/useLogoRotation';
import {
  ModelViewerLogo,
  type ModelViewerLogoHandle,
} from '@/components/three/ModelViewerLogo';

type LogoThemeKey = Theme;

type PalettePreset = {
  base: string;
  accent: string;
  glow: string;
  emissive: number;
  metalness: number;
  roughness: number;
  wireframe: boolean;
  glass: boolean;
};

const PALETTE: Record<LogoThemeKey, PalettePreset> = {
  batman: {
    base: '#050505',
    accent: '#ff1919',
    glow: '#ff4d4d',
    emissive: 0.55,
    metalness: 0.9,
    roughness: 0.25,
    wireframe: false,
    glass: false,
  },
  'ancient-india': {
    base: '#14120f',
    accent: '#8a1a1a',
    glow: '#c8361f',
    emissive: 0.1,
    metalness: 0.08,
    roughness: 0.92,
    wireframe: false,
    glass: false,
  },
  futuristic: {
    base: '#ffffff',
    accent: '#ffffff',
    glow: '#ffffff',
    emissive: 1.4,
    metalness: 0.2,
    roughness: 0.35,
    wireframe: false,
    glass: false,
  },
};

/* -------------------------------------------------------------------------- */
/*                                   Dock                                     */
/* -------------------------------------------------------------------------- */

export type LogoDockSize = 'small' | 'medium' | 'large' | 'xl';

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
 * anchors as the user scrolls. Returns a cleanup function. Extracted so
 * both the R3F (futuristic) and model-viewer (batman / ancient-india)
 * branches share a single implementation.
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
/*                               R3F Logo body                                */
/* -------------------------------------------------------------------------- */

function LogoBody({
  yawRef,
  pitchRef,
}: {
  yawRef: React.MutableRefObject<number>;
  pitchRef: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group | null>(null);
  const { theme } = useTheme();
  const palette = PALETTE[theme as LogoThemeKey] ?? PALETTE.batman;
  const { scene } = useGLTF('/models/batman_logo.glb');
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    const disposables: Array<THREE.Material> = [];
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (palette.glass) {
          const mat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(palette.base),
            emissive: new THREE.Color(palette.accent),
            emissiveIntensity: palette.emissive,
            metalness: 0.2,
            roughness: palette.roughness,
            transmission: 0.85,
            thickness: 0.5,
            ior: 1.4,
            clearcoat: 1,
            clearcoatRoughness: 0.1,
            wireframe: false,
          });
          child.material = mat;
          disposables.push(mat);
        } else {
          const mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(palette.base),
            emissive: new THREE.Color(palette.accent),
            emissiveIntensity: palette.emissive,
            metalness: palette.metalness,
            roughness: palette.roughness,
            wireframe: palette.wireframe,
          });
          child.material = mat;
          disposables.push(mat);
        }
      }
    });
    return () => {
      disposables.forEach((m) => m.dispose());
    };
  }, [cloned, palette]);

  // Rotation is now driven entirely by the shared useLogoRotation hook
  // (see design doc §2.3). The old `t * 0.3` spinner was removed in
  // Wave 3.1.
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const yawRad = (yawRef.current * Math.PI) / 180;
    const pitchRad = (pitchRef.current * Math.PI) / 180;
    groupRef.current.rotation.y = yawRad;
    groupRef.current.rotation.x = pitchRad;
    // Subtle breathing pulse — only under the futuristic theme's bright
    // white look needs the "alive" cue. Harmless at other scales.
    const pulse = 1 + Math.sin(clock.elapsedTime * 1.6) * 0.015;
    groupRef.current.scale.setScalar(pulse);
  });

  return (
    <group ref={groupRef} scale={1}>
      <primitive object={cloned} />
      {palette.glass ? (
        <mesh scale={1.18}>
          <sphereGeometry args={[1, 48, 48]} />
          <MeshTransmissionMaterial
            thickness={0.5}
            roughness={0.1}
            ior={1.4}
            distortion={0.15}
            distortionScale={0.35}
            temporalDistortion={0.08}
            chromaticAberration={0.04}
            transmission={1}
            color={palette.glow}
            backside
          />
        </mesh>
      ) : null}
    </group>
  );
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
/*                          R3F branch (futuristic)                           */
/* -------------------------------------------------------------------------- */

function R3FPersistent() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const palette = PALETTE[theme as LogoThemeKey] ?? PALETTE.batman;
  const { yaw, pitch } = useLogoRotation();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    if (typeof window === 'undefined') return;
    return wireDockTravel(wrapper);
  }, []);

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
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={theme === 'ancient-india' ? 0.6 : 0.15} />
        <spotLight
          position={[4, 5, 5]}
          angle={0.5}
          penumbra={0.8}
          intensity={1.8}
          color={palette.accent}
        />
        <pointLight position={[-4, 2, 3]} intensity={0.55} color={palette.glow} />
        <pointLight position={[0, -2, -4]} intensity={0.6} color={palette.accent} />
        <Suspense fallback={null}>
          {palette.glass ? <Environment preset="city" /> : null}
          <LogoBody yawRef={yaw} pitchRef={pitch} />
        </Suspense>
      </Canvas>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Router component                              */
/* -------------------------------------------------------------------------- */

export function PersistentLogo() {
  const { theme } = useTheme();

  if (theme !== 'futuristic') {
    return <ModelViewerPersistent theme={theme} />;
  }

  return <R3FPersistent />;
}

useGLTF.preload('/models/batman_logo.glb');
