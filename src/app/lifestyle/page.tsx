import React from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { HeartHandshake, ArrowRight } from 'lucide-react';

export default async function LifestylePage() {
  const [articles] = await Promise.all([
    api.getArticles({ category: 'lifestyle' }),
  ]);

  return (
    <div className="bg-brand-surface min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        
        {/* Header */}
        <div className="bg-white rounded-brand p-6 border-l-4 border-purple-600 shadow-sm mb-6">
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span>Lifestyle & Culture</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-brand-dark">
            Luo Heritage, Culture & Community
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
            Celebrating Northern Ugandan cultural heritage, Tekwaro Lango customs, indigenous Luo proverbs, regional health, education, music, and family living.
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((story) => (
            <article
              key={story.id}
              className="bg-white rounded-brand border border-gray-200 overflow-hidden shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group"
            >
              <div>
                <Link
                  href={`/news/${story.category.slug}/${story.slug}`}
                  className="block relative aspect-[16/10] overflow-hidden bg-neutral-900"
                >
                  <img
                    src={story.featured_image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 left-2 bg-purple-700 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                    {story.location_tag}
                  </span>
                </Link>
                <div className="p-4">
                  <Link href={`/news/${story.category.slug}/${story.slug}`}>
                    <h3 className="font-heading font-black text-base text-brand-dark group-hover:text-purple-700 transition-colors line-clamp-2 mb-2">
                      {story.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-600 line-clamp-2">{story.excerpt}</p>
                </div>
              </div>

              <div className="px-4 py-3 bg-neutral-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>By {story.author.name}</span>
                <span className="text-purple-700 font-bold flex items-center space-x-1">
                  <span>Read</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
