import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Manrope } from 'next/font/google';
import './globals.css';

import { Providers } from '@/components/layout/Providers';

/**
 * Fonts are pulled at build time by next/font/google — no manual
 * .woff2 files in /public/fonts. Two variable fonts, both free, both
 * off the Pillar 1 blacklist (no Inter, Roboto, Arial, Space Grotesk,
 * Montserrat, Poppins, Lato), neither used on recent KDS projects
 * (Fraunces / Reckless Neue / Instrument Serif).
 *
 * Bricolage Grotesque (display) — variable grotesk with character,
 * opsz axis so the hero 16vw sizes get proper optical scaling.
 * Manrope (body) — humanist variable geometric. Cleaner than Inter,
 * warmer than General Sans, ships with all weights in one file.
 */

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['opsz', 'wdth'],
});

const body = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0B0F14',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://awakeningadventuresllc.com'),
  title: {
    default: 'Awakening Adventures — Forest sanctuary in Grandview, TN',
    template: '%s · Awakening Adventures',
  },
  description:
    'Forty-two acres of forest on the Cumberland Plateau. Treehouse, glamping tents, and a clear plexiglass cabin under the Tennessee night sky. Hosted by Anthony and Barb.',
  openGraph: {
    title: 'Awakening Adventures',
    description: 'Because God is the Greatest Adventure of ALL.',
    url: 'https://awakeningadventuresllc.com',
    siteName: 'Awakening Adventures',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Awakening Adventures',
    description: 'Forty-two acres of forest sanctuary. Hosted by Anthony and Barb.',
  },
  alternates: {
    canonical: 'https://awakeningadventuresllc.com',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
