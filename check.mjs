import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const read = path => readFileSync(path,'utf8');
const required = [
  'data.js','data-enrichment.js','catalog-baseline.js','storage.js','app.js','app-part-1.txt','app-part-2.txt','app-part-3.txt','app-part-4.txt',
  'package-enhancer.js','booking-form.js','public-cleanup.js','home-sections.js','home-actions.js','home-sections.css','landing-guide-footer.js',
  'cms.js','cms-booking-fields.js','admin/index.html','index.html','package.html','netlify.toml','styles.css','cms-enhancements.css','client-ready.css',
  'seo-content-data.js','seo-content.js','seo-content.css','seo-content-cms.js','seo-content-cms.css',
  'dhow-cruise-dubai/index.html','dubai-canal-cruise/index.html','dubai-marina-cruise/index.html','dubai-creek-cruise/index.html','new-year-dubai-cruise/index.html'
];
for (const file of required) read(file);
for (const file of ['data.js','data-enrichment.js','catalog-baseline.js','storage.js','app.js','package-enhancer.js','booking-form.js','public-cleanup.js','home-sections.js','home-actions.js','landing-guide-footer.js','cms.js','cms-booking-fields.js','seo-content-data.js','seo-content.js','seo-content-cms.js']) {
  execFileSync(process.execPath,['--check',file],{stdio:'inherit'});
}

const data = read('data.js');
const baseline = read('catalog-baseline.js');
const booking = read('booking-form.js');
const home = read('index.html');
const homeSections = read('home-sections.js');
const homeStyles = read('home-sections.css');
const details = read('package.html');
const appPart1 = read('app-part-1.txt');
const appPart2 = read('app-part-2.txt');
const cms = read('cms.js') + read('cms-booking-fields.js') + read('seo-content-cms.js');
const seo = read('seo-content-data.js');
const admin = read('admin/index.html');
const netlify = read('netlify.toml');

for (const level of ['Basic','Economy','Standard','Premium','Luxury','4-Star','5-Star','Private Charter']) {
  if (!data.includes(level) || !baseline.includes(level)) throw new Error(`Missing package level: ${level}`);
}
for (const price of ['Basic:39','Economy:49','Standard:59','offerPrice: 29','offerPrice: 49','offerPrice: 89','offerPrice: 199','offerPrice: 599']) {
  if (!baseline.includes(price) && !data.includes(price)) throw new Error(`Missing package price baseline: ${price}`);
}
for (const field of ['date','time','adults','children','infants','pickupLocation','addon','name','phone','consent']) {
  if (!booking.includes(`name=\"${field}\"`) && !booking.includes(`name="${field}"`)) throw new Error(`Missing package booking form field: ${field}`);
}
for (const feature of ['generate_lead','utm_source','gclid','wa.me','Estimated total']) {
  if (!booking.includes(feature)) throw new Error(`Missing advertising or package booking feature: ${feature}`);
}

if (!appPart1.includes('Choose the right experience without guessing.')) throw new Error('Original homepage hero was changed or removed.');
if (!appPart2.includes('Experience first, package levels second') || !appPart2.includes('Everything important is visible before booking')) throw new Error('Original homepage architecture sections are missing.');
if (!appPart2.includes("const siblings = visiblePackages().filter((entry) => entry.categoryId === item.categoryId)")) throw new Error('Package detail tier switcher is not restricted to the selected category.');
if (!appPart2.includes('data-open-package')) throw new Error('Package tier selection controls are missing.');

for (const component of ['home-second-hero','home-quick-form','home-package-options','home-numbered-section','home-simple-section','home-help-grid','home-guide-section']) {
  if (!homeSections.includes(component) && !homeStyles.includes(component)) throw new Error(`Missing confirmed homepage component: ${component}`);
}
for (const heading of ['Best Dinner Cruises & Tours in Dubai','Clear Information Before the Experience','A Simpler Way to Book Dubai Experiences','Need Help Choosing?','Group Discounts Available!','The Ultimate Guide to Dubai Dhow Cruise']) {
  if (!homeSections.includes(heading) && !seo.includes(heading)) throw new Error(`Missing confirmed homepage heading: ${heading}`);
}
for (const behavior of ['site.packages.filter','data-home-booking-tab','homeExperience','data-home-package-filter','package.html?slug=','heroImage']) {
  if (!homeSections.includes(behavior)) throw new Error(`Missing dynamic homepage behavior: ${behavior}`);
}
if (!cms.includes("field('featured','Featured package'") || !cms.includes("'heroImage'")) throw new Error('CMS cannot control featured homepage packages or the hero image.');

if (!home.includes('app.js') || !home.includes('home-sections.js') || !home.includes('home-sections.css') || !home.includes('home-actions.js')) throw new Error('Homepage is not using the original app plus confirmed extensions.');
if (home.includes('approved-home.js') || home.includes('approved-home.css') || home.includes('seo-content.js')) throw new Error('Unapproved replacement homepage code is still loaded.');
if (home.includes('href="admin')) throw new Error('Public homepage exposes the admin route.');

if (!details.includes('app.js') || !details.includes('package-enhancer.js') || !details.includes('booking-form.js')) throw new Error('Original package detail layout or booking form is missing.');
if (details.includes('product-longform.js')) throw new Error('Package page still loads duplicated long-form content.');

for (const slug of ['dhow-cruise-dubai','dubai-canal-cruise','dubai-marina-cruise','dubai-creek-cruise','new-year-dubai-cruise']) {
  const page = read(`${slug}/index.html`);
  if (!page.includes(`data-seo-page="${slug}"`)) throw new Error(`Missing landing page: ${slug}`);
  if (!page.includes('../landing-guide-footer.js') || !page.includes('../home-sections.css')) throw new Error(`Missing category-specific guide footer on: ${slug}`);
}
if (!read('landing-guide-footer.js').includes('The Ultimate Guide to Dubai Canal Cruise') || !read('landing-guide-footer.js').includes('The Ultimate Guide to Dubai Marina Cruise')) throw new Error('Category-specific Ultimate Guide headings are missing.');

if (!admin.includes('../cms.js') || !admin.includes('../cms-booking-fields.js') || !admin.includes('../seo-content-cms.js')) throw new Error('Hidden /admin route is not connected to CMS controls.');
if (!netlify.includes('from = "/admin"') || !netlify.includes('noindex')) throw new Error('Hidden admin routing or headers are missing.');

console.log('QA passed: original layout preserved, confirmed homepage order added, filters use CMS package data, package details remain unchanged and landing guides are present.');
