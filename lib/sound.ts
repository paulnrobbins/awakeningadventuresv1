/**
 * Sound layer. Howler is lazy-loaded on first use so a Howler import
 * failure cannot crash the page at module-evaluation time.
 *
 * Tier 3 World-Building Pattern 5: ambient bed continuously, interaction
 * sounds on key hovers, mute toggle visible in the first 2 seconds.
 *
 * Asset files load lazily — calling registerCue() does NOT play.
 * Missing files at runtime degrade silently — never throw, never
 * block render.
 *
 * No music bed by policy (see Phase 1 brief).
 */

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
  src: string[];
  loop?: boolean;
  volume?: number;
  rate?: number;
  preload?: boolean;
  html5?: boolean;
}

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

// Howler is lazy-imported — never touches `window` until first call
let HowlerLib: typeof import('howler') | null = null;
const cues = new Map<SceneSoundKey, unknown>();
let muted = true;
const subscribers = new Set<(muted: boolean) => void>();

async function getHowler(): Promise<typeof import('howler') | null> {
  if (HowlerLib) return HowlerLib;
  if (typeof window === 'undefined') return null;
  try {
    HowlerLib = await import('howler');
    return HowlerLib;
  } catch (err) {
    console.warn('[sound] howler.js failed to load, sound disabled:', err);
    return null;
  }
}

async function ensureCue(key: SceneSoundKey) {
  const existing = cues.get(key);
  if (existing) return existing as InstanceType<NonNullable<typeof HowlerLib>['Howl']>;
  const lib = await getHowler();
  if (!lib) return null;
  const cfg = CUE_REGISTRY[key];
  const howl = new lib.Howl({
    src: cfg.src,
    loop: cfg.loop ?? false,
    volume: cfg.volume ?? 0.2,
    rate: cfg.rate ?? 1,
    html5: cfg.html5 ?? false,
    preload: cfg.preload ?? true,
    onloaderror: () => { /* silent */ },
  });
  cues.set(key, howl);
  return howl;
}

export const sound = {
  play(key: SceneSoundKey): void {
    if (muted) return;
    ensureCue(key).then((howl) => { howl?.play(); });
  },

  stop(key: SceneSoundKey) {
    const c = cues.get(key) as { stop?: () => void } | undefined;
    c?.stop?.();
  },

  fade(key: SceneSoundKey, from: number, to: number, durationMs = 1200) {
    ensureCue(key).then((howl) => {
      if (!howl) return;
      if (muted) {
        howl.volume(0);
        return;
      }
      if (!howl.playing()) howl.play();
      howl.fade(from, to, durationMs);
    });
  },

  preload(keys: SceneSoundKey[]) {
    keys.forEach((k) => { ensureCue(k); });
  },

  setMuted(next: boolean) {
    muted = next;
    getHowler().then((lib) => { lib?.Howler.mute(next); });
    subscribers.forEach((cb) => cb(next));
  },

  isMuted(): boolean {
    return muted;
  },

  subscribe(cb: (muted: boolean) => void) {
    subscribers.add(cb);
    return () => { subscribers.delete(cb); };
  },
};
