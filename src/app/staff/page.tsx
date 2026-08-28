import React from 'react';
import { Metadata } from 'next';
import { Users, User as UserIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Staff | Radio Unity FM 97.7',
  description: 'Meet the dedicated team behind Radio Unity FM 97.7, bringing you the best in news, entertainment, and education across Northern Uganda.',
};

export default function StaffPage() {
  const staffMembers = [
    'Eleng Ambrose',
    'Odyek Joshua',
    'Ogwal Mike',
    'Bob Oyuku Ojok',
    'Olang Bismark',
    'Aaron Olao',
    'Gom Belmos',
    'James Ronald Abaca',
    'Finnelah Akullu Opio',
    'Moi Daniel',
    'Isaac Obua',
    'Rolex Akena Ogwal',
    'Charles Osendro',
    'Kim Wegulu',
    'Auma Winnie',
    'Okwanga Ambrose',
    'Olet Shadrack',
    'Adupa Jasper David',
    'Ngura Mutabgabe'
  ];

  return (
    <main className="flex-1 bg-neutral-50 pb-16">
      {/* Hero Section */}
      <section className="bg-brand-crimson text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <div className="inline-flex items-center justify-center space-x-3 mb-6 bg-white/10 px-4 py-2 rounded-full">
            <Users className="w-5 h-5 text-brand-yellow" />
            <span className="font-bold uppercase tracking-widest text-sm text-brand-yellow">Meet The Team</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tight mb-6 uppercase">
            Our Staff Profiles
          </h1>
          <p className="text-lg md:text-xl leading-relaxed text-gray-100 font-medium max-w-2xl mx-auto">
            The dedicated voices and minds behind Radio Unity FM 97.7. Delivering quality news, engaging talk shows, and community education across the region.
          </p>
        </div>
      </section>

      {/* Staff Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {staffMembers.map((name, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 flex flex-col items-center text-center hover:border-brand-crimson/30 hover:shadow-md transition-all group">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-crimson/5 transition-colors border-4 border-white shadow-sm ring-1 ring-gray-100">
                  <UserIcon className="w-10 h-10 text-gray-400 group-hover:text-brand-crimson transition-colors" />
                </div>
                <h3 className="font-bold text-neutral-900 text-lg">{name}</h3>
                <p className="text-sm text-brand-crimson font-semibold mt-1">Radio Unity Staff</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
