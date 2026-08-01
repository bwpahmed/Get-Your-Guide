import { loadData } from './storage.js';

const data = loadData();
const esc = (value = '') => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const money = value => `${data.settings.currency || 'AED'} ${Number(value || 0).toLocaleString()}`;
const trackedKeys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid'];

function captureAttribution() {
  const query = new URLSearchParams(location.search);
  const existing = JSON.parse(sessionStorage.getItem('gyg-attribution') || '{}');
  const next = { ...existing };
  trackedKeys.forEach(key => { if (query.get(key)) next[key] = query.get(key); });
  if (!next.landing_page) next.landing_page = location.href;
  sessionStorage.setItem('gyg-attribution', JSON.stringify(next));
  return next;
}

const attribution = captureAttribution();
const localDate = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;

function currentPackage() {
  const slug = new URLSearchParams(location.search).get('slug');
  if (slug) return data.packages.find(item => item.slug === slug && item.visible);
  const title = document.querySelector('#view-experience.active .page-head h1, body[data-page="package"] .page-head h1')?.textContent?.trim();
  return data.packages.find(item => item.title === title && item.visible);
}

function optionText(slot) {
  return `${slot.label} — ${slot.sailingTime || slot.boardingTime}${slot.returnTime ? ` to ${slot.returnTime}` : ''}`;
}

function bookingType(item) {
  if (item.categoryId === 'yachts') return 'charter';
  if (item.categoryId === 'safari' && /private/i.test(item.bookingMode || item.title)) return 'charter';
  return 'per-person';
}

function seatingOptions(item) {
  if (!['canal','marina'].includes(item.categoryId)) return '';
  const charge = Number(item.upperDeckCharge ?? 25);
  return `<label class="booking-field"><span>Deck preference</span><select name="deck"><option value="Best available|0">Best available</option><option value="AC lower deck|0">AC lower deck</option><option value="Open upper deck|${charge}">Guaranteed open upper deck (+${money(charge)} per guest)</option></select></label>`;
}

function pickupOptions(item) {
  if (item.categoryId === 'safari') {
    return `<label class="booking-field booking-wide"><span>Pickup / meeting point</span><select name="pickup"><option value="${esc(item.pickupDetails || item.boardingLocation)}|0">${esc(item.pickupDetails || item.boardingLocation)}</option><option value="Confirm exact pickup on WhatsApp|0">Confirm exact pickup on WhatsApp</option></select></label>`;
  }
  if (item.categoryId === 'yachts') {
    return `<label class="booking-field booking-wide"><span>Meeting point</span><select name="pickup"><option value="Marina self-arrival|0">Marina self-arrival</option><option value="Request private transfer|0">Request private transfer quotation</option></select></label>`;
  }
  const price = Number(item.pickupPrice ?? 35);
  return `<label class="booking-field booking-wide"><span>Transfer option</span><select name="pickup"><option value="Self-arrival at boarding point|0">Self-arrival at boarding point</option><option value="Shared hotel pickup|${price}">Shared hotel pickup (+${money(price)} per guest)</option></select></label>`;
}

