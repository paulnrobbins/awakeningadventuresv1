'use client';

import { Environment } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { hdriUrl, brandColors } from '@/lib/three';
import { SCENES, type SceneConfig } from '@/content/scenes';
import { clamp } from '@/lib/utils';
import { WorldErrorBoundary } from './WorldErrorBoundary';

/**
 * Drives the scene-level lighting & fog based on global scroll progress.
 *
 * Phase 3 ships with one HDRI (the hero night sky). Phase 4 layers in
 * scene-specific HDRI swaps. The HDRI Environment is isolated behind
 * its own Suspense + ErrorBoundary so a missing .hdr file gracefully
 * degrades to the ambient + directional fallback rather than crashing
 * the scene.
 */
interface EnvironmentRigProps {
  progress: number;
}

export function EnvironmentRig({ progress }: EnvironmentRigProps) {
  const { scene } = useThree();

  const activeScene: SceneConfig = useMemo(() => {
    const idx = clamp(Math.floor(progress * SCENES.length), 0, SCENES.length - 1);
    return SCENES[idx];
  }, [progress]);

  useEffect(() => {
    const color = new THREE.Color(activeScene.fog);
    scene.fog = new THREE.Fog(color, activeScene.fogNear, activeScene.fogFar);
    scene.background = null;
  }, [scene, activeScene]);

  return (
    <>
      {/* Brand-tuned ambient + key light — works without HDRI. */}
      <ambientLight intensity={0.18} color={brandColors.cream} />
      <directionalLight
        position={[8, 18, 4]}
        intensity={0.4}
        color="#A8B0BF"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />

      {/* HDRI lighting is optional — boundary + Suspense means a missing
          .hdr file is silently skipped, the scene falls back to the
          ambient + directional lights above. */}
      <WorldErrorBoundary>
        <Suspense fallback={null}>
          <Environment
            files={hdriUrl('moonless_golf_2k.hdr')}
            background={false}
            environmentIntensity={0.65}
          />
        </Suspense>
      </WorldErrorBoundary>
    </>
  );
}
