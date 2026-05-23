import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/sections/Footer';

export const metadata = { title: 'Group retreats' };

export default function GroupsPage() {
  return (
    <>
      <Nav />
      <main className="scene">
        <header className="max-w-[60rem]">
          <p className="eyebrow text-cream/55 mb-4">Set apart</p>
          <h1 className="font-display text-display text-cream leading-[0.95]">
            Reserve the whole forty-two acres for your small church.
          </h1>
          <p className="editorial mt-8">
            Pastors and small-group leaders book the property end to end.
            We help you build the schedule, or we get out of the way so
            you can build your own. Two-night minimum on group bookings.
          </p>
          <a href="/#book" className="cta-primary mt-10">
            Plan a small-church retreat
          </a>
        </header>
      </main>
      <Footer />
    </>
  );
}
