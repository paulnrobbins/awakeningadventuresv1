import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/sections/Footer';

export const metadata = { title: 'Excursions' };

export default function ExcursionsPage() {
  return (
    <>
      <Nav />
      <main className="scene">
        <header className="max-w-[60rem] mb-12">
          <p className="eyebrow text-cream/55 mb-4">Excursions</p>
          <h1 className="font-display text-display text-cream leading-[0.95]">
            Watts Bar Lake. Twenty minutes from the property.
          </h1>
          <p className="editorial mt-8">
            Captain Anthony at the helm. Sunset pontoon excursions and a
            boat-in island campsite outfitter for guests who want a night
            out on the water.
          </p>
        </header>

        <div className="mt-12 flex flex-col md:flex-row gap-8">
          <a href="/#book" className="cta-primary">Book a sunset pontoon</a>
          <a href="/#book" className="cta-primary">Reserve the island campsite</a>
          <a href="/#trails" className="cta-primary">Ask about prayer hikes</a>
        </div>
      </main>
      <Footer />
    </>
  );
}
