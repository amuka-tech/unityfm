import React from 'react';
import { Metadata } from 'next';
import { Radio, MapPin, Languages, Target, Globe, Mic2, Activity, Music, Trophy } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Radio Unity FM 97.7',
  description: 'Learn about Radio Unity FM 97.7, a multi-award-winning community radio station based in Lira, Uganda serving the Acholi and Lango regions since 2001.',
};

export default function AboutPage() {
  return (
    <main className="flex-1 bg-neutral-50 pb-16">
      {/* Hero Section */}
      <section className="bg-brand-crimson text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight mb-6 uppercase">
            About Radio Unity
          </h1>
          <p className="text-lg md:text-xl leading-relaxed text-gray-100 font-medium">
            <strong className="text-brand-yellow font-bold">Radio Unity (Unity FM 97.7)</strong> is a multi-award-winning community radio station based in Lira, Uganda, that has been broadcasting since May 2001. It serves as a primary hub for news, education, and entertainment across the Acholi and Lango regions in Northern Uganda.
          </p>
        </div>
      </section>

      {/* Station Profile */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center space-x-3 mb-8">
            <Radio className="w-8 h-8 text-brand-crimson" />
            <h2 className="text-3xl font-black font-heading text-neutral-900 uppercase tracking-tight">Station Profile</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 hover:border-brand-crimson/30 transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand-crimson/10 flex items-center justify-center text-brand-crimson">
                  <Radio className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-neutral-900 text-lg">Frequency</h3>
              </div>
              <p className="text-neutral-600 font-medium">97.7 MHz</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 hover:border-brand-crimson/30 transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand-crimson/10 flex items-center justify-center text-brand-crimson">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-neutral-900 text-lg">Coverage</h3>
              </div>
              <p className="text-neutral-600 font-medium">Reaches an estimated 4 million listeners across districts including Lira, Apac, Kitgum, Gulu, and Soroti.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 hover:border-brand-crimson/30 transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand-crimson/10 flex items-center justify-center text-brand-crimson">
                  <Languages className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-neutral-900 text-lg">Languages</h3>
              </div>
              <p className="text-neutral-600 font-medium">Broadcasts predominantly in Luo—allowing it to connect directly with rural communities—alongside Swahili and English.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 hover:border-brand-crimson/30 transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand-crimson/10 flex items-center justify-center text-brand-crimson">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-neutral-900 text-lg">Mission</h3>
              </div>
              <p className="text-neutral-600 font-medium">Focuses on community sensitization, promoting regional development, and breaking down government and donor policies for the public.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 hover:border-brand-crimson/30 transition-colors md:col-span-2">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand-crimson/10 flex items-center justify-center text-brand-crimson">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-neutral-900 text-lg">Digital Presence</h3>
              </div>
              <p className="text-neutral-600 font-medium">Streams globally via platforms like Zeno.FM and PCRADIO for audiences outside the local FM transmission range.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programming & Content */}
      <section className="py-16 bg-white border-y border-neutral-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center space-x-3 mb-6">
            <Mic2 className="w-8 h-8 text-brand-crimson" />
            <h2 className="text-3xl font-black font-heading text-neutral-900 uppercase tracking-tight">Programming & Content</h2>
          </div>
          
          <p className="text-lg text-neutral-600 mb-10 leading-relaxed font-medium">
            Unity FM maintains a robust news department known for delivering local and international breaking news. The station designs its programming to cater to both rural communities and urban listeners, spanning social, cultural, health, and political topics.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-brand-crimson font-bold text-lg">
                <Mic2 className="w-5 h-5" />
                <h3>Daily Talk & News</h3>
              </div>
              <ul className="space-y-2 text-neutral-700 font-medium pl-7">
                <li>• Great Morning Show</li>
                <li>• The Family Agenda</li>
                <li>• Sunday Miscellany</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-brand-crimson font-bold text-lg">
                <Activity className="w-5 h-5" />
                <h3>Health & Civic Duty</h3>
              </div>
              <ul className="space-y-2 text-neutral-700 font-medium pl-7">
                <li>• The Unity Doctor</li>
                <li>• Crime Prevention</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-brand-crimson font-bold text-lg">
                <Music className="w-5 h-5" />
                <h3>Youth & Entertainment</h3>
              </div>
              <ul className="space-y-2 text-neutral-700 font-medium pl-7">
                <li>• Unity Top 20</li>
                <li>• The Kids Show</li>
                <li>• The Teenage Show</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-brand-crimson font-bold text-lg">
                <Trophy className="w-5 h-5" />
                <h3>Athletics</h3>
              </div>
              <ul className="space-y-2 text-neutral-700 font-medium pl-7">
                <li>• Sports Roundup</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
