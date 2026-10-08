import sharp from 'sharp';

const W = 1200;
const H = 630;

const bg = Buffer.from(
  `<svg width="${W}" height="${H}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0F766E"/><stop offset="1" stop-color="#14B8A6"/>
    </linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
  </svg>`
);

const overlay = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <text x="80" y="230" font-family="Inter,Arial,sans-serif" font-size="72" font-weight="900" fill="#ffffff">БАТИГЯН</text>
    <text x="80" y="310" font-family="Inter,Arial,sans-serif" font-size="72" font-weight="900" fill="#ffffff">ЭДУАРД</text>
    <text x="80" y="380" font-family="Inter,Arial,sans-serif" font-size="34" font-weight="700" fill="#D9F99D">ВРАЧ-ЭНДОСКОПИСТ</text>
    <text x="80" y="430" font-family="Inter,Arial,sans-serif" font-size="24" font-weight="500" fill="#E6FFFA">Ростов-на-Дону · запись онлайн</text>
  </svg>`
);

const doctor = sharp('public/opt/главныйэкран-cut.webp')
  .resize({ width: 560, height: 620, fit: 'cover' })
  .toBuffer();

const doctorBuf = await doctor;

await sharp(bg)
  .composite([
    { input: doctorBuf, top: 10, left: 640 },
    { input: overlay, top: 0, left: 0 },
  ])
  .webp({ quality: 82 })
  .toFile('public/opt/og-share.webp');

await sharp(bg)
  .composite([
    { input: doctorBuf, top: 10, left: 640 },
    { input: overlay, top: 0, left: 0 },
  ])
  .png()
  .toFile('public/opt/og-share.png');

console.log('og-share generated (webp + png)');