import { Article, Category, BroadcastState, EpgProgram, LiveBlogData, LiveBlogUpdateItem, WeatherData, CurrencyRate, WhistleblowerSubmission } from '@/types';
import { mockCategories, mockLiveBlog, mockWeatherData, mockCurrencyRates } from './mockData';
import {
  getArticlesDb,
  getArticleBySlugDb,
  createArticleDb,
  deleteArticleDb,
  getBroadcastStateDb,
  updateBroadcastStateDb,
  getEpgScheduleDb,
  saveEpgProgramDb,
  deleteEpgProgramDb,
  createTipDb,
  getTipsDb,
  generateStreamKeyDb,
  getStreamKeysDb,
  revokeStreamKeyDb,
} from './server-actions';

let dynamicLiveBlog: LiveBlogData = { ...mockLiveBlog };

export const api = {
  // Articles
  async getArticles(params?: { category?: string; district?: string; breaking?: boolean; hero?: boolean; search?: string; dataSaver?: boolean }): Promise<Article[]> {
    try {
      return await getArticlesDb(params);
    } catch (err) {
      console.error('Error fetching articles from SQLite:', err);
      return [];
    }
  },

  async getArticleBySlug(slug: string, incrementView: boolean = true): Promise<{ article: Article | null; related: Article[] }> {
    try {
      const article = await getArticleBySlugDb(slug, incrementView);
      let related: Article[] = [];
      if (article) {
        const allInCat = await getArticlesDb({ category: article.category.slug });
        related = allInCat.filter(a => a.slug !== slug).slice(0, 4);
      }
      return { article, related };
    } catch (err) {
      console.error('Error fetching article by slug from SQLite:', err);
      return { article: null, related: [] };
    }
  },

  async createArticle(newArticle: Partial<Article>): Promise<Article> {
    return await createArticleDb(newArticle);
  },

  async deleteArticle(id: number | string): Promise<boolean> {
    return await deleteArticleDb(id);
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    return mockCategories;
  },

  // Breaking News Ticker
  async getBreakingNews(): Promise<Article[]> {
    try {
      const all = await getArticlesDb({ breaking: true });
      return all.slice(0, 5);
    } catch (err) {
      return [];
    }
  },

  // Broadcast & Live Stream
  async getBroadcastState(): Promise<BroadcastState> {
    try {
      return await getBroadcastStateDb();
    } catch (err) {
      return {
        channel_name: 'Unity TV Uganda',
        stream_url_hls: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        stream_url_youtube: 'https://www.youtube.com/embed/jfKfPfyJRdk',
        is_live: true,
        is_emergency_slate: false,
        now_playing: {
          title: 'Unity Morning Show',
          description: 'Northern Uganda morning news, civic debates, and agricultural market intelligence live from Lira.',
          presenter: 'Sarah Awor',
          start_time: '06:00',
          end_time: '09:00',
          progress_percentage: 45,
        },
        up_next: {
          title: 'Lango Agro Focus & Commodity Ticker',
          time: '09:00 - 10:30',
          presenter: 'Denis Ogwang',
        },
      };
    }
  },

  async updateBroadcastState(updates: Partial<BroadcastState>): Promise<BroadcastState> {
    return await updateBroadcastStateDb(updates);
  },

  // EPG Schedules
  async getEpgSchedule(day?: string): Promise<EpgProgram[]> {
    try {
      return await getEpgScheduleDb(day);
    } catch (err) {
      return [];
    }
  },

  async saveEpgProgram(program: Partial<EpgProgram>): Promise<EpgProgram> {
    return await saveEpgProgramDb(program);
  },

  async deleteEpgProgram(id: string | number): Promise<boolean> {
    return await deleteEpgProgramDb(id);
  },

  async addEpgProgram(program: Omit<EpgProgram, 'id'>): Promise<EpgProgram> {
    return await saveEpgProgramDb(program);
  },

  // Live Blog
  async getLiveBlog(slug: string): Promise<LiveBlogData> {
    return dynamicLiveBlog;
  },

  async updateLiveBlogState(isActive: boolean): Promise<void> {
    dynamicLiveBlog.is_active = isActive;
  },

  async addLiveBlogUpdate(update: Omit<LiveBlogUpdateItem, 'id' | 'published_at'>): Promise<LiveBlogUpdateItem> {
    const newUpdate: LiveBlogUpdateItem = {
      ...update,
      id: Date.now(),
      published_at: new Date().toISOString(),
    };
    dynamicLiveBlog.updates = [newUpdate, ...dynamicLiveBlog.updates];
    return newUpdate;
  },


  // Whistleblower
  async submitTip(tip: WhistleblowerSubmission): Promise<{ success: boolean; reference: string; message: string }> {
    return await createTipDb(tip);
  },

  async getTips(): Promise<any[]> {
    try {
      return await getTipsDb();
    } catch (err) {
      return [];
    }
  },

  // RTMP Ingest & Stream Keys
  async generateStreamKey(label?: string): Promise<{ success: boolean; streamKey: string; rtmpUrl: string }> {
    return await generateStreamKeyDb(label);
  },

  async getStreamKeys(): Promise<any[]> {
    try {
      return await getStreamKeysDb();
    } catch (err) {
      return [];
    }
  },

  async revokeStreamKey(streamKey: string): Promise<boolean> {
    return await revokeStreamKeyDb(streamKey);
  },

  // Meta: Live Lira City Weather & Currency Forex
  async getMetaData(): Promise<{ weather: WeatherData; currency: CurrencyRate[]; localTime: string }> {
    let weather: WeatherData = { ...mockWeatherData };
    let currency: CurrencyRate[] = [...mockCurrencyRates];

    // 1. Fetch live real-time Lira City weather from Open-Meteo API
    try {
      const weatherRes = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=2.2472&longitude=32.9000&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Africa%2FKampala',
        { next: { revalidate: 300 } } // Cache for 5 minutes
      );
      if (weatherRes.ok) {
        const weatherJson = await weatherRes.json();
        const current = weatherJson.current;
        const weatherCode = current.weather_code || 0;

        let condition = 'Partly Sunny';
        let icon = 'sun-cloud';

        if (weatherCode === 0) {
          condition = 'Clear Sky';
          icon = 'sun';
        } else if (weatherCode >= 1 && weatherCode <= 2) {
          condition = 'Partly Cloudy';
          icon = 'sun-cloud';
        } else if (weatherCode === 3) {
          condition = 'Overcast';
          icon = 'cloud';
        } else if (weatherCode >= 51 && weatherCode <= 65) {
          condition = 'Rain Showers';
          icon = 'rain';
        } else if (weatherCode >= 80 && weatherCode <= 82) {
          condition = 'Rain Showers';
          icon = 'rain';
        } else if (weatherCode >= 95) {
          condition = 'Thunderstorm';
          icon = 'thunder';
        }

        weather = {
          city: 'Lira City',
          region: 'Northern Uganda',
          temperature_celsius: Math.round(current.temperature_2m),
          condition,
          humidity: `${Math.round(current.relative_humidity_2m)}%`,
          wind_speed: `${Math.round(current.wind_speed_10m)} km/h`,
          forecast_icon: icon,
        };
      }
    } catch (err) {
      console.warn('Failed to fetch live Lira weather, using baseline fallback:', err);
    }

    // 2. Fetch live Forex rates for UGX
    try {
      const forexRes = await fetch('https://open.er-api.com/v6/latest/USD', {
        next: { revalidate: 600 } // Cache for 10 minutes
      });
      if (forexRes.ok) {
        const forexJson = await forexRes.json();
        const rates = forexJson.rates;
        if (rates && rates.UGX) {
          const usdUgx = rates.UGX;
          const eurUgx = rates.UGX / rates.EUR;
          const gbpUgx = rates.UGX / rates.GBP;
          const kesUgx = rates.UGX / rates.KES;

          currency = [
            {
              pair: 'USD / UGX',
              rate: usdUgx.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
              change: '+0.12%',
              trend: 'up'
            },
            {
              pair: 'EUR / UGX',
              rate: eurUgx.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
              change: '-0.05%',
              trend: 'down'
            },
            {
              pair: 'GBP / UGX',
              rate: gbpUgx.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
              change: '+0.18%',
              trend: 'up'
            },
            {
              pair: 'KES / UGX',
              rate: kesUgx.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
              change: '+0.04%',
              trend: 'up'
            }
          ];
        }
      }
    } catch (err) {
      console.warn('Failed to fetch live Forex, using baseline fallback:', err);
    }

    return {
      weather,
      currency,
      localTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Kampala' }) + ' EAT',
    };
  }
};

