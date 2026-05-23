'use client';

import { useEffect, useState } from 'react';
import { getLenis } from '@/lib/lenis';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { CameraRig } from './CameraRig';
import { EnvironmentRig } from './EnvironmentRig';
import { Firefly } from './Firefly';
import { StarField } from './StarField';
import { PropertyLayout } from './PropertyLayout';
import { ForestScene } from './ForestScene';
import { LakeWater } from './LakeWater';
import { PontoonBoat } from './PontoonBoat';
import { TreeBank } from './TreeBank';
import { WelcomeStage } from './WelcomeStage';
import { BookingStage } from './BookingStage';

/**
 * Everything inside the R3F Canvas.
 *
 * Conditional scene activation by scroll progress:
 *   • PropertyLayout — always (the world's anchor)
 *   • ForestScene — 0.46 < p < 0.70 (trails range)
 *   • LakeWater + PontoonBoat — 0.58 < p < 0.78 (lake range)
 *   • WelcomeStage — 0.66 < p < 0.92 (welcome + groups range)
 *   • Tree line — always (continuity)
 *
 * Tight ranges keep frame budget honest. Phase 5's perf pass adds
 * tab-hidden pause + LOD swaps.
 */
export function WorldScene() {
  const tier = useDeviceTier();
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;
    const handler = ({ progress: p }: { progress: number }) => {
      setProgress((prev) => (Math.abs(prev - p) > 0.002 ? p : prev));
    };
    lenis.on('scroll', handler);
    return () => lenis.off('scroll', handler);
  }, []);

  const starCount = tier === 'high' ? 6000 : tier === 'mid' ? 2500 : 800;
  // Handheld shake peaks in the welcome scene's range
  const cameraShake =
    progress > 0.66 && progress < 0.80
      ? 0.36
      : reduced
      ? 0
      : 0.05;

  const inForest = progress > 0.46 && progress < 0.70;
  const inLakeRange = progress > 0.58 && progress < 0.78;
  const inWelcomeRange = progress > 0.66 && progress < 0.92;
  const inBookRange = progress > 0.86;

  return (
    <>
      <EnvironmentRig progress={progress} />
      <CameraRig shake={cameraShake} />

      <PropertyLayout />

      <mesh position={[0.4, -0.18, 1.5]}>
        <boxGeometry args={[0.9, 0.12, 0.4]} />
        <meshStandardMaterial color="#3A2818" roughness={0.88} />
      </mesh>

      {!reduced && tier !== 'low' && (
        <>
          <Firefly phase={0} origin={[2, 1.6, -3]} period={28} />
          <Firefly phase={0.4} origin={[-3, 1.4, -4]} period={32} pathWidth={6} />
        </>
      )}

      <TreeBank
        count={tier === 'high' ? 60 : 36}
        center={[0, 0, -34]}
        spread={[80, 12]}
        heightRange={[6, 10]}
        radiusRange={[0.10, 0.22]}
        seed={91}
        color="#0C120E"
      />

      {inForest && <ForestScene origin={[0, 0, -16]} />}
      {inLakeRange && (
        <>
          <LakeWater position={[0, -0.3, -34]} size={[280, 280]} />
          <PontoonBoat startX={-45} endX={45} z={-58} baseY={0.4} period={90} />
        </>
      )}
      {inWelcomeRange && <WelcomeStage />}
      {inBookRange && <BookingStage />}

      {/* Sun motes — daytime equivalent of the night star field */}
      <StarField count={Math.round(starCount * 0.4)} radius={40} />

      {/* Forest floor — daytime tone, warm earth + foliage */}
      <mesh position={[0, -0.18, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[400, 400, 1, 1]} />
        <meshStandardMaterial color="#3D4A30" roughness={0.96} />
      </mesh>
    </>
  );
}
