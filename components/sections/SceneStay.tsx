'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { ACCOMMODATIONS } from '@/content/accommodations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Scene 3 — Stay.
 *
 * The camera (CameraRig) does the heavy lift here: as the visitor
 * scrolls through this section, the camera walks past each of the four
 * accommodations in their actual property positions.
 *
 * The DOM overlay surfaces one accommodation caption at a time, fading
 * the previous one out as the next one comes in. Each caption has a
 * specific CTA — never "Learn More."
 *
 * To pace the camera with the DOM, the section is 400vh tall and each
 * accommodation owns a 100vh slice. GSAP ScrollTrigger pairs the active
 * caption with the camera-rig's progress range for that accommodation.
 */
export function SceneStay() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll<HTMLElement>('[data-stay-item]');
    if (!items.length) return;

    if (reduced) {
      items.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    const triggers: ScrollTrigger[] = [];

    items.forEach((item, idx) => {
      // Each accommodation caption fades in as it enters the viewport and
      // fades out as the next one approaches.
      const st = ScrollTrigger.create({
        trigger: item,
        start: 'top 80%',
        end: 'bottom 30%',
        toggleActions: 'play reverse play reverse',
        onEnter: () => gsap.to(item, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }),
        onLeave: () => gsap.to(item, { opacity: 0, y: -20, duration: 0.6, ease: 'power2.in' }),
        onEnterBack: () => gsap.to(item, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }),
        onLeaveBack: () => gsap.to(item, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.in' }),
      });
      gsap.set(item, { opacity: 0, y: 32 });
      triggers.push(st);
    });

    return () => { triggers.forEach((t) => t.kill()); };
  }, [reduced]);

  return (
    <section
      id="stay"
      ref={ref}
      className="relative"
      data-scene="stay"
    >
      {/* Outer wrapper keeps the section tall enough that the camera can
          walk through all four accommodations in a comfortable pace.
          400vh = ~4 screens of scroll for the Stay range. */}
      <div className="relative min-h-[400vh]">
        <p className="eyebrow text-cream/55 mb-4 sticky top-32 z-[var(--z-content)] px-section-x">
          Stay
        </p>

        {ACCOMMODATIONS.map((a, i) => (
          <article
            key={a.id}
            data-stay-item
            data-accom={a.id}
            className="
              sticky top-0 min-h-screen flex items-center
              px-section-x
            "
            style={{
              // Each accommodation lives in its own 100vh stickied frame
              // but they all stack at the same top — only opacity changes.
              top: 0,
            }}
          >
            <div
              className={
                i % 2 === 0
                  ? 'max-w-[36rem] ml-0'
                  : 'max-w-[36rem] ml-auto text-right'
              }
            >
              <p className="eyebrow text-amber/80 mb-3">{a.kind}</p>
              <h3 className="font-display text-display text-cream leading-[0.95]">
                {a.name}
              </h3>
              <p className="editorial mt-6">{a.hook}</p>
              <p className="mt-3 font-sans text-caption text-cream/55">
                {a.capacity}
              </p>
              <a
                href={process.env.NEXT_PUBLIC_FAREHARBOR_URL ?? '#book'}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-primary mt-8"
              >
                {a.ctaLabel}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
