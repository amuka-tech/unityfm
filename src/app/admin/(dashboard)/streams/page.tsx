import React from 'react';
import { Metadata } from 'next';
import { RadioStudioDesk } from '@/components/admin/RadioStudioDesk';

export const metadata: Metadata = {
  title: 'Radio Studio - Unity Portal',
};

export default function StreamsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <RadioStudioDesk />
    </div>
  );
}
