import { loadData } from './storage.js';

const site = loadData();
const home = document.querySelector('[data-approved-home]');

if (home) {
  const esc = (value = '') => String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
  const money = value => `${site.settings.currency || 'AED'} ${Number(value || 0).toLocaleString()}`;
  const whatsapp = String(site.settings.whatsappNumber || '971554397575').replace(/\D/g, '');
  const packages = site.packages.filter(item => item.visible).sort((a,b) => (a.order || 0) - (b.order || 0));
  const categories = site.categories.filter(item => item.visible).sort((a,b) => (a.order || 0) - (b.order || 0));
  const featured = packages.filter(item => item.featured).slice(0,5);
  const byCategory = id => packages.filter(item => item.categoryId === id);
  const lowest = id => {
    const values = byCategory(id).map(item => Number(item.offerPrice || 0)).filter(Boolean);
    return values.length ? Math.min(...values) : 0;
  };

  const categoryLinks = {
    canal:'/dubai-canal-cruise/',
    marina:'/dubai-marina-cruise/',
    yachts:'/?category=yachts#packages',
    safari:'/?category=safari#packages'
  };

  const categoryCopy = {
    canal:['Dubai Canal Cruise','Modern skyline, Festival City and waterfront views','2 hours · Al Jaddaf'],
    marina:['Dubai Marina Cruise','JBR, Bluewaters and illuminated Marina skyline','2 hours · Dubai Marina'],
    yachts:['Private Yacht Rental','Flexible private charters for birthdays and groups','Hourly · Dubai Harbour'],
    safari:['Desert Safari Dubai','Dune bashing, camp dinner and live entertainment','6–7 hours · Dubai Desert']
  };

  function categoryCard(category) {
    const [title, copy, meta] = categoryCopy[category.id] || [category.name, category.description, 'Dubai experience'];
    return `<article class="approved-experience-card">
      <a href="${categoryLinks[category.id] || '#packages'}" class="approved-card-image"><img src="${esc(category.image)}" alt="${esc(title)}" loading="lazy" decoding="async"></a>
      <div class="approved-card-body"><p class="approved-kicker">${esc(category.kind || 'Experience')}</p><h3>${esc(title)}</h3><p>${esc(copy)}</p><span>${esc(meta)}</span><div class="approved-card-price"><small>From</small><strong>${money(lowest(category.id))}</strong></div><a class="approved-gold-button" href="${categoryLinks[category.id] || '#packages'}">View Packages</a></div>
    </article>`;
  }

  function packageCard(item) {
    const inclusions = (item.inclusions || []).slice(0,4);
    return `<article class="approved-package-card" data-package-category="${esc(item.categoryId)}">
      <div class="approved-package-image"><img src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy" decoding="async">${item.badges?.[0] ? `<span>${esc(item.badges[0])}</span>` : ''}</div>
      <div class="approved-package-body"><p>${esc(item.level)} · ${esc(item.location)}</p><h3>${esc(item.title)}</h3><div class="approved-package-meta"><span>${esc(item.duration)}</span><span>${esc(item.boardingLocation)}</span></div><ul>${inclusions.map(value => `<li>${esc(value)}</li>`).join('')}</ul><div class="approved-package-bottom"><div><small>Starting from</small><strong>${money(item.offerPrice)}</strong><span>${esc(item.priceUnit || 'per person')}</span></div><a href="/package.html?slug=${encodeURIComponent(item.slug)}">View Details</a></div></div>
    </article>`;
  }

  const experienceSelect = document.querySelector('#approvedExperience');
  const timeSelect = document.querySelector('#approvedTime');
  const dateInput = document.querySelector('#approvedDate');
  const quickForm = document.querySelector('#approvedQuickForm');
  const packageGrid = document.querySelector('#approvedPackageGrid');
  const categoryGrid = document.querySelector('#approvedCategoryGrid');
  const compareButtons = [...document.querySelectorAll('[data-approved-filter]')];

  if (categoryGrid) categoryGrid.innerHTML = categories.map(categoryCard).join('') + `<article class="approved-experience-card approved-coming-soon"><div class="approved-card-image"><img src="https://images.pexels.com/photos/2245436/pexels-photo-2245436.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="Dubai Creek dhow cruise" loading="lazy"></div><div class="approved-card-body"><p class="approved-kicker">Coming soon</p><h3>Dubai Creek Cruise</h3><p>Heritage route packages will appear after real vessels, prices and boarding points are confirmed.</p><span>Deira · Bur Dubai · Al Seef</span><a class="approved-outline-button" href="https://wa.me/${whatsapp}?text=${encodeURIComponent('Hello, please notify me when verified Dubai Creek cruise packages are available.')}" target="_blank" rel="noopener">Register Interest</a></div></article>`;

  function renderPackages(category = 'canal') {
    const matching = category === 'all' ? featured : byCategory(category).slice(0,5);
    if (packageGrid) packageGrid.innerHTML = matching.map(packageCard).join('');
    compareButtons.forEach(button => button.classList.toggle('active', button.dataset.approvedFilter === category));
  }

  function updateTimes() {
    const selected = packages.find(item => item.id === experienceSelect?.value) || featured[0] || packages[0];
    if (!timeSelect || !selected) return;
    timeSelect.innerHTML = (selected.timeSlots || []).map(slot => `<option value="${esc(slot.label)} — ${esc(slot.sailingTime || slot.boardingTime)}">${esc(slot.label)} · ${esc(slot.sailingTime || slot.boardingTime)}</option>`).join('') || '<option>Confirm on WhatsApp</option>';
  }

  if (experienceSelect) {
    experienceSelect.innerHTML = categories.map(category => `<optgroup label="${esc(category.name)}">${byCategory(category.id).map(item => `<option value="${esc(item.id)}">${esc(item.title)} · ${money(item.offerPrice)}</option>`).join('')}</optgroup>`).join('');
    const initial = featured[0] || packages[0];
    if (initial) experienceSelect.value = initial.id;
    experienceSelect.addEventListener('change', updateTimes);
    updateTimes();
  }

  if (dateInput) {
    const today = new Date();
    const max = new Date(); max.setFullYear(max.getFullYear() + 1);
    const iso = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    dateInput.min = iso(today); dateInput.max = iso(max); dateInput.value = iso(today);
  }

  quickForm?.addEventListener('submit', event => {
    event.preventDefault();
    const selected = packages.find(item => item.id === experienceSelect.value);
    if (!selected) return;
    const data = new FormData(quickForm);
    const message = [
      '*Website Availability Request*',
      `Package: ${selected.title}`,
      `Date: ${data.get('date')}`,
      `Time: ${data.get('time')}`,
      `Adults: ${data.get('adults')}`,
      `Children: ${data.get('children')}`,
      `Infants: ${data.get('infants')}`,
      `Starting price: ${money(selected.offerPrice)} ${selected.priceUnit || ''}`,
      '',
      'Please confirm availability, final price and boarding details.'
    ].join('\n');
    window.dataLayer?.push({ event:'generate_lead', package_id:selected.id, package_name:selected.title, currency:site.settings.currency || 'AED' });
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });

  compareButtons.forEach(button => button.addEventListener('click', () => renderPackages(button.dataset.approvedFilter)));
  renderPackages('canal');

  const menu = document.querySelector('#approvedMobileMenu');
  document.querySelector('#approvedMenuButton')?.addEventListener('click', () => menu?.classList.toggle('open'));
  document.querySelectorAll('#approvedMobileMenu a').forEach(link => link.addEventListener('click', () => menu?.classList.remove('open')));

  document.querySelectorAll('[data-current-year]').forEach(node => { node.textContent = String(new Date().getFullYear()); });
}
