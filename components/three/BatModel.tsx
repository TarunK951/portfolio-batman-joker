'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface BatModelProps {
  accentColor: string;
  glowColor: string;
}

export function BatModel({ accentColor, glowColor }: BatModelProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const { scene } = useGLTF('/models/batman_logo.glb');

  // Apply custom materials to the loaded model
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#080808'),
          emissive: new THREE.Color(accentColor),
          emissiveIntensity: 0.2,
          metalness: 0.95,
          roughness: 0.2,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene, accentColor]);

  // Slow cinematic rotation + breathing
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.12;
    groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.04;
    const breath = 1 + Math.sin(t * 0.4) * 0.01;
    groupRef.current.scale.setScalar(breath);
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/batman_logo.glb');
