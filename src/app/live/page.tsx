import React from 'react';
import { api } from '@/lib/api';
import { LivePlayer } from '@/components/live/LivePlayer';
import { LiveChat } from '@/components/live/LiveChat';
import { ScheduleGuide } from '@/components/live/ScheduleGuide';
import { BroadcastJsonLd } from '@/components/seo/JsonLd';
import Link from 'next/link';
import { Radio, Tv, Calendar, Send, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Live TV Broadcast Center — Unity TV Uganda',
  description: 'Watch Unity TV Uganda streaming live from Lira City. High-definition live news bulletins, regional talk shows, and adaptive bitrate player for low-data mobile networks.',
};

export default async function LiveTvPage() {
  const [broadcastState] = await Promise.all([
    api.getBroadcastState(),
  ]);

  return (
    <div className="bg-brand-surface min-h-screen py-6 sm:py-8">
      <BroadcastJsonLd broadcast={broadcastState} />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 space-y-6">
        
        {/* Broadcast Header Bar */}
        <div className="bg-brand-dark text-white rounded-brand p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-brand-crimson shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-crimson flex items-center justify-center">
              <Radio className="w-5 h-5 text-brand-gold animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-black text-lg sm:text-xl text-white">
                  Unity TV Live Broadcast Center
                </span>
                <span className="bg-brand-crimson text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  ON AIR
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Broadcasting Across Northern Uganda &bull; <span className="text-brand-gold">Available on Youtube and Online Stream on our website.</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/shows"
              className="px-3.5 py-1.5 rounded-brand bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-gray-200 flex items-center space-x-1.5 border border-neutral-700 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-brand-gold" />
              <span>Weekly TV Guide (EPG)</span>
            </Link>

            <a
              href="https://wa.me/256772000000"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-brand bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center space-x-1.5 shadow transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp Studio</span>
            </a>
          </div>
        </div>

        {/* Top Leaderboard Ad */}

        {/* Main 2-Column Live Studio Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Player & Show Schedule (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Multi-source Player */}
            <LivePlayer broadcastState={broadcastState} />

            {/* Broadcast Details & Program Guide */}
            <ScheduleGuide broadcastState={broadcastState} />
          </div>

          {/* Right Column: Live Chat & Audience Feedback (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <LiveChat />
          </div>

        </div>

      </div>
    </div>
  );
}
