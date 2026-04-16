'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { BatSymbol } from './BatSymbol';
import { useTheme } from '@/components/theme/ThemeProvider';

export function Scene() {
  const { theme } = useTheme();
  const accent = theme === 'batman' ? '#b00020' : '#39ff14';
  const bg = theme === 'batman' ? '#060606' : '#070a07';

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
