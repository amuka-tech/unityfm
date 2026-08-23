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
  title: 'Unity TV Uganda — Broadcasting Across Northern Uganda | News & Live Stream',
  description: 'Unity TV Uganda — Broadcasting Across Northern Uganda. Available on Youtube and Online Stream on our website with breaking news, agribusiness, and cultural programming.',
  keywords: ['Unity TV Uganda', 'Broadcasting Across Northern Uganda', 'Lira City News', 'Lango Sub-region', 'Dokolo', 'Apac', 'Oyam', 'FUFA Drum Lango', 'Shea Butter Uganda', 'Live TV Lira'],
  authors: [{ name: 'Unity TV Editorial Desk' }],
  metadataBase: new URL('https://unitytv.ug'),
  openGraph: {
    title: 'Unity TV Uganda — Broadcasting Across Northern Uganda',
    description: 'Unity TV Uganda — Broadcasting Across Northern Uganda. Available on Youtube and Online Stream on our website.',
    url: 'https://unitytv.ug',
    siteName: 'Unity TV Uganda',
    locale: 'en_UG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unity TV Uganda — Broadcasting Across Northern Uganda',
    description: 'Available on Youtube and Online Stream on our website.',
    site: '@UnityTVUganda',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png?v=3', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png?v=3', sizes: '16x16', type: 'image/png' },
      { url: '/icon-192.png?v=3', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=3', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=3',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=3" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=3" />
        <link rel="shortcut icon" href="/favicon.ico?v=3" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=3" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FFC20E" />
      </head>
      <body className={`min-h-screen flex flex-col justify-between antialiased ${poppins.variable} ${poppins.className}`} suppressHydrationWarning>
        <DataSaverProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <PublicLayoutWrapper>
                {children}
              </PublicLayoutWrapper>
              {/* Uganda DPPA 2019 Privacy & Cookie Consent */}
              <CookieConsentBanner />
            </div>
          </AuthProvider>
        </DataSaverProvider>
      </body>
    </html>
  );
}
