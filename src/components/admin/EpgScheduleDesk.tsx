'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  Tv, 
  User, 
  Sparkles, 
  X,
  CheckCircle2,
  CalendarDays,
  Star
} from 'lucide-react';
import { EpgProgram } from '@/types';

interface EpgScheduleDeskProps {
  epg: EpgProgram[];
  onSaveProgram: (program: Partial<EpgProgram>) => Promise<void>;
  onDeleteProgram: (id: string | number) => Promise<void>;
  canEditStream: boolean;
  notify: (msg: string) => void;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export function EpgScheduleDesk({
  epg,
  onSaveProgram,
  onDeleteProgram,
  canEditStream,
  notify,
}: EpgScheduleDeskProps) {
  const [selectedDay, setSelectedDay] = useState<typeof daysOfWeek[number]>('Monday');
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<EpgProgram | null>(null);

  // Form State
  const [showName, setShowName] = useState('');
  const [presenterName, setPresenterName] = useState('');
  const [startTime, setStartTime] = useState('06:00');
  const [endTime, setEndTime] = useState('09:00');
  const [day, setDay] = useState<typeof daysOfWeek[number]>('Monday');
  const [category, setCategory] = useState('News & Current Affairs');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setEditingProgram(null);
    setShowName('');
    setPresenterName('');
    setStartTime('06:00');
    setEndTime('09:00');
    setDay(selectedDay);
    setCategory('News & Current Affairs');
    setDescription('');
    setIsFeatured(false);
    setShowModal(true);
  };

  const handleOpenEdit = (prog: EpgProgram) => {
    setEditingProgram(prog);
    setShowName(prog.show_name);
    setPresenterName(prog.presenter_name);
    setStartTime(prog.start_time);
    setEndTime(prog.end_time);
    setDay(prog.day_of_week);
    setCategory(prog.category);
    setDescription(prog.description || '');
    setIsFeatured((prog as any).is_featured || false);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSaveProgram({
        id: editingProgram?.id,
        show_name: showName,
        presenter_name: presenterName,
        start_time: startTime,
        end_time: endTime,
        day_of_week: day,
        category: category,
        description: description,
        is_featured: isFeatured,
      } as any);

      notify(`Program "${showName}" saved to TV Guide!`);
      setShowModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const dayPrograms = epg
    .filter((p) => p.day_of_week === selectedDay)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Day Tabs */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">7-Day Weekly TV Guide Planner (EPG)</h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage broadcast schedules, anchors, show lineups, and program slots for each day of the week.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenCreate}
            className="bg-brand-crimson hover:bg-red-700 text-white shadow-sm  rounded-lg px-4 py-2 text-sm font-medium transition-all flex items-center space-x-2 self-start sm:self-auto"
            disabled={!canEditStream}
          >
            <Plus className="w-4 h-4" />
            <span>Add Program</span>
          </button>
        </div>

        {/* Day Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none pt-4 border-t border-gray-200">
          {daysOfWeek.map((d) => {
            const count = epg.filter((p) => p.day_of_week === d).length;
            const isSelected = selectedDay === d;

            return (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center space-x-2 transition-all ${
                  isSelected
                    ? 'bg-gray-900 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{d}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs border ${
                  isSelected ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Program Schedule Timeline / Cards */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{selectedDay}&apos;s Broadcast Lineup ({dayPrograms.length} Shows)</span>
          </h3>
          <span className="text-xs text-gray-500 font-mono">Live Sync</span>
        </div>

        {dayPrograms.length === 0 ? (
          <div className="py-16 text-center text-gray-500 space-y-3">
            <Tv className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-sm">No programs scheduled for {selectedDay}.</p>
            <button
              onClick={handleOpenCreate}
              className="text-sm text-gray-900 hover:underline font-medium"
            >
              Add first show for {selectedDay}
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {dayPrograms.map((prog) => (
              <div
                key={prog.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start sm:items-center space-x-6">
                  {/* Time Badge */}
                  <div className="min-w-[120px] flex-shrink-0">
                    <span className="font-mono text-sm font-medium text-gray-900 block">
                      {prog.start_time} - {prog.end_time}
                    </span>
                    <span className="text-xs text-gray-500 mt-1 block">
                      Scheduled Slot
                    </span>
                  </div>

                  {/* Show Info */}
                  <div>
                    <div className="flex items-center space-x-3">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {prog.show_name}
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-50 text-gray-600 border-gray-200">
                        {prog.category}
                      </span>
                      {(prog as any).is_featured && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1.5">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{prog.presenter_name || 'Unity Newsroom'}</span>
                    </div>

                    {prog.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {prog.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 self-end sm:self-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onSaveProgram({ ...(prog as any), is_featured: !(prog as any).is_featured } as any).then(() => notify((prog as any).is_featured ? `"${prog.show_name}" removed from Featured.` : `"${prog.show_name}" is now Featured on /shows!`))}
                    className={`p-2 rounded-lg border transition-colors ${(prog as any).is_featured ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-white border-gray-200 hover:bg-amber-50 text-gray-400 hover:text-amber-600'}`}
                    title="Toggle Featured on /shows page"
                    disabled={!canEditStream}
                  >
                    <Star className={`w-4 h-4 ${(prog as any).is_featured ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(prog)}
                    className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                    title="Edit Show"
                    disabled={!canEditStream}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteProgram(prog.id)}
                    className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-red-50 text-red-600 transition-colors"
                    title="Delete Show"
                    disabled={!canEditStream}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Program Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-gray-500" />
                <span>{editingProgram ? 'Edit Television Program' : 'Add New TV Program'}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-sm">
              
              <div>
                <label className="block text-gray-700 font-medium mb-1.5">Show Name *</label>
                <input
                  type="text"
                  value={showName}
                  onChange={(e) => setShowName(e.target.value)}
                  placeholder="e.g. Lango Agro Focus"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1.5">Day of Week</label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value as any)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  >
                    {daysOfWeek.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  >
                    <option value="News & Current Affairs">News & Current Affairs</option>
                    <option value="Agribusiness & Markets">Agribusiness & Markets</option>
                    <option value="Civic & Talk Show">Civic & Talk Show</option>
                    <option value="Sports & Athletics">Sports & Athletics</option>
                    <option value="Culture & Heritage">Culture & Heritage</option>
                    <option value="Entertainment & Music">Entertainment & Music</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1.5">Start Time (HH:MM)</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="06:00"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1.5">End Time (HH:MM)</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="09:00"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1.5">Lead Anchor / Presenter</label>
                <input
                  type="text"
                  value={presenterName}
                  onChange={(e) => setPresenterName(e.target.value)}
                  placeholder="e.g. Denis Ogwang"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1.5">Program Synopsis / Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Brief summary of the program format and topics covered..."
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>

              <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-amber-50 hover:border-amber-200 transition-colors">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-gray-300"
                />
                <Star className={`w-4 h-4 ${isFeatured ? 'text-amber-500 fill-current' : 'text-gray-400'}`} />
                <div>
                  <span className="font-bold text-gray-900 block text-sm">Feature on Shows Page</span>
                  <span className="text-xs text-gray-500">Promotes this show to the prime-time hero cards on /shows</span>
                </div>
              </label>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-brand-crimson hover:bg-red-700 text-white shadow-sm  rounded-lg px-4 py-2 text-sm font-medium transition-all"
                >
                  {isSubmitting ? 'Saving...' : editingProgram ? 'Update Program' : 'Add to Schedule'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

