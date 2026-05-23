import { ImageResponse } from 'next/og';

/**
 * Open Graph image — generated at build time by Next's ImageResponse.
 * No PNG asset needed in /public; this route is hit by the bot crawlers.
 *
 * Composition: night background, oversized cream display headline,
 * fire-amber accent under it. No 3D rendered here (canvas → image is
 * outside Next/OG support); just typography that matches the site.
 */

export const runtime = 'edge';
export const alt = 'Awakening Adventures — Forty-two acres on the Cumberland Plateau';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '72px',
          background: '#0B0F14',
          fontFamily: 'serif',
          color: '#F2E9D8',
          position: 'relative',
        }}
      >
        {/* Star dots — purely cosmetic, drawn as positioned circles */}
        {Array.from({ length: 40 }).map((_, i) => {
          const x = (i * 137.5) % 1200;
          const y = (i * 89.3) % 360;
          const r = 1 + ((i * 7) % 3);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: r,
                height: r,
                borderRadius: '50%',
                background: '#F2E9D8',
                opacity: 0.6,
              }}
            />
          );
        })}

        <p style={{
          fontSize: 22,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color: '#C77A3A',
          marginBottom: 24,
        }}>
          Grandview, Tennessee
        </p>
        <p style={{
          fontSize: 96,
          lineHeight: 1.0,
          fontWeight: 600,
          color: '#F2E9D8',
          marginBottom: 24,
        }}>
          Because God is the
        </p>
        <p style={{
          fontSize: 96,
          lineHeight: 1.0,
          fontWeight: 600,
          color: '#F2E9D8',
          marginBottom: 24,
        }}>
          Greatest Adventure of ALL.
        </p>
        <p style={{
          fontSize: 28,
          color: '#F2E9D8',
          opacity: 0.7,
        }}>
          Forty-two acres on the Cumberland Plateau · Hosted by Anthony and Barb
        </p>
      </div>
    ),
    { ...size },
  );
}
