import React from 'react';
import { Metadata } from 'next';
import { CommoditiesDesk } from '@/components/admin/CommoditiesDesk';

export const metadata: Metadata = {
  title: 'Agri-Market Desk - Unity Portal',
};

export default function AgriMarketPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <CommoditiesDesk />
    </div>
  );
}
