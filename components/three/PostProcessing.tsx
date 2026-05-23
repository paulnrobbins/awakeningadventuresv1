'use client';

import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useDeviceTier } from '@/hooks/useDeviceTier';

/**
 * Cinematic post-processing — kept conservative for production stability.
 *
 * Earlier draft used ChromaticAberration (with radial modulation) and
 * BrightnessContrast — both depend on newer @react-three/postprocessing
 * API surface and have crashed in production builds depending on which
 * minor version Vercel installs. Pared back to the three battle-tested
 * effects that ship reliably across versions: Bloom (luminance-thresholded
 * for cabin glow), Noise (subtle film grain), Vignette (focus pull).
 *
 * Disabled entirely on low-tier devices.
 */
export function PostProcessing() {
  const tier = useDeviceTier();
  if (tier === 'low') return null;

  return (
    <EffectComposer>
      <Bloom
        intensity={0.7}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.18}
      />
      <Noise
        opacity={0.045}
        blendFunction={BlendFunction.MULTIPLY}
      />
      <Vignette
        offset={0.18}
        darkness={0.62}
      />
    </EffectComposer>
  );
}
