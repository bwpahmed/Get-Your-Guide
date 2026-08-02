import { loadData } from './storage.js';
import { loadSeoContent } from './seo-content-data.js';

const site = loadData();
const seo = loadSeoContent();
const homeCopy = seo.home || {};
const esc = (value = '') => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const money = value => `${site.settings.currency || 'AED'} ${Number(value || 0).toLocaleString()}`;
const whatsapp = String(site.settings.whatsappNumber || '971554397575').replace(/\D/g, '');
const packages = site.packages.filter(item => item.visible).sort((a,b) => (a.order || 0) - (b.order || 0));
const categories = site.categories.filter(item => item.visible).sort((a,b) => (a.order || 0) - (b.order || 0));
const featured = packages.filter(item => item.featured).sort((a,b) => (a.order || 0) - (b.order || 0));
const packageById = id => packages.find(item => String(item.id) === String(id));
const byCategory = id => packages.filter(item => item.categoryId === id);
const sectionCopy = id => (homeCopy.sections || []).find(section => section.id === id) || {};

const landingPages = {
  canal:'/dubai-canal-cruise/',
  marina:'/dubai-marina-cruise/',
  yachts:'/?category=yachts#home-package-options',
  safari:'/?category=safari#home-package-options'
};

function node(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

function packageLink(item) {
  return `/package.html?slug=${encodeURIComponent(item.slug)}`;
}

function selectOptions(items) {
  const groups = categories.map(category => {
    const matches = items.filter(item => item.categoryId === category.id);
    if (!matches.length) return '';
    return `<optgroup label="${esc(category.name)}">${matches.map(item => `<option value="${esc(item.id)}">${esc(item.title)} · ${money(item.offerPrice)}</option>`).join('')}</optgroup>`;
  }).join('');
  return groups || '<option value="">No package available</option>';
}

function secondHeroMarkup() {
  const image = site.settings.heroImage || 'https://images.pexels.com/photos/29561720/pexels-photo-29561720.jpeg?auto=compress&cs=tinysrgb&w=1920';
  return `<section class="home-second-hero review-wrap" id="home-booking-hero" style="--home-hero-image:url('${esc(image)}')">
    <div class="home-second-hero-overlay"></div>
    <div class="home-second-hero-copy">
      <p class="eyebrow">Dubai cruises, yachts and desert experiences</p>
      <h2>Choose the right Dubai experience without guessing.</h2>
      <p>Compare prices, routes, buffet details, seating, timings and optional upgrades before sending one complete booking request.</p>
      <div class="home-hero-checks"><span>✓ Clear package differences</span><span>✓ Direct WhatsApp support</span><span>✓ No hidden add-ons</span><span>✓ Final details before payment</span></div>
      <div class="home-hero-actions"><button class="primary" type="button" data-go="comparison">Compare packages</button><a class="secondary" href="https://wa.me/${whatsapp}" target="_blank" rel="noopener">Ask on WhatsApp</a></div>
    </div>
    <form class="home-quick-form" id="homeQuickForm">
      <div class="home-quick-head"><h2>Book Your Experience</h2><p>Select the package, date and guests. Final availability will be confirmed.</p></div>
      <div class="home-booking-tabs" role="tablist">
        <button type="button" class="active" data-home-booking-tab="cruise">Cruise</button>
        <button type="button" data-home-booking-tab="yacht">Yacht</button>
        <button type="button" data-home-booking-tab="safari">Safari</button>
        <button type="button" data-home-booking-tab="new-year">New Year</button>
      </div>
      <div class="home-quick-grid">
        <label class="wide"><span>Select experience</span><select id="homeExperience" name="package" required>${selectOptions(packages.filter(item => ['canal','marina'].includes(item.categoryId)))}</select></label>
        <label><span>Travel date</span><input id="homeDate" type="date" name="date" required></label>
        <label><span>Time</span><select id="homeTime" name="time" required></select></label>
        <label><span>Adults</span><select name="adults">${Array.from({length:30},(_,index)=>`<option value="${index+1}" ${index===1?'selected':''}>${index+1}</option>`).join('')}</select></label>
        <label><span>Children</span><select name="children">${Array.from({length:16},(_,index)=>`<option value="${index}">${index}</option>`).join('')}</select></label>
        <label><span>Infants</span><select name="infants">${Array.from({length:11},(_,index)=>`<option value="${index}">${index}</option>`).join('')}</select></label>
      </div>
      <button class="primary full-button" type="submit">Check Availability</button>
      <p class="home-form-note">No card details collected · Final price and boarding details confirmed before payment</p>
    </form>
  </section>`;
}

function headingMarkup() {
  return `<section class="review-wrap home-title-section">
    <h2>${esc(homeCopy.title || 'Best Dinner Cruises & Tours in Dubai')}</h2>
    <p>${esc(homeCopy.intro || 'Compare Dubai Canal cruises, Marina cruises, private yachts and desert safaris by location, price, food, seating and attractions before booking.')}</p>
  </section>`;
}

function packageCard(item) {
  const inclusions = (item.inclusions || []).slice(0,4);
  return `<article class="home-package-card">
    <a class="home-package-image" href="${packageLink(item)}"><img src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy" decoding="async">${item.badges?.[0] ? `<span>${esc(item.badges[0])}</span>` : ''}</a>
    <div class="home-package-body"><p class="eyebrow">${esc(item.level)} · ${esc(item.location)}</p><h3>${esc(item.title)}</h3><p>${esc(item.shortDescription || '')}</p><div class="home-package-meta"><span>${esc(item.duration || '')}</span><span>${esc(item.boardingLocation || '')}</span></div><ul>${inclusions.map(text => `<li>✓ ${esc(text)}</li>`).join('')}</ul><div class="home-package-bottom"><div><small>Starting from</small><b>${money(item.offerPrice)}</b><span>${esc(item.priceUnit || 'per person')}</span></div><a href="${packageLink(item)}">More Details</a></div></div>
  </article>`;
}

function comparisonRows(items) {
  const visible = items.slice(0,6);
  if (!visible.length) return '<p>No visible packages in this category.</p>';
  const cell = fn => visible.map(item => `<td>${fn(item)}</td>`).join('');
  return `<div class="home-comparison-scroll"><table class="home-package-comparison"><thead><tr><th>Package</th>${visible.map(item => `<th>${esc(item.level)}</th>`).join('')}</tr></thead><tbody>
    <tr><th>Price</th>${cell(item => money(item.offerPrice))}</tr>
    <tr><th>Duration</th>${cell(item => esc(item.duration || 'Confirm'))}</tr>
    <tr><th>Buffet dinner</th>${cell(item => item.buffetDetails ? '✓ Included' : 'Package-specific')}</tr>
    <tr><th>Upper-deck option</th>${cell(item => /priority|guaranteed|upper/i.test(`${item.seating} ${item.upperDeckDetails}`) ? '✓ Available' : 'Optional')}</tr>
    <tr><th>Final confirmation</th><td colspan="${visible.length}">Vessel, gate, timing, menu and entertainment confirmed before travel</td></tr>
  </tbody></table></div>`;
}

function packageOptionsMarkup() {
  return `<section class="review-wrap home-package-options" id="home-package-options">
    <div class="home-section-head centered"><p class="eyebrow">Compare the actual package</p><h2>Choose the Right Package for You</h2><p>Prices alone do not explain the experience. Compare dining, route, seating, timings and service level.</p></div>
    <div class="home-subheading"><h3>Popular Package Options</h3><p>Switch between Canal, Marina, yachts and safari. Package data comes directly from the same CMS used by details and booking.</p></div>
    <div class="home-filter-tabs">
      ${[['canal','Dubai Canal'],['marina','Dubai Marina'],['yachts','Yacht Rental'],['safari','Desert Safari']].map(([id,label],index)=>`<button type="button" class="${index===0?'active':''}" data-home-package-filter="${id}">${label}</button>`).join('')}
    </div>
    <div class="home-package-grid" id="homePackageGrid"></div>
    <div class="home-comparison-box"><h3 id="homeComparisonTitle">Dubai Canal package comparison baseline</h3><div id="homeComparisonTable"></div></div>
  </section>`;
}

function customerStepsMarkup() {
  const steps = [
    ['Package Selected','The exact route and tier are included in the request.'],
    ['Availability Checked','The operator confirms the requested date and time.'],
    ['Details Verified','Vessel, gate, food and seating details are confirmed.'],
    ['Payment Explained','The amount, method and policy are shared clearly.'],
    ['Voucher Delivered','Final confirmation is sent on WhatsApp or email.'],
    ['Support Available','Contact details remain available before boarding.']
  ];
  return `<section class="review-wrap home-numbered-section"><div class="home-section-head centered"><p class="eyebrow">What customers can expect</p><h2>Clear Information Before the Experience</h2><p>Every important booking detail should be clear before the customer travels.</p></div><div class="home-number-grid">${steps.map(([title,copy],index)=>`<article><span>${index+1}</span><h3>${title}</h3><p>${copy}</p></article>`).join('')}</div></section>`;
}

function simplerBookingMarkup() {
  const copy = sectionCopy('simple-booking');
  const points = [
    ['✓','Package-Specific Details','Each package has its own price, menu, timing and inclusions.'],
    ['⌖','Location Clarity','Canal, Marina, yacht and safari products are not mixed together.'],
    ['◷','Real Trip Timings','Choose an available departure before sending the request.'],
    ['◈','Deck & Seating Info','Upper, lower and reserved seating conditions are explained.'],
    ['AED','Visible Add-On Costs','Pickup, deck upgrades and celebration options are shown separately.'],
    ['☎','Human Support','Get help with groups, families, events and special requests.']
  ];
  return `<section class="review-wrap home-simple-section"><div class="home-section-head centered"><p class="eyebrow">Why book with us</p><h2>${esc(copy.title || 'A Simpler Way to Book Dubai Experiences')}</h2><p>${esc(copy.body || 'We show the details customers usually have to ask repeatedly on WhatsApp: exact package, timing, seating, food, location and optional costs.')}</p></div><div class="home-simple-grid">${points.map(([icon,title,text])=>`<article><span>${icon}</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div>
    <div class="home-new-year-banner"><div><p class="eyebrow">New Year cruise guide</p><h3>Dubai New Year Cruise Packages</h3><p>Check route, seating, menu, check-in, payment and cancellation information before booking a special-event package.</p><a class="primary" href="/new-year-dubai-cruise/">Open New Year Page</a></div></div>
  </section>`;
}

function helpMarkup() {
  const help = sectionCopy('need-help');
  const groups = sectionCopy('group-discounts');
  return `<section class="review-wrap home-help-grid"><article><p class="eyebrow">Personal support</p><h2>${esc(help.title || 'Need Help Choosing?')}</h2><p>${esc(help.body || 'Send your budget, preferred location, date and group size. The team can shortlist the right cruise, yacht or safari.')}</p><a class="primary" target="_blank" rel="noopener" href="https://wa.me/${whatsapp}?text=${encodeURIComponent('Hello, I need help choosing the right Dubai experience.')} ">Ask on WhatsApp</a></article><article><p class="eyebrow">Larger bookings</p><h2>${esc(groups.title || 'Group Discounts Available!')}</h2><p>${esc(groups.body || 'Schools, companies, families, events and tour groups can request package-specific group pricing.')}</p><button class="secondary" type="button" data-go="comparison">View Packages</button></article></section>`;
}

function guideMarkup() {
  const guide = sectionCopy('guide');
  return `<section class="review-wrap home-guide-section"><div><p class="eyebrow">Plan before you pay</p><h2>${esc(guide.title || 'The Ultimate Guide to Dubai Dhow Cruise')}</h2><p>${esc(guide.body || 'Read location-specific guidance for routes, timings, seating, food, attractions and booking policies.')}</p><a class="primary" href="/dhow-cruise-dubai/">Open Cruise Guide</a></div><nav aria-label="Dubai experience guides"><a href="/dubai-canal-cruise/"><b>Dubai Canal Guide</b><span>→</span></a><a href="/dubai-marina-cruise/"><b>Dubai Marina Guide</b><span>→</span></a><a href="/dubai-creek-cruise/"><b>Dubai Creek Guide</b><span>→</span></a><a href="/new-year-dubai-cruise/"><b>New Year Guide</b><span>→</span></a><a href="/?category=yachts#home-package-options"><b>Yacht Packages</b><span>→</span></a><a href="/?category=safari#home-package-options"><b>Safari Packages</b><span>→</span></a></nav></section>`;
}

function updateHomeTimes() {
  const packageSelect = document.querySelector('#homeExperience');
  const timeSelect = document.querySelector('#homeTime');
  if (!packageSelect || !timeSelect) return;
  if (packageSelect.value === 'new-year-interest') {
    timeSelect.innerHTML = '<option value="Special event timing">Special event timing</option>';
    return;
  }
  const item = packageById(packageSelect.value);
  const slots = item?.timeSlots || [];
  timeSelect.innerHTML = slots.length ? slots.map(slot => `<option value="${esc(slot.label)} · ${esc(slot.sailingTime || slot.boardingTime || 'Confirm')}">${esc(slot.label)} · ${esc(slot.sailingTime || slot.boardingTime || 'Confirm')}</option>`).join('') : '<option value="Confirm on WhatsApp">Confirm on WhatsApp</option>';
}

function setBookingTab(tab) {
  const packageSelect = document.querySelector('#homeExperience');
  if (!packageSelect) return;
  document.querySelectorAll('[data-home-booking-tab]').forEach(button => button.classList.toggle('active', button.dataset.homeBookingTab === tab));
  let matches = [];
  if (tab === 'cruise') matches = packages.filter(item => ['canal','marina'].includes(item.categoryId));
  if (tab === 'yacht') matches = byCategory('yachts');
  if (tab === 'safari') matches = byCategory('safari');
  if (tab === 'new-year') {
    packageSelect.innerHTML = '<option value="new-year-interest">Dubai New Year Cruise Packages · View confirmed options</option>';
  } else {
    packageSelect.innerHTML = selectOptions(matches);
  }
  updateHomeTimes();
}

function renderPackageOptions(category) {
  const items = byCategory(category);
  const grid = document.querySelector('#homePackageGrid');
  const table = document.querySelector('#homeComparisonTable');
  const title = document.querySelector('#homeComparisonTitle');
  if (grid) grid.innerHTML = items.slice(0,5).map(packageCard).join('') || '<p>No visible packages in this category.</p>';
  if (table) table.innerHTML = comparisonRows(items);
  const categoryName = categories.find(item => item.id === category)?.name || category;
  if (title) title.textContent = `${categoryName} package comparison baseline`;
  document.querySelectorAll('[data-home-package-filter]').forEach(button => button.classList.toggle('active', button.dataset.homePackageFilter === category));
}

function bindInsertedSections() {
  const date = document.querySelector('#homeDate');
  if (date && !date.value) {
    const today = new Date();
    const max = new Date(); max.setFullYear(max.getFullYear()+1);
    const format = value => `${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,'0')}-${String(value.getDate()).padStart(2,'0')}`;
    date.min = format(today); date.max = format(max); date.value = format(today);
  }
  document.querySelector('#homeExperience')?.addEventListener('change', updateHomeTimes);
  document.querySelectorAll('[data-home-booking-tab]').forEach(button => button.addEventListener('click', () => setBookingTab(button.dataset.homeBookingTab)));
  document.querySelectorAll('[data-home-package-filter]').forEach(button => button.addEventListener('click', () => renderPackageOptions(button.dataset.homePackageFilter)));
  document.querySelector('#homeQuickForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const item = packageById(form.get('package'));
    const newYear = form.get('package') === 'new-year-interest';
    const message = [
      '*Website Availability Request*',
      `Package: ${newYear ? 'Dubai New Year Cruise Packages' : item?.title || 'Package inquiry'}`,
      `Date: ${form.get('date')}`,
      `Time: ${form.get('time')}`,
      `Adults: ${form.get('adults')}`,
      `Children: ${form.get('children')}`,
      `Infants: ${form.get('infants')}`,
      item ? `Starting price: ${money(item.offerPrice)} ${item.priceUnit || ''}` : '',
      '',
      'Please confirm availability, final price, vessel and boarding details.'
    ].filter(Boolean).join('\n');
    window.dataLayer?.push({event:'generate_lead',package_id:item?.id || 'new-year',package_name:item?.title || 'New Year inquiry',currency:site.settings.currency || 'AED'});
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`,'_blank','noopener');
  });
  updateHomeTimes();
  const queryCategory = new URLSearchParams(location.search).get('category');
  renderPackageOptions(['canal','marina','yachts','safari'].includes(queryCategory) ? queryCategory : 'canal');
}

