'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Clock, MapPin } from 'lucide-react';
import { getLiveBlogsDb, getLiveBlogUpdatesDb } from '@/lib/server-actions';

export function PublicLiveBlogSection({ overrideBlogId }: { overrideBlogId?: number }) {
  const [activeBlog, setActiveBlog] = useState<any>(null);
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchLiveBlog = async () => {
      try {
        const blogs = await getLiveBlogsDb();
        const targetBlog = overrideBlogId 
          ? blogs.find((b: any) => b.id === overrideBlogId)
          : blogs.find((b: any) => b.is_active === 1);
        
        if (targetBlog && isMounted) {
          setActiveBlog(targetBlog);
          const feed = await getLiveBlogUpdatesDb(targetBlog.id);
          setUpdates(feed);
        } else if (!targetBlog && isMounted) {
          setActiveBlog(null);
        }
      } catch (err) {
        console.error('Failed to load live blog feed', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLiveBlog();
    // Poll every 10 seconds for new updates
    const interval = setInterval(fetchLiveBlog, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) return null;
  if (!activeBlog) return null;

  return (
    <section id="live-blog-feed" className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 my-8 scroll-mt-24">
      <div className="bg-white border-2 border-brand-crimson/20 rounded-xl overflow-hidden shadow-lg">
        {/* Header */}
        <div className="bg-brand-crimson text-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="flex items-center space-x-1.5 bg-white text-brand-crimson px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider animate-pulse shadow-sm">
                <span className="w-1.5 h-1.5 bg-brand-crimson rounded-full animate-ping"></span>
                <span>Live Updates</span>
              </span>
              {activeBlog.event_location && (
                <span className="text-xs text-red-100 flex items-center space-x-1 font-medium bg-red-900/30 px-2 py-0.5 rounded-full">
                  <MapPin className="w-3 h-3" />
                  <span>{activeBlog.event_location}</span>
                </span>
              )}
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-white drop-shadow-sm">
              {activeBlog.title}
            </h2>
            {activeBlog.summary && (
              <p className="text-sm text-red-50 mt-1 max-w-3xl leading-relaxed">
                {activeBlog.summary}
              </p>
            )}
          </div>
          <div className="shrink-0 flex flex-col items-end">
            <div className="flex items-center space-x-2 text-xs font-medium text-red-100 bg-black/20 px-3 py-1.5 rounded-lg border border-red-500/30 backdrop-blur-sm">
              <Activity className="w-4 h-4 text-brand-gold animate-pulse" />
              <span>Real-Time Feed Active</span>
            </div>
          </div>
        </div>

        {/* Scrolling Feed Container */}
        <div className="bg-gray-50 p-4 sm:p-6 max-h-[500px] overflow-y-auto">
          <div className="max-w-4xl space-y-6">
            {updates.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm">
                Awaiting first live update from our field reporters...
              </div>
            ) : (
              updates.map((update: any) => (
                <div 
                  key={update.id} 
                  className={`relative pl-6 sm:pl-8 border-l-2 transition-all hover:bg-white hover:shadow-sm hover:-translate-y-0.5 p-4 rounded-r-xl border border-transparent hover:border-gray-100 ${update.is_key_event === 1 ? 'border-l-brand-crimson bg-red-50/30' : 'border-l-gray-300'}`}
                >
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[9px] top-5 w-4 h-4 rounded-full border-4 border-white shadow-sm ${update.is_key_event === 1 ? 'bg-brand-crimson' : 'bg-gray-400'}`}></div>
                  
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <span className="text-xs font-bold text-gray-900">{update.author_name}</span>
                    {update.author_role && (
                      <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase px-1.5 py-0.5 bg-gray-100 rounded">{update.author_role}</span>
                    )}
                    <span className="text-[11px] text-gray-400 flex items-center space-x-1 ml-auto">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(update.published_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                    {update.is_key_event === 1 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-brand-crimson text-white">
                        Key Event
                      </span>
                    )}
                  </div>
                  
                  <div 
                    className="text-sm sm:text-base text-gray-800 leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-a:text-brand-crimson prose-strong:text-gray-900"
                    dangerouslySetInnerHTML={{ __html: update.content }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
