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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Monday - Thursday */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
              <h3 className="text-xl font-bold text-brand-crimson uppercase border-b border-neutral-100 pb-3 mb-4">Monday - Thursday</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">3:00am - 6:45am</span><span className="font-semibold text-neutral-900 capitalize">Morning Devotion</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">6:45am</span><span className="font-semibold text-neutral-900 capitalize">News in Luo</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">7:00am - 8:30am</span><span className="font-semibold text-neutral-900 capitalize">Announcements</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">8:30am - 10:45am</span><span className="font-semibold text-neutral-900 capitalize">Odiko Alyet</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">10:45am - 11:00am</span><span className="font-semibold text-neutral-900 capitalize">Sports Update</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">11:00am - 12:45pm</span><span className="font-semibold text-neutral-900 capitalize">Mid Morning Rave</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">12:45pm</span><span className="font-semibold text-neutral-900 capitalize">News in Luo</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">1:00pm - 2:00pm</span><span className="font-semibold text-neutral-900 capitalize">Announcements</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">2:00pm - 4:30pm</span><span className="font-semibold text-neutral-900 capitalize">The Afternoon Drive</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">4:30pm - 5:00pm</span><span className="font-semibold text-neutral-900 capitalize">Sports Update</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">5:00pm - 6:45pm</span><span className="font-semibold text-neutral-900 capitalize">Announcements</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">6:45pm</span><span className="font-semibold text-neutral-900 capitalize">News in Luo</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">7:00pm - 10:00pm</span><span className="font-semibold text-neutral-900 capitalize">Gwec Apoko</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">10:00pm - 11:00pm</span><span className="font-semibold text-neutral-900 capitalize">Sports Updates</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">11:00pm - 3:00am</span><span className="font-semibold text-neutral-900 capitalize">Quiet Storm</span></li>
              </ul>
            </div>

            {/* Friday */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
              <h3 className="text-xl font-bold text-brand-crimson uppercase border-b border-neutral-100 pb-3 mb-4">Friday</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">3:00am - 6:45am</span><span className="font-semibold text-neutral-900 capitalize">Morning Devotion</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">6:45am</span><span className="font-semibold text-neutral-900 capitalize">News in Luo</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">7:00am - 8:30am</span><span className="font-semibold text-neutral-900 capitalize">Announcements</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">8:30am - 10:45am</span><span className="font-semibold text-neutral-900 capitalize">Odiko Alyet</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">10:45am - 11:00am</span><span className="font-semibold text-neutral-900 capitalize">Sports Update</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">11:00am - 12:45pm</span><span className="font-semibold text-neutral-900 capitalize">Mid Morning Rave</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">12:45pm</span><span className="font-semibold text-neutral-900 capitalize">News in Luo</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">1:00pm - 2:00pm</span><span className="font-semibold text-neutral-900 capitalize">Announcements</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">2:00pm - 4:30pm</span><span className="font-semibold text-neutral-900 capitalize">Tekwaro</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">4:30pm - 5:00pm</span><span className="font-semibold text-neutral-900 capitalize">Sports Update</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">5:00pm - 6:45pm</span><span className="font-semibold text-neutral-900 capitalize">Announcements</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">6:45pm</span><span className="font-semibold text-neutral-900 capitalize">News in Luo</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">7:00pm - 11:00pm</span><span className="font-semibold text-neutral-900 capitalize">Jiri</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">11:00pm - 3:00am</span><span className="font-semibold text-neutral-900 capitalize">Throwback Friday</span></li>
              </ul>
            </div>

            {/* Saturday */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
              <h3 className="text-xl font-bold text-brand-crimson uppercase border-b border-neutral-100 pb-3 mb-4">Saturday</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">3:00am - 6:45am</span><span className="font-semibold text-neutral-900 capitalize">Morning Devotion</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">6:45am</span><span className="font-semibold text-neutral-900 capitalize">News in Luo</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">7:00am - 8:30am</span><span className="font-semibold text-neutral-900 capitalize">Announcements</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">8:30am - 10:45am</span><span className="font-semibold text-neutral-900 capitalize">Parliament Alwak</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">10:45am - 11:00am</span><span className="font-semibold text-neutral-900 capitalize">Sports Update</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">11:00am - 12:45pm</span><span className="font-semibold text-neutral-900 capitalize">Education Forum</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">12:45pm</span><span className="font-semibold text-neutral-900 capitalize">News in Luo</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">1:00pm - 2:00pm</span><span className="font-semibold text-neutral-900 capitalize">Announcements</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">2:00pm - 5:00pm</span><span className="font-semibold text-neutral-900 capitalize">Top 20</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">5:00pm - 6:45pm</span><span className="font-semibold text-neutral-900 capitalize">Announcements</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">6:45pm</span><span className="font-semibold text-neutral-900 capitalize">News in Luo</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">7:00pm - 10:00pm</span><span className="font-semibold text-neutral-900 capitalize">Gwec Apoko</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">10:00pm - 11:00pm</span><span className="font-semibold text-neutral-900 capitalize">Gero Yi Ot</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">11:00pm - 3:00am</span><span className="font-semibold text-neutral-900 capitalize">Dance Mania</span></li>
              </ul>
            </div>

            {/* Sunday */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
              <h3 className="text-xl font-bold text-brand-crimson uppercase border-b border-neutral-100 pb-3 mb-4">Sunday</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">3:00am - 6:45am</span><span className="font-semibold text-neutral-900 capitalize">Morning Devotion</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">6:45am</span><span className="font-semibold text-neutral-900 capitalize">News in Luo</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">7:00am - 8:30am</span><span className="font-semibold text-neutral-900 capitalize">Announcements</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">8:30am - 10:45am</span><span className="font-semibold text-neutral-900 capitalize">Lego</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">10:45am - 11:00am</span><span className="font-semibold text-neutral-900 capitalize">Unity Kids</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">11:00am - 12:45pm</span><span className="font-semibold text-neutral-900 capitalize">The Youth Hub</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">12:45pm</span><span className="font-semibold text-neutral-900 capitalize">News in Luo</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">1:00pm - 2:00pm</span><span className="font-semibold text-neutral-900 capitalize">Announcements</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">2:00pm - 5:00pm</span><span className="font-semibold text-neutral-900 capitalize">Unity Miscellany</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">5:00pm - 6:45pm</span><span className="font-semibold text-neutral-900 capitalize">Announcements</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">6:45pm</span><span className="font-semibold text-neutral-900 capitalize">News in Luo</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">7:00pm - 10:00pm</span><span className="font-semibold text-neutral-900 capitalize">Gwec Apoko</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">10:00pm - 11:00pm</span><span className="font-semibold text-neutral-900 capitalize">Gero Yi Ot</span></li>
                <li className="flex"><span className="text-neutral-500 w-36 shrink-0">11:00pm - 3:00am</span><span className="font-semibold text-neutral-900 capitalize">Overnight Service</span></li>
              </ul>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
