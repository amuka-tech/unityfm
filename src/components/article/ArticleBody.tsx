'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Pause, 
  Type, 
  CheckCircle2, 
  Clock, 
  Eye, 
  MapPin, 
  Send,
  Radio,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Download
} from 'lucide-react';
import { Article} from '@/types';
import { ShareButtons } from './ShareButtons';
import { useDataSaver } from '@/context/DataSaverContext';

interface ArticleBodyProps {
  article: Article;
  relatedArticles: Article[];
  }

export function ArticleBody({ article, relatedArticles }: ArticleBodyProps) {
  const { getImageUrl } = useDataSaver();
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  const toggleAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }
    
    if (isAudioPlaying) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        setIsAudioPlaying(false);
      }
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsAudioPlaying(true);
      } else {
        window.speechSynthesis.cancel();
        
        const tmp = document.createElement('div');
        tmp.innerHTML = article.content || '';
        const textToSpeak = tmp.textContent || tmp.innerText || '';
        
        if (!textToSpeak.trim()) return;

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        
        utterance.onend = () => {
          setIsAudioPlaying(false);
          setAudioProgress(0);
        };
        
        utterance.onboundary = (event) => {
           if (event.name === 'word') {
             const progress = Math.min(100, Math.round((event.charIndex / textToSpeak.length) * 100));
             setAudioProgress(progress);
           }
        };
        
        // Prevent garbage collection bugs
        (window as any)._currentUtterance = utterance;
        
        window.speechSynthesis.speak(utterance);
        setIsAudioPlaying(true);
      }
    }
  };

  // Cancel speech synthesis when the component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const fontSizeClass = {
    normal: 'text-base sm:text-[17px] leading-[1.8]',
    large: 'text-lg sm:text-[19px] leading-[1.85]',
    xlarge: 'text-xl sm:text-[21px] leading-[1.9]',
  }[fontSize];

  // Format date like Nile Post: "Thursday, August 20, 2026"
  const formattedDate = new Date(article.published_at).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-3 sm:px-4 lg:px-6">
      
      {/* 2-Column Grid matching Nile Post */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        
        {/* Left Column (8 cols): Main Article Content */}
        <div className="lg:col-span-8">
          
          {/* Breadcrumb / Category Tag */}
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider mb-3">
            <Link
              href="/"
              className="text-gray-500 hover:text-brand-crimson transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <Link
              href={`/news/${article.category.slug}`}
              className="text-brand-crimson hover:underline"
            >
              {article.category.name}
            </Link>
            {article.location_tag && (
              <>
                <span className="text-gray-300">/</span>
                <span className="text-gray-500 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-brand-gold" />
                  <span>{article.location_tag}</span>
                </span>
              </>
            )}
          </div>

          {/* Main Headline */}
          <h1 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-neutral-900 leading-[1.2] mb-4">
            {article.title}
          </h1>

          {/* Sub-headline / Excerpt */}
          {article.sub_headline && (
            <p className="text-base sm:text-lg font-medium text-gray-600 leading-snug mb-5 border-l-4 border-brand-crimson pl-3.5 italic">
              {article.sub_headline}
            </p>
          )}

          {/* Author Byline & Date Bar (Nile Post Format) */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-t border-b border-gray-200 my-4 text-xs">
            <div className="flex items-center space-x-3">
              <img
                src={article.author.avatar_url}
                alt={article.author.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-gold"
              />
              <div>
                <span className="font-bold text-sm text-gray-900 hover:text-brand-crimson transition-colors block">
                  By {article.author.name}
                </span>
                <span className="text-[11px] text-gray-500 block">
                  {article.author.designation} &bull; {article.author.bureau}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right text-gray-500 text-xs">
              <div className="font-medium text-gray-800" suppressHydrationWarning>{formattedDate}</div>
              <div className="text-[11px] text-gray-400 flex items-center sm:justify-end space-x-2 mt-0.5">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span>{article.reading_time_minutes} min read</span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center space-x-1">
                  <Eye className="w-3 h-3 text-gray-400" />
                  <span>{article.view_count.toLocaleString()} views</span>
                </span>
              </div>
            </div>
          </div>

          {/* Prominent Nile Post Social Share Bar */}
          <ShareButtons title={article.title} slug={article.slug} category={article.category.slug} />

          {/* Hero Featured Image with Caption & Credit */}
          <figure className="my-6 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-neutral-950">
            <img
              src={getImageUrl(article.featured_image, 1200)}
              alt={article.title}
              className="w-full max-h-[520px] object-cover"
            />
            {(article.image_caption || article.image_credit) && (
              <figcaption className="p-3 bg-neutral-900 text-gray-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-t border-neutral-800">
                <span className="italic">{article.image_caption || article.title}</span>
                {article.image_credit && (
                  <span className="text-[11px] text-gray-400 font-mono flex-shrink-0">
                    Photo: {article.image_credit}
                  </span>
                )}
              </figcaption>
            )}
          </figure>

          {/* Audio Reader & Font Sizing Toolbar */}
          <div className="bg-neutral-50 rounded-xl p-3 my-5 flex flex-col sm:flex-row items-center justify-between gap-3 border border-gray-200">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={toggleAudio}
                className="px-3.5 py-1.5 bg-brand-crimson hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 shadow transition-colors"
              >
                {isAudioPlaying ? <Pause className="w-3.5 h-3.5 text-brand-gold" /> : <Play className="w-3.5 h-3.5 text-brand-gold fill-current" />}
                <span>{isAudioPlaying ? 'Pause Audio' : 'Listen to Audio'}</span>
              </button>
              
              {isAudioPlaying && (
                <div className="flex items-center space-x-2 flex-1 sm:w-40">
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-crimson" style={{ width: `${audioProgress}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-gray-600">{audioProgress}%</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1 text-xs font-bold text-gray-700">
              <Type className="w-3.5 h-3.5 text-gray-400 mr-1" />
              <span className="text-[11px] text-gray-500 mr-1">Text Size:</span>
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-0.5 rounded border transition-colors ${fontSize === 'normal' ? 'bg-brand-dark text-white border-black' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-0.5 rounded border transition-colors ${fontSize === 'large' ? 'bg-brand-dark text-white border-black' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-0.5 rounded border transition-colors ${fontSize === 'xlarge' ? 'bg-brand-dark text-white border-black' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                A++
              </button>
            </div>
          </div>

          {/* Key Takeaways Box */}
          {article.key_takeaways && article.key_takeaways.length > 0 && (
            <div className="my-6 p-4 sm:p-5 rounded-xl bg-amber-50/90 border-2 border-brand-gold/60 shadow-sm">
              <h3 className="font-heading font-black text-xs uppercase text-amber-950 flex items-center space-x-1.5 mb-3 tracking-wider">
                <span className="w-2 h-2 rounded-full bg-brand-crimson" />
                <span>KEY STORY TAKEAWAYS</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-800">
                {article.key_takeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* In-Article "Keep Reading" Block (Exact Nile Post Pattern) */}
          {relatedArticles && relatedArticles.length > 0 && (
            <div className="my-6 p-4 bg-gray-50 rounded-xl border-l-4 border-brand-dark">
              <h4 className="font-heading font-black text-xs text-gray-900 uppercase tracking-wider mb-2">
                Keep Reading
              </h4>
              <ul className="space-y-2 text-xs font-semibold">
                {relatedArticles.slice(0, 4).map((rel) => (
                  <li key={rel.id} className="flex items-start space-x-1.5">
                    <span className="text-brand-crimson font-bold">&bull;</span>
                    <Link
                      href={`/news/${rel.category?.slug || article.category.slug}/${rel.slug}`}
                      className="text-gray-800 hover:text-brand-crimson hover:underline transition-colors line-clamp-1"
                    >
                      {rel.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* In-Article Ad Slot */}
          <div className="my-6">
          </div>

          {/* Rich Text Body Content */}
          <div
            className={`font-serif text-gray-900 prose prose-neutral max-w-none my-6 leading-relaxed ${fontSizeClass}`}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* In-Article Ad Slot 2 */}
          <div className="my-6">
          </div>

          {/* Topics You Might Like (Nile Post Tag Section) */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 border-t border-gray-200 my-6">
              <h4 className="font-heading font-black text-xs text-gray-900 uppercase tracking-wider mb-3">
                Topics You Might Like
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/news/lira-city?search=${encodeURIComponent(tag)}`}
                    className="text-xs bg-gray-100 hover:bg-brand-gold/20 hover:text-brand-dark text-gray-700 px-3 py-1.5 rounded-lg font-bold border border-gray-200 transition-all uppercase tracking-wide text-[11px]"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Share Buttons */}
          <div className="my-6 pt-4 border-t border-gray-200">
            <ShareButtons title={article.title} slug={article.slug} category={article.category.slug} />
          </div>

          {/* Author Bio Card */}
          <div className="my-8 p-5 rounded-2xl bg-neutral-50 border border-gray-200 flex items-center space-x-4">
            <img
              src={article.author.avatar_url}
              alt={article.author.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-brand-gold flex-shrink-0"
            />
            <div className="space-y-1">
              <h4 className="font-heading font-black text-sm text-gray-900">
                {article.author.name}
              </h4>
              <p className="text-xs text-gray-500 font-medium">
                {article.author.designation} &bull; {article.author.bureau}
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Covering breaking regional news, parliamentary civic affairs, agricultural commodities, and community development across Northern Uganda.
              </p>
            </div>
          </div>

          {/* Confidential News Tip Banner */}
          <div className="my-8 p-5 bg-gradient-to-r from-neutral-900 to-red-950 text-white rounded-2xl border border-red-900 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <h4 className="font-heading font-black text-base text-brand-gold">
                Do you have additional information about this story?
              </h4>
              <p className="text-xs text-gray-300 mt-1">
                Send confidential documents or photos directly to the Unity TV investigative desk in Lira City.
              </p>
            </div>
            <a
              href="https://wa.me/256772000000"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 flex-shrink-0 shadow transition-transform active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp Tip Desk</span>
            </a>
          </div>

        </div>

        {/* Right Column (4 cols): Nile Post Sticky Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Half-page Ad Slot */}
          <div className="sticky top-20 space-y-6">
            
            {/* Live TV Widget */}
            <div className="bg-neutral-950 text-white p-5 rounded-2xl border border-neutral-800 shadow-xl overflow-hidden relative group">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-red-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-full flex items-center space-x-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>Live on Air</span>
                </span>
                <span className="text-[10px] text-gray-400 font-mono">Unity TV MCR</span>
              </div>
              <h3 className="font-heading font-black text-base text-white leading-tight mb-2">
                Watch Unity TV Live Stream
              </h3>
              <p className="text-xs text-gray-400 mb-4 line-clamp-2">
                Live broadcast from Lira City covering news, Odiko Alyet talk shows, and Luo cultural features.
              </p>
              <Link
                href="/live"
                className="w-full py-2.5 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-heading font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 transition-colors shadow"
              >
                <Radio className="w-4 h-4 text-brand-dark" />
                <span>Watch Live Broadcast</span>
              </Link>
            </div>

            {/* Sidebar Ad Unit (300x600 Half-page) */}

            {/* Most Read in Category (Watermark Numbers) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-heading font-black text-sm uppercase text-gray-900 tracking-wider flex items-center space-x-2 mb-4 pb-2 border-b border-gray-100">
                <TrendingUp className="w-4 h-4 text-brand-crimson" />
                <span>Most Read Stories</span>
              </h3>

              <div className="space-y-4">
                {relatedArticles.slice(0, 5).map((rel, idx) => (
                  <Link
                    key={rel.id}
                    href={`/news/${rel.category?.slug || article.category.slug}/${rel.slug}`}
                    className="flex items-start space-x-3 group"
                  >
                    <span className="font-heading font-black text-2xl text-gray-300 group-hover:text-brand-crimson transition-colors leading-none w-6 flex-shrink-0">
                      0{idx + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-heading font-bold text-xs text-gray-900 group-hover:text-brand-crimson transition-colors line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {rel.reading_time_minutes} min read &bull; {rel.location_tag}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Grid: More Stories From Category */}
      {relatedArticles && relatedArticles.length > 0 && (
        <section className="mt-14 pt-8 border-t-2 border-brand-dark">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-black text-xl sm:text-2xl text-brand-dark tracking-tight">
              MORE FROM {article.category.name.toUpperCase()}
            </h3>
            <Link
              href={`/news/${article.category.slug}`}
              className="text-xs font-bold text-brand-crimson hover:underline flex items-center space-x-1"
            >
              <span>View All Category News</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                href={`/news/${rel.category?.slug || article.category.slug}/${rel.slug}`}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950">
                    <img
                      src={getImageUrl(rel.featured_image, 400)}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span className="absolute bottom-2 left-2 bg-black/80 text-[10px] text-white px-2 py-0.5 rounded font-bold">
                      {rel.location_tag}
                    </span>
                  </div>
                  <div className="p-3.5">
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-gray-900 group-hover:text-brand-crimson transition-colors line-clamp-2 leading-snug">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1.5">
                      {rel.excerpt}
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span>{new Date(rel.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  <span className="text-brand-crimson font-bold group-hover:underline">Read Article &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

