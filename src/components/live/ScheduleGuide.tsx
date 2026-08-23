'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, User, Calendar, Tv, ArrowRight } from 'lucide-react';
import { BroadcastState } from '@/types';

export function ScheduleGuide({ broadcastState }: { broadcastState: BroadcastState }) {
  const { now_playing, up_next } = broadcastState;

  return (
    <div className="bg-white rounded-brand border border-gray-200 p-5 shadow-card space-y-5">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center space-x-2">
          <Tv className="w-4 h-4 text-brand-crimson" />
          <h3 className="font-heading font-black text-base text-brand-dark">
            Broadcast Lineup & Guide
          </h3>
        </div>
        <Link
          href="/shows"
          className="text-xs font-bold text-brand-crimson hover:underline flex items-center space-x-1"
        >
          <span>Full Weekly EPG Schedule</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Now Playing Card */}
      <div className="bg-amber-50/80 rounded-brand p-4 border border-amber-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="bg-brand-crimson text-white font-black text-[10px] uppercase px-2 py-0.5 rounded shadow-sm flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>NOW PLAYING</span>
          </span>
          <span className="text-xs font-mono font-bold text-amber-900">
            {now_playing.start_time} – {now_playing.end_time}
          </span>
        </div>

        <div className="flex space-x-3 items-center">
          {now_playing.presenter_image && (
            <img
              src={now_playing.presenter_image}
              alt={now_playing.presenter}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400 flex-shrink-0"
            />
          )}
          <div>
            <h4 className="font-heading font-black text-base text-brand-dark">
              {now_playing.title}
            </h4>
            <p className="text-xs text-gray-600 mt-0.5">
              Host: <strong>{now_playing.presenter}</strong>
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-700 leading-relaxed">
          {now_playing.description}
        </p>

        {/* Live Broadcast Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-gray-500">
            <span>Show Progress</span>
            <span>{now_playing.progress_percentage || 65}%</span>
          </div>
          <div className="w-full h-1.5 bg-amber-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-crimson rounded-full"
              style={{ width: `${now_playing.progress_percentage || 65}%` }}
            />
          </div>
        </div>
      </div>

      {/* Up Next Card */}
      <div className="bg-neutral-50 rounded-brand p-4 border border-gray-200 space-y-2">
        <div className="flex items-center justify-between">
          <span className="bg-neutral-800 text-gray-200 font-bold text-[10px] uppercase px-2 py-0.5 rounded">
            UP NEXT
          </span>
          <span className="text-xs font-mono font-semibold text-gray-500">
            {up_next.time}
          </span>
        </div>

        <h4 className="font-heading font-bold text-sm text-gray-900">
          {up_next.title}
        </h4>
        {up_next.presenter && (
          <p className="text-xs text-gray-500">
            Hosted by {up_next.presenter}
          </p>
        )}
      </div>

      {/* Direct WhatsApp Call-in / Reaction Notice */}
      <div className="bg-emerald-50 rounded p-3 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
        <span>Want to send a voice note to the live studio?</span>
        <a
          href="https://wa.me/256772000000"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold underline text-emerald-800"
        >
          WhatsApp Studio
        </a>
      </div>
    </div>
  );
}