function renderForm(item, container) {
  const type = bookingType(item);
  const slots = item.timeSlots?.length ? item.timeSlots : [{ id:'flex', label:'Flexible time', sailingTime:'Confirm on WhatsApp', boardingTime:'', returnTime:'', days:'Daily' }];
  const addons = data.addOns.filter(addon => addon.visible && (item.addOnIds || []).includes(addon.id));
  const minDate = localDate(new Date());
  const maxDateObject = new Date(); maxDateObject.setFullYear(maxDateObject.getFullYear() + 1);
  const maxDate = localDate(maxDateObject);

  container.dataset.clientForm = item.slug;
  container.innerHTML = `
    <div class="booking-intro"><div><p class="eyebrow">Secure your experience</p><h2>Check availability</h2><p>Complete the details below. Your selected package and total will be sent directly on WhatsApp.</p></div><span class="booking-selected">${esc(item.level)} · ${money(item.offerPrice)}</span></div>
    <form class="client-booking-form" id="clientBookingForm" novalidate>
      <div class="selected-package-summary"><img src="${esc(item.image)}" alt="${esc(item.title)}"><div><small>Selected package</small><b>${esc(item.title)}</b><span>${esc(item.duration)} · ${esc(item.location)}</span></div><button type="button" data-go="comparison">Change</button></div>
      <div class="booking-form-grid">
        <label class="booking-field"><span>Travel date *</span><input type="date" name="date" min="${minDate}" max="${maxDate}" required></label>
        <label class="booking-field"><span>Trip time *</span><select name="time" required>${slots.map(slot=>`<option value="${esc(optionText(slot))}">${esc(optionText(slot))}</option>`).join('')}</select></label>
        <label class="booking-field"><span>Adults *</span><select name="adults">${Array.from({length:30},(_,i)=>`<option value="${i+1}">${i+1}</option>`).join('')}</select></label>
        <label class="booking-field"><span>Children (3–11)</span><select name="children">${Array.from({length:21},(_,i)=>`<option value="${i}">${i}</option>`).join('')}</select></label>
        <label class="booking-field"><span>Infants (0–2)</span><select name="infants">${Array.from({length:11},(_,i)=>`<option value="${i}">${i}</option>`).join('')}</select></label>
        ${type === 'charter' ? `<label class="booking-field"><span>Total guests *</span><input type="number" name="totalGuests" min="1" max="${Number(item.maximumGuests || 100)}" value="1" required></label>` : seatingOptions(item)}
        ${pickupOptions(item)}
        <label class="booking-field booking-wide"><span>Pickup / hotel location</span><input name="pickupLocation" placeholder="Hotel, building or area (when pickup applies)"></label>
      </div>
      ${addons.length ? `<div class="booking-addons"><div class="booking-section-title"><b>Optional add-ons</b><span>Select only what you need</span></div>${addons.map(addon=>`<label class="booking-addon"><input type="checkbox" name="addon" value="${esc(addon.id)}" data-price="${Number(addon.price)}" data-unit="${esc(addon.unit || 'per booking')}"><span><b>${esc(addon.name)}</b><small>${esc(addon.description || addon.unit || '')}</small></span><strong>+${money(addon.price)}</strong></label>`).join('')}</div>` : ''}
      <div class="booking-contact"><div class="booking-section-title"><b>Your contact details</b><span>Used only to confirm this booking</span></div><div class="booking-form-grid">
        <label class="booking-field"><span>Full name *</span><input name="name" autocomplete="name" required></label>
        <label class="booking-field"><span>WhatsApp number *</span><input name="phone" type="tel" autocomplete="tel" placeholder="+971..." required></label>
        <label class="booking-field"><span>Email</span><input name="email" type="email" autocomplete="email"></label>
        <label class="booking-field"><span>Nationality</span><input name="nationality" autocomplete="country-name"></label>
        <label class="booking-field booking-wide"><span>Special request</span><textarea name="request" rows="3" placeholder="Birthday, dietary request, accessibility, celebration or other note"></textarea></label>
      </div></div>
      <div class="booking-price-box">
        <div class="booking-breakdown" id="bookingBreakdown"></div>
        <div class="booking-total"><span>Estimated total</span><b id="clientBookingTotal">${money(item.offerPrice)}</b></div>
        <label class="booking-consent"><input type="checkbox" name="consent" required><span>I confirm the date, guest details and package selection are correct. Final availability and operator confirmation are required.</span></label>
        <button class="primary full-button booking-submit" type="submit">Check availability on WhatsApp</button>
        <p class="booking-trust">Instant WhatsApp request · Clear price summary · No card details collected on this form</p>
        <div class="booking-error" id="bookingError" role="alert"></div>
      </div>
    </form>`;

  bindForm(item, addons, type, container);
}

