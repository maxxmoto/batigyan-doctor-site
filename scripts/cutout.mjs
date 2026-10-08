import { removeBackground } from '@imgly/background-removal-node';
import { writeFileSync } from 'fs';

const input = 'public/главныйэкран.webp';
const outPng = 'public/главныйэкран-cut.png';

try {
  const blob = await removeBackground(input, {
    output: { format: 'image/png' },
  });
  const buf = Buffer.from(await blob.arrayBuffer());
  writeFileSync(outPng, buf);
  console.log('OK written', outPng, buf.length);
} catch (e) {
  console.log('FAIL', e && e.message ? e.message : e);
}