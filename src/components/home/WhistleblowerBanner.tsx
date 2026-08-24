'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Send, Lock, ArrowRight, MessageSquareCode } from 'lucide-react';

export function WhistleblowerBanner() {
  const whatsappNumber = '256772000000';
  const prefilledText = encodeURIComponent(
    'Hello Radio Unity FM Investigative Desk, I have confidential information / news tip regarding: '
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${prefilledText}`;

  return (
    <section className="py-8 bg-gradient-to-r from-amber-500 via-amber-600 to-red-700 text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="bg-brand-dark/95 backdrop-blur-md rounded-brand p-6 sm:p-8 border-2 border-brand-gold/80 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Left: Headline & Assurance */}
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-brand-gold text-brand-dark font-black text-xs uppercase px-2.5 py-1 rounded shadow">
              <ShieldAlert className="w-4 h-4 text-brand-crimson" />
              <span>CITIZEN JOURNALISM & INVESTIGATIVE DESK</span>
            </div>
            
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
              Have a Breaking News Tip or Whistleblower Story in Lango?
            </h3>
            
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Help expose corruption, report community emergencies, or alert our newsroom on unaddressed local issues. All submissions are encrypted and protected by strict editorial source confidentiality under Ugandan law.
            </p>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0 w-full lg:w-auto">
            {/* Direct WhatsApp Submission */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-brand bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4" />
              <span>WhatsApp News Tip (+256 772 000 000)</span>
            </a>

            {/* Secure Web Form Portal */}
            <Link
              href="/whistleblower"
              className="w-full sm:w-auto px-5 py-3 rounded-brand bg-neutral-800 hover:bg-neutral-700 text-gray-200 border border-neutral-600 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-colors"
            >
              <Lock className="w-4 h-4 text-brand-gold" />
              <span>Secure Web Form</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