function bindForm(item, addons, type, container) {
  const form = container.querySelector('#clientBookingForm');
  const totalEl = container.querySelector('#clientBookingTotal');
  const breakdownEl = container.querySelector('#bookingBreakdown');
  const errorEl = container.querySelector('#bookingError');

  const calculate = () => {
    const fd = new FormData(form);
    const adults = Number(fd.get('adults') || 1);
    const children = Number(fd.get('children') || 0);
    const infants = Number(fd.get('infants') || 0);
    const guests = type === 'charter' ? Number(fd.get('totalGuests') || 1) : adults + children + infants;
    const payingGuests = Math.max(1, adults + children);
    const adultPrice = Number(item.adultPrice || item.offerPrice || 0);
    const childPrice = Number(item.childPrice || 0);
    let base = type === 'charter' ? Number(item.offerPrice || 0) : (adults * adultPrice) + (children * childPrice);

    const [deckName = '', deckPrice = '0'] = String(fd.get('deck') || '').split('|');
    const [pickupName = '', pickupPrice = '0'] = String(fd.get('pickup') || '').split('|');
    const deckTotal = Number(deckPrice || 0) * payingGuests;
    const pickupTotal = Number(pickupPrice || 0) * payingGuests;
    const selectedAddons = [...form.querySelectorAll('input[name="addon"]:checked')].map(input => {
      const addon = addons.find(entry => entry.id === input.value);
      const unit = String(input.dataset.unit || '').toLowerCase();
      const multiplier = unit.includes('person') ? payingGuests : 1;
      return { ...addon, total:Number(input.dataset.price || 0) * multiplier };
    });
    const addonTotal = selectedAddons.reduce((sum, addon) => sum + addon.total, 0);
    const total = base + deckTotal + pickupTotal + addonTotal;

    breakdownEl.innerHTML = `
      <div><span>${type === 'charter' ? 'Base charter' : `${adults} adult${adults===1?'':'s'}${children?` + ${children} child${children===1?'':'ren'}`:''}`}</span><b>${money(base)}</b></div>
      ${deckTotal ? `<div><span>${esc(deckName)}</span><b>${money(deckTotal)}</b></div>` : ''}
      ${pickupTotal ? `<div><span>${esc(pickupName)}</span><b>${money(pickupTotal)}</b></div>` : ''}
      ${selectedAddons.map(addon=>`<div><span>${esc(addon.name)}</span><b>${money(addon.total)}</b></div>`).join('')}
      ${infants ? `<div><span>${infants} infant${infants===1?'':'s'}</span><b>${money(0)}</b></div>` : ''}`;
    totalEl.textContent = money(total);
    return { fd, adults, children, infants, guests, deckName, pickupName, selectedAddons, total };
  };

  form.addEventListener('input', calculate);
  form.addEventListener('change', calculate);
  form.addEventListener('submit', event => {
    event.preventDefault();
    errorEl.textContent = '';
    const result = calculate();
    const required = ['date','time','name','phone'];
    const missing = required.filter(key => !String(result.fd.get(key) || '').trim());
    if (type === 'charter' && Number(result.fd.get('totalGuests') || 0) < 1) missing.push('totalGuests');
    if (!result.fd.get('consent')) missing.push('consent');
    if (missing.length) {
      errorEl.textContent = 'Please complete the required date, guest and contact fields.';
      form.querySelector(`[name="${missing[0]}"]`)?.focus();
      return;
    }

    const source = trackedKeys.map(key => attribution[key] ? `${key}: ${attribution[key]}` : '').filter(Boolean).join(' | ') || 'Direct / organic';
    const message = [
      '*New Website Booking Request*',
      '',
      `*Package:* ${item.title}`,
      `*Level:* ${item.level}`,
      `*Date:* ${result.fd.get('date')}`,
      `*Trip:* ${result.fd.get('time')}`,
      type === 'charter' ? `*Guests:* ${result.fd.get('totalGuests')}` : `*Guests:* ${result.adults} adults, ${result.children} children, ${result.infants} infants`,
      result.deckName ? `*Deck:* ${result.deckName}` : '',
      result.pickupName ? `*Pickup:* ${result.pickupName}` : '',
      result.fd.get('pickupLocation') ? `*Location:* ${result.fd.get('pickupLocation')}` : '',
      `*Add-ons:* ${result.selectedAddons.map(addon=>addon.name).join(', ') || 'None'}`,
      `*Estimated total:* ${money(result.total)}`,
      '',
      `*Name:* ${result.fd.get('name')}`,
      `*WhatsApp:* ${result.fd.get('phone')}`,
      result.fd.get('email') ? `*Email:* ${result.fd.get('email')}` : '',
      result.fd.get('nationality') ? `*Nationality:* ${result.fd.get('nationality')}` : '',
      result.fd.get('request') ? `*Special request:* ${result.fd.get('request')}` : '',
      '',
      `*Lead source:* ${source}`,
      `*Landing page:* ${attribution.landing_page || location.href}`
    ].filter(Boolean).join('\n');

    window.dataLayer?.push({ event:'generate_lead', package_id:item.id, package_name:item.title, value:result.total, currency:data.settings.currency || 'AED', lead_source:source });
    if (typeof window.gtag === 'function') window.gtag('event','generate_lead',{ value:result.total, currency:data.settings.currency || 'AED' });
    if (typeof window.fbq === 'function') window.fbq('track','Lead',{ value:result.total, currency:data.settings.currency || 'AED', content_name:item.title });

    const number = String(data.settings.whatsappNumber || '').replace(/\D/g,'');
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });

  container.querySelector('[data-go="comparison"]')?.addEventListener('click', () => document.querySelector('[data-view="comparison"]')?.click());
  calculate();
}

function enhanceBooking() {
  const item = currentPackage();
  const container = document.querySelector('#view-experience.active .booking-card, body[data-page="package"] .booking-card');
  if (!item || !container || container.dataset.clientForm === item.slug) return;
  renderForm(item, container);
}

let queued = false;
const queue = () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; enhanceBooking(); });
};

new MutationObserver(queue).observe(document.documentElement, { childList:true, subtree:true });
window.addEventListener('popstate', queue);
document.addEventListener('click', event => { if (event.target.closest('[data-open-package],[data-view="experience"],[data-go="experience"]')) setTimeout(queue, 0); }, true);
queue();
setTimeout(queue, 150);
setTimeout(queue, 600);
