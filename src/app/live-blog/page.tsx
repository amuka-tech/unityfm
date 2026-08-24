import React from 'react';
import Link from 'next/link';
import { getLiveBlogsDb } from '@/lib/server-actions';
import { Activity, Clock, MapPin, Search } from 'lucide-react';

export const metadata = {
  title: 'Live Updates & Breaking Events - Radio Unity FM Uganda',
  description: 'Follow our real-time coverage of breaking news and major events across Northern Uganda.',
};

export default async function LiveBlogIndexPage() {
  const allBlogs = await getLiveBlogsDb();

  return (
    <div className="bg-brand-surface min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        <div className="mb-8">
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-gray-900 mb-3 tracking-tight">
            Live Events & Breaking Coverage
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            Real-time updates, timeline summaries, and key events reported straight from the field by our newsroom.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allBlogs.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
              No live events have been recorded yet.
            </div>
          ) : (
            allBlogs.map((blog: any) => (
              <Link key={blog.id} href={`/live-blog/${blog.id}`} className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:border-brand-crimson/40">
                <div className={`p-4 border-b ${blog.is_active === 1 ? 'bg-brand-crimson/5 border-brand-crimson/10' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex items-center justify-between mb-2">
                    {blog.is_active === 1 ? (
                      <span className="flex items-center space-x-1.5 bg-brand-crimson text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse shadow-sm">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                        <span>LIVE NOW</span>
                      </span>
                    ) : (
                      <span className="bg-gray-200 text-gray-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Concluded
                      </span>
                    )}
                    <span className="text-[11px] text-gray-500 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(blog.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </span>
                  </div>
                  <h2 className="font-heading font-black text-xl text-brand-dark group-hover:text-brand-crimson transition-colors leading-tight mb-2">
                    {blog.title}
                  </h2>
                  {blog.event_location && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500 font-medium">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span>{blog.event_location}</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1">
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {blog.summary || "Follow our timeline for the latest developments regarding this event."}
                  </p>
                </div>
                <div className="p-4 pt-0 mt-auto">
                  <div className="w-full text-center py-2 bg-gray-50 group-hover:bg-brand-crimson group-hover:text-white text-brand-crimson font-bold text-xs rounded transition-colors uppercase tracking-widest">
                    {blog.is_active === 1 ? 'Enter Live Feed' : 'Read Summary'}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
