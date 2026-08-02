import { loadData } from './storage.js';

const data = loadData();
const settings = data.settings || {};
const esc = (value = '') => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const digits = value => String(value || '').replace(/\D/g, '');
const phone = settings.supportPhone || '+971 55 439 7575';
const email = settings.supportEmail || 'dhowtrip@gmail.com';
const whatsapp = digits(settings.whatsappNumber || phone);
const brand = settings.brandName || 'Get Your Guide Dubai';
const tagline = settings.tagline || 'Dubai cruises and experiences, clearly compared.';
const headerEnabled = data.sections?.find(section => section.type === 'header')?.visible !== false;
const footerEnabled = data.sections?.find(section => section.type === 'footer')?.visible !== false;

const routes = [
  ['Home','/'],
  ['Canal','/dubai-canal-cruise/'],
  ['Marina','/dubai-marina-cruise/'],
  ['Creek','/dubai-creek-cruise/'],
  ['New Year','/new-year-dubai-cruise/'],
  ['Desert Safari','/desert-safari-dubai/']
];

function normalizedPath() {
  const path = location.pathname.replace(/index\.html$/,'').replace(/\/+$/,'/') || '/';
  return path;
}

function isActive(href) {
  if (href === '/') return normalizedPath() === '/';
  return normalizedPath().startsWith(href);
}

function socialLinks() {
  const links = [];
  if (settings.instagramUrl && settings.instagramUrl !== '#') links.push(`<a href="${esc(settings.instagramUrl)}" target="_blank" rel="noopener">Instagram</a>`);
  if (settings.facebookUrl && settings.facebookUrl !== '#') links.push(`<a href="${esc(settings.facebookUrl)}" target="_blank" rel="noopener">Facebook</a>`);
  return links.join('');
}

function headerMarkup() {
  return `<div class="global-site-header" data-global-site-header>
    <div class="global-announcement">
      <div class="global-container">
        <div><strong>Dubai experiences, clearly compared</strong><span>Canal · Marina · Creek · New Year · Desert Safari</span></div>
        <div class="global-announcement-links"><a href="tel:${digits(phone)}">${esc(phone)}</a><a href="https://wa.me/${whatsapp}" target="_blank" rel="noopener">Instant WhatsApp support</a></div>
      </div>
    </div>
    <header class="global-main-header">
      <div class="global-container global-header-row">
        <a class="global-brand" href="/" aria-label="${esc(brand)} home">
          ${settings.logoUrl ? `<img src="${esc(settings.logoUrl)}" alt="${esc(brand)}">` : `<span class="global-brand-mark">G</span>`}
          <span><b>${esc(brand)}</b><small>${esc(tagline)}</small></span>
        </a>
        <nav class="global-desktop-nav" aria-label="Main navigation">
          ${routes.map(([label,href]) => `<a class="${isActive(href)?'active':''}" href="${href}">${label}</a>`).join('')}
          <button type="button" data-global-compare>Compare Packages</button>
        </nav>
        <div class="global-header-actions">
          <a class="global-whatsapp" href="https://wa.me/${whatsapp}?text=${encodeURIComponent('Hello, I need help booking a Dubai experience.')}" target="_blank" rel="noopener">WhatsApp</a>
          <button class="global-menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" data-global-menu-toggle><span></span><span></span><span></span></button>
        </div>
      </div>
      <div class="global-mobile-panel" data-global-mobile-panel hidden>
        <nav aria-label="Mobile navigation">
          ${routes.map(([label,href]) => `<a class="${isActive(href)?'active':''}" href="${href}">${label}<span>→</span></a>`).join('')}
          <button type="button" data-global-compare>Compare Packages<span>→</span></button>
          <a href="/dhow-cruise-dubai/">Dubai Cruise Guide<span>→</span></a>
          <a href="/booking-policies/">Booking Policies<span>→</span></a>
        </nav>
        <div class="global-mobile-contact"><a href="tel:${digits(phone)}">${esc(phone)}</a><a href="mailto:${esc(email)}">${esc(email)}</a></div>
      </div>
    </header>
  </div>`;
}

