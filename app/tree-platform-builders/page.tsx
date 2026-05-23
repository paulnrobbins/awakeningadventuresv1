import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/sections/Footer';

export const metadata = {
  title: 'Tree Platform Builders',
  description:
    'Hand-built tree platforms and decks across the Cumberland Plateau. On-site evaluation, tree assessment, and proposal — let’s make space to dwell in the trees.',
};

const RATE_LINES = [
  'Time plus materials, billed in 15-minute increments',
  '$50/hr for a 2-man crew on a platform less than 8 feet high',
  '$75/hr for a 2-man crew on a platform 8 to 20 feet high',
  'A small 8×12 platform with handrail averages about 20 hours; a 16×16 about 40 hours',
  'Estimates are $50–$100 payable at consultation and credited on your invoice',
];

const ESTIMATE_INCLUDES = [
  'On-site evaluation',
  'Tree assessment',
  'Project requirements review',
  'Written proposal',
];

const FEATURED = [
  { title: 'Magnolia tree playground', note: 'A multi-trunk magnolia turned into a play platform for the grandkids.' },
  { title: 'One-tree, two-post platform', note: 'A standard build pattern — one anchoring tree paired with two ground posts.' },
  { title: 'New Perspective', note: 'The 8×16 perspective platform built into two red oaks. Visit it on the property.' },
];

export default function TreePlatformBuildersPage() {
  return (
    <>
      <Nav />
      <main className="scene">
        <header className="max-w-[68rem]">
          <p className="eyebrow text-cream/75 mb-4">A side practice</p>
          <h1 className="font-display text-display text-cream leading-[0.95]">
            Tree Platform Builders.
          </h1>
          <p className="editorial mt-8 text-cream">
            We build tree platforms, decks, and elevated playgrounds across the
            Cumberland Plateau. Every job starts with the trees themselves — a
            real on-site walk, a real tree assessment, and a proposal you can hold
            in your hand before any board gets cut.
          </p>
        </header>

        {/* Rates */}
        <section className="mt-16 max-w-[68rem]">
          <p className="eyebrow text-amber mb-4">Rates &amp; details</p>
          <ul className="space-y-3">
            {RATE_LINES.map((line, i) => (
              <li key={i} className="flex items-start gap-3">
                <span aria-hidden="true" className="font-display text-amber mt-1">·</span>
                <span className="font-sans text-body text-cream">{line}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Estimate includes */}
        <section className="mt-12 max-w-[60rem]">
          <p className="eyebrow text-amber mb-4">Each estimate includes</p>
          <ul className="space-y-3">
            {ESTIMATE_INCLUDES.map((line, i) => (
              <li key={i} className="flex items-start gap-3">
                <span aria-hidden="true" className="font-display text-amber mt-1">·</span>
                <span className="font-sans text-body text-cream">{line}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Featured builds */}
        <section className="mt-16 max-w-[88rem]">
          <p className="eyebrow text-amber mb-6">Recent builds</p>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED.map((f, i) => (
              <li
                key={i}
                className="bg-night/85 border border-cream/20 rounded-xl p-6"
              >
                <h2 className="font-display text-title text-cream leading-tight">
                  {f.title}
                </h2>
                <p className="editorial mt-3 text-cream">{f.note}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-sans text-caption text-cream/70">
            See the full photo album on{' '}
            <a
              href="https://photos.app.goo.gl/iAwLZSK44ao9qiFu8"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-amber transition-colors"
            >
              Google Photos
            </a>
            .
          </p>
        </section>

        {/* CTA */}
        <section className="mt-20 max-w-[60rem]">
          <h2 className="font-display text-title text-cream leading-tight">
            Let&rsquo;s make space to dwell in the trees.
          </h2>
          <p className="editorial mt-4 text-cream">
            Reach out to schedule an on-site consultation. Bring your sketches,
            the dimensions you have in mind, or just the tree you&rsquo;re
            looking at. We&rsquo;ll come walk it with you.
          </p>
          <a
            href="mailto:support@awakeningadventuresllc.com"
            className="cta-primary mt-8"
          >
            Request a consultation
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
