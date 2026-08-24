'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { TopUtilityBar } from '@/components/layout/TopUtilityBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RadioPlayer } from '@/components/radio/RadioPlayer';

export function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main className="flex-1 pb-16 md:pb-0">{children}</main>;
  }

  return (
    <>
      {/* Unified Sticky Header Container */}
      <div className="sticky top-0 z-50">
        <TopUtilityBar />
        <Header />
      </div>
      {/* Add pb-16 to avoid content being hidden by the sticky radio player */}
      <main className="flex-1 pb-16">
        {children}
      </main>
      <Footer />
      {/* Radio Player sticky at bottom */}
      <RadioPlayer />
    </>
  );
}
