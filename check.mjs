import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const read = path => readFileSync(path,'utf8');
const required = [
  'data.js','data-enrichment.js','catalog-baseline.js','storage.js','app.js','package-enhancer.js','booking-form.js','public-cleanup.js',
  'cms.js','cms-booking-fields.js','admin/index.html','index.html','package.html','netlify.toml','styles.css','cms-enhancements.css','client-ready.css',
  'seo-content-data.js','seo-content.js','seo-content.css','seo-content-cms.js','seo-content-cms.css',
  'dhow-cruise-dubai/index.html','dubai-canal-cruise/index.html','dubai-marina-cruise/index.html','dubai-creek-cruise/index.html','new-year-dubai-cruise/index.html'
];
for (const file of required) read(file);
for (const file of ['data.js','data-enrichment.js','catalog-baseline.js','storage.js','app.js','package-enhancer.js','booking-form.js','public-cleanup.js','cms.js','cms-booking-fields.js','seo-content-data.js','seo-content.js','seo-content-cms.js']) {
  execFileSync(process.execPath,['--check',file],{stdio:'inherit'});
}

const data = read('data.js');
const baseline = read('catalog-baseline.js');
const booking = read('booking-form.js');
const cms = read('cms.js') + read('cms-booking-fields.js') + read('seo-content-cms.js');
const seo = read('seo-content-data.js');
const admin = read('admin/index.html');
const netlify = read('netlify.toml');
const home = read('index.html');
const details = read('package.html');

for (const level of ['Basic','Economy','Standard','Premium','Luxury','4-Star','5-Star','Private Charter']) {
  if (!data.includes(level) || !baseline.includes(level)) throw new Error(`Missing package level: ${level}`);
}
for (const price of ['Basic:39','Economy:49','Standard:59','offerPrice: 29','offerPrice: 49','offerPrice: 89','offerPrice: 199','offerPrice: 599']) {
  if (!baseline.includes(price) && !data.includes(price)) throw new Error(`Missing package price baseline: ${price}`);
}
for (const media of ['photos/18646649','photos/29561720','photos/32119557','photos/12565188']) {
  if (!baseline.includes(media)) throw new Error(`Missing cruise or safari media: ${media}`);
}
for (const field of ['date','time','adults','children','infants','pickupLocation','addon','name','phone','consent']) {
  if (!booking.includes(`name=\"${field}\"`) && !booking.includes(`name="${field}"`)) throw new Error(`Missing booking form field: ${field}`);
}
for (const feature of ['generate_lead','utm_source','gclid','wa.me','Estimated total']) {
  if (!booking.includes(feature)) throw new Error(`Missing advertising or booking feature: ${feature}`);
}
for (const field of ['upperDeckCharge','pickupPrice','bookingNotice','conversionLabel']) {
  if (!cms.includes(field)) throw new Error(`Missing editable CMS booking field: ${field}`);
}
for (const heading of ['Best Dinner Cruises & Tours in Dubai','Need Help Choosing?','Group Discounts Available!','The Ultimate Guide to Dubai Dhow Cruise','Why Choose Our New Year Packages?','Important Information & Policies','Entertainment Options on Dubai Canal Cruise']) {
  if (!seo.includes(heading)) throw new Error(`Missing SEO content heading: ${heading}`);
}
for (const slug of ['dhow-cruise-dubai','dubai-canal-cruise','dubai-marina-cruise','dubai-creek-cruise','new-year-dubai-cruise']) {
  if (!read(`${slug}/index.html`).includes(`data-seo-page="${slug}"`)) throw new Error(`Missing SEO landing page: ${slug}`);
}
if (!admin.includes('../cms.js') || !admin.includes('../cms-booking-fields.js') || !admin.includes('../seo-content-cms.js')) throw new Error('Hidden /admin route is not connected to complete CMS controls.');
if (!netlify.includes('from = "/admin"') || !netlify.includes('noindex')) throw new Error('Hidden admin routing or headers are missing.');
if (!home.includes('booking-form.js') || !home.includes('package-enhancer.js') || !home.includes('seo-content.js') || home.includes('href="admin')) throw new Error('Homepage is missing client-ready or SEO content, or exposes admin.');
if (!details.includes('booking-form.js') || !details.includes('package-enhancer.js')) throw new Error('Package page is missing complete information or booking form.');
console.log('QA passed: media, package details, booking flow, SEO content hub, landing pages and hidden CMS controls verified.');
