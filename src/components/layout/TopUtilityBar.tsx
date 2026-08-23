'use client';

import React, { useEffect, useState } from 'react';
import { CloudSun, TrendingUp, TrendingDown, Wifi, ShieldAlert, Check, RefreshCw } from 'lucide-react';
import { useDataSaver } from '@/context/DataSaverContext';
import { api } from '@/lib/api';
import { WeatherData, CurrencyRate } from '@/types';

export function TopUtilityBar() {
  const { isDataSaver, toggleDataSaver, bytesSavedKB } = useDataSaver();
  const [meta, setMeta] = useState<{ weather: WeatherData; currency: CurrencyRate[]; localTime: string } | null>(null);
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    api.getMetaData().then(setMeta);

    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/Kampala',
      };
      setTimeStr(now.toLocaleDateString('en-GB', options) + ' EAT');
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-brand-dark text-gray-300 text-xs border-b border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-9 flex items-center justify-between">
        
        {/* Left: Date, Time & Lira City Weather */}
        <div className="flex items-center space-x-4">
          <span className="font-medium text-gray-200 hidden sm:inline-block" suppressHydrationWarning>
            {timeStr || 'Lira City, Uganda'}
          </span>

          {meta?.weather && (
            <div className="flex items-center space-x-1.5 bg-neutral-900/90 px-2 py-0.5 rounded border border-neutral-700 text-gray-200">
              <CloudSun className="w-3.5 h-3.5 text-brand-gold animate-pulse-slow" />
              <span className="font-semibold">{meta.weather.temperature_celsius}°C</span>
              <span className="text-gray-400 hidden md:inline">{meta.weather.city}</span>
              <span className="text-gray-500 hidden lg:inline">({meta.weather.humidity} hum)</span>
            </div>
          )}
        </div>

        {/* Center: Currency Forex Ticker */}
        <div className="hidden lg:flex items-center space-x-4 overflow-hidden text-neutral-300">
          <span className="text-[10px] uppercase font-bold tracking-wider text-brand-gold bg-black/40 px-1.5 py-0.5 rounded">
            Forex / UGX
          </span>
          {meta?.currency.slice(0, 3).map((c, i) => (
            <div key={i} className="flex items-center space-x-1">
              <span className="text-gray-400">{c.pair.split(' / ')[0]}:</span>
              <span className="font-medium text-white">{c.rate}</span>
              {c.trend === 'up' ? (
                <TrendingUp className="w-3 h-3 text-emerald-400 inline" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-400 inline" />
              )}
            </div>
          ))}
        </div>

        {/* Right: Data Saver Mode Switch & Quick Whistleblower */}
        <div className="flex items-center space-x-3">
          {/* Data Saver Mode Toggle */}
          <button
            onClick={toggleDataSaver}
            className={`flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full font-medium transition-all ${
              isDataSaver
                ? 'bg-amber-400 text-neutral-950 shadow-sm font-semibold'
                : 'bg-neutral-800 hover:bg-neutral-700 text-gray-300 border border-neutral-700'
            }`}
            title="Data-Saver mode limits high-res images and video autoplay for 3G mobile networks."
          >
            <Wifi className={`w-3 h-3 ${isDataSaver ? 'text-neutral-950' : 'text-brand-gold'}`} />
            <span className="text-[11px]">
              {isDataSaver ? 'Data-Saver ON' : 'Data-Saver'}
            </span>
            {isDataSaver && (
              <span className="hidden xl:inline text-[10px] bg-black/20 px-1 rounded font-normal">
                ~{bytesSavedKB}KB saved
              </span>
            )}
          </button>

          {/* Social Links */}
          <div className="hidden md:flex items-center space-x-2 text-gray-400">
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors"
              title="Unity TV WhatsApp Channel"
            >
              WhatsApp
            </a>
            <span className="text-neutral-700">•</span>
            <a
              href="https://www.youtube.com/@977unityfm"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-400 transition-colors"
              title="Unity TV YouTube"
            >
              YouTube
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
