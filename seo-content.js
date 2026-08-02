import { loadSeoContent } from './seo-content-data.js';

const content = loadSeoContent();
const esc = (value = '') => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

function renderLinks(links = []) {
  return links.length ? `<div class="seo-link-row">${links.map(link => `<a href="${esc(link.href)}">${esc(link.label)}</a>`).join('')}</div>` : '';
}

function renderSection(section, index) {
  if (section.visible === false) return '';
  return `<article class="seo-content-card ${section.type === 'list' ? 'seo-list-card' : ''}">
    <span class="seo-section-number">${String(index + 1).padStart(2,'0')}</span>
    <div>
      <h2>${esc(section.title)}</h2>
      ${section.body ? `<p>${esc(section.body)}</p>` : ''}
      ${section.items?.length ? `<ul>${section.items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}
      ${renderLinks(section.links)}
    </div>
  </article>`;
}

function pageMarkup(page, compact = false) {
  const sections = (page.sections || []).filter(section => section.visible !== false);
  return `<section class="seo-content-shell ${compact ? 'seo-content-home' : 'seo-content-page'}" data-seo-content="${esc(page.slug)}">
    <header class="seo-content-hero">
      <div>
        <p class="eyebrow">${esc(page.eyebrow || 'Dubai experience guide')}</p>
        <h1>${esc(page.title)}</h1>
        <p>${esc(page.intro || '')}</p>
      </div>
      ${page.ctaLabel ? `<a class="primary seo-content-cta" href="${esc(page.ctaHref || '/#packages')}">${esc(page.ctaLabel)}</a>` : ''}
    </header>
    ${compact ? `<nav class="seo-guide-nav" aria-label="Detailed cruise guides">
      <a href="/dhow-cruise-dubai/">Dhow Cruise Guide</a>
      <a href="/dubai-canal-cruise/">Canal</a>
      <a href="/dubai-marina-cruise/">Marina</a>
      <a href="/dubai-creek-cruise/">Creek</a>
      <a href="/new-year-dubai-cruise/">New Year</a>
    </nav>` : ''}
    <div class="seo-content-grid">${sections.map(renderSection).join('')}</div>
    ${!compact ? `<footer class="seo-page-footer"><a href="/">← Back to all packages</a><a href="/#packages">Compare packages</a></footer>` : ''}
  </section>`;
}

function renderLandingPage() {
  const slug = document.body.dataset.seoPage;
  const page = content[slug];
  const root = document.querySelector('#seo-page-root');
  if (!page || !root) return false;
  root.innerHTML = pageMarkup(page, false);
  document.title = `${page.title} | Get Your Guide Dubai`;
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.append(meta); }
  meta.content = page.intro;
  return true;
}

function renderHomeContent() {
  if (document.querySelector('[data-seo-content="home"]')) return;
  const overview = document.querySelector('#view-overview, [data-view-panel="overview"], .view.active, main');
  if (!overview) return;
  const holder = document.createElement('div');
  holder.innerHTML = pageMarkup(content.home, true);
  overview.append(holder.firstElementChild);
}

if (!renderLandingPage()) {
  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; renderHomeContent(); });
  };
  new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
  queue();
  setTimeout(queue,200);
  setTimeout(queue,800);
}
