'use client';

import React from 'react';
import { 
  Users, 
  Newspaper, 
  Radio, 
  ShieldAlert, 
  TrendingUp, 
  Mic, 
  ArrowUpRight, 
  Headphones, 
  Flame,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export function OverviewDesk({ articles, tips, listeners, onNavigateTab }: any) {
  
  const stats = [
    { label: 'Published Articles', value: articles?.length || 0, icon: Newspaper, trend: 'Total', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'On Air Status', value: 'LIVE', icon: Mic, trend: '97.7 FM', color: 'text-brand-crimson', bg: 'bg-red-50' },
    { label: 'Live Listeners', value: listeners || 0, icon: Headphones, trend: 'Streaming now', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Leaks', value: tips?.length || 0, icon: ShieldAlert, trend: 'Needs Review', color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Unity Radio</h1>
          <p className="text-gray-600 max-w-2xl">
            You are in the central hub. From here you can manage news articles, check on the live broadcast, review the programme schedule, and decrypt whistleblower tips.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => onNavigateTab('newsroom')}
            className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            Write Story
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200`}>
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Links */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Radio className="w-5 h-5 text-gray-400" /> Quick Actions
          </h2>
          <div className="space-y-3">
            <button onClick={() => onNavigateTab('streams')} className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-brand-crimson hover:bg-red-50 group transition-all text-left">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-brand-crimson group-hover:text-white transition-colors">
                  <Mic className="w-5 h-5 text-gray-600 group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Manage Radio Studio</h4>
                  <p className="text-sm text-gray-500">Update Now Playing info</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-brand-crimson" />
            </button>

            
          </div>
        </div>
      </div>
    </div>
  );
}
