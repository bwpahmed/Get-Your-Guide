import { readFileSync } from 'node:fs';

const appParts = [1, 2, 3, 4].map((number) => readFileSync(`app-part-${number}.txt`, 'utf8'));
const source = appParts.join('');
new Function('data', source);

const css = [1, 2, 3, 4].map((number) => readFileSync(`styles-part-${number}.css`, 'utf8')).join('');
if ((css.match(/{/g) || []).length !== (css.match(/}/g) || []).length) {
  throw new Error('CSS braces are not balanced');
}

const required = [
  'Compare before you book',
  'Control the whole website without editing code',
  'Basic',
  'Premium',
  'Private Charter',
  'Book on WhatsApp'
];
for (const phrase of required) {
  if (!source.includes(phrase)) throw new Error(`Missing required website feature: ${phrase}`);
}

for (const file of ['data.js', 'storage.js', 'admin.js', 'app.js']) {
  const text = readFileSync(file, 'utf8');
  if (!text.trim()) throw new Error(`${file} is empty`);
}

console.log('Get Your Guide QA passed: runtime syntax, design modules, CMS files and CSS integrity verified.');
