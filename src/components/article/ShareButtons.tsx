'use client';

import React, { useState } from 'react';
import { Share2, MessageCircle, Copy, Check, Facebook, Send, Mail, Linkedin } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  slug: string;
  category: string;
}

export function ShareButtons({ title, slug, category }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const articleUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/news/${category}/${slug}`
    : `https://radiounity.ug/news/${category}/${slug}`;

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(articleUrl);

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const linkedinShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
  const emailShareUrl = `mailto:?subject=${encodedTitle}&body=Read this story on Radio Unity FM: ${articleUrl}`;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 py-3 border-y border-gray-200 my-4 text-xs font-semibold">
      <span className="text-gray-500 mr-1 flex items-center space-x-1">
        <Share2 className="w-3.5 h-3.5 text-brand-dark" />
        <span className="font-bold text-gray-700">Share:</span>
      </span>

      {/* WhatsApp */}
      <a
        href={whatsappShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center space-x-1.5 shadow-sm transition-transform active:scale-95"
        title="Share to WhatsApp"
      >
        <MessageCircle className="w-3.5 h-3.5 fill-current" />
        <span>WhatsApp</span>
      </a>

      {/* Facebook */}
      <a
        href={facebookShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white flex items-center space-x-1.5 shadow-sm transition-transform active:scale-95"
        title="Share to Facebook"
      >
        <Facebook className="w-3.5 h-3.5 fill-current" />
        <span>Facebook</span>
      </a>

      {/* X / Twitter */}
      <a
        href={xShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-lg bg-black hover:bg-neutral-800 text-white flex items-center space-x-1.5 shadow-sm transition-transform active:scale-95"
        title="Share on X"
      >
        <span className="font-mono font-black text-xs">𝕏</span>
        <span>Post</span>
      </a>

      {/* LinkedIn */}
      <a
        href={linkedinShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-lg bg-[#0A66C2] hover:bg-[#095196] text-white flex items-center space-x-1.5 shadow-sm transition-transform active:scale-95 hidden sm:flex"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-3.5 h-3.5 fill-current" />
        <span>LinkedIn</span>
      </a>

      {/* Telegram */}
      <a
        href={telegramShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-lg bg-[#229ED9] hover:bg-[#1f8ec4] text-white flex items-center space-x-1.5 shadow-sm transition-transform active:scale-95 hidden sm:flex"
        title="Share on Telegram"
      >
        <Send className="w-3.5 h-3.5" />
        <span>Telegram</span>
      </a>

      {/* Email */}
      <a
        href={emailShareUrl}
        className="px-3 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-800 text-white flex items-center space-x-1.5 shadow-sm transition-transform active:scale-95 hidden md:flex"
        title="Email this story"
      >
        <Mail className="w-3.5 h-3.5" />
        <span>Email</span>
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 flex items-center space-x-1.5 transition-all ml-auto"
        title="Copy Link to Clipboard"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-bold">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-gray-600" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
