'use client';

import { BookingCard3D } from './BookingCard3D';
import { ACCOMMODATIONS } from '@/content/accommodations';

/**
 * Booking stage — Scene 8's four floating glass cards.
 * Positioned in a gentle arc so the camera's hero-return composition
 * frames all four cleanly.
 */
export function BookingStage() {
  const fareharbor = process.env.NEXT_PUBLIC_FAREHARBOR_URL ?? '#';

  // Arc positions — slight Z-depth variation per card so depth-of-field
  // post effect picks up on it.
  const positions: [number, number, number][] = [
    [-4.5, 1.8, -1.0],
    [-1.55, 1.95, -0.4],
    [1.55, 1.95, -0.4],
    [4.5, 1.8, -1.0],
  ];

  return (
    <group>
      {ACCOMMODATIONS.map((a, i) => (
        <BookingCard3D
          key={a.id}
          position={positions[i]}
          accomName={a.name}
          accomKind={a.kind}
          capacity={a.capacity}
          ctaLabel={a.ctaLabel}
          hookText={a.hook}
          bookingUrl={fareharbor}
          phase={i / 4}
        />
      ))}
    </group>
  );
}
