/**
 * Single source of truth for GSAP plugin registration and default eases.
 * Import this once at the top of Providers.tsx; never register plugins
 * inline in components — duplicate registration logs warnings and
 * doubles the size of the GSAP timeline graph in dev tools.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function ensureGsap() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Cinematic default — matches --ease-cinematic in tokens.css so DOM
  // animations and GSAP-driven 3D moves feel continuous.
  gsap.defaults({
    ease: 'power3.out',
    duration: 1.2,
  });

  // ScrollTrigger defaults — Lenis owns scroll, so we feed it the
  // proxy in lib/lenis.ts. Pinning markers stay off in production.
  ScrollTrigger.defaults({
    markers: process.env.NODE_ENV === 'development' && false, // flip to true while authoring
  });

  registered = true;
}

export { gsap, ScrollTrigger };
