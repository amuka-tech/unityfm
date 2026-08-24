'use client';

import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const STREAM_URL = 'https://radio.garden/api/ara/content/listen/LHckS4Xk/channel.mp3';
const RADIO_GARDEN_URL = 'https://radio.garden/listen/radio-unity-fm-97-7/LHckS4Xk';

export function RadioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.src = STREAM_URL;
      audio.play().then(() => setIsPlaying(true)).catch(() => {
        window.open(RADIO_GARDEN_URL, '_blank');
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
    if (audioRef.current) audioRef.current.volume = v;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 text-white px-4 py-3">
      <audio ref={audioRef} preload="none" />
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        
        {/* Station info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <Radio className="w-6 h-6 text-brand-crimson" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white truncate">Radio Unity FM</span>
              <span className="text-xs text-gray-400">97.7 FM</span>
              {isPlaying && (
                <span className="flex-shrink-0 text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded-sm">
                  ON AIR
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 truncate">Morning Breeze with DJ Okello</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center bg-brand-crimson hover:bg-red-700 rounded-full transition-colors flex-shrink-0"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          {/* Volume — hidden on small screens */}
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolume}
              className="w-20 accent-brand-crimson"
            />
          </div>

          <a
            href={RADIO_GARDEN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Radio Garden
          </a>
        </div>

        {/* Listen Live link */}
        <Link
          href="/listen"
          className="flex-shrink-0 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition-colors"
        >
          Full Player
        </Link>
      </div>
    </div>
  );
}
