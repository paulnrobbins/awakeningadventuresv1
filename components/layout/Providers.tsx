'use client';

import { ReactNode, useEffect } from 'react';

/**
 * Client-side providers. Heavy libraries (Lenis, GSAP, Howler) are
 * imported inside the useEffect rather than at module top so any
 * import-time failure stays isolated — the rest of the page still
 * renders even if smooth scroll or audio cannot initialize.
 */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const [{ ensureGsap }, { initLenis, destroyLenis }, { sound }] = await Promise.all([
          import('@/lib/gsap'),
          import('@/lib/lenis'),
          import('@/lib/sound'),
        ]);

        ensureGsap();
        initLenis();
        sound.preload(['ambient-forest', 'crickets', 'wind-trees', 'ui-whoosh']);

        cleanup = () => destroyLenis();
      } catch (err) {
        console.warn('[Providers] init failed — site renders without smooth scroll / sound:', err);
      }
    })();

    return () => { cleanup?.(); };
  }, []);

  return <>{children}</>;
}
