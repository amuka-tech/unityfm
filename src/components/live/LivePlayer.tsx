'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  Radio, 
  AlertTriangle, 
  Layers, 
  Wifi, 
  Tv, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { BroadcastState } from '@/types';
import { useDataSaver } from '@/context/DataSaverContext';

interface LivePlayerProps {
  broadcastState: BroadcastState;
}

export function LivePlayer({ broadcastState }: LivePlayerProps) {
  const { isDataSaver } = useDataSaver();
  const [isPlaying, setIsPlaying] = useState(!isDataSaver);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [selectedQuality, setSelectedQuality] = useState<'Auto' | '1080p' | '720p' | '480p' | '240p'>(isDataSaver ? '240p' : 'Auto');
  const [selectedSource, setSelectedSource] = useState<'direct' | 'hls' | 'youtube'>('direct');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mpegtsPlayerRef = useRef<any>(null);

  const directStreamUrl = process.env.NEXT_PUBLIC_LIVE_STREAM_FLV || 'http://localhost:8000/live/live_utv_lira2026.flv';

  // Attach and manage mpegts.js player for Ultra-Low Latency direct vMix feed
  useEffect(() => {
    let player: any = null;

    if (selectedSource === 'direct' && videoRef.current) {
      setStreamError(null);
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

            player.attachMediaElement(videoRef.current!);
            player.load();

            // Set initial volume & mute state
            if (videoRef.current) {
              videoRef.current.volume = volume;
              videoRef.current.muted = isMuted;
            }

            if (isPlaying) {
              player.play().catch(() => {
                // If browser blocks unmuted autoplay, mute and retry
                if (videoRef.current) {
                  videoRef.current.muted = true;
                  setIsMuted(true);
                  player.play().catch(() => {});
                }
              });
            }

            player.on(mpegts.default.Events.ERROR, (errType: any, errDetail: any) => {
              console.warn('[LivePlayer] mpegts stream warning:', errType, errDetail);
            });

            mpegtsPlayerRef.current = player;
          } catch (e: any) {
            console.error('[LivePlayer] Failed to initialize mpegts player:', e);
            setStreamError('Direct vMix stream initializing...');
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
  }, [selectedSource, directStreamUrl]);

  useEffect(() => {
    if (isDataSaver) {
      setSelectedQuality('240p');
    }
  }, [isDataSaver]);

  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (videoRef.current) {
      if (nextState) {
        videoRef.current.play().catch(() => {});
        mpegtsPlayerRef.current?.play?.();
      } else {
        videoRef.current.pause();
        mpegtsPlayerRef.current?.pause?.();
      }
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = nextMuted ? 0 : volume;
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      if (newVol > 0 && isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => console.error(err));
      setIsFullscreen(false);
    }
  };

  // If station is currently in emergency / off-air test slate mode
  if (broadcastState.is_emergency_slate) {
    return (
      <div className="relative aspect-video w-full bg-neutral-950 rounded-brand border-2 border-brand-crimson overflow-hidden flex flex-col items-center justify-center p-6 text-center text-white">
        {/* Test Pattern Visual Effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex">
          <div className="h-full w-1/7 bg-white" />
          <div className="h-full w-1/7 bg-yellow-400" />
          <div className="h-full w-1/7 bg-cyan-400" />
          <div className="h-full w-1/7 bg-green-500" />
          <div className="h-full w-1/7 bg-purple-500" />
          <div className="h-full w-1/7 bg-red-600" />
          <div className="h-full w-1/7 bg-blue-700" />
        </div>

        <div className="relative z-10 max-w-md space-y-3">
          <div className="w-12 h-12 rounded-full bg-brand-crimson/90 mx-auto flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-6 h-6 text-brand-gold" />
          </div>
          <h3 className="font-heading font-black text-xl text-brand-gold">
            UNITY TV STANDBY SLATE
          </h3>
          <p className="text-xs text-gray-300">
            {broadcastState.emergency_slate_message ||
              'We are currently transitioning between live studio broadcasts from Lira City. Live feed will resume momentarily.'}
          </p>
          <div className="bg-neutral-900 border border-neutral-800 rounded p-2 text-xs text-gray-400">
            Up Next: <strong className="text-white">{broadcastState.up_next.title}</strong> at {broadcastState.up_next.time}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={playerContainerRef}
      className="relative aspect-video w-full bg-black rounded-brand overflow-hidden shadow-2xl border border-neutral-800 group select-none"
    >
      {/* Video Content Layer */}
      {selectedSource === 'direct' ? (
        <video
          ref={videoRef}
          controls={false}
          autoPlay={isPlaying}
          muted={isMuted}
          playsInline
          className="w-full h-full object-contain bg-black"
        />
      ) : selectedSource === 'youtube' ? (
        <iframe
          src={`${broadcastState.stream_url_youtube}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}`}
          title="Unity TV Live Broadcast"
          className="w-full h-full border-0 pointer-events-auto"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          ref={videoRef}
          src={broadcastState.stream_url_hls}
          controls
          autoPlay={isPlaying}
          muted={isMuted}
          playsInline
          className="w-full h-full object-contain"
        />
      )}

      {/* Floating Click to Unmute Badge */}
      {isMuted && isPlaying && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30">
          <button
            onClick={toggleMute}
            className="flex items-center space-x-2 px-4 py-2 bg-black/80 hover:bg-brand-crimson backdrop-blur-md text-white text-xs font-black rounded-full border border-neutral-700 shadow-2xl transition-all transform hover:scale-105 animate-bounce"
          >
            <VolumeX className="w-4 h-4 text-brand-gold" />
            <span>Click to Enable Audio</span>
          </button>
        </div>
      )}

      {/* Top Overlay Banner (Station Logo & Live Indicator) */}
      <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center space-x-2.5 pointer-events-auto">
          {/* Live Badge */}
          <div className="flex items-center space-x-1.5 bg-brand-crimson text-white px-2.5 py-1 rounded font-black text-xs uppercase tracking-wider shadow">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>LIVE ON AIR</span>
          </div>

          <span className="text-xs font-bold text-gray-200 hidden sm:inline drop-shadow">
            {broadcastState.channel_name} &bull; <span className="text-brand-gold text-[11px] font-normal">HD Live Broadcast</span>
          </span>
        </div>

        {/* Source Switcher & Data Saver Badge */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {isDataSaver && (
            <span className="bg-amber-400 text-brand-dark text-[10px] font-black uppercase px-2 py-0.5 rounded shadow flex items-center space-x-1">
              <Wifi className="w-2.5 h-2.5" />
              <span>3G Low-Data</span>
            </span>
          )}

          <div className="flex items-center bg-black/70 backdrop-blur-sm rounded border border-neutral-700 p-0.5 text-xs text-gray-300">
            <button
              onClick={() => setSelectedSource('direct')}
              className={`px-2.5 py-1 rounded text-[10px] font-black uppercase flex items-center space-x-1 ${
                selectedSource === 'direct' ? 'bg-brand-crimson text-white shadow' : 'hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
              <span>Direct Studio Feed</span>
            </button>
            <button
              onClick={() => setSelectedSource('hls')}
              className={`px-2 py-1 rounded text-[10px] font-bold ${
                selectedSource === 'hls' ? 'bg-brand-gold text-brand-dark' : 'hover:text-white'
              }`}
            >
              HLS Stream
            </button>
            <button
              onClick={() => setSelectedSource('youtube')}
              className={`px-2 py-1 rounded text-[10px] font-bold ${
                selectedSource === 'youtube' ? 'bg-red-600 text-white' : 'hover:text-white'
              }`}
            >
              YouTube
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Custom Control Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between z-20 text-white opacity-0 group-hover:opacity-100 transition-opacity">
        
        {/* Left Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={togglePlay}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-5 h-5 text-brand-gold" /> : <Play className="w-5 h-5 text-brand-gold fill-current" />}
          </button>

          {/* Volume Control with Slider */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={toggleMute}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-brand-gold" />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-16 sm:w-20 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-brand-gold"
              title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
            />
          </div>

          <div className="text-xs font-semibold text-gray-300 hidden md:block">
            On Air: <span className="text-white">{broadcastState.now_playing.title}</span>
          </div>
        </div>

        {/* Right Controls: Quality Menu & Fullscreen */}
        <div className="flex items-center space-x-3 relative">
          
          {/* Quality Selector */}
          <div className="relative">
            <button
              onClick={() => setShowQualityMenu(!showQualityMenu)}
              className="flex items-center space-x-1 px-2 py-1 bg-black/60 hover:bg-neutral-800 rounded border border-neutral-700 text-xs font-bold text-gray-200"
            >
              <Settings className="w-3.5 h-3.5 text-brand-gold" />
              <span>{selectedQuality}</span>
            </button>

            {showQualityMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-36 bg-neutral-900 border border-neutral-700 rounded shadow-xl py-1 z-30">
                <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase border-b border-neutral-800">
                  Select Bitrate
                </div>
                {(['Auto', '1080p', '720p', '480p', '240p'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setSelectedQuality(q);
                      setShowQualityMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                      selectedQuality === q ? 'bg-brand-gold text-brand-dark font-black' : 'text-gray-300 hover:bg-neutral-800'
                    }`}
                  >
                    <span>{q}</span>
                    {q === '240p' && <span className="text-[9px] text-gray-400">Data-Saver</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 hover:bg-white/20 rounded transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
