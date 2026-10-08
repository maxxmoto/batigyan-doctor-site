import sharp from 'sharp';
import { readdirSync, statSync, unlinkSync } from 'fs';
import path from 'path';

const dir = path.resolve('public');
const EXTS = ['.png', '.jpg', '.jpeg', '.jfif', '.JPG', '.PNG', '.jfif'];

function walk(d) {
  for (const e of readdirSync(d)) {
    const p = path.join(d, e);
    if (statSync(p).isDirectory()) {
      walk(p);
    } else {
      const ext = path.extname(e);
      if (EXTS.includes(ext)) {
        const out = p.slice(0, -ext.length) + '.webp';
        sharp(p, { failOn: 'none' })
          .webp({ quality: 80 })
          .toFile(out)
          .then(() => {
            unlinkSync(p);
            console.log('OK', p, '->', out);
          })
          .catch((err) => console.log('FAIL', p, err.message));
      }
    }
  }
}

walk(dir);