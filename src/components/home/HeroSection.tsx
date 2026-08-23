'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, Video, Sparkles } from 'lucide-react';
import { Article } from '@/types';
import { useDataSaver } from '@/context/DataSaverContext';

export function HeroSection({ heroArticle, secondaryArticles }: { heroArticle: Article; secondaryArticles: Article[] }) {
  const { getImageUrl } = useDataSaver();

  if (!heroArticle) return null;

  return (
    <section className="py-6 sm:py-8 bg-brand-surface">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-brand-crimson" />
            <h2 className="font-heading font-black text-xl sm:text-2xl text-brand-dark tracking-tight uppercase">
              Latest Highlights
            </h2>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] hidden sm:inline">
            Curated For You
          </span>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[500px]">
          
          {/* Main Hero Lead Story (6 cols) */}
          <Link 
            href={`/news/${heroArticle.category.slug}/${heroArticle.slug}`}
            className="lg:col-span-6 relative group rounded-xl overflow-hidden shadow-card h-[400px] lg:h-full flex flex-col justify-end"
          >
            {/* Background Image */}
            <img
              src={getImageUrl(heroArticle.featured_image, 1000)}
              alt={heroArticle.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="eager"
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-brand-crimson/10 mix-blend-overlay group-hover:bg-brand-crimson/0 transition-colors duration-500" />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
              <span className="bg-brand-gold text-brand-dark font-black text-xs uppercase px-2.5 py-1 rounded shadow-lg backdrop-blur-md">
                {heroArticle.category.name}
              </span>
              {heroArticle.is_breaking && (
                <span className="bg-brand-crimson/90 backdrop-blur-md text-white font-bold text-xs uppercase px-2 py-1 rounded shadow-lg flex items-center space-x-1 border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>DEVELOPING</span>
                </span>
              )}
            </div>

            {/* Content (Overlaid at bottom) */}
            <div className="relative z-10 p-5 sm:p-8">
              <div className="mb-3">
                <h1 className="font-heading font-black text-2xl sm:text-4xl text-white group-hover:text-brand-gold transition-colors leading-[1.15] drop-shadow-lg">
                  {heroArticle.title}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4 text-xs font-medium text-gray-300">
                <span className="flex items-center space-x-1.5">
                  <img src={heroArticle.author.avatar_url} alt={heroArticle.author.name} className="w-5 h-5 rounded-full border border-white/30" />
                  <span className="text-white">{heroArticle.author.name}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{heroArticle.reading_time_minutes} min read</span>
                </span>
              </div>
            </div>
          </Link>

          {/* Right Secondary Grid (6 cols) */}
          <div className="lg:col-span-6 grid grid-cols-2 grid-rows-2 gap-4 h-[600px] lg:h-full">
            
            {/* Top Wide Card (Spans 2 cols) */}
            {secondaryArticles[0] && (
              <Link 
                href={`/news/${secondaryArticles[0].category.slug}/${secondaryArticles[0].slug}`}
                className="col-span-2 row-span-1 relative group rounded-xl overflow-hidden shadow-card flex flex-col justify-end"
              >
                <img
                  src={getImageUrl(secondaryArticles[0].featured_image, 800)}
                  alt={secondaryArticles[0].title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-black/60 backdrop-blur-md text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded border border-white/10">
                    {secondaryArticles[0].category.name}
                  </span>
                </div>

                <div className="relative z-10 p-4 sm:p-5">
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-white group-hover:text-brand-gold transition-colors leading-snug drop-shadow-md mb-2 line-clamp-2">
                    {secondaryArticles[0].title}
                  </h3>
                  <div className="text-[10px] text-gray-300 flex items-center space-x-2">
                    <span>{secondaryArticles[0].author.name}</span>
                    <span>•</span>
                    <span>{secondaryArticles[0].reading_time_minutes} min read</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Bottom Left Card */}
            {secondaryArticles[1] && (
              <Link 
                href={`/news/${secondaryArticles[1].category.slug}/${secondaryArticles[1].slug}`}
                className="col-span-1 row-span-1 relative group rounded-xl overflow-hidden shadow-card flex flex-col justify-end"
              >
                <img
                  src={getImageUrl(secondaryArticles[1].featured_image, 500)}
                  alt={secondaryArticles[1].title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-brand-crimson/80 backdrop-blur-md text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded border border-white/10">
                    {secondaryArticles[1].category.name}
                  </span>
                </div>

                <div className="relative z-10 p-4">
                  <h3 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-brand-gold transition-colors leading-snug drop-shadow-md mb-1.5 line-clamp-3">
                    {secondaryArticles[1].title}
                  </h3>
                  <div className="text-[10px] text-gray-400">
                    {secondaryArticles[1].reading_time_minutes} min read
                  </div>
                </div>
              </Link>
            )}

            {/* Bottom Right Card */}
            {secondaryArticles[2] && (
              <Link 
                href={`/news/${secondaryArticles[2].category.slug}/${secondaryArticles[2].slug}`}
                className="col-span-1 row-span-1 relative group rounded-xl overflow-hidden shadow-card flex flex-col justify-end"
              >
                <img
                  src={getImageUrl(secondaryArticles[2].featured_image, 500)}
                  alt={secondaryArticles[2].title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-brand-gold/90 backdrop-blur-md text-brand-dark font-black text-[10px] uppercase px-2 py-0.5 rounded border border-white/20">
                    {secondaryArticles[2].category.name}
                  </span>
                </div>

                <div className="relative z-10 p-4">
                  <h3 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-brand-gold transition-colors leading-snug drop-shadow-md mb-1.5 line-clamp-3">
                    {secondaryArticles[2].title}
                  </h3>
                  <div className="text-[10px] text-gray-400">
                    {secondaryArticles[2].reading_time_minutes} min read
                  </div>
                </div>
              </Link>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
