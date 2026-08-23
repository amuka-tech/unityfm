'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, ChevronRight, Pause, Play } from 'lucide-react';
import { Article } from '@/types';

export function BreakingNewsTicker({ items }: { items: Article[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!items || items.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [items, isPaused]);

  if (!items || items.length === 0) return null;

  const currentStory = items[currentIndex] || items[0];

  return (
    <div className="bg-brand-crimson text-white border-y border-red-900 overflow-hidden shadow-inner">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 flex items-center h-10">
        
        {/* Breaking Badge */}
        <div className="flex items-center space-x-1.5 bg-brand-gold text-brand-dark px-2.5 py-1 rounded font-black text-xs uppercase tracking-wider flex-shrink-0 shadow-sm mr-3">
          <Flame className="w-3.5 h-3.5 text-brand-crimson animate-bounce" />
          <span>BREAKING</span>
        </div>

        {/* Ticker Headline Content */}
        <div
          className="flex-1 overflow-hidden truncate transition-opacity duration-300"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <Link
            href={`/news/${currentStory.category.slug}/${currentStory.slug}`}
            className="hover:underline flex items-center space-x-2 text-xs sm:text-sm font-semibold truncate"
          >
            <span className="bg-black/30 text-amber-200 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded flex-shrink-0">
              {currentStory.location_tag || currentStory.category.name}
            </span>
            <span className="truncate">{currentStory.title}</span>
          </Link>
        </div>

        {/* Controls & Pagination */}
        <div className="flex items-center space-x-2 pl-2 flex-shrink-0">
          <span className="text-[11px] text-red-200 hidden md:inline">
            {currentIndex + 1} of {items.length}
          </span>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 hover:bg-red-800 rounded text-red-200 hover:text-white transition-colors"
            title={isPaused ? 'Resume Ticker' : 'Pause Ticker'}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
            className="p-1 hover:bg-red-800 rounded text-red-200 hover:text-white transition-colors"
            title="Next Story"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
