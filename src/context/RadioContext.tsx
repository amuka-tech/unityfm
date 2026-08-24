'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface RadioContextType {
  isPlayerVisible: boolean;
  showPlayer: () => void;
  hidePlayer: () => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export function RadioProvider({ children }: { children: React.ReactNode }) {
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Optional: keep it visible across navigations if playing
  useEffect(() => {
    if (isPlaying && !isPlayerVisible) {
      setIsPlayerVisible(true);
    }
  }, [isPlaying]);

  return (
    <RadioContext.Provider value={{
      isPlayerVisible,
      showPlayer: () => setIsPlayerVisible(true),
      hidePlayer: () => setIsPlayerVisible(false),
      isPlaying,
      setIsPlaying
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
