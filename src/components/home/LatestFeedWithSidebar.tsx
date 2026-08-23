'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tv, Play, TrendingUp, Sparkles, Volume2, VolumeX, Maximize2, Tag, ArrowRight } from 'lucide-react';
import { Article, BroadcastState } from '@/types';
import { useDataSaver } from '@/context/DataSaverContext';

export function LatestFeedWithSidebar({
  articles,
  broadcastState,
}: {
  articles: Article[];
  broadcastState: BroadcastState;
}) {
  const { getImageUrl, isDataSaver } = useDataSaver();
  const [isPlayingMini, setIsPlayingMini] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeTab, setActiveTab] = useState<'most_read' | 'trending'>('most_read');
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const mpegtsPlayerRef = React.useRef<any>(null);

  const directStreamUrl = process.env.NEXT_PUBLIC_LIVE_STREAM_FLV || 'http://localhost:8000/live/live_utv_lira2026.flv';

  React.useEffect(() => {
    let player: any = null;

    if (isPlayingMini && videoRef.current) {
      import('mpegts.js').then((mpegts) => {
        if (mpegts.default.isSupported()) {
          try {
            player = mpegts.default.createPlayer({
              type: 'flv',
              isLive: true,
              url: directStreamUrl,
              hasAudio: true,
              hasVideo: true,
            }, {
              enableWorker: true,
              lazyLoadMaxDuration: 3 * 60,
              seekType: 'range',
              liveBufferLatencyChasing: true,
              liveBufferLatencyMaxLatency: 2.0,
              liveBufferLatencyMinRemain: 0.5,
            });

            player.on(mpegts.default.Events.ERROR, (errorType: any, errorDetail: any, errorInfo: any) => {
              console.warn('[Home MiniPlayer] mpegts stream warning:', errorType, errorDetail);
            });
            player.attachMediaElement(videoRef.current!);
            player.load();
            player.play().catch(() => {});
            mpegtsPlayerRef.current = player;
          } catch (e) {
            console.warn('[Home MiniPlayer] mpegts init error:', e);
          }
        }
      });
    }

    return () => {
      if (mpegtsPlayerRef.current) {
        try {
          mpegtsPlayerRef.current.pause();
          mpegtsPlayerRef.current.unload();
          mpegtsPlayerRef.current.detachMediaElement();
          mpegtsPlayerRef.current.destroy();
        } catch (e) {}
        mpegtsPlayerRef.current = null;
      }
    };
  }, [isPlayingMini, directStreamUrl]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const mostRead = [...articles].sort((a, b) => b.view_count - a.view_count).slice(0, 5);

  const trendingTags = [
    '#LiraKamdiniRoad',
    '#OtukeSheaButter',
    '#FUFADrumLango',
    '#LiraCityCouncil',
    '#AkiiBuaStadium',
    '#LakeKyoga',
    '#TekwaroLango',
    '#StanbicAgriLoan',
  ];

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Latest News Feed (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b-2 border-brand-dark">
              <h2 className="font-heading font-black text-xl sm:text-2xl text-brand-dark tracking-tight">
                LATEST EDITORIAL FEED
              </h2>
              <span className="text-xs font-semibold text-gray-500">Live Chronological Desk</span>
            </div>

            <div className="space-y-5">
              {articles.slice(0, 7).map((article, index) => (
                <React.Fragment key={article.id}>
                  
                  {/* Article Card */}
                  <article className="group bg-white rounded-brand border border-gray-200 p-4 sm:p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col sm:flex-row gap-4 sm:gap-5">
                    {/* Thumbnail */}
                    <Link
                      href={`/news/${article.category.slug}/${article.slug}`}
                      className="relative w-full sm:w-48 sm:h-36 aspect-[16/10] sm:aspect-auto flex-shrink-0 overflow-hidden rounded bg-neutral-900"
                    >
                      <img
                        src={getImageUrl(article.featured_image, 400)}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded">
                        {article.location_tag}
                      </span>
                    </Link>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1.5">
                          <span
                            className="text-[10px] uppercase font-black px-2 py-0.5 rounded"
                            style={{ backgroundColor: `${article.category.color}25`, color: article.category.color }}
                          >
                            {article.category.name}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {new Date(article.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>

                        <Link href={`/news/${article.category.slug}/${article.slug}`}>
                          <h3 className="font-heading font-black text-base sm:text-lg text-brand-dark group-hover:text-brand-crimson transition-colors leading-snug mb-1.5">
                            {article.title}
                          </h3>
                        </Link>

                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <span className="font-medium">By {article.author.name}</span>
                        <span className="text-brand-crimson font-bold flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                          <span>Read Story</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Column: Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Sidebar Mini Live TV Player Widget */}
            <div className="bg-brand-dark rounded-brand border border-neutral-800 p-4 text-white shadow-lg overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
                  </span>
                  <span className="font-heading font-black text-sm uppercase text-brand-gold">
                    LIVE TV ON AIR
                  </span>
                </div>
                <Link
                  href="/live"
                  className="text-[11px] text-gray-400 hover:text-white flex items-center space-x-1"
                >
                  <span>Go to MCR</span>
                  <Maximize2 className="w-3 h-3" />
                </Link>
              </div>

              <div className="aspect-video bg-black rounded relative overflow-hidden group">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  muted={isMuted}
                  playsInline
                />
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => setIsPlayingMini(!isPlayingMini)}
                    className="w-12 h-12 bg-brand-crimson/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    {isPlayingMini ? (
                      <div className="flex space-x-1">
                        <div className="w-1 h-4 bg-white animate-pulse" />
                        <div className="w-1 h-4 bg-white animate-pulse delay-75" />
                      </div>
                    ) : (
                      <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                    )}
                  </button>
                </div>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute bottom-2 right-2 p-1.5 bg-black/60 rounded text-white hover:bg-black/80 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="mt-3">
                <h3 className="font-bold text-sm text-gray-100">{broadcastState?.current_program || 'Unity News Hour'}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{broadcastState?.next_program ? `Up Next: ${broadcastState.next_program}` : 'Stay tuned for more updates'}</p>
              </div>
            </div>

            {/* Most Read & Trending Tabs */}
            <div className="bg-white rounded-brand border border-gray-200 overflow-hidden shadow-sm">
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveTab('most_read')}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors ${
                    activeTab === 'most_read' ? 'bg-brand-crimson text-white' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Most Read</span>
                </button>
                <button
                  onClick={() => setActiveTab('trending')}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors ${
                    activeTab === 'trending' ? 'bg-brand-dark text-white' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Trending</span>
                </button>
              </div>

              <div className="p-0">
                {activeTab === 'most_read' ? (
                  <div className="divide-y divide-gray-100">
                    {mostRead.map((article, i) => (
                      <Link
                        key={article.id}
                        href={`/news/${article.category.slug}/${article.slug}`}
                        className="flex items-start space-x-3 p-4 hover:bg-gray-50 group transition-colors"
                      >
                        <span className="text-2xl font-black text-gray-200 group-hover:text-brand-crimson/20 transition-colors">
                          0{i + 1}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-brand-crimson transition-colors line-clamp-2 leading-tight">
                            {article.title}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-medium uppercase mt-1 block">
                            {article.category.name}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 flex flex-wrap gap-2">
                    {trendingTags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/search?q=${tag.replace('#', '')}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 transition-colors"
                      >
                        <Tag className="w-3 h-3 text-brand-crimson" />
                        <span>{tag}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
