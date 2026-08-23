'use client';

import React from 'react';
import Link from 'next/link';
import { Tv, Phone, Mail, MapPin, ShieldCheck, Heart, Radio, Youtube, Facebook, Send } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-brand-dark text-gray-400 text-sm border-t-4 border-brand-gold">
      {/* Top Banner inside Footer */}
      <div className="bg-neutral-900 border-b border-neutral-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-brand bg-brand-crimson flex items-center justify-center text-white">
              <Radio className="w-5 h-5 text-brand-gold animate-pulse" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Unity TV Uganda — Broadcasting Across Northern Uganda</h4>
              <p className="text-xs text-brand-gold font-medium">Available on <a href="https://www.youtube.com/@977unityfm" target="_blank" rel="noopener noreferrer" className="hover:underline text-white transition-colors">YouTube</a> and Online Stream on our website.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/live"
              className="px-4 py-2 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs rounded-brand shadow transition-colors flex items-center space-x-1.5"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Watch Live Stream</span>
            </Link>
            <Link
              href="/whistleblower"
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs rounded-brand border border-neutral-700 transition-colors"
            >
              Submit News Tip
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: About & Masthead */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/unity-tv-logo.png" 
                alt="Unity TV Logo" 
                className="h-8 w-auto object-contain brightness-0 invert opacity-90"
              />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed pr-6">
              Unity TV is a digital-first regional broadcaster and news publication based in Lira City, dedicated to authoritative journalism, agricultural development, Luo cultural preservation, and public accountability across Northern Uganda and nationwide.
            </p>

            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                <span>Plot 18, Obote Avenue, Lira City, Northern Uganda</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                <span>Newsroom: +256 (0) 473 420 190 / WhatsApp: +256 772 000 000</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                <span>editorial@unitytv.ug | sales@unitytv.ug</span>
              </div>
            </div>
          </div>

          {/* Col 2: Regional Editions */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Regional Hubs</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/news/lira-city" className="hover:text-brand-gold transition-colors">• Lira City Newsroom</Link></li>
              <li><Link href="/news/lango-sub-region" className="hover:text-brand-gold transition-colors">• Dokolo & Alebtong Desk</Link></li>
              <li><Link href="/news/lango-sub-region" className="hover:text-brand-gold transition-colors">• Apac, Kwania & Oyam</Link></li>
              <li><Link href="/news/lango-sub-region" className="hover:text-brand-gold transition-colors">• Otuke Shea Belt</Link></li>
              <li><Link href="/news/lango-sub-region" className="hover:text-brand-gold transition-colors">• Amolatar & Lake Kyoga</Link></li>
              <li><Link href="/news/northern-uganda" className="hover:text-brand-gold transition-colors">• Gulu & West Nile</Link></li>
            </ul>
          </div>

          {/* Col 3: Categories & Shows */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Categories & TV</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/politics" className="hover:text-brand-gold transition-colors">• Politics & Governance</Link></li>
              <li><Link href="/business" className="hover:text-brand-gold transition-colors">• Agribusiness & Commodity Rates</Link></li>
              <li><Link href="/sports" className="hover:text-brand-gold transition-colors">• FUFA Drum & Sports</Link></li>
              <li><Link href="/lifestyle" className="hover:text-brand-gold transition-colors">• Luo Culture & Tekwaro</Link></li>
              <li><Link href="/shows" className="hover:text-brand-gold transition-colors">• TV Schedule (EPG)</Link></li>
              <li><Link href="/videos" className="hover:text-brand-gold transition-colors">• Investigative Bulletins</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Compliance */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Daily Northern Brief</h4>
            <p className="text-xs text-gray-400">
              Get the top Lango headlines and agricultural prices delivered daily.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter email address..."
                  className="w-full bg-neutral-900 border border-neutral-700 text-xs text-white px-3 py-2 rounded-l focus:outline-none focus:border-brand-gold"
                />
                <button
                  type="submit"
                  className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark px-3 py-2 rounded-r font-bold text-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>

      {/* Regulatory Compliance & Legal Bar */}
      <div className="border-t border-neutral-800 bg-black/60 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
            <span>
              Licensed by the <strong>Uganda Communications Commission (UCC)</strong>. Compliant with the <strong>Ugandan Data Protection and Privacy Act (DPPA) 2019</strong>.
            </span>
          </div>
          <div suppressHydrationWarning>
            © {new Date().getFullYear()} Unity TV Uganda Ltd. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
