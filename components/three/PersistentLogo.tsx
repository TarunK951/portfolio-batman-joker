'use client';

/**
 * PersistentLogo + LogoDock
 * ------------------------------------------------------------------
 * A single Batman-logo Canvas mounted once at the root. Across scroll,
 * its wrapper (fixed-positioned on <body>) tweens its bounding box to
 * match whichever `<LogoDock />` is currently active in the viewport.
 *
 * Consumers place `<LogoDock id="hero" size="large" />` inside each
 * section on the right side. The logo flies between them as the user
 * scrolls.
 *
 * The `Theme` union is `'batman' | 'ancient-india' | 'futuristic'`.
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
    base: '#02080c',
    accent: '#00e5ff',
    glow: '#6df7ff',
    emissive: 0.9,
    metalness: 0.4,
    roughness: 0.1,
    wireframe: false,
    glass: true,
  },
};

/* -------------------------------------------------------------------------- */
/*                                   Dock                                     */
/* -------------------------------------------------------------------------- */

export type LogoDockSize = 'small' | 'medium' | 'large';

const DOCK_DIMENSIONS: Record<LogoDockSize, { w: number; h: number }> = {
  small: { w: 96, h: 96 },
  medium: { w: 160, h: 160 },
  large: { w: 420, h: 420 },
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
  return (
    <div
      aria-hidden
      data-logo-dock={id}
      data-logo-dock-size={size}
      className={className}
      style={{
        width: `${dims.w}px`,
        height: `${dims.h}px`,
        pointerEvents: 'none',
        opacity: 0,
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                               Logo 3D body                                  */
/* -------------------------------------------------------------------------- */

function LogoBody() {
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
          // Glass variant: keep the mesh but MeshTransmissionMaterial is a
          // JSX component attached declaratively below via a wrapper mesh.
          // For the GLTF children we use a thin glassy MeshPhysicalMaterial
          // fallback so every child in the hierarchy shares the look.
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

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Continuous Y rotation ~0.3 rad/sec + slight X wobble
    groupRef.current.rotation.y = t * 0.3;
    groupRef.current.rotation.x = Math.sin(t * 0.8) * 0.06;
  });

  return (
    <group ref={groupRef} scale={1}>
      <primitive object={cloned} />
      {palette.glass ? (
        // A translucent shell around the logo adds the drei glass look
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
/*                           Fixed wrapper + scroll                            */
/* -------------------------------------------------------------------------- */

export function PersistentLogo() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const palette = PALETTE[theme as LogoThemeKey] ?? PALETTE.batman;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    if (typeof window === 'undefined') return;

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

    // If no dock exists, hide the wrapper entirely.
    if (docks.length === 0) {
      gsap.set(wrapper, { autoAlpha: 0 });
      return;
    }

    gsap.set(wrapper, { autoAlpha: 1 });

    // Initial placement: first dock in the DOM.
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
      // On resize, snap to active dock's new rect (no easing)
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

    // Nudge once after layout settles
    const rafId = window.requestAnimationFrame(sync);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(rafId);
      triggers.forEach((t) => t.kill());
    };
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
          <LogoBody />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/batman_logo.glb');
