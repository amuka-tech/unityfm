import React from 'react';
import { api } from '@/lib/api';
import { EpgWeeklySchedule } from '@/components/shows/EpgWeeklySchedule';
import Link from 'next/link';
import { Tv, Radio, User, Star, Calendar } from 'lucide-react';

export const metadata = {
  title: 'TV Shows & Weekly EPG Schedule — Unity TV Uganda',
  description: 'Complete weekly broadcast schedule and presenter directory for Unity TV Uganda in Lira City.',
};

export default async function ShowsPage() {
  const [schedule] = await Promise.all([
    api.getEpgSchedule(),
  ]);

  const featuredShows = schedule.filter(s => s.is_featured);

  return (
    <div className="bg-brand-surface min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-brand p-6 border-l-4 border-brand-gold shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              <Link href="/" className="hover:text-brand-crimson">Home</Link>
              <span>/</span>
              <span className="text-brand-crimson font-bold">Broadcast Center</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-4xl text-brand-dark">
              TV Shows & Weekly Schedule Guide (EPG)
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
              Explore our full weekly program line-up across news bulletins, agribusiness forums, Luo heritage talk shows, and sports analysis broadcasting from Lira City.
            </p>
          </div>

          <Link
            href="/live"
            className="px-4 py-2.5 bg-brand-crimson hover:bg-brand-crimson-light text-white font-bold text-xs rounded-brand flex items-center space-x-2 shadow self-start md:self-center transition-colors"
          >
            <Radio className="w-4 h-4 text-brand-gold animate-pulse" />
            <span>Watch Live TV Now</span>
          </Link>
        </div>


        {/* Featured Prime-Time Shows */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-4 h-4 text-brand-gold fill-current" />
            <h2 className="font-heading font-black text-xl text-brand-dark">
              Featured Prime-Time Shows & Bulletins
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredShows.slice(0, 3).map((show) => (
              <div
                key={show.id}
                className="bg-white rounded-brand border border-gray-200 overflow-hidden shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                {show.banner_image && (
                  <div className="relative aspect-[16/9] overflow-hidden bg-neutral-900">
                    <img
                      src={show.banner_image}
                      alt={show.show_name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-brand-crimson text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow">
                      {show.day_of_week} ({show.start_time})
                    </span>
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      {show.category}
                    </span>
                    <h3 className="font-heading font-black text-lg text-brand-dark mt-2 mb-1.5">
                      {show.show_name}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {show.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      {show.presenter_image && (
                        <img
                          src={show.presenter_image}
                          alt={show.presenter_name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-300"
                        />
                      )}
                      <span className="font-bold text-gray-800">{show.presenter_name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-brand-crimson font-bold">
                      {show.start_time} - {show.end_time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Weekly EPG Timeline */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-4 h-4 text-brand-crimson" />
            <h2 className="font-heading font-black text-xl text-brand-dark">
              Weekly Timetable Grid
            </h2>
          </div>

          <EpgWeeklySchedule schedule={schedule} />
        </div>

      </div>
    </div>
  );
}
