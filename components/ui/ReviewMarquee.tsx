'use client';

import { cn } from '@/lib/utils';

/**
 * Two-row infinite-scroll marquee of 5-star review quote cards.
 * Row 1 scrolls right-to-left, Row 2 scrolls left-to-right, at
 * slightly different speeds so they don't pulse in unison.
 *
 * Quotes are extracted from real testimonials in content/reviews.ts —
 * short phrases pulled directly from the verbatim Felicia / Sabrina /
 * Spencer reviews so nothing is fabricated.
 */

type Quote = {
  text: string;
  author: string;
};

const ROW_A: Quote[] = [
  { text: 'Serenity. We loved the serenity of being out in the woods with nature.', author: 'Felicia' },
  { text: 'It’s just you and nature.', author: 'Sabrina' },
  { text: 'Anthony was an amazing host.', author: 'Spencer' },
  { text: 'The sky was beautiful at night.', author: 'Felicia' },
  { text: 'The showers are so beautifully made — we want to go back just to experience them.', author: 'Sabrina' },
  { text: 'Anthony and Barb were so inviting.', author: 'Sabrina' },
];

const ROW_B: Quote[] = [
  { text: 'The location is wonderful and quiet.', author: 'Felicia' },
  { text: 'There is also a dog named Chief who is such a sweetheart.', author: 'Spencer' },
  { text: 'Barb’s cookies are great.', author: 'Felicia' },
  { text: 'Amazing people, place, and experience for anyone.', author: 'Sabrina' },
  { text: 'It is a great escape from a busy city or regular neighborhood.', author: 'Sabrina' },
  { text: 'Would definitely recommend to anyone wanting a nice night to camp.', author: 'Spencer' },
];

function Stars() {
  return (
    <span aria-label="5 out of 5 stars" className="text-amber tracking-[0.18em] text-[0.95rem]">
      ★★★★★
    </span>
  );
}

function Card({ q }: { q: Quote }) {
  return (
    <div
      className="flex-shrink-0 w-[20rem] md:w-[24rem] rounded-xl p-6 mx-3 shadow-[0_10px_30px_-12px_rgba(31,46,31,0.35)]"
      style={{ background: '#FFFFFF', border: '1px solid rgba(31,46,31,0.12)' }}
    >
      <Stars />
      <p
        className="font-display text-lede mt-3 leading-snug"
        style={{ color: '#1F2E1F' }}
      >
        &ldquo;{q.text}&rdquo;
      </p>
      <p className="eyebrow text-amber mt-4">— {q.author}</p>
    </div>
  );
}

function MarqueeRow({
  items,
  direction = 'left',
  durationSeconds = 60,
}: {
  items: Quote[];
  direction?: 'left' | 'right';
  durationSeconds?: number;
}) {
  // Duplicate the items so the loop seam is invisible
  const loop = [...items, ...items];
  const animationName = direction === 'left' ? 'marquee-left' : 'marquee-right';

  return (
    <div
      className="relative overflow-hidden w-full"
      // Edge-fade mask so cards softly enter/exit at the screen edges
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
      }}
    >
      <div
        className="flex w-max"
        style={{
          animation: `${animationName} ${durationSeconds}s linear infinite`,
        }}
      >
        {loop.map((q, i) => (
          <Card key={i} q={q} />
        ))}
      </div>
    </div>
  );
}

export function ReviewMarquee({ className }: { className?: string }) {
  return (
    <div className={cn('relative w-full space-y-4 py-2', className)}>
      <MarqueeRow items={ROW_A} direction="left" durationSeconds={70} />
      <MarqueeRow items={ROW_B} direction="right" durationSeconds={85} />

      {/* The keyframes are inlined so the component is self-contained —
          works without touching globals.css. Each row's animation
          translates by exactly half its width (since we duplicated
          the items), making the loop seamless. */}
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-row {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
