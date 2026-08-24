'use client';

import React from 'react';
import { Play, Radio } from 'lucide-react';

const RADIO_GARDEN_URL = 'https://radio.garden/listen/radio-unity-fm-97-7/LHckS4Xk';

export function RadioPlayer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 text-white px-4 py-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Station info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <Radio className="w-6 h-6 text-brand-crimson" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white truncate">Radio Unity FM</span>
              <span className="text-xs text-gray-400">97.7 FM</span>
              <span className="flex-shrink-0 text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded-sm">
                ON AIR
              </span>
            </div>
            <p className="text-xs text-gray-400 truncate">Broadcasting live from Northern Uganda</p>
          </div>
        </div>

        {/* Listen Button */}
        <a
          href={RADIO_GARDEN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-brand-crimson hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-transform hover:scale-105 flex-shrink-0 shadow-lg"
        >
          <Play className="w-4 h-4 fill-current" />
          Listen Live
        </a>
      </div>
    </div>
  );
}
