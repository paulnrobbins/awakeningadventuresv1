'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getLenis } from '@/lib/lenis';
import { clamp } from '@/lib/utils';

/**
 * Camera rig — drives the camera position + look-target as a function of
 * global scroll progress.
 *
 * Phase 4a expands the keyframe table so the Stay range (~progress
 * 0.25-0.45) walks the camera past each of the four accommodations in
 * order: Stargazer → Driftwood treehouse → Homestead tent → Serene-Seven
 * tent. Each accommodation gets a 0.05 progress slice. The rig uses
 * cinematic easing on every transition so even quick scrolling looks
 * composed.
 */

type CameraKeyframe = {
  t: number;                      // global progress at this keyframe (0..1)
  pos: [number, number, number];
  target: [number, number, number];
  /** Optional per-segment ease — default power3-out. */
  ease?: 'linear' | 'ease-out' | 'ease-in-out';
};

// Eleven keyframes spanning 8 scenes — Stay gets 4 keyframes inside it
// so the camera lingers at each accommodation.
const KEYFRAMES: CameraKeyframe[] = [
  // 0 - Arrival
  { t: 0.00,  pos: [0,    1.4,  6.0], target: [0,   1.0,   0] },
  // 1 - Sanctuary — pull up and back over the property
  { t: 0.14,  pos: [4,    8.0,  14],  target: [0,   1.0,  -3] },
  // The Stay sticky-card section spans roughly progress 0.26–0.44.
  // Each of 4 cards occupies ~0.045 of progress. The DOM fade-in for
  // each card triggers when its top hits 80% of viewport — about 0.03
  // BEFORE the card becomes sticky. So camera keyframes are pulled
  // earlier so the building arrives in frame at the moment the card
  // appears, not a card later.
  //
  // 2 - Stargazer entry — building at origin
  { t: 0.26,  pos: [-3.0, 1.8,  4.0], target: [0,   1.2,   0] },
  // 3 - Driftwood — building at [22, 0, -16]
  { t: 0.30,  pos: [16,   4.0, -6.0], target: [22,  4.0, -16] },
  // 4 - Homestead — building at [-22, 0, -6]
  { t: 0.34,  pos: [-15,  2.4,  2.0], target: [-22, 1.2,  -6] },
  // 5 - Serene Seven — building at [-26, 0, -24]
  { t: 0.385, pos: [-19,  2.6, -16],  target: [-26, 1.0, -24] },
  // 5.5 - Shower house — building at [20, 0, 8]
  { t: 0.44,  pos: [14,   3.6, 16],   target: [20,  3.0,   8] },
  // 6 - Trails — eye-level on the trail, framing the prayer shelter
  //     on the left and the perspective platform on the right.
  //     Forest scene origin is [0, 0, -16] so positions are offset.
  { t: 0.54,  pos: [-2,   1.6,  -8],  target: [1,   1.8, -20] },
  // 7 - Lake — slightly elevated shoreside view. Dock leads diagonally
  //     into the lake on the left, moored pontoon is on the right just
  //     past the dock's lakeside end, far shore woodline + island
  //     silhouettes anchor the horizon.
  { t: 0.64,  pos: [-7,   3.2, -22],  target: [2,   0.4, -40] },
  // 8 - Welcome — sitting at the fire pit (the pit is at [-2, 0, -8]).
  // Keyframe lands AFTER the lake unmounts at progress 0.70 so the
  // visitor scrolls cleanly from lake water back into the forest.
  { t: 0.76,  pos: [-3.4, 1.2,  -5.0], target: [-2,  0.5,  -8] },
  // 9 - Groups — full pull-back to see the entire property at full darkness
  { t: 0.86,  pos: [14,   16,   20],   target: [-2,  0.5,  -6] },
  // 10 - Book — return to hero composition
  { t: 1.00,  pos: [0,    1.4,  6.0], target: [0,   1.0,   0] },
];

interface CameraRigProps {
  /** Optional handheld shake amount (0..1). Welcome scene uses ~0.3. */
  shake?: number;
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function CameraRig({ shake = 0 }: CameraRigProps) {
  const { camera } = useThree();
  const tmpPos = useRef(new THREE.Vector3());
  const tmpTarget = useRef(new THREE.Vector3());
  const currentTarget = useRef(new THREE.Vector3(0, 1, 0));
  const progress = useRef(0);

  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;
    const handler = ({ progress: p }: { progress: number }) => {
      progress.current = p;
    };
    lenis.on('scroll', handler);
    return () => lenis.off('scroll', handler);
  }, []);

  useFrame((state, delta) => {
    const p = clamp(progress.current, 0, 1);
    // Find the bracketing keyframes for current progress
    let i = 0;
    for (let k = 0; k < KEYFRAMES.length - 1; k++) {
      if (p >= KEYFRAMES[k].t && p <= KEYFRAMES[k + 1].t) {
        i = k;
        break;
      }
      if (p > KEYFRAMES[KEYFRAMES.length - 1].t) i = KEYFRAMES.length - 2;
    }
    const a = KEYFRAMES[i];
    const b = KEYFRAMES[i + 1] ?? a;
    const span = b.t - a.t || 1;
    const local = clamp((p - a.t) / span, 0, 1);
    const eased = easeOut(local);

    tmpPos.current.set(
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], eased),
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], eased),
      THREE.MathUtils.lerp(a.pos[2], b.pos[2], eased),
    );
    tmpTarget.current.set(
      THREE.MathUtils.lerp(a.target[0], b.target[0], eased),
      THREE.MathUtils.lerp(a.target[1], b.target[1], eased),
      THREE.MathUtils.lerp(a.target[2], b.target[2], eased),
    );

    if (shake > 0) {
      const t2 = state.clock.getElapsedTime();
      tmpPos.current.x += Math.sin(t2 * 1.8) * 0.04 * shake;
      tmpPos.current.y += Math.cos(t2 * 1.3) * 0.03 * shake;
    }

    camera.position.lerp(tmpPos.current, 1 - Math.pow(0.0001, delta));
    currentTarget.current.lerp(tmpTarget.current, 1 - Math.pow(0.0001, delta));
    camera.lookAt(currentTarget.current);
  });

  return null;
}
