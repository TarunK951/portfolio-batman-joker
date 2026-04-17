'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Environment } from '@react-three/drei';
import { BatModel } from './BatModel';
import { useTheme } from '@/components/theme/ThemeProvider';

const HERO_COLORS = {
  batman: { accent: '#b00020', glow: '#ff1744' },
  samurai: { accent: '#8a1a1a', glow: '#c8361f' },
  futuristic: { accent: '#00e5ff', glow: '#4dfff5' },
} as const;

export function HeroScene() {
  const { theme } = useTheme();
  const { accent, glow } = HERO_COLORS[theme];

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
      shadows
    >
      {/* Dramatic lighting */}
      <ambientLight intensity={0.08} />

      {/* Key light — accent colored, from above-right */}
      <spotLight
        position={[5, 5, 5]}
        angle={0.4}
        penumbra={0.8}
        intensity={2}
        color={accent}
        castShadow
      />

      {/* Fill light — softer, from the left */}
      <pointLight position={[-4, 2, 3]} intensity={0.6} color={glow} />

      {/* Rim light — behind, gives edge definition */}
      <pointLight position={[0, -2, -4]} intensity={0.8} color={accent} />

      {/* Subtle front fill */}
      <pointLight position={[0, 0, 6]} intensity={0.15} color="#ffffff" />

      <Suspense fallback={null}>
        <BatModel accentColor={accent} glowColor={glow} />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
