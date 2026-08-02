import { loadData } from './storage.js';

const data = loadData();
const esc = (value = '') => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const cruisePackages = data.packages.filter(item => item.visible && ['canal','marina'].includes(item.categoryId));
const premium = cruisePackages.find(item => item.level === 'Premium') || cruisePackages[0];
const luxury = cruisePackages.find(item => ['Luxury','5-Star'].includes(item.level)) || cruisePackages[1] || premium;
const whatsapp = String(data.settings.whatsappNumber || '971554397575').replace(/\D/g,'');

function node(markup) {
  const template = document.createElement('template');
  template.innerHTML = markup.trim();
  return template.content.firstElementChild;
}

function menuMarkup() {
  const buffet = premium?.buffetDetails || 'International buffet dinner with vegetarian and non-vegetarian dishes. Final menu depends on the selected package.';
  return `<section class="review-wrap home-dinner-menu" data-home-dinner-menu>
    <div class="home-section-head centered">
      <p class="eyebrow">Package-specific dining</p>
      <h2>Dinner Menu Highlights</h2>
      <p>${esc(buffet)}</p>
    </div>
    <div class="home-menu-layout">
      <article class="home-menu-visual"><img src="${esc(premium?.gallery?.[1] || premium?.image || data.settings.heroImage)}" alt="Dubai cruise dinner experience" loading="lazy" decoding="async"><div><span>Buffet dinner</span><b>Menu depends on the selected package level</b></div></article>
      <div class="home-menu-cards">
        <article><span>01</span><h3>Vegetarian Options</h3><p>Fresh salads, mezze, vegetable starters, rice, vegetarian mains and seasonal fruit.</p></article>
        <article><span>02</span><h3>Non-Vegetarian Options</h3><p>Chicken, fish, selected BBQ items, rice dishes and package-specific main courses.</p></article>
        <article><span>03</span><h3>Desserts & Drinks</h3><p>Dessert selection, water and soft drinks, with tea, coffee or welcome drinks where listed.</p></article>
      </div>
    </div>
    <p class="home-menu-note">Exact buffet items, live stations and beverages are confirmed with the selected package before payment.</p>
  </section>`;
}

function celebrationMarkup() {
  return `<section class="review-wrap home-celebration-section" data-home-celebrations>
    <div class="home-celebration-copy">
      <p class="eyebrow">Special occasions on the water</p>
      <h2>Celebrate in Style on a Dubai Cruise</h2>
      <p>Choose a shared dinner cruise or private charter for birthdays, anniversaries, family gatherings and corporate events. Decoration, cake, private setup and entertainment remain package-specific.</p>
      <div class="home-celebration-actions"><a class="primary" href="${luxury ? `/package.html?slug=${encodeURIComponent(luxury.slug)}` : '/?view=comparison'}">View Cruise Packages</a><a class="secondary" href="https://wa.me/${whatsapp}?text=${encodeURIComponent('Hello, I want to arrange a celebration on a Dubai cruise.')}" target="_blank" rel="noopener">Plan on WhatsApp</a></div>
    </div>
    <div class="home-celebration-grid">
      <article><span>🎂</span><h3>Birthday Celebrations</h3><p>Ask about cake, balloons, table decoration and announcement options.</p></article>
      <article><span>♡</span><h3>Anniversaries</h3><p>Choose preferred seating, dinner level and a simple celebration setup.</p></article>
      <article><span>◈</span><h3>Corporate Events</h3><p>Compare shared group bookings with private charter arrangements.</p></article>
      <article><span>✦</span><h3>Special Occasions</h3><p>Confirm guest count, timing, catering, decoration and entertainment before payment.</p></article>
    </div>
  </section>`;
}

function installExtras() {
  const overview = document.querySelector('#view-overview.active');
  if (!overview || overview.querySelector('[data-home-dinner-menu]')) return;
  const guide = overview.querySelector('.home-guide-section');
  if (!guide) return;
  const menu = node(menuMarkup());
  const celebration = node(celebrationMarkup());
  guide.before(menu, celebration);
}

let queued = false;
function queueInstall() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; installExtras(); });
}

new MutationObserver(queueInstall).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click', event => {
  if (event.target.closest('[data-view="overview"],[data-go="overview"]')) setTimeout(queueInstall,0);
}, true);
queueInstall();
setTimeout(queueInstall,300);
setTimeout(queueInstall,950);
