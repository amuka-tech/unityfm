import { Article, Category, BroadcastState, ScheduleProgram, LiveBlogData, WeatherData, CurrencyRate } from '@/types';

export const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Lira City',
    slug: 'lira-city',
    color: '#FFC20E',
    description: 'Municipal governance, urban development, commerce, and city life in Lira.',
    subcategories: [
      { name: 'City Council & Mayor', slug: 'lira-council' },
      { name: 'Markets & Commerce', slug: 'lira-markets' },
      { name: 'Infrastructure & Roads', slug: 'lira-infrastructure' },
      { name: 'Health & Sanitation', slug: 'lira-health' },
    ]
  },
  {
    id: 2,
    name: 'Lango Sub-Region',
    slug: 'lango-sub-region',
    color: '#8B0000',
    description: 'News from Dokolo, Alebtong, Apac, Oyam, Kole, Otuke, Kwania, and Amolatar.',
    subcategories: [
      { name: 'Dokolo', slug: 'dokolo' },
      { name: 'Oyam', slug: 'oyam' },
      { name: 'Apac', slug: 'apac' },
      { name: 'Alebtong', slug: 'alebtong' },
      { name: 'Kole', slug: 'kole' },
      { name: 'Otuke', slug: 'otuke' },
      { name: 'Kwania', slug: 'kwania' },
      { name: 'Amolatar', slug: 'amolatar' },
    ]
  },
  {
    id: 3,
    name: 'Northern Uganda',
    slug: 'northern-uganda',
    color: '#1F2937',
    description: 'Broader regional coverage from Acholi, West Nile, Karamoja, and Lango sub-regions.',
  },
  {
    id: 4,
    name: 'Politics & Governance',
    slug: 'politics',
    color: '#8B0000',
    description: 'Parliamentary debates, ministerial decisions, local council elections, and civic rights.',
  },
  {
    id: 5,
    name: 'Business & Agriculture',
    slug: 'business',
    color: '#10B981',
    description: 'Shea butter value chain, soya, coffee, grains, SACCOs, and regional commodity pricing.',
  },
  {
    id: 6,
    name: 'Sports',
    slug: 'sports',
    color: '#F59E0B',
    description: 'FUFA Drum Lango Province, Uganda Premier League, schools football, and athletics.',
  },
  {
    id: 7,
    name: 'Lifestyle & Culture',
    slug: 'lifestyle',
    color: '#8B5CF6',
    description: 'Luo cultural traditions, Tekwaro Lango, education, music, family and community.',
  },
  {
    id: 8,
    name: 'Videos',
    slug: 'videos',
    color: '#EF4444',
    description: 'Radio Unity FM bulletins, investigative documentaries, and prime-time talk show archives.',
  }
];

