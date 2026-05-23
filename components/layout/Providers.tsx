'use client';

import { ReactNode, useEffect } from 'react';
import { ensureGsap } from '@/lib/gsap';
import { initLenis, destroyLenis } from '@/lib/lenis';
import { sound } from '@/lib/sound';

/**
 * Single client-side mount point for all the libraries that require
 * a browser: Lenis smooth scroll, GSAP + ScrollTrigger, Howler sound,
 * and any other future world-level providers.
 *
 * Wrapped around {children} inside app/layout.tsx so every Scene
 * component can rely on these being initialized.
 */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    ensureGsap();
    initLenis();
    sound.preload([
      'ambient-forest',
      'crickets',
      'wind-trees',
      'ui-whoosh',
    ]);

    return () => {
      destroyLenis();
    };
  }, []);

  return <>{children}</>;
}
