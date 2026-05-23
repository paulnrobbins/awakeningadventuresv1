/**
 * The four accommodations on the property. Single source of truth —
 * referenced by Scene 3 (Stay) and Scene 8 (Book) so a copy edit
 * happens in exactly one place.
 *
 * Specifics (capacity, amenities) are pulled from the existing site's
 * lodging gallery during Phase 4. Where the snapshot says "TBD" we leave
 * placeholders that Paul confirms with Anthony at handoff.
 */

export type Accommodation = {
  id: 'stargazer' | 'driftwood' | 'homestead' | 'serene-seven';
  name: string;
  kind: string;
  hook: string;            // the single sentence that sells it
  capacity: string;
  bookingId?: string;      // FareHarbor item identifier when Anthony confirms
  heroImage: string;       // path inside /public/images
  ctaLabel: string;        // specific, not generic
};

export const ACCOMMODATIONS: Accommodation[] = [
  {
    id: 'stargazer',
    name: 'Stargazer',
    kind: 'Clear plexiglass cabin',
    hook: 'A glass house under the Tennessee night sky. You sleep beneath the stars without the cold floor.',
    capacity: 'Sleeps 2',
    heroImage: '/images/stargazer-hero.jpg',
    ctaLabel: 'Book the Stargazer',
  },
  {
    id: 'driftwood',
    name: 'Driftwood',
    kind: 'Treehouse',
    hook: 'Built into the canopy. Wind moves the platform a little when the upper trees shift.',
    capacity: 'Sleeps 2–3',
    heroImage: '/images/driftwood-hero.jpg',
    ctaLabel: 'Book Driftwood',
  },
  {
    id: 'homestead',
    name: 'Homestead',
    kind: 'Glamping tent',
    hook: 'Wood-burning stove inside the canvas. The tent smells like the fire by morning.',
    capacity: 'Sleeps 2–4',
    heroImage: '/images/homestead-hero.jpg',
    ctaLabel: 'Book Homestead',
  },
  {
    id: 'serene-seven',
    name: 'Serene Seven',
    kind: 'Glamping tent',
    hook: 'Open prairie pitch. The night sky here is the best on the property.',
    capacity: 'Sleeps 2–4',
    heroImage: '/images/serene-seven-hero.jpg',
    ctaLabel: 'Book Serene Seven',
  },
];
