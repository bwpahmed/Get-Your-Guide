import { loadData } from './storage.js';

const data = loadData();
const slug = new URLSearchParams(location.search).get('slug');
const pkg = data.packages.find(item => item.slug === slug && item.visible);
const esc = (value = '') => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const list = (title, items, negative = false) => items?.length ? `<article class="detail-card"><h2>${esc(title)}</h2><div class="check-list ${negative?'negative':''}">${items.map(item=>`<span>${negative?'×':'✓'} ${esc(item)}</span>`).join('')}</div></article>` : '';
const textCard = (title, rows) => {
  const visible = rows.filter(([, value]) => value !== undefined && value !== null && value !== '');
  return visible.length ? `<article class="detail-card"><h2>${esc(title)}</h2><div class="complete-info-list">${visible.map(([label,value])=>`<div><b>${esc(label)}</b><span>${esc(value)}</span></div>`).join('')}</div></article>` : '';
};

function enhance() {
  if (!pkg || document.querySelector('[data-complete-package-info]')) return;
  const target = document.querySelector('.detail-main');
  if (!target) return;
  const faqs = pkg.faqs?.length ? `<article class="detail-card complete-wide"><h2>Frequently asked questions</h2><div class="faq-list">${pkg.faqs.map(item=>`<details><summary>${esc(item.question)}</summary><p>${esc(item.answer)}</p></details>`).join('')}</div></article>` : '';
  const content = `
    <div data-complete-package-info class="complete-package-info">
      ${textCard('Package information', [
        ['Package level', pkg.level], ['Booking mode', pkg.bookingMode], ['Price unit', pkg.priceUnit], ['Available days', pkg.availableDays],
        ['Duration', pkg.duration], ['Capacity', pkg.capacity], ['Minimum guests', pkg.minimumGuests], ['Maximum guests', pkg.maximumGuests || 'No fixed maximum shown']
      ])}
      ${textCard('Boat, seating and decks', [
        ['Boat name', pkg.boatName], ['Boat / activity type', pkg.boatType], ['Seating', pkg.seating], ['Upper deck', pkg.upperDeckDetails], ['Lower deck', pkg.lowerDeckDetails], ['Air-conditioning', pkg.acDetails]
      ])}
      ${textCard('Food, drinks and entertainment', [
        ['Buffet / food', pkg.buffetDetails], ['Drinks', pkg.drinks], ['Entertainment', pkg.entertainment]
      ])}
      ${list('Views and highlights', [...(pkg.views||[]), ...(pkg.highlights||[])])}
      ${textCard('Meeting, pickup and drop-off', [
        ['Meeting location', pkg.boardingLocation], ['Meeting instructions', pkg.meetingInstructions], ['Pickup', pkg.pickupDetails], ['Drop-off', pkg.dropoffDetails], ['Parking', pkg.parkingInfo]
      ])}
      ${textCard('Prices and age policy', [
        ['Offer price', `AED ${Number(pkg.offerPrice||0).toLocaleString()} ${pkg.priceUnit||''}`],
        ['Adult price', pkg.adultPrice ? `AED ${Number(pkg.adultPrice).toLocaleString()}` : 'Included in charter price / not applicable'],
        ['Child price', pkg.childPrice ? `AED ${Number(pkg.childPrice).toLocaleString()}` : 'No separate child price'],
        ['Child policy', pkg.childAgePolicy], ['Infant policy', pkg.infantPolicy]
      ])}
      ${textCard('Booking policies', [
        ['Payment method', pkg.paymentMethod], ['Cancellation policy', pkg.cancellationPolicy], ['Best suited for', pkg.bestSuitedFor]
      ])}
      ${list('Important notes', pkg.importantNotes || pkg.notes)}
      ${faqs}
    </div>`;
  target.insertAdjacentHTML('beforeend', content);
  if (pkg.seoTitle) document.title = pkg.seoTitle;
  if (pkg.metaDescription) {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.append(meta); }
    meta.content = pkg.metaDescription;
  }
}

const observer = new MutationObserver(enhance);
observer.observe(document.documentElement, { childList: true, subtree: true });
enhance();
setTimeout(enhance, 100);
setTimeout(enhance, 500);
