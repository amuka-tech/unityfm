import React from 'react';
import { Metadata } from 'next';
import { Radio, ExternalLink, Calendar, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Listen Live — Radio Unity FM 97.7',
  description: 'Stream Radio Unity FM 97.7 live from Northern Uganda. Catch up on our latest shows and news.',
};

export default function ListenLivePage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Banner */}
      <div className="bg-gray-900 text-white pt-16 pb-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-6 animate-pulse">
            <Radio className="w-4 h-4" />
            ON AIR
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Radio Unity FM
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-medium mb-8">
            97.7 FM • Northern Uganda
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Player */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="w-full h-[500px] flex flex-col items-center justify-center bg-gray-900 text-white p-8 relative">
                {/* Background visualizer effect */}
                <div className="absolute inset-0 overflow-hidden opacity-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-crimson rounded-full blur-[100px] animate-pulse"></div>
                </div>
                
                <div className="relative z-10 text-center mb-12">
                  <div className="w-32 h-32 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-2xl border-4 border-gray-700">
                    <Radio className="w-16 h-16 text-brand-crimson" />
                  </div>
                  <h2 className="text-3xl font-black mb-2">Radio Unity FM</h2>
                  <p className="text-gray-400">97.7 FM • Live Broadcast</p>
                </div>

                <div className="relative z-10 w-full max-w-md bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-700">
                  <audio 
                    controls 
                    autoPlay 
                    className="w-full h-12"
                    src="https://stream.zeno.fm/27hu4m1x768uv"
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
              <p className="text-gray-600 text-sm">
                Prefer to listen on Radio Garden? You can find us there too!
              </p>
              <a 
                href="https://radio.garden/listen/radio-unity-fm-97-7/LHckS4Xk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-brand-crimson font-medium hover:text-red-700 transition-colors"
              >
                Open Radio Garden <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Info & Schedule */}
          <div className="space-y-6">
            
            {/* Now Playing Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-crimson"></div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Currently Playing</h3>
              <p className="text-xl font-bold text-gray-900 mb-1">Morning Breeze</p>
              <p className="text-gray-600">with DJ Okello</p>
            </div>

            {/* Simple Schedule */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-700" />
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
                  <div key={i} className="p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-500 w-28 flex-shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {slot.time}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{slot.show}</p>
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
