'use client';

import React from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, ExternalLink, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { useRadio } from '@/context/RadioContext';

export function RadioPlayer() {
  const { 
    isPlayerVisible, 
    hidePlayer, 
    isPlaying, 
    isLoading, 
    error, 
    volume, 
    isMuted, 
    togglePlay, 
    handleVolume, 
    toggleMute 
  } = useRadio();

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 text-white shadow-2xl transition-transform duration-300 ease-in-out ${
        isPlayerVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left: Station Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0 w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
            <Radio className={`w-5 h-5 ${isPlaying ? 'text-brand-crimson' : 'text-gray-400'}`} />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-white truncate">Radio Unity FM</span>
              <span className="hidden sm:inline-block text-xs font-medium text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded">97.7</span>
            </div>
            <p className="text-xs text-gray-400 truncate">
              {error ? (
                <span className="text-red-400">Stream offline or blocked</span>
              ) : isPlaying ? (
                <span className="text-brand-crimson font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson animate-pulse" /> Live Now
                </span>
              ) : (
                'Broadcasting from Northern Uganda'
              )}
            </p>
          </div>
        </div>

        {/* Center: Play Controls */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={togglePlay}
            className={`w-12 h-12 flex items-center justify-center rounded-full transition-all flex-shrink-0 shadow-lg ${
              isPlaying 
                ? 'bg-gray-800 hover:bg-gray-700 text-brand-crimson border border-gray-700' 
                : 'bg-brand-crimson hover:bg-red-700 text-white hover:scale-105'
            }`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-1" />
            )}
          </button>
        </div>

        {/* Right: Volume & Listen Link */}
        <div className="flex-1 flex items-center justify-end gap-4 min-w-0">
          
          <div className="hidden md:flex items-center gap-2">
            <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolume(parseFloat(e.target.value))}
              className="w-20 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-crimson"
            />
          </div>

          <div className="w-px h-6 bg-gray-700 hidden md:block"></div>

          <button
            onClick={() => {
              if (isPlaying) togglePlay();
              hidePlayer();
            }}
            className="flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
