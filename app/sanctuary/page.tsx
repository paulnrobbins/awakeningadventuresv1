import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/sections/Footer';

export const metadata = { title: 'Sanctuary' };

/**
 * Phase 2 stub. The scroll-world on `/` IS the primary sanctuary
 * experience. This page exists for IA parity with the current site and
 * for visitors who deep-link from search results.
 */
export default function SanctuaryPage() {
  return (
    <>
      <Nav />
      <main className="scene flex flex-col gap-12">
        <header className="max-w-[60rem]">
          <p className="eyebrow text-cream/55 mb-4">Sanctuary</p>
          <h1 className="font-display text-display text-cream leading-[0.95]">
            Forty-two acres on the Cumberland Plateau.
          </h1>
          <p className="editorial mt-8">
            A dead-end road, three miles of trails, a rock bridge across a
            wet-weather creek, and a perspective platform on the ridge.
            The property is the brand. Walk it slowly.
          </p>
        </header>
        <p className="font-sans text-caption text-cream/45 mt-12">
          More on this page next phase — site is mid-build.
        </p>
      </main>
      <Footer />
    </>
  );
}
