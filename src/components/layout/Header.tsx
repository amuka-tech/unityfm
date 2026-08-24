'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Tv, 
  Menu, 
  X, 
  Search, 
  ChevronDown, 
  Radio, 
  Flame, 
  ShieldCheck, 
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { mockCategories } from '@/lib/mockData';
import { useDataSaver } from '@/context/DataSaverContext';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsDropdownOpen, setNewsDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeBlogTitle, setActiveBlogTitle] = useState<string | null>(null);
  const { isDataSaver } = useDataSaver();

  // Scroll listener for elevation shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch active live blog title
  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const { getLiveBlogsDb } = await import('@/lib/server-actions');
        const blogs = await getLiveBlogsDb();
        const active = blogs.find((b: any) => b.is_active === 1);
        setActiveBlogTitle(active ? active.title : null);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTitle();
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setNewsDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { 
      name: 'News', 
      href: '/news/lira-city',
      hasDropdown: true,
      subcategories: [
        { name: 'Lira City', href: '/news/lira-city', badge: 'Hub' },
        { name: 'Lango Sub-Region', href: '/news/lango-sub-region' },
        { name: 'Northern Uganda', href: '/news/northern-uganda' },
        { name: 'National & Kampala', href: '/news/national' },
        { name: 'Africa & EAC', href: '/news/africa' },
      ]
    },
    { name: 'Politics & Governance', href: '/politics' },
    { name: 'Business & Agriculture', href: '/business' },
    { name: 'Sports', href: '/sports' },
    { name: 'Lifestyle & Culture', href: '/lifestyle' },
    { name: 'Podcasts', href: '/podcasts' },
    { name: 'On Air Schedule', href: '/shows' },
    { name: 'Listen Live', href: '/listen' },
  ];

  return (
    <header className={`bg-white border-b border-gray-200 transition-shadow duration-300 ${
      isScrolled ? 'shadow-lg shadow-black/10' : 'shadow-sm'
    }`}>
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="group flex items-center space-x-2.5">
              <img 
                src="/unity-tv-logo.png" 
                alt="Unity TV Logo" 
                className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Center / Right: Live Broadcast CTA & Search & Admin */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Search Trigger */}
            <div className="relative">
              {searchOpen ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      window.location.href = `/news/lira-city?search=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                  className="flex items-center bg-gray-100 rounded-full px-3 py-1 border border-brand-gold"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Lira & Northern Uganda news..."
                    className="bg-transparent text-xs text-gray-800 focus:outline-none w-36 sm:w-60"
                    autoFocus
                  />
                  <button type="submit" className="text-gray-500 hover:text-brand-dark">
                    <Search className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-gray-600 hover:text-brand-dark hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Whistleblower News Tip Pill */}
            <Link
              href="/whistleblower"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Send News Tip</span>
            </Link>



            {/* Prominent Glowing [● LIVE TV] Button */}
            <Link
              href="/live"
              className="group relative inline-flex items-center space-x-2 px-3.5 sm:px-4 py-2 rounded-brand bg-brand-crimson hover:bg-brand-crimson-light text-white text-xs sm:text-sm font-bold shadow-crimson transition-all transform hover:-translate-y-0.5"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <span className="tracking-wide">LIVE TV</span>
              <Tv className="w-4 h-4 text-brand-gold group-hover:scale-110 transition-transform" />
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-brand-dark hover:bg-gray-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Primary Navigation Bar */}
        <nav className="hidden lg:flex items-center justify-between border-t border-gray-100 py-2.5 text-sm font-semibold text-gray-700">
          <div className="flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.hasDropdown && pathname.startsWith('/news'));
              
              if (link.hasDropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative group"
                    onMouseEnter={() => setNewsDropdownOpen(true)}
                    onMouseLeave={() => setNewsDropdownOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-md transition-colors ${
                        isActive
                          ? 'text-brand-crimson bg-red-50/80 font-bold'
                          : 'hover:text-brand-dark hover:bg-gray-50'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform" />
                    </Link>

                    {/* Mega Dropdown Menu */}
                    <div
                      className={`absolute top-full left-0 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 transition-all duration-150 z-50 ${
                        newsDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1 pointer-events-none'
                      }`}
                    >
                      <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                        Regional Editions
                      </div>
                      {link.subcategories?.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="flex items-center justify-between px-3.5 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-brand-dark transition-colors"
                        >
                          <span>{sub.name}</span>
                          {sub.badge && (
                            <span className="text-[10px] bg-brand-gold font-bold px-1.5 py-0.5 rounded text-brand-dark">
                              {sub.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    isActive
                      ? 'text-brand-crimson bg-red-50/80 font-bold'
                      : 'hover:text-brand-dark hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Quick Breaking Flash Anchor */}
          {activeBlogTitle && (
            <div className="flex items-center space-x-1.5 text-xs text-brand-crimson font-bold">
              <span className="w-2 h-2 rounded-full bg-brand-crimson animate-ping" />
              <Link href="/live-blog" className="hover:underline">
                LIVE: {activeBlogTitle}
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <div key={link.name}>
                <Link
                  href={link.href}
                  className="block px-3 py-2 rounded-md text-base font-semibold text-gray-800 hover:bg-amber-50 hover:text-brand-crimson"
                >
                  {link.name}
                </Link>
                {link.hasDropdown && (
                  <div className="pl-6 space-y-1 mt-1 border-l-2 border-amber-300">
                    {link.subcategories?.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className="block px-2 py-1 text-sm text-gray-600 hover:text-brand-dark"
                      >
                        • {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200 space-y-2">
            <Link
              href="/live"
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-brand bg-brand-crimson text-white font-bold text-sm shadow-md"
            >
              <Radio className="w-4 h-4 text-brand-gold animate-pulse" />
              <span>WATCH LIVE TV BROADCAST</span>
            </Link>

            <Link
              href="/whistleblower"
              className="w-full flex items-center justify-center space-x-2 py-2 rounded-brand bg-amber-50 border border-amber-200 text-amber-900 font-semibold text-sm"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Whistleblower News Desk (WhatsApp)</span>
            </Link>


          </div>
        </div>
      )}
    </header>
  );
}
