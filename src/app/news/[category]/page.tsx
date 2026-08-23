import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { MapPin, Clock, ArrowRight, Video } from 'lucide-react';

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ search?: string }>;
}) {
  const { category: categorySlug } = await params;
  const { search } = await searchParams;

  const [articles, categories] = await Promise.all([
    api.getArticles({ category: categorySlug, search }),
    api.getCategories(),
  ]);

  const currentCategory = categories.find((c) => c.slug === categorySlug) || {
    id: 99,
    name: categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    slug: categorySlug,
    color: '#FFC20E',
    description: `Latest news and updates from ${categorySlug.replace(/-/g, ' ')}.`,
  };

  const leadStory = articles[0];
  const gridStories = articles.slice(1);

  return (
    <div className="bg-brand-surface min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        
        {/* Category Header */}
        <div className="bg-white rounded-brand p-6 border border-gray-200 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                <Link href="/" className="hover:text-brand-crimson">Home</Link>
                <span>/</span>
                <span className="text-brand-crimson font-black">News</span>
              </div>
              <h1 className="font-heading font-black text-2xl sm:text-4xl text-brand-dark">
                {currentCategory.name}
              </h1>
              {currentCategory.description && (
                <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
                  {currentCategory.description}
                </p>
              )}
            </div>

            <div className="text-xs bg-neutral-100 text-gray-700 px-3 py-1.5 rounded-full font-bold self-start sm:self-center">
              {articles.length} Stories Available
            </div>
          </div>

          {/* Subcategory Pills if any */}
          {currentCategory.subcategories && currentCategory.subcategories.length > 0 && (
            <div className="flex items-center overflow-x-auto pt-4 mt-4 border-t border-gray-100 space-x-2 scrollbar-none">
              <span className="text-xs font-bold text-gray-400 uppercase mr-1">Editions:</span>
              {currentCategory.subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/news/${sub.slug}`}
                  className="px-3 py-1 bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-brand-dark rounded-full text-xs font-semibold whitespace-nowrap transition-colors"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Top Leaderboard Ad */}

        {articles.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-brand border border-gray-200 space-y-3">
            <h3 className="font-heading font-bold text-lg text-gray-700">No stories currently in this category.</h3>
            <p className="text-xs text-gray-500">Check back shortly for live newsroom updates from Lira City.</p>
            <Link href="/" className="inline-block px-4 py-2 bg-brand-crimson text-white text-xs font-bold rounded">
              Return to Homepage
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Lead Category Story */}
            {leadStory && (
              <div className="bg-white rounded-brand border border-gray-200 overflow-hidden shadow-card hover:shadow-card-hover transition-all grid grid-cols-1 lg:grid-cols-12 group">
                <Link
                  href={`/news/${leadStory.category.slug}/${leadStory.slug}`}
                  className="lg:col-span-7 relative aspect-[16/10] overflow-hidden bg-neutral-900"
                >
                  <img
                    src={leadStory.featured_image}
                    alt={leadStory.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-brand-gold text-brand-dark font-black text-xs uppercase px-2.5 py-1 rounded shadow">
                    {leadStory.location_tag}
                  </span>
                </Link>

                <div className="lg:col-span-5 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400 mb-2">
                      <span>{new Date(leadStory.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      <span>•</span>
                      <span>{leadStory.reading_time_minutes} min read</span>
                    </div>

                    <Link href={`/news/${leadStory.category.slug}/${leadStory.slug}`}>
                      <h2 className="font-heading font-black text-xl sm:text-2xl text-brand-dark group-hover:text-brand-crimson transition-colors leading-tight mb-3">
                        {leadStory.title}
                      </h2>
                    </Link>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                      {leadStory.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span className="font-bold">{leadStory.author.name}</span>
                    <span className="text-brand-crimson font-bold flex items-center space-x-1">
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridStories.map((story) => (
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
                        loading="lazy"
                      />
                      <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded">
                        {story.location_tag}
                      </span>
                    </Link>

                    <div className="p-4">
                      <div className="text-[11px] text-gray-400 font-semibold mb-1">
                        {new Date(story.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </div>

                      <Link href={`/news/${story.category.slug}/${story.slug}`}>
                        <h3 className="font-heading font-black text-base text-brand-dark group-hover:text-brand-crimson transition-colors leading-snug line-clamp-2 mb-2">
                          {story.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {story.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-neutral-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                    <span>By {story.author.name}</span>
                    <span className="text-brand-crimson font-bold group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                      <span>Read</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </article>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
