'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Plus, Edit2, Trash2, Save, X, Clock, MapPin, ChevronLeft, Calendar } from 'lucide-react';
import { 
  getLiveBlogsDb, 
  getLiveBlogUpdatesDb, 
  createLiveBlogDb, 
  toggleLiveBlogStatusDb, 
  addLiveBlogUpdateDb, 
  updateLiveBlogUpdateDb, 
  deleteLiveBlogUpdateDb 
} from '@/lib/server-actions';

export function LiveBlogDesk() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [updates, setUpdates] = useState<any[]>([]);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    summary: '',
    location: ''
  });

  // Updates Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<any | null>(null);
  const [newUpdate, setNewUpdate] = useState({
    content: '',
    is_key_event: false
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await getLiveBlogsDb();
      setEvents(data);
    } catch (error) {
      console.error("Failed to load events", error);
    }
  };

  const loadUpdates = async (eventId: number) => {
    try {
      const data = await getLiveBlogUpdatesDb(eventId);
      setUpdates(data);
    } catch (error) {
      console.error("Failed to load updates", error);
    }
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
    loadUpdates(event.id);
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.summary || !newEvent.location) return;
    try {
      await createLiveBlogDb(newEvent.title, newEvent.summary, newEvent.location);
      await loadEvents();
      setNewEvent({ title: '', summary: '', location: '' });
      setIsCreatingEvent(false);
    } catch (error) {
      console.error("Failed to create event", error);
    }
  };

  const handleToggleEventStatus = async () => {
    if (!selectedEvent) return;
    try {
      await toggleLiveBlogStatusDb(selectedEvent.id);
      const updatedEvent = { ...selectedEvent, is_active: !selectedEvent.is_active };
      setSelectedEvent(updatedEvent);
      setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    } catch (error) {
      console.error("Failed to toggle status", error);
    }
  };

  const handleSaveUpdate = async () => {
    if (!newUpdate.content || !selectedEvent) return;
    
    try {
      if (editingUpdate) {
        await updateLiveBlogUpdateDb(
          editingUpdate.id, 
          newUpdate.content, 
          newUpdate.is_key_event ? 1 : 0
        );
      } else {
        await addLiveBlogUpdateDb(
          selectedEvent.id,
          newUpdate.content,
          newUpdate.is_key_event ? 1 : 0
        );
      }
      await loadUpdates(selectedEvent.id);
      
      setNewUpdate({ content: '', is_key_event: false });
      setShowModal(false);
      setEditingUpdate(null);
    } catch (error) {
      console.error("Failed to save update", error);
    }
  };

  const handleDeleteUpdate = async (id: number) => {
    if (!selectedEvent) return;
    if (confirm("Are you sure you want to delete this update?")) {
      try {
        await deleteLiveBlogUpdateDb(id);
        await loadUpdates(selectedEvent.id);
      } catch (error) {
        console.error("Failed to delete update", error);
      }
    }
  };

  // Master View: List of Events
  if (!selectedEvent && !isCreatingEvent) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Live Blogs</h2>
            <p className="text-sm text-gray-500 mt-1">Manage multiple live reporting events.</p>
          </div>
          <button 
            onClick={() => setIsCreatingEvent(true)}
            className="bg-brand-crimson hover:bg-red-700 text-white shadow-sm  rounded-lg px-4 py-2 text-sm font-medium transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Live Event</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold border rounded-full uppercase tracking-wider ${event.is_active ? 'bg-red-50 text-red-700 border-red-100' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {event.is_active ? 'LIVE' : 'CONCLUDED'}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-[120px]">{event.event_location}</span>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{event.summary}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleSelectEvent(event)}
                  className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Activity className="w-4 h-4" />
                  <span>Enter Live Desk</span>
                </button>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white border border-gray-200 rounded-xl border-dashed">
              <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>No live events found.</p>
              <p className="text-sm">Create one to start reporting.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Create Event View
  if (isCreatingEvent) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 max-w-3xl mx-auto overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center space-x-3">
          <button 
            onClick={() => setIsCreatingEvent(false)}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Create New Live Event</h2>
            <p className="text-sm text-gray-500">Initialize a new live blog for real-time reporting.</p>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Title</label>
            <input 
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 text-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900 focus:outline-none"
              placeholder="e.g. Breaking: Major Tech Conference 2026"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
            <input 
              type="text"
              value={newEvent.location}
              onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 text-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900 focus:outline-none"
              placeholder="e.g. San Francisco, CA"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Summary</label>
            <textarea 
              value={newEvent.summary}
              onChange={(e) => setNewEvent({...newEvent, summary: e.target.value})}
              className="w-full h-24 bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 text-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900 focus:outline-none"
              placeholder="Brief description of the event..."
            />
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button 
            onClick={() => setIsCreatingEvent(false)}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleCreateEvent}
            disabled={!newEvent.title || !newEvent.summary || !newEvent.location}
            className="bg-brand-crimson hover:bg-red-700 disabled:opacity-50 text-white shadow-sm  rounded-lg px-4 py-2 text-sm font-medium transition-all shadow"
          >
            Create Event
          </button>
        </div>
      </div>
    );
  }

  // Detail View (The Feed)
  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => setSelectedEvent(null)}
          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </button>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2.5 py-0.5 text-xs font-medium border rounded-full ${selectedEvent?.is_active ? 'bg-red-50 text-red-700 border-red-100 animate-pulse' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                {selectedEvent?.is_active ? 'LIVE REPORTING' : 'CONCLUDED'}
              </span>
              <span className="text-xs text-gray-500 flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{selectedEvent?.event_location}</span>
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">{selectedEvent?.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{selectedEvent?.summary}</p>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button 
              onClick={handleToggleEventStatus}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${selectedEvent?.is_active ? 'bg-red-600 hover:bg-red-700 text-white border border-red-700' : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'}`}
            >
              {selectedEvent?.is_active ? 'End Live Blog' : 'Restart Live Blog'}
            </button>
            <button 
              onClick={() => {
                setEditingUpdate(null);
                setNewUpdate({ content: '', is_key_event: false });
                setShowModal(true);
              }}
              className="bg-brand-crimson hover:bg-red-700 text-white   rounded-lg px-4 py-2 text-sm font-medium transition-all flex items-center space-x-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Post Update</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feed list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center space-x-2">
          <Activity className="w-4 h-4 text-gray-700" />
          <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Live Updates Feed</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {updates.map((update) => (
            <div key={update.id} className="p-5 hover:bg-gray-50 transition-colors group flex gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-medium text-gray-900">
                    {/* Database format might not have author nested object */}
                    {update.author?.name || 'Editor'} 
                  </span>
                  <span className="text-[10px] text-gray-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {update.published_at 
                        ? new Date(update.published_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                        : new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </span>
                  {Boolean(update.is_key_event) && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-amber-50 text-amber-700 border-amber-200">
                      Key Event
                    </span>
                  )}
                </div>
                <div 
                  className="text-sm text-gray-800 prose prose-sm max-w-none prose-p:my-1"
                  dangerouslySetInnerHTML={{ __html: update.content }}
                />
              </div>
              <div className="flex items-start space-x-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button 
                  onClick={() => {
                    setEditingUpdate(update);
                    setNewUpdate({ content: update.content, is_key_event: Boolean(update.is_key_event) });
                    setShowModal(true);
                  }}
                  className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors"
                  title="Edit Update"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleDeleteUpdate(update.id)}
                  className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-red-50 text-red-600 transition-colors"
                  title="Delete Update"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {updates.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Activity className="w-8 h-8 mx-auto text-gray-300 mb-3" />
              <p>No updates yet.</p>
              <p className="text-sm mt-1">Click "Post Update" to add the first entry.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Updates */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                {editingUpdate ? 'Edit Live Update' : 'New Live Update'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 bg-white border-none rounded-full p-1.5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Update Content (HTML supported)</label>
                <textarea
                  value={newUpdate.content}
                  onChange={(e) => setNewUpdate({...newUpdate, content: e.target.value})}
                  className="w-full h-48 bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900 focus:outline-none resize-y"
                  placeholder="<p>Enter the latest update from the event...</p>"
                />
              </div>
              <label className="flex items-start space-x-3 cursor-pointer p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={newUpdate.is_key_event}
                  onChange={(e) => setNewUpdate({...newUpdate, is_key_event: e.target.checked})}
                  className="mt-0.5 w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-gray-900"
                />
                <div>
                  <span className="block text-sm font-semibold text-gray-900">Mark as Key Event</span>
                  <span className="block text-sm text-gray-500 mt-0.5">Highlights this update in the event timeline with a distinct badge</span>
                </div>
              </label>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUpdate}
                disabled={!newUpdate.content}
                className="bg-brand-crimson hover:bg-red-700 disabled:opacity-50 text-white   rounded-lg px-5 py-2 text-sm font-medium transition-all flex items-center space-x-2 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>{editingUpdate ? 'Save Changes' : 'Post Update'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

