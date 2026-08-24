'use client';

import React, { useEffect, useState } from 'react';
import { Radio, Play, Pause, Loader2, Volume2, VolumeX } from 'lucide-react';
import { useRadio } from '@/context/RadioContext';
import { getCurrentShow } from '@/lib/schedule';

export function ListenLivePlayer() {
  const [currentShow, setCurrentShow] = useState(getCurrentShow());

  useEffect(() => {
    const interval = setInterval(() => setCurrentShow(getCurrentShow()), 60000);
    return () => clearInterval(interval);
  }, []);

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
      {/* Background visualizer waves */}
      <style>{`
        @keyframes wave {
          0% { height: 10%; opacity: 0.3; }
          50% { height: 90%; opacity: 0.8; }
          100% { height: 10%; opacity: 0.3; }
        }
        .wave-bar {
          animation: wave 1s ease-in-out infinite;
          transform-origin: bottom;
        }
      `}</style>
      <div className="absolute bottom-0 left-0 w-full h-[60%] flex items-end justify-between px-2 gap-1 sm:gap-2 opacity-40 pointer-events-none z-0">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className={`w-full max-w-[20px] bg-gradient-to-t from-brand-crimson to-brand-gold rounded-t-full transition-all duration-500 ${isPlaying ? 'wave-bar' : 'h-[5%]'}`}
            style={isPlaying ? { 
              animationDelay: `${Math.random() * 1.2}s`,
              animationDuration: `${0.6 + Math.random() * 0.8}s`
            } : {}}
          />
        ))}
      </div>
      
      <div className="relative z-10 text-center mb-12">
        <div className={`w-32 h-32 mx-auto bg-neutral-900 rounded-full flex items-center justify-center mb-6 shadow-2xl border-4 transition-all duration-500 ${isPlaying ? 'border-brand-gold shadow-[0_0_30px_rgba(255,194,14,0.4)]' : 'border-neutral-800'}`}>
          <Radio className={`w-16 h-16 transition-colors duration-500 ${isPlaying ? 'text-brand-gold' : 'text-neutral-500'}`} />
        </div>
        <h2 className="text-3xl font-black mb-1 tracking-tight">{currentShow.show}</h2>
        {currentShow.show !== 'Radio Unity FM' && <p className="text-sm text-brand-gold mb-3 font-medium">with {currentShow.host}</p>}
        <p className="text-gray-400 text-sm tracking-widest uppercase">
          {error ? 'Stream Error' : isPlaying ? 'Live Broadcast' : '97.7 FM'}
        </p>
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
