'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Video, Clock, X, ExternalLink } from 'lucide-react';
import { Article } from '@/types';
import { useDataSaver } from '@/context/DataSaverContext';

export function VideoShowcase({ videoStories }: { videoStories: Article[] }) {
  const { getImageUrl } = useDataSaver();
  const [activeVideo, setActiveVideo] = useState<Article | null>(null);

  const videos = videoStories.filter(v => v.is_video_story || v.category.slug === 'videos');

  if (videos.length === 0) return null;

  return (
    <section className="py-8 bg-brand-dark text-white border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 bg-brand-crimson rounded flex items-center justify-center">
              <Video className="w-4 h-4 text-brand-gold" />
            </div>
            <h2 className="font-heading font-black text-xl sm:text-2xl text-white tracking-tight">
              VIDEO & PROGRAM SHOWCASE
            </h2>
          </div>
          <Link
            href="/videos"
            className="text-xs font-bold text-brand-gold hover:underline flex items-center space-x-1"
          >
            <span>Browse All Video VODs</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {videos.slice(0, 4).map((story) => (
            <div
              key={story.id}
              className="group bg-neutral-900 rounded-brand border border-neutral-800 overflow-hidden hover:border-brand-gold/60 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-black cursor-pointer"
                onClick={() => setActiveVideo(story)}
              >
                <img
                  src={getImageUrl(story.featured_image, 400)}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 opacity-85 group-hover:opacity-100 transition-all duration-300"
                />
                
                {/* Play Overlay Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-brand-crimson/90 group-hover:bg-brand-crimson text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 text-brand-gold fill-current" />
                  </div>
                </div>

                {/* Duration Badge */}
                {story.video_duration && (
                  <span className="absolute bottom-2 right-2 bg-black/85 text-[10px] text-white font-mono px-1.5 py-0.5 rounded flex items-center space-x-1">
                    <Clock className="w-2.5 h-2.5 text-brand-gold" />
                    <span>{story.video_duration}</span>
                  </span>
                )}

                <span className="absolute top-2 left-2 bg-brand-gold text-brand-dark font-black text-[9px] uppercase px-1.5 py-0.5 rounded">
                  {story.location_tag}
                </span>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <h3
                  onClick={() => setActiveVideo(story)}
                  className="font-heading font-bold text-xs sm:text-sm text-white group-hover:text-brand-gold transition-colors leading-snug line-clamp-2 cursor-pointer mb-2"
                >
                  {story.title}
                </h3>
                
                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] text-gray-400">
                  <span>{story.author.name}</span>
                  <span>{story.view_count.toLocaleString()} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-neutral-900 rounded-lg overflow-hidden border border-neutral-700 shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-950 border-b border-neutral-800">
              <div className="flex items-center space-x-2">
                <span className="bg-brand-crimson text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                  Unity TV Player
                </span>
                <span className="text-xs font-bold text-white truncate max-w-md">
                  {activeVideo.title}
                </span>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="text-gray-400 hover:text-white p-1 rounded hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-black">
              {activeVideo.video_url?.includes('youtube') ? (
                <iframe
                  src={`${activeVideo.video_url}?autoplay=1`}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activeVideo.video_url || 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              )}
            </div>

            <div className="p-4 bg-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-300">
              <div>
                <p className="font-semibold text-white">{activeVideo.sub_headline || activeVideo.title}</p>
                <p className="text-gray-400 mt-0.5">{activeVideo.excerpt}</p>
              </div>
              <Link
                href={`/news/${activeVideo.category.slug}/${activeVideo.slug}`}
                className="px-3 py-1.5 bg-brand-gold text-brand-dark font-bold rounded flex-shrink-0 hover:bg-brand-gold-light transition-colors"
                onClick={() => setActiveVideo(null)}
              >
                Read Full Article
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
