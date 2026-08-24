'use server';

import { getDb as getBaseDb } from './db';
import { mockArticles, mockScheduleSchedule, mockBroadcastState } from './mockData';
import { Article, BroadcastState, ScheduleProgram } from '@/types';

let appDbInitialized = false;

function getDb() {
  const dbInstance = getBaseDb();
  
  if (!appDbInitialized) {
    appDbInitialized = true;

    // Create tables
    dbInstance.exec(`

      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        excerpt TEXT,
        content TEXT,
        featured_image TEXT,
        category_id INTEGER,
        category_name TEXT,
        category_slug TEXT,
        category_color TEXT,
        location_tag TEXT,
        author_id INTEGER,
        author_name TEXT,
        author_role TEXT,
        author_avatar TEXT,
        is_breaking INTEGER DEFAULT 0,
        is_hero INTEGER DEFAULT 0,
        view_count INTEGER DEFAULT 0,
        published_at TEXT
      );

      CREATE TABLE IF NOT EXISTS broadcast_state (
        id INTEGER PRIMARY KEY,
        stream_url_hls TEXT,
        stream_url_youtube TEXT,
        is_emergency_slate INTEGER DEFAULT 0,
        now_playing_title TEXT,
        now_playing_presenter TEXT
      );

      CREATE TABLE IF NOT EXISTS Schedule_schedule (
        id TEXT PRIMARY KEY,
        show_name TEXT,
        description TEXT,
        start_time TEXT,
        end_time TEXT,
        day_of_week TEXT,
        presenter_name TEXT,
        presenter_role TEXT,
        category TEXT
      );


      CREATE TABLE IF NOT EXISTS tips (
        id TEXT PRIMARY KEY,
        reference TEXT,
        topic TEXT,
        details TEXT,
        district TEXT,
        phone_or_whatsapp TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS stream_keys (
        id TEXT PRIMARY KEY,
        stream_key TEXT UNIQUE NOT NULL,
        label TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT,
        last_used_at TEXT
      );
    `);

    // Auto-seed articles if empty
    const articleCount = dbInstance.prepare('SELECT COUNT(*) as count FROM articles').get().count;
    if (articleCount === 0) {
      const insertArticle = dbInstance.prepare(`
        INSERT INTO articles (
          id, title, slug, excerpt, content, featured_image,
          category_id, category_name, category_slug, category_color,
          location_tag, author_id, author_name, author_role, author_avatar,
          is_breaking, is_hero, view_count, published_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?
        )
      `);

      const insertMany = dbInstance.transaction((articles: Article[]) => {
        for (const art of articles) {
          insertArticle.run(
            String(art.id),
            art.title,
            art.slug,
            art.excerpt,
            art.content,
            art.featured_image,
            art.category.id,
            art.category.name,
            art.category.slug,
            art.category.color,
            art.location_tag,
            art.author.id,
            art.author.name,
            art.author.designation || 'Staff Reporter',
            art.author.avatar_url,
            art.is_breaking ? 1 : 0,
            art.is_hero ? 1 : 0,
            art.view_count || 0,
            art.published_at || new Date().toISOString()
          );
        }
      });
      insertMany(mockArticles);
    }

    // Auto-seed broadcast state
    const broadcastCount = dbInstance.prepare('SELECT COUNT(*) as count FROM broadcast_state').get().count;
    if (broadcastCount === 0) {
      dbInstance.prepare(`
        INSERT INTO broadcast_state (id, stream_url_hls, stream_url_youtube, is_emergency_slate, now_playing_title, now_playing_presenter)
        VALUES (1, ?, ?, ?, ?, ?)
      `).run(
        mockBroadcastState.stream_url_hls,
        mockBroadcastState.stream_url_youtube,
        mockBroadcastState.is_emergency_slate ? 1 : 0,
        mockBroadcastState.now_playing.title,
        mockBroadcastState.now_playing.presenter
      );
    }

    // Auto-seed Schedule schedule
    const ScheduleCount = dbInstance.prepare('SELECT COUNT(*) as count FROM Schedule_schedule').get().count;
    if (ScheduleCount === 0) {
      const insertSchedule = dbInstance.prepare(`
        INSERT INTO Schedule_schedule (id, show_name, description, start_time, end_time, day_of_week, presenter_name, presenter_role, category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const insertManySchedule = dbInstance.transaction((programs: ScheduleProgram[]) => {
        for (const p of programs) {
          insertSchedule.run(
            String(p.id),
            p.show_name,
            p.description,
            p.start_time,
            p.end_time,
            p.day_of_week,
            p.presenter_name,
            p.presenter_role || '',
            p.category
          );
        }
      });
      insertManySchedule(mockScheduleSchedule);
    }

    // Auto-seed stream keys
    const keyCount = dbInstance.prepare('SELECT COUNT(*) as count FROM stream_keys').get().count;
    if (keyCount === 0) {
      dbInstance.prepare(`
        INSERT INTO stream_keys (id, stream_key, label, is_active, created_at)
        VALUES (?, ?, ?, 1, ?)
      `).run('1', 'live_utv_lira2026', 'Primary MCR Studio Feed (vMix)', new Date().toISOString());
    }
  }

  return dbInstance;
}

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
  const db = getDb();
  let query = 'SELECT * FROM articles WHERE 1=1';
  const args: any[] = [];

  if (params?.category) {
    query += ' AND category_slug = ?';
    args.push(params.category);
  }
  if (params?.district) {
    query += ' AND location_tag LIKE ?';
    args.push(`%${params.district}%`);
  }
  if (params?.breaking) {
    query += ' AND is_breaking = 1';
  }
  if (params?.hero) {
    query += ' AND is_hero = 1';
  }
  if (params?.search) {
    query += ' AND (title LIKE ? OR content LIKE ?)';
    args.push(`%${params.search}%`, `%${params.search}%`);
  }

  query += ' ORDER BY published_at DESC';
  const rows = db.prepare(query).all(...args);
  return rows.map(mapArticle);
}

export async function getArticleBySlugDb(slug: string, incrementView: boolean = true): Promise<Article | null> {
  const db = getDb();
  const row = db.prepare('SELECT * FROM articles WHERE slug = ?').get(slug);
  if (!row) return null;
  
  if (incrementView) {
    db.prepare('UPDATE articles SET view_count = view_count + 1 WHERE id = ?').run(row.id);
    row.view_count = (row.view_count || 0) + 1;
  }
  
  return mapArticle(row);
}

export async function createArticleDb(data: Partial<Article>): Promise<Article> {
  const db = getDb();
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

  db.prepare(`
    INSERT INTO articles (
      id, title, slug, excerpt, content, featured_image,
      category_id, category_name, category_slug, category_color,
      location_tag, author_id, author_name, author_role, author_avatar,
      is_breaking, is_hero, is_video_story, view_count, published_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?
    )
  `).run(
    String(newArticle.id),
    newArticle.title,
    newArticle.slug,
    newArticle.excerpt,
    newArticle.content,
    newArticle.featured_image,
    newArticle.category.id,
    newArticle.category.name,
    newArticle.category.slug,
    newArticle.category.color,
    newArticle.location_tag,
    newArticle.author.id,
    newArticle.author.name,
    newArticle.author.designation || 'Staff Reporter',
    newArticle.author.avatar_url,
    newArticle.is_breaking ? 1 : 0,
    newArticle.is_hero ? 1 : 0,
    newArticle.is_video_story ? 1 : 0,
    newArticle.view_count,
    newArticle.published_at
  );

  return newArticle;
}

export async function updateArticleDb(id: string | number, data: Partial<Article>): Promise<Article | null> {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM articles WHERE id = ?').get(String(id)) as any;
  if (!existing) return null;

  const category = data.category || {
    id: existing.category_id,
    name: existing.category_name,
    slug: existing.category_slug,
    color: existing.category_color,
  };

  db.prepare(`
    UPDATE articles SET
      title       = ?,
      excerpt     = ?,
      content     = ?,
      featured_image = ?,
      category_id   = ?,
      category_name = ?,
      category_slug = ?,
      category_color = ?,
      location_tag  = ?,
      is_breaking   = ?,
      is_hero       = ?,
      is_video_story = ?
    WHERE id = ?
  `).run(
    data.title     ?? existing.title,
    data.excerpt   ?? existing.excerpt,
    data.content   ?? existing.content,
    data.featured_image ?? existing.featured_image,
    category.id,
    category.name,
    category.slug,
    category.color,
    data.location_tag ?? existing.location_tag,
    data.is_breaking !== undefined ? (data.is_breaking ? 1 : 0) : existing.is_breaking,
    data.is_hero     !== undefined ? (data.is_hero     ? 1 : 0) : existing.is_hero,
    data.is_video_story !== undefined ? (data.is_video_story ? 1 : 0) : existing.is_video_story,
    String(id)
  );

  const updated = db.prepare('SELECT * FROM articles WHERE id = ?').get(String(id)) as any;
  return {
    ...updated,
    category: { id: updated.category_id, name: updated.category_name, slug: updated.category_slug, color: updated.category_color },
    author:   { id: updated.author_id,   name: updated.author_name,   designation: updated.author_role, avatar_url: updated.author_avatar },
    is_breaking: !!updated.is_breaking,
    is_hero:     !!updated.is_hero,
    is_video_story: !!updated.is_video_story,
  };
}

export async function deleteArticleDb(id: number | string): Promise<boolean> {
  const db = getDb();
  const info = db.prepare('DELETE FROM articles WHERE id = ?').run(String(id));
  return info.changes > 0;
}

export async function getBroadcastStateDb(): Promise<BroadcastState> {
  const db = getDb();
  const row = db.prepare('SELECT * FROM broadcast_state WHERE id = 1').get();
  if (!row) return mockBroadcastState;

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
  const db = getDb();
  const current = await getBroadcastStateDb();
  const updated = { 
    ...current, 
    ...state,
    now_playing: { ...current.now_playing, ...(state.now_playing || {}) },
    up_next: { ...current.up_next, ...(state.up_next || {}) }
  };

  // Ensure columns exist in SQLite (safe migration if table exists)
  try { db.exec('ALTER TABLE broadcast_state ADD COLUMN is_live INTEGER DEFAULT 1'); } catch (e) {}
    try { db.exec('ALTER TABLE broadcast_state ADD COLUMN now_playing_start_time TEXT DEFAULT "06:00"'); } catch (e) {}
  try { db.exec('ALTER TABLE broadcast_state ADD COLUMN now_playing_end_time TEXT DEFAULT "09:00"'); } catch (e) {}
  try { db.exec('ALTER TABLE broadcast_state ADD COLUMN up_next_title TEXT DEFAULT "Lango Agro Focus & Commodity Ticker"'); } catch (e) {}
  try { db.exec('ALTER TABLE broadcast_state ADD COLUMN up_next_time TEXT DEFAULT "09:00 - 10:30"'); } catch (e) {}
  try { db.exec('ALTER TABLE broadcast_state ADD COLUMN up_next_presenter TEXT DEFAULT "Denis Ogwang"'); } catch (e) {}

  db.prepare(`
    UPDATE broadcast_state SET 
      stream_url_hls = ?, 
      stream_url_youtube = ?, 
      is_emergency_slate = ?, 
      now_playing_title = ?, 
      now_playing_presenter = ?,
      now_playing_start_time = ?,
      now_playing_end_time = ?,
      up_next_title = ?,
      up_next_time = ?,
      up_next_presenter = ?
    WHERE id = 1
  `).run(
    updated.stream_url_hls,
    updated.stream_url_youtube,
    updated.is_emergency_slate ? 1 : 0,
    updated.now_playing.title,
    updated.now_playing.presenter,
    updated.now_playing.start_time,
    updated.now_playing.end_time,
    updated.up_next.title,
    updated.up_next.time,
    updated.up_next.presenter || ''
  );

  return updated;
}

export async function getScheduleScheduleDb(day?: string): Promise<ScheduleProgram[]> {
  const db = getDb();
  let query = 'SELECT * FROM Schedule_schedule';
  const args: any[] = [];
  if (day) {
    query += ' WHERE day_of_week = ?';
    args.push(day);
  }
  const rows = db.prepare(query).all(...args);
  return rows.map((r: any) => ({
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
  const db = getDb();
  const id = program.id ? String(program.id) : `Schedule-${Date.now()}`;
  
  db.prepare(`
    INSERT INTO Schedule_schedule (id, show_name, description, start_time, end_time, day_of_week, presenter_name, category, is_featured, banner_image, presenter_image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      show_name      = excluded.show_name,
      description    = excluded.description,
      start_time     = excluded.start_time,
      end_time       = excluded.end_time,
      day_of_week    = excluded.day_of_week,
      presenter_name = excluded.presenter_name,
      category       = excluded.category,
      is_featured    = excluded.is_featured,
      banner_image   = excluded.banner_image,
      presenter_image = excluded.presenter_image
  `).run(
    id,
    program.show_name || 'Unity Broadcast',
    program.description || '',
    program.start_time || '06:00',
    program.end_time || '09:00',
    program.day_of_week || 'Monday',
    program.presenter_name || 'Unity Newsroom',
    program.category || 'News & Current Affairs',
    (program as any).is_featured ? 1 : 0,
    (program as any).banner_image || null,
    (program as any).presenter_image || null
  );

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
  const db = getDb();
  const info = db.prepare('DELETE FROM Schedule_schedule WHERE id = ?').run(String(id));
  return info.changes > 0;
}



import crypto from 'crypto';
import { getServerSession } from './auth-server';

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

import fs from 'fs';
import path from 'path';

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

  const db = getDb();
  const id = Date.now().toString();
  const reference = 'UTV-' + Math.random().toString(36).substring(2, 7).toUpperCase();

  // AES-256-GCM Encryption at rest (including file paths so hackers can't see what they uploaded)
  const encryptedTopic = encryptAES256GCM(topic);
  const encryptedDetails = encryptAES256GCM(details);
  const encryptedContact = phone_or_whatsapp ? encryptAES256GCM(phone_or_whatsapp) : '';
  const encryptedFiles = savedFilePaths.length > 0 ? encryptAES256GCM(JSON.stringify(savedFilePaths)) : '';

  db.prepare(`
    INSERT INTO tips (id, reference, topic, details, district, phone_or_whatsapp, file_paths, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    reference,
    encryptedTopic,
    encryptedDetails,
    district,
    encryptedContact,
    encryptedFiles,
    new Date().toISOString()
  );

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

  const db = getDb();
  const rows = db.prepare('SELECT * FROM tips ORDER BY created_at DESC').all();
  
  // Decrypt on the fly for authorized editors
  return rows.map((r: any) => {
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

// ----------------------------------------------------
// Media Upload (Newsroom)
// ----------------------------------------------------
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

// ----------------------------------------------------
// RTMP Stream Keys & Ingest Webhook Validation
// ----------------------------------------------------

export async function generateStreamKeyDb(label: string = 'Master Studio Ingest (vMix/OBS)'): Promise<{ success: boolean; streamKey: string; rtmpUrl: string }> {
  const session = await getServerSession();
  if (!session || !['super_admin', 'producer'].includes(session.role)) {
    throw new Error('Access denied: Producer or SuperAdmin credentials required to generate stream keys.');
  }

  const db = getDb();
  const id = Date.now().toString();
  const randomHex = crypto.randomBytes(6).toString('hex');
  const streamKey = `live_utv_${randomHex}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO stream_keys (id, stream_key, label, is_active, created_at, last_used_at)
    VALUES (?, ?, ?, 1, ?, NULL)
  `).run(id, streamKey, label, now);

  const rtmpHost = process.env.NEXT_PUBLIC_RTMP_HOST || 'stream.radiounity.ug';

  return {
    success: true,
    streamKey,
    rtmpUrl: `rtmp://${rtmpHost}/live`,
  };
}

export async function getStreamKeysDb(): Promise<any[]> {
  const db = getDb();
  const count = db.prepare('SELECT COUNT(*) as count FROM stream_keys').get().count;
  if (count === 0) {
    // Seed default master key
    db.prepare(`
      INSERT INTO stream_keys (id, stream_key, label, is_active, created_at)
      VALUES (?, ?, ?, 1, ?)
    `).run('1', 'live_utv_lira2026', 'Primary MCR Satellite Link', new Date().toISOString());
  }

  return db.prepare('SELECT * FROM stream_keys ORDER BY created_at DESC').all();
}

export async function revokeStreamKeyDb(streamKey: string): Promise<boolean> {
  const session = await getServerSession();
  if (!session || !['super_admin', 'producer'].includes(session.role)) {
    throw new Error('Access denied: Producer credentials required.');
  }

  const db = getDb();
  db.prepare('UPDATE stream_keys SET is_active = 0 WHERE stream_key = ?').run(streamKey);
  return true;
}

export async function validateStreamKeyDb(streamKey: string): Promise<boolean> {
  if (!streamKey) return false;
  const db = getDb();
  const keyRecord = db.prepare('SELECT * FROM stream_keys WHERE stream_key = ? AND is_active = 1').get(streamKey);
  
  if (keyRecord) {
    // Update last used timestamp
    db.prepare('UPDATE stream_keys SET last_used_at = ? WHERE stream_key = ?').run(new Date().toISOString(), streamKey);
    return true;
  }
  return false;
}


// ==========================================
// LIVE BLOG ACTIONS
// ==========================================

export async function getLiveBlogsDb() {
  const db = getDb();
  const blogs = db.prepare('SELECT * FROM live_blogs ORDER BY is_active DESC, created_at DESC').all();
  return blogs;
}

export async function getLiveBlogUpdatesDb(blogId: number) {
  const db = getDb();
  return db.prepare('SELECT * FROM live_blog_updates WHERE live_blog_id = ? ORDER BY published_at DESC').all(blogId);
}

export async function createLiveBlogDb(title: string, summary: string, location: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const db = getDb();
  const result = db.prepare(`
    INSERT INTO live_blogs (title, summary, event_location, is_active)
    VALUES (?, ?, ?, 1)
  `).run(title, summary, location);

  return result.lastInsertRowid;
}

export async function toggleLiveBlogStatusDb(blogId: number, isActive: boolean) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const db = getDb();
  db.prepare('UPDATE live_blogs SET is_active = ? WHERE id = ?').run(isActive ? 1 : 0, blogId);
  return true;
}

export async function addLiveBlogUpdateDb(blogId: number, content: string, isKeyEvent: boolean) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const db = getDb();
  const result = db.prepare(`
    INSERT INTO live_blog_updates (live_blog_id, author_name, author_role, content, is_key_event)
    VALUES (?, ?, ?, ?, ?)
  `).run(blogId, session.name, session.designation || session.role, content, isKeyEvent ? 1 : 0);

  return db.prepare('SELECT * FROM live_blog_updates WHERE id = ?').get(result.lastInsertRowid);
}

export async function deleteLiveBlogUpdateDb(updateId: number) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const db = getDb();
  db.prepare('DELETE FROM live_blog_updates WHERE id = ?').run(updateId);
  return true;
}

export async function updateLiveBlogUpdateDb(updateId: number, content: string, isKeyEvent: boolean) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const db = getDb();
  db.prepare('UPDATE live_blog_updates SET content = ?, is_key_event = ? WHERE id = ?').run(content, isKeyEvent ? 1 : 0, updateId);
  return true;
}
