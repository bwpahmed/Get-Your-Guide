import { loadData } from './storage.js';

const data = loadData();
const esc = (value = '') => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

function currentPackage() {
  const slug = new URLSearchParams(location.search).get('slug');
  if (slug) return data.packages.find(item => item.slug === slug && item.visible);
  const title = document.querySelector('#view-experience.active .page-head h1, body[data-page="package"] .page-head h1')?.textContent?.trim();
  return data.packages.find(item => item.title === title && item.visible);
}

function textCard(title, rows, wide = false) {
  const visible = rows.filter(([, value]) => value !== undefined && value !== null && value !== '');
  if (!visible.length) return '';
  return `<section class="detail-card ${wide ? 'complete-wide' : ''}"><div class="card-head"><div><p class="eyebrow">Selected package</p><h2>${esc(title)}</h2></div></div><div class="complete-info-list">${visible.map(([label,value])=>`<div><b>${esc(label)}</b><span>${esc(value)}</span></div>`).join('')}</div></section>`;
}

function itemList(title, items, negative = false, wide = false) {
  const unique = [...new Set((items || []).filter(Boolean))];
  if (!unique.length) return '';
  return `<section class="detail-card ${wide ? 'complete-wide' : ''}"><div class="card-head"><div><p class="eyebrow">Package details</p><h2>${esc(title)}</h2></div></div><div class="check-list ${negative ? 'negative' : ''}">${unique.map(item=>`<span>${negative?'×':'✓'} ${esc(item)}</span>`).join('')}</div></section>`;
}

function enhance() {
  const pkg = currentPackage();
  const target = document.querySelector('#view-experience.active .detail-grid, body[data-page="package"] .detail-grid');
  if (!pkg || !target) return;

  const existing = target.querySelector('[data-complete-package-info]');
  if (existing?.dataset.completePackageInfo === pkg.slug) return;
  existing?.remove();

  const faqs = pkg.faqs?.length ? `<section class="detail-card complete-wide"><div class="card-head"><div><p class="eyebrow">Before you book</p><h2>Frequently asked questions</h2></div></div><div class="faq-list">${pkg.faqs.map(item=>`<details><summary>${esc(item.question)}</summary><p>${esc(item.answer)}</p></details>`).join('')}</div></section>` : '';
  const info = document.createElement('div');
  info.className = 'complete-package-info';
  info.dataset.completePackageInfo = pkg.slug;
  info.innerHTML = `
    ${textCard('Package information', [
      ['Package level',pkg.level],['Booking mode',pkg.bookingMode],['Price unit',pkg.priceUnit],['Available days',pkg.availableDays],
      ['Duration',pkg.duration],['Capacity',pkg.capacity],['Minimum guests',pkg.minimumGuests],['Maximum guests',pkg.maximumGuests || 'Confirm for this package']
    ])}
    ${textCard('Boat, seating and decks', [
      ['Boat / vehicle name',pkg.boatName],['Boat / activity type',pkg.boatType],['Seating',pkg.seating],['Upper deck',pkg.upperDeckDetails],['Lower deck',pkg.lowerDeckDetails],['Air-conditioning',pkg.acDetails]
    ])}
    ${textCard('Food, drinks and entertainment', [
      ['Buffet / food',pkg.buffetDetails],['Drinks',pkg.drinks],['Entertainment',pkg.entertainment]
    ], true)}
    ${itemList('Views and highlights',[...(pkg.views||[]),...(pkg.highlights||[])])}
    ${textCard('Meeting, pickup and drop-off', [
      ['Meeting location',pkg.boardingLocation],['Meeting instructions',pkg.meetingInstructions],['Pickup',pkg.pickupDetails],['Drop-off',pkg.dropoffDetails],['Parking',pkg.parkingInfo]
    ])}
    ${textCard('Prices and age policy', [
      ['Offer price',`${data.settings.currency || 'AED'} ${Number(pkg.offerPrice||0).toLocaleString()} ${pkg.priceUnit||''}`],
      ['Adult price',pkg.adultPrice ? `${data.settings.currency || 'AED'} ${Number(pkg.adultPrice).toLocaleString()}` : 'Included in package / not applicable'],
      ['Child price',pkg.childPrice ? `${data.settings.currency || 'AED'} ${Number(pkg.childPrice).toLocaleString()}` : 'No separate child price'],
      ['Child policy',pkg.childAgePolicy],['Infant policy',pkg.infantPolicy]
    ])}
    ${textCard('Booking policies', [
      ['Payment method',pkg.paymentMethod],['Cancellation policy',pkg.cancellationPolicy],['Best suited for',pkg.bestSuitedFor]
    ], true)}
    ${itemList('Important notes',pkg.importantNotes || pkg.notes,false,true)}
    ${faqs}`;

  const bookingCard = target.querySelector('.booking-card');
  if (bookingCard) target.insertBefore(info, bookingCard);
  else target.append(info);

  document.querySelectorAll('.experience-gallery img,.variant-image img').forEach(image => {
    image.loading = 'lazy'; image.decoding = 'async';
  });
  if (pkg.seoTitle) document.title = pkg.seoTitle;
  if (pkg.metaDescription) {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.append(meta); }
    meta.content = pkg.metaDescription;
  }
}

let queued = false;
const queue = () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; enhance(); });
};

new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('popstate',queue);
document.addEventListener('click',event=>{if(event.target.closest('[data-open-package],[data-view="experience"],[data-go="experience"]'))setTimeout(queue,0);},true);
queue();
setTimeout(queue,120);
setTimeout(queue,600);
