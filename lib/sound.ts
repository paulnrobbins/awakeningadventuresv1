/**
 * Sound layer for the inhabitable world.
 *
 * Tier 3 World-Building Pattern 5: ambient bed continuously, interaction
 * sounds on key hovers, mute toggle visible in the first 2 seconds.
 *
 * Howler.js handles cross-browser audio + iOS unlock + spatial audio.
 * State is exposed as a simple subscribe/publish singleton so the
 * MuteToggle UI and any in-3D positional audio share one source of
 * truth without React context overhead during scroll.
 *
 * Asset files are loaded lazily — calling registerCue() does NOT play;
 * it preloads the buffer so the cue is ready when the scene scrubs in.
 *
 * No music bed by policy (see Phase 1 brief — Anthony's caption rule
 * for video is "no music bed", and the site mirrors that restraint).
 */

import { Howl, Howler } from 'howler';

export type SceneSoundKey =
  | 'ambient-forest'
  | 'ambient-lake'
  | 'crickets'
  | 'fire-crackle'
  | 'water-lap'
  | 'pontoon-distant'
  | 'bird-call'
  | 'wind-trees'
  | 'ui-whoosh';

interface CueConfig {
  src: string[];          // multiple sources for codec fallback
  loop?: boolean;
  volume?: number;
  rate?: number;
  preload?: boolean;
  html5?: boolean;
}

// Registry of every cue the build expects. Files land in /public/sound
// during Phase 3+. Missing files at runtime degrade silently — never
// throw, never block render.
const CUE_REGISTRY: Record<SceneSoundKey, CueConfig> = {
  'ambient-forest':   { src: ['/sound/ambient-forest.mp3'],   loop: true, volume: 0.18, html5: true },
  'ambient-lake':     { src: ['/sound/ambient-lake.mp3'],     loop: true, volume: 0.18, html5: true },
  'crickets':         { src: ['/sound/crickets.mp3'],         loop: true, volume: 0.12, html5: true },
  'fire-crackle':     { src: ['/sound/fire-crackle.mp3'],     loop: true, volume: 0.22 },
  'water-lap':        { src: ['/sound/water-lap.mp3'],        loop: true, volume: 0.15 },
  'pontoon-distant':  { src: ['/sound/pontoon-distant.mp3'],  loop: false, volume: 0.10 },
  'bird-call':        { src: ['/sound/bird-call.mp3'],        loop: false, volume: 0.20 },
  'wind-trees':       { src: ['/sound/wind-trees.mp3'],       loop: true, volume: 0.10, html5: true },
  'ui-whoosh':        { src: ['/sound/ui-whoosh.mp3'],        loop: false, volume: 0.35 },
};

const cues = new Map<SceneSoundKey, Howl>();
let muted = true; // start muted — visitor must consent to audio
const subscribers = new Set<(muted: boolean) => void>();

function ensureCue(key: SceneSoundKey): Howl {
  const existing = cues.get(key);
  if (existing) return existing;
  const cfg = CUE_REGISTRY[key];
  const howl = new Howl({
    src: cfg.src,
    loop: cfg.loop ?? false,
    volume: cfg.volume ?? 0.2,
    rate: cfg.rate ?? 1,
    html5: cfg.html5 ?? false,
    preload: cfg.preload ?? true,
    onloaderror: () => { /* silent — missing assets degrade gracefully */ },
  });
  cues.set(key, howl);
  return howl;
}

export const sound = {
  /** Play a cue. Honors mute. Returns the underlying Howler sound ID. */
  play(key: SceneSoundKey): number | undefined {
    if (muted) return undefined;
    return ensureCue(key).play();
  },

  /** Stop a cue immediately. */
  stop(key: SceneSoundKey) {
    cues.get(key)?.stop();
  },

  /** Fade a cue in or out — used by Scene components on enter/exit. */
  fade(key: SceneSoundKey, from: number, to: number, durationMs = 1200) {
    const howl = ensureCue(key);
    if (muted) {
      howl.volume(0);
      return;
    }
    if (!howl.playing()) howl.play();
    howl.fade(from, to, durationMs);
  },

  /** Preload without playing — call on Provider mount. */
  preload(keys: SceneSoundKey[]) {
    keys.forEach(ensureCue);
  },

  /** Global mute toggle. */
  setMuted(next: boolean) {
    muted = next;
    Howler.mute(next);
    subscribers.forEach((cb) => cb(next));
  },

  isMuted(): boolean {
    return muted;
  },

  /** Subscribe to mute-state changes for the MuteToggle UI. */
  subscribe(cb: (muted: boolean) => void) {
    subscribers.add(cb);
    return () => { subscribers.delete(cb); };
  },
};
