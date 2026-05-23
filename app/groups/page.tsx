import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/sections/Footer';
import { FULL_PROPERTY_BOOKING_URL } from '@/content/accommodations';

export const metadata = { title: 'Group retreats' };

const AMENITIES: { label: string; href?: string }[] = [
  { label: '4 forest dwellings to choose from on 42 acres' },
  { label: 'Private treehouse shower' },
  { label: 'Mountain prayer shelter' },
  {
    label: '3+ miles of trails on the property',
    href: 'https://awakeningadventuresllc.com/guided-spiritual-prayer-hikes-near-grandviewtn/',
  },
  { label: 'Campfire wood and 10+ fire pits to choose from for your gathering' },
  { label: 'Centralized outdoor kitchen, dining area and fire-pit pagoda' },
  { label: 'Hammocks and tree swings scattered around' },
  {
    label: 'Groups receive discounts on Island Sunset Pontoon Boat Cruises — or a custom lake-day picnic experience',
    href: 'https://awakeningadventuresllc.com/island-sunset-pontoon-boat-excursions-on-watts-bar-lake/',
  },
];

export default function GroupsPage() {
  return (
    <>
      <Nav />
      <main className="scene">
        <header className="max-w-[60rem]">
          <p className="eyebrow text-cream/75 mb-4">Set apart</p>
          <h1 className="font-display text-display text-cream leading-[0.95]">
            Reserve the whole forty-two acres for your small church.
          </h1>
          <p className="editorial mt-8 text-cream">
            Pastors and small-group leaders book the property end to end.
            We help you build the schedule, or we get out of the way so
            you can build your own. Two-night minimum on group bookings.
          </p>
        </header>

        <section className="mt-16 max-w-[68rem]">
          <p className="eyebrow text-amber mb-6">What&rsquo;s included</p>
          <ul className="space-y-3">
            {AMENITIES.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span aria-hidden="true" className="font-display text-amber mt-1">·</span>
                <span className="font-sans text-body text-cream">
                  {a.href ? (
                    <a
                      href={a.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-amber transition-colors"
                    >
                      {a.label}
                    </a>
                  ) : (
                    a.label
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 flex flex-col md:flex-row gap-8">
          <a
            href={FULL_PROPERTY_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-primary"
          >
            Reserve the whole 42 acres
          </a>
          <a
            href="mailto:support@awakeningadventuresllc.com"
            className="cta-primary"
          >
            Talk to Anthony first
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
