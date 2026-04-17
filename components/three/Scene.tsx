'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { BatSymbol } from './BatSymbol';
import { useTheme } from '@/components/theme/ThemeProvider';

const SCENE_COLORS = {
  batman: { accent: '#b00020', bg: '#060606' },
  samurai: { accent: '#8a1a1a', bg: '#efe9dd' },
  futuristic: { accent: '#00e5ff', bg: '#05070c' },
} as const;

export function Scene() {
  const { theme } = useTheme();
  const { accent, bg } = SCENE_COLORS[theme];

  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
      <color attach="background" args={[bg]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} intensity={1.4} color={accent} />
      <pointLight position={[-4, -2, -2]} intensity={0.6} color={accent} />
      <Suspense fallback={null}>
        <BatSymbol color={accent} />
      </Suspense>
    </Canvas>
  );
}
