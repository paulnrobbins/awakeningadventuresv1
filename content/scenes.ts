/**
 * Scroll-score configuration — Phase 1 brief, scene-by-scene.
 *
 * Each scene maps to:
 *   id              stable key for ScrollTrigger anchoring
 *   label           the editorial word that appears as the eyebrow
 *                   (NEVER a number — Anti-AI-Tell rule)
 *   hdriUrl         which Poly Haven HDRI dominates this scene's lighting
 *   ambient         which sound cue plays under this scene
 *   fogColor        scene-level THREE.Color override for atmosphere
 *   cameraTarget    [x, y, z] dolly target — used by EnvironmentRig
 *
 * Phase 3 reads this to build the GSAP master timeline. Phase 4 reads
 * it for per-section content. Editing one entry here updates both.
 */

import type { SceneSoundKey } from '@/lib/sound';

export type SceneConfig = {
  id:
    | 'arrival'
    | 'sanctuary'
    | 'stay'
    | 'trails'
    | 'lake'
    | 'welcome'
    | 'groups'
    | 'book';
  label: string;
  hdri: string;
  ambient: SceneSoundKey;
  fog: string;          // hex color override for THREE.Fog
  fogNear: number;
  fogFar: number;
};

export const SCENES: SceneConfig[] = [
  {
    id: 'arrival',
    label: 'Arrive',
    hdri: 'moonless_golf_2k.hdr',
    ambient: 'wind-trees',
    fog: '#0B0F14',
    fogNear: 8,
    fogFar: 60,
  },
  {
    id: 'sanctuary',
    label: 'The property',
    hdri: 'kiara_1_dawn_2k.hdr',
    ambient: 'ambient-forest',
    fog: '#1B2118',
    fogNear: 20,
    fogFar: 120,
  },
  {
    id: 'stay',
    label: 'Stay',
    hdri: 'kloofendal_43d_clear_2k.hdr',
    ambient: 'crickets',
    fog: '#1B2118',
    fogNear: 15,
    fogFar: 90,
  },
  {
    id: 'trails',
    label: 'Walk the trails',
    hdri: 'forest_slope_2k.hdr',
    ambient: 'ambient-forest',
    fog: '#212B1F',
    fogNear: 5,
    fogFar: 45,
  },
  {
    id: 'lake',
    label: 'On the water',
    hdri: 'golden_gate_hills_2k.hdr',
    ambient: 'ambient-lake',
    fog: '#3A2B1E',
    fogNear: 30,
    fogFar: 180,
  },
  {
    id: 'welcome',
    label: 'Welcome',
    hdri: 'studio_small_09_2k.hdr',
    ambient: 'fire-crackle',
    fog: '#1A1009',
    fogNear: 8,
    fogFar: 50,
  },
  {
    id: 'groups',
    label: 'Set apart',
    hdri: 'moonless_golf_2k.hdr',
    ambient: 'crickets',
    fog: '#0B0F14',
    fogNear: 40,
    fogFar: 200,
  },
  {
    id: 'book',
    label: 'Come and see',
    hdri: 'moonless_golf_2k.hdr',
    ambient: 'wind-trees',
    fog: '#0B0F14',
    fogNear: 10,
    fogFar: 80,
  },
];
