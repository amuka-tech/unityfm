'use client';

import React, { useState, useEffect } from 'react';
import { Wheat, Plus, Edit2, Trash2, Save, X, Loader2 } from 'lucide-react';
import { Commodity } from '@/types';
import { getCommoditiesDb, saveCommodityDb, deleteCommodityDb } from '@/lib/server-actions';

export function CommoditiesDesk() {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Commodity> | null>(null);

  const fetchCommodities = async () => {
    setIsLoading(true);
    try {
      const data = await getCommoditiesDb();
      setCommodities(data);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCommodities();
  }, []);

  const handleEdit = (item: Commodity) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem({
      name: '',
      price: '',
      trend: '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this commodity?')) {
      await deleteCommodityDb(id);
      fetchCommodities();
    }
  };

  const handleSave = async () => {
    if (!editingItem?.name || !editingItem?.price || !editingItem?.trend) {
      alert('Please fill in all fields');
      return;
    }

    setIsSaving(true);
    try {
      await saveCommodityDb(editingItem);
      setIsModalOpen(false);
      fetchCommodities();
    } catch (error) {
      console.error(error);
      alert('Failed to save commodity');
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Wheat className="w-6 h-6 text-emerald-600" />
              Lango Agri-Market Commodity Watch
            </h2>
            <p className="text-sm text-gray-600 mt-1">Manage the live commodity prices ticker shown on the homepage.</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Commodity
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Commodity Name</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Trend & Location</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {commodities.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-emerald-700 font-bold">{item.price}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{item.trend}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id!)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {commodities.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No commodities tracked. Add one to start.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900">
                {editingItem?.id ? 'Edit Commodity' : 'Add Commodity'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Commodity Name</label>
                <input 
                  type="text" 
                  value={editingItem?.name || ''}
                  onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                  placeholder="e.g., Organic Shea Nuts (Grade A)"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Price</label>
                <input 
                  type="text" 
                  value={editingItem?.price || ''}
                  onChange={e => setEditingItem({...editingItem, price: e.target.value})}
                  placeholder="e.g., UGX 3,800 / kg"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Trend & Location</label>
                <input 
                  type="text" 
                  value={editingItem?.trend || ''}
                  onChange={e => setEditingItem({...editingItem, trend: e.target.value})}
                  placeholder="e.g., +12% (Otuke Hub)"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? 'Saving...' : 'Save Commodity'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
