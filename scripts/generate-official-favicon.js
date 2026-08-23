const sharp = require('sharp');
const fs = require('fs');

async function createOfficialFavicons() {
  const logoPath = 'public/unity-tv-logo.png';
  
  // Create 512x512 master square canvas with the official logo centered
  const logoBuffer = await sharp(logoPath).resize({ width: 490, fit: 'inside' }).toBuffer();

  const square512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 } // transparent
    }
  })
  .composite([{ input: logoBuffer, gravity: 'center' }])
  .png()
  .toBuffer();

  // 1. icon-512.png
  await sharp(square512).resize(512, 512).toFile('public/icon-512.png');
  await sharp(square512).resize(512, 512).toFile('public/icon.png');

  // 2. icon-192.png
  await sharp(square512).resize(192, 192).toFile('public/icon-192.png');
  await sharp(square512).resize(192, 192).toFile('src/app/icon.png');

  // 3. apple-touch-icon.png
  // For Apple Touch Icon, use a clean subtle dark background so it renders gorgeously on iOS
  const appleLogoBuffer = await sharp(logoPath).resize({ width: 160, fit: 'inside' }).toBuffer();
  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 17, g: 17, b: 17, alpha: 1 } // #111111 dark background for iOS home screens
    }
  })
  .composite([{ input: appleLogoBuffer, gravity: 'center' }])
  .png()
  .toFile('public/apple-touch-icon.png');

  await sharp('public/apple-touch-icon.png').toFile('src/app/apple-icon.png');

  // 4. favicon-32x32.png and favicon-16x16.png
  await sharp(square512).resize(32, 32).png().toFile('public/favicon-32x32.png');
  await sharp(square512).resize(16, 16).png().toFile('public/favicon-16x16.png');

  // 5. favicon.ico
  await sharp(square512).resize(32, 32).toFile('public/favicon.ico');

  // 6. SVG wrapper referencing the official logo
  const svgFavicon = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <image href="/unity-tv-logo.png" x="6" y="180" width="500" height="152"/>
</svg>`;
  fs.writeFileSync('public/icon.svg', svgFavicon);

  console.log('Official Unity TV Logo favicons successfully generated across all resolutions!');
}

createOfficialFavicons().catch(console.error);
