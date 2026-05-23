/**
 * Lenis smooth scroll, wired into GSAP ScrollTrigger so every pinned
 * scene scrubs against the same scroll timeline.
 *
 * Lenis owns scroll; GSAP reads from it via the scrollerProxy. Native
 * scroll-behavior is disabled in tokens.css so nothing fights this.
 */

import Lenis from 'lenis';
import { ScrollTrigger } from './gsap';

let instance: Lenis | null = null;
let rafId: number | null = null;

export function initLenis() {
  if (instance || typeof window === 'undefined') return instance;

  instance = new Lenis({
    duration: 1.15,
    // Lenis default easing — cinematic and forgiving, not lurchy.
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.4,
    // Lower lerp = more cinematic, higher = snappier. 0.1 is the sweet spot.
    lerp: 0.1,
  });

  // Feed every Lenis tick into ScrollTrigger so pinned 3D scenes
  // stay synced with smooth scroll.
  instance.on('scroll', ScrollTrigger.update);

  // The RAF loop drives Lenis. GSAP ticker piggy-backs.
  const raf = (time: number) => {
    instance?.raf(time * 1000);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame((t) => raf(t / 1000));

  return instance;
}

export function destroyLenis() {
  if (rafId !== null) cancelAnimationFrame(rafId);
  instance?.destroy();
  instance = null;
  rafId = null;
}

export function getLenis() {
  return instance;
}
