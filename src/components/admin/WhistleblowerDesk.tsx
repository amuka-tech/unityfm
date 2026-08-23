'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Volume2, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ExternalLink, 
  X, 
  Sparkles,
  Lock,
  ArrowUpRight
} from 'lucide-react';

interface WhistleblowerDeskProps {
  tips: any[];
  onConvertToStory: (tip: any) => void;
  notify: (msg: string) => void;
}

export function WhistleblowerDesk({
  tips,
  onConvertToStory,
  notify,
}: WhistleblowerDeskProps) {
  const [selectedTip, setSelectedTip] = useState<any | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTips = tips.filter((tip) => {
    const matchesCategory = filterCategory === 'All' || tip.category === filterCategory;
    const searchString = `${tip.topic || ''} ${tip.title || ''} ${tip.details || ''} ${tip.description || ''} ${tip.district || ''} ${tip.location || ''}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-sm font-semibold text-gray-900">Whistleblower & Investigative Tip Desk</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Encrypted Ingest</span>
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Secure citizen journalism submissions, verified leaks, audio testimonials, and public interest evidence from Northern Uganda.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 font-mono">
            {tips.length} Tips Received
          </span>
        </div>
      </div>

      {/* Main Inbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (7 cols): Tips List */}
        <div className="lg:col-span-7 bg-white rounded-xl p-6 shadow-sm border border-gray-200 space-y-5">
          
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tips by keyword, location..."
                className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="All">All Categories</option>
              <option value="Corruption & Public Funds">Corruption</option>
              <option value="Land Rights & Disputes">Land Rights</option>
              <option value="Health & Medical">Health</option>
              <option value="Community & Security">Security</option>
            </select>
          </div>

          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {filteredTips.length === 0 ? (
              <div className="py-16 text-center text-gray-500 text-sm">
                No tips found matching the search.
              </div>
            ) : (
              filteredTips.map((tip) => {
                const isSelected = selectedTip?.id === tip.id;

                return (
                  <div
                    key={tip.id}
                    onClick={() => setSelectedTip(tip)}
                    className={`p-4 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gray-50 border-l-2 border-l-gray-900'
                        : 'hover:bg-gray-50 border-l-2 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-50 text-gray-600 border-gray-200">
                        {tip.category || 'General Tip'}
                      </span>
                      <span className="text-xs font-mono text-gray-500 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>{tip.created_at || 'Recent'}</span>
                      </span>
                    </div>

                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">
                      {tip.topic || tip.title || tip.subject || 'Citizen Tip Submission'}
                    </h4>

                    <p className="text-sm text-gray-600 line-clamp-2 mt-1.5">
                      {tip.details || tip.description || tip.content}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                      <span className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{tip.location || 'Northern Uganda'}</span>
                      </span>
                      <span className="font-medium text-gray-700">
                        {tip.is_anonymous ? 'Anonymous Submitter' : tip.contact_name || 'Verified Citizen'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right (5 cols): Selected Tip Evidence & Detail Viewer */}
        <div className="lg:col-span-5 bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col space-y-6">
          {selectedTip ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-900">Investigation Evidence</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
                  UNREVIEWED
                </span>
              </div>

              <div>
                <h4 className="font-semibold text-lg text-gray-900">
                  {selectedTip.topic || selectedTip.title || selectedTip.subject || 'Whistleblower Case File'}
                </h4>
                <div className="flex items-center space-x-3 text-sm text-gray-500 mt-2">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{selectedTip.district || selectedTip.location || 'Lira City'}</span>
                  </span>
                  <span>•</span>
                  <span>{selectedTip.created_at || 'Just now'}</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedTip.details || selectedTip.description || selectedTip.content}
              </div>

              {selectedTip.file_paths && selectedTip.file_paths.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider block">Attached Evidence</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedTip.file_paths.map((path: string, i: number) => (
                      <a 
                        key={i} 
                        href={path} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-100 transition"
                      >
                        <FileText className="w-5 h-5 text-gray-500 shrink-0" />
                        <span className="text-xs text-gray-700 truncate font-medium">Attachment {i+1}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Submitter Details */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-3 text-sm">
                <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider block">Submitter Integrity</span>
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-gray-500">Identity Mode:</span>
                  <span className="font-medium text-gray-900">
                    {(selectedTip.phone_or_whatsapp || selectedTip.contact_phone) ? 'Identified Source' : '🕵️ 100% Anonymous'}
                  </span>
                </div>
                {(selectedTip.phone_or_whatsapp || selectedTip.contact_phone) && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-500">Secure Phone:</span>
                    <span className="font-mono text-gray-900">{selectedTip.phone_or_whatsapp || selectedTip.contact_phone}</span>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => onConvertToStory(selectedTip)}
                  className="w-full bg-brand-crimson hover:bg-red-700 text-white shadow-sm  rounded-lg px-4 py-2.5 text-sm font-medium transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Convert Tip to News Story</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center text-gray-500 space-y-4">
              <ShieldAlert className="w-12 h-12 text-gray-300" />
              <p className="text-sm max-w-[200px]">Select any incoming tip to inspect its evidence and convert to news.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

