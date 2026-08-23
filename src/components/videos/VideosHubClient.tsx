'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Clock, Eye, Radio, ExternalLink, Sparkles, Filter, Search, Share2, Check, Flame, Volume2, VolumeX } from 'lucide-react';
import { Article, BroadcastState } from '@/types';
import { useDataSaver } from '@/context/DataSaverContext';
import { LiteYouTubeEmbed } from './LiteYouTubeEmbed';
import { unityFmStreamsData } from '@/lib/unityStreamsData';

export interface YouTubeStreamItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  views: string;
  publishedAt: string;
  presenter: string;
  thumbnail: string;
  youtubeId: string;
  description: string;
  isLive?: boolean;
}

export function VideosHubClient({
  initialStories,
  broadcastState,
}: {
  initialStories: Article[];
  broadcastState: BroadcastState;
}) {
  const { isDataSaver, getImageUrl } = useDataSaver();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStream, setSelectedStream] = useState<YouTubeStreamItem>(unityFmStreamsData[0] as any);
  const [copiedLink, setCopiedLink] = useState(false);
  const [useLiveFeed, setUseLiveFeed] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const mpegtsPlayerRef = React.useRef<any>(null);

  const directStreamUrl = process.env.NEXT_PUBLIC_LIVE_STREAM_FLV || 'http://localhost:8000/live/live_utv_lira2026.flv';

  // Manage live mpegts player for featured live streams
  React.useEffect(() => {
    let player: any = null;

    if (useLiveFeed && selectedStream.isLive && videoRef.current) {
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
              console.warn('[VideosHub] mpegts stream warning:', errorType, errorDetail);
            });
            player.attachMediaElement(videoRef.current!);
            player.load();

            if (videoRef.current) {
              videoRef.current.volume = volume;
              videoRef.current.muted = isMuted;
            }

            player.play().catch(() => {
              if (videoRef.current) {
                videoRef.current.muted = true;
                setIsMuted(true);
                player.play().catch(() => {});
              }
            });

            mpegtsPlayerRef.current = player;
          } catch (e) {
            console.warn('[VideosHub] mpegts init error:', e);
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
  }, [useLiveFeed, selectedStream, directStreamUrl]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = nextMuted ? 0 : volume;
    }
  };

  const categories = [
    'All',
    'Amut me Di Ceng (Day News)',
    'Amut me Otyeno (Evening News)',
    'Odiko Alyet Talk Show',
    'Sports & Special Events',
    'Community & Live Events',
  ];

  const filteredStreams = (unityFmStreamsData as YouTubeStreamItem[]).filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.presenter.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${selectedStream.youtubeId}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-10">
      
      {/* Featured Master Theater Player */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Main Video Frame (Live Stream or Lite YouTube Embed) */}
          <div className="lg:col-span-8 bg-black relative aspect-video flex items-center justify-center">
            {selectedStream.isLive && useLiveFeed ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  controls={false}
                  autoPlay
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />

                {/* Floating Unmute Button */}
                {isMuted && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                    <button
                      onClick={toggleMute}
                      className="flex items-center space-x-2 px-4 py-2 bg-black/80 hover:bg-brand-crimson backdrop-blur-md text-white text-xs font-black rounded-full border border-neutral-700 shadow-2xl transition-all transform hover:scale-105"
                    >
                      <VolumeX className="w-4 h-4 text-brand-gold" />
                      <span>Click to Enable Audio</span>
                    </button>
                  </div>
                )}

                {/* Live Banner Overlay */}
                <div className="absolute top-3 left-3 z-20 flex items-center space-x-2">
                  <span className="flex items-center space-x-1.5 bg-brand-crimson text-white px-2.5 py-1 rounded font-black text-[11px] uppercase tracking-wider shadow">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>ON AIR LIVE FEED</span>
                  </span>
                  <span className="bg-black/70 backdrop-blur-sm text-brand-gold text-[10px] px-2 py-0.5 rounded font-bold border border-neutral-700">
                    Unity TV HD
                  </span>
                </div>

                {/* Bottom Audio Control */}
                <div className="absolute bottom-3 right-3 z-20">
                  <button
                    onClick={toggleMute}
                    className="p-2 bg-black/70 hover:bg-black text-white rounded-full transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-brand-gold" />}
                  </button>
                </div>
              </div>
            ) : (
              <LiteYouTubeEmbed
                videoId={selectedStream.youtubeId}
                title={selectedStream.title}
                posterUrl={selectedStream.thumbnail}
                duration={selectedStream.duration}
                isLive={selectedStream.isLive}
                className="w-full h-full"
              />
            )}
          </div>

          {/* Player Metadata & Up Next Sidebar */}
          <div className="lg:col-span-4 p-5 sm:p-6 flex flex-col justify-between bg-neutral-900 border-t lg:border-t-0 lg:border-l border-neutral-800">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-brand-gold text-brand-dark">
                  {selectedStream.category}
                </span>

                {selectedStream.isLive ? (
                  <div className="flex items-center space-x-1 bg-neutral-800 p-0.5 rounded border border-neutral-700 text-[10px]">
                    <button
                      onClick={() => setUseLiveFeed(true)}
                      className={`px-2 py-0.5 rounded font-bold transition-colors ${
                        useLiveFeed ? 'bg-brand-crimson text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Live Feed
                    </button>
                    <button
                      onClick={() => setUseLiveFeed(false)}
                      className={`px-2 py-0.5 rounded font-bold transition-colors ${
                        !useLiveFeed ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      YouTube
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-gray-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span>{selectedStream.duration}</span>
                  </span>
                )}
              </div>

              <h2 className="font-heading font-black text-base sm:text-lg text-white leading-snug line-clamp-2 mb-2">
                {selectedStream.title}
              </h2>

              <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-4">
                {selectedStream.description}
              </p>

              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1.5 text-xs text-gray-300 mb-4">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Lead Anchor / Host:</span>
                  <span className="font-bold text-brand-gold">{selectedStream.presenter}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Audience Views:</span>
                  <span className="font-mono text-white">{selectedStream.views}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Stream Broadcasted:</span>
                  <span>{selectedStream.publishedAt}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2 px-3 bg-neutral-800 hover:bg-neutral-750 text-gray-200 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 border border-neutral-700 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-brand-gold" />}
                <span>{copiedLink ? 'Link Copied!' : 'Share Stream'}</span>
              </button>

              <a
                href="https://www.youtube.com/@977unityfm/streams"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center justify-center space-x-1 transition-colors"
                title="Subscribe on YouTube"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>YouTube</span>
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-brand-crimson text-white shadow'
                  : 'bg-neutral-800 text-gray-400 hover:text-white hover:bg-neutral-750'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search streams or hosts..."
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold transition-colors"
          />
        </div>

      </div>

      {/* Streams Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading font-black text-lg text-white uppercase tracking-wider flex items-center space-x-2">
            <Flame className="w-5 h-5 text-brand-gold" />
            <span>Recorded Episodes & YouTube Streams ({filteredStreams.length})</span>
          </h3>
          <span className="text-xs text-gray-400">Click any card to play in theater above</span>
        </div>

        {filteredStreams.length === 0 ? (
          <div className="p-12 text-center bg-neutral-900 rounded-2xl border border-neutral-800 text-gray-400 text-xs">
            No streams match your query &ldquo;{searchQuery}&rdquo;. Try another topic or category filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStreams.map((stream) => {
              const isSelected = selectedStream.id === stream.id;
              return (
                <div
                  key={stream.id}
                  onClick={() => {
                    setSelectedStream(stream);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className={`cursor-pointer group bg-neutral-900 rounded-2xl border overflow-hidden transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-brand-gold ring-2 ring-brand-gold/40 shadow-xl'
                      : 'border-neutral-800 hover:border-neutral-700 hover:shadow-lg'
                  }`}
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="relative aspect-video overflow-hidden bg-black">
                      <img
                        src={getImageUrl(stream.thumbnail, 500)}
                        alt={stream.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85 group-hover:opacity-100"
                      />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-brand-crimson/90 group-hover:bg-brand-crimson text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 ml-0.5 text-brand-gold fill-current" />
                        </div>
                      </div>

                      {/* Badges */}
                      <span className="absolute bottom-2.5 right-2.5 bg-black/85 text-[10px] text-white font-mono px-2 py-0.5 rounded font-bold">
                        {stream.duration}
                      </span>

                      <span className="absolute top-2.5 left-2.5 bg-brand-gold text-brand-dark font-black text-[9px] uppercase px-2 py-0.5 rounded shadow">
                        {stream.category}
                      </span>

                      {stream.isLive && (
                        <span className="absolute top-2.5 right-2.5 bg-red-600 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded animate-pulse">
                          LIVE
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <h4 className="font-heading font-bold text-sm text-white group-hover:text-brand-gold transition-colors line-clamp-2 leading-snug">
                        {stream.title}
                      </h4>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {stream.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-3 bg-neutral-950 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="truncate pr-2 font-medium">{stream.presenter}</span>
                    <span className="text-brand-gold font-bold flex-shrink-0 group-hover:underline">
                      {isSelected ? 'Now Playing' : 'Play Video →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
