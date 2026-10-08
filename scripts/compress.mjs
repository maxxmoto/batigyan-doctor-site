import sharp from 'sharp';

const jobs = [
  ['public/окб2фото.webp', 1200, 68],
  ['public/ординатура.webp', 900, 68],
  ['public/rostgmu.webp', 900, 68],
  ['public/мцсемьятаймлайн.webp', 900, 68],
  ['public/главныйэкран-cut.webp', 1200, 72],
  ['public/logos/обк-2.webp', 256, 75],
  ['public/newlogobat.webp', 400, 78],
  ['public/философия.webp', 720, 72],
  ['public/logos/napopravku.webp', 400, 78],
  ['public/logos/prodoctorov.webp', 400, 78],
  ['public/logos/мцсемья.webp', 300, 78],
  ['public/полезныйконтент.webp', 900, 72],
  ['public/фон.webp', 1600, 70],
  ['public/фонмобилка.webp', 1200, 70],
];

for (const [file, width, q] of jobs) {
  try {
    const before = (await (await import('fs')).promises.stat(file)).size;
    await sharp(file)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: q })
      .toFile(file + '.tmp');
    const after = (await (await import('fs')).promises.stat(file + '.tmp')).size;
    await (await import('fs')).promises.rename(file + '.tmp', file);
    console.log(`${file.split('/').pop()}: ${(before / 1024).toFixed(0)} -> ${(after / 1024).toFixed(0)} KiB`);
  } catch (e) {
    console.log('FAIL', file, e.message);
  }
}