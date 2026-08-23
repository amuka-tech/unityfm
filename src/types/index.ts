export type UserRole = 
  | 'managing_director' 
  | 'super_admin' 
  | 'broadcast_director' 
  | 'news_editor' 
  | 'field_reporter';

export type Role = UserRole;

export type Permission = 
  | 'manage_users'
  | 'manage_settings'
  | 'manage_ads'
  | 'decrypt_tips'
  | 'publish_articles'
  | 'create_drafts'
  | 'manage_streams'
  | 'manage_epg'
  | 'manage_breaking_news';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  managing_director: ['manage_users', 'manage_settings', 'manage_ads', 'decrypt_tips', 'publish_articles', 'create_drafts', 'manage_breaking_news'],
  super_admin: ['manage_users', 'manage_settings', 'manage_ads', 'decrypt_tips', 'publish_articles', 'create_drafts', 'manage_streams', 'manage_epg', 'manage_breaking_news'],
  broadcast_director: ['manage_streams', 'manage_epg', 'manage_breaking_news', 'create_drafts'],
  news_editor: ['decrypt_tips', 'publish_articles', 'create_drafts', 'manage_breaking_news'],
  field_reporter: ['create_drafts'],
};

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  bureau: string;
  designation: string;
  avatar_url: string;
  bio?: string;
  canImpersonate?: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
  description?: string;
  subcategories?: { name: string; slug: string }[];
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  sub_headline?: string;
  excerpt: string;
  content: string;
  featured_image: string;
  image_caption?: string;
  image_credit?: string;
  location_tag: string;
  category: {
    id: number;
    name: string;
    slug: string;
    color: string;
  };
  subcategory?: {
    id: number;
    name: string;
    slug: string;
  };
  author: {
    id: number;
    name: string;
    bureau: string;
    designation: string;
    avatar_url: string;
  };
  status: 'draft' | 'published' | 'archived';
  is_breaking: boolean;
  is_hero: boolean;
  is_featured_regional: boolean;
  is_video_story: boolean;
  video_url?: string;
  video_duration?: string;
  reading_time_minutes: number;
  view_count: number;
  tags?: string[];
  key_takeaways?: string[];
  published_at: string;
  updated_at?: string;
}

export interface BroadcastState {
  channel_name: string;
  stream_url_hls: string;
  stream_url_youtube: string;
  is_live: boolean;
  is_emergency_slate: boolean;
  emergency_slate_message?: string;
  now_playing: {
    title: string;
    description: string;
    presenter: string;
    presenter_image?: string;
    start_time: string;
    end_time: string;
    progress_percentage?: number;
  };
  up_next: {
    title: string;
    time: string;
    presenter?: string;
  };
}

export interface EpgProgram {
  id: number;
  show_name: string;
  presenter_name: string;
  presenter_role?: string;
  presenter_image?: string;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time: string;
  end_time: string;
  category: string;
  description: string;
  banner_image?: string;
  is_featured?: boolean;
  is_live_broadcast?: boolean;
}

export interface LiveBlogUpdateItem {
  id: number;
  live_blog_id: number;
  author: {
    id: number;
    name: string;
    designation: string;
    avatar_url: string;
  };
  title?: string;
  content: string;
  media_url?: string;
  media_type?: 'image' | 'video' | 'quote' | 'tweet';
  is_pinned: boolean;
  is_key_event: boolean;
  published_at: string;
}

export interface LiveBlogData {
  id: number;
  title: string;
  slug: string;
  summary: string;
  featured_image?: string;
  event_location: string;
  is_active: boolean;
  started_at: string;
  updates: LiveBlogUpdateItem[];
}


export interface WeatherData {
  city: string;
  region: string;
  temperature_celsius: number;
  condition: string;
  humidity: string;
  wind_speed: string;
  forecast_icon: string;
}

export interface CurrencyRate {
  pair: string;
  rate: string;
  change: string;
  trend: 'up' | 'down';
}

export interface WhistleblowerSubmission {
  source_name?: string;
  phone_or_whatsapp?: string;
  email?: string;
  district: string;
  topic: string;
  details: string;
  urgency?: 'low' | 'medium' | 'high' | 'breaking';
}
