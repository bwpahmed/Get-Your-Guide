import { loadData } from './storage.js';

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

function enhancePackageEditor() {
  const form = document.querySelector('#item-form');
  const grid = form?.querySelector('.form-grid');
  if (!grid || grid.dataset.bookingFields === '1' || !form.querySelector('[name="categoryId"]')) return;

  const data = loadData();
  const slug = form.querySelector('[name="slug"]')?.value;
  const title = form.querySelector('[name="title"]')?.value;
  const item = data.packages.find(pkg => pkg.slug === slug) || data.packages.find(pkg => pkg.title === title) || {};
  const marker = [...grid.querySelectorAll('.cms-form-heading')].find(node => /Policies/i.test(node.textContent));
  const wrapper = document.createElement('div');
  wrapper.className = 'cms-booking-fields wide';
  wrapper.innerHTML = `
    <h3 class="cms-form-heading">Booking form and advertising</h3>
    <div class="form-grid cms-nested-grid">
      <label>Upper-deck charge per guest<input type="number" min="0" name="upperDeckCharge" value="${esc(item.upperDeckCharge ?? 25)}"></label>
      <label>Shared pickup charge per guest<input type="number" min="0" name="pickupPrice" value="${esc(item.pickupPrice ?? 35)}"></label>
      <label class="wide">Booking form notice<textarea name="bookingNotice">${esc(item.bookingNotice || 'Final availability and operator confirmation are required.')}</textarea></label>
      <label class="wide">Advertising conversion label<input name="conversionLabel" value="${esc(item.conversionLabel || item.slug || '')}" placeholder="Used in lead tracking events"></label>
    </div>`;
  if (marker) marker.before(wrapper);
  else grid.append(wrapper);
  grid.dataset.bookingFields = '1';
}

new MutationObserver(enhancePackageEditor).observe(document.documentElement,{childList:true,subtree:true});
enhancePackageEditor();
