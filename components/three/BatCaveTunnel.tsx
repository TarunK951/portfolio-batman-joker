'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useMemo, useRef, useEffect } from 'react';
import { useGLTF, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/components/theme/ThemeProvider';
import type { Theme } from '@/components/theme/ThemeProvider';

/**
 * Bat Cave Tunnel R3F scene — scroll-driven cinematic rebuild.
 *
 * Phase A (0 → 0.35): Batman logo centered + "TARUN" 3D text beneath.
 * Phase B (0.35 → 0.85): Camera dives forward through the logo into a tunnel.
 * Phase C (0.85 → 1.0):  Exit. Fog brightens toward bg, FOV widens slightly.
 *
 * Particles: 480 bat-wing silhouettes rendered as an InstancedMesh.
 */

type TunnelPalette = {
  accent: string;
  bg: string;
  stone: string;
  ring: string;
};

const TUNNEL_COLORS: Record<Theme, TunnelPalette> = {
  batman: { accent: '#ff1919', bg: '#06060a', stone: '#0b0b0d', ring: '#1a1a1d' },
  samurai: { accent: '#8a1a1a', bg: '#efe9dd', stone: '#d6cfbe', ring: '#c2bba8' },
  futuristic: { accent: '#00e5ff', bg: '#03060c', stone: '#0a1018', ring: '#0e1a28' },
};

const PARTICLE_COUNT = 480;

function readProgress(): number {
  if (typeof document === 'undefined') return 0;
  const v = getComputedStyle(document.documentElement).getPropertyValue(
    '--tunnel-progress',
  );
  const n = parseFloat(v);
  return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0;
}

function phaseA(p: number): number {
  // 0 → 1 within [0, 0.35]
  return THREE.MathUtils.clamp(p / 0.35, 0, 1);
}
function phaseB(p: number): number {
  // 0 → 1 within [0.35, 0.85]
  return THREE.MathUtils.clamp((p - 0.35) / 0.5, 0, 1);
}
function phaseC(p: number): number {
  // 0 → 1 within [0.85, 1]
  return THREE.MathUtils.clamp((p - 0.85) / 0.15, 0, 1);
}

function CameraRig({ bg }: { bg: string }) {
  const { camera, scene } = useThree();
  const progressRef = useRef(0);
  const bgColor = useMemo(() => new THREE.Color(bg), [bg]);

  useFrame(() => {
    const target = readProgress();
    progressRef.current += (target - progressRef.current) * 0.08;
    const p = progressRef.current;

    if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const cam = camera as THREE.PerspectiveCamera;
      const b = phaseB(p);
      const c = phaseC(p);
      // FOV: 65 (A) → narrows to 28 (end of B) → widens to 38 (end of C)
      const fovB = THREE.MathUtils.lerp(65, 28, b);
      const fov = THREE.MathUtils.lerp(fovB, 38, c);
      if (Math.abs(cam.fov - fov) > 0.01) {
        cam.fov = fov;
        cam.updateProjectionMatrix();
      }
      // Camera dolly: sits at +8 through phase A, dives into the tunnel in B, exits deep.
      const a = phaseA(p);
      const zA = THREE.MathUtils.lerp(8.2, 7.4, a);
      const zB = THREE.MathUtils.lerp(zA, -18, b);
      const zFinal = THREE.MathUtils.lerp(zB, -34, c);
      cam.position.z = zFinal;
      cam.position.y = THREE.MathUtils.lerp(0.25, 0, Math.max(a, b));
      cam.position.x = Math.sin(p * Math.PI * 1.2) * 0.15;
      cam.lookAt(0, 0, cam.position.z - 10);
    }

    // Exit whitening: fog color lerps toward bg brightness in phase C
    const c = phaseC(progressRef.current);
    if (scene.fog && scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(bgColor).lerp(new THREE.Color('#ffffff'), c * 0.55);
      scene.fog.near = THREE.MathUtils.lerp(6, 2, c);
      scene.fog.far = THREE.MathUtils.lerp(32, 14, c);
    }
  });

  return null;
}

