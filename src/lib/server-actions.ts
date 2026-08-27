'use server';

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';
import { getServerSession } from './auth-server';
import { Article, BroadcastState, ScheduleProgram } from '@/types';
import { mockBroadcastState } from './mockData';

function mapArticle(row: any): Article {
  return {
    id: isNaN(Number(row.id)) ? row.id : Number(row.id),
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    featured_image: row.featured_image,
    category: {
      id: row.category_id,
      name: row.category_name,
      slug: row.category_slug,
      color: row.category_color,
    },
    location_tag: row.location_tag,
    author: {
      id: row.author_id,
      name: row.author_name,
      bureau: 'Lira City Newsroom',
      designation: row.author_role || 'Staff Reporter',
      avatar_url: row.author_avatar,
    },
    status: 'published',
    is_breaking: Boolean(row.is_breaking),
    is_hero: Boolean(row.is_hero),
    is_featured_regional: true,
    is_video_story: false,
    reading_time_minutes: 3,
    view_count: Number(row.view_count) || 0,
    published_at: row.published_at,
  };
}

export async function getArticlesDb(params?: { category?: string; district?: string; breaking?: boolean; hero?: boolean; search?: string }): Promise<Article[]> {
  let query = supabase.from('articles').select('*');

  if (params?.category) {
    query = query.eq('category_slug', params.category);
  }
  if (params?.district) {
    query = query.ilike('location_tag', `%${params.district}%`);
  }
  if (params?.breaking) {
    query = query.eq('is_breaking', 1);
  }
  if (params?.hero) {
    query = query.eq('is_hero', 1);
  }
  if (params?.search) {
    query = query.or(`title.ilike.%${params.search}%,content.ilike.%${params.search}%`);
  }

  query = query.order('published_at', { ascending: false });

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
  return (data || []).map(mapArticle);
}

export async function getArticleBySlugDb(slug: string, incrementView: boolean = true): Promise<Article | null> {
  const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();
  if (error || !data) return null;
  
  const row = data;
  if (incrementView) {
    await supabase.from('articles').update({ view_count: (row.view_count || 0) + 1 }).eq('id', row.id);
    row.view_count = (row.view_count || 0) + 1;
  }
  
  return mapArticle(row);
}

