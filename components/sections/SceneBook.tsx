'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { sound } from '@/lib/sound';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ACCOMMODATIONS } from '@/content/accommodations';

/**
 * Scene 8 — Come and see.
 *
 * The four floating glass cards live in the 3D WorldScene (BookingStage).
 * This DOM overlay supplies the headline + an accessible DOM fallback
 * list so screen readers, low-tier devices, and prefers-reduced-motion
 * users get fully usable links without needing the 3D cards.
 *
 * High-tier devices see the headline, then the cards float into focus
 * via BookingStage. Low-tier / reduced-motion users see the DOM tile
 * list (kept similar to Phase 2's version).
 */
export function SceneBook() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fired = useRef(false);
  const fareHarbor = process.env.NEXT_PUBLIC_FAREHARBOR_URL ?? '#';

  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll<HTMLElement>('[data-book-anim]');

    if (reduced) {
      items.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    const trig = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 70%',
      end: 'bottom 30%',
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: 'power3.out',
        });
        if (!fired.current) {
          sound.fade('crickets', 0.28, 0.18, 1400);
          sound.fade('wind-trees', 0.1, 0.18, 1400);
          fired.current = true;
        }
      },
      onLeaveBack: () => {
        gsap.to(items, { opacity: 0, y: 28, duration: 0.6, ease: 'power2.in' });
        fired.current = false;
      },
    });

    gsap.set(items, { opacity: 0, y: 28 });

    return () => { trig.kill(); };
  }, [reduced]);

  return (
    <section
      id="book"
      ref={ref}
      className="scene flex flex-col items-center justify-center text-center"
      data-scene="book"
    >
      <div className="relative z-[var(--z-content)] max-w-[80rem]">
        <p data-book-anim className="eyebrow text-cream/55 mb-6">
          Reserve a night
        </p>
        <h2 data-book-anim className="font-display text-hero text-amber leading-[0.88]">
          Come and see.
        </h2>

        {/* DOM fallback list — visible always for accessibility, but
            visually deprioritized on hi-tier where the 3D cards do the
            primary affordance. */}
        <ul
          data-book-anim
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-left"
          aria-label="Accommodations"
        >
          {ACCOMMODATIONS.map((a) => (
            <li
              key={a.id}
              className="group relative border border-cream/15 rounded-md p-6 backdrop-blur-sm bg-night/30 transition-colors duration-500 ease-cinematic hover:border-amber"
            >
              <p className="eyebrow text-amber/70">{a.kind}</p>
              <h3 className="font-display text-title text-cream mt-2">{a.name}</h3>
              <p className="font-sans text-caption text-cream/55 mt-2">{a.capacity}</p>
              <a
                href={fareHarbor}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={a.ctaLabel}
                className="absolute inset-0"
              >
                <span className="sr-only">{a.ctaLabel}</span>
              </a>
              <p className="font-sans text-body text-cream/85 mt-6">
                {a.ctaLabel} <span aria-hidden="true">→</span>
              </p>
            </li>
          ))}
        </ul>

        <p data-book-anim className="font-sans text-body text-cream/55 mt-12 max-w-[40ch] mx-auto">
          Booking opens a new tab to FareHarbor. You can also{' '}
          <a
            href="mailto:hello@awakeningadventuresllc.com"
            className="underline underline-offset-4 hover:text-amber transition-colors"
          >
            email Anthony directly
          </a>{' '}
          if you have questions first.
        </p>
      </div>
    </section>
  );
}
