'use client';

import React, { useEffect, useState } from 'react';
import { Radio, Play, Pause, Loader2 } from 'lucide-react';
import { useRadio } from '@/context/RadioContext';
import { getCurrentShow } from '@/lib/schedule';

export function NowPlayingBanner() {
  const [currentShow, setCurrentShow] = useState(getCurrentShow());

  useEffect(() => {
    const interval = setInterval(() => setCurrentShow(getCurrentShow()), 60000);
    return () => clearInterval(interval);
  }, []);

  const { isPlaying, isLoading, togglePlay, showPlayer } = useRadio();

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex-shrink-0">
            <Radio className={`w-5 h-5 ${isPlaying ? 'text-brand-crimson' : 'text-gray-400'}`} />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
          </div>
          <span className="font-bold text-sm text-gray-900">ON AIR</span>
        </div>
        <span className="text-xs font-semibold text-gray-500">97.7 FM</span>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-0">{currentShow.show}</h3>
        <p className="text-sm text-gray-600 mb-4">with {currentShow.host}</p>
        
        <button 
          onClick={() => {
            if (!isPlaying) showPlayer();
            togglePlay();
          }}
          className={`flex items-center justify-center gap-2 w-full font-medium py-2 px-4 rounded-lg transition-colors mb-4 ${
            isPlaying ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' : 'bg-brand-crimson hover:bg-red-700 text-white'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isPlaying ? (
            <>
              <Pause className="w-5 h-5 fill-current" /> Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" /> Listen Live
            </>
          )}
        </button>

        {/* Stream Visualizer Placeholder */}
        <div className="rounded-lg overflow-hidden border border-gray-200 h-[120px] bg-gray-900 relative flex items-center justify-center">
           <div className="flex items-end space-x-1 h-12">
             {[1, 2, 3, 4, 5, 6, 7].map((i) => (
               <div 
                 key={i} 
                 className={`w-3 bg-brand-crimson rounded-t-sm ${isPlaying ? '' : 'h-1'}`}
                 style={isPlaying ? { 
                   height: `${Math.max(20, Math.random() * 100)}%`,
                   animation: `pulse ${0.5 + (i * 0.1)}s infinite alternate`
                 } : {}}
               />
             ))}
           </div>
           <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
        </div>
      </div>
    </div>
  );
}
