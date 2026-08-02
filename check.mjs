import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const read = path => readFileSync(path,'utf8');
const required = [
  'data.js','data-enrichment.js','catalog-baseline.js','storage.js','app.js','app-part-1.txt','app-part-2.txt','app-part-3.txt','app-part-4.txt',
  'package-enhancer.js','booking-form.js','public-cleanup.js','home-sections.js','home-actions.js','home-sections.css','home-cruise-extras.js','home-cruise-extras.css',
  'home-category-links.js','home-category-links.css','hero-slider.js','hero-slider.css','site-chrome.js','site-chrome.css','truthful-guides.js','desert-safari-page.js',
  'cms.js','cms-booking-fields.js','admin/index.html','index.html','package.html','netlify.toml','styles.css','cms-enhancements.css','client-ready.css',
  'seo-content-data.js','seo-content.js','seo-content.css','seo-content-cms.js','seo-content-cms.css','booking-policies/index.html',
  'dhow-cruise-dubai/index.html','dubai-canal-cruise/index.html','dubai-marina-cruise/index.html','dubai-creek-cruise/index.html','new-year-dubai-cruise/index.html','desert-safari-dubai/index.html'
];
for (const file of required) read(file);
for (const file of ['data.js','data-enrichment.js','catalog-baseline.js','storage.js','app.js','package-enhancer.js','booking-form.js','public-cleanup.js','home-sections.js','home-actions.js','home-cruise-extras.js','home-category-links.js','hero-slider.js','site-chrome.js','truthful-guides.js','desert-safari-page.js','cms.js','cms-booking-fields.js','seo-content-data.js','seo-content.js','seo-content-cms.js']) {
  execFileSync(process.execPath,['--check',file],{stdio:'inherit'});
}

const data = read('data.js');
const baseline = read('catalog-baseline.js');
const booking = read('booking-form.js');
const home = read('index.html');
const homeSections = read('home-sections.js');
const homeExtras = read('home-cruise-extras.js');
const categoryLinks = read('home-category-links.js');
const slider = read('hero-slider.js');
const chrome = read('site-chrome.js');
const chromeStyles = read('site-chrome.css');
const details = read('package.html');
const appPart1 = read('app-part-1.txt');
const appPart2 = read('app-part-2.txt');
const cms = read('cms.js') + read('cms-booking-fields.js') + read('seo-content-cms.js');
const netlify = read('netlify.toml');

for (const level of ['Basic','Economy','Standard','Premium','Luxury','4-Star','5-Star','Private Charter']) {
  if (!data.includes(level) || !baseline.includes(level)) throw new Error(`Missing package level: ${level}`);
}
for (const field of ['date','time','adults','children','infants','pickupLocation','addon','name','phone','consent']) {
  if (!booking.includes(`name=\"${field}\"`) && !booking.includes(`name="${field}"`)) throw new Error(`Missing package booking form field: ${field}`);
}
for (const feature of ['generate_lead','utm_source','gclid','wa.me','Estimated total']) {
  if (!booking.includes(feature)) throw new Error(`Missing advertising or package booking feature: ${feature}`);
}

if (!appPart1.includes('Choose the right experience without guessing.')) throw new Error('Original homepage hero was changed or removed.');
if (!appPart2.includes('Experience first, package levels second') || !appPart2.includes('Everything important is visible before booking')) throw new Error('Original homepage sections are missing.');
if (!appPart2.includes("const siblings = visiblePackages().filter((entry) => entry.categoryId === item.categoryId)")) throw new Error('Package tier switcher is not restricted to the selected category.');

for (const component of ['home-second-hero','home-quick-form','home-package-options','home-numbered-section','home-simple-section','home-help-grid','home-guide-section']) {
  if (!homeSections.includes(component)) throw new Error(`Missing confirmed homepage component: ${component}`);
}
for (const heading of ['Best Dinner Cruises & Tours in Dubai','Clear Information Before the Experience','A Simpler Way to Book Dubai Experiences','Need Help Choosing?','Group Discounts Available!','The Ultimate Guide to Dubai Dhow Cruise']) {
  if (!homeSections.includes(heading)) throw new Error(`Missing confirmed homepage heading: ${heading}`);
}
for (const heading of ['Dinner Menu Highlights','Celebrate in Style on a Dubai Cruise']) {
  if (!homeExtras.includes(heading)) throw new Error(`Missing homepage cruise section: ${heading}`);
}
for (const category of ['Dubai Canal Cruises','Dubai Marina Cruises','Dubai Creek Cruises','New Year Cruises','Desert Safari']) {
  if (!categoryLinks.includes(category)) throw new Error(`Missing homepage category: ${category}`);
}
for (const route of ['/dubai-canal-cruise/','/dubai-marina-cruise/','/dubai-creek-cruise/','/new-year-dubai-cruise/','/desert-safari-dubai/']) {
  if (!categoryLinks.includes(route)) throw new Error(`Missing homepage category route: ${route}`);
}
if (categoryLinks.includes('Private Yacht Charter')) throw new Error('Yacht is still displayed in the confirmed five-card homepage category row.');

