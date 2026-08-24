import React from 'react';
import Link from 'next/link';
import { Headphones, Clock, PlayCircle, ArrowRight } from 'lucide-react';

export function PodcastSection() {
  const podcasts = [
    { id: 1, title: 'Lango Talks', desc: 'Political discussion show', duration: '45 min', ep: 'Ep. 120' },
    { id: 2, title: 'Business Hour', desc: 'Economic analysis for Northern Uganda', duration: '60 min', ep: 'Ep. 84' },
    { id: 3, title: 'Health Matters', desc: 'Health tips with Dr. Akello', duration: '30 min', ep: 'Ep. 42' },
    { id: 4, title: 'Farm Talk', desc: 'Agriculture for Lango farmers', duration: '45 min', ep: 'Ep. 95' },
    { id: 5, title: 'Sports Arena', desc: 'Sports highlights and interviews', duration: '30 min', ep: 'Ep. 150' },
    { id: 6, title: 'Evening Drive', desc: 'Music and community stories', duration: '90 min', ep: 'Ep. 210' },
  ];

  return (
    <section className="py-12 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Headphones className="w-8 h-8 text-brand-crimson" />
            Catch Up on Our Shows
          </h2>
          <Link href="/podcasts" className="text-brand-crimson hover:text-red-700 font-medium flex items-center gap-1">
            All Podcasts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((podcast) => (
            <Link key={podcast.id} href="/podcasts" className="group block">
              <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all group-hover:border-brand-crimson/30">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-brand-crimson group-hover:bg-brand-crimson group-hover:text-white transition-colors">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {podcast.ep}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-brand-crimson transition-colors">
                  {podcast.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {podcast.desc}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500 gap-1">
                    <Clock className="w-4 h-4" />
                    {podcast.duration}
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-brand-crimson">
                    <PlayCircle className="w-4 h-4" />
                    Listen
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
