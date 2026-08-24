import React from 'react';
import { Metadata } from 'next';
import { Radio, ExternalLink, Calendar, Clock, Disc } from 'lucide-react';
import { ListenLivePlayer } from '@/components/radio/ListenLivePlayer';

export const metadata: Metadata = {
  title: 'Listen Live ?" Radio Unity FM 97.7',
  description: 'Stream Radio Unity FM 97.7 live from Northern Uganda. Catch up on our latest shows and news.',
};

export default function ListenLivePage() {
  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-12">
      {/* Hero Banner */}
      <div className="bg-brand-dark text-white pt-16 pb-32 px-4 sm:px-6 relative overflow-hidden border-b-4 border-brand-gold">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 bg-brand-crimson text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-8 animate-pulse shadow-lg">
            <Radio className="w-4 h-4" />
            ON AIR NOW
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight text-white drop-shadow-md">
            Radio Unity FM
          </h1>
          <p className="text-xl md:text-2xl text-brand-gold font-medium mb-4 flex items-center justify-center gap-3">
            <span className="w-8 h-[2px] bg-brand-gold/50 rounded-full"></span>
            97.7 FM
            <span className="w-8 h-[2px] bg-brand-gold/50 rounded-full"></span>
          </p>
          <p className="text-gray-400 max-w-lg mx-auto">
            Broadcasting live from Northern Uganda. The Voice of Lango, bringing you the latest news, culture, and entertainment.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Player */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden border border-gray-200">
              <ListenLivePlayer />
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                  <Disc className="w-6 h-6 text-brand-crimson" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Alternative Player</h4>
                  <p className="text-gray-500 text-sm">Having trouble connecting?</p>
                </div>
              </div>
              <a 
                href="https://radio.garden/listen/radio-unity-fm-97-7/LHckS4Xk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-medium transition-colors"
              >
                Listen on Radio Garden <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Info & Schedule */}
          <div className="space-y-6">
            
            {/* Now Playing Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 relative overflow-hidden group hover:border-brand-gold/50 transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold"></div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Currently Playing</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">Morning Breeze</p>
              <p className="text-gray-600 font-medium">with DJ Okello</p>
            </div>

            {/* Simple Schedule */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white flex items-center justify-center border border-gray-200 shadow-sm">
                  <Calendar className="w-4 h-4 text-brand-crimson" />
                </div>
                <h3 className="font-bold text-gray-900">Today's Schedule</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { time: '06:00 - 10:00', show: 'Morning Breeze' },
                  { time: '10:00 - 13:00', show: 'Midmorning Mix' },
                  { time: '13:00 - 16:00', show: 'Lango Talks' },
                  { time: '16:00 - 19:00', show: 'Evening Drive' },
                  { time: '19:00 - 20:00', show: 'News Hour' },
                  { time: '20:00 - 00:00', show: 'Night Shift' },
                ].map((slot, i) => (
                  <div key={i} className="p-4 sm:p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 w-28 flex-shrink-0 mt-0.5 bg-white border border-gray-200 px-2 py-1 rounded">
                      <Clock className="w-3.5 h-3.5 text-brand-gold" />
                      {slot.time}
                    </div>
                    <p className="text-sm font-bold text-gray-900 mt-1">{slot.show}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
