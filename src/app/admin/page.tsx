'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Radio, Lock, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function AdminPage() {
  const { user, login, isInitialized, logout } = useAuth();
  const router = useRouter();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hasError = searchParams.has('error');
    
    if (isInitialized && user) {
      if (hasError) {
        logout(); // clear the bad session
      } else {
        router.push('/admin/overview');
      }
    }
  }, [user, isInitialized, router, logout]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await login(loginEmail, loginPass);
      if (!res.success) {
        setLoginError(res.error || 'Invalid email or password.');
      } else {
        router.push('/admin/overview');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!isInitialized || (user && !window.location.search.includes('error'))) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4 selection:bg-brand-gold selection:text-black">
      {/* Brand Header */}
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-6">
          <Image 
            src="/radio-unity-logo.png" 
            alt="Radio Unity Logo" 
            width={80} 
            height={80}
            className="drop-shadow-sm"
          />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Log in to Unity</h1>
        <p className="text-sm text-gray-500 mt-2">Enter your staff credentials to continue</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[400px] bg-white rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
        <form onSubmit={handleLoginSubmit} className="space-y-5">
          {loginError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 font-medium border border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {loginError}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="name@radiounity.ug"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-colors"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Password</label>
            </div>
            <input
              type="password"
              required
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-brand-crimson hover:bg-brand-crimson-light active:bg-[#6a0000] text-white font-medium py-2 px-4 rounded-lg text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2 shadow-sm"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
                Authenticating...
              </>
            ) : (
              'Continue'
            )}
          </button>
        </form>
      </div>
      
      {/* Footer */}
      <div className="mt-8 flex items-center gap-2 text-sm text-gray-400">
        <Lock className="w-3 h-3 text-brand-gold" />
        <span>Secure Portal Area</span>
      </div>
    </div>
  );
}
