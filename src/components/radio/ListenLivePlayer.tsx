'use client';

import React from 'react';
import { Radio, Play, Pause, Loader2, Volume2, VolumeX } from 'lucide-react';
import { useRadio } from '@/context/RadioContext';

export function ListenLivePlayer() {
  const { 
    isPlaying, 
    isLoading, 
    error, 
    togglePlay, 
    volume, 
    isMuted, 
    toggleMute, 
    handleVolume 
  } = useRadio();

  return (
    <div className="w-full h-[500px] flex flex-col items-center justify-center bg-gray-900 text-white p-8 relative">
      {/* Background visualizer effect */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-crimson rounded-full blur-[100px] transition-opacity duration-1000 ${isPlaying ? 'animate-pulse opacity-100' : 'opacity-20'}`}></div>
      </div>
      
      <div className="relative z-10 text-center mb-12">
        <div className={`w-32 h-32 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-2xl border-4 transition-colors duration-500 ${isPlaying ? 'border-brand-crimson' : 'border-gray-700'}`}>
          <Radio className={`w-16 h-16 ${isPlaying ? 'text-brand-crimson' : 'text-gray-500'}`} />
        </div>
        <h2 className="text-3xl font-black mb-2">Radio Unity FM</h2>
        <p className="text-gray-400">97.7 FM • {error ? 'Stream Error' : isPlaying ? 'Live Broadcast' : 'Ready to Play'}</p>
      </div>

      <div className="relative z-10 w-full max-w-md bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 flex flex-col items-center gap-6">
        
        {/* Big Play Button */}
        <button
          onClick={togglePlay}
          className={`w-20 h-20 flex items-center justify-center rounded-full transition-all shadow-lg ${
            isPlaying 
              ? 'bg-gray-900 hover:bg-black text-brand-crimson border-2 border-brand-crimson' 
              : 'bg-brand-crimson hover:bg-red-700 text-white hover:scale-105'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-8 h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 fill-current ml-2" />
          )}
        </button>

        {/* Volume Control */}
        <div className="w-full flex items-center gap-3 px-4">
          <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolume(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-brand-crimson"
          />
        </div>
        
      </div>
    </div>
  );
}
