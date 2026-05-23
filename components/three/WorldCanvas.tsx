'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { attachKtx2 } from '@/lib/three';
import { WorldScene } from './WorldScene';
import { PostProcessing } from './PostProcessing';
import { WorldErrorBoundary } from './WorldErrorBoundary';

/**
 * Single full-bleed R3F Canvas hosting the inhabitable world.
 *
 * Error boundary catches any internal failure (missing HDRI, missing
 * model, WebGL context loss) so the rest of the page keeps working.
 * Suspense catches loading promises. Both are needed because the world
 * depends on asset files that may not all be present in every env.
 */
export function WorldCanvas() {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  return (
    <div className="fixed inset-0 z-[var(--z-world)] bg-night">
      <WorldErrorBoundary>
        <Canvas
          dpr={[1, 2]}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
            outputColorSpace: THREE.SRGBColorSpace,
            powerPreference: 'high-performance',
            alpha: false,
          }}
          camera={{ position: [0, 1.4, 6], fov: 38, near: 0.1, far: 500 }}
          onCreated={({ gl, scene }) => {
            rendererRef.current = gl;
            attachKtx2(gl);
            scene.background = null;
          }}
          frameloop="always"
          shadows
        >
          <Suspense fallback={null}>
            <WorldErrorBoundary>
              <WorldScene />
            </WorldErrorBoundary>
            <WorldErrorBoundary>
              <PostProcessing />
            </WorldErrorBoundary>
          </Suspense>
        </Canvas>
      </WorldErrorBoundary>
    </div>
  );
}
