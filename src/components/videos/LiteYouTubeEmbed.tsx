'use client';

import React, { useState, useEffect } from 'react';
import { Play, Radio } from 'lucide-react';
import { useDataSaver } from '@/context/DataSaverContext';

interface LiteYouTubeEmbedProps {
  videoId: string;
  title: string;
  posterUrl?: string;
  aspectRatio?: string;
  isLive?: boolean;
  duration?: string;
  onPlay?: () => void;
  className?: string;
}

export function LiteYouTubeEmbed({
  videoId,
  title,
  posterUrl,
  aspectRatio = 'aspect-video',
  isLive = false,
  duration,
  onPlay,
  className = '',
}: LiteYouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPreconnected, setIsPreconnected] = useState(false);
  const { isDataSaver, addBytesSaved } = useDataSaver();

  // Reset play state if videoId changes
  useEffect(() => {
    setIsPlaying(false);
  }, [videoId]);

  const defaultThumbnail = posterUrl || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  const handleWarmConnection = () => {
    if (!isPreconnected) {
      const link1 = document.createElement('link');
      link1.rel = 'preconnect';
      link1.href = 'https://www.youtube-nocookie.com';
      document.head.appendChild(link1);

      const link2 = document.createElement('link');
      link2.rel = 'preconnect';
      link2.href = 'https://i.ytimg.com';
      document.head.appendChild(link2);

      setIsPreconnected(true);
    }
  };

  const handleActivatePlayer = () => {
    setIsPlaying(true);
    // Track bandwidth saved by not loading upfront
    addBytesSaved(1200); // Saved ~1.2MB of initial YouTube JS/iframe assets
    if (onPlay) onPlay();
  };

  if (isPlaying) {
    return (
      <div className={`relative w-full ${aspectRatio} bg-black overflow-hidden ${className}`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${aspectRatio} bg-neutral-950 overflow-hidden cursor-pointer group select-none ${className}`}
      onClick={handleActivatePlayer}
      onMouseEnter={handleWarmConnection}
      onTouchStart={handleWarmConnection}
      role="button"
      tabIndex={0}
      aria-label={`Play video: ${title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleActivatePlayer();
        }
      }}
    >
      {/* Poster Image (Low-data optimized) */}
      <img
        src={defaultThumbnail}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        loading="lazy"
      />

      {/* Dark Ambient Vignette Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 group-hover:from-black/60 transition-all" />

      {/* Badges: LIVE or Duration */}
      <div className="absolute top-3 left-3 flex items-center space-x-2 pointer-events-none">
        {isLive ? (
          <span className="bg-red-600 text-white font-black text-[10px] uppercase px-2.5 py-1 rounded-full flex items-center space-x-1.5 shadow-lg animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span>LIVE NOW</span>
          </span>
        ) : (
          <span className="bg-black/80 backdrop-blur-md text-brand-gold font-bold text-[10px] uppercase px-2 py-0.5 rounded border border-brand-gold/30">
            Unity TV HD
          </span>
        )}
      </div>

      {duration && (
        <div className="absolute bottom-3 right-3 bg-black/85 text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded pointer-events-none">
          {duration}
        </div>
      )}

      {/* 3G Low-Data Badge Indicator */}
      {isDataSaver && (
        <div className="absolute top-3 right-3 bg-emerald-900/90 border border-emerald-500 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow">
          <span>⚡ 3G Fast Facade</span>
        </div>
      )}

      {/* Center Play Button (High contrast, accessible) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-crimson/90 hover:bg-brand-crimson group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(139,0,0,0.8)] text-white flex items-center justify-center transition-all duration-300 ring-4 ring-white/20">
          <Play className="w-8 h-8 sm:w-9 sm:h-9 text-brand-gold fill-current ml-1" />
        </div>
      </div>

      {/* Bottom Title Bar Overlay */}
      <div className="absolute bottom-3 left-3 right-16 pointer-events-none">
        <h3 className="font-heading font-black text-xs sm:text-sm text-white line-clamp-1 drop-shadow-md">
          {title}
        </h3>
        <p className="text-[10px] text-gray-300 font-medium">Click to stream broadcast &bull; Low data load</p>
      </div>
    </div>
  );
}
