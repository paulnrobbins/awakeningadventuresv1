'use client';

import { Suspense } from 'react';
import { StargazerCabin } from './StargazerCabin';
import { Treehouse } from './Treehouse';
import { Tent } from './Tent';
import { PerspectivePlatform } from './PerspectivePlatform';
import { PhotoBillboard } from './PhotoBillboard';
import { Firefly } from './Firefly';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import { WorldErrorBoundary } from './WorldErrorBoundary';

/**
 * The whole 42-acre layout, in proper relative position to the
 * Stargazer at origin.
 *
 * Photo billboards are wrapped in their own Suspense + ErrorBoundary so
 * a missing image file degrades silently — the rest of the layout still
 * renders.
 */
export function PropertyLayout() {
  const tier = useDeviceTier();
  const renderPhotos = tier !== 'low';

  return (
    <group>
      <StargazerCabin position={[0, 0, 0]} rotationY={-Math.PI / 8} interiorGlow={0.9} />

      <Treehouse position={[8, 0, -7]} scale={1} glowIntensity={0.55} />

      <Tent
        position={[-9, 0, -3]}
        rotationY={Math.PI / 6}
        hasStove
        glowIntensity={0.5}
        canvasColor="#C9B388"
      />

      <Tent
        position={[-12, 0, -10]}
        rotationY={-Math.PI / 8}
        hasStove={false}
        glowIntensity={0.45}
        canvasColor="#D9C9A6"
      />

      <PerspectivePlatform position={[16, 1.2, -22]} rotationY={Math.PI} />

      {/* Photo billboards — Pattern A. Each wrapped individually so one
          missing image doesn't take down the other. */}
      {renderPhotos && (
        <>
          <WorldErrorBoundary>
            <Suspense fallback={null}>
              <PhotoBillboard
                src="/images/grounds-trail.jpg"
                position={[-4, 2.6, -8]}
                width={3.6}
                rotationY={Math.PI / 9}
                tilt={-0.04}
              />
            </Suspense>
          </WorldErrorBoundary>
          <WorldErrorBoundary>
            <Suspense fallback={null}>
              <PhotoBillboard
                src="/images/anthony-barb-welcome.jpg"
                position={[5, 2.4, -10]}
                width={3.0}
                rotationY={-Math.PI / 6}
                tilt={-0.05}
              />
            </Suspense>
          </WorldErrorBoundary>
        </>
      )}

      {tier === 'high' && (
        <>
          <Firefly phase={0.15} origin={[-7, 1.4, -4]} period={29} pathWidth={5} />
          <Firefly phase={0.55} origin={[-11, 1.6, -8]} period={34} pathWidth={6} />
          <Firefly phase={0.8} origin={[6, 1.8, -5]} period={31} pathWidth={4} />
        </>
      )}
    </group>
  );
}
