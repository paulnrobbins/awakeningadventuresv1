'use client';

import { Suspense } from 'react';
import { FirePit } from './FirePit';
import { PhotoBillboard } from './PhotoBillboard';
import { useDeviceTier } from '@/hooks/useDeviceTier';

/**
 * Welcome scene staging — fire pit at center, two flat photo billboards
 * angled in front of the camera so the Anthony & Barb plate sits to one
 * side and a second documentary photo (fire pit or guests) sits to the
 * other.
 *
 * Sits in world space behind the Stargazer relative to Scene 5's
 * camera, so when Scene 6's keyframe lands the camera at the pit, the
 * fire is in front and the cabin glow is visible in the deep background.
 */
export function WelcomeStage() {
  const tier = useDeviceTier();
  const showPhotos = tier !== 'low';

  return (
    <group position={[-2, 0, -8]}>
      {/* Fire pit at center */}
      <FirePit position={[0, 0, 0]} glow={1.1} />

      {/* Anthony & Barb billboard — right of fire, tilted toward camera */}
      {showPhotos && (
        <Suspense fallback={null}>
          <PhotoBillboard
            src="/images/anthony-barb-welcome.jpg"
            position={[2.6, 1.6, -0.8]}
            width={2.6}
            rotationY={-Math.PI / 6}
            tilt={-0.04}
            shadowOpacity={0.6}
          />
          <PhotoBillboard
            src="/images/fire-pit.jpg"
            position={[-2.6, 1.4, -1.4]}
            width={2.2}
            rotationY={Math.PI / 5}
            tilt={-0.06}
            shadowOpacity={0.55}
          />
        </Suspense>
      )}

      {/* A few sitting-log primitives around the fire pit */}
      {[
        { p: [-0.9, 0.18, 1.0] as [number, number, number], r: 0.6 },
        { p: [0.8, 0.18, 1.0] as [number, number, number], r: -0.4 },
        { p: [0, 0.18, -1.1] as [number, number, number], r: 0 },
      ].map((log, i) => (
        <mesh key={i} position={log.p} rotation={[0, log.r, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.13, 1.2, 8]} />
          <meshStandardMaterial color="#3A2818" roughness={0.92} />
        </mesh>
      ))}
    </group>
  );
}
