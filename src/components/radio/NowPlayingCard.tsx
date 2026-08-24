'use client';

import React, { useEffect, useState } from 'react';
import { getCurrentShow } from '@/lib/schedule';

export function NowPlayingCard() {
  const [currentShow, setCurrentShow] = useState(getCurrentShow());

  useEffect(() => {
    // Update the show every minute just in case it crosses a boundary
    const interval = setInterval(() => {
      setCurrentShow(getCurrentShow());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 relative overflow-hidden group hover:border-brand-gold/50 transition-colors">
      <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold"></div>
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Currently Playing</h3>
      <p className="text-2xl font-bold text-gray-900 mb-1">{currentShow.show}</p>
      <p className="text-gray-600 font-medium">with {currentShow.host}</p>
      <p className="text-xs text-gray-400 mt-2 font-semibold">{currentShow.timeString}</p>
    </div>
  );
}