function bindOriginalCards(overview) {
  overview.querySelectorAll('.category-switch').forEach(button => {
    if (button.dataset.landingBound) return;
    button.dataset.landingBound = '1';
    button.addEventListener('click', event => {
      const url = landingPages[button.dataset.category];
      if (!url) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      location.href = url;
    }, true);
  });
  overview.querySelectorAll('.architecture-card [data-open-package]').forEach(element => {
    if (element.dataset.packageLinkBound) return;
    element.dataset.packageLinkBound = '1';
    element.addEventListener('click', event => {
      const item = packageById(element.dataset.openPackage);
      if (!item) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      location.href = packageLink(item);
    }, true);
  });
}

function enhanceOverview() {
  const overview = document.querySelector('#view-overview.active');
  if (!overview || overview.dataset.confirmedHome === '1') return;
  const hero = overview.querySelector(':scope > .hero.review-wrap');
  const blocks = [...overview.querySelectorAll(':scope > .review-wrap.section-block')];
  const architecture = blocks.find(block => block.querySelector('.architecture-card'));
  const important = blocks.find(block => block.querySelector('.feature-grid'));
  if (!hero || !architecture || !important) return;

  const secondHero = node(secondHeroMarkup());
  const title = node(headingMarkup());
  const packageOptions = node(packageOptionsMarkup());
  const customerSteps = node(customerStepsMarkup());
  const simpler = node(simplerBookingMarkup());
  const help = node(helpMarkup());
  const guide = node(guideMarkup());

  hero.after(secondHero);
  architecture.after(title, packageOptions, customerSteps, simpler, help);
  help.after(important);
  important.after(guide);
  overview.dataset.confirmedHome = '1';
  bindOriginalCards(overview);
  bindInsertedSections();
}

let queued = false;
const queue = () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; enhanceOverview(); });
};
new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',event=>{if(event.target.closest('[data-view="overview"],[data-go="overview"]'))setTimeout(queue,0);},true);
queue();
setTimeout(queue,250);
setTimeout(queue,900);
