import { loadData } from './storage.js';

const data = loadData();
const $ = (selector, root = document) => root.querySelector(selector);
const esc = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
const money = (value) => `${esc(data.settings.currency)} ${Number(value || 0).toLocaleString()}`;

function applyTheme() {
  document.documentElement.style.setProperty('--primary', data.settings.primaryColor);
  document.documentElement.style.setProperty('--accent', data.settings.accentColor);
  document.title = data.settings.brandName;
}

function header() {
  const links = data.navLinks.filter((item) => item.visible).sort((a, b) => a.order - b.order);
  return `<header class="site-header"><a class="brand" href="index.html">${data.settings.logoUrl ? `<img src="${esc(data.settings.logoUrl)}" alt="">` : '<span class="brand-mark">G</span>'}<span><strong>${esc(data.settings.shortName)}</strong><small>${esc(data.settings.tagline)}</small></span></a><nav class="main-nav">${links.map((link) => `<a href="${esc(link.href)}">${esc(link.label)}</a>`).join('')}<a class="nav-cta" target="_blank" rel="noopener" href="https://wa.me/${esc(data.settings.whatsappNumber)}">WhatsApp</a></nav><button class="menu-button" aria-label="Toggle menu">☰</button></header>`;
}

function hero(section) {
  return `<section class="hero" style="background-image:linear-gradient(90deg,rgba(6,20,34,.92),rgba(6,20,34,.44)),url('${esc(data.settings.heroImage)}')"><div class="hero-content"><span class="eyebrow">✦ Dubai experiences, clearly compared</span><h1>${esc(section.title)}</h1><p>${esc(section.subtitle)}</p><div class="search-box"><span>⌕</span><input id="package-search" placeholder="Search Canal, Marina, Yacht or Safari"><button data-scroll="packages">Explore</button></div><div class="hero-points"><span>✓ Admin-controlled packages</span><span>✓ Flexible upgrades</span><span>✓ WhatsApp booking</span></div></div></section>`;
}

function categories(section) {
  const list = data.categories.filter((item) => item.visible).sort((a, b) => a.order - b.order);
  return `<section class="section" id="categories"><div class="section-head"><span class="eyebrow">Categories</span><h2>${esc(section.title)}</h2><p>${esc(section.subtitle)}</p></div><div class="category-grid">${list.map((item) => `<button class="category-card" data-scroll="group-${esc(item.id)}"><img src="${esc(item.image)}" alt=""><span><strong>${esc(item.name)}</strong><small>${esc(item.description)}</small><em>View packages ›</em></span></button>`).join('')}</div></section>`;
}

function packageCard(item) {
  return `<article class="package-card" data-search="${esc(`${item.title} ${item.level} ${item.location}`.toLowerCase())}"><div class="package-image"><img src="${esc(item.image)}" alt="${esc(item.title)}"><div class="badge-stack"><span class="level-badge">${esc(item.level)}</span>${(item.badges || []).map((badge) => `<span>${esc(badge)}</span>`).join('')}</div></div><div class="package-body"><h3>${esc(item.title)}</h3><p>${esc(item.shortDescription)}</p><div class="meta-row"><span>⌖ ${esc(item.location)}</span><span>◷ ${esc(item.duration)}</span></div><div class="meta-row"><span>♙ ${esc(item.capacity)}</span></div><div class="price-row"><div><small>From</small><strong>${money(item.offerPrice)}</strong>${item.originalPrice > item.offerPrice ? `<del>${money(item.originalPrice)}</del>` : ''}</div><a href="package.html?slug=${encodeURIComponent(item.slug)}">View details →</a></div></div></article>`;
}

function packages(section) {
  const categories = data.categories.filter((item) => item.visible).sort((a, b) => a.order - b.order);
  const visible = data.packages.filter((item) => item.visible);
  return `<section class="section packages-section" id="packages"><div class="section-head"><span class="eyebrow">☷ Package levels</span><h2>${esc(section.title)}</h2><p>${esc(section.subtitle)}</p></div>${categories.map((category) => { const items = visible.filter((item) => item.categoryId === category.id).sort((a, b) => a.order - b.order); return items.length ? `<div class="package-group" id="group-${esc(category.id)}"><div class="group-head"><div><span>${esc(category.kind)}</span><h3>${esc(category.name)}</h3></div><p>${esc(category.description)}</p></div><div class="package-grid">${items.map(packageCard).join('')}</div></div>` : ''; }).join('')}</section>`;
}

function trust(section) {
  return `<section class="trust-section"><div><span class="eyebrow">✓ Built for clarity</span><h2>${esc(section.title)}</h2><p>${esc(section.subtitle)}</p></div><div class="trust-grid"><article><strong>Package levels</strong><p>Basic, Economy, Standard, Premium, Luxury, 4-Star, 5-Star and Private Charter.</p></article><article><strong>Route landmarks</strong><p>Show only the landmarks that genuinely apply, in the correct order.</p></article><article><strong>Optional upgrades</strong><p>Quad bikes, buggies, VIP sitting, premium camps, decoration and cakes.</p></article></div></section>`;
}

function cta(section) {
  return `<section class="cta-section"><div><span class="eyebrow">Personal assistance</span><h2>${esc(section.title)}</h2><p>${esc(section.subtitle)}</p></div><a target="_blank" rel="noopener" href="https://wa.me/${esc(data.settings.whatsappNumber)}">◉ Chat on WhatsApp</a></section>`;
}

function footer() {
  return `<footer class="site-footer"><div><strong>${esc(data.settings.brandName)}</strong><p>${esc(data.settings.footerText)}</p></div><div><span>${esc(data.settings.supportPhone)}</span><span>${esc(data.settings.supportEmail)}</span></div><div><a href="${esc(data.settings.instagramUrl)}">Instagram</a><a href="${esc(data.settings.facebookUrl)}">Facebook</a><a href="admin.html">Admin</a></div></footer>`;
}

