'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, ExternalLink, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { useRadio } from '@/context/RadioContext';

// The direct stream URL (Zeno) for native HTML5 playback without CORS issues
const STREAM_URL = 'https://stream.zeno.fm/27hu4m1x768uv';

export function RadioPlayer() {
  const { isPlayerVisible, hidePlayer } = useRadio();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setError(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleError = (e: any) => {
      console.error('Audio stream error:', e);
      setIsPlaying(false);
      setIsLoading(false);
      setError(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      // Reset the source to stop buffering the live stream
      audio.src = '';
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      setError(false);
      // Set the source and play
      audio.src = STREAM_URL;
      audio.play().catch((e) => {
        console.error('Playback failed', e);
        setError(true);
        setIsLoading(false);
      });
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
      if (v > 0 && isMuted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  if (!isPlayerVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 text-white shadow-2xl">
      <audio ref={audioRef} preload="none" />
      
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
          
          {/* Volume Control - Hidden on mobile */}
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
              onChange={handleVolume}
              className="w-20 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-crimson"
            />
          </div>

          <div className="w-px h-6 bg-gray-700 hidden md:block"></div>

          <button
            onClick={hidePlayer}
            className="flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
