'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const STREAM_URL = 'https://stream.zeno.fm/27hu4m1x768uv';

interface RadioContextType {
  isPlaying: boolean;
  isLoading: boolean;
  error: boolean;
  volume: number;
  isMuted: boolean;
  togglePlay: () => void;
  handleVolume: (volume: number) => void;
  toggleMute: () => void;
  // We keep isPlayerVisible in case we still want a sticky player
  isPlayerVisible: boolean;
  showPlayer: () => void;
  hidePlayer: () => void;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export function RadioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  useEffect(() => {
    // Create the global audio element
    const audio = new Audio();
    audio.preload = 'none';
    audioRef.current = audio;

    const handlePlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setError(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleError = (e: any) => {
      console.error('Audio stream error:', e);
      setIsPlaying(false);
      setIsLoading(false);
      setError(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      audio.src = ''; // Stop buffering
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      setError(false);
      audio.src = STREAM_URL;
      audio.play().catch((e) => {
        console.error('Playback failed', e);
        setError(true);
        setIsLoading(false);
      });
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolume = (v: number) => {
    const audio = audioRef.current;
    setVolume(v);
    if (audio) {
      audio.volume = v;
      if (v > 0 && isMuted) {
        audio.muted = false;
        setIsMuted(false);
      }
    }
  };

  return (
    <RadioContext.Provider value={{
      isPlaying,
      isLoading,
      error,
      volume,
      isMuted,
      togglePlay,
      handleVolume,
      toggleMute,
      isPlayerVisible,
      showPlayer: () => setIsPlayerVisible(true),
      hidePlayer: () => setIsPlayerVisible(false)
    }}>
      {children}
    </RadioContext.Provider>
  );
}

export function useRadio() {
  const context = useContext(RadioContext);
  if (context === undefined) {
    throw new Error('useRadio must be used within a RadioProvider');
  }
  return context;
}
