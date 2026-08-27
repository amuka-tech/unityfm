import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { DataSaverProvider } from '@/context/DataSaverContext';
import { AuthProvider } from '@/context/AuthContext';
import { PublicLayoutWrapper } from '@/components/layout/PublicLayoutWrapper';



import { CookieConsentBanner } from '@/components/layout/CookieConsentBanner';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Radio Unity FM 97.7 — Broadcasting Across Northern Uganda | News & Live Stream',
  description: 'Radio Unity FM 97.7 — Broadcasting Across Northern Uganda. Available on Youtube and Online Stream on our website with breaking news, agribusiness, and cultural programming.',
  keywords: ['Radio Unity FM 97.7', 'Broadcasting Across Northern Uganda', 'Lira City News', 'Lango Sub-region', 'Dokolo', 'Apac', 'Oyam', 'FUFA Drum Lango', 'Shea Butter Uganda', 'Live Radio Lira'],
  authors: [{ name: 'Radio Unity FM Editorial Desk' }],
  metadataBase: new URL('https://radiounity.ug'),
  openGraph: {
    title: 'Radio Unity FM 97.7 — Broadcasting Across Northern Uganda',
    description: 'Radio Unity FM 97.7 — Broadcasting Across Northern Uganda. Available on Youtube and Online Stream on our website.',
    url: 'https://radiounity.ug',
    siteName: 'Radio Unity FM 97.7',
    locale: 'en_UG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Radio Unity FM 97.7 — Broadcasting Across Northern Uganda',
    description: 'Available on Youtube and Online Stream on our website.',
    site: '@RadioUnityUganda',
  },
  icons: {
    icon: '/radio-unity-logo.png',
    shortcut: '/radio-unity-logo.png',
    apple: '/radio-unity-logo.png',
  },
  manifest: '/manifest.json',
};

import { RadioProvider } from '@/context/RadioContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/radio-unity-logo.png" />
        <link rel="apple-touch-icon" href="/radio-unity-logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FFC20E" />
      </head>
      <body className={`min-h-screen flex flex-col justify-between antialiased ${poppins.variable} ${poppins.className}`} suppressHydrationWarning>
        <DataSaverProvider>
          <AuthProvider>
            <RadioProvider>
              <div className="flex flex-col min-h-screen">
                <PublicLayoutWrapper>
                  {children}
                </PublicLayoutWrapper>
                {/* Uganda DPPA 2019 Privacy & Cookie Consent */}
                <CookieConsentBanner />
              </div>
            </RadioProvider>
          </AuthProvider>
        </DataSaverProvider>
      </body>
    </html>
  );
}
