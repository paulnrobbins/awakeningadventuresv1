'use client';

import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { cn } from '@/lib/utils';

/**
 * Scene 0 — Loading as Theater (World-Building Pattern 6).
 *
 * Real progress from R3F's central DefaultLoadingManager via drei's
 * useProgress hook — covers GLTF, HDRI, textures, anything pulled
 * through Three.js loaders. The loader stays mounted until BOTH
 * progress hits 100 AND a minimum dwell time has passed (so the loader
 * doesn't flash for users on fiber).
 *
 * The headline ("Step out of the light pollution.") fades up at ~30%
 * progress per the Phase 1 brief.
 */
const MIN_DWELL_MS = 1100;

export function PreloadGate() {
  const { progress, active } = useProgress();
  const [mountedAt] = useState(() => (typeof performance !== 'undefined' ? performance.now() : 0));
  const [hidden, setHidden] = useState(false);
  const [showHeadline, setShowHeadline] = useState(false);

  // Headline fades up at ~30% progress
  useEffect(() => {
    if (!showHeadline && progress >= 30) setShowHeadline(true);
  }, [progress, showHeadline]);

  // Hide once everything is loaded AND we've shown the gate long enough
  useEffect(() => {
    if (active || progress < 100) return;
    const elapsed = performance.now() - mountedAt;
    const wait = Math.max(0, MIN_DWELL_MS - elapsed);
    const t = setTimeout(() => setHidden(true), wait);
    return () => clearTimeout(t);
  }, [active, progress, mountedAt]);

  return (
    <div
      aria-hidden={hidden}
      role="status"
      aria-live="polite"
      className={cn(
        'fixed inset-0 z-[var(--z-loader)] bg-night',
        'flex flex-col items-center justify-center',
        'transition-opacity duration-[900ms] ease-cinematic',
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100',
      )}
    >
      {/* Progress arc — top-right per the brief */}
      <div
        className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-3 eyebrow text-cream/70"
      >
        <span>{Math.min(99, Math.round(progress)).toString().padStart(2, '0')}</span>
        <div className="w-24 h-px bg-cream/15 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-amber"
            style={{ width: `${Math.min(100, progress)}%`, transition: 'width 300ms ease-out' }}
          />
        </div>
      </div>

      <p
        className={cn(
          'font-display text-display text-amber max-w-[18ch] text-center px-6',
          'transition-opacity duration-1000 ease-cinematic',
          showHeadline ? 'opacity-100' : 'opacity-0',
        )}
      >
        Step out of the light pollution.
      </p>

      <span className="sr-only">Loading…</span>
    </div>
  );
}
