'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Radio, 
  Activity,
  Calendar,
  ShieldAlert,
  DollarSign,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Tv,
  X,
  Menu,
  Wheat
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (o: boolean) => void;
  user: any;
  currentRole: string | null;
  onLogout: () => void;
  unreadTipsCount?: number;
  isLive?: boolean;
  isDarkMode?: boolean;
}

export function AdminSidebar({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
  user,
  currentRole,
  onLogout,
  unreadTipsCount = 0,
  isLive = false,
  isDarkMode = false,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const role = currentRole || 'editor';

  const ALLOWED_ROUTES: Record<string, string[]> = {
    '/admin/overview': ['managing_director', 'super_admin', 'broadcast_director', 'news_editor'],
    '/admin/newsroom': ['managing_director', 'super_admin', 'news_editor', 'field_reporter'],
    '/admin/live-blog': ['managing_director', 'super_admin', 'broadcast_director', 'news_editor', 'field_reporter'],
    '/admin/streams': ['managing_director', 'super_admin', 'broadcast_director'],
    '/admin/epg': ['managing_director', 'super_admin', 'broadcast_director'],
    '/admin/agri': ['managing_director', 'super_admin', 'news_editor'],
    '/admin/whistleblower': ['managing_director', 'super_admin', 'news_editor'],
    '/admin/settings': ['managing_director', 'super_admin']
  };

  const allNavItems = [
    { href: '/admin/overview', label: 'Overview Dashboard', icon: LayoutDashboard },
    { href: '/admin/newsroom', label: 'Newsroom Editor', icon: FileText },
    { href: '/admin/live-blog', label: 'Live Blog Updates', icon: Activity, badge: 'LIVE', badgeColor: 'bg-red-500 text-white' },
    { href: '/admin/streams', label: 'Radio Studio', icon: Radio, badge: isLive ? 'ON AIR' : null, badgeColor: 'bg-red-500 text-white' },
    { href: '/admin/epg', label: 'Program Guide', icon: Calendar },
    { href: '/admin/agri', label: 'Agri-Market Desk', icon: Wheat },
    { href: '/admin/whistleblower', label: 'Tips & Leaks', icon: ShieldAlert, badge: unreadTipsCount > 0 ? `${unreadTipsCount}` : null, badgeColor: 'bg-brand-crimson text-white' },
    { href: '/admin/settings', label: 'Roles & Settings', icon: Users }
  ];

  // Filter items that the current role is allowed to see
  const navItems = allNavItems.filter(item => {
    const allowed = ALLOWED_ROUTES[item.href];
    return allowed && allowed.includes(role);
  });

  const adminItems: any[] = []; // Intentionally left empty as all items are now properly filtered through navItems

  const handleSelectTab = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  const renderNavItem = (item: any) => {
    const Icon = item.icon;
    const isActive = pathname.startsWith(item.href);
    return (
      <Link
        href={item.href}
        key={item.href}
        onClick={handleSelectTab}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-left transition-all group ${
          isActive
            ? isDarkMode ? 'bg-red-900/40 text-brand-crimson font-bold' : 'bg-red-50 text-brand-crimson font-bold'
            : isDarkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-100 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
        }`}
        title={isCollapsed && !mobileOpen ? item.label : undefined}
      >
        <div className="flex items-center space-x-3">
          <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-brand-crimson' : isDarkMode ? 'text-gray-500 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-600'}`} />
          {(!isCollapsed || mobileOpen) && (
            <span className="text-sm tracking-wide">{item.label}</span>
          )}
        </div>
        {(!isCollapsed || mobileOpen) && item.badge && (
          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${item.badgeColor}`}>
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen && setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 border-r transition-all duration-300 flex flex-col shadow-sm ${
          isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        } ${
          // Desktop positioning
          isCollapsed ? 'lg:w-20' : 'lg:w-64 xl:w-72'
        } ${
          // Mobile slide-over positioning
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        
        {/* Top Logo Area */}
        <div className={`h-16 flex items-center px-5 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex items-center space-x-2 text-brand-crimson">
            <Tv className="w-6 h-6 flex-shrink-0" />
            {(!isCollapsed || mobileOpen) && (
              <span className={`font-heading font-black text-xl tracking-tight`}>Unity<span className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>TV</span></span>
            )}
          </div>
          {mobileOpen && setMobileOpen && (
            <button onClick={() => setMobileOpen(false)} className="lg:hidden ml-auto p-1 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-none py-4 flex flex-col">
          {/* User Profile Card */}
          {(!isCollapsed || mobileOpen) ? (
            <div className={`mx-4 mb-6 p-3 border rounded-xl flex items-center space-x-3 shadow-xs relative group cursor-pointer ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user?.name || 'User'}
                className="w-10 h-10 rounded-lg object-cover ring-2 ring-white shadow-sm flex-shrink-0"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className={`text-sm font-bold truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{user?.name || 'Jane Doe'}</span>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">{role.replace('_', ' ')}</span>
              </div>
              <Menu className="w-4 h-4 text-gray-400 group-hover:text-gray-700 absolute right-3" />
            </div>
          ) : (
             <div className="flex justify-center mb-6">
                <img
                  src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  className="w-10 h-10 rounded-lg object-cover ring-1 ring-gray-200 shadow-sm"
                />
             </div>
          )}

          {/* Navigation Section */}
          <div className="px-3 space-y-1">
            {(!isCollapsed || mobileOpen) && (
              <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Navigation</h3>
            )}
            {navItems.map(renderNavItem)}
          </div>

          {/* Admin Panel Section */}
          {adminItems.length > 0 && (
            <div className="px-3 space-y-1 mt-6">
              {(!isCollapsed || mobileOpen) && (
                <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Admin Panel</h3>
              )}
              {adminItems.map(renderNavItem)}
            </div>
          )}
        </div>
        
        {/* Bottom Actions */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-white'}`}>
            {(!isCollapsed || mobileOpen) ? (
              <div className="flex flex-col space-y-2">
                <Link href="/" target="_blank" className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all border ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'}`}>
                  <ExternalLink className="w-4 h-4" />
                  <span>View Public Site</span>
                </Link>
                <button onClick={onLogout} className="w-full py-2.5 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center space-x-2 transition-all border border-red-100">
                  <LogOut className="w-4 h-4" />
                  <span>Log Out Securely</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link href="/" target="_blank" className={`w-full py-2.5 rounded-lg flex justify-center transition-all border ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'}`} title="View Site">
                  <ExternalLink className="w-5 h-5" />
                </Link>
                <button onClick={onLogout} className="w-full py-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex justify-center transition-all border border-red-100" title="Log Out">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
        </div>
      </aside>
    </>
  );
}
