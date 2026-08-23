import React from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { VideosHubClient } from '@/components/videos/VideosHubClient';

export const metadata = {
  title: 'Videos & Live Streams | Unity TV & 97.7 Unity FM',
  description: 'Watch daily live streams, Odiko Alyet talk shows, prime news bulletins, and investigative video documentaries from Unity TV and 97.7 Unity FM Lira.',
};

export default async function VideosPage() {
  const [articles, broadcast] = await Promise.all([
    api.getArticles(),
    api.getBroadcastState(),
  ]);

  const videoStories = articles.filter(a => a.is_video_story || a.category.slug === 'videos');

  return (
    <div className="bg-neutral-950 min-h-screen py-8 text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        
        {/* Breadcrumbs & Header */}
        <div className="bg-neutral-900/90 rounded-2xl p-6 sm:p-8 border border-neutral-800 shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center space-x-2 text-xs font-bold text-red-500 uppercase tracking-wider mb-2">
            <Link href="/" className="hover:underline text-gray-400 hover:text-white">Home</Link>
            <span>/</span>
            <span>Videos & Live Streams</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="bg-red-600 text-white font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center space-x-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>Live Stream Feed</span>
                </span>
                <span className="text-xs text-brand-gold font-bold">@977unityfm Official Channel</span>
              </div>
              <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
                Unity TV & 97.7 Unity FM Video Hub
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-1.5 max-w-2xl leading-relaxed">
                Catch up on daily live-streamed broadcasts, the flagship <em>Odiko Alyet</em> talk show, Lango sub-region investigative documentaries, and full news bulletins recorded live from our Lira City studios.
              </p>
            </div>

            {/* YouTube Channel CTA */}
            <a
              href="https://www.youtube.com/@977unityfm/streams"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-red-600/30 flex items-center space-x-2.5 transition-all self-start lg:self-center flex-shrink-0"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>Watch on @977unityfm</span>
            </a>
          </div>
        </div>


        {/* Client Interactive Video Player & Stream Grid */}
        <VideosHubClient 
          initialStories={videoStories} 
          broadcastState={broadcast}
        />

      </div>
    </div>
  );
}