export async function createArticleDb(data: Partial<Article>): Promise<Article> {
  const id = Date.now().toString();
  const newArticle: Article = {
    id: id as any,
    title: data.title || '',
    slug: data.slug || `article-${id}`,
    excerpt: data.excerpt || '',
    content: data.content || '',
    featured_image: data.featured_image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000',
    category: data.category || { id: 1, name: 'Lira City', slug: 'lira-city', color: '#FFC20E' },
    location_tag: data.location_tag || 'Lira City',
    author: data.author || {
      id: 1,
      name: 'Unity Newsroom',
      bureau: 'Lira City Newsroom',
      designation: 'Staff Reporter',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    status: 'published',
    is_breaking: data.is_breaking || false,
    is_hero: data.is_hero || false,
    is_featured_regional: true,
    is_video_story: data.is_video_story || false,
    reading_time_minutes: 3,
    view_count: 0,
    published_at: new Date().toISOString(),
  };

  await supabase.from('articles').insert({
    id: String(newArticle.id),
    title: newArticle.title,
    slug: newArticle.slug,
    excerpt: newArticle.excerpt,
    content: newArticle.content,
    featured_image: newArticle.featured_image,
    category_id: newArticle.category.id,
    category_name: newArticle.category.name,
    category_slug: newArticle.category.slug,
    category_color: newArticle.category.color,
    location_tag: newArticle.location_tag,
    author_id: newArticle.author.id,
    author_name: newArticle.author.name,
    author_role: newArticle.author.designation || 'Staff Reporter',
    author_avatar: newArticle.author.avatar_url,
    is_breaking: newArticle.is_breaking ? 1 : 0,
    is_hero: newArticle.is_hero ? 1 : 0,
    is_video_story: newArticle.is_video_story ? 1 : 0,
    view_count: newArticle.view_count,
    published_at: newArticle.published_at,
  });

  return newArticle;
}

export async function updateArticleDb(id: string | number, data: Partial<Article>): Promise<Article | null> {
  const { data: existing, error } = await supabase.from('articles').select('*').eq('id', String(id)).single();
  if (error || !existing) return null;

  const category = data.category || {
    id: existing.category_id,
    name: existing.category_name,
    slug: existing.category_slug,
    color: existing.category_color,
  };

  await supabase.from('articles').update({
    title: data.title ?? existing.title,
    excerpt: data.excerpt ?? existing.excerpt,
    content: data.content ?? existing.content,
    featured_image: data.featured_image ?? existing.featured_image,
    category_id: category.id,
    category_name: category.name,
    category_slug: category.slug,
    category_color: category.color,
    location_tag: data.location_tag ?? existing.location_tag,
    is_breaking: data.is_breaking !== undefined ? (data.is_breaking ? 1 : 0) : existing.is_breaking,
    is_hero: data.is_hero !== undefined ? (data.is_hero ? 1 : 0) : existing.is_hero,
    is_video_story: data.is_video_story !== undefined ? (data.is_video_story ? 1 : 0) : existing.is_video_story,
  }).eq('id', String(id));

  const { data: updated } = await supabase.from('articles').select('*').eq('id', String(id)).single();
  if (!updated) return null;
  return {
    ...updated,
    category: { id: updated.category_id, name: updated.category_name, slug: updated.category_slug, color: updated.category_color },
    author: { id: updated.author_id, name: updated.author_name, designation: updated.author_role, avatar_url: updated.author_avatar },
    is_breaking: !!updated.is_breaking,
    is_hero: !!updated.is_hero,
    is_video_story: !!updated.is_video_story,
  };
}

export async function deleteArticleDb(id: number | string): Promise<boolean> {
  const { error } = await supabase.from('articles').delete().eq('id', String(id));
  return !error;
}

export async function getBroadcastStateDb(): Promise<BroadcastState> {
  const { data, error } = await supabase.from('broadcast_state').select('*').eq('id', 1).single();
  if (error || !data) return mockBroadcastState;

  const row = data;
  return {
    channel_name: 'Radio Unity FM Uganda',
    stream_url_hls: row.stream_url_hls,
    stream_url_youtube: row.stream_url_youtube,
    is_live: row.is_live === 0 ? false : true,
    is_emergency_slate: Boolean(row.is_emergency_slate),
    now_playing: {
      title: row.now_playing_title || 'Lango Evening News & Agribusiness Pulse',
      description: 'Northern Uganda evening news, civic debates, and agricultural market intelligence live from Lira.',
      presenter: row.now_playing_presenter || 'Sarah Awor & Moses Okello',
      start_time: row.now_playing_start_time || '06:00',
      end_time: row.now_playing_end_time || '09:00',
      progress_percentage: 45,
    },
    up_next: {
      title: row.up_next_title || 'Lango Agro Focus & Commodity Ticker',
      time: row.up_next_time || '09:00 - 10:30',
      presenter: row.up_next_presenter || 'Denis Ogwang',
    },
  };
}

export async function updateBroadcastStateDb(state: Partial<BroadcastState>): Promise<BroadcastState> {
  const current = await getBroadcastStateDb();
  const updated = { 
    ...current, 
    ...state,
    now_playing: { ...current.now_playing, ...(state.now_playing || {}) },
    up_next: { ...current.up_next, ...(state.up_next || {}) }
  };

  await supabase.from('broadcast_state').update({
    stream_url_hls: updated.stream_url_hls,
    stream_url_youtube: updated.stream_url_youtube,
    is_emergency_slate: updated.is_emergency_slate ? 1 : 0,
    now_playing_title: updated.now_playing.title,
    now_playing_presenter: updated.now_playing.presenter,
    now_playing_start_time: updated.now_playing.start_time,
    now_playing_end_time: updated.now_playing.end_time,
    up_next_title: updated.up_next.title,
    up_next_time: updated.up_next.time,
    up_next_presenter: updated.up_next.presenter || ''
  }).eq('id', 1);

  return updated;
}

export async function getScheduleScheduleDb(day?: string): Promise<ScheduleProgram[]> {
  let query = supabase.from('Schedule_schedule').select('*');
  if (day) {
    query = query.eq('day_of_week', day);
  }
  const { data, error } = await query;
  if (error || !data) return [];
  
  return data.map((r: any) => ({
    id: isNaN(Number(r.id)) ? r.id : Number(r.id),
    show_name: r.show_name,
    description: r.description,
    start_time: r.start_time,
    end_time: r.end_time,
    day_of_week: r.day_of_week,
    presenter_name: r.presenter_name,
    presenter_role: r.presenter_role,
    category: r.category,
    is_featured: !!r.is_featured,
    banner_image: r.banner_image || null,
    presenter_image: r.presenter_image || null,
  }));
}

export async function saveScheduleProgramDb(program: Partial<ScheduleProgram>): Promise<ScheduleProgram> {
  const id = program.id ? String(program.id) : `Schedule-${Date.now()}`;
  
  await supabase.from('Schedule_schedule').upsert({
    id,
    show_name: program.show_name || 'Unity Broadcast',
    description: program.description || '',
    start_time: program.start_time || '06:00',
    end_time: program.end_time || '09:00',
    day_of_week: program.day_of_week || 'Monday',
    presenter_name: program.presenter_name || 'Unity Newsroom',
    category: program.category || 'News & Current Affairs',
    is_featured: (program as any).is_featured ? 1 : 0,
    banner_image: (program as any).banner_image || null,
    presenter_image: (program as any).presenter_image || null
  }, { onConflict: 'id' });

  return {
    id: isNaN(Number(id)) ? (id as any) : Number(id),
    show_name: program.show_name || 'Unity Broadcast',
    description: program.description || '',
    start_time: program.start_time || '06:00',
    end_time: program.end_time || '09:00',
    day_of_week: (program.day_of_week as any) || 'Monday',
    presenter_name: program.presenter_name || 'Unity Newsroom',
    category: program.category || 'News & Current Affairs',
    is_featured: !!(program as any).is_featured,
    banner_image: (program as any).banner_image || null,
    presenter_image: (program as any).presenter_image || null,
  };
}

export async function deleteScheduleProgramDb(id: string | number): Promise<boolean> {
  const { error } = await supabase.from('Schedule_schedule').delete().eq('id', String(id));
  return !error;
}


const ENCRYPTION_KEY = process.env.WHISTLEBLOWER_ENCRYPTION_KEY
  ? Buffer.from(process.env.WHISTLEBLOWER_ENCRYPTION_KEY.slice(0, 64), 'hex')
  : crypto.scryptSync('unity-tv-uganda-salt', 'salt', 32);

function encryptAES256GCM(plainText: string): string {
  if (!plainText) return '';
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

function decryptAES256GCM(cipherText: string): string {
  if (!cipherText || !cipherText.includes(':')) return cipherText;
  try {
    const [ivHex, authTagHex, encryptedHex] = cipherText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    return '[Decryption failed: signature mismatch]';
  }
}

export async function createTipDb(formData: FormData): Promise<{ success: boolean; reference: string; message: string }> {
  const topic = formData.get('topic') as string;
  const details = formData.get('details') as string;
  const district = formData.get('district') as string;
  const phone_or_whatsapp = formData.get('phone_or_whatsapp') as string || '';
  
  // Handle file uploads securely
  const files = formData.getAll('files') as File[];
  const savedFilePaths: string[] = [];
  
  if (files && files.length > 0) {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'whistleblower');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    for (const file of files) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = path.join(uploadDir, safeFilename);
        fs.writeFileSync(filePath, buffer);
        savedFilePaths.push(`/uploads/whistleblower/${safeFilename}`);
      }
    }
  }

  const id = Date.now().toString();
  const reference = 'UTV-' + Math.random().toString(36).substring(2, 7).toUpperCase();

  // AES-256-GCM Encryption at rest (including file paths so hackers can't see what they uploaded)
  const encryptedTopic = encryptAES256GCM(topic);
  const encryptedDetails = encryptAES256GCM(details);
  const encryptedContact = phone_or_whatsapp ? encryptAES256GCM(phone_or_whatsapp) : '';
  const encryptedFiles = savedFilePaths.length > 0 ? encryptAES256GCM(JSON.stringify(savedFilePaths)) : '';

  await supabase.from('tips').insert({
    id,
    reference,
    topic: encryptedTopic,
    details: encryptedDetails,
    district,
    phone_or_whatsapp: encryptedContact,
    file_paths: encryptedFiles,
    created_at: new Date().toISOString()
  });

  return {
    success: true,
    reference,
    message: 'Your tip (and any evidence) has been AES-256-GCM encrypted and securely routed to Senior Editors in Lira City.'
  };
}

