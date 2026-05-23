'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Minimal nav — fixed top, eyebrow type, fades out as the visitor
 * scrolls past the hero. Phase 3 wires the fade with GSAP ScrollTrigger.
 *
 * Anti-AI-tell check: no logo wordmark with a tagline subtitle, no
 * "MENU" hamburger label, no centered three-link grid. Just the brand
 * name and the booking CTA — visitor knows what every other word means
 * because the world tells them.
 */
const NAV_LINKS = [
  { href: '/#sanctuary', label: 'Sanctuary' },
  { href: '/#stay', label: 'Stay' },
  { href: '/#lake', label: 'Lake' },
  { href: '/#groups', label: 'Groups' },
];

export function Nav({ className }: { className?: string }) {
  return (
    <nav
      className={cn(
        'fixed inset-x-0 top-0 z-[var(--z-nav)]',
        'flex items-center justify-between',
        'px-6 py-5 md:px-10 md:py-7',
        'mix-blend-difference text-cream',
        className,
      )}
      aria-label="Primary"
    >
      <Link
        href="/"
        className="font-display text-lg tracking-tight leading-none"
      >
        Awakening Adventures
      </Link>

      <ul className="hidden md:flex items-center gap-8 eyebrow">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="transition-colors duration-500 ease-cinematic hover:text-amber"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <a
        href={process.env.NEXT_PUBLIC_FAREHARBOR_URL ?? '#book'}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'eyebrow border border-cream/40 px-4 py-2 rounded-full',
          'transition-colors duration-500 ease-cinematic',
          'hover:border-amber hover:text-amber',
        )}
      >
        Come and see
      </a>
    </nav>
  );
}
