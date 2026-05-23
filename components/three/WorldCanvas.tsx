'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { attachKtx2 } from '@/lib/three';
import { WorldScene } from './WorldScene';
import { PostProcessing } from './PostProcessing';

/**
 * Single full-bleed R3F Canvas that hosts the entire inhabitable world.
 * Every Scene component renders DOM content positioned ON TOP of this
 * canvas; the 3D state behind them animates as scroll progresses.
 *
 * Phase 2 shipped this as an empty night background. Phase 3 wires
 * WorldScene + PostProcessing inside the Suspense boundary so the
 * Stargazer, star field, HDRI environment, and camera rig come alive.
 */
export function WorldCanvas() {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  return (
    <div className="fixed inset-0 z-[var(--z-world)] bg-night">
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
          scene.background = null; // DOM owns the background color
        }}
        // Frameloop:always — the star field + firefly + interior flicker
        // need continuous frames. Phase 5's perf pass adds an idle-pause
        // when the tab is hidden.
        frameloop="always"
        shadows
      >
        <Suspense fallback={null}>
          <WorldScene />
          <PostProcessing />
        </Suspense>
      </Canvas>
    </div>
  );
}
