<?php

namespace Database\Seeders;

use App\Models\AdCampaign;
use App\Models\AdSlot;
use App\Models\Article;
use App\Models\Broadcast;
use App\Models\Category;
use App\Models\EpgSchedule;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Core Users with RBAC Roles
        $admin = User::create([
            'name' => 'Editorial SuperAdmin',
            'email' => 'admin@unitytv.ug',
            'password' => Hash::make('UnityTV2026!'),
            'role' => 'super_admin',
            'bureau' => 'Lira City Head Office',
            'designation' => 'Managing Editor & Head of Broadcast',
            'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            'bio' => 'Lead journalist and broadcaster steering Northern Uganda editorial operations.',
        ]);

        $editor = User::create([
            'name' => 'Sarah Awor',
            'email' => 'editor@unitytv.ug',
            'password' => Hash::make('UnityTV2026!'),
            'role' => 'editor',
            'bureau' => 'Lira City Hub',
            'designation' => 'Senior News Editor & Lango Affairs',
            'avatar_url' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
            'bio' => 'Award-winning investigative journalist covering regional policy and local governance.',
        ]);

        $reporter = User::create([
            'name' => 'Okello Moses',
            'email' => 'reporter@unitytv.ug',
            'password' => Hash::make('UnityTV2026!'),
            'role' => 'reporter',
            'bureau' => 'Northern Uganda Bureau',
            'designation' => 'Field Correspondent & Agriculture Lead',
            'avatar_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            'bio' => 'Specialist reporter covering agribusiness, Shea butter farming, and local sports in Lango.',
        ]);

        // 2. Categories
        $categories = [
            ['name' => 'Lira City', 'slug' => 'lira-city', 'color' => '#FFC20E', 'description' => 'Municipal news, infrastructure, local markets and city council updates.'],
            ['name' => 'Lango Sub-Region', 'slug' => 'lango-sub-region', 'color' => '#8B0000', 'description' => 'Covering Dokolo, Alebtong, Apac, Oyam, Kole, Otuke, Kwania, and Amolatar.'],
            ['name' => 'Northern Uganda', 'slug' => 'northern-uganda', 'color' => '#1F2937', 'description' => 'Regional stories from Acholi, West Nile, Karamoja, and Lango.'],
            ['name' => 'Politics & Governance', 'slug' => 'politics', 'color' => '#8B0000', 'description' => 'National parliament, local council policies, and electoral coverage.'],
            ['name' => 'Business & Agriculture', 'slug' => 'business', 'color' => '#10B981', 'description' => 'Shea butter value chain, soya, coffee, grain commodity prices, and SACCOs.'],
            ['name' => 'Sports', 'slug' => 'sports', 'color' => '#F59E0B', 'description' => 'FUFA Drum Lango Province, Uganda Premier League, and local school championships.'],
            ['name' => 'Lifestyle & Culture', 'slug' => 'lifestyle', 'color' => '#8B5CF6', 'description' => 'Luo cultural heritage, Tekwaro Lango, health, music and education.'],
            ['name' => 'Videos', 'slug' => 'videos', 'color' => '#EF4444', 'description' => 'Unity TV bulletins, investigative documentaries, and talk show recordings.'],
        ];

        $catModels = [];
        foreach ($categories as $cat) {
            $catModels[$cat['slug']] = Category::create($cat);
        }

        // 3. Ad Slots & Sample Local Campaigns
        $leaderboard = AdSlot::create(['name' => 'Top Leaderboard Banner', 'slot_key' => 'leaderboard_top', 'dimensions' => '970x90 / 728x90']);
        $inArticleP3 = AdSlot::create(['name' => 'In-Article Paragraph 3', 'slot_key' => 'in_article_p3', 'dimensions' => '728x90 / 300x250']);
        $inFeed = AdSlot::create(['name' => 'In-Feed Native Sponsored Card', 'slot_key' => 'in_feed_native', 'dimensions' => 'Card Match']);
        $mobileAnchor = AdSlot::create(['name' => 'Mobile Sticky Bottom Anchor', 'slot_key' => 'mobile_sticky_bottom', 'dimensions' => '320x50']);

        AdCampaign::create([
            'ad_slot_id' => $leaderboard->id,
            'advertiser_name' => 'Stanbic Bank Uganda (Lira Branch)',
            'campaign_title' => 'Agri-Business Finance Solutions for Northern Uganda Farmers',
            'banner_image_url' => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=200&fit=crop',
            'destination_url' => 'https://www.stanbicbank.co.ug',
            'cta_text' => 'Apply for Agri-Loan',
            'is_active' => true,
        ]);

        // 4. Live Broadcast default
        Broadcast::create([
            'channel_name' => 'Unity TV Uganda - Live from Lira City',
            'stream_url_hls' => 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
            'stream_url_youtube' => 'https://www.youtube.com/embed/live_stream?channel=UnityTVUganda',
            'is_live' => true,
            'is_emergency_slate' => false,
            'now_playing_title' => 'Lango Evening News & Agribusiness Pulse',
            'now_playing_desc' => 'Live coverage of regional development, market commodity prices, and municipal policy in Lira City.',
            'now_playing_host' => 'Okello Moses',
            'up_next_title' => 'Northern Spotlight: Cultural Heritage & Innovation',
            'up_next_time' => '21:00 EAT',
        ]);
    }
}
