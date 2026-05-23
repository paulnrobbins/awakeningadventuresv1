'use client';

import { Suspense } from 'react';
import { StargazerCabin } from './StargazerCabin';
import { Treehouse } from './Treehouse';
import { Tent } from './Tent';
import { PerspectivePlatform } from './PerspectivePlatform';
import { PhotoBillboard } from './PhotoBillboard';
import { Firefly } from './Firefly';
import { useDeviceTier } from '@/hooks/useDeviceTier';

/**
 * The whole 42-acre layout, in proper relative position to the
 * Stargazer at origin.
 *
 * Coordinate convention: +X = east along the ridge, -Z = into the
 * forest interior, +Z = toward the road. Camera positions in
 * CameraRig.tsx are tuned against this layout — moving accommodations
 * here will require keyframe updates there.
 *
 * Buildings are spread far enough apart that scene 2's pull-back camera
 * sees all of them silhouetted at dusk. The treehouse sits behind and
 * to the right of the Stargazer (canopy zone), the two tents sit to the
 * left in the prairie clearing, the perspective platform is the
 * silhouette on the ridge far behind.
 */

export function PropertyLayout() {
  const tier = useDeviceTier();
  const renderPhotos = tier !== 'low';

  return (
    <group>
      {/* The Stargazer — anchor object, stays at origin */}
      <StargazerCabin position={[0, 0, 0]} rotationY={-Math.PI / 8} interiorGlow={0.9} />

      {/* Driftwood treehouse — back-right, in the canopy zone */}
      <Treehouse position={[8, 0, -7]} scale={1} glowIntensity={0.55} />

      {/* Homestead tent — prairie clearing, has the wood stove */}
      <Tent
        position={[-9, 0, -3]}
        rotationY={Math.PI / 6}
        hasStove
        glowIntensity={0.5}
        canvasColor="#C9B388"
      />

      {/* Serene-Seven tent — further out on prairie, best night-sky pitch */}
      <Tent
        position={[-12, 0, -10]}
        rotationY={-Math.PI / 8}
        hasStove={false}
        glowIntensity={0.45}
        canvasColor="#D9C9A6"
      />

      {/* Perspective Platform — far back silhouette on the ridge */}
      <PerspectivePlatform position={[16, 1.2, -22]} rotationY={Math.PI} />

      {/* Photo billboards — Pattern A documentary photos placed in
          world space. Loaded inside Suspense so a missing texture
          falls back silently. The image filenames here correspond to
          /public/images/ — see PHOTO-CURATION-HANDOFF.md. */}
      {renderPhotos && (
        <Suspense fallback={null}>
          <PhotoBillboard
            src="/images/grounds-trail.jpg"
            position={[-4, 2.6, -8]}
            width={3.6}
            rotationY={Math.PI / 9}
            tilt={-0.04}
          />
          <PhotoBillboard
            src="/images/anthony-barb-welcome.jpg"
            position={[5, 2.4, -10]}
            width={3.0}
            rotationY={-Math.PI / 6}
            tilt={-0.05}
          />
        </Suspense>
      )}

      {/* Additional fireflies populated across the prairie */}
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
