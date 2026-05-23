/**
 * Shared Three.js helpers — loaders, draco config, asset URL helpers.
 *
 * The 3D-web-experience skill prescribes Draco + WebP texture compression
 * for every web-bound GLB. This module exposes a single configured loader
 * so every Scene component pulls models the same way.
 */

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

// Draco decoder hosted on Google CDN — no need to ship the WASM blob with
// our deploy. Pinned version matches three@0.169.
const DRACO_DECODER_URL = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';

let cachedGltf: GLTFLoader | null = null;

export function getGltfLoader(): GLTFLoader {
  if (cachedGltf) return cachedGltf;

  const draco = new DRACOLoader();
  draco.setDecoderPath(DRACO_DECODER_URL);

  const gltf = new GLTFLoader();
  gltf.setDRACOLoader(draco);

  // KTX2 (basis universal) gets attached when a Renderer is available —
  // see Phase 3 where this is finalized in WorldCanvas.tsx. The two-step
  // setup is required because KTX2 needs a WebGLRenderer to detect
  // device-supported transcode targets.

  cachedGltf = gltf;
  return gltf;
}

/** Attach KTX2 once we have an actual renderer. Called from WorldCanvas. */
export function attachKtx2(renderer: THREE.WebGLRenderer) {
  const loader = getGltfLoader();
  // @ts-expect-error - dracoLoader exposes setKTX2Loader via gltf instance
  if (loader.ktx2Loader) return;

  const ktx2 = new KTX2Loader()
    .setTranscoderPath('https://unpkg.com/three@0.169.0/examples/jsm/libs/basis/')
    .detectSupport(renderer);
  loader.setKTX2Loader(ktx2);
}

/**
 * Resolve a model URL — small models live in /public/models, large ones
 * are referenced via the asset CDN env var. The env var stays empty in
 * dev and gets set in Vercel for production deploys.
 */
export function modelUrl(filename: string): string {
  const cdn = process.env.NEXT_PUBLIC_ASSET_CDN;
  if (cdn && cdn.length > 0) {
    return `${cdn.replace(/\/$/, '')}/models/${filename}`;
  }
  return `/models/${filename}`;
}

/** Same pattern for HDRIs. */
export function hdriUrl(filename: string): string {
  const cdn = process.env.NEXT_PUBLIC_ASSET_CDN;
  if (cdn && cdn.length > 0) {
    return `${cdn.replace(/\/$/, '')}/hdri/${filename}`;
  }
  return `/hdri/${filename}`;
}

// Color helpers — convert the design-token hex codes to THREE.Color so
// 3D fog / light / material code can reach the brand colors without
// hard-coding hex strings everywhere.
export const brandColors = {
  night: new THREE.Color('#0B0F14'),
  cream: new THREE.Color('#F2E9D8'),
  amber: new THREE.Color('#C77A3A'),
  forest: new THREE.Color('#2C4A2E'),
};