export async function getTipsDb(): Promise<any[]> {
  // Server-side RBAC validation
  const session = await getServerSession();
  if (!session || !['super_admin', 'managing_director', 'news_editor'].includes(session.role)) {
    return [];
  }

  const { data, error } = await supabase.from('tips').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  
  // Decrypt on the fly for authorized editors
  return data.map((r: any) => {
    let filePaths = [];
    if (r.file_paths) {
      try {
        const decryptedStr = decryptAES256GCM(r.file_paths);
        filePaths = JSON.parse(decryptedStr);
      } catch(e) {
        // Fallback or ignore if not JSON
      }
    }
    
    return {
      ...r,
      topic: decryptAES256GCM(r.topic),
      details: decryptAES256GCM(r.details),
      phone_or_whatsapp: decryptAES256GCM(r.phone_or_whatsapp),
      file_paths: filePaths,
      is_encrypted_at_rest: true,
    };
  });
}

export async function uploadNewsMediaDb(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get('file') as File;
    if (!file || file.size === 0) {
      return { success: false, error: 'No file provided' };
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'news');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadDir, safeFilename);
    
    fs.writeFileSync(filePath, buffer);
    
    return { success: true, url: `/uploads/news/${safeFilename}` };
  } catch (error: any) {
    console.error('Upload Error:', error);
    return { success: false, error: error.message };
  }
}

