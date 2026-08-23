'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Newspaper, 
  Radio, 
  ShieldAlert, 
  DollarSign, 
  TrendingUp, 
  Tv, 
  ArrowUpRight, 
  Volume2, 
  VolumeX, 
  Flame
} from 'lucide-react';
import Link from 'next/link';
import { Article, BroadcastState, EpgProgram } from '@/types';

interface OverviewDeskProps {
  articles: Article[];
  broadcast: BroadcastState | null;
  epg: EpgProgram[];
  tips: any[];
  onNavigateTab: (tab: any) => void;
  onNewArticle: () => void;
  onNewStreamKey: () => void;
}

export function OverviewDesk({
  articles,
  broadcast,
  epg,
  tips,
  onNavigateTab,
  onNewArticle,
  onNewStreamKey,
}: OverviewDeskProps) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mpegtsPlayerRef = useRef<any>(null);

  const directStreamUrl = process.env.NEXT_PUBLIC_LIVE_STREAM_FLV || 'http://localhost:8000/live/live_utv_lira2026.flv';

  useEffect(() => {
    let player: any = null;

    if (videoRef.current) {
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

            player.on(mpegts.default.Events.ERROR, (errorType: any, errorDetail: any) => {
              console.warn('Live stream disconnected:', errorType, errorDetail);
            });
            player.attachMediaElement(videoRef.current!);
            player.load();
            if (videoRef.current) {
              videoRef.current.muted = isMuted;
            }
            player.play().catch(() => {});
            mpegtsPlayerRef.current = player;
          } catch (e) {}
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
  }, [directStreamUrl]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
  };

  const [vuLevelL, setVuLevelL] = useState(65);
  const [vuLevelR, setVuLevelR] = useState(68);

  useEffect(() => {
    const interval = setInterval(() => {
      setVuLevelL(Math.floor(50 + Math.random() * 45));
      setVuLevelR(Math.floor(52 + Math.random() * 43));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const totalViews = articles.reduce((acc, a) => acc + (a.view_count || 0), 0);
  const breakingArticles = articles.filter(a => a.is_breaking);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Dashboard Overview</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your live broadcast, edit news, and monitor performance.
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-3">
          <button 
            onClick={onNewArticle}
            className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all"
          >
            Create Article
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-lg p-5 border border-gray-200 space-y-3 hover:border-gray-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase">Total Reads</span>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-semibold text-gray-900">
              {totalViews.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-green-600">
              +14.8%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200 space-y-3 hover:border-gray-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase">Articles</span>
            <Newspaper className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-semibold text-gray-900">
              {articles.length}
            </span>
            <span className="text-xs font-medium text-gray-500">
              {breakingArticles.length} breaking
            </span>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('whistleblower')}
          className="bg-white rounded-lg p-5 border border-gray-200 space-y-3 hover:border-gray-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase">Tips</span>
            <ShieldAlert className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-semibold text-gray-900">
              {tips.length}
            </span>
            <span className="text-xs font-medium text-gray-500">
              pending review
            </span>
          </div>
        </div>



      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Stream Monitor */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h3 className="text-sm font-semibold text-gray-900">Live Monitor</h3>
            </div>
            <button
              onClick={() => onNavigateTab('broadcast')}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-md px-3 py-1.5 text-xs font-medium transition-all"
            >
              MCR Controls
            </button>
          </div>

          <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden">
            <video
              ref={videoRef}
              controls={false}
              autoPlay
              muted={isMuted}
              playsInline
              className="w-full h-full object-contain"
            />
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                Live
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800/80 text-gray-100 backdrop-blur-sm border border-gray-700">
                1080p60
              </span>
            </div>
            <button
              onClick={toggleMute}
              className="absolute bottom-4 right-4 p-2 rounded-lg bg-gray-900/80 hover:bg-gray-900 text-white backdrop-blur-sm transition-all"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-4 grid grid-cols-4 gap-4 bg-white border-t border-gray-200">
            <div>
              <span className="text-xs text-gray-500 font-medium block">Latency</span>
              <span className="text-sm font-medium text-gray-900 block mt-1">~0.85s</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium block">Video Codec</span>
              <span className="text-sm font-medium text-gray-900 block mt-1">H.264 High</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium block">Audio Codec</span>
              <span className="text-sm font-medium text-gray-900 block mt-1">AAC 48kHz</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium block">Drop Rate</span>
              <span className="text-sm font-medium text-gray-900 block mt-1">0.00%</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
              <Radio className="w-4 h-4 text-gray-500" />
              <span>Current Broadcast</span>
            </h3>
            
            <div className="space-y-4 pt-2">
              <div>
                <span className="text-xs text-gray-500 font-medium block">Now Airing</span>
                <span className="text-sm font-medium text-gray-900 block mt-1">
                  {broadcast?.now_playing.title || 'Evening News'}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium block">Presenters</span>
                <span className="text-sm text-gray-900 block mt-1">
                  {broadcast?.now_playing.presenter || 'News Desk'}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium block">Schedule</span>
                <span className="text-sm text-gray-900 font-mono block mt-1">
                  {broadcast?.now_playing.start_time || '06:00'} - {broadcast?.now_playing.end_time || '09:00'}
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium block">Up Next</span>
              <span className="text-sm font-medium text-gray-900 block mt-1">
                {broadcast?.up_next.title || 'Agro Focus'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
              <Flame className="w-4 h-4 text-gray-500" />
              <span>Quick Actions</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onNewArticle}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg p-3 text-sm font-medium transition-all flex flex-col items-start gap-2"
              >
                <Newspaper className="w-4 h-4 text-gray-500" />
                <span>New Article</span>
              </button>
              <button
                onClick={onNewStreamKey}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg p-3 text-sm font-medium transition-all flex flex-col items-start gap-2"
              >
                <Radio className="w-4 h-4 text-gray-500" />
                <span>Stream Key</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
            <Newspaper className="w-4 h-4 text-gray-500" />
            <span>Recent Publications</span>
          </h3>
          <button
            onClick={() => onNavigateTab('newsroom')}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            View All &rarr;
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          {articles.slice(0, 5).map((art) => (
            <div key={art.id} className="p-4 flex items-center justify-between group hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <img
                  src={art.featured_image}
                  alt={art.title}
                  className="w-16 h-10 rounded-md object-cover border border-gray-200"
                />
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium border bg-white"
                      style={{ color: art.category.color, borderColor: `${art.category.color}40` }}
                    >
                      {art.category.name}
                    </span>
                    {art.is_breaking && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-red-50 text-red-700 border-red-100">
                        Breaking
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {art.title}
                  </h4>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 font-mono hidden sm:inline">
                  {art.view_count?.toLocaleString() || 0} views
                </span>
                <Link
                  href={`/news/${art.category.slug}/${art.slug}`}
                  target="_blank"
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}


