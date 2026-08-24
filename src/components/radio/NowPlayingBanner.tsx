'use client';

import React from 'react';
import { Radio, ExternalLink, PlayCircle } from 'lucide-react';
import Link from 'next/link';

export function NowPlayingBanner() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex-shrink-0">
            <Radio className="w-5 h-5 text-brand-crimson" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          </div>
          <span className="font-bold text-sm text-gray-900">ON AIR</span>
        </div>
        <span className="text-xs font-semibold text-gray-500">97.7 FM</span>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-1">Radio Unity FM</h3>
        <p className="text-sm text-gray-600 mb-4">Morning Breeze with DJ Okello</p>
        
        <Link 
          href="/listen"
          className="flex items-center justify-center gap-2 w-full bg-brand-crimson hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mb-4"
        >
          <PlayCircle className="w-5 h-5" />
          Listen Live
        </Link>

        {/* Radio Garden Embed */}
        <div className="rounded-lg overflow-hidden border border-gray-200 h-[200px]">
          <iframe 
            src="https://radio.garden/embed/radio-unity-fm-97-7/LHckS4Xk"
            frameBorder="0" 
            className="w-full h-full"
            title="Radio Garden Player"
          />
        </div>
      </div>
    </div>
  );
}
