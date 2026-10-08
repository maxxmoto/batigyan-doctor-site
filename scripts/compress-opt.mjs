import sharp from 'sharp';
import { mkdirSync } from 'fs';

const opt = 'public/opt';
mkdirSync(opt, { recursive: true });

const jobs = [
  ['public/окб2фото.webp', 'окб2фото.webp', 1200, 68],
  ['public/ординатура.webp', 'ординатура.webp', 900, 68],
  ['public/rostgmu.webp', 'rostgmu.webp', 900, 68],
  ['public/мцсемьятаймлайн.webp', 'мцсемьятаймлайн.webp', 900, 68],
  ['public/главныйэкран-cut.webp', 'главныйэкран-cut.webp', 1200, 72],
  ['public/logos/обк-2.webp', 'обк-2.webp', 256, 75],
  ['public/newlogobat.webp', 'newlogobat.webp', 400, 78],
  ['public/философия.webp', 'философия.webp', 720, 72],
  ['public/logos/napopravku.webp', 'napopravku.webp', 400, 78],
  ['public/logos/prodoctorov.webp', 'prodoctorov.webp', 400, 78],
  ['public/logos/мцсемья.webp', 'мцсемья.webp', 300, 78],
  ['public/полезныйконтент.webp', 'полезныйконтент.webp', 900, 72],
  ['public/фон.webp', 'фон.webp', 1600, 70],
  ['public/фонмобилка.webp', 'фонмобилка.webp', 1200, 70],
];

for (const [input, out, width, q] of jobs) {
  try {
    const buf = await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: q }).toBuffer();
    // write to temp then rename within same fresh dir (no locks)
    const tmp = `${opt}/${out}.tmp`;
    await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: q }).toFile(tmp);
    await (await import('fs/promises')).rename(tmp, `${opt}/${out}`);
    const before = (await (await import('fs')).promises.stat(input)).size;
    const size = buf.length;
    console.log(`${out}: ${(before / 1024).toFixed(0)} -> ${(size / 1024).toFixed(0)} KiB`);
  } catch (e) {
    console.log('FAIL', out, e.message);
  }
}