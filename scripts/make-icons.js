const sharp = require('sharp');
const fs = require('fs');

const svgFavicon = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181b"/>
      <stop offset="100%" stop-color="#09090b"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE066"/>
      <stop offset="50%" stop-color="#FFC20E"/>
      <stop offset="100%" stop-color="#D49B00"/>
    </linearGradient>
    <linearGradient id="crimsonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#DC2626"/>
      <stop offset="100%" stop-color="#8B0000"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background rounded squircle -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  <rect x="8" y="8" width="496" height="496" rx="104" stroke="url(#goldGrad)" stroke-width="12" stroke-opacity="0.4" fill="none"/>

  <!-- Broadcast Signal Arcs / Radio Waves -->
  <path d="M136 180 C 180 120, 332 120, 376 180" stroke="url(#goldGrad)" stroke-width="24" stroke-linecap="round" fill="none" opacity="0.9" filter="url(#glow)"/>
  <path d="M176 220 C 206 178, 306 178, 336 220" stroke="url(#goldGrad)" stroke-width="20" stroke-linecap="round" fill="none" opacity="0.75"/>

  <!-- Main U Letterform with Broadcast Geometry -->
  <path d="M176 250 L176 330 C 176 390, 336 390, 336 330 L336 250" stroke="url(#goldGrad)" stroke-width="42" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

  <!-- Live Pulse Dot in Center -->
  <circle cx="256" cy="270" r="26" fill="url(#crimsonGrad)" filter="url(#glow)"/>
  <circle cx="256" cy="270" r="14" fill="#FFFFFF"/>

  <!-- TV Sub-Badge -->
  <rect x="216" y="410" width="80" height="32" rx="8" fill="url(#crimsonGrad)"/>
  <text x="256" y="432" font-family="Impact, Arial Black, sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">TV</text>
</svg>`;

if (!fs.existsSync('scripts')) {
  fs.mkdirSync('scripts');
}

fs.writeFileSync('src/app/icon.svg', svgFavicon);
fs.writeFileSync('public/icon.svg', svgFavicon);

const buffer = Buffer.from(svgFavicon);

async function generateIcons() {
  // 1. icon-512.png
  await sharp(buffer).resize(512, 512).png().toFile('public/icon-512.png');
  // 2. icon-192.png
  await sharp(buffer).resize(192, 192).png().toFile('public/icon-192.png');
  // 3. apple-icon.png
  await sharp(buffer).resize(180, 180).png().toFile('src/app/apple-icon.png');
  await sharp(buffer).resize(180, 180).png().toFile('public/apple-touch-icon.png');
  // 4. favicon-32x32.png
  await sharp(buffer).resize(32, 32).png().toFile('public/favicon-32x32.png');
  // 5. favicon-16x16.png
  await sharp(buffer).resize(16, 16).png().toFile('public/favicon-16x16.png');
  // 6. favicon.ico
  await sharp(buffer).resize(32, 32).png().toFile('public/favicon.ico');
  await sharp(buffer).resize(32, 32).png().toFile('src/app/favicon.ico');

  console.log('All favicon and app icon files created successfully!');
}

generateIcons().catch(console.error);
