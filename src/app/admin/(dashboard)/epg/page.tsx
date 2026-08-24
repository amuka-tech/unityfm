import React from 'react';
import { Metadata } from 'next';
import { RadioScheduleDesk } from '@/components/admin/RadioScheduleDesk';

export const metadata: Metadata = {
  title: 'Program Guide | Admin',
};

export default function EpgPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <RadioScheduleDesk />
    </div>
  );
}
