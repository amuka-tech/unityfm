'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Plus, MoreVertical, Edit2, Trash2, Mic2, Users } from 'lucide-react';

const MOCK_SCHEDULE = [
  { id: '1', time: '06:00 AM - 09:00 AM', show: 'Morning Breeze', host: 'DJ Okello', type: 'Live', status: 'upcoming' },
  { id: '2', time: '09:00 AM - 12:00 PM', show: 'Lango Business Hour', host: 'Sarah A.', type: 'Live', status: 'upcoming' },
  { id: '3', time: '12:00 PM - 02:00 PM', show: 'Midday Request', host: 'DJ Flex', type: 'Live', status: 'upcoming' },
  { id: '4', time: '02:00 PM - 04:00 PM', show: 'Sports Update', host: 'Tony K.', type: 'Pre-recorded', status: 'upcoming' },
  { id: '5', time: '04:00 PM - 07:00 PM', show: 'Evening Drive', host: 'MC Jimmy', type: 'Live', status: 'upcoming' },
];

export function RadioScheduleDesk() {
  const [activeDay, setActiveDay] = useState('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Program Guide</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the daily radio broadcast schedule</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Add Program
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Day Selector */}
        <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6">
          <div className="flex space-x-6 overflow-x-auto no-scrollbar">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeDay === day 
                    ? 'border-gray-900 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule List */}
        <div className="divide-y divide-gray-100">
          {MOCK_SCHEDULE.map((slot) => (
            <div key={slot.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 transition-colors group">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex flex-col items-center justify-center w-12 h-12 bg-gray-100 rounded-lg text-gray-500">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-brand-crimson">{slot.time}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      slot.type === 'Live' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {slot.type}
                    </span>
                  </div>
                  <h3 className="text-gray-900 font-semibold mb-1">{slot.show}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Mic2 className="w-3.5 h-3.5" />
                    <span>{slot.host}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
