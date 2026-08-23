'use client';

import React, { useState } from 'react';
import { 
  Radio, 
  Key, 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  AlertTriangle, 
  Tv, 
  Clock, 
  ShieldAlert, 
  Wifi, 
  RefreshCw, 
  ExternalLink,
  Volume2
} from 'lucide-react';
import { BroadcastState } from '@/types';

interface BroadcastMcrDeskProps {
  broadcast: BroadcastState | null;
  onUpdateBroadcast: (state: Partial<BroadcastState>) => Promise<void>;
  streamKeys: any[];
  onGenerateKey: (label?: string) => Promise<any>;
  onRevokeKey: (key: string) => Promise<void>;
  canEditStream: boolean;
  notify: (msg: string) => void;
}

export function BroadcastMcrDesk({
  broadcast,
  onUpdateBroadcast,
  streamKeys,
  onGenerateKey,
  onRevokeKey,
  canEditStream,
  notify,
}: BroadcastMcrDeskProps) {
  // Form State
  const [streamHls, setStreamHls] = useState(broadcast?.stream_url_hls || '');
  const [streamYoutube, setStreamYoutube] = useState(broadcast?.stream_url_youtube || '');
  const [isLive, setIsLive] = useState(broadcast?.is_live || false);
  const [nowPlayingTitle, setNowPlayingTitle] = useState(broadcast?.now_playing.title || '');
  const [nowPlayingHost, setNowPlayingHost] = useState(broadcast?.now_playing.presenter || '');
  const [nowPlayingStartTime, setNowPlayingStartTime] = useState(broadcast?.now_playing.start_time || '06:00');
  const [nowPlayingEndTime, setNowPlayingEndTime] = useState(broadcast?.now_playing.end_time || '09:00');
  const [upNextTitle, setUpNextTitle] = useState(broadcast?.up_next.title || '');
  const [upNextTime, setUpNextTime] = useState(broadcast?.up_next.time || '');
  const [upNextPresenter, setUpNextPresenter] = useState(broadcast?.up_next.presenter || '');
  const [isEmergencySlate, setIsEmergencySlate] = useState(broadcast?.is_emergency_slate || false);
  const [emergencyMessage, setEmergencyMessage] = useState(broadcast?.emergency_slate_message || '');
  const [keyLabel, setKeyLabel] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    notify(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcast) return;

    setIsSaving(true);
    try {
      await onUpdateBroadcast({
        stream_url_hls: streamHls,
        stream_url_youtube: streamYoutube,
        is_live: isLive,
        is_emergency_slate: isEmergencySlate,
        emergency_slate_message: emergencyMessage,
        now_playing: {
          ...broadcast.now_playing,
          title: nowPlayingTitle,
          presenter: nowPlayingHost,
          start_time: nowPlayingStartTime,
          end_time: nowPlayingEndTime,
        },
        up_next: {
          ...broadcast.up_next,
          title: upNextTitle,
          time: upNextTime,
          presenter: upNextPresenter,
        }
      });
      notify('Live Broadcast & on-air schedule parameters updated!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateKey = async () => {
    const res = await onGenerateKey(keyLabel || 'vMix Studio Desk');
    if (res) {
      setKeyLabel('');
      notify('New secure RTMP Stream Key generated!');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: MCR Status */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-semibold text-gray-900">Broadcast Master Control Room (MCR)</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${isLive ? 'bg-red-50 text-red-700 border-red-100' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                {isLive ? 'ON AIR' : 'OFF AIR'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Manage live RTMP ingest servers, stream keys, on-air bulletin schedules, and emergency test slates.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={async () => {
              const newStatus = !isLive;
              setIsLive(newStatus);
              await onUpdateBroadcast({ is_live: newStatus });
              notify(newStatus ? 'Livestream is now ON AIR' : 'Livestream ENDED');
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center space-x-2 ${
              isLive ? 'bg-white border border-red-200 hover:bg-red-50 text-red-700' : 'bg-brand-crimson hover:bg-red-700 text-white shadow-sm transition-all'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>{isLive ? 'END LIVESTREAM' : 'START LIVESTREAM'}</span>
          </button>
          <a
            href="/live"
            target="_blank"
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium flex items-center space-x-2"
          >
            <Tv className="w-4 h-4" />
            <span>Open Public Stream</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (7 cols): On-Air Bulletin & Stream Config Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveBroadcast} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
                <Tv className="w-4 h-4 text-gray-500" />
                <span>On-Air Schedule & Stream Configuration</span>
              </h3>
              <span className="text-xs text-gray-500">Real-Time Sync</span>
            </div>

            <div className="space-y-5 text-sm">
              
              {/* Show Title & Presenter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1.5">Now Playing Show Title</label>
                  <input
                    type="text"
                    value={nowPlayingTitle}
                    onChange={(e) => setNowPlayingTitle(e.target.value)}
                    placeholder="e.g. Lango Evening News"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    disabled={!canEditStream}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1.5">Anchor / Presenter Names</label>
                  <input
                    type="text"
                    value={nowPlayingHost}
                    onChange={(e) => setNowPlayingHost(e.target.value)}
                    placeholder="e.g. Sarah Awor"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    disabled={!canEditStream}
                  />
                </div>
              </div>

              {/* Time Window */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1.5">Broadcast Start Time</label>
                  <input
                    type="text"
                    value={nowPlayingStartTime}
                    onChange={(e) => setNowPlayingStartTime(e.target.value)}
                    placeholder="06:00"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    disabled={!canEditStream}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1.5">Broadcast End Time</label>
                  <input
                    type="text"
                    value={nowPlayingEndTime}
                    onChange={(e) => setNowPlayingEndTime(e.target.value)}
                    placeholder="09:00"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    disabled={!canEditStream}
                  />
                </div>
              </div>

              {/* Up Next Show */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-gray-700 font-medium mb-1.5">Up Next Program Title</label>
                  <input
                    type="text"
                    value={upNextTitle}
                    onChange={(e) => setUpNextTitle(e.target.value)}
                    placeholder="e.g. Lango Agro Focus"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    disabled={!canEditStream}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1.5">Up Next Time Slot</label>
                  <input
                    type="text"
                    value={upNextTime}
                    onChange={(e) => setUpNextTime(e.target.value)}
                    placeholder="09:00 - 10:30"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    disabled={!canEditStream}
                  />
                </div>
              </div>

              {/* HLS & YouTube URLs */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-gray-700 font-medium mb-1.5">Backup HLS Feed URL (.m3u8)</label>
                  <input
                    type="url"
                    value={streamHls}
                    onChange={(e) => setStreamHls(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    disabled={!canEditStream}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1.5">YouTube Live Stream Embed URL</label>
                  <input
                    type="url"
                    value={streamYoutube}
                    onChange={(e) => setStreamYoutube(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    disabled={!canEditStream}
                  />
                </div>
              </div>

              {/* Emergency Slate Toggle */}
              <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-gray-500" />
                      <span>Emergency Standby Technical Slate</span>
                    </span>
                    <span className="text-sm text-gray-600 mt-1 block">
                      Instantly replaces live video with technical test pattern & standby announcement.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isEmergencySlate}
                    onChange={(e) => setIsEmergencySlate(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    disabled={!canEditStream}
                  />
                </div>

                {isEmergencySlate && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-1.5">Custom Standby Notice</label>
                    <input
                      type="text"
                      value={emergencyMessage}
                      onChange={(e) => setEmergencyMessage(e.target.value)}
                      placeholder="We are currently transitioning between live studio broadcasts..."
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    />
                  </div>
                )}
              </div>

            </div>

            {canEditStream && (
              <div className="pt-4 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-brand-crimson hover:bg-red-700 text-white shadow-sm  rounded-lg px-4 py-2 text-sm font-medium transition-all"
                >
                  {isSaving ? 'Saving Parameters...' : 'Save Broadcast Parameters'}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Right (5 cols): Dynamic RTMP Stream Keys Manager */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-900">Dynamic RTMP Stream Keys</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-green-50 text-green-700 border-green-200">
                Webhook Auth: Active
              </span>
            </div>

            <p className="text-sm text-gray-600">
              Generate authenticated stream keys for broadcast software (vMix, OBS, Wirecast). Keys are validated against the database in real time upon connection.
            </p>

            {/* Ingest Server Quick Copy */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">RTMP Server URL:</span>
                <button
                  onClick={() => handleCopy('rtmp://localhost/live', 'RTMP URL')}
                  className="text-gray-900 hover:text-gray-600 flex items-center space-x-1 font-mono"
                >
                  <span>rtmp://localhost/live</span>
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Direct FLV URL:</span>
                <span className="text-gray-900 font-mono">http://localhost:8000/live/...</span>
              </div>
            </div>

            {/* Key Generator Input */}
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={keyLabel}
                onChange={(e) => setKeyLabel(e.target.value)}
                placeholder="Key Label (e.g. vMix Studio 1)"
                className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
              <button
                onClick={handleCreateKey}
                className="bg-brand-crimson hover:bg-red-700 text-white shadow-sm  rounded-lg px-4 py-2 text-sm font-medium transition-all flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Generate</span>
              </button>
            </div>

            {/* Active Keys List */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-900 block">
                Active Stream Keys ({streamKeys.length})
              </span>

              {streamKeys.length === 0 ? (
                <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center text-sm text-gray-500">
                  No stream keys generated yet.
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {streamKeys.map((k) => (
                    <div
                      key={k.id || k.stream_key}
                      className="p-4 bg-white border border-gray-200 rounded-lg flex items-center justify-between gap-3 text-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 truncate">{k.label || 'Studio Stream Key'}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-green-50 text-green-700 border-green-200">
                            VALID
                          </span>
                        </div>
                        <span className="font-mono text-gray-500 block truncate mt-1">
                          {k.stream_key}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          onClick={() => handleCopy(k.stream_key, 'Stream Key')}
                          className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                          title="Copy Stream Key"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRevokeKey(k.stream_key)}
                          className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-red-50 text-red-600 border-transparent hover:border-red-200 transition-colors"
                          title="Revoke Key"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

