import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/sections/Footer';
import { ACCOMMODATIONS } from '@/content/accommodations';

export const metadata = { title: 'Lodging' };

export default function LodgingPage() {
  return (
    <>
      <Nav />
      <main className="scene">
        <header className="max-w-[60rem] mb-16">
          <p className="eyebrow text-cream/55 mb-4">Lodging</p>
          <h1 className="font-display text-display text-cream leading-[0.95]">
            Four places to wake up.
          </h1>
        </header>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {ACCOMMODATIONS.map((a) => (
            <li key={a.id} className="border border-cream/10 rounded-md p-8 bg-night/40">
              <p className="eyebrow text-amber/80 mb-2">{a.kind}</p>
              <h2 className="font-display text-title text-cream">{a.name}</h2>
              <p className="editorial mt-4">{a.hook}</p>
              <p className="mt-3 font-sans text-caption text-cream/55">{a.capacity}</p>
              <a href="/#book" className="cta-primary mt-6">
                {a.ctaLabel}
              </a>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
