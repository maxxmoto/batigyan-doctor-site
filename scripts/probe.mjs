import sharp from 'sharp';

const file = 'public/главныйэкран.webp';
const img = sharp(file);
const meta = await img.metadata();
const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

const px = (x, y) => {
  const i = (y * width + x) * channels;
  return [data[i], data[i + 1], data[i + 2], data[i + 3]];
};

const pts = {
  'tl': [2, 2],
  'tr': [width - 3, 2],
  'bl': [2, height - 3],
  'br': [width - 3, height - 3],
  'tc': [Math.floor(width / 2), 2],
  'bc': [Math.floor(width / 2), height - 3],
  'ml': [2, Math.floor(height / 2)],
  'mr': [width - 3, Math.floor(height / 2)],
};
console.log('size', width, height, 'ch', channels, 'alpha', meta.hasAlpha);
for (const [k, [x, y]] of Object.entries(pts)) {
  console.log(k, px(x, y));
}