function LogoGroup({ accent }: { accent: string }) {
  const groupRef = useRef<THREE.Group | null>(null);
  const logoRef = useRef<THREE.Group | null>(null);
  const { scene } = useGLTF('/models/batman_logo.glb');

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#050505'),
          emissive: new THREE.Color(accent),
          emissiveIntensity: 0.95,
          metalness: 0.95,
          roughness: 0.25,
        });
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
  }, [scene, accent]);

  useFrame((state) => {
    if (!groupRef.current || !logoRef.current) return;
    const t = state.clock.elapsedTime;
    const p = THREE.MathUtils.clamp(
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--tunnel-progress',
        ),
      ) || 0,
      0,
      1,
    );
    // Slow rotation always on; more intense during phase A
    logoRef.current.rotation.y = t * 0.2;
    logoRef.current.rotation.x = Math.sin(t * 0.25) * 0.06;

    // As camera dives (phase B), translate/scale the group so the camera flies THROUGH it.
    const b = phaseB(p);
    // Z pushes from 0 toward +12 so the group passes behind the camera.
    const groupZ = THREE.MathUtils.lerp(0, 14, b);
    groupRef.current.position.z = groupZ;
    const breath = 1 + Math.sin(t * 0.6) * 0.02;
    // Scale up slightly during dive so it dominates the frame before passing.
    const scale = THREE.MathUtils.lerp(1.4, 2.4, b) * breath;
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef} position={[0, 0.4, 0]}>
      <group ref={logoRef}>
        <primitive object={scene} />
      </group>
      {/* TARUN 3D text anchored just below the logo, moves with the group */}
      <Text
        position={[0, -2.2, 0]}
        fontSize={1.1}
        letterSpacing={0.12}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor={accent}
      >
        TARUN
        <meshStandardMaterial
          color="#0a0a0a"
          emissive={accent}
          emissiveIntensity={0.9}
          metalness={0.7}
          roughness={0.35}
        />
      </Text>
    </group>
  );
}

