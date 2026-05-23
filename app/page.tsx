import { WorldCanvasClient } from '@/components/three/WorldCanvasClient';
import { Nav } from '@/components/layout/Nav';
import { PreloadGate } from '@/components/layout/PreloadGate';
import { MuteToggle } from '@/components/ui/MuteToggle';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { ErrorCatcher } from '@/components/ui/ErrorCatcher';

import { SceneHero } from '@/components/sections/SceneHero';
import { SceneProperty } from '@/components/sections/SceneProperty';
import { SceneStay } from '@/components/sections/SceneStay';
import { SceneTrails } from '@/components/sections/SceneTrails';
import { SceneLake } from '@/components/sections/SceneLake';
import { SceneWelcome } from '@/components/sections/SceneWelcome';
import { SceneGroups } from '@/components/sections/SceneGroups';
import { SceneBook } from '@/components/sections/SceneBook';
import { Footer } from '@/components/sections/Footer';

/**
 * Home — the entire inhabitable world, top to bottom.
 * Phase 2: scenes render as DOM-only placeholders so layout, typography,
 * and content are real and verifiable. Phase 3+ adds the 3D world
 * underneath (the WorldCanvas is already mounted; it just renders an
 * empty night background until the Stargazer arrives).
 */
export default function HomePage() {
  return (
    <>
      <PreloadGate />
      <WorldCanvasClient />
      <Nav />
      <main className="relative z-[var(--z-content)]">
        <SceneHero />
        <SceneProperty />
        <SceneStay />
        <SceneTrails />
        <SceneLake />
        <SceneWelcome />
        <SceneGroups />
        <SceneBook />
      </main>
      <Footer />
      <MuteToggle />
      <CustomCursor />
      <ErrorCatcher />
    </>
  );
}