function footerMarkup() {
  const year = new Date().getFullYear();
  return `<footer class="global-site-footer" data-global-site-footer>
    <div class="global-container global-footer-main">
      <section class="global-footer-brand">
        <a class="global-brand footer-brand" href="/">
          ${settings.logoUrl ? `<img src="${esc(settings.logoUrl)}" alt="${esc(brand)}">` : `<span class="global-brand-mark">G</span>`}
          <span><b>${esc(brand)}</b><small>${esc(tagline)}</small></span>
        </a>
        <p>${esc(settings.footerText || 'Compare Dubai cruise and tour packages with clear prices, timings, inclusions, seating and booking information.')}</p>
        <small>Operated by Ameerat Al Bahr Floating Restaurant L.L.C.</small>
        <div class="global-footer-social">${socialLinks()}</div>
      </section>
      <section><h3>Experiences</h3><a href="/dubai-canal-cruise/">Dubai Canal Cruise</a><a href="/dubai-marina-cruise/">Dubai Marina Cruise</a><a href="/dubai-creek-cruise/">Dubai Creek Cruise</a><a href="/new-year-dubai-cruise/">New Year Cruises</a><a href="/desert-safari-dubai/">Desert Safari Dubai</a></section>
      <section><h3>Plan & Compare</h3><a href="/?view=comparison">Compare Packages</a><a href="/dhow-cruise-dubai/">Dubai Dhow Cruise Guide</a><a href="/booking-policies/#booking">Booking & Payment</a><a href="/booking-policies/#cancellation">Cancellation & Refund</a><a href="/booking-policies/#privacy">Privacy Policy</a></section>
      <section class="global-footer-contact"><h3>Contact & Support</h3><a href="tel:${digits(phone)}"><span>Phone</span><b>${esc(phone)}</b></a><a href="https://wa.me/${whatsapp}" target="_blank" rel="noopener"><span>WhatsApp</span><b>Chat with booking support</b></a><a href="mailto:${esc(email)}"><span>Email</span><b>${esc(email)}</b></a><p><span>Location</span><b>Dubai, United Arab Emirates</b></p><p><span>Support</span><b>Available daily</b></p></section>
    </div>
    <div class="global-footer-bottom"><div class="global-container"><span>© ${year} ${esc(brand)}. All rights reserved.</span><nav><a href="/booking-policies/#terms">Terms</a><a href="/booking-policies/#privacy">Privacy</a><a href="/booking-policies/#cancellation">Cancellation</a></nav></div></div>
  </footer>`;
}

function htmlNode(markup) {
  const template = document.createElement('template');
  template.innerHTML = markup.trim();
  return template.content.firstElementChild;
}

function installHeader() {
  if (!headerEnabled || document.querySelector('[data-global-site-header]')) return;
  const oldBanner = document.querySelector('.review-banner');
  const oldHeader = document.querySelector('header.topbar:not(.global-main-header)');
  const compareTrigger = oldHeader?.querySelector('[data-view="comparison"]');
  const shell = htmlNode(headerMarkup());

  if (compareTrigger) {
    const triggerHolder = document.createElement('div');
    triggerHolder.hidden = true;
    triggerHolder.dataset.globalOriginalTriggers = '1';
    triggerHolder.append(compareTrigger);
    shell.append(triggerHolder);
  }

  if (oldBanner) {
    oldBanner.replaceWith(shell);
    oldHeader?.remove();
  } else if (oldHeader) {
    oldHeader.replaceWith(shell);
  } else {
    const target = document.querySelector('main, #app, body');
    if (target === document.body) document.body.prepend(shell);
    else target.before(shell);
  }

  bindHeader(shell);
}

function installFooter() {
  if (!footerEnabled || document.querySelector('[data-global-site-footer]')) return;
  const oldFooter = document.querySelector('footer.site-footer');
  const footer = htmlNode(footerMarkup());
  if (oldFooter) oldFooter.replaceWith(footer);
  else {
    const main = document.querySelector('main');
    if (main) main.after(footer);
    else document.body.append(footer);
  }
}

function openComparison(shell) {
  const trigger = shell.querySelector('[data-global-original-triggers] [data-view="comparison"]');
  if (trigger) {
    trigger.click();
    history.replaceState(null,'',location.pathname + location.hash);
  } else {
    location.href = '/?view=comparison';
  }
}

function bindHeader(shell) {
  const toggle = shell.querySelector('[data-global-menu-toggle]');
  const panel = shell.querySelector('[data-global-mobile-panel]');
  const closeMenu = () => {
    if (!panel || !toggle) return;
    panel.hidden = true;
    toggle.setAttribute('aria-expanded','false');
    document.body.classList.remove('global-menu-open');
  };
  toggle?.addEventListener('click', () => {
    const open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded',String(open));
    document.body.classList.toggle('global-menu-open',open);
  });
  shell.querySelectorAll('[data-global-compare]').forEach(button => button.addEventListener('click', () => {
    closeMenu();
    openComparison(shell);
  }));
  panel?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); }, { once:true });

  if (new URLSearchParams(location.search).get('view') === 'comparison') {
    setTimeout(() => openComparison(shell), 60);
  }
}

let queued = false;
function installChrome() {
  installHeader();
  installFooter();
}
function queueInstall() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; installChrome(); });
}

new MutationObserver(queueInstall).observe(document.documentElement,{childList:true,subtree:true});
queueInstall();
setTimeout(queueInstall,250);
setTimeout(queueInstall,900);
