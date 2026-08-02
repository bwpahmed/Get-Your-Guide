import { loadData } from './storage.js';

const site = loadData();
const esc = (value = '') => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const money = value => `${site.settings.currency || 'AED'} ${Number(value || 0).toLocaleString()}`;

function selectedPackage() {
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  const id = params.get('id');
  if (slug) return site.packages.find(pkg => pkg.slug === slug && pkg.visible);
  if (id) return site.packages.find(pkg => String(pkg.id) === String(id) && pkg.visible) || site.packages[Number(id) - 1];
  const heading = document.querySelector('.page-head h1')?.textContent?.trim();
  return site.packages.find(pkg => pkg.title === heading && pkg.visible);
}

function cards(title, intro, items, icon = '✓') {
  return `<section class="ref-section ref-icon-section ref-product-section"><div class="ref-section-head centered"><p class="eyebrow">Selected package</p><h2>${esc(title)}</h2><p>${esc(intro)}</p></div><div class="ref-icon-grid">${(items || []).slice(0,8).map(item => `<article><span>${icon}</span><h3>${esc(String(item).split(':')[0])}</h3><p>${esc(String(item).includes(':') ? String(item).split(':').slice(1).join(':').trim() : item)}</p></article>`).join('')}</div></section>`;
}

function menu(pkg) {
  const buffet = pkg.buffetDetails || 'Package-specific buffet details can be managed from the CMS.';
  return `<section class="ref-section ref-menu ref-product-section"><div class="ref-section-head centered"><p class="eyebrow">Dining on this package</p><h2>Food Menu & Refreshments</h2><p>${esc(buffet)}</p></div><div class="ref-menu-grid"><article><span>🥗</span><h3>Vegetarian Selection</h3><ul><li>Fresh salads and mezze</li><li>Vegetarian starters</li><li>Rice and main dishes</li><li>Seasonal fruit</li></ul></article><article><span>🍖</span><h3>Non-Vegetarian Selection</h3><ul><li>Chicken or fish dishes</li><li>Selected BBQ items</li><li>Rice and curry dishes</li><li>Package-specific mains</li></ul></article><article><span>🥤</span><h3>Drinks & Desserts</h3><ul><li>${esc(pkg.drinks || 'Water and soft drinks where listed')}</li><li>Dessert selection</li><li>Tea and coffee where included</li><li>Welcome drink where included</li></ul></article></div></section>`;
}

function bookingSteps(pkg) {
  return `<section class="ref-section ref-steps ref-product-section"><div class="ref-section-head centered"><p class="eyebrow">Complete your reservation</p><h2>How to Book ${esc(pkg.title)}</h2><p>The booking form keeps the selected package, date, guests, upgrades and contact details together.</p></div><div class="ref-step-grid"><article><span>1</span><h3>Select Date & Time</h3><p>Choose one of the available package timings or request a flexible charter slot.</p></article><article><span>2</span><h3>Add Guests & Options</h3><p>Select adults, children, deck, pickup and any optional add-ons.</p></article><article><span>3</span><h3>Receive Confirmation</h3><p>The team confirms availability, boarding location and final operator details.</p></article></div></section>`;
}

function seating(pkg) {
  const items = [
    ['Upper Deck','Open-air views',pkg.upperDeckDetails || 'Open deck access depends on the selected vessel and package.'],
    ['Lower Deck','Air-conditioned comfort',pkg.lowerDeckDetails || 'Indoor seating with climate control where available.']
  ];
  return `<section class="ref-section ref-seating ref-product-section"><div class="ref-section-head centered"><p class="eyebrow">Deck and seating</p><h2>Sitting Options for This Package</h2><p>${esc(pkg.seating || 'Seating is allocated according to package and availability.')}</p></div><div class="ref-deck-grid">${items.map(([title,sub,copy]) => `<article><div class="ref-deck-art"></div><p class="eyebrow">${esc(sub)}</p><h3>${esc(title)}</h3><ul><li>✓ ${esc(copy)}</li><li>✓ Confirmed allocation before travel</li><li>✓ Upgrade charges shown in the booking form</li></ul></article>`).join('')}</div></section>`;
}