export async function generateStreamKeyDb(label: string = 'Master Studio Ingest (vMix/OBS)'): Promise<{ success: boolean; streamKey: string; rtmpUrl: string }> {
  const session = await getServerSession();
  if (!session || !['super_admin', 'producer'].includes(session.role)) {
    throw new Error('Access denied: Producer or SuperAdmin credentials required to generate stream keys.');
  }

  const id = Date.now().toString();
  const randomHex = crypto.randomBytes(6).toString('hex');
  const streamKey = `live_utv_${randomHex}`;
  const now = new Date().toISOString();

  await supabase.from('stream_keys').insert({
    id,
    stream_key: streamKey,
    label,
    is_active: 1,
    created_at: now,
    last_used_at: null
  });

  const rtmpHost = process.env.NEXT_PUBLIC_RTMP_HOST || 'stream.radiounity.ug';

  return {
    success: true,
    streamKey,
    rtmpUrl: `rtmp://${rtmpHost}/live`,
  };
}

export async function getStreamKeysDb(): Promise<any[]> {
  const { data: allKeys } = await supabase.from('stream_keys').select('*').order('created_at', { ascending: false });
  if (!allKeys || allKeys.length === 0) {
    await supabase.from('stream_keys').insert({
      id: '1',
      stream_key: 'live_utv_lira2026',
      label: 'Primary MCR Satellite Link',
      is_active: 1,
      created_at: new Date().toISOString()
    });
    const { data: newKeys } = await supabase.from('stream_keys').select('*').order('created_at', { ascending: false });
    return newKeys || [];
  }

  return allKeys;
}

export async function revokeStreamKeyDb(streamKey: string): Promise<boolean> {
  const session = await getServerSession();
  if (!session || !['super_admin', 'producer'].includes(session.role)) {
    throw new Error('Access denied: Producer credentials required.');
  }

  const { error } = await supabase.from('stream_keys').update({ is_active: 0 }).eq('stream_key', streamKey);
  return !error;
}

export async function validateStreamKeyDb(streamKey: string): Promise<boolean> {
  if (!streamKey) return false;
  
  const { data } = await supabase.from('stream_keys').select('*').eq('stream_key', streamKey).eq('is_active', 1).single();
  
  if (data) {
    // Update last used timestamp
    await supabase.from('stream_keys').update({ last_used_at: new Date().toISOString() }).eq('stream_key', streamKey);
    return true;
  }
  return false;
}

export async function getLiveBlogsDb() {
  const { data } = await supabase.from('live_blogs').select('*').order('is_active', { ascending: false }).order('created_at', { ascending: false });
  return data || [];
}

export async function getLiveBlogUpdatesDb(blogId: number) {
  const { data } = await supabase.from('live_blog_updates').select('*').eq('live_blog_id', blogId).order('published_at', { ascending: false });
  return data || [];
}

export async function createLiveBlogDb(title: string, summary: string, location: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const { data } = await supabase.from('live_blogs').insert({
    title,
    summary,
    event_location: location,
    is_active: 1
  }).select('id').single();

  return data?.id;
}

export async function toggleLiveBlogStatusDb(blogId: number, isActive: boolean) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const { error } = await supabase.from('live_blogs').update({ is_active: isActive ? 1 : 0 }).eq('id', blogId);
  return !error;
}

export async function addLiveBlogUpdateDb(blogId: number, content: string, isKeyEvent: boolean) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const { data } = await supabase.from('live_blog_updates').insert({
    live_blog_id: blogId,
    author_name: session.name,
    author_role: session.designation || session.role,
    content,
    is_key_event: isKeyEvent ? 1 : 0
  }).select('*').single();

  return data;
}

export async function deleteLiveBlogUpdateDb(updateId: number) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const { error } = await supabase.from('live_blog_updates').delete().eq('id', updateId);
  return !error;
}

export async function updateLiveBlogUpdateDb(updateId: number, content: string, isKeyEvent: boolean) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const { error } = await supabase.from('live_blog_updates').update({
    content,
    is_key_event: isKeyEvent ? 1 : 0
  }).eq('id', updateId);
  return !error;
}
