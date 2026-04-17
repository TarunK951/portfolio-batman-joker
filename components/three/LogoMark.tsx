'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme, type Theme } from '@/components/theme/ThemeProvider';

/**
 * A single R3F scene rendering the batman_logo.glb.
 * Used two ways:
 *   - Hero / LoadingScreen — large, centered, cinematic lighting
 *   - Persistent header mark — tiny, top-left, restyled per theme
 *
 * Per-theme material:
 *   batman        → red metallic (hot emissive rim)
 *   ancient-india → ink-brushed dark red silhouette, matte, low emissive
 *   futuristic    → neon cyan wireframe, additive glow
 */

type MarkMode = 'hero' | 'tiny';

const PALETTE: Record<
  Theme,
  {
    accent: string;
    glow: string;
    base: string;
    emissive: number;
    metalness: number;
    roughness: number;
    wireframe: boolean;
  }
> = {
  batman: {
    accent: '#ff1919',
    glow: '#ff4d4d',
    base: '#0a0a0a',
    emissive: 0.45,
    metalness: 0.95,
    roughness: 0.25,
    wireframe: false,
  },
  'ancient-india': {
    // Ink-brushed silhouette — matte, dark on paper, just a whisper of vermillion
    accent: '#8a1a1a',
    glow: '#c8361f',
    base: '#14120f',
    emissive: 0.08,
    metalness: 0.1,
    roughness: 0.95,
    wireframe: false,
  },
  futuristic: {
    accent: '#00e5ff',
    glow: '#6df7ff',
    base: '#02080c',
    emissive: 1.1,
    metalness: 0.4,
    roughness: 0.15,
    wireframe: true,
  },
};

function LogoBody({ mode }: { mode: MarkMode }) {
  const groupRef = useRef<THREE.Group | null>(null);
  const { theme } = useTheme();
  const { scene } = useGLTF('/models/batman_logo.glb');
  const palette = PALETTE[theme];

  // Clone once so two simultaneous mounts don't fight over one scene
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(palette.base),
          emissive: new THREE.Color(palette.accent),
          emissiveIntensity: palette.emissive,
          metalness: palette.metalness,
          roughness: palette.roughness,
          wireframe: palette.wireframe,
        });
      }
    });
  }, [cloned, palette]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    if (mode === 'hero') {
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.25;
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.06;
      const breath = 1 + Math.sin(t * 0.7) * 0.015;
      groupRef.current.scale.setScalar(breath);
    } else {
      // tiny: slow constant rotation
      groupRef.current.rotation.y = t * 0.4;
    }
  });

  return (
    <group ref={groupRef} scale={mode === 'hero' ? 1.1 : 0.9}>
      <primitive object={cloned} />
    </group>
  );
}

export function LogoMarkScene({ mode = 'hero' }: { mode?: MarkMode }) {
  const { theme } = useTheme();
  const palette = PALETTE[theme];
  const isHero = mode === 'hero';

  return (
    <Canvas
      camera={{ position: [0, 0, isHero ? 5 : 4.2], fov: isHero ? 38 : 42 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={theme === 'ancient-india' ? 0.6 : 0.12} />
      <spotLight
        position={[4, 5, 5]}
        angle={0.5}
        penumbra={0.8}
        intensity={isHero ? 2.2 : 1.2}
        color={palette.accent}
      />
      <pointLight position={[-4, 2, 3]} intensity={0.55} color={palette.glow} />
      <pointLight position={[0, -2, -4]} intensity={0.7} color={palette.accent} />
      <Suspense fallback={null}>
        <LogoBody mode={mode} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload('/models/batman_logo.glb');
