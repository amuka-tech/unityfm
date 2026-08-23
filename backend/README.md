# Unity TV — Laravel 11 + FilamentPHP v3 Headless API Backend

This is the production backend for **Unity TV Uganda**, powering the editorial CMS, role-based workflows, live stream switcher, EPG schedule, real-time Reverb WebSockets, and low-bandwidth API endpoints.

## Tech Stack & Ecosystem
- **Framework**: Laravel 11.x
- **Editorial CMS**: FilamentPHP v3
- **RBAC**: Spatie Laravel Permission (`Reporter`, `Editor`, `Producer`, `SuperAdmin`)
- **Real-Time WebSockets**: Laravel Reverb + Laravel Echo
- **API Authentication**: Laravel Sanctum
- **Media Optimization**: Spatie Media Library (automatic WebP conversion for 3G Data-Saver)
- **Database**: PostgreSQL / MySQL / SQLite

## Setup Instructions

### 1. Requirements
- PHP 8.2 or 8.3 with extensions: `pdo`, `mbstring`, `openssl`, `bcmath`, `curl`, `gd`
- Composer 2.x
- Node.js 18+ (for Filament asset compiling)
- SQLite, MySQL or PostgreSQL

### 2. Quickstart
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve --port=8000
```

### 3. Start Laravel Reverb (WebSockets)
```bash
php artisan reverb:start
```

### 4. Default Seeded Admin Accounts
- **SuperAdmin**: `admin@unitytv.ug` | `UnityTV2026!` (Access to `/admin` Filament Panel)
- **Senior Editor**: `editor@unitytv.ug` | `UnityTV2026!`
- **Reporter**: `reporter@unitytv.ug` | `UnityTV2026!`

### 5. API Endpoints (`/api/v1/`)
- `GET /api/v1/articles` - List articles (supports `Save-Data: on` header for low-bandwidth 3G)
- `GET /api/v1/articles/{slug}` - Article details with related stories
- `GET /api/v1/breaking-news` - Top ticker items
- `GET /api/v1/broadcast/current` - Live stream status and now playing show
- `GET /api/v1/epg/schedule` - Weekly program guide
- `GET /api/v1/live-blogs/{slug}` - Live blog updates
- `GET /api/v1/ads/active` - Active monetization slots
- `POST /api/v1/whistleblower` - Secure citizen news tips
