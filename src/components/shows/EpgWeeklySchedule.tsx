'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Tv, User, Radio, Play } from 'lucide-react';
import { EpgProgram } from '@/types';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export function EpgWeeklySchedule({ schedule }: { schedule: EpgProgram[] }) {
  const [selectedDay, setSelectedDay] = useState<typeof daysOfWeek[number]>('Monday');

  const filteredPrograms = schedule.filter(
    (p) => p.day_of_week.toLowerCase() === selectedDay.toLowerCase()
  );

  return (
    <div className="space-y-6">
      
      {/* Day Selector Tabs */}
      <div className="flex items-center overflow-x-auto pb-2 space-x-2 border-b border-gray-200 scrollbar-none">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-brand font-heading font-black text-xs sm:text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
              selectedDay === day
                ? 'bg-brand-crimson text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Program Timeline */}
      <div className="space-y-4">
        {filteredPrograms.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-brand border border-gray-200 text-gray-500 text-sm">
            No scheduled broadcasts listed for {selectedDay}. Default 24/7 news programming active.
          </div>
        ) : (
          filteredPrograms.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-brand border border-gray-200 p-4 sm:p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              {/* Time Column */}
              <div className="flex md:flex-col items-center md:items-start space-x-2 md:space-x-0 md:w-32 flex-shrink-0">
                <span className="font-mono font-black text-base sm:text-lg text-brand-dark">
                  {program.start_time}
                </span>
                <span className="text-xs font-mono text-gray-400">
                  to {program.end_time} EAT
                </span>
              </div>

              {/* Show Details */}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="bg-amber-100 text-amber-900 font-bold text-[10px] uppercase px-2 py-0.5 rounded">
                    {program.category}
                  </span>
                  {program.is_live_broadcast && (
                    <span className="bg-brand-crimson text-white font-bold text-[10px] uppercase px-1.5 py-0.5 rounded flex items-center space-x-1">
                      <Radio className="w-2.5 h-2.5 animate-pulse" />
                      <span>Live Studio</span>
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-black text-lg text-gray-900 group-hover:text-brand-crimson transition-colors">
                  {program.show_name}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
                  {program.description}
                </p>
              </div>

              {/* Presenter Profile & Action */}
              <div className="flex items-center space-x-3 md:w-56 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                {program.presenter_image ? (
                  <img
                    src={program.presenter_image}
                    alt={program.presenter_name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-300"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                )}

                <div className="text-left md:text-right">
                  <span className="text-xs font-bold text-gray-900 block">
                    {program.presenter_name}
                  </span>
                  <span className="text-[10px] text-gray-400 block">
                    {program.presenter_role || 'Show Host'}
                  </span>
                </div>

                <Link
                  href="/live"
                  className="p-2 bg-gray-100 hover:bg-brand-crimson hover:text-white rounded-full text-gray-600 transition-colors"
                  title="Watch Broadcast"
                >
                  <Play className="w-4 h-4 fill-current" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
