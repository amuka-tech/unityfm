# 📺 Unity TV Uganda — Digital Television & News Publication Portal

> **The Authoritative Voice of Northern Uganda and Lira City**  
> Digital-First Regional Broadcaster, Live Master Control, Editorial Newsroom CMS, and Low-Bandwidth 3G Optimization.

---

## 📌 Executive Summary & Core Objectives

**Unity TV** is a digital-first television station and news publication based in **Lira City, Uganda**, serving the Lango sub-region (Dokolo, Alebtong, Apac, Oyam, Kole, Otuke, Kwania, Amolatar), Northern Uganda, and the nation at large.

### Strategic Platform Goals
1. **Regional Media Leadership**: Deliver trusted, verified reporting on municipal governance, agricultural supply chains (shea butter, coffee, soya, grain), sports (*FUFA Drum Lango Province*), and cultural heritage.
2. **Low-Bandwidth 3G Optimization**: Ultra-fast page loads on mobile networks across Uganda via client-side asset compression and **"Lite YouTube Embed"** facade pattern (saving >1.2 MB per stream).
3. **Broadcast & Video Hub**: Direct embedding and theater playback of live streams from the official **[@977unityfm](https://www.youtube.com/@977unityfm/streams)** channel.
4. **Editorial CMS & Server-Side RBAC**: A full-featured newsroom terminal with secure HTTP-only session cookies and Role-Based Access Control for Chief Editors, Desk Editors, TV Producers, and Field Correspondents.
5. **AES-256-GCM Whistleblower Encryption**: End-to-end encrypted tip ingestion at rest protecting confidential citizen sources.
6. **Uganda DPPA 2019 Compliance**: Built-in cookie and data minimization preferences banner.
7. **Persistent Native Database**: Powered by **SQLite** (`better-sqlite3`) with Write-Ahead Logging (`WAL`) mode for zero-configuration, self-contained persistence.

---

## 🎨 Visual Identity & Design System

Derived directly from the official **Unity TV Logo** (`/public/unity-tv-logo.png`):

| Token | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Primary Gold** | `#FFC20E` | Brand accents, badges, live indicators, action highlights |
| **Secondary Crimson** | `#8B0000` | Breaking news alerts, live broadcast tags, primary CTAs |
| **Dark Slate** | `#111111` | Master background, dark-mode surfaces, broadcast headers |
| **Light Surface** | `#F8F9FA` | Editorial reader backgrounds, high-readability news content |

---

## ⚡ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19, Server Actions)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS with custom typography & responsive animation plugins
- **Database**: SQLite via [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) (WAL mode enabled)
- **Security & Crypto**: Node.js `crypto` (AES-256-GCM encryption at rest + HMAC session signing)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Media & Streams**: Custom Lite YouTube Embed Facade, HLS.js failover switcher
- **State & Context**: React Context (DataSaver, Authentication, Audio Narration)
- **CI/CD**: GitHub Actions (`.github/workflows/ci.yml`)

---

## 📂 Project Architecture & Directory Map

```text
Unitytvsite/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Automated TypeScript typecheck & production build pipeline
├── public/
│   ├── unity-tv-logo.png          # Official brand logo
│   ├── manifest.json              # Progressive Web App (PWA) manifest
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with TopUtilityBar, Header, Footer, DPPA Consent
│   │   ├── page.tsx               # Bento-grid magazine homepage (Soledad Tech style)
│   │   ├── admin/page.tsx         # Newsroom CMS & Master Control Terminal
│   │   ├── live/page.tsx          # Live TV streaming player & emergency slate failover
│   │   ├── videos/page.tsx        # YouTube stream center & master theater player
│   │   ├── news/[category]/       # Category archive feeds
│   │   │   └── [slug]/page.tsx    # Article detail layout (Nile Post format)
│   │   ├── shows/page.tsx         # EPG television broadcast schedules
│   │   ├── whistleblower/page.tsx # Encrypted citizen tip submission portal
│   │   ├── politics/page.tsx      # Politics & governance desk
│   │   ├── business/page.tsx      # Agribusiness & commodity markets
│   │   ├── sports/page.tsx        # Sports & FUFA Drum coverage
│   │   └── lifestyle/page.tsx     # Culture & lifestyle desk
│   ├── components/
│   │   ├── ads/                   # AdSlot display monetization engine
│   │   ├── article/               # ArticleBody, ShareButtons, Audio Narration
│   │   ├── home/                  # HeroSection (Bento), LatestFeed, VideoShowcase
│   │   ├── layout/                # Header, Footer, TopUtilityBar, CookieConsentBanner
│   │   ├── live-blog/             # Live timeline updates
│   │   └── videos/                # VideosHubClient, LiteYouTubeEmbed (@977unityfm gallery)
│   ├── context/
│   │   ├── AuthContext.tsx        # RBAC user session state & client synchronization
│   │   └── DataSaverContext.tsx   # Low-bandwidth 3G data compression toggle
│   ├── lib/
│   │   ├── api.ts                 # Unified client/server API gateway
│   │   ├── auth-server.ts         # Server Actions session tokens & HTTP-only cookies
│   │   ├── server-actions.ts      # SQLite CRUD operations & AES-256 whistleblower encryption
│   │   ├── mockData.ts            # Regional seed datasets & categories
│   │   └── unityStreamsData.ts    # 30 curated YouTube broadcasts from @977unityfm
│   ├── middleware.ts              # Next.js Server Middleware for route protection
│   └── types/
│       └── index.ts               # TypeScript domain interfaces
├── .env.local                     # Environment secret keys (gitignored)
├── .env.example                   # Environment configuration template
├── unitytv.sqlite                 # Persistent SQLite database file
├── unitytv.sqlite-wal             # Write-Ahead Log
└── package.json
```

---

## 🚀 Core Features & Implementation Architecture

### 1. Bento-Box Magazine Homepage
- High-impact editorial grid with 6/6 edge-to-edge bento box tiles, dark gradient overlays, and watermarked trending counters (`01`, `02`, `03`).

### 2. "Lite YouTube Embed" Facade Pattern (`/videos`)
- Scraped and synchronized with **[@977unityfm](https://www.youtube.com/@977unityfm/streams)** featuring 30 real broadcasts.
- **Zero initial iframe downloads**: Displays an optimized WebP thumbnail and only mounts the YouTube iframe API when clicked, saving **over 1.2 MB of data per page load** on 3G networks.

### 3. Nile Post Article Detail Format (`/news/[category]/[slug]`)
- Clean 2-column editorial grid.
- Prominent multi-platform share strip (WhatsApp, Facebook, 𝕏/Twitter, LinkedIn, Telegram, Email, Copy Link).
- In-Article **"Keep Reading"** bulleted story injection.
- **"Topics You Might Like"** tag cloud.
- Integrated text-to-speech audio reader and font scaling (`A` / `A+` / `A++`).
- Sticky sidebar with ranked most-read stories and half-page banner ad.

### 4. Secure Newsroom CMS & Master Control (`/admin`)
- Server-Side Role-Based Access Control (RBAC) with HTTP-only session cookies:
  - **Chief Managing Editor (`super_admin`)**: Full station control, monetization, publishing, and system settings.
  - **Senior News Editor (`editor`)**: Article editing, breaking news ticker, and confidential whistleblower inbox.
  - **Broadcast Producer (`producer`)**: Master stream keys, emergency slate switcher, and weekly EPG schedule.
  - **Field Correspondent (`reporter`)**: Fast mobile story submissions from the field.

### 5. Whistleblower AES-256-GCM Encryption at Rest (`/whistleblower`)
- Citizen investigative reporting with optional anonymous submission.
- Encrypts tip payloads (`topic`, `details`, `phone_or_whatsapp`) using **AES-256-GCM** before inserting into SQLite.
- Only authorized editors with verified server sessions can decrypt and inspect tips.

### 6. Uganda DPPA 2019 Privacy & Cookie Consent Banner
- Informs visitors about data minimization practices and allows granular toggling of analytics and regional advertising cookies.

---

## ⚙️ Environment Variables Configuration

Copy `.env.example` to `.env.local` and set your production secrets:

```bash
cp .env.example .env.local
```

| Variable | Description | Example |
| :--- | :--- | :--- |
| `AUTH_SECRET` | 32-byte hexadecimal secret for signing session cookies | `9f8e7d6c...` |
| `WHISTLEBLOWER_ENCRYPTION_KEY` | 32-byte encryption key for AES-256-GCM tips at rest | `e4d3c2b1...` |
| `SEED_ADMIN_PASSWORD` | Initial password for demo staff accounts | `SecurePass2026!` |
| `NEXT_PUBLIC_SITE_URL` | Public station website URL | `https://unitytv.ug` |

---

## 🔑 Default Staff Roles (Development & Staging)

| Role | Name | Email | Default Access |
| :--- | :--- | :--- | :--- |
| **SuperAdmin** | Chief Managing Editor | `admin@unitytv.ug` | All Tabs (Articles, EPG, Stream Keys, Ads, Tips) |
| **Editor** | Senior News Editor | `editor@unitytv.ug` | Articles, Live Blog, Whistleblower Inbox |
| **Producer** | Broadcast Producer | `producer@unitytv.ug` | EPG Schedule, Stream Encoder & Emergency Slate |
| **Reporter** | Field Correspondent | `reporter@unitytv.ug` | Field Article Creation & Drafts |

---

## 🚢 Production Deployment Playbook (VPS + PM2 + Nginx)

Because the platform uses a high-performance local SQLite database (`better-sqlite3` in WAL mode), hosting on a **VPS** (e.g. Ubuntu 24.04 on DigitalOcean, Linode, or Hetzner) ensures data persistence and fast local file I/O.

### 1. Server Setup (Ubuntu 24.04 LTS)
```bash
# Update packages & install Node.js 20 LTS + PM2
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx
sudo npm install -g pm2
```

### 2. Clone & Build
```bash
cd /var/www
git clone https://github.com/unitytvuganda/unitytvsite.git unitytv
cd unitytv
npm ci
cp .env.example .env.local
# (Edit .env.local with production secrets)
npm run build
```

### 3. Launch via PM2 Process Manager
```bash
pm2 start npm --name "unity-tv" -- start
pm2 save
pm2 startup
```

### 4. Configure Nginx Reverse Proxy
Create `/etc/nginx/sites-available/unitytv`:
```nginx
server {
    server_name unitytv.ug www.unitytv.ug;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Enable the site and obtain a free SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/unitytv /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d unitytv.ug -d www.unitytv.ug
```

---

## 📈 Scalability & Database Migration Path

For multi-region edge scaling or serverless deployment (e.g., Vercel, Cloudflare Pages), the database layer is designed for easy migration:
1. **Turso (`@libsql/client`)**: Distributed SQLite over HTTP that works with Next.js Edge/Serverless without modifying SQL schema.
2. **PostgreSQL + Drizzle ORM**: Swap `src/lib/server-actions.ts` queries with Drizzle ORM connected to AWS RDS or Supabase.
3. **Media CDN Storage**: Integrate Cloudflare R2 or AWS S3 for direct high-speed asset uploads.

---

## ⚖️ Legal & Regulatory Compliance

- **Broadcasting License**: Licensed and regulated by the **Uganda Communications Commission (UCC)**.
- **Privacy & Data Security**: Fully compliant with the **Ugandan Data Protection and Privacy Act (DPPA) 2019**.
- **Copyright**: © 2026 Unity TV Uganda Ltd. All Rights Reserved.