function renderHome() {
  const root = $('#app');
  const renderers = { header, hero, categories, packages, trust, cta, custom: (section) => `<section class="section custom-section"><div class="section-head"><h2>${esc(section.title)}</h2><p>${esc(section.subtitle)}</p></div>${section.content || ''}</section>`, footer };
  root.innerHTML = data.sections.filter((item) => item.visible).sort((a, b) => a.order - b.order).map((section) => renderers[section.type]?.(section) || '').join('');
  $('.menu-button')?.addEventListener('click', () => $('.main-nav')?.classList.toggle('open'));
  document.querySelectorAll('[data-scroll]').forEach((button) => button.addEventListener('click', () => document.getElementById(button.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' })));
  $('#package-search')?.addEventListener('input', (event) => { const query = event.target.value.trim().toLowerCase(); document.querySelectorAll('.package-card').forEach((card) => card.hidden = query && !card.dataset.search.includes(query)); });
}

function renderPackage() {
  const slug = new URLSearchParams(location.search).get('slug');
  const item = data.packages.find((pkg) => pkg.slug === slug && pkg.visible);
  const root = $('#app');
  if (!item) { root.innerHTML = '<div class="not-found"><div><h1>Package not found</h1><a href="index.html">Back home</a></div></div>'; return; }
  const category = data.categories.find((entry) => entry.id === item.categoryId);
  const addons = data.addOns.filter((addon) => addon.visible && item.addOnIds.includes(addon.id));
  root.innerHTML = `<main class="detail-page"><a class="back-button" href="index.html">← Back to packages</a><section class="detail-hero"><img src="${esc(item.image)}" alt="${esc(item.title)}"><div><span class="eyebrow">${esc(category?.name || '')} · ${esc(item.level)}</span><h1>${esc(item.title)}</h1><p>${esc(item.description)}</p><div class="detail-meta"><span>⌖ ${esc(item.boardingLocation)}</span><span>◷ ${esc(item.duration)}</span><span>♙ ${esc(item.capacity)}</span></div><div class="detail-price"><small>Starting from</small><strong>${money(item.offerPrice)}</strong>${item.originalPrice > item.offerPrice ? `<del>${money(item.originalPrice)}</del>` : ''}</div></div></section><section class="detail-grid"><div class="detail-main"><article class="detail-card"><h2>What is included</h2><div class="check-list">${item.inclusions.map((entry) => `<span>✓ ${esc(entry)}</span>`).join('')}</div></article><article class="detail-card"><h2>Route & landmarks</h2><div class="route-list">${item.landmarks.map((landmark, index) => `<div><b>${index + 1}</b><span>${esc(landmark)}</span></div>`).join('')}</div></article><article class="detail-card"><h2>Available timing</h2>${item.timeSlots.map((slot) => `<div class="slot-row"><strong>${esc(slot.label)}</strong><span>Boarding ${esc(slot.boardingTime)}</span><span>Departure ${esc(slot.sailingTime)}</span><span>Return ${esc(slot.returnTime)}</span><small>${esc(slot.days)}</small></div>`).join('')}</article><article class="detail-card"><h2>Not included</h2><div class="check-list negative">${item.exclusions.map((entry) => `<span>× ${esc(entry)}</span>`).join('')}</div></article><article class="detail-card"><h2>Good to know</h2><div class="check-list"><span><b>Infants:</b> ${esc(item.infantPolicy || 'Confirm before booking')}</span><span><b>Payment:</b> ${esc(item.paymentMethod || 'Confirm at booking')}</span><span><b>Cancellation:</b> ${esc(item.cancellationPolicy || 'Confirm before payment')}</span><span><b>Parking:</b> ${esc(item.parkingInfo || 'Instructions provided after confirmation')}</span>${item.mapUrl ? `<span><a href="${esc(item.mapUrl)}" target="_blank" rel="noopener">Open Google Maps</a></span>` : ''}</div></article></div><aside><div class="booking-box"><h3>Build your booking</h3><p>Base package</p><div class="booking-line"><span>${esc(item.title)}</span><strong>${money(item.offerPrice)}</strong></div>${addons.length ? `<h4>Optional add-ons</h4>${addons.map((addon) => `<label class="addon-option"><input type="checkbox" value="${esc(addon.id)}"><span><b>${esc(addon.name)}</b><small>${esc(addon.description)}</small></span><strong>+${money(addon.price)}</strong></label>`).join('')}` : ''}<div class="booking-total"><span>Estimated total</span><strong id="booking-total">${money(item.offerPrice)}</strong></div><button id="book-whatsapp">Book on WhatsApp</button><small>Final availability and operator confirmation required.</small></div></aside></section></main>`;
  const update = () => { const selected = [...document.querySelectorAll('.addon-option input:checked')].map((input) => addons.find((addon) => addon.id === input.value)).filter(Boolean); const total = item.offerPrice + selected.reduce((sum, addon) => sum + addon.price, 0); $('#booking-total').textContent = money(total); $('#book-whatsapp').onclick = () => { const message = `${item.whatsappMessage}\nSelected add-ons: ${selected.map((addon) => addon.name).join(', ') || 'None'}\nEstimated total: ${money(total)}`; window.open(`https://wa.me/${data.settings.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank'); }; };
  document.querySelectorAll('.addon-option input').forEach((input) => input.addEventListener('change', update)); update();
}

applyTheme();
if (document.body.dataset.page === 'package') renderPackage(); else renderHome();
