'use client';

import React, { useState } from 'react';
import { 
  Radio, 
  Pin, 
  Sparkles, 
  Clock, 
  Filter, 
  Send, 
  User, 
  Share2, 
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { LiveBlogData, LiveBlogUpdateItem } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export function LiveBlogTimeline({ initialLiveBlog }: { initialLiveBlog: LiveBlogData }) {
  const [liveBlog, setLiveBlog] = useState<LiveBlogData>(initialLiveBlog);
  const [showKeyEventsOnly, setShowKeyEventsOnly] = useState(false);
  const [newUpdateText, setNewUpdateText] = useState('');
  const [newUpdateTitle, setNewUpdateTitle] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isKeyEvent, setIsKeyEvent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, canPublishDirectly } = useAuth();

  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdateText.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await api.addLiveBlogUpdate({
        live_blog_id: liveBlog.id,
        title: newUpdateTitle.trim() || undefined,
        content: newUpdateText.trim(),
        author: {
          id: user?.id || 1,
          name: user?.name || 'Live Desk Reporter',
          designation: user?.designation || 'Live Reporter',
          avatar_url: user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        },
        is_pinned: isPinned,
        is_key_event: isKeyEvent,
      });

      setLiveBlog((prev) => ({
        ...prev,
        updates: [created, ...prev.updates],
      }));

      setNewUpdateText('');
      setNewUpdateTitle('');
      setIsPinned(false);
      setIsKeyEvent(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUpdates = showKeyEventsOnly
    ? liveBlog.updates.filter((u) => u.is_key_event || u.is_pinned)
    : liveBlog.updates;

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-3 sm:px-4 space-y-6">
      
      {/* Live Blog Banner Header */}
      <div className="bg-brand-dark rounded-brand p-6 text-white border-2 border-brand-crimson shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="bg-brand-crimson text-white font-black text-xs uppercase px-2.5 py-1 rounded flex items-center space-x-1.5 shadow">
              <Radio className="w-3.5 h-3.5 animate-pulse text-brand-gold" />
              <span>LIVE BLOG ENGINE</span>
            </span>
            <span className="text-xs text-brand-gold font-bold">
              📍 {liveBlog.event_location}
            </span>
          </div>

          <div className="text-xs text-gray-400 flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Started: {new Date(liveBlog.started_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} EAT</span>
          </div>
        </div>

        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white leading-tight">
          {liveBlog.title}
        </h1>

        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed border-l-2 border-brand-gold pl-3">
          {liveBlog.summary}
        </p>

        {/* Live Controls Bar */}
        <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={() => setShowKeyEventsOnly(!showKeyEventsOnly)}
            className={`px-3 py-1.5 rounded-full font-bold flex items-center space-x-1.5 transition-colors ${
              showKeyEventsOnly
                ? 'bg-brand-gold text-brand-dark'
                : 'bg-neutral-800 hover:bg-neutral-700 text-gray-300 border border-neutral-700'
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>{showKeyEventsOnly ? 'Showing Key Events' : 'Filter: Key Events Only'}</span>
          </button>

          <span className="text-gray-400">
            {liveBlog.updates.length} updates recorded
          </span>
        </div>
      </div>

      {/* Editorial Fast Post Box (For Reporters & Editors) */}
      {canPublishDirectly && (
        <form onSubmit={handlePostUpdate} className="bg-amber-50/80 rounded-brand p-4 border border-amber-300 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-900 uppercase tracking-wider">
              ⚡ Post Rapid Update (Reporter Desk: {user?.name})
            </span>
            <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">
              Autonomous Publishing Rights Active
            </span>
          </div>

          <input
            type="text"
            placeholder="Update Headline / Key Point (Optional)"
            value={newUpdateTitle}
            onChange={(e) => setNewUpdateTitle(e.target.value)}
            className="w-full text-xs bg-white border border-amber-200 rounded px-3 py-2 focus:outline-none focus:border-brand-crimson font-semibold"
          />

          <textarea
            rows={3}
            placeholder="Type breaking live update..."
            value={newUpdateText}
            onChange={(e) => setNewUpdateText(e.target.value)}
            className="w-full text-xs bg-white border border-amber-200 rounded px-3 py-2 focus:outline-none focus:border-brand-crimson leading-relaxed"
            required
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-4 text-xs text-gray-700">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-brand-crimson focus:ring-brand-crimson"
                />
                <span>Pin to top</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isKeyEvent}
                  onChange={(e) => setIsKeyEvent(e.target.checked)}
                  className="rounded text-brand-crimson focus:ring-brand-crimson"
                />
                <span>Key Event badge</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-brand-crimson hover:bg-brand-crimson-light text-white text-xs font-bold rounded flex items-center space-x-1.5 shadow transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Broadcasting...' : 'Broadcast Update'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:top-2 before:bottom-2 before:left-3 before:w-0.5 before:bg-gray-200">
        {filteredUpdates.map((update) => (
          <div
            key={update.id}
            className={`relative group bg-white rounded-brand border p-4 sm:p-5 shadow-card transition-all ${
              update.is_pinned
                ? 'border-brand-gold bg-amber-50/40 ring-2 ring-brand-gold/30'
                : 'border-gray-200'
            }`}
          >
            {/* Timeline Node Dot */}
            <span
              className={`absolute -left-6 sm:-left-8 top-5 w-3.5 h-3.5 rounded-full border-2 border-white shadow ${
                update.is_pinned ? 'bg-brand-crimson animate-pulse' : 'bg-brand-gold'
              }`}
            />

            {/* Meta Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-xs text-brand-crimson">
                  {new Date(update.published_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} EAT
                </span>
                
                {update.is_pinned && (
                  <span className="bg-brand-crimson text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded flex items-center space-x-1">
                    <Pin className="w-2.5 h-2.5" />
                    <span>PINNED</span>
                  </span>
                )}

                {update.is_key_event && (
                  <span className="bg-brand-gold text-brand-dark text-[10px] uppercase font-black px-1.5 py-0.5 rounded">
                    KEY EVENT
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                <img
                  src={update.author.avatar_url}
                  alt={update.author.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="font-semibold text-gray-700">{update.author.name}</span>
              </div>
            </div>

            {/* Title */}
            {update.title && (
              <h3 className="font-heading font-black text-base sm:text-lg text-brand-dark mb-2">
                {update.title}
              </h3>
            )}

            {/* Content */}
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
              {update.content}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
