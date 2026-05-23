'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { sound } from '@/lib/sound';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Scene 5 — The Lake. Watts Bar at sunset, pontoon silhouette drifting.
 * Two CTAs side-by-side (pontoon + island camping), not buried as one.
 *
 * Sound crossfade on entry: the forest ambient bed quiets and the lake
 * ambient (water lap + distant boat motor) fades in.
 */
export function SceneLake() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fired = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll<HTMLElement>('[data-lake-anim]');

    if (reduced) {
      items.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    const trig = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 65%',
      end: 'bottom 35%',
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.10,
          ease: 'power3.out',
        });
        if (!fired.current) {
          sound.fade('ambient-forest', 0.32, 0.06, 2000);
          sound.fade('ambient-lake', 0, 0.2, 2200);
          sound.fade('water-lap', 0, 0.18, 2400);
          // Distant motor cue near scene's end — fires once
          setTimeout(() => sound.play('pontoon-distant'), 6500);
          fired.current = true;
        }
      },
      onLeaveBack: () => {
        gsap.to(items, { opacity: 0, y: 28, duration: 0.6, ease: 'power2.in' });
        sound.fade('ambient-lake', 0.2, 0, 1400);
        sound.fade('water-lap', 0.18, 0, 1400);
        sound.fade('ambient-forest', 0.06, 0.18, 1400);
        fired.current = false;
      },
    });

    gsap.set(items, { opacity: 0, y: 28 });

    return () => { trig.kill(); };
  }, [reduced]);

  return (
    <section id="lake" ref={ref} className="scene flex items-end" data-scene="lake">
      <div className="relative z-[var(--z-content)] max-w-[60rem]">
        <p data-lake-anim className="eyebrow text-cream/75 mb-4">On the water</p>
        <h2 data-lake-anim className="font-display text-display text-cream leading-[0.95]">
          Watts Bar Lake.<br />Twenty minutes from the property.
        </h2>
        <p data-lake-anim className="editorial mt-6 text-cream">
          Captain Anthony at the helm. The pontoon waits at the dock.
          Bring your tent if you want to stay the night on the island.
        </p>
        <div data-lake-anim className="mt-10 flex flex-col md:flex-row gap-6 md:gap-12">
          <a
            href="https://fareharbor.com/embeds/book/awakeningadventures/items/562474/calendar/2026/05/?flow=1217241&language=en-us&full-items=yes&back=https://awakeningadventuresllc.com/island-sunset-pontoon-boat-excursions-on-watts-bar-lake/&g4=yes"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-primary"
          >
            Book a sunset pontoon
          </a>
          <a
            href="mailto:support@awakeningadventuresllc.com?subject=Watts%20Bar%20Lake%20Island%20Camping%20Trip&body=Hi%20Anthony%2C%0A%0AI%27d%20like%20to%20book%20an%20island%20camping%20trip%20on%20Watts%20Bar%20Lake.%20A%20few%20details%3A%0A%0ADates%20I%27m%20considering%3A%0AGroup%20size%3A%0AQuestions%3A%0A%0AThanks%21"
            className="cta-primary"
          >
            Reserve the island campsite
          </a>
        </div>
        <p data-lake-anim className="font-sans text-caption text-cream/70 mt-4">
          Lodging guests get $50 off every excursion.
        </p>
      </div>
    </section>
  );
}
