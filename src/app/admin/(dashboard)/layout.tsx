'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Flame, X } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, currentRole, logout, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [lastSeenTime, setLastSeenTime] = useState<number>(0);
  const [isLive, setIsLive] = useState(true);
  const [recentTips, setRecentTips] = useState<any[]>([]);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);

  // Breaking News Modal State
  const [showBreakingModal, setShowBreakingModal] = useState(false);
  const [breakingHeadline, setBreakingHeadline] = useState('');
  const [breakingDetails, setBreakingDetails] = useState('');
  const [isPublishingBreaking, setIsPublishingBreaking] = useState(false);

  const handlePublishBreaking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!breakingHeadline.trim()) return;

    setIsPublishingBreaking(true);
    try {
      await api.createArticle({
        title: breakingHeadline,
        excerpt: breakingDetails,
        is_breaking: true,
        // Provide defaults for the quick publish
        category: { id: 1, name: 'Lira City', slug: 'lira-city', color: '#FFC20E' },
        location_tag: 'Regional',
      } as any);

      alert(`Breaking News "${breakingHeadline}" is now LIVE!`);
      setShowBreakingModal(false);
      setBreakingHeadline('');
      setBreakingDetails('');
      
      // Optionally refresh articles if we are on the newsroom page
      if (pathname.includes('newsroom')) {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to publish breaking news.');
    } finally {
      setIsPublishingBreaking(false);
    }
  };

  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/admin');
    }
  }, [user, isInitialized, router]);

  useEffect(() => {
    const saved = localStorage.getItem('admin-notifications-seen');
    if (saved) setLastSeenTime(Number(saved));
  }, []);

  useEffect(() => {
    if (user) {
      // Fetch tips for bell + sidebar badge
      api.getTips()
        .then(tips => {
          setRecentTips(tips.slice(0, 5));
        })
        .catch(console.error);

      // Fetch broadcast state
      api.getBroadcastState()
        .then(b => setIsLive(b?.is_live ?? true))
        .catch(console.error);

      // Fetch recent articles for bell dropdown
      api.getArticles()
        .then(arts => setRecentArticles(arts.slice(0, 5)))
        .catch(console.error);
    }
  }, [user]);

  const unreadTipsCount = recentTips.filter(t => new Date(t.submitted_at || t.created_at || 0).getTime() > lastSeenTime).length;
  const unreadArticlesCount = recentArticles.filter(a => new Date(a.published_at || a.created_at || 0).getTime() > lastSeenTime).length;
  const totalUnreadCount = unreadTipsCount + unreadArticlesCount;

  const handleMarkNotificationsSeen = () => {
    const now = Date.now();
    setLastSeenTime(now);
    localStorage.setItem('admin-notifications-seen', now.toString());
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/admin');
    }
  }, [isInitialized, user, router]);

  // Persist dark mode in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('admin-dark-mode');
    if (saved === 'true') setIsDarkMode(true);
  }, []);

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('admin-dark-mode', String(next));
      return next;
    });
  };

  if (!isInitialized || !user) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-brand-crimson border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium text-sm">Initializing secure terminal...</p>
        </div>
      </div>
    );
  }

  const getTabTitle = () => {
    if (pathname.includes('overview')) return 'Station Overview & Telemetry';
    if (pathname.includes('live-blog')) return 'Live Blog & Real-Time Reporting';
    if (pathname.includes('newsroom')) return 'Newsroom & Editorial Publishing';
    if (pathname.includes('streams')) return 'Broadcast Master Control Room (MCR)';
    if (pathname.includes('Schedule')) return '7-Day Weekly  Planner';
    if (pathname.includes('whistleblower')) return 'Whistleblower & Investigative Desk';
    if (pathname.includes('settings')) return 'Roles, Access Control & System Diagnostics';
    return 'Admin Dashboard';
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-[#F8F9FA] text-gray-900'}`}>
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        user={user}
        currentRole={currentRole}
        onLogout={logout}
        unreadTipsCount={unreadTipsCount}
        isLive={isLive}
        isDarkMode={isDarkMode}
      />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ml-0 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64 xl:ml-72'
        }`}
      >
        <AdminHeader
          activeTabTitle={getTabTitle()}
          onNewArticle={() => router.push('/admin/newsroom?new=true')}
          onNewStreamKey={() => router.push('/admin/streams?new=true')}
          onTriggerBreaking={() => setShowBreakingModal(true)}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentRole={currentRole}
          notification={null}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          recentTips={recentTips}
          recentArticles={recentArticles}
          totalUnread={totalUnreadCount}
          onMarkNotificationsSeen={handleMarkNotificationsSeen}
        />

        <main className={`flex-1 p-3 sm:p-5 lg:p-8 max-w-7xl w-full mx-auto space-y-6 transition-colors ${isDarkMode ? 'text-gray-100' : ''}`}>
          {children}
        </main>
      </div>

      {/* Quick-Publish Breaking News Modal */}
      {showBreakingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-gray-800 bg-red-900/20' : 'border-gray-100 bg-red-50'}`}>
              <div className="flex items-center space-x-2 text-brand-crimson">
                <Flame className="w-5 h-5 animate-pulse" />
                <h3 className="font-bold text-lg">Emergency Quick-Publish</h3>
              </div>
              <button 
                onClick={() => setShowBreakingModal(false)}
                className={`p-1 rounded-md transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handlePublishBreaking} className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Breaking Headline *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={breakingHeadline}
                  onChange={e => setBreakingHeadline(e.target.value)}
                  placeholder="e.g. BREAKING: Parliament Passes New Tax Bill"
                  className={`w-full rounded-xl px-4 py-3 border focus:ring-2 focus:ring-brand-crimson focus:border-brand-crimson outline-none transition-all ${
                    isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Short Details (Optional)
                </label>
                <textarea
                  rows={3}
                  value={breakingDetails}
                  onChange={e => setBreakingDetails(e.target.value)}
                  placeholder="Provide quick initial context. You can edit and expand on this later in the Newsroom."
                  className={`w-full rounded-xl px-4 py-3 border focus:ring-2 focus:ring-brand-crimson focus:border-brand-crimson outline-none transition-all ${
                    isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBreakingModal(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all border ${
                    isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishingBreaking}
                  className="px-6 py-2.5 rounded-lg text-sm font-bold bg-brand-crimson hover:bg-red-700 text-white shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  {isPublishingBreaking ? 'Publishing...' : 'Push Live Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
