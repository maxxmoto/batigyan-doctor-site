import { readFileSync } from 'fs';
const h = readFileSync('dist/index.html', 'utf8');
const i = h.indexOf('opt/главныйэкран-cut.webp');
console.log('preload context:', h.slice(Math.max(0, i - 80), i + 40));
const app = readFileSync('src/App.tsx', 'utf8');
const m = app.match(/DOCTOR_PHOTO}[^]*fetchPriority="high"[^]*?\/>/);
console.log('hero img snippet present:', !!m);
console.log('hero img has loading lazy?', /DOCTOR_PHOTO}[^]*loading="lazy"/.test(app));