export const mockArticles: Article[] = [
  {
    id: 101,
    title: 'Lira-Kamdini Expressway Phase 2 Commissioned: 68km Modern Asphalt Section Opens to Ease Northern Transport Corridor',
    slug: 'lira-kamdini-expressway-phase-2-commissioned-2026',
    sub_headline: 'The newly upgraded highway cuts travel time between Lira City and Karuma junction by over 50%, unlocking fresh trade opportunities.',
    excerpt: 'Transport Minister and UNRA engineers officially flagged off the newly paved 68-kilometer section of the Lira-Kamdini Highway today, easing long-standing bottleneck transit across Northern Uganda.',
    content: `
      <p class="lead"><strong>LIRA CITY</strong> — Commercial transport between Lira City, Gulu, and the Karuma transit junction received a major boost today following the official commissioning of the completed 68-kilometer paved section of the Lira-Kamdini Highway corridor.</p>
      
      <p>The landmark infrastructure project, executed under strict monitoring by the Uganda National Roads Authority (UNRA), replaces the notoriously deteriorated stretch that had previously hampered freight movement and caused costly vehicular breakdowns for over a decade.</p>
      
      <div class="my-6 p-4 rounded bg-amber-50 border-l-4 border-amber-500 text-amber-950 font-medium">
        "This highway is the lifeline of Lango’s commercial engine. Farmers moving soya, sunflower, and grain to Kampala can now reach Karuma in under 45 minutes without fear of cargo losses." — Minister of Works and Transport
      </div>
      
      <p>Local business leaders and truck operators gathered at the Agwata junction ceremony expressed immense relief. According to the Lira Commercial Transporters SACCO, average vehicle maintenance costs are projected to drop by 35% as a direct consequence of the smooth asphalt surface.</p>
      
      <p>The second phase also introduces solar-powered street lighting through key trading townships including Agwata, Corner Ayer, and Kamdini, enhancing night-time safety and boosting roadside market trading for women and youth entrepreneurs.</p>
      
      <p>UNRA regional station engineers confirmed that road furniture installations, weight check stations, and drainage canals have been engineered to withstand heavy seasonal rainfall typical of the Nile sub-basin.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=700&fit=crop',
    image_caption: 'Vehicles traverse the newly asphalted dual corridor near Agwata trading center in Dokolo district.',
    image_credit: 'Radio Unity FM / Patrick Okot',
    location_tag: 'Lira City & Dokolo',
    category: { id: 1, name: 'Lira City', slug: 'lira-city', color: '#FFC20E' },
    subcategory: { id: 103, name: 'Infrastructure & Roads', slug: 'lira-infrastructure' },
    author: {
      id: 1,
      name: 'Sarah Awor',
      bureau: 'Lira City Newsroom',
      designation: 'Senior Editor & Infrastructure Lead',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
    status: 'published',
    is_breaking: true,
    is_hero: true,
    is_featured_regional: true,
    is_video_story: true,
    video_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    video_duration: '04:15',
    reading_time_minutes: 4,
    view_count: 14280,
    tags: ['Lira City', 'UNRA', 'Infrastructure', 'Northern Uganda', 'Commerce', 'Highway'],
    key_takeaways: [
      '68km dual corridor fully asphalted and opened to traffic.',
      'Travel time between Lira City and Karuma reduced by 50%.',
      'Solar lighting installed across 8 commercial trading centers.',
      'Projected 35% reduction in freight logistics maintenance costs.'
    ],
    published_at: '2026-08-20T14:30:00+03:00'
  },
  {
    id: 102,
    title: 'Shea Butter Revolution: Otuke & Alebtong Co-operatives Secure Direct European Export Agreement for Organic Nilotica Oil',
    slug: 'shea-butter-revolution-otuke-alebtong-export-deal-2026',
    sub_headline: 'Over 4,500 women harvesters set to benefit from premium fair-trade pricing, cutting out middlemen across the Lango shea belt.',
    excerpt: 'A coalition of 12 women-led Shea harvesting co-operatives in Otuke and Alebtong has finalized a landmark 5-year direct export contract with international organic cosmetic houses.',
    content: `
      <p><strong>OTUKE DISTRICT</strong> — The indigenous Shea nut tree (<em>Vitellaria paradoxa nilotica</em>), long revered as a Northern Ugandan treasure, is transforming household incomes across the rural belt of Otuke and Alebtong districts.</p>
      
      <p>Through the newly signed bilateral export compact, over 4,500 organized women pickers and cold-press processors will supply certified Grade-A Nilotica shea butter directly to European natural cosmetic formulators without relying on exploitative brokerage networks.</p>
      
      <p>Nilotica shea butter from the Lango sub-region is prized globally for its high olein content, silky texture, and delicate aroma compared to West African variants. The direct export agreement guarantees a floor price 60% above the local open market baseline.</p>
      
      <p>The Ministry of Agriculture, Animal Industry and Fisheries (MAAIF) alongside the National Forestry Authority (NFA) announced tightened enforcement against illegal shea tree charcoal burning, designating remaining virgin woodlands as protected ecological reserves.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=1200&h=700&fit=crop',
    image_caption: 'Members of the Otuke Women Shea Alliance inspect cold-pressed organic butter batches.',
    image_credit: 'Radio Unity FM / Okello Moses',
    location_tag: 'Otuke District',
    category: { id: 5, name: 'Business & Agriculture', slug: 'business', color: '#10B981' },
    author: {
      id: 2,
      name: 'Okello Moses',
      bureau: 'Northern Uganda Agribusiness Desk',
      designation: 'Specialist Correspondent',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    status: 'published',
    is_breaking: false,
    is_hero: false,
    is_featured_regional: true,
    is_video_story: false,
    reading_time_minutes: 3,
    view_count: 9840,
    tags: ['Shea Butter', 'Otuke', 'Alebtong', 'Exports', 'Agriculture', 'Women In Business'],
    key_takeaways: [
      'Direct export compact covers 4,500 rural women processors.',
      'Guaranteed floor price 60% above open market rates.',
      'NFA tightens protected status for indigenous Shea nut trees.'
    ],
    published_at: '2026-08-20T12:15:00+03:00'
  },
  {
    id: 103,
    title: 'FUFA Drum Quarter-Final: Lango Province Stuns Buganda 2-1 in Thrilling Clash at Akii-Bua Olympic Stadium',
    slug: 'fufa-drum-lango-province-stuns-buganda-akii-bua-stadium',
    sub_headline: 'A roaring 25,000-strong home crowd in Lira City cheers the White Rhinos into the semi-finals after a 89th-minute curling strike.',
    excerpt: 'Lango Province produced an unforgettable tactical masterclass at the newly expanded Akii-Bua Olympic Memorial Stadium, overcoming defending champions Buganda 2-1 in a nail-biting encounter.',
    content: `
      <p><strong>LIRA CITY</strong> — The deafening roar of 25,000 passionate football fans reverberated across Lira City on Wednesday afternoon as Lango Province edged past Buganda Province 2-1 to book their spot in the FUFA Drum tournament semi-finals.</p>
      
      <p>Star striker Denis Omedi opened the scoresheet in the 24th minute with a clinical header off an Allan Okello corner delivery. Buganda fought back with a penalty early in the second half, before local hero Dickens Okwir curled an 89th-minute freekick into the top right corner.</p>
      
      <p>Radio Unity FM’s live broadcast cameras captured jubilant scenes across the stadium terraces and in downtown Lira streets, with motorcycle riders and youth chanting traditional Luo victory anthems long into the evening.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&h=700&fit=crop',
    image_caption: 'Lango Province players celebrate the decisive 89th-minute match-winner at Akii-Bua Stadium.',
    image_credit: 'Radio Unity FM Sports / Dennis Ogwang',
    location_tag: 'Lira City',
    category: { id: 6, name: 'Sports', slug: 'sports', color: '#F59E0B' },
    author: {
      id: 3,
      name: 'Dennis Ogwang',
      bureau: 'Sports Desk',
      designation: 'Senior Sports Anchor',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
    status: 'published',
    is_breaking: true,
    is_hero: false,
    is_featured_regional: true,
    is_video_story: true,
    video_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    video_duration: '06:40',
    reading_time_minutes: 3,
    view_count: 18950,
    tags: ['FUFA Drum', 'Lango Province', 'Sports', 'Akii-Bua', 'Football', 'Lira'],
    key_takeaways: [
      'Lango Province advances to FUFA Drum 2026 semi-finals.',
      'Denis Omedi and Dickens Okwir score decisive goals.',
      'Record attendance of 25,000 spectators at Akii-Bua Memorial Stadium.'
    ],
    published_at: '2026-08-20T11:00:00+03:00'
  },
  {
    id: 104,
    title: 'Modern Solar Cold Storage Facility Commissioned at Lira Main Market to Curtail Post-Harvest Horticultural Losses',
    slug: 'solar-cold-storage-lira-main-market-commissioned',
    sub_headline: 'Over 1,200 tomato, cabbage, and fruit vendors gain access to 24/7 cold rooms, reducing spoilage during high-heat seasons.',
    excerpt: 'Lira City Council in partnership with the Dutch Development Agency has handed over a state-of-the-art 50-tonne solar-powered refrigeration hub at Lira Main Market.',
    content: `
      <p><strong>LIRA CITY</strong> — Market traders in Northern Uganda’s largest municipal retail market now have a modern defense against scorching daytime heat and produce spoilage.</p>
      
      <p>The 50-tonne capacity solar cooling facility maintains constant temperatures between 4°C and 8°C using a 45kW rooftop photovoltaic array coupled with lithium battery storage.</p>
      
      <p>Vendors association leader Jane Auma praised the initiative, noting that previously up to 25% of fresh vegetables brought from Erute and Oyam rotted before being sold on secondary market days.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&h=700&fit=crop',
    image_caption: 'Solar panels installed on the roof of Lira Main Market cold storage facility.',
    image_credit: 'Radio Unity FM / Sarah Awor',
    location_tag: 'Lira City',
    category: { id: 1, name: 'Lira City', slug: 'lira-city', color: '#FFC20E' },
    author: {
      id: 1,
      name: 'Sarah Awor',
      bureau: 'Lira City Newsroom',
      designation: 'Senior Editor',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
    status: 'published',
    is_breaking: false,
    is_hero: false,
    is_featured_regional: true,
    is_video_story: false,
    reading_time_minutes: 3,
    view_count: 6420,
    tags: ['Lira Main Market', 'Solar', 'Agriculture', 'Economy', 'City Council'],
    published_at: '2026-08-20T09:30:00+03:00'
  },
  {
    id: 105,
    title: 'Tekwaro Lango Cultural Heritage Festival Announced for October: Elders Convene in Otuke to Preserve Luo Dialect and Rituals',
    slug: 'tekwaro-lango-cultural-heritage-festival-announced-2026',
    sub_headline: 'Youth symposiums, traditional culinary showcases, and indigenous folklore storytelling set to headline the 3-day regional summit.',
    excerpt: 'The cultural institution of Lango (Tekwaro Lango) has announced the dates for the 2026 Cultural Heritage Festival, bringing together clans from all 8 districts.',
    content: `
      <p><strong>OTUKE & LIRA</strong> — Clan leaders and cultural custodians under Tekwaro Lango have officially announced the return of the annual Luo Cultural Heritage Festival, scheduled for October 14–17 in Otuke.</p>
      
      <p>The cultural festival aims to reconnect Northern Ugandan youth in the diaspora and urban centers with traditional Luo proverbs, drum rhythms (<em>Myel Orak</em>), royal regalia preservation, and indigenous agrarian astronomy.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&h=700&fit=crop',
    image_caption: 'Traditional Luo drummers rehearse ahead of the regional Tekwaro Lango summit.',
    image_credit: 'Radio Unity FM Culture / Walter Odongo',
    location_tag: 'Lango Sub-Region',
    category: { id: 7, name: 'Lifestyle & Culture', slug: 'lifestyle', color: '#8B5CF6' },
    author: {
      id: 4,
      name: 'Walter Odongo',
      bureau: 'Culture & Heritage Desk',
      designation: 'Heritage Correspondent',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    status: 'published',
    is_breaking: false,
    is_hero: false,
    is_featured_regional: true,
    is_video_story: false,
    reading_time_minutes: 3,
    view_count: 5120,
    tags: ['Tekwaro Lango', 'Culture', 'Luo', 'Otuke', 'Heritage'],
    published_at: '2026-08-19T16:00:00+03:00'
  },
  {
    id: 106,
    title: 'Bank of Uganda Agribusiness Lending Window: Lango Grain Traders SACCO Receives UGX 4.2 Billion Low-Interest Facility',
    slug: 'bank-of-uganda-agribusiness-lending-lango-sacco-4-billion',
    sub_headline: 'The funding provides revolving liquidity for grain aggregation, protecting smallholders against predatory spot price swings.',
    excerpt: 'Commercial grain aggregators in Kole and Dokolo have secured a subsidized 9.5% per annum refinancing window under the Central Bank Agriculture Credit Facility.',
    content: `
      <p><strong>KOLE DISTRICT</strong> — Grain farming cooperatives across Kole, Dokolo, and Oyam districts have received a major financial cushion ahead of the upcoming second-season harvest.</p>
      
      <p>The UGX 4.2 Billion facility, channeled through regional financial partners, enables SACCOs to purchase maize, sorghum, and soya beans at fair benchmark prices directly from farmers at farm-gate collection points.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=700&fit=crop',
    image_caption: 'Soya bean collection center in Kole district where grain is tested for moisture standards.',
    image_credit: 'Radio Unity FM / Okello Moses',
    location_tag: 'Kole District',
    category: { id: 5, name: 'Business & Agriculture', slug: 'business', color: '#10B981' },
    author: {
      id: 2,
      name: 'Okello Moses',
      bureau: 'Northern Uganda Agribusiness Desk',
      designation: 'Specialist Correspondent',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    status: 'published',
    is_breaking: false,
    is_hero: false,
    is_featured_regional: true,
    is_video_story: false,
    reading_time_minutes: 3,
    view_count: 4890,
    tags: ['Bank of Uganda', 'Finance', 'Agriculture', 'Kole', 'SACCO'],
    published_at: '2026-08-19T13:45:00+03:00'
  },
  {
    id: 107,
    title: 'Apac District New General Hospital Construction Crosses 75% Milestone, Slated for Q4 2026 Opening',
    slug: 'apac-district-new-general-hospital-construction-milestone-2026',
    sub_headline: 'Equipped with a modern 12-bed ICU, neonatal ward, and solar backup, the 200-bed facility will serve over 300,000 residents.',
    excerpt: 'Healthcare access across Apac and surrounding lakeside sub-counties is poised for a quantum leap as structural works on the new hospital near completion.',
    content: `
      <p><strong>APAC DISTRICT</strong> — Structural civil works on the long-awaited Apac District General Hospital have reached 75% completion, with contractors now installing internal clinical gas piping and specialized theatre floor finishes.</p>
      
      <p>District Health Officer Dr. Emmanuel Ogwang noted that the upgraded facility will eliminate the need for critical trauma patients to make the arduous 60-kilometer transfer to Lira Regional Referral Hospital.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=700&fit=crop',
    image_caption: 'Engineers inspect the newly completed maternity and emergency wing at Apac Hospital.',
    image_credit: 'Radio Unity FM / Sarah Awor',
    location_tag: 'Apac District',
    category: { id: 2, name: 'Lango Sub-Region', slug: 'lango-sub-region', color: '#8B0000' },
    author: {
      id: 1,
      name: 'Sarah Awor',
      bureau: 'Lira City Newsroom',
      designation: 'Senior Editor',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
    status: 'published',
    is_breaking: false,
    is_hero: false,
    is_featured_regional: true,
    is_video_story: false,
    reading_time_minutes: 3,
    view_count: 5740,
    tags: ['Apac', 'Health', 'Hospital', 'Lango', 'Ministry of Health'],
    published_at: '2026-08-19T10:00:00+03:00'
  },
  {
    id: 108,
    title: 'Radio Unity FM Special Investigation: Cross-Border Soya Smuggling Rings Uncovered in Lake Kyoga Maritime Transit',
    slug: 'special-investigation-cross-border-soya-smuggling-lake-kyoga',
    sub_headline: 'A two-month undercover investigation reveals unmonitored canoe routes draining tens of millions in district revenue.',
    excerpt: 'An undercover Radio Unity FM investigative crew traced midnight wooden canoe convoys transporting untaxed grain across Lake Kyoga docking points into Nakasongola and Kayunga.',
    content: `
      <p><strong>AMOLATAR & NAMAASALE</strong> — Under the cover of pitch darkness at 2:00 AM, heavily loaded wooden boats slip quietly away from secluded reed inlets along the northern shores of Lake Kyoga in Amolatar district.</p>
      
      <p>Over the past eight weeks, Radio Unity FM’s Investigative Desk embedded reporters along informal landing bays in Namaasale, documenting an illicit grain pipeline that bypasses district cess revenue checkpoints.</p>
      
      <p>District officials estimate that Amolatar loses upwards of UGX 450 Million annually in uncollected produce taxes, starving local health centers and primary schools of critical public service funds.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&h=700&fit=crop',
    image_caption: 'Night-time landing jetty along Lake Kyoga where unmonitored cargo transit was documented.',
    image_credit: 'Radio Unity FM Investigations',
    location_tag: 'Amolatar District',
    category: { id: 8, name: 'Videos', slug: 'videos', color: '#EF4444' },
    author: {
      id: 5,
      name: 'Investigative Desk',
      bureau: 'Special Projects',
      designation: 'Senior Investigative Team',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    status: 'published',
    is_breaking: false,
    is_hero: false,
    is_featured_regional: true,
    is_video_story: true,
    video_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    video_duration: '14:20',
    reading_time_minutes: 5,
    view_count: 22400,
    tags: ['Investigation', 'Amolatar', 'Lake Kyoga', 'Documentary', 'Taxation'],
    published_at: '2026-08-18T20:00:00+03:00'
  }
];

export const mockBroadcastState: BroadcastState = {
  channel_name: 'Radio Unity FM Uganda — Live from Lira City',
  stream_url_hls: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  stream_url_youtube: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // fallback embed
  is_live: true,
  is_emergency_slate: false,
  now_playing: {
    title: 'Lango Evening News & Agribusiness Pulse',
    description: 'Live broadcast of regional news bulletins, live cross-overs from Lira City newsroom, commodity markets, and community voices.',
    presenter: 'Sarah Awor & Moses Okello',
    presenter_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    start_time: '20:00 EAT',
    end_time: '21:00 EAT',
    progress_percentage: 65,
  },
  up_next: {
    title: 'Northern Spotlight: Cultural Heritage & Tech Innovation',
    time: '21:00 EAT',
    presenter: 'Walter Odongo',
  }
};

const WEEKDAY_PROGRAMS_TEMPLATE = [
  { show_name: 'Morning Devotion', start_time: '03:00', end_time: '06:45', category: 'Devotion', presenter_name: 'Studio', description: 'Morning devotion to start your day.' },
  { show_name: 'News in Luo', start_time: '06:45', end_time: '07:00', category: 'News', presenter_name: 'News Desk', description: 'Latest news bulletin in Luo.' },
  { show_name: 'Announcements', start_time: '07:00', end_time: '08:30', category: 'Announcements', presenter_name: 'Studio', description: 'Important announcements and notices.' },
  { show_name: 'Odiko Alyet', start_time: '08:30', end_time: '10:45', category: 'Talk Show', presenter_name: 'Studio', description: 'Interactive community talk show.' },
  { show_name: 'Sports Update', start_time: '10:45', end_time: '11:00', category: 'Sports', presenter_name: 'Sports Desk', description: 'Quick sports updates.' },
  { show_name: 'Mid Morning Rave', start_time: '11:00', end_time: '12:45', category: 'Music', presenter_name: 'Studio', description: 'Great music and request hour.' },
  { show_name: 'News in Luo', start_time: '12:45', end_time: '13:00', category: 'News', presenter_name: 'News Desk', description: 'Mid-day news bulletin in Luo.' },
  { show_name: 'Announcements', start_time: '13:00', end_time: '14:00', category: 'Announcements', presenter_name: 'Studio', description: 'Afternoon announcements and notices.' },
  { show_name: 'The Afternoon Drive', start_time: '14:00', end_time: '16:30', category: 'Music & Talk', presenter_name: 'Studio', description: 'Keep moving with great hits and traffic updates.' },
  { show_name: 'Sports Update', start_time: '16:30', end_time: '17:00', category: 'Sports', presenter_name: 'Sports Desk', description: 'Evening sports highlights.' },
  { show_name: 'Announcements', start_time: '17:00', end_time: '18:45', category: 'Announcements', presenter_name: 'Studio', description: 'Evening announcements and notices.' },
  { show_name: 'News in Luo', start_time: '18:45', end_time: '19:00', category: 'News', presenter_name: 'News Desk', description: 'Prime news bulletin in Luo.' },
  { show_name: 'Gwec Apoko', start_time: '19:00', end_time: '22:00', category: 'Talk Show', presenter_name: 'Studio', description: 'Evening community talk show.' },
  { show_name: 'Sports Updates', start_time: '22:00', end_time: '23:00', category: 'Sports', presenter_name: 'Sports Desk', description: 'Late night sports roundup.' },
  { show_name: 'Quiet Storm', start_time: '23:00', end_time: '03:00', category: 'Late Night', presenter_name: 'Studio', description: 'Soothing music to ease you into the night.' }
];

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

export const mockScheduleSchedule: ScheduleProgram[] = WEEKDAYS.flatMap((day, dayIndex) => 
  WEEKDAY_PROGRAMS_TEMPLATE.map((prog, progIndex) => ({
    id: `${day}-${progIndex}`,
    show_name: prog.show_name,
    presenter_name: prog.presenter_name,
    presenter_role: 'Host',
    day_of_week: day,
    start_time: prog.start_time,
    end_time: prog.end_time,
    category: prog.category,
    description: prog.description,
    is_live_broadcast: true
  }))
);

export const mockLiveBlog: LiveBlogData = {
  id: 201,
  title: 'LIVE: Lira City Council Special Sitting on 2026/27 Urban Infrastructure Budget & Road Upgrades',
  slug: 'live-lira-city-council-budget-sitting-2026',
  summary: 'Live minute-by-minute reporting from the Lira City Hall chamber as the Mayor and Councilors debate the UGX 38 Billion municipal development budget.',
  event_location: 'Lira City Hall, Oyam Road',
  is_active: true,
  started_at: '2026-08-20T10:00:00+03:00',
  updates: [
    {
      id: 5,
      live_blog_id: 201,
      author: {
        id: 1,
        name: 'Sarah Awor',
        designation: 'Senior Editor & City Hall Reporter',
        avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      },
      title: 'Mayor Tables UGX 12.4 Billion Allocation for Solar Street Lighting & Drainage',
      content: 'The City Mayor has just stepped up to the podium, officially detailing the infrastructure envelope. Key line items include 450 new LED solar street poles along Obote Avenue, Soroti Road, and Bala Road.',
      is_pinned: true,
      is_key_event: true,
      published_at: '2026-08-20T14:45:00+03:00'
    },
    {
      id: 4,
      live_blog_id: 201,
      author: {
        id: 2,
        name: 'Okello Moses',
        designation: 'Civic Correspondent',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
      title: 'Traders Delegation Submits Petition on Market Stall Licence Fees',
      content: 'Representatives from the Lira Central Market Vendors Union have submitted a formal petition calling for a 15% reduction in monthly lock-up rental fees during wet months.',
      is_pinned: false,
      is_key_event: false,
      published_at: '2026-08-20T13:20:00+03:00'
    },
    {
      id: 3,
      live_blog_id: 201,
      author: {
        id: 1,
        name: 'Sarah Awor',
        designation: 'Senior Editor',
        avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      },
      title: 'Quorum Verified: 28 Councilors in Attendance',
      content: 'The City Speaker confirmed full quorum with representatives from Lira City East and West divisions actively present.',
      is_pinned: false,
      is_key_event: true,
      published_at: '2026-08-20T10:15:00+03:00'
    }
  ]
};


  export const mockWeatherData: WeatherData = {
  city: 'Lira City',
  region: 'Northern Uganda',
  temperature_celsius: 29,
  condition: 'Partly Sunny',
  humidity: '58%',
  wind_speed: '12 km/h',
  forecast_icon: 'sun-cloud',
};

export const mockCurrencyRates: CurrencyRate[] = [
  { pair: 'USD / UGX', rate: '3,842.50', change: '+0.15%', trend: 'up' },
  { pair: 'EUR / UGX', rate: '4,152.00', change: '-0.08%', trend: 'down' },
  { pair: 'GBP / UGX', rate: '4,895.00', change: '+0.22%', trend: 'up' },
  { pair: 'KES / UGX', rate: '29.85', change: '+0.05%', trend: 'up' },
];