for (const feature of ['AUTOPLAY_DELAY','home-hero-slider-track','data-hero-slide','pointerdown','prefers-reduced-motion']) {
  if (!slider.includes(feature)) throw new Error(`Missing hero slider feature: ${feature}`);
}

for (const item of ['Canal','Marina','Creek','New Year','Desert Safari','Compare Packages','Booking Policies','Ameerat Al Bahr Floating Restaurant L.L.C.','global-menu-toggle','global-site-footer']) {
  if (!chrome.includes(item)) throw new Error(`Incomplete shared header/footer: ${item}`);
}
if (chrome.includes('href="admin') || chrome.includes('/admin/')) throw new Error('Shared public header/footer exposes admin.');
if (!chromeStyles.includes('.global-site-footer{margin-top:70px;background:#f4f7fb') || !chromeStyles.includes('.global-footer-bottom{border-top:1px solid var(--chrome-line);background:#fff}')) throw new Error('Footer is not using the approved light blue and white design.');

if (!cms.includes("field('featured','Featured package'") || !cms.includes("'heroImage'")) throw new Error('CMS cannot control featured packages or the hero image.');
if (!home.includes('app.js') || !home.includes('home-sections.js') || !home.includes('home-cruise-extras.js') || !home.includes('home-category-links.js') || !home.includes('hero-slider.js') || !home.includes('site-chrome.js')) throw new Error('Homepage is missing the original app or confirmed extensions.');
if (home.includes('approved-home.js') || home.includes('approved-home.css') || home.includes('seo-content.js')) throw new Error('Unapproved replacement homepage code is still loaded.');
if (home.includes('href="admin')) throw new Error('Public homepage exposes admin.');

if (!details.includes('app.js') || !details.includes('package-enhancer.js') || !details.includes('booking-form.js') || !details.includes('site-chrome.js')) throw new Error('Original package detail layout, booking form or shared chrome is missing.');
if (details.includes('product-longform.js')) throw new Error('Package page still loads duplicated long-form content.');

for (const slug of ['dubai-canal-cruise','dubai-marina-cruise','dubai-creek-cruise','new-year-dubai-cruise']) {
  const page = read(`${slug}/index.html`);
  if (!page.includes(`data-seo-page="${slug}"`) || !page.includes('../seo-content.js') || !page.includes('../truthful-guides.js') || !page.includes('../site-chrome.js')) {
    throw new Error(`Approved landing page or shared header/footer is missing: ${slug}`);
  }
}
const safariPage = read('desert-safari-dubai/index.html');
const safariRenderer = read('desert-safari-page.js');
if (!safariPage.includes('../desert-safari-page.js') || !safariPage.includes('../site-chrome.js') || !safariRenderer.includes("categoryId === 'safari'") || !safariRenderer.includes('Dubai Desert Safari Packages')) throw new Error('Complete Desert Safari landing page or shared chrome is missing.');
if (!read('dhow-cruise-dubai/index.html').includes('../site-chrome.js')) throw new Error('Cruise guide is missing shared header/footer.');
if (!read('booking-policies/index.html').includes('Cancellation & Refund') || !read('booking-policies/index.html').includes('../site-chrome.js')) throw new Error('Linked booking policy page is incomplete.');
if (!read('truthful-guides.js').includes('Verified Dubai Creek Packages') || !read('truthful-guides.js').includes('New Year 2027 Packages')) throw new Error('Truthful Creek and New Year behavior is missing.');

if (!netlify.includes('from = "/admin"') || !netlify.includes('noindex')) throw new Error('Hidden admin routing or headers are missing.');
console.log('QA passed: light footer, dinner menu, cruise celebrations, hero slider, shared header/footer and landing pages verified.');
