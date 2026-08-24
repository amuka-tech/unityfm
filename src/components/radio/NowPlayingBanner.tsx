'use client';

import React from 'react';
import { Radio, ExternalLink, PlayCircle } from 'lucide-react';
import Link from 'next/link';

import { useRadio } from '@/context/RadioContext';

export function NowPlayingBanner() {
  const { showPlayer } = useRadio();

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
        
        <button 
          onClick={showPlayer}
          className="flex items-center justify-center gap-2 w-full bg-brand-crimson hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mb-4"
        >
          <PlayCircle className="w-5 h-5" />
          Listen Live
        </button>

        {/* Stream Visualizer Placeholder */}
        <div className="rounded-lg overflow-hidden border border-gray-200 h-[120px] bg-gray-900 relative flex items-center justify-center">
           <div className="flex items-end space-x-1 h-12">
             {[1, 2, 3, 4, 5, 6, 7].map((i) => (
               <div 
                 key={i} 
                 className="w-3 bg-brand-crimson rounded-t-sm"
                 style={{ 
                   height: `${Math.max(20, Math.random() * 100)}%`,
                   animation: `pulse ${0.5 + (i * 0.1)}s infinite alternate`
                 }}
               />
             ))}
           </div>
           <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
        </div>
      </div>
    </div>
  );
}
