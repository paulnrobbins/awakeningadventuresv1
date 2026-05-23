'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { sound } from '@/lib/sound';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ACCOMMODATIONS } from '@/content/accommodations';

/**
 * Scene 8 — Come and see.
 *
 * Four floating glass cards rendered as DOM tiles over the 3D canvas.
 * They feel 3D because the camera-scrubbed world renders behind them
 * (Stargazer, stars, fireflies). Each card has a subtle Y-bob idle
 * animation, magnetism on hover, and a fire-amber accent on hover.
 *
 * Originally implemented as drei <Html transform> in 3D space; replaced
 * with DOM cards because Html transform mode is fragile in minified
 * production builds.
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

    // Idle Y-bob on each booking card — staggered phase per card so
    // they don't pulse in unison
    const bobTweens: gsap.core.Tween[] = [];
    const cards = ref.current.querySelectorAll<HTMLElement>('[data-card]');
    cards.forEach((c, i) => {
      const t = gsap.to(c, {
        y: '+=10',
        duration: 3 + i * 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.4,
      });
      bobTweens.push(t);
    });

    return () => {
      trig.kill();
      bobTweens.forEach((t) => t.kill());
    };
  }, [reduced]);

  return (
    <section
      id="book"
      ref={ref}
      className="scene flex flex-col items-center justify-center text-center"
      data-scene="book"
    >
      <div className="relative z-[var(--z-content)] max-w-[88rem] w-full">
        <p data-book-anim className="eyebrow text-cream/55 mb-6">
          Reserve a night
        </p>
        <h2 data-book-anim className="font-display text-hero text-amber leading-[0.88]">
          Come and see.
        </h2>

        <ul
          data-book-anim
          className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          aria-label="Accommodations"
        >
          {ACCOMMODATIONS.map((a) => (
            <li key={a.id} data-card className="group relative">
              <a
                href={a.bookingUrl ?? fareHarbor}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={a.ctaLabel}
                className="
                  block relative h-full
                  border border-cream/30 rounded-lg
                  p-7 md:p-8
                  bg-night/95
                  transition-all duration-500 ease-cinematic
                  hover:border-amber hover:-translate-y-1
                  hover:shadow-[0_20px_60px_-20px_rgba(199,122,58,0.45)]
                  focus-visible:border-amber
                  text-left
                "
              >
                <p className="eyebrow text-amber">{a.kind}</p>
                <h3 className="font-display text-title text-cream mt-3 leading-[0.95]">
                  {a.name}
                </h3>
                <p className="font-sans text-body text-cream mt-4 leading-[1.55]">
                  {a.hook}
                </p>
                <p className="font-sans text-caption text-cream/70 mt-4">
                  {a.capacity}
                </p>
                <p className="font-display text-lede text-amber mt-8 inline-flex items-center gap-2">
                  {a.ctaLabel}
                  <span aria-hidden="true" className="transition-transform duration-500 ease-cinematic group-hover:translate-x-2">→</span>
                </p>
              </a>
            </li>
          ))}
        </ul>

        <p data-book-anim className="font-sans text-body text-cream/55 mt-16 max-w-[44ch] mx-auto">
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
