import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const read = path => readFileSync(path,'utf8');
const required = [
  'data.js','data-enrichment.js','catalog-baseline.js','storage.js','app.js','package-enhancer.js','booking-form.js','product-longform.js','public-cleanup.js',
  'cms.js','cms-booking-fields.js','admin/index.html','index.html','package.html','netlify.toml','styles.css','cms-enhancements.css','client-ready.css',
  'seo-content-data.js','seo-content.js','seo-content.css','seo-content-cms.js','seo-content-cms.css',
  'dhow-cruise-dubai/index.html','dubai-canal-cruise/index.html','dubai-marina-cruise/index.html','dubai-creek-cruise/index.html','new-year-dubai-cruise/index.html'
];
for (const file of required) read(file);
for (const file of ['data.js','data-enrichment.js','catalog-baseline.js','storage.js','app.js','package-enhancer.js','booking-form.js','product-longform.js','public-cleanup.js','cms.js','cms-booking-fields.js','seo-content-data.js','seo-content.js','seo-content-cms.js']) {
  execFileSync(process.execPath,['--check',file],{stdio:'inherit'});
}

const data = read('data.js');
const baseline = read('catalog-baseline.js');
const booking = read('booking-form.js');
const product = read('product-longform.js');
const renderer = read('seo-content.js');
const styling = read('seo-content.css');
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
for (const component of ['ref-hero','ref-package-grid','ref-menu-grid','ref-step-grid','ref-season-grid','ref-deck-grid','ref-entertainment-grid','ref-faq-list']) {
  if (!renderer.includes(component) && !styling.includes(component)) throw new Error(`Missing commercial landing component: ${component}`);
}
for (const productSection of ['Why Choose','What\'s Included','Food Menu & Refreshments','Important Information & Policies','Frequently Asked Questions']) {
  if (!product.includes(productSection)) throw new Error(`Missing product landing section: ${productSection}`);
}
for (const slug of ['dhow-cruise-dubai','dubai-canal-cruise','dubai-marina-cruise','dubai-creek-cruise','new-year-dubai-cruise']) {
  if (!read(`${slug}/index.html`).includes(`data-seo-page="${slug}"`)) throw new Error(`Missing SEO landing page: ${slug}`);
}
if (!admin.includes('../cms.js') || !admin.includes('../cms-booking-fields.js') || !admin.includes('../seo-content-cms.js')) throw new Error('Hidden /admin route is not connected to complete CMS controls.');
if (!netlify.includes('from = "/admin"') || !netlify.includes('noindex')) throw new Error('Hidden admin routing or headers are missing.');
if (!home.includes('booking-form.js') || !home.includes('package-enhancer.js') || !home.includes('seo-content.js') || home.includes('href="admin')) throw new Error('Homepage is missing client-ready or commercial guide content, or exposes admin.');
if (!details.includes('booking-form.js') || !details.includes('package-enhancer.js') || !details.includes('product-longform.js') || !details.includes('seo-content.css')) throw new Error('Package page is missing the complete commercial detail flow.');
console.log('QA passed: complete commercial landing pages, package-specific long-form content, booking flow and CMS controls verified.');
