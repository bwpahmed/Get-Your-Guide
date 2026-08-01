import { loadData } from './storage.js';

const parts = ['app-part-1.txt','app-part-2.txt','app-part-3.txt','app-part-4.txt'];
const source = (await Promise.all(parts.map(async (path) => {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Unable to load ${path}`);
  return response.text();
}))).join('');
new Function('data', `${source}\n//# sourceURL=get-your-guide-site.js`)(loadData());
