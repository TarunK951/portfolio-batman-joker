'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 3D Bat symbol built from an extruded SVG-style shape.
 * Rendered as a glowing wireframe + solid with emissive material.
 */
export function BatWings({ color, glowColor }: { color: string; glowColor: string }) {
  const groupRef = useRef<THREE.Group | null>(null);

  const shape = useMemo(() => {
    const s = new THREE.Shape();

    // Bat silhouette path (normalized around origin, ~4 units wide)
    // Left wing
    s.moveTo(0, 0.3);
    s.bezierCurveTo(-0.3, 0.5, -0.5, 0.8, -0.8, 0.6);
    s.bezierCurveTo(-1.1, 0.4, -1.5, 0.9, -1.8, 0.7);
    s.bezierCurveTo(-2.0, 0.6, -2.2, 0.3, -2.0, 0);
    s.bezierCurveTo(-1.8, -0.3, -1.4, -0.4, -1.1, -0.3);
    s.bezierCurveTo(-0.8, -0.2, -0.5, -0.1, -0.3, -0.3);
    s.bezierCurveTo(-0.15, -0.45, -0.05, -0.6, 0, -0.5);

    // Right wing (mirror)
    s.bezierCurveTo(0.05, -0.6, 0.15, -0.45, 0.3, -0.3);
    s.bezierCurveTo(0.5, -0.1, 0.8, -0.2, 1.1, -0.3);
    s.bezierCurveTo(1.4, -0.4, 1.8, -0.3, 2.0, 0);
    s.bezierCurveTo(2.2, 0.3, 2.0, 0.6, 1.8, 0.7);
    s.bezierCurveTo(1.5, 0.9, 1.1, 0.4, 0.8, 0.6);
    s.bezierCurveTo(0.5, 0.8, 0.3, 0.5, 0, 0.3);

    return s;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.03;
    // Subtle breathing scale
    const breath = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.015;
    groupRef.current.scale.setScalar(breath);
  });

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
    }),
    [],
  );

  return (
    <group ref={groupRef} scale={1.3} position={[0, 0.1, 0]}>
      {/* Solid bat shape */}
      <mesh>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color="#050505"
          emissive={color}
          emissiveIntensity={0.15}
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Glow outline */}
      <mesh position={[0, 0, -0.01]}>
        <extrudeGeometry args={[shape, { ...extrudeSettings, depth: 0.01 }]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={0.6}
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}
