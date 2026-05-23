'use client';

import { useEffect, useRef } from 'react';
import { useTouchPrimary } from '@/hooks/useResponsive';

/**
 * Custom cursor — single small fire-amber dot that lerps toward the
 * mouse position, plus a larger ring that lags slightly for the
 * "magnetic" feel award sites use.
 *
 * Disabled on touch devices entirely. Disabled in reduced-motion.
 *
 * The implementation uses pointer events on document so the cursor
 * follows even when the cursor is over the R3F canvas (which usually
 * captures pointer events).
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const touch = useTouchPrimary();

  useEffect(() => {
    if (touch) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Hide the native cursor on supporting browsers
    document.documentElement.style.cursor = 'none';

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;

    const handleMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleDown = () => {
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0) scale(0.85)`;
    };
    const handleUp = () => {
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0) scale(1)`;
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerdown', handleDown);
    window.addEventListener('pointerup', handleUp);

    let rafId = 0;
    const tick = () => {
      // Dot snaps very close to actual cursor — minimal lag
      dotX += (mouseX - dotX) * 0.65;
      dotY += (mouseY - dotY) * 0.65;
      // Ring follows tighter — still trails for the magnetic feel
      // but no longer reads as laggy
      ringX += (mouseX - ringX) * 0.32;
      ringY += (mouseY - ringY) * 0.32;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX - 3}px, ${dotY - 3}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointerup', handleUp);
      cancelAnimationFrame(rafId);
      document.documentElement.style.cursor = '';
    };
  }, [touch]);

  if (touch) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 w-9 h-9 rounded-full border border-cream/40 z-[100] mix-blend-difference transition-transform duration-200 ease-out"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-amber z-[101]"
        style={{ willChange: 'transform' }}
      />
    </>
  );
}
