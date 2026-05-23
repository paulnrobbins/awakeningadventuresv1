'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Real-sidereal-speed star field. One full rotation around the world
 * Y-axis every ~120 seconds, which sells "actual night sky" without
 * crossing into sci-fi-spinning territory.
 *
 * Star count is device-tier-gated: 6000 on high, 2500 on mid, 800 on low.
 * The Three Foundations performance rule (60fps on mid-range mobile) is
 * non-negotiable, so we bias conservatively.
 *
 * Stars are rendered as Points with a soft circular sprite — avoids the
 * "white pixels in a black sky" look that gives away a default
 * three.js scene.
 */

interface StarFieldProps {
  /** Total star count. Caller picks based on device tier. */
  count?: number;
  /** Sphere radius — stars sit on a celestial sphere this far out. */
  radius?: number;
  /** Rotation period in seconds. ~120 = real sidereal feel. */
  periodSeconds?: number;
}

export function StarField({
  count = 2500,
  radius = 80,
  periodSeconds = 120,
}: StarFieldProps) {
  const ref = useRef<THREE.Points>(null);

  // Generate star positions on a sphere with brightness variation.
  // Brighter stars cluster slightly along a fake milky-way band.
  const { positions, sizes, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Uniform sphere sampling
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.9 + Math.random() * 0.1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Brightness — exponential distribution so most stars are small
      // and a few feel like real bright magnitudes.
      const mag = Math.pow(Math.random(), 4);
      sizes[i] = 0.15 + mag * 1.8;

      // Color — most stars are warm white, a few have blue/amber tint
      const tint = Math.random();
      if (tint < 0.05) {
        // Bluish
        colors[i * 3] = 0.78;
        colors[i * 3 + 1] = 0.86;
        colors[i * 3 + 2] = 1.0;
      } else if (tint < 0.1) {
        // Amber star — rare giants
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.82;
        colors[i * 3 + 2] = 0.55;
      } else {
        // Warm white default
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.96;
        colors[i * 3 + 2] = 0.9;
      }
    }
    return { positions, sizes, colors };
  }, [count, radius]);

  useFrame((state) => {
    if (!ref.current) return;
    // Real sidereal feel — slow, continuous, never lurching.
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = (t / periodSeconds) * Math.PI * 2;
    // A tiny tilt-drift on Z evokes the natural Earth-axis precession.
    ref.current.rotation.z = Math.sin(t * 0.02) * 0.04;
  });

  // Build the soft-circle sprite once via canvas — no external texture.
  // Must be created inside useEffect so it doesn't run during SSR
  // (document is undefined on the server).
  const [sprite, setSprite] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0.0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,255,255,0.65)');
    grad.addColorStop(0.7, 'rgba(255,255,255,0.12)');
    grad.addColorStop(1.0, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    setSprite(new THREE.CanvasTexture(canvas));
  }, []);

  // Wait for the sprite to be built before rendering anything — avoids
  // a frame of bare points and avoids any chance of SSR hitting this branch.
  if (!sprite) return null;

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.5}
        sizeAttenuation
        map={sprite}
        alphaTest={0.001}
        transparent
        depthWrite={false}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
