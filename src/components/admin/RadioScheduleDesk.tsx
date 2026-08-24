'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Edit2, Trash2, Mic2, X, Loader2 } from 'lucide-react';
import { getScheduleScheduleDb, saveScheduleProgramDb, deleteScheduleProgramDb } from '@/lib/server-actions';
import { ScheduleProgram } from '@/types';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
type Day = typeof DAYS[number];

export function RadioScheduleDesk() {
  const [activeDay, setActiveDay] = useState<Day>('Monday');
  const [schedule, setSchedule] = useState<ScheduleProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Partial<ScheduleProgram> | null>(null);

  const fetchSchedule = async () => {
    setIsLoading(true);
    try {
      const data = await getScheduleScheduleDb(activeDay);
      // Sort by start_time
      data.sort((a, b) => a.start_time.localeCompare(b.start_time));
      setSchedule(data);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSchedule();
  }, [activeDay]);

  const handleEdit = (prog: ScheduleProgram) => {
    setEditingProgram(prog);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProgram({
      day_of_week: activeDay,
      show_name: '',
      presenter_name: '',
      start_time: '12:00',
      end_time: '13:00',
      category: 'Talk',
      description: '',
      is_live_broadcast: true
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number | string) => {
    if (confirm('Are you sure you want to delete this program?')) {
      await deleteScheduleProgramDb(id);
      fetchSchedule();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram) return;
    setIsSaving(true);
    try {
      await saveScheduleProgramDb(editingProgram);
      setIsModalOpen(false);
      fetchSchedule();
    } catch (error) {
      console.error(error);
      alert('Failed to save program');
    }
    setIsSaving(false);
  };

  const formatTime = (time24: string) => {
    if (!time24) return '';
    const [h, m] = time24.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12 < 10 ? '0' : ''}${h12}:${m < 10 ? '0' : ''}${m} ${ampm}`;
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Program Guide</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the daily radio broadcast schedule</p>
        </div>
        <button 
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 bg-brand-crimson hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Program
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Days Navigation */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto no-scrollbar">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`flex-shrink-0 px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${
                  activeDay === day 
                    ? 'border-brand-crimson text-brand-crimson bg-white' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule List */}
        <div className="divide-y divide-gray-100 min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-brand-crimson" />
            </div>
          ) : schedule.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <Calendar className="w-8 h-8 mb-2 opacity-50" />
              <p>No programs scheduled for {activeDay}</p>
            </div>
          ) : (
            schedule.map((slot) => (
              <div key={slot.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="hidden sm:flex flex-col items-center justify-center w-14 h-14 bg-gray-100 border border-gray-200 rounded-lg text-brand-crimson">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-brand-crimson">
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        slot.is_live_broadcast ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {slot.is_live_broadcast ? 'Live' : 'Auto'}
                      </span>
                    </div>
                    <h3 className="text-gray-900 font-bold mb-1">{slot.show_name}</h3>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                      <Mic2 className="w-3.5 h-3.5 text-brand-gold" />
                      <span>{slot.presenter_name || 'Studio'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(slot)}
                    className="p-2 text-gray-500 hover:text-brand-crimson hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(slot.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && editingProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-gray-200 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProgram.id ? 'Edit Program' : 'Add Program'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Show Name</label>
                <input
                  type="text"
                  required
                  value={editingProgram.show_name || ''}
                  onChange={e => setEditingProgram({...editingProgram, show_name: e.target.value})}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:border-brand-crimson focus:ring-1 focus:ring-brand-crimson outline-none transition-all"
                  placeholder="e.g. Morning Breeze"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Host / Presenter</label>
                <input
                  type="text"
                  value={editingProgram.presenter_name || ''}
                  onChange={e => setEditingProgram({...editingProgram, presenter_name: e.target.value})}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:border-brand-crimson focus:ring-1 focus:ring-brand-crimson outline-none transition-all"
                  placeholder="e.g. DJ Okello"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Start Time (24h)</label>
                  <input
                    type="time"
                    required
                    value={editingProgram.start_time || ''}
                    onChange={e => setEditingProgram({...editingProgram, start_time: e.target.value})}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:border-brand-crimson focus:ring-1 focus:ring-brand-crimson outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">End Time (24h)</label>
                  <input
                    type="time"
                    required
                    value={editingProgram.end_time || ''}
                    onChange={e => setEditingProgram({...editingProgram, end_time: e.target.value})}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:border-brand-crimson focus:ring-1 focus:ring-brand-crimson outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Day of Week</label>
                <select
                  value={editingProgram.day_of_week || 'Monday'}
                  onChange={e => setEditingProgram({...editingProgram, day_of_week: e.target.value as Day})}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:border-brand-crimson focus:ring-1 focus:ring-brand-crimson outline-none transition-all"
                >
                  {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-brand-crimson hover:bg-red-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
