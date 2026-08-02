import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const read = path => readFileSync(path,'utf8');
const required = [
  'data.js','data-enrichment.js','catalog-baseline.js','storage.js','app.js','package-enhancer.js','booking-form.js','public-cleanup.js',
  'approved-home.js','approved-home.css','truthful-guides.js','legacy-studio.html',
  'cms.js','cms-booking-fields.js','admin/index.html','index.html','package.html','netlify.toml','styles.css','cms-enhancements.css','client-ready.css',
  'seo-content-data.js','seo-content.js','seo-content.css','seo-content-cms.js','seo-content-cms.css',
  'dhow-cruise-dubai/index.html','dubai-canal-cruise/index.html','dubai-marina-cruise/index.html','dubai-creek-cruise/index.html','new-year-dubai-cruise/index.html'
];
for (const file of required) read(file);
for (const file of ['data.js','data-enrichment.js','catalog-baseline.js','storage.js','app.js','package-enhancer.js','booking-form.js','public-cleanup.js','approved-home.js','truthful-guides.js','cms.js','cms-booking-fields.js','seo-content-data.js','seo-content.js','seo-content-cms.js']) {
  execFileSync(process.execPath,['--check',file],{stdio:'inherit'});
}

const data = read('data.js');
const baseline = read('catalog-baseline.js');
const booking = read('booking-form.js');
const customer = read('approved-home.js');
const truthful = read('truthful-guides.js');
const cms = read('cms.js') + read('cms-booking-fields.js') + read('seo-content-cms.js');
const seo = read('seo-content-data.js');
const admin = read('admin/index.html');
const netlify = read('netlify.toml');
const home = read('index.html');
const legacy = read('legacy-studio.html');
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

for (const publicFeature of ['data-approved-home','approvedQuickForm','approvedCategoryGrid','approvedPackageGrid','A Simpler Way to Book Dubai Experiences','Dubai New Year 2027 Cruise Updates','application/ld+json','approved-home.js']) {
  if (!home.includes(publicFeature)) throw new Error(`Missing approved homepage feature: ${publicFeature}`);
}
if (home.includes('src="app.js"') || home.includes('href="admin') || home.includes('4.8') || home.includes('1,250+')) {
  throw new Error('Approved homepage exposes the old dashboard, admin, or unverified ratings.');
}
for (const customerFeature of ['requestedCategory','generate_lead','approvedExperience','renderPackages','wa.me']) {
  if (!customer.includes(customerFeature)) throw new Error(`Missing customer homepage behavior: ${customerFeature}`);
}
if (!legacy.includes('noindex,nofollow,noarchive') || !legacy.includes('src="app.js"')) throw new Error('The old website studio is not safely preserved.');
if (details.includes('product-longform.js')) throw new Error('Package page still loads duplicated long-form sections.');
if (!details.includes('package-enhancer.js') || !details.includes('booking-form.js')) throw new Error('Package detail and booking flow are missing.');

for (const truthFeature of ['dubai-creek-cruise','new-year-dubai-cruise','.ref-save','startsWith(\'★\')','Verified information only']) {
  if (!truthful.includes(truthFeature)) throw new Error(`Missing truthful guide rule: ${truthFeature}`);
}
for (const slug of ['dhow-cruise-dubai','dubai-canal-cruise','dubai-marina-cruise','dubai-creek-cruise','new-year-dubai-cruise']) {
  const page = read(`${slug}/index.html`);
  if (!page.includes(`data-seo-page="${slug}"`) || !page.includes('truthful-guides.js')) throw new Error(`Guide page is missing truthful public handling: ${slug}`);
}
if (!admin.includes('../cms.js') || !admin.includes('../cms-booking-fields.js') || !admin.includes('../seo-content-cms.js')) throw new Error('Hidden /admin route is not connected to CMS controls.');
if (!netlify.includes('from = "/admin"') || !netlify.includes('noindex')) throw new Error('Hidden admin routing or headers are missing.');

console.log('QA passed: approved customer homepage, preserved old studio, truthful guides, booking flow and hidden CMS verified.');
