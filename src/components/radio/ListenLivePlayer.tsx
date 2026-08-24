'use client';

import React from 'react';
import { Radio, Play, Pause, Loader2, Volume2, VolumeX } from 'lucide-react';
import { useRadio } from '@/context/RadioContext';

export function ListenLivePlayer() {
  const { 
    showPlayer,
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
    <div className="w-full h-[500px] flex flex-col items-center justify-center bg-brand-dark text-white p-8 relative overflow-hidden">
      {/* Background visualizer effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold rounded-full blur-[120px] transition-opacity duration-1000 ${isPlaying ? 'animate-pulse opacity-20' : 'opacity-5'}`}></div>
        <div className={`absolute bottom-0 right-0 w-[300px] h-[300px] bg-brand-crimson rounded-full blur-[100px] transition-opacity duration-1000 ${isPlaying ? 'opacity-20' : 'opacity-5'}`}></div>
      </div>
      
      <div className="relative z-10 text-center mb-12">
        <div className={`w-32 h-32 mx-auto bg-neutral-900 rounded-full flex items-center justify-center mb-6 shadow-2xl border-4 transition-all duration-500 ${isPlaying ? 'border-brand-gold shadow-[0_0_30px_rgba(255,194,14,0.4)]' : 'border-neutral-800'}`}>
          <Radio className={`w-16 h-16 transition-colors duration-500 ${isPlaying ? 'text-brand-gold animate-pulse' : 'text-neutral-500'}`} />
        </div>
        <h2 className="text-3xl font-black mb-2 tracking-tight">Radio Unity FM</h2>
        <p className="text-brand-gold font-medium mb-1">97.7 FM</p>
        <p className="text-gray-400 text-sm tracking-widest uppercase">{error ? 'Stream Error' : isPlaying ? 'Live Broadcast' : 'Ready to Play'}</p>
      </div>

      <div className="relative z-10 w-full max-w-md bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-neutral-800 flex flex-col items-center gap-6">
        
        {/* Big Play Button */}
        <button
          onClick={() => {
            if (!isPlaying) showPlayer();
            togglePlay();
          }}
          className={`w-20 h-20 flex items-center justify-center rounded-full transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] ${
            isPlaying 
              ? 'bg-neutral-900 hover:bg-black text-brand-gold border-2 border-brand-gold' 
              : 'bg-brand-gold hover:bg-brand-gold-dark text-brand-dark border-2 border-brand-gold hover:scale-105'
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
          <button onClick={toggleMute} className="text-gray-400 hover:text-brand-gold transition-colors">
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolume(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-gold"
          />
        </div>
        
      </div>
    </div>
  );
}
