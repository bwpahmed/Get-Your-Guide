import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const read = path => readFileSync(path,'utf8');
const required = [
  'data.js','data-enrichment.js','catalog-baseline.js','storage.js','app.js','package-enhancer.js','booking-form.js','public-cleanup.js',
  'cms.js','cms-booking-fields.js','admin/index.html','index.html','package.html','netlify.toml','styles.css','cms-enhancements.css','client-ready.css'
];
for (const file of required) read(file);
for (const file of ['data.js','data-enrichment.js','catalog-baseline.js','storage.js','app.js','package-enhancer.js','booking-form.js','public-cleanup.js','cms.js','cms-booking-fields.js']) {
  execFileSync(process.execPath,['--check',file],{stdio:'inherit'});
}

const data = read('data.js');
const baseline = read('catalog-baseline.js');
const booking = read('booking-form.js');
const cms = read('cms.js') + read('cms-booking-fields.js');
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
if (!admin.includes('../cms.js') || !admin.includes('../cms-booking-fields.js')) throw new Error('Hidden /admin route is not connected to complete CMS controls.');
if (!netlify.includes('from = "/admin"') || !netlify.includes('noindex')) throw new Error('Hidden admin routing or headers are missing.');
if (!home.includes('booking-form.js') || !home.includes('package-enhancer.js') || home.includes('href="admin')) throw new Error('Homepage is missing the client-ready flow or exposes admin.');
if (!details.includes('booking-form.js') || !details.includes('package-enhancer.js')) throw new Error('Package page is missing complete information or booking form.');
console.log('QA passed: media, selected-package information, booking form, lead tracking and hidden CMS controls verified.');
