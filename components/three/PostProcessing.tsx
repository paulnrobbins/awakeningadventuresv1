'use client';

import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration, BrightnessContrast } from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';
import { Vector2 } from 'three';
import { useDeviceTier } from '@/hooks/useDeviceTier';

/**
 * Cinematic post-processing — applies the layer of polish that separates
 * "default three.js output" from "movie frame":
 *   - Bloom on the fire-amber interior glow (everything else stays sharp)
 *   - Subtle film grain for organic texture (Pillar 5 — tactile detail)
 *   - Mild chromatic aberration at frame edges (lens character)
 *   - Vignette pulls the eye to the anchor object
 *   - Brightness/contrast nudge to deepen the night blacks
 *
 * Disabled entirely on low-tier devices — the perf budget is spent on
 * the world, not the polish.
 */
export function PostProcessing() {
  const tier = useDeviceTier();
  if (tier === 'low') return null;

  return (
    <EffectComposer multisampling={tier === 'high' ? 4 : 0}>
      <Bloom
        intensity={0.7}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.18}
        mipmapBlur
        kernelSize={KernelSize.MEDIUM}
      />
      <ChromaticAberration
        offset={new Vector2(0.0006, 0.0006)}
        radialModulation
        modulationOffset={0.55}
        blendFunction={BlendFunction.NORMAL}
      />
      <BrightnessContrast brightness={-0.02} contrast={0.08} />
      <Noise
        opacity={0.045}
        premultiply
        blendFunction={BlendFunction.MULTIPLY}
      />
      <Vignette
        eskil={false}
        offset={0.18}
        darkness={0.62}
      />
    </EffectComposer>
  );
}
