'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, Wheat, Activity } from 'lucide-react';
import { Article } from '@/types';
import { useDataSaver } from '@/context/DataSaverContext';

const districts = [
  'All Lango',
  'Lira City',
  'Dokolo',
  'Alebtong',
  'Apac',
  'Oyam',
  'Kole',
  'Otuke',
  'Amolatar',
];

const commodityPrices = [
  { name: 'Organic Shea Nuts (Grade A)', price: 'UGX 3,800 / kg', trend: '+12% (Otuke Hub)' },
  { name: 'Soya Beans (Clean)', price: 'UGX 2,450 / kg', trend: '+5% (Lira Main)' },
  { name: 'Simsim / Sesame', price: 'UGX 5,200 / kg', trend: '+8% (Dokolo Market)' },
  { name: 'White Sorghum (Nile Spec)', price: 'UGX 1,600 / kg', trend: 'Stable (Kole Sacco)' },
  { name: 'Sunflower Seeds', price: 'UGX 2,100 / kg', trend: '+4% (Mount Meru Gate)' },
];

export function RegionalHubSection({ articles }: { articles: Article[] }) {
  const [activeDistrict, setActiveDistrict] = useState('All Lango');
  const { getImageUrl } = useDataSaver();

  const filteredArticles = activeDistrict === 'All Lango'
    ? articles
    : articles.filter(a => a.location_tag.toLowerCase().includes(activeDistrict.toLowerCase()));

  return (
    <section className="py-8 bg-neutral-100 border-y border-neutral-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        
        {/* Header & Tagline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-neutral-300 gap-3">
          <div>
            <div className="flex items-center space-x-2 text-brand-crimson font-black text-xs uppercase tracking-widest mb-1">
              <MapPin className="w-4 h-4" />
              <span>REGIONAL PRIORITY DESK</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-brand-dark tracking-tight">
              Lira City & Northern Uganda Hub
            </h2>
          </div>

          {/* District Filter Pills */}
          <div className="flex items-center overflow-x-auto pb-1 space-x-1.5 scrollbar-none">
            {districts.map((district) => (
              <button
                key={district}
                onClick={() => setActiveDistrict(district)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeDistrict === district
                    ? 'bg-brand-crimson text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {district}
              </button>
            ))}
          </div>
        </div>

        {/* Commodity Market Ticker Strip (Crucial for Northern Uganda Agro-economy) */}
        <div className="bg-white rounded-brand p-3 border border-gray-200 mb-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-black text-emerald-800 uppercase tracking-wider flex-shrink-0">
            <Wheat className="w-4 h-4 text-emerald-600" />
            <span>Lango Agri-Market Commodity Watch</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-700">
            {commodityPrices.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-1.5">
                <span className="font-medium text-gray-900">{item.name}:</span>
                <span className="font-bold text-emerald-700">{item.price}</span>
                <span className="text-[10px] text-gray-400">({item.trend})</span>
                {idx < commodityPrices.length - 1 && <span className="text-gray-300 ml-2 hidden sm:inline">•</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Articles 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.slice(0, 6).map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-brand border border-gray-200 overflow-hidden shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group"
            >
              <div>
                <Link
                  href={`/news/${article.category.slug}/${article.slug}`}
                  className="block relative aspect-[16/10] overflow-hidden bg-neutral-900"
                >
                  <img
                    src={getImageUrl(article.featured_image, 600)}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-brand-gold text-brand-dark font-black text-[10px] uppercase px-2 py-0.5 rounded shadow">
                    {article.location_tag}
                  </div>
                </Link>

                <div className="p-4">
                  <div className="text-[11px] font-bold text-gray-400 uppercase mb-1">
                    {article.category.name}
                  </div>
                  <Link href={`/news/${article.category.slug}/${article.slug}`}>
                    <h3 className="font-heading font-black text-base text-brand-dark group-hover:text-brand-crimson transition-colors leading-snug line-clamp-2 mb-2">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-4 py-3 bg-neutral-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span className="font-semibold">{article.author.name}</span>
                <span className="flex items-center space-x-1 text-brand-crimson font-bold group-hover:translate-x-1 transition-transform">
                  <span>Read full story</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
