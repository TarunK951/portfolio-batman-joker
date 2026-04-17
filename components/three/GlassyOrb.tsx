'use client';

/**
 * GlassyOrb
 * ------------------------------------------------------------------
 * Decorative floating glass sphere using drei's MeshTransmissionMaterial
 * + city Environment. Wrap the exported <GlassyOrbScene /> in a sized
 * container — the Canvas fills its parent.
 */

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshTransmissionMaterial } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { useTheme, type Theme } from '@/components/theme/ThemeProvider';

interface GlassyOrbSceneProps {
  size?: number;
  tint?: string;
  position?: [number, number, number];
}

const TINT_BY_THEME: Record<Theme, string> = {
  batman: '#ff4d4d',
  'ancient-india': '#c8361f',
  futuristic: '#6df7ff',
};

function Orb({ size, tint, position }: Required<GlassyOrbSceneProps>) {
  const ref = useRef<THREE.Mesh | null>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.8) * 0.12;
    ref.current.rotation.y = t * 0.15;
  });
  return (
    <mesh ref={ref} position={position} scale={size}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshTransmissionMaterial
        thickness={0.6}
        roughness={0.08}
        ior={1.45}
        distortion={0.18}
        distortionScale={0.4}
        temporalDistortion={0.1}
        chromaticAberration={0.05}
        transmission={1}
        color={tint}
        backside
      />
    </mesh>
  );
}

export function GlassyOrbScene({
  size = 1,
  tint,
  position = [0, 0, 0],
}: GlassyOrbSceneProps) {
  const { theme } = useTheme();
  const finalTint = tint ?? TINT_BY_THEME[theme];
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 42 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={1} color={finalTint} />
      <Suspense fallback={null}>
        <Environment preset="city" />
        <Orb size={size} tint={finalTint} position={position} />
      </Suspense>
    </Canvas>
  );
}
