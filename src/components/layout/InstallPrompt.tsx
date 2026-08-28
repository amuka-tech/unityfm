"use client";

import { useState, useEffect } from "react";
import { X, Download, Share } from "lucide-react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 0. Register Service Worker explicitly to guarantee PWA installation
    if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.error('Service Worker registration failed: ', err);
      });
    }

    // 1. Check if already installed
    const isStandaloneMode = window.matchMedia("(display-mode: standalone)").matches || 
                             (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    // 2. Detect iOS
    const ua = window.navigator.userAgent;
    const isAppleDevice = /iPad|iPhone|iPod/.test(ua) || (ua.includes("Mac") && "ontouchend" in document);
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
    setIsIOS(isAppleDevice && isSafari && !isStandaloneMode);

    // 3. Listen for install prompt (Android/Windows/Mac Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a 3-second delay so it doesn't interrupt initial reading
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Trigger the native browser install dialog
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  // Don't show if already installed
  if (isStandalone) return null;

  return (
    <>
      {/* Android / Windows / Desktop Chrome Prompt */}
      {showPrompt && !isIOS && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-[#111111] border border-[#FFC20E]/30 rounded-xl shadow-2xl p-4 flex items-start gap-3">
            <div className="bg-[#FFC20E]/10 p-2 rounded-lg shrink-0">
              <Download className="w-6 h-6 text-[#FFC20E]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm mb-1">Install Radio Unity App</h3>
              <p className="text-gray-400 text-xs mb-3">
                Get faster load times, low-data mode, and instant access to live broadcasts.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-[#FFC20E] hover:bg-[#e6b00c] text-[#111111] font-semibold text-sm py-2 px-4 rounded-lg transition-colors"
                >
                  Install App
                </button>
                <button
                  onClick={() => setShowPrompt(false)}
                  className="bg-[#8B0000]/20 hover:bg-[#8B0000]/30 text-gray-300 text-sm py-2 px-3 rounded-lg transition-colors"
                >
                  Not Now
                </button>
              </div>
            </div>
            <button 
              onClick={() => setShowPrompt(false)}
              className="text-gray-500 hover:text-white shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* iOS Safari Instructional Prompt */}
      {isIOS && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#111111] border-t border-[#FFC20E]/30 p-4 md:hidden">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <div className="bg-[#FFC20E]/10 p-2 rounded-lg">
                <Share className="w-5 h-5 text-[#FFC20E]" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Install Radio Unity</p>
                <p className="text-gray-400 text-xs">Tap Share, then "Add to Home Screen"</p>
              </div>
            </div>
            <button 
              onClick={() => setIsIOS(false)}
              className="text-gray-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
