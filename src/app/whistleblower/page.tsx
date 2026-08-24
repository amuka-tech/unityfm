'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Send, 
  Lock, 
  CheckCircle2, 
  FileText, 
  AlertTriangle, 
  Phone, 
  Info 
} from 'lucide-react';
import { createTipDb } from '@/lib/server-actions';

export default function WhistleblowerPage() {
  const [sourceName, setSourceName] = useState('');
  const [phoneOrWhatsapp, setPhoneOrWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('Lira City');
  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'breaking'>('medium');
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionRef, setSubmissionRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !details.trim()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('topic', topic.trim());
      formData.append('details', details.trim());
      formData.append('district', district);
      if (phoneOrWhatsapp) formData.append('phone_or_whatsapp', phoneOrWhatsapp.trim());
      
      evidenceFiles.forEach((file) => {
        formData.append('files', file);
      });

      const res = await createTipDb(formData);

      setSubmissionRef(res.reference);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappDirect = 'https://wa.me/256772000000?text=' + encodeURIComponent(
    'Hello Radio Unity FM Investigative Desk, I have a confidential news tip/whistleblower story from Northern Uganda.'
  );

  return (
    <div className="bg-brand-surface min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Header Badge */}
        <div className="bg-brand-dark text-white rounded-brand p-6 border-l-4 border-amber-500 shadow-xl mb-8 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="bg-brand-gold text-brand-dark font-black text-xs uppercase px-2.5 py-1 rounded flex items-center space-x-1 shadow">
              <ShieldAlert className="w-4 h-4 text-brand-crimson" />
              <span>CONFIDENTIAL CITIZEN DESK</span>
            </span>
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
            Radio Unity FM Whistleblower & Investigative Tip Line
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Radio Unity FM is committed to uncovering the truth and holding power accountable across Lira City and Northern Uganda. You may submit information anonymously or provide contact details for our investigative journalists to follow up.
          </p>

          <div className="pt-2 flex items-center space-x-2 text-xs text-amber-400 font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Protected by journalistic source confidentiality & DPPA Uganda compliance.</span>
          </div>
        </div>

        {isSubmitted ? (
          <div className="bg-white rounded-brand border border-emerald-300 p-8 text-center space-y-4 shadow-lg">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="font-heading font-black text-2xl text-gray-900">
              News Tip Received Successfully
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Your information has been routed securely to the senior investigative editors at Radio Unity FM in Lira City.
            </p>

            <div className="inline-block bg-gray-100 border border-gray-300 rounded p-3 text-xs font-mono font-bold text-gray-800">
              Reference Code: <span className="text-brand-crimson">{submissionRef}</span>
            </div>

            <div className="pt-4 flex justify-center space-x-3">
              <Link
                href="/"
                className="px-4 py-2 bg-brand-crimson text-white text-xs font-bold rounded hover:bg-brand-crimson-light transition-colors"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-brand border border-gray-200 p-6 sm:p-8 shadow-card space-y-6">
            
            {/* Quick Option: Direct WhatsApp Submission */}
            <div className="p-4 rounded bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-emerald-900">
                <strong className="block font-black text-emerald-950 text-sm">Prefer direct encrypted chat?</strong>
                <span>Message our investigative desk directly on WhatsApp (+256 772 000 000).</span>
              </div>
              <a
                href={whatsappDirect}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-brand flex items-center space-x-1.5 shadow flex-shrink-0 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Launch WhatsApp</span>
              </a>
            </div>

            <div className="relative text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <span className="relative bg-white px-3 text-xs font-bold text-gray-400 uppercase">
                Or Submit via Secure Web Form
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Your Name (Optional / Anonymous)
                  </label>
                  <input
                    type="text"
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                    placeholder="Leave blank to remain anonymous"
                    className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-brand-crimson"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Phone / WhatsApp Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={phoneOrWhatsapp}
                    onChange={(e) => setPhoneOrWhatsapp(e.target.value)}
                    placeholder="e.g. +256 770 000 000"
                    className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-brand-crimson"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Location / District *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-brand-crimson font-medium"
                  >
                    <option value="Lira City">Lira City</option>
                    <option value="Dokolo District">Dokolo District</option>
                    <option value="Alebtong District">Alebtong District</option>
                    <option value="Apac District">Apac District</option>
                    <option value="Oyam District">Oyam District</option>
                    <option value="Kole District">Kole District</option>
                    <option value="Otuke District">Otuke District</option>
                    <option value="Kwania District">Kwania District</option>
                    <option value="Amolatar District">Amolatar District</option>
                    <option value="Gulu & Acholi">Gulu & Acholi</option>
                    <option value="West Nile">West Nile</option>
                    <option value="Kampala / National">Kampala / National</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-brand-crimson font-medium"
                  >
                    <option value="low">Standard Review (Within 48h)</option>
                    <option value="medium">Medium Priority (Within 24h)</option>
                    <option value="high">High Priority Investigation</option>
                    <option value="breaking">Breaking Urgent Tip</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Story Subject / Topic *
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Diversion of public hospital medical supplies in Oyam"
                  className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-gray-900 font-semibold focus:outline-none focus:border-brand-crimson"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Full Details & Evidence *
                </label>
                <textarea
                  rows={6}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Please describe what happened, where, when, and who was involved. Mention if you have supporting photos, receipts, or recordings..."
                  className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-brand-crimson leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Attach Evidence (Photos, Audio, Video)
                </label>
                <div className="text-xs text-gray-500 mb-2">
                  You can upload files or tap here on mobile to record directly from your camera/microphone.
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*,audio/*,video/*"
                  onChange={(e) => setEvidenceFiles(Array.from(e.target.files || []))}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                  Submissions are reviewed exclusively by senior editors.
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-brand-crimson hover:bg-brand-crimson-light text-white font-bold text-xs rounded-brand shadow flex items-center space-x-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending Encrypted Tip...' : 'Submit Confidential Tip'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
