'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Tv } from 'lucide-react';

export default function AdminPage() {
  const { user, login, isInitialized } = useAuth();
  const router = useRouter();

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (isInitialized && user) {
      router.push('/admin/overview');
    }
  }, [user, isInitialized, router]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await login(loginEmail, loginPass);
      if (!res.success) {
        setLoginError(res.error || 'Invalid email or password. You can also select a quick role preset below.');
      } else {
        router.push('/admin/overview');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleQuickSelect = (email: string) => {
    setLoginEmail(email);
    setLoginPass('password123'); // Prefill default demo password
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-brand-crimson border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium text-sm">Initializing secure terminal...</p>
        </div>
      </div>
    );
  }

  // If user is already logged in, show blank while redirecting
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-crimson to-red-600 flex items-center justify-center shadow-xl shadow-red-950/60 mx-auto">
            <Tv className="w-7 h-7 text-gray-900" />
          </div>
          <h1 className="font-heading font-semibold tracking-tight text-2xl text-gray-900 tracking-wide">
            Radio Unity FM UGANDA
          </h1>
          <p className="text-xs text-gray-600">
            Broadcasting Across Northern Uganda &bull; Staff Editorial & MCR Terminal
          </p>
        </div>

        {loginError && (
          <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-300">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-700 font-bold mb-1">Staff Email Address</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="admin@radiounity.ug"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-brand-crimson text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">Passcode / Key</label>
            <input
              type="password"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-brand-crimson text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            {isLoggingIn ? 'Authenticating...' : 'Sign In to Master Terminal'}
          </button>
        </form>

        {/* Quick Staff Presets */}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block text-center">
            Quick Role Switch (Staff Presets)
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickSelect('admin@radiounity.ug')}
              className="p-2 rounded-xl bg-gray-50 hover:bg-[#F8F9FA] text-left border border-gray-200 hover:border-brand-crimson transition-colors"
            >
              <span className="font-bold text-gray-900 block text-[11px]">Managing Director</span>
              <span className="text-[10px] text-red-400">Super Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect('producer@radiounity.ug')}
              className="p-2 rounded-xl bg-gray-50 hover:bg-[#F8F9FA] text-left border border-gray-200 hover:border-brand-crimson transition-colors"
            >
              <span className="font-bold text-gray-900 block text-[11px]">Broadcast Director</span>
              <span className="text-[10px] text-blue-400">MCR & Streams</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect('editor@radiounity.ug')}
              className="p-2 rounded-xl bg-gray-50 hover:bg-[#F8F9FA] text-left border border-gray-200 hover:border-brand-crimson transition-colors"
            >
              <span className="font-bold text-gray-900 block text-[11px]">News Editor</span>
              <span className="text-[10px] text-amber-400">Breaking & News</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect('reporter@radiounity.ug')}
              className="p-2 rounded-xl bg-gray-50 hover:bg-[#F8F9FA] text-left border border-gray-200 hover:border-brand-crimson transition-colors"
            >
              <span className="font-bold text-gray-900 block text-[11px]">Field Reporter</span>
              <span className="text-[10px] text-emerald-400">Publishing</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
