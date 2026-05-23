'use client';

import { Environment } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { hdriUrl, brandColors } from '@/lib/three';
import { SCENES, type SceneConfig } from '@/content/scenes';
import { clamp } from '@/lib/utils';

/**
 * Drives the scene-level lighting & fog based on global scroll progress.
 *
 * Progress maps linearly across the 8 scenes; we pick whichever scene
 * the visitor is currently inside and apply that scene's fog config to
 * the active scene. The HDRI is loaded as the hero default — swapping
 * HDRIs on scroll is possible but expensive; Phase 5 may add an
 * Environment with `preset="night"` fallback if the HDRI isn't cached.
 *
 * Phase 3 ships with one HDRI (the hero night sky) — Phase 4 layers in
 * scene-specific HDRI swaps. This is intentional: keep the first paint
 * lean, build out atmosphere as scenes are added.
 */

interface EnvironmentRigProps {
  /** 0..1 global scroll progress. */
  progress: number;
}

export function EnvironmentRig({ progress }: EnvironmentRigProps) {
  const { scene } = useThree();

  const activeScene: SceneConfig = useMemo(() => {
    const idx = clamp(Math.floor(progress * SCENES.length), 0, SCENES.length - 1);
    return SCENES[idx];
  }, [progress]);

  useEffect(() => {
    // Fog tied to active scene's hex value.
    const color = new THREE.Color(activeScene.fog);
    scene.fog = new THREE.Fog(color, activeScene.fogNear, activeScene.fogFar);
    scene.background = null; // handled by DOM (bg-night) so HDRI doesn't show as backdrop
  }, [scene, activeScene]);

  return (
    <>
      {/* Soft ambient + a key light tuned to brand colors so even when
          HDRI isn't loaded the scene reads as "Tennessee night" rather
          than "default three.js gray". */}
      <ambientLight intensity={0.18} color={brandColors.cream} />
      <directionalLight
        position={[8, 18, 4]}
        intensity={0.4}
        color="#A8B0BF"      // moonlight tone
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />

      {/* HDRI environment lighting — comments out when HDRI file is not
          dropped into /public/hdri. The Suspense at the canvas level
          handles the missing-file case gracefully. */}
      <Environment
        files={hdriUrl('moonless_golf_2k.hdr')}
        background={false}
        environmentIntensity={0.65}
      />
    </>
  );
}
