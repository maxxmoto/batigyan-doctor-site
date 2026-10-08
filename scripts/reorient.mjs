import sharp from 'sharp';

const files = ['окб2фото.jfif', 'мцсемьятаймлайн.jfif', 'ординатура.JPG', 'главныйэкран.jpg'];

for (const f of files) {
  const out = f.replace(/\.[^.]+$/, '.webp');
  try {
    await sharp('public/' + f).rotate().webp({ quality: 80 }).toFile('public/' + out);
    console.log('OK', f, '->', out);
  } catch (e) {
    console.log('FAIL', f, e.message);
  }
}