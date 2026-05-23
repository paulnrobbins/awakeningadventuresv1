import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import { Providers } from '@/components/layout/Providers';

/**
 * Font loading — both fonts are loaded via next/font/local so the user
 * gets brand type on first paint. The actual .woff2 files land in
 * /public/fonts during install (see README "Fonts" section).
 *
 * Bricolage Grotesque is a variable font (one file, all weights).
 * General Sans ships as a static family — three weights cover the use.
 *
 * If the .woff2 files are missing in dev, the CSS fallback chain in
 * tokens.css carries the page until they're added.
 */

const display = localFont({
  src: [
    {
      path: '../public/fonts/BricolageGrotesque[opsz,wdth,wght].woff2',
      style: 'normal',
    },
  ],
  variable: '--font-display',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
});

const body = localFont({
  src: [
    { path: '../public/fonts/GeneralSans-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/GeneralSans-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/GeneralSans-Semibold.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
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
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Stargazer cabin under the Tennessee night sky',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Awakening Adventures',
    description: 'Forty-two acres of forest sanctuary. Hosted by Anthony and Barb.',
    images: ['/og-image.jpg'],
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
