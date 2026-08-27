'use client';

import React, { useState } from 'react';
import { Radio, Mic, Signal, Play, Square, Save, ExternalLink, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { getScheduleScheduleDb } from '@/lib/server-actions';

export function RadioStudioDesk() {
  const [isOnAir, setIsOnAir] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const streamUrl = 'https://radio.garden/api/ara/content/listen/LHckS4Xk/channel.mp3';

  const [nowPlaying, setNowPlaying] = useState({
    showName: 'Morning Breeze',
    presenterName: 'DJ Okello',
    description: 'Wake up with the best music and news.'
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Now Playing info updated!');
    }, 800);
  };

  const handleAutoSync = async () => {
    setIsSyncing(true);
    try {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const now = new Date();
      const currentDay = days[now.getDay()];
      
      const currentTimeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

      const schedule = await getScheduleScheduleDb(currentDay);
      
      const currentProgram = schedule.find(prog => {
        return prog.start_time <= currentTimeStr && prog.end_time >= currentTimeStr;
      });

      if (currentProgram) {
        setNowPlaying({
          showName: currentProgram.show_name,
          presenterName: currentProgram.presenter_name || 'Unity Staff',
          description: currentProgram.description || currentProgram.category || ''
        });
        alert(`Successfully synced with: ${currentProgram.show_name}`);
      } else {
        alert('No scheduled program found for the current time.');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to sync with EPG.');
    }
    setIsSyncing(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Status */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Mic className="w-6 h-6 text-brand-crimson" />
              Radio Studio Control
            </h2>
            <p className="text-sm text-gray-600 mt-1">Manage the live broadcast and Now Playing info.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-full border text-sm font-bold flex items-center gap-2 ${
              isOnAir 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : 'bg-gray-100 text-gray-700 border-gray-300'
            }`}>
              <Signal className={`w-4 h-4 ${isOnAir ? 'animate-pulse' : ''}`} />
              {isOnAir ? 'STREAM ONLINE' : 'STREAM OFFLINE'}
            </div>
            
            <button
              onClick={() => setIsOnAir(!isOnAir)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium transition-colors ${
                isOnAir 
                  ? 'bg-gray-900 hover:bg-gray-800' 
                  : 'bg-brand-crimson hover:bg-red-700'
              }`}
            >
              {isOnAir ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isOnAir ? 'Take Off Air' : 'Go On Air'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Stream Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Radio className="w-4 h-4" /> Stream Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Public Audio Stream URL (Icecast/MP3)</label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={streamUrl}
                    className="bg-transparent text-sm text-gray-600 w-full outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Radio Garden Embed</label>
                <a 
                  href="https://radio.garden/listen/radio-unity-fm-97-7/LHckS4Xk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-brand-crimson hover:underline"
                >
                  Open Stream Link <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-2">Need to update the schedule?</h3>
            <p className="text-sm text-gray-600 mb-4">The daily radio shows and programme timings are managed in the schedule desk.</p>
            <Link 
              href="/admin/epg"
              className="inline-flex items-center justify-center w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Go to Programme Schedule
            </Link>
          </div>
        </div>

        {/* Now Playing Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Play className="w-4 h-4" /> Now Playing Metadata
              </h3>
              <button 
                onClick={handleAutoSync}
                disabled={isSyncing}
                className="flex items-center gap-2 text-sm font-medium text-brand-crimson hover:text-red-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                Auto-Fill from EPG
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Current Show Name</label>
                <input 
                  type="text" 
                  value={nowPlaying.showName}
                  onChange={e => setNowPlaying({...nowPlaying, showName: e.target.value})}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:border-brand-crimson focus:ring-1 focus:ring-brand-crimson outline-none transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Presenter Name</label>
                <input 
                  type="text" 
                  value={nowPlaying.presenterName}
                  onChange={e => setNowPlaying({...nowPlaying, presenterName: e.target.value})}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:border-brand-crimson focus:ring-1 focus:ring-brand-crimson outline-none transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Show Description (Short)</label>
                <textarea 
                  rows={3}
                  value={nowPlaying.description}
                  onChange={e => setNowPlaying({...nowPlaying, description: e.target.value})}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:border-brand-crimson focus:ring-1 focus:ring-brand-crimson outline-none transition-shadow resize-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-brand-crimson hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Update Metadata'}
                </button>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
