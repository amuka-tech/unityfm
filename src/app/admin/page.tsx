'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Radio, Lock, Mail, Loader2, ChevronRight, Mic, Newspaper, Shield, User } from 'lucide-react';

const STAFF_PRESETS = [
  {
    label: 'Managing Director',
    email: 'admin@radiounity.ug',
    role: 'Super Admin',
    icon: Shield,
    color: 'text-red-500',
    bg: 'bg-red-50 border-red-100',
  },
  {
    label: 'Broadcast Director',
    email: 'producer@radiounity.ug',
    role: 'MCR & Streams',
    icon: Mic,
    color: 'text-blue-500',
    bg: 'bg-blue-50 border-blue-100',
  },
  {
    label: 'News Editor',
    email: 'editor@radiounity.ug',
    role: 'Breaking & News',
    icon: Newspaper,
    color: 'text-amber-500',
    bg: 'bg-amber-50 border-amber-100',
  },
  {
    label: 'Field Reporter',
    email: 'reporter@radiounity.ug',
    role: 'Publishing',
    icon: User,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 border-emerald-100',
  },
];

export default function AdminPage() {
  const { user, login, isInitialized } = useAuth();
  const router = useRouter();

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
        setLoginError(res.error || 'Invalid email or password.');
      } else {
        router.push('/admin/overview');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleQuickLogin = async (email: string) => {
    setIsLoggingIn(true);
    setLoginError('');
    setLoginEmail(email);
    setLoginPass('password123');
    try {
      const res = await login(email, 'password123');
      if (!res.success) {
        setLoginError(res.error || 'Quick login failed. Try entering credentials manually.');
      } else {
        router.push('/admin/overview');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm font-medium">Checking session...</p>
        </div>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-crimson/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-gold/8 rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3" />

      <div className="w-full max-w-md relative z-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-5 bg-brand-crimson rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/40">
            <Radio className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white mb-1">Radio Unity FM</h1>
          <p className="text-sm text-gray-400">Staff Editorial & Broadcast Terminal</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse"></span>
            <span className="text-xs text-brand-gold font-semibold tracking-widest uppercase">97.7 FM · Northern Uganda</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">

          {loginError && (
            <div className="mb-4 p-3 bg-red-900/40 border border-red-800 rounded-xl text-xs text-red-300 flex items-start gap-2">
              <span className="mt-0.5">⚠</span>
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Staff Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@radiounity.ug"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold transition-colors text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Passcode</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold transition-colors text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-crimson hover:bg-red-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shadow-red-900/30"
            >
              {isLoggingIn ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</>
              ) : (
                <><ChevronRight className="w-4 h-4" /> Sign In</>
              )}
            </button>
          </form>

          {/* Quick Login */}
          <div className="mt-6 pt-5 border-t border-neutral-800">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center mb-3">Quick Role Sign-In</p>
            <div className="grid grid-cols-2 gap-2">
              {STAFF_PRESETS.map((preset) => {
                const Icon = preset.icon;
                return (
                  <button
                    key={preset.email}
                    type="button"
                    disabled={isLoggingIn}
                    onClick={() => handleQuickLogin(preset.email)}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-neutral-600 transition-colors text-left disabled:opacity-50"
                  >
                    <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${preset.color}`} />
                    <div>
                      <span className="font-bold text-white text-[11px] block leading-tight">{preset.label}</span>
                      <span className={`text-[10px] font-medium ${preset.color}`}>{preset.role}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        <p className="text-center text-[10px] text-gray-600 mt-6">
          Authorized staff only · Radio Unity FM Uganda · 97.7 FM
        </p>
      </div>
    </div>
  );
}
