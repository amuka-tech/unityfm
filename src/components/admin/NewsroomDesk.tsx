'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Eye, 
  ExternalLink, 
  Flame, 
  Star, 
  Check, 
  X, 
  Image as ImageIcon,
  MapPin,
  User as UserIcon,
  Sparkles,
  Layers,
  ArrowUpDown,
  UploadCloud,
  FileAudio,
  Video
} from 'lucide-react';
import Link from 'next/link';
import { Article } from '@/types';
import { mockCategories } from '@/lib/mockData';
import { uploadNewsMediaDb } from '@/lib/server-actions';

interface NewsroomDeskProps {
  articles: Article[];
  onSaveArticle: (articleData: Partial<Article>) => Promise<void>;
  onDeleteArticle: (id: string | number) => Promise<void>;
  searchQuery: string;
  canPublishDirectly: boolean;
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
}

export function NewsroomDesk({
  articles,
  onSaveArticle,
  onDeleteArticle,
  searchQuery,
  canPublishDirectly,
  showCreateModal,
  setShowCreateModal,
}: NewsroomDeskProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterType, setFilterType] = useState<'all' | 'breaking' | 'hero'>('all');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formCategorySlug, setFormCategorySlug] = useState('lira-city');
  const [formLocation, setFormLocation] = useState('Lira City');
  const [formIsBreaking, setFormIsBreaking] = useState(false);
  const [formIsHero, setFormIsHero] = useState(false);
  const [formIsVideoStory, setFormIsVideoStory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isCover) setIsUploadingCover(true);
    else setIsUploadingMedia(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadNewsMediaDb(formData);
      
      if (res.success && res.url) {
        if (isCover) {
          setFormImage(res.url);
        } else {
          const isAudio = file.type.startsWith('audio/');
          const isVideo = file.type.startsWith('video/');
          let insertion = '';
          
          if (isAudio) {
            insertion = `\n\n<audio controls src="${res.url}" className="w-full my-4"></audio>\n\n`;
          } else if (isVideo) {
            insertion = `\n\n<video controls src="${res.url}" className="w-full my-4 rounded-lg shadow-sm"></video>\n\n`;
          } else {
            insertion = `\n\n![${file.name}](${res.url})\n\n`;
          }
          
          setFormContent(prev => prev + insertion);
        }
      } else {
        alert('Upload failed: ' + res.error);
      }
    } catch (error) {
      alert('Upload failed. Please try again.');
    } finally {
      if (isCover) setIsUploadingCover(false);
      else setIsUploadingMedia(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setFormTitle('');
    setFormExcerpt('');
    setFormContent('');
    setFormImage('');
    setFormCategorySlug('lira-city');
    setFormLocation('Lira City');
    setFormIsBreaking(false);
    setFormIsHero(false);
    setFormIsVideoStory(false);
    setShowCreateModal(true);
  };

  const handleOpenEdit = (art: Article) => {
    setEditingArticle(art);
    setFormTitle(art.title);
    setFormExcerpt(art.excerpt || '');
    setFormContent(art.content || '');
    setFormImage(art.featured_image);
    setFormCategorySlug(art.category.slug);
    setFormLocation(art.location_tag || 'Lira City');
    setFormIsBreaking(art.is_breaking || false);
    setFormIsHero(art.is_hero || false);
    setFormIsVideoStory((art as any).is_video_story || false);
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    setIsSubmitting(true);
    const matchedCategory = mockCategories.find(c => c.slug === formCategorySlug) || mockCategories[0];

    try {
      await onSaveArticle({
        id: editingArticle?.id,
        title: formTitle,
        excerpt: formExcerpt,
        content: formContent,
        featured_image: formImage,
        category: {
          id: matchedCategory.id,
          name: matchedCategory.name,
          slug: matchedCategory.slug,
          color: matchedCategory.color,
        },
        location_tag: formLocation,
        is_breaking: formIsBreaking,
        is_hero: formIsHero,
        is_video_story: formIsVideoStory,
      } as any);

      setShowCreateModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered Articles
  const filtered = articles.filter(art => {
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.location_tag?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || art.category.slug === selectedCategory;
    const matchesType = 
      filterType === 'all' ? true :
      filterType === 'breaking' ? art.is_breaking :
      filterType === 'hero' ? art.is_hero : true;

    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Filter Bar */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
            }`}
          >
            All Categories ({articles.length})
          </button>
          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Status Filters & Create Button */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center bg-white rounded-lg p-1 border border-gray-200 text-sm shadow-sm">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-md font-medium ${
                filterType === 'all' ? 'bg-gray-100 text-gray-900' : 'bg-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('breaking')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center space-x-1 ${
                filterType === 'breaking' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Flame className="w-3 h-3 text-red-500" />
              <span>Breaking</span>
            </button>
            <button
              onClick={() => setFilterType('hero')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center space-x-1 ${
                filterType === 'hero' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Star className="w-3 h-3" />
              <span>Hero</span>
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="bg-brand-crimson hover:bg-red-700 text-white shadow-sm  rounded-lg px-4 py-2 text-sm font-medium transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Story</span>
          </button>
        </div>

      </div>

      {/* Articles Data Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-t border-gray-200 border-b bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Story & Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Status & Flags</th>
                <th className="py-3.5 px-4 text-right">Read Count</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No articles found matching the current criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((art) => (
                  <tr key={art.id} className="hover:bg-gray-50 transition-colors group">
                    
                    {/* Title & Image */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3 max-w-md">
                        <img
                          src={art.featured_image}
                          alt={art.title}
                          className="w-12 h-9 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-1">
                            {art.title}
                          </h4>
                          <span className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                            {art.excerpt || 'No summary excerpt provided.'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-50 text-gray-700 border-gray-200">
                        {art.category.name}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-gray-700">
                      <span className="flex items-center space-x-1 text-xs">
                        <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0" />
                        <span>{art.location_tag || 'Lira City'}</span>
                      </span>
                    </td>

                    {/* Flags */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        {art.is_breaking && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-red-50 text-red-700 border-red-100">
                            BREAKING
                          </span>
                        )}
                        {art.is_hero && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-amber-50 text-amber-700 border-amber-100">
                            HERO
                          </span>
                        )}
                        {!art.is_breaking && !art.is_hero && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-50 text-gray-600 border-gray-200">
                            Standard
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Read Count */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right font-mono text-gray-600">
                      {art.view_count?.toLocaleString() || 0}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/news/${art.category.slug}/${art.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
                          title="View on Public Website"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(art)}
                          className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
                          title="Edit Article"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteArticle(art.id)}
                          className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-red-50 text-red-600 transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Article Creator / Editor Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4">
          <div className="bg-white border border-gray-200 rounded-xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50/50 rounded-t-xl shrink-0">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-brand-crimson" />
                <span>{editingArticle ? 'Edit Newsroom Article' : 'Publish New Story'}</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6">
              <form id="article-form" onSubmit={handleSubmit} className="space-y-6 text-sm">
                
                {/* Title */}
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <label className="block text-gray-700 font-bold">Headline / Story Title *</label>
                    <span className={`text-xs ${formTitle.length > 100 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                      {formTitle.length} / 100
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Lira City Unveils New Commercial Agro-Processing Facility"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson text-base font-semibold shadow-sm"
                    required
                  />
                </div>

                {/* Category & Location Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Editorial Desk / Category</label>
                    <select
                      value={formCategorySlug}
                      onChange={(e) => setFormCategorySlug(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson shadow-sm"
                    >
                      {mockCategories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">District / Location Tag</label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g. Lira City, Dokolo, Apac"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson shadow-sm"
                    />
                  </div>
                </div>

                {/* Image Picker */}
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Featured Image (Upload or enter URL)</label>
                  <div className="flex gap-4 mb-3">
                    <div className="flex-1 space-y-3">
                      <div className="flex space-x-2">
                        <input
                          type="url"
                          value={formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          placeholder="https://..."
                          className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson shadow-sm"
                        />
                        <label className="shrink-0 flex items-center space-x-2 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer shadow-sm transition-colors">
                          {isUploadingCover ? (
                            <span className="animate-pulse">Uploading...</span>
                          ) : (
                            <>
                              <UploadCloud className="w-4 h-4" />
                              <span>Upload</span>
                            </>
                          )}
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, true)}
                            disabled={isUploadingCover}
                          />
                        </label>
                      </div>
                      </div>
                    {/* Live Preview Thumbnail */}
                    <div className="w-32 h-24 shrink-0 rounded-lg border border-gray-200 bg-gray-100 overflow-hidden relative shadow-inner">
                      {formImage ? (
                        <img src={formImage} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 font-medium">No Image</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <label className="block text-gray-700 font-bold">Summary / Lead Excerpt</label>
                    <span className={`text-xs ${formExcerpt.length > 160 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                      {formExcerpt.length} / 160
                    </span>
                  </div>
                  <textarea
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                    rows={2}
                    placeholder="Short introductory lead that appears on cards and social share previews..."
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson shadow-sm"
                  />
                </div>

                {/* Content Body */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-gray-700 font-bold">Article Body (Markdown Supported)</label>
                    
                    <label className="flex items-center space-x-1.5 px-3 py-1.5 bg-brand-crimson/10 text-brand-crimson hover:bg-brand-crimson/20 rounded-lg cursor-pointer transition-colors border border-brand-crimson/20">
                      {isUploadingMedia ? (
                        <span className="text-xs font-bold animate-pulse">Uploading...</span>
                      ) : (
                        <>
                          <Video className="w-3.5 h-3.5" />
                          <FileAudio className="w-3.5 h-3.5" />
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold pl-1">Insert Media (Auto-Embed)</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*,audio/*,video/*" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, false)}
                        disabled={isUploadingMedia}
                      />
                    </label>
                  </div>
                  <textarea
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    rows={12}
                    placeholder="Write complete news report details, quotes, and background information..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 focus:border-brand-crimson font-sans text-sm shadow-sm leading-relaxed whitespace-pre-wrap"
                  />
                </div>

                {/* Flags Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="flex items-start space-x-3 cursor-pointer p-2 hover:bg-white rounded-lg transition border border-transparent hover:border-gray-200 hover:shadow-sm">
                    <input
                      type="checkbox"
                      checked={formIsBreaking}
                      onChange={(e) => setFormIsBreaking(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-brand-crimson focus:ring-brand-crimson border-gray-300"
                    />
                    <div>
                      <span className="font-bold text-gray-900 block">Breaking News Ticker</span>
                      <span className="text-xs text-gray-500 mt-0.5 block leading-tight">Pushes red banner across the entire public portal</span>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer p-2 hover:bg-white rounded-lg transition border border-transparent hover:border-gray-200 hover:shadow-sm">
                    <input
                      type="checkbox"
                      checked={formIsHero}
                      onChange={(e) => setFormIsHero(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-brand-crimson focus:ring-brand-crimson border-gray-300"
                    />
                    <div>
                      <span className="font-bold text-gray-900 block">Homepage Hero Story</span>
                      <span className="text-xs text-gray-500 mt-0.5 block leading-tight">Featured centrally in the top headline slot</span>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer p-2 hover:bg-white rounded-lg transition border border-transparent hover:border-gray-200 hover:shadow-sm">
                    <input
                      type="checkbox"
                      checked={formIsVideoStory}
                      onChange={(e) => setFormIsVideoStory(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-brand-crimson focus:ring-brand-crimson border-gray-300"
                    />
                    <div>
                      <span className="font-bold text-gray-900 block">📹 Video Story</span>
                      <span className="text-xs text-gray-500 mt-0.5 block leading-tight">Shows on the Videos Hub page — add a video_url or embed in the body</span>
                    </div>
                  </label>
                </div>

              </form>
            </div>

            {/* Modal Footer (Fixed) */}
            <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl shrink-0">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg px-5 py-2.5 text-sm font-bold transition-all shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="article-form"
                disabled={isSubmitting}
                className="bg-brand-crimson hover:bg-red-700 text-white shadow-md rounded-lg px-6 py-2.5 text-sm font-bold transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{editingArticle ? 'Update Article' : 'Publish Story'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

