'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Plus, Flame, Bell, Settings, Sun, Moon, X, ShieldAlert, FileText, ChevronRight, Calendar } from 'lucide-react';
import { Role } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
  onNewArticle: () => void;
  onNewStreamKey: () => void;
  onTriggerBreaking: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentRole: Role | null;
  notification: string | null;
  activeTabTitle: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  recentTips?: any[];
  recentArticles?: any[];
  totalUnread?: number;
  onMarkNotificationsSeen?: () => void;
}

export function AdminHeader({
  onToggleMobileMenu,
  onNewArticle,
  onNewStreamKey,
  onTriggerBreaking,
  searchQuery,
  setSearchQuery,
  currentRole,
  notification,
  activeTabTitle,
  isDarkMode,
  onToggleDarkMode,
  recentTips = [],
  recentArticles = [],
  totalUnread = 0,
  onMarkNotificationsSeen,
}: AdminHeaderProps) {
  const router = useRouter();
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const handleToggleBell = () => {
    if (!showBellDropdown && onMarkNotificationsSeen) {
      onMarkNotificationsSeen();
    }
    setShowBellDropdown(prev => !prev);
  };

  // Close bell dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setShowBellDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`sticky top-0 z-30 border-b px-4 py-3 flex items-center justify-between shadow-sm transition-colors ${
      isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'
    }`}>
      
      {/* Left Area: Toggle & Search */}
      <div className="flex items-center space-x-4">
        {/* Mobile Drawer Trigger */}
        <button
          onClick={onToggleMobileMenu}
          className={`lg:hidden p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-500'}`}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className={`hidden sm:flex items-center border rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-brand-crimson/20 focus-within:border-brand-crimson transition-all w-64 lg:w-80 ${
          isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search here..."
            className={`bg-transparent border-none outline-none text-sm w-full placeholder-gray-400 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
          />
          <div className="ml-2 flex items-center space-x-1">
            <span className={`px-1.5 py-0.5 rounded border text-[10px] font-medium ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>Ctrl</span>
            <span className="text-[10px] text-gray-400">+</span>
            <span className={`px-1.5 py-0.5 rounded border text-[10px] font-medium ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>K</span>
          </div>
        </div>
      </div>

      {/* Right Area: Icons & Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        
        {/* Breaking News Trigger */}
        <button
          onClick={onTriggerBreaking}
          className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-yellow-600 bg-yellow-50 hover:bg-yellow-100 font-semibold text-xs flex items-center space-x-1 transition-colors"
          title="Emergency Breaking Alert"
        >
          <Flame className="w-4 h-4 animate-pulse" />
          <span className="hidden sm:inline">Breaking</span>
        </button>

        {/* Icon Set */}
        <div className={`hidden md:flex items-center space-x-1 border-r pr-3 mr-1 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-yellow-400 hover:bg-gray-700 bg-gray-800' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings */}
          <button
            onClick={() => router.push('/admin/settings')}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
            title="Roles & Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Bell Notification */}
          <div className="relative" ref={bellRef}>
            <button
              onClick={handleToggleBell}
              className={`p-2 rounded-lg transition-colors relative ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'} ${showBellDropdown ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {totalUnread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-crimson border border-white" />
              )}
            </button>

            {/* Bell Dropdown Panel */}
            {showBellDropdown && (
              <div className={`absolute right-0 top-full mt-2 w-80 rounded-xl shadow-xl border z-50 overflow-hidden ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                {/* Header */}
                <div className={`flex items-center justify-between px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <span className={`font-bold text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    Notifications
                    {totalUnread > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-crimson text-white">{totalUnread}</span>
                    )}
                  </span>
                  <button onClick={() => setShowBellDropdown(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {/* Whistleblower Tips */}
                  {recentTips.length > 0 && (
                    <div>
                      <div className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500 bg-gray-900' : 'text-gray-400 bg-gray-50'}`}>
                        🔒 New Whistleblower Tips
                      </div>
                      {recentTips.slice(0, 3).map((tip: any, i: number) => (
                        <Link
                          key={i}
                          href="/admin/whistleblower"
                          onClick={() => setShowBellDropdown(false)}
                          className={`flex items-start space-x-3 px-4 py-3 border-b transition-colors ${
                            isDarkMode
                              ? 'border-gray-700 hover:bg-gray-700'
                              : 'border-gray-50 hover:bg-red-50'
                          }`}
                        >
                          <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                            <ShieldAlert className="w-4 h-4 text-brand-crimson" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-bold truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{tip.topic || 'Encrypted Tip'}</p>
                            <p className={`text-[11px] truncate mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tip.district || 'Location sealed'} · {new Date(tip.submitted_at).toLocaleDateString()}</p>
                          </div>
                          <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0 mt-1" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Recent Articles */}
                  {recentArticles.length > 0 && (
                    <div>
                      <div className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500 bg-gray-900' : 'text-gray-400 bg-gray-50'}`}>
                        📰 Recently Published
                      </div>
                      {recentArticles.slice(0, 3).map((art: any, i: number) => (
                        <Link
                          key={i}
                          href="/admin/newsroom"
                          onClick={() => setShowBellDropdown(false)}
                          className={`flex items-start space-x-3 px-4 py-3 border-b transition-colors ${
                            isDarkMode
                              ? 'border-gray-700 hover:bg-gray-700'
                              : 'border-gray-50 hover:bg-blue-50'
                          }`}
                        >
                          <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-bold truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{art.title}</p>
                            <p className={`text-[11px] truncate mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{art.category?.name || art.category_name} · {new Date(art.published_at).toLocaleDateString()}</p>
                          </div>
                          <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0 mt-1" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Empty state */}
                  {totalUnread === 0 && (
                    <div className={`px-4 py-8 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-xs font-medium">All caught up!</p>
                      <p className="text-[11px] mt-0.5">No new tips or articles</p>
                    </div>
                  )}
                </div>

                {/* Footer links */}
                <div className={`flex border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <Link
                    href="/admin/whistleblower"
                    onClick={() => setShowBellDropdown(false)}
                    className={`flex-1 py-2.5 text-center text-xs font-bold border-r transition-colors ${
                      isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-700' : 'border-gray-100 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    View All Tips
                  </Link>
                  <Link
                    href="/admin/newsroom"
                    onClick={() => setShowBellDropdown(false)}
                    className={`flex-1 py-2.5 text-center text-xs font-bold transition-colors ${
                      isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    View Newsroom
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Program Guide Action */}
        <button
          onClick={() => router.push('/admin/epg')}
          className="hidden lg:flex items-center space-x-1 px-3 sm:px-4 py-2 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all"
        >
          <Calendar className="w-4 h-4" />
          <span>Program Guide</span>
        </button>

        {/* New Article Action */}
        <button
          onClick={onNewArticle}
          className="flex items-center space-x-1 px-3 sm:px-4 py-2 rounded-lg bg-brand-crimson hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Story</span>
        </button>

      </div>
    </header>
  );
}
