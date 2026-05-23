'use client';

import { Html } from '@react-three/drei';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { brandColors } from '@/lib/three';

/**
 * 3D booking card — a glass plate floating in world space with editorial
 * text overlaid via drei's Html (so the type stays crisp and accessible).
 *
 * Idle: subtle Y-bob, slight rotation drift.
 * Hover: magnetism toward cursor, glow ramp-up, slight Y-pop.
 */
interface BookingCard3DProps {
  position: [number, number, number];
  accomName: string;
  accomKind: string;
  capacity: string;
  ctaLabel: string;
  hookText: string;
  bookingUrl: string;
  phase?: number; // 0..1 for stagger
}

export function BookingCard3D({
  position,
  accomName,
  accomKind,
  capacity,
  ctaLabel,
  hookText,
  bookingUrl,
  phase = 0,
}: BookingCard3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const targetGlow = useRef(0);

  useFrame((state) => {
    if (!groupRef.current || !glassRef.current) return;
    const t = state.clock.getElapsedTime();
    // Idle Y-bob
    const bobY = Math.sin(t * 0.7 + phase * Math.PI * 2) * 0.08;
    // Slight yaw drift
    const yaw = Math.sin(t * 0.4 + phase * Math.PI) * 0.05;
    groupRef.current.position.y = position[1] + bobY + (hovered ? 0.18 : 0);
    groupRef.current.rotation.y = yaw + (hovered ? -0.08 : 0);

    // Glow ramp
    targetGlow.current = hovered ? 1 : 0;
    const mat = glassRef.current.material as THREE.MeshPhysicalMaterial;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetGlow.current * 0.4, 0.08);
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Glass plate */}
      <mesh
        ref={glassRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
      >
        <boxGeometry args={[2.4, 3.2, 0.04]} />
        <meshPhysicalMaterial
          color="#F2E9D8"
          transparent
          transmission={0.85}
          opacity={1}
          roughness={0.06}
          thickness={0.6}
          ior={1.49}
          clearcoat={0.4}
          envMapIntensity={1.2}
          emissive={brandColors.amber}
          emissiveIntensity={0}
        />
      </mesh>

      {/* Bezel frame */}
      <mesh position={[0, 0, -0.022]}>
        <boxGeometry args={[2.46, 3.26, 0.02]} />
        <meshStandardMaterial color="#1A1410" roughness={0.6} />
      </mesh>

      {/* HTML overlay — keeps text crisp and clickable */}
      <Html
        center
        transform
        position={[0, 0, 0.05]}
        distanceFactor={2.4}
        style={{ pointerEvents: 'auto' }}
      >
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-[280px] text-cream"
          aria-label={ctaLabel}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="eyebrow text-amber/80 mb-2">{accomKind}</p>
          <h3 className="font-display text-[2.4rem] leading-[0.95] mb-2">{accomName}</h3>
          <p className="font-sans text-[1.05rem] leading-[1.45] text-cream/85 mb-3">{hookText}</p>
          <p className="font-sans text-[0.78rem] text-cream/55 mb-6 tracking-wide">{capacity}</p>
          <span className="font-display text-[1.3rem] text-amber inline-flex items-center gap-2">
            {ctaLabel}
            <span aria-hidden="true">→</span>
          </span>
        </a>
      </Html>
    </group>
  );
}