function policies(pkg) {
  const rows = [
    ['Boarding & Check-In',pkg.meetingInstructions || 'Arrive before the confirmed boarding time with the booking confirmation.'],
    ['Seating Options',pkg.seating || 'Seating follows the purchased package and availability.'],
    ['Food & Beverage',pkg.buffetDetails || 'Only the menu listed in the selected package is included.'],
    ['Safety & Prohibited Items','Follow crew, venue and marine authority instructions throughout the experience.'],
    ['Transportation',pkg.pickupDetails || 'Transfer is only included when selected and confirmed.'],
    ['Booking & Payment',pkg.paymentMethod || 'Advance payment may be required to confirm the booking.'],
    ['Cancellation Policy',pkg.cancellationPolicy || 'The selected package policy applies.'],
    ['Confirmation Delivery','The final voucher, location and contact details are sent on WhatsApp or email.']
  ];
  return `<section class="ref-section ref-policies ref-product-section"><div class="ref-section-head centered"><p class="eyebrow">Read before booking</p><h2>Important Information & Policies</h2><p>These details come from the selected package and remain editable in the CMS.</p></div><div class="ref-policy-grid">${rows.map(([title,copy]) => `<article><h3>${esc(title)}</h3><p>${esc(copy)}</p></article>`).join('')}</div></section>`;
}

function faqs(pkg) {
  const items = pkg.faqs?.length ? pkg.faqs : [
    {question:'What is included?',answer:'The inclusions section above lists the confirmed package items.'},
    {question:'How long is the experience?',answer:`The listed duration is ${pkg.duration || 'shown in the package details'}.`},
    {question:'Where is the meeting point?',answer:pkg.boardingLocation || pkg.location || 'The exact location is sent after confirmation.'},
    {question:'Can I select the deck?',answer:'Deck selection depends on the package and may require an upgrade.'}
  ];
  return `<section class="ref-section ref-faq ref-product-section"><div class="ref-section-head centered"><p class="eyebrow">Before you book</p><h2>Frequently Asked Questions</h2></div><div class="ref-faq-list">${items.map(item => `<details><summary>${esc(item.question)}</summary><p>${esc(item.answer)}</p></details>`).join('')}</div></section>`;
}

function render() {
  const pkg = selectedPackage();
  const app = document.querySelector('#app');
  if (!pkg || !app || document.querySelector('[data-product-longform]')) return;
  const sights = [...new Set([...(pkg.landmarks || []),...(pkg.views || []),...(pkg.highlights || [])])];
  const benefits = [
    `Clear Price: ${money(pkg.offerPrice)} ${pkg.priceUnit || ''}`,
    `Duration: ${pkg.duration || 'Confirm before booking'}`,
    `Location: ${pkg.location || pkg.boardingLocation || 'Dubai'}`,
    `Booking Mode: ${pkg.bookingMode || 'Per person'}`,
    `Food: ${pkg.buffetDetails || 'Package-specific dining'}`,
    `Entertainment: ${pkg.entertainment || 'As listed in package'}`,
    `Decks: ${pkg.seating || 'Package-specific seating'}`,
    `Confirmation: Final details sent before travel`
  ];
  const wrapper = document.createElement('div');
  wrapper.dataset.productLongform = pkg.slug;
  wrapper.innerHTML = `
    ${cards(`Why Choose ${pkg.title}?`,'Review the complete experience instead of relying on the package name alone.',benefits,'✦')}
    ${cards("What's Included",'Everything below is linked to this selected package and can be changed from the CMS.',pkg.inclusions || [],'✓')}
    ${menu(pkg)}
    ${bookingSteps(pkg)}
    ${cards('Top Sights & Attractions','The actual route depends on the vessel, duration and operating instructions.',sights,'⌖')}
    ${seating(pkg)}
    ${cards('Entertainment & Live Experiences',pkg.entertainment || 'Entertainment is package-specific and subject to the confirmed operating schedule.',[pkg.entertainment || 'Scheduled entertainment',(pkg.highlights || [])[0] || 'Waterfront views','Photo opportunities','Family-friendly atmosphere'],'★')}
    ${policies(pkg)}
    ${faqs(pkg)}
    <section class="ref-final-cta ref-product-final"><div><p class="eyebrow">Selected package</p><h2>Ready to Book ${esc(pkg.title)}?</h2><p>Complete the booking form above or send the package name and travel details on WhatsApp.</p></div><div><a class="primary" href="#clientBookingForm">Complete Booking Form</a><a class="secondary light" href="https://wa.me/${String(site.settings.whatsappNumber || '').replace(/\D/g,'')}?text=${encodeURIComponent(pkg.whatsappMessage || `Hello, I want to book ${pkg.title}.`)}">WhatsApp Us</a></div></section>`;
  app.insertAdjacentElement('afterend',wrapper);
  document.title = pkg.seoTitle || `${pkg.title} | Get Your Guide Dubai`;
}

let queued = false;
const queue = () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; render(); });
};
new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
queue();
setTimeout(queue,250);
setTimeout(queue,900);
