'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { sound } from '@/lib/sound';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Scene 7 — Groups. Small-church retreat conversion path.
 * Highest-value audience per the snapshot.
 *
 * 3D world: camera pulls way back to show the entire property at
 * full darkness — every light source visible (treehouse + tents +
 * fire pit + Stargazer interior + perspective platform silhouette).
 *
 * Sound: fire crackle fades back to ambient bed (crickets dominant).
 */
export function SceneGroups() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fired = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll<HTMLElement>('[data-groups-anim]');

    if (reduced) {
      items.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    const trig = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 65%',
      end: 'bottom 30%',
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.14,
          ease: 'power3.out',
        });
        if (!fired.current) {
          sound.fade('fire-crackle', 0.28, 0.08, 1600);
          sound.fade('crickets', 0.12, 0.28, 2200);
          fired.current = true;
        }
      },
      onLeaveBack: () => {
        gsap.to(items, { opacity: 0, y: 32, duration: 0.6, ease: 'power2.in' });
        sound.fade('crickets', 0.28, 0.12, 1200);
        fired.current = false;
      },
    });

    gsap.set(items, { opacity: 0, y: 32 });

    return () => { trig.kill(); };
  }, [reduced]);

  return (
    <section
      id="groups"
      ref={ref}
      className="scene flex items-center"
      data-scene="groups"
    >
      <div className="relative z-[var(--z-content)] max-w-[68rem]">
        <div data-groups-anim className="readable-card inline-block">
          <p className="eyebrow text-cream/75 mb-6">Set apart</p>
          <h2 className="font-display text-display text-cream max-w-[24ch] leading-[0.95]">
            For pastors and small-group leaders planning a retreat.
          </h2>
          <p className="editorial mt-8 text-cream/90">
            The entire forty-two acres can be reserved for your group. We
            help you build the schedule, or we get out of the way so you
            can build your own. Two-night minimum on group bookings.
          </p>
          <a
            href={process.env.NEXT_PUBLIC_FAREHARBOR_URL ?? '#book'}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-primary mt-10"
          >
            Plan a small-church retreat
          </a>
        </div>
      </div>
    </section>
  );
}
