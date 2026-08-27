'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Radio, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

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

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-crimson animate-spin" />
      </div>
    );
  }

  // If already logged in, render nothing while redirecting
  if (user) return null;

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Pane - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative items-center justify-center overflow-hidden">
        {/* Background Decorative Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-900 to-black z-0"></div>
        <div className="absolute -top-1/4 -right-1/4 w-full h-full bg-brand-crimson/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none z-0"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-full h-full bg-brand-gold/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none z-0"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-lg">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md mb-8 border border-white/10 shadow-2xl">
            <Radio className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Radio Unity <span className="text-brand-crimson">Portal</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            The central nervous system for Newsroom, EPG Scheduling, and Studio Broadcasting. Authorized personnel only.
          </p>
        </div>
        
        {/* Footer info inside left pane */}
        <div className="absolute bottom-8 left-8 right-8 flex justify-between text-gray-500 text-sm z-10">
          <span>&copy; {new Date().getFullYear()} Radio Unity Uganda</span>
          <span className="flex items-center gap-2"><Lock className="w-3 h-3" /> Secure System</span>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative">
        <div className="w-full max-w-md">
          {/* Mobile logo header */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="bg-brand-crimson p-2.5 rounded-xl">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Radio Unity Portal</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Welcome back</h2>
            <p className="text-gray-500">Sign in to your staff account to continue.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {loginError && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm flex items-start gap-3">
                <div className="p-0.5 bg-white rounded-full mt-0.5 shadow-sm">
                  <Lock className="w-3 h-3 text-red-600" />
                </div>
                {loginError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@radiounity.ug"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
            
            <p className="text-center text-sm text-gray-500 mt-6">
              Forgot your password? Please contact the IT department.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
