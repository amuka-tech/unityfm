'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Check, X, Settings2 } from 'lucide-react';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [adPersonalization, setAdPersonalization] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('unity_cookie_consent');
    if (!consent) {
      // Delay display slightly for smooth page entry
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('unity_cookie_consent', JSON.stringify({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
      standard: 'Uganda DPPA 2019',
    }));
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('unity_cookie_consent', JSON.stringify({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
      standard: 'Uganda DPPA 2019',
    }));
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem('unity_cookie_consent', JSON.stringify({
      essential: true,
      analytics: analyticsEnabled,
      marketing: adPersonalization,
      timestamp: new Date().toISOString(),
      standard: 'Uganda DPPA 2019',
    }));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-neutral-950/95 backdrop-blur-md border border-neutral-800 rounded-2xl p-5 shadow-2xl text-white">
        
        {/* Header */}
        <div className="flex items-center space-x-2.5 mb-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-brand-gold" />
          </div>
          <div>
            <h4 className="font-heading font-black text-xs uppercase tracking-wider text-white">
              Data Privacy & Cookie Choices
            </h4>
            <span className="text-[10px] text-gray-400 font-mono">Uganda DPPA 2019 Compliant</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-300 leading-relaxed mb-4">
          Unity TV Uganda uses strictly essential cookies to maintain secure sessions and optimize 3G data-saver delivery. We request your permission for optional analytics and regional advertising cookies.
        </p>

        {/* Detailed Preferences Panel */}
        {showPreferences && (
          <div className="bg-neutral-900/90 rounded-xl p-3 mb-4 space-y-2.5 text-xs border border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Essential Broadcaster Cookies</span>
                <span className="text-[10px] text-gray-400">Security, authentication & data-saver</span>
              </div>
              <span className="text-[10px] font-bold bg-neutral-800 text-brand-gold px-2 py-0.5 rounded">Always Active</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <div>
                <span className="font-bold text-white block">Audience Metrics & Analytics</span>
                <span className="text-[10px] text-gray-400">Helps us understand readership in Lango</span>
              </div>
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                className="w-4 h-4 accent-brand-gold rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <div>
                <span className="font-bold text-white block">Regional Sponsor Ad Units</span>
                <span className="text-[10px] text-gray-400">Relevant commercial offers in Northern Uganda</span>
              </div>
              <input
                type="checkbox"
                checked={adPersonalization}
                onChange={(e) => setAdPersonalization(e.target.checked)}
                className="w-4 h-4 accent-brand-gold rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {!showPreferences ? (
            <>
              <button
                onClick={handleAcceptAll}
                className="flex-1 py-2 px-3 bg-brand-gold hover:bg-brand-gold-light text-brand-dark text-xs font-black rounded-lg transition-all shadow active:scale-95 text-center"
              >
                Accept All
              </button>
              <button
                onClick={handleEssentialOnly}
                className="py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-gray-200 text-xs font-bold rounded-lg transition-all text-center"
              >
                Essential Only
              </button>
              <button
                onClick={() => setShowPreferences(true)}
                className="p-2 text-gray-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                title="Customize Preferences"
                aria-label="Customize cookie preferences"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSaveCustom}
                className="flex-1 py-2 px-3 bg-brand-gold hover:bg-brand-gold-light text-brand-dark text-xs font-black rounded-lg transition-all shadow text-center"
              >
                Save My Preferences
              </button>
              <button
                onClick={() => setShowPreferences(false)}
                className="py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-gray-300 text-xs font-bold rounded-lg transition-colors"
              >
                Back
              </button>
            </>
          )}
        </div>

      </div>
    </aside>
  );
}
