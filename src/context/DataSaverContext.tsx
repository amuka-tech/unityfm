'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface DataSaverContextType {
  isDataSaver: boolean;
  toggleDataSaver: () => void;
  bytesSavedKB: number;
  addBytesSaved: (kb: number) => void;
  getImageUrl: (originalUrl: string, width?: number) => string;
  allowAutoplay: boolean;
}

const DataSaverContext = createContext<DataSaverContextType | undefined>(undefined);

export function DataSaverProvider({ children }: { children: React.ReactNode }) {
  const [isDataSaver, setIsDataSaver] = useState<boolean>(false);
  const [bytesSavedKB, setBytesSavedKB] = useState<number>(1420);

  useEffect(() => {
    // Check localStorage or browser Save-Data header
    const saved = localStorage.getItem('unity_data_saver');
    if (saved !== null) {
      setIsDataSaver(saved === 'true');
    } else if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const conn = (navigator as any).connection;
      if (conn && conn.saveData) {
        setIsDataSaver(true);
      }
    }
  }, []);

  const toggleDataSaver = () => {
    setIsDataSaver(prev => {
      const next = !prev;
      localStorage.setItem('unity_data_saver', String(next));
      if (next) {
        setBytesSavedKB(b => b + 380);
      }
      return next;
    });
  };

  const addBytesSaved = (kb: number) => {
    setBytesSavedKB(prev => prev + kb);
  };

  // When data saver is active, downscale image resolution and use higher compression
  const getImageUrl = (originalUrl: string, width: number = 800): string => {
    if (!originalUrl) return '';
    if (!isDataSaver) return originalUrl;

    // For Unsplash images, adjust query params for massive bandwidth savings
    if (originalUrl.includes('images.unsplash.com')) {
      const baseUrl = originalUrl.split('?')[0];
      return `${baseUrl}?w=${Math.min(width, 400)}&q=40&fm=webp&fit=crop`;
    }
    return originalUrl;
  };

  return (
    <DataSaverContext.Provider
      value={{
        isDataSaver,
        toggleDataSaver,
        bytesSavedKB,
        addBytesSaved,
        getImageUrl,
        allowAutoplay: !isDataSaver,
      }}
    >
      {children}
    </DataSaverContext.Provider>
  );
}

export function useDataSaver() {
  const context = useContext(DataSaverContext);
  if (!context) {
    throw new Error('useDataSaver must be used within a DataSaverProvider');
  }
  return context;
}
