import { loadSeoContent } from './seo-content-data.js';

const seo = loadSeoContent();
const slug = document.body.dataset.seoPage;
const root = document.querySelector('#seo-page-root');
const titles = {
  'dubai-canal-cruise':'The Ultimate Guide to Dubai Canal Cruise',
  'dubai-marina-cruise':'The Ultimate Guide to Dubai Marina Cruise',
  'dubai-creek-cruise':'The Ultimate Guide to Dubai Creek Cruise',
  'new-year-dubai-cruise':'The Ultimate Guide to Dubai New Year Cruise',
  'dhow-cruise-dubai':'The Ultimate Guide to Dubai Dhow Cruise'
};
const intro = {
  'dubai-canal-cruise':'Review Canal routes, boarding, timings, menu, deck choices, attractions and package differences before booking.',
  'dubai-marina-cruise':'Review Marina routes, JBR and Bluewaters views, timings, menu, seating and package differences before booking.',
  'dubai-creek-cruise':'Review Creek boarding areas, heritage routes, timings, menu, seating and booking policies before choosing a package.',
  'new-year-dubai-cruise':'Review special-event routes, check-in, seating, menu, transport, payment and cancellation rules before booking.',
  'dhow-cruise-dubai':'Compare Canal, Marina and Creek routes with package-level, seating, food and booking guidance.'
};

if (root && titles[slug] && !root.querySelector('[data-landing-guide-footer]')) {
  const page = seo[slug] || {};
  const section = document.createElement('section');
  section.className = 'review-wrap home-guide-section landing-guide-footer';
  section.dataset.landingGuideFooter = slug;
  section.innerHTML = `<div><p class="eyebrow">Plan before you pay</p><h2>${titles[slug]}</h2><p>${intro[slug] || page.intro || ''}</p><a class="primary" href="#packages">View Packages</a></div><nav aria-label="Related Dubai experience guides"><a href="/dubai-canal-cruise/"><b>Dubai Canal Guide</b><span>→</span></a><a href="/dubai-marina-cruise/"><b>Dubai Marina Guide</b><span>→</span></a><a href="/dubai-creek-cruise/"><b>Dubai Creek Guide</b><span>→</span></a><a href="/new-year-dubai-cruise/"><b>New Year Guide</b><span>→</span></a><a href="/dhow-cruise-dubai/"><b>Dubai Dhow Cruise Guide</b><span>→</span></a><a href="/"><b>All Experiences</b><span>→</span></a></nav>`;
  root.append(section);
}
