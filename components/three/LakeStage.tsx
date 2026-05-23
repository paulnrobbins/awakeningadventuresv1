'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Dock } from './Dock';
import { LakeWater } from './LakeWater';

/**
 * The Lake scene staging — Watts Bar Lake with a wooden dock extending
 * out into the water, a pontoon boat moored at the dock's end with a
 * gentle bob (not drifting across the horizon like the original
 * PontoonBoat — this one is parked, waiting for Anthony to take guests
 * out).
 *
 * Geographic placement: this group sits at world Z = -30, well past
 * the property layout, so it's "twenty minutes from the property"
 * spatially as well as in copy. The LakeWater plane extends 280m to
 * the horizon.
 *
 * Camera at the Lake scene keyframe (CameraRig) is tuned to frame the
 * dock extending toward the moored boat with the lake stretching to
 * the horizon behind.
 */
export function LakeStage() {
  return (
    <group position={[0, 0, -30]}>
      {/* The lake itself — covers the full horizon */}
      <LakeWater position={[0, -0.35, 0]} size={[320, 320]} />

      {/* Sandy shore beach edge — a band of warm gravel where the dock
          meets the land. Drawn BEFORE the dock so dock decking sits
          visually on top. */}
      <mesh position={[0, -0.10, 1.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[22, 5]} />
        <meshStandardMaterial color="#C9AC85" roughness={0.95} />
      </mesh>

      {/* Dock — extends 8m from shore into the lake. Origin is at
          the SHORE end (z=0); the lakeside (mooring) end is at z=-8. */}
      <Dock position={[0, 0, -4]} rotationY={0} length={8} width={2.2} />

      {/* Pontoon moored alongside the dock's lakeside end. Sits parallel
          to the dock with its long axis pointing along -X away from the
          dock. Bobs in place. */}
      <MooredPontoon position={[4.8, 0.05, -7]} rotationY={Math.PI / 2} />

      {/* A second smaller island silhouette far on the horizon —
          gives the visitor a target for "the island campsite". */}
      <Island position={[36, -0.3, -60]} />
      <Island position={[-44, -0.3, -78]} scale={0.6} />
    </group>
  );
}

/**
 * Moored pontoon — same primitive build as PontoonBoat but it bobs in
 * place instead of drifting. Tied to the dock with a short rope.
 */
function MooredPontoon({
  position,
  rotationY = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    // Gentle vertical bob + tiny yaw drift
    ref.current.position.y = position[1] + Math.sin(t * 0.7) * 0.06;
    ref.current.rotation.y = rotationY + Math.sin(t * 0.4) * 0.015;
    ref.current.rotation.z = Math.sin(t * 0.55) * 0.012;
  });

  return (
    <group ref={ref} position={position} rotation={[0, rotationY, 0]}>
      {/* Pontoons — two tubes */}
      <mesh position={[0, 0, 0.7]}>
        <cylinderGeometry args={[0.22, 0.22, 6.0, 8]} />
        <meshStandardMaterial color="#2A2018" roughness={0.7} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0, -0.7]}>
        <cylinderGeometry args={[0.22, 0.22, 6.0, 8]} />
        <meshStandardMaterial color="#2A2018" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Deck */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[6.2, 0.18, 2.0]} />
        <meshStandardMaterial color="#8B6336" roughness={0.85} />
      </mesh>

      {/* Canopy posts */}
      {[[-2.4, 0.7], [2.4, 0.7], [-2.4, -0.7], [2.4, -0.7]].map((p, i) => (
        <mesh key={i} position={[p[0], 1.2, p[1]]}>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 6]} />
          <meshStandardMaterial color="#3F2A18" roughness={0.7} />
        </mesh>
      ))}

      {/* Canopy roof — warm canvas color, daytime feel */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <boxGeometry args={[5.4, 0.1, 1.8]} />
        <meshStandardMaterial color="#D9C9A6" roughness={0.78} />
      </mesh>

      {/* Helm / steering wheel — small detail */}
      <mesh position={[-1.8, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.025, 8, 16]} />
        <meshStandardMaterial color="#2A1F15" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Two bench seats inside the canopy */}
      <mesh position={[1.1, 0.55, 0]}>
        <boxGeometry args={[1.6, 0.08, 1.4]} />
        <meshStandardMaterial color="#3A2818" roughness={0.85} />
      </mesh>
      <mesh position={[-0.6, 0.55, 0]}>
        <boxGeometry args={[1.4, 0.08, 1.4]} />
        <meshStandardMaterial color="#3A2818" roughness={0.85} />
      </mesh>

      {/* Mooring rope — thin line from boat cleat to dock cleat. Approximated
          as a slightly drooping cylinder so it reads as rope at distance. */}
      <mesh position={[-3.2, 0.45, 0.9]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.02, 0.02, 1.3, 6]} />
        <meshStandardMaterial color="#8B7355" roughness={0.95} />
      </mesh>
    </group>
  );
}

/**
 * Distant island — a low, tree-fringed silhouette on the horizon.
 * Sells "boat-in island campsite" without needing detailed geometry.
 */
function Island({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      {/* Island mass — flattened ellipsoid */}
      <mesh receiveShadow>
        <sphereGeometry args={[6, 16, 10]} />
        <meshStandardMaterial color="#3D4A30" roughness={0.95} />
      </mesh>
      {/* Tree silhouettes — a small cluster of cones */}
      {Array.from({ length: 7 }).map((_, i) => {
        const angle = (i / 7) * Math.PI * 1.6 - Math.PI * 0.3;
        const r = 3 + Math.random() * 1.5;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        const h = 2.5 + Math.random() * 1.8;
        return (
          <mesh key={i} position={[x, h / 2 + 1, z]} castShadow>
            <coneGeometry args={[0.9, h, 6]} />
            <meshStandardMaterial color="#2F3B26" roughness={0.95} />
          </mesh>
        );
      })}
    </group>
  );
}
