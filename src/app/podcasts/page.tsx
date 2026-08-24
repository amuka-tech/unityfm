import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Headphones, PlayCircle, Clock, Radio, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Podcasts & Shows — Radio Unity FM 97.7',
  description: 'Catch up on all your favourite Radio Unity FM shows on demand.',
};

export default function PodcastsPage() {
  const podcasts = [
    { id: 1, title: 'Lango Talks', desc: 'The definitive political and social discussion show for the Lango sub-region. We tackle the hard issues with local leaders.', color: 'bg-blue-100 text-blue-700', eps: [{ t: 'Elections 2026 Preparations', d: '45m' }, { t: 'Healthcare Funding Debate', d: '52m' }, { t: 'Education Sector Review', d: '48m' }] },
    { id: 2, title: 'Business Hour', desc: 'Economic analysis, market prices, and entrepreneurial advice tailored for Northern Uganda.', color: 'bg-green-100 text-green-700', eps: [{ t: 'Inflation and Local Markets', d: '60m' }, { t: 'Starting a Small Business', d: '55m' }, { t: 'Agricultural Exports', d: '62m' }] },
    { id: 3, title: 'Health Matters', desc: 'Expert health tips, public health announcements, and Q&A with Dr. Akello.', color: 'bg-rose-100 text-rose-700', eps: [{ t: 'Malaria Prevention', d: '30m' }, { t: 'Maternal Health Focus', d: '35m' }, { t: 'Nutrition for Children', d: '32m' }] },
    { id: 4, title: 'Farm Talk', desc: 'Everything agriculture. From weather forecasts to modern farming techniques for Lango farmers.', color: 'bg-emerald-100 text-emerald-700', eps: [{ t: 'Preparing for the Wet Season', d: '45m' }, { t: 'Pest Control Strategies', d: '42m' }, { t: 'Livestock Management', d: '40m' }] },
    { id: 5, title: 'Sports Arena', desc: 'Weekend sports highlights, local league updates, and interviews with athletes.', color: 'bg-orange-100 text-orange-700', eps: [{ t: 'Weekend Football Roundup', d: '30m' }, { t: 'Athletics Regional Trials', d: '28m' }, { t: 'School Sports Tournament', d: '35m' }] },
    { id: 6, title: 'Evening Drive', desc: 'Unwind with the best music mixes, listener dedications, and community stories.', color: 'bg-purple-100 text-purple-700', eps: [{ t: 'Friday Mix Special', d: '90m' }, { t: 'Throwback Thursday', d: '85m' }, { t: 'Midweek Motivation', d: '92m' }] },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top Banner */}
      <div className="bg-brand-crimson text-white py-3 px-4 text-center text-sm font-medium flex justify-center items-center gap-2">
        <Radio className="w-4 h-4 animate-pulse" />
        Stream live now on 97.7 FM
        <Link href="/listen" className="underline hover:text-gray-200 ml-2">Listen Here</Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Catch Up on Radio Unity FM
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Listen to your favourite shows anytime, anywhere. Full episodes available on demand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {podcasts.map((podcast) => (
            <div key={podcast.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              
              <div className="p-6 border-b border-gray-100 flex items-start gap-4">
                <div className={`w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl font-black ${podcast.color}`}>
                  {podcast.title.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2">{podcast.title}</h2>
                  <p className="text-sm text-gray-600 line-clamp-2">{podcast.desc}</p>
                </div>
              </div>

              <div className="p-6 flex-grow bg-gray-50/50">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Recent Episodes</h3>
                <div className="space-y-3">
                  {podcast.eps.map((ep, i) => (
                    <div key={i} className="flex items-start justify-between gap-3 group cursor-pointer">
                      <div className="flex items-start gap-2">
                        <PlayCircle className="w-4 h-4 text-gray-400 group-hover:text-brand-crimson mt-0.5 flex-shrink-0 transition-colors" />
                        <p className="text-sm text-gray-800 group-hover:text-brand-crimson transition-colors font-medium line-clamp-1">{ep.t}</p>
                      </div>
                      <span className="text-xs text-gray-500 flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        {ep.d}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-white">
                <a 
                  href="https://radio.garden/listen/radio-unity-fm-97-7/LHckS4Xk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors text-sm"
                >
                  <Headphones className="w-4 h-4" />
                  Listen on Radio Garden
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