function Tunnel({ palette }: { palette: TunnelPalette }) {
  const ringsRef = useRef<THREE.Group | null>(null);

  const { geometry, ringPositions } = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < 34; i++) {
      const z = -i * 4;
      const wobble = Math.sin(i * 0.4) * 0.6;
      points.push(new THREE.Vector3(wobble * 0.3, wobble * 0.15, z));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const geo = new THREE.TubeGeometry(curve, 260, 6, 28, false);
    // Sample curve positions for ring placement along the spline
    const rings: { pos: THREE.Vector3; tangent: THREE.Vector3 }[] = [];
    const ringCount = 16;
    for (let i = 0; i < ringCount; i++) {
      const u = (i + 1) / (ringCount + 1);
      rings.push({
        pos: curve.getPointAt(u),
        tangent: curve.getTangentAt(u).normalize(),
      });
    }
    return { geometry: geo, ringPositions: rings };
  }, []);

  // Dispose geometry on unmount
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.z = state.clock.elapsedTime * 0.04;
    }
  });

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={palette.stone}
          emissive={palette.accent}
          emissiveIntensity={0.04}
          metalness={0.2}
          roughness={0.95}
          side={THREE.BackSide}
        />
      </mesh>
      <group ref={ringsRef}>
        {ringPositions.map((r, i) => {
          const quat = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 0, 1),
            r.tangent,
          );
          const euler = new THREE.Euler().setFromQuaternion(quat);
          return (
            <mesh
              key={i}
              position={[r.pos.x, r.pos.y, r.pos.z]}
              rotation={[euler.x, euler.y, euler.z]}
            >
              <torusGeometry args={[5.4, 0.16, 10, 56]} />
              <meshStandardMaterial
                color={palette.ring}
                emissive={palette.accent}
                emissiveIntensity={0.18}
                metalness={0.4}
                roughness={0.7}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/**
 * Bat-wing silhouette shape built procedurally — used as the instanced particle.
 */
function buildBatWingGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  // Wing silhouette (left half), mirrored by symmetry of path
  shape.moveTo(0, 0.25);
  shape.bezierCurveTo(0.15, 0.3, 0.35, 0.35, 0.55, 0.15);
  shape.bezierCurveTo(0.7, 0.05, 0.85, 0.12, 1.0, 0.02);
  shape.bezierCurveTo(0.85, -0.02, 0.7, 0.0, 0.6, -0.15);
  shape.bezierCurveTo(0.5, -0.05, 0.4, -0.05, 0.3, -0.2);
  shape.bezierCurveTo(0.2, -0.05, 0.1, 0.0, 0, -0.1);
  // Mirror
  shape.bezierCurveTo(-0.1, 0.0, -0.2, -0.05, -0.3, -0.2);
  shape.bezierCurveTo(-0.4, -0.05, -0.5, -0.05, -0.6, -0.15);
  shape.bezierCurveTo(-0.7, 0.0, -0.85, -0.02, -1.0, 0.02);
  shape.bezierCurveTo(-0.85, 0.12, -0.7, 0.05, -0.55, 0.15);
  shape.bezierCurveTo(-0.35, 0.35, -0.15, 0.3, 0, 0.25);

  const geo = new THREE.ShapeGeometry(shape, 12);
  geo.center();
  return geo;
}

function BatParticles({ accent }: { accent: string }) {
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const progressRef = useRef(0);
  const lastProgressRef = useRef(0);

  const geometry = useMemo(() => buildBatWingGeometry(), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0a0a0a',
        emissive: new THREE.Color(accent),
        emissiveIntensity: 1.0,
        metalness: 0.6,
        roughness: 0.4,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [accent],
  );

  // Per-instance randoms (stable across renders)
  const instanceData = useMemo(() => {
    const arr: {
      radius: number;
      angle: number;
      z: number;
      speed: number;
      spin: number;
      twist: number;
      scale: number;
    }[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr.push({
        radius: 3 + Math.random() * 3,
        angle: Math.random() * Math.PI * 2,
        z: -Math.random() * 80,
        speed: 0.6 + Math.random() * 1.4,
        spin: (Math.random() - 0.5) * 1.2,
        twist: Math.random() * Math.PI * 2,
        scale: 0.018 + Math.random() * 0.022,
      });
    }
    return arr;
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const p = readProgress();
    progressRef.current += (p - progressRef.current) * 0.08;
    const smoothP = progressRef.current;
    const b = phaseB(smoothP);

    // Camera speed proxy: rate of progress change
    const dp = smoothP - lastProgressRef.current;
    lastProgressRef.current = smoothP;
    const speedMul = 1 + b * 3.5 + Math.abs(dp) * 120;

    const camZ = state.camera.position.z;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const d = instanceData[i]!;
      d.z += delta * d.speed * speedMul * 4;
      // Respawn ahead once past camera
      if (d.z > camZ + 6) {
        d.z = camZ - 70 - Math.random() * 20;
        d.angle = Math.random() * Math.PI * 2;
        d.radius = 3 + Math.random() * 3;
      }
      d.twist += delta * d.spin;

      const x = Math.cos(d.angle + t * 0.05) * d.radius;
      const y = Math.sin(d.angle + t * 0.05) * d.radius * 0.7;

      dummy.position.set(x, y, d.z);
      // Face roughly camera, then twist around local Z for twinkle
      dummy.lookAt(state.camera.position);
      dummy.rotateZ(d.twist);
      // Elongate along motion direction during phase B for streak effect
      const stretch = 1 + b * 2.5;
      dummy.scale.set(d.scale, d.scale * stretch, d.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    // Opacity ramps up in phase B
    const opacity = 0.35 + b * 0.35;
    (mesh.material as THREE.MeshStandardMaterial).opacity = opacity;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, PARTICLE_COUNT]}
      frustumCulled={false}
    />
  );
}

export function BatCaveTunnelScene() {
  const { theme } = useTheme();
  const palette = TUNNEL_COLORS[theme];

  return (
    <Canvas
      camera={{ position: [0, 0.25, 8.2], fov: 65, near: 0.1, far: 120 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={[palette.bg]} />
      <fog attach="fog" args={[palette.bg, 6, 32]} />

      <ambientLight intensity={theme === 'samurai' ? 0.45 : 0.1} />
      {/* Rim from behind the logo */}
      <pointLight
        position={[0, 0, -6]}
        intensity={2.4}
        color={palette.accent}
        distance={18}
      />
      <pointLight
        position={[0, 1.2, 4]}
        intensity={0.45}
        color={palette.accent}
        distance={10}
      />
      <pointLight
        position={[-4, 0, -10]}
        intensity={1.1}
        color={palette.accent}
        distance={20}
      />
      <pointLight
        position={[4, 0, -16]}
        intensity={0.9}
        color={palette.accent}
        distance={22}
      />

      <Suspense fallback={null}>
        <Tunnel palette={palette} />
        <LogoGroup accent={palette.accent} />
        <BatParticles accent={palette.accent} />
      </Suspense>

      <CameraRig bg={palette.bg} />
    </Canvas>
  );
}

useGLTF.preload('/models/batman_logo.glb');
