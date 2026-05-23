'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeBank } from './TreeBank';
import { Firefly } from './Firefly';
import { PrayerShelter } from './PrayerShelter';
import { PerspectivePlatform } from './PerspectivePlatform';
import { useDeviceTier } from '@/hooks/useDeviceTier';

/**
 * The forest interior the camera moves through during Scene 4 (Trails).
 *
 * Built as overlapping tree banks at three depths, with one firefly
 * arc-pass and a slow "light shaft" sliver of warm light that breathes
 * to evoke morning sun filtering through canopy.
 *
 * Geographically sits in front of and around the trail keyframe in
 * CameraRig — when the camera descends to ground level it ends up
 * inside this group of trees.
 */
export function ForestScene({
  origin = [0, 0, -16],
}: {
  origin?: [number, number, number];
}) {
  const tier = useDeviceTier();
  const lightShaft = useRef<THREE.SpotLight>(null);

  // Light shaft breathing: a soft warm spotlight that fades in and out
  // every ~14 seconds, evoking filtered canopy light.
  useFrame(({ clock }) => {
    if (!lightShaft.current) return;
    const t = clock.getElapsedTime();
    lightShaft.current.intensity = 1.4 + Math.sin(t * 0.45) * 0.9;
  });

  const nearCount = tier === 'high' ? 40 : tier === 'mid' ? 24 : 12;
  const midCount = tier === 'high' ? 60 : tier === 'mid' ? 36 : 18;
  const farCount = tier === 'high' ? 80 : tier === 'mid' ? 48 : 24;

  return (
    <group position={origin}>
      {/* Near bank — flanks the trail */}
      <TreeBank
        count={nearCount}
        center={[0, 0, 4]}
        spread={[18, 8]}
        heightRange={[5, 9]}
        radiusRange={[0.16, 0.32]}
        seed={101}
        color="#0E1410"
      />
      {/* Mid bank */}
      <TreeBank
        count={midCount}
        center={[0, 0, -2]}
        spread={[26, 12]}
        heightRange={[6, 11]}
        radiusRange={[0.14, 0.28]}
        seed={211}
        color="#121A14"
      />
      {/* Far bank — receding silhouette */}
      <TreeBank
        count={farCount}
        center={[0, 0, -14]}
        spread={[36, 18]}
        heightRange={[7, 13]}
        radiusRange={[0.10, 0.22]}
        seed={307}
        color="#0A100C"
      />

      {/* Breathing light shaft from canopy */}
      <spotLight
        ref={lightShaft}
        position={[-4, 14, -2]}
        target-position={[0, 0, -4]}
        angle={0.32}
        penumbra={0.85}
        intensity={2.0}
        distance={26}
        decay={1.4}
        color="#D9C089"
        castShadow={false}
      />

      {/* One firefly arc per trail pass */}
      {tier !== 'low' && (
        <Firefly phase={0} origin={[0, 1.2, -4]} pathWidth={8} period={22} />
      )}

      {/* Mountain prayer shelter — moved into a clearing right next to
          the trail and scaled up so it's the focal point of the scene,
          not a background detail. Faces the camera at a friendly angle. */}
      <group position={[-4, 0, -3]} rotation={[0, Math.PI / 5, 0]} scale={1.4}>
        <PrayerShelter />
      </group>

      {/* Perspective tree platform — also brought forward and scaled.
          Sits on the right side of the trail, elevated on its posts. */}
      <group position={[6, 0, -5]} rotation={[0, -Math.PI / 4, 0]} scale={1.5}>
        <PerspectivePlatform />
      </group>
    </group>
  );
}
