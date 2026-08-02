import { loadSeoContent } from './seo-content-data.js';
import { loadData } from './storage.js';

const content = loadSeoContent();
const site = loadData();
const esc = (value = '') => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const money = value => `${site.settings.currency || 'AED'} ${Number(value || 0).toLocaleString()}`;
const pageCategory = {
  'dubai-canal-cruise':'canal',
  'dubai-marina-cruise':'marina',
  'dubai-creek-cruise':'creek',
  'dhow-cruise-dubai':'all-cruises',
  'new-year-dubai-cruise':'new-year'
};

function visiblePackages(category) {
  const packages = site.packages.filter(pkg => pkg.visible).sort((a,b) => (a.order || 0) - (b.order || 0));
  if (category === 'all-cruises') return packages.filter(pkg => ['canal','marina'].includes(pkg.categoryId)).slice(0,8);
  if (category === 'new-year') return packages.filter(pkg => ['canal','marina'].includes(pkg.categoryId) && ['Premium','Luxury','4-Star','5-Star','Private Charter'].includes(pkg.level)).slice(0,6);
  if (category === 'creek') return packages.filter(pkg => pkg.categoryId === 'canal').slice(0,6).map(pkg => ({ ...pkg, title:pkg.title.replace(/Dubai Water Canal|Dubai Canal/gi,'Dubai Creek'), location:'Dubai Creek' }));
  return packages.filter(pkg => pkg.categoryId === category).slice(0,8);
}

function packageUrl(pkg) {
  return `/package.html?slug=${encodeURIComponent(pkg.slug)}`;
}

function packageCard(pkg) {
  const save = Math.max(0, Number(pkg.originalPrice || 0) - Number(pkg.offerPrice || 0));
  const topIncludes = (pkg.inclusions || []).slice(0,3);
  return `<article class="ref-package-card">
    <div class="ref-package-image">
      <img src="${esc(pkg.image)}" alt="${esc(pkg.title)}" loading="lazy" decoding="async">
      ${save ? `<span class="ref-save">Save ${money(save)}</span>` : ''}
      ${(pkg.badges || []).slice(0,1).map(badge => `<span class="ref-badge">${esc(badge)}</span>`).join('')}
    </div>
    <div class="ref-package-body">
      <p class="ref-package-type">${esc(pkg.level)} · ${esc(pkg.location)}</p>
      <h3>${esc(pkg.title)}</h3>
      <div class="ref-package-meta"><span>◷ ${esc(pkg.duration)}</span><span>★ ${esc(pkg.rating || '4.8')}</span></div>
      <div class="ref-price"><strong>${money(pkg.offerPrice)}</strong><span>${esc(pkg.priceUnit || 'per person')}</span>${pkg.originalPrice ? `<del>${money(pkg.originalPrice)}</del>` : ''}</div>
      <div class="ref-package-tabs">
        <button type="button" data-package-tab="includes">Inclusions</button>
        <button type="button" data-package-tab="sights">Sightseeing</button>
        <button type="button" data-package-tab="food">Food Menu</button>
        <button type="button" data-package-tab="location">Location</button>
      </div>
      <div class="ref-package-tab-panel" data-tab-panel>${topIncludes.map(item => `<span>✓ ${esc(item)}</span>`).join('')}</div>
      <p class="ref-package-copy">${esc(pkg.shortDescription || pkg.description || '')}</p>
      <div class="ref-package-actions"><a class="primary" href="${packageUrl(pkg)}">View Details</a><a class="secondary" href="https://wa.me/${String(site.settings.whatsappNumber || '').replace(/\D/g,'')}?text=${encodeURIComponent(pkg.whatsappMessage || `Hello, I want to book ${pkg.title}.`)}">WhatsApp</a></div>
    </div>
  </article>`;
}

function packageSection(category, heading, intro) {
  const packages = visiblePackages(category);
  if (!packages.length) return '';
  return `<section class="ref-section ref-packages" id="packages">
    <div class="ref-section-head"><div><p class="eyebrow">Compare before booking</p><h2>${esc(heading)}</h2><p>${esc(intro)}</p></div></div>
    <div class="ref-package-grid">${packages.map(packageCard).join('')}</div>
  </section>`;
}

function featureStrip(category) {
  const items = category === 'new-year' ? [
    ['✦','Special Event Planning','Package-specific check-in and route'],['◷','Extended Timings','Event schedule shown clearly'],['⌖','Viewing Zones','Confirmed route before payment'],['✓','Clear Policies','Seating and cancellation details']
  ] : [
    ['◈','Complete Experience','Dining, sightseeing and entertainment'],['✓','Verified Details','Exact package information before travel'],['◷','Flexible Timings','Multiple daily or private slots'],['AED','Clear Value','Compare every inclusion and upgrade']
  ];
  return `<section class="ref-trust-strip">${items.map(([icon,title,copy]) => `<article><span>${icon}</span><div><b>${esc(title)}</b><small>${esc(copy)}</small></div></article>`).join('')}</section>`;
}

function hero(page, category) {
  const packages = visiblePackages(category);
  const image = packages[0]?.image || site.settings.heroImage;
  const label = category === 'new-year' ? 'Dubai special-event cruises' : page.eyebrow || 'Dubai dinner cruise';
  return `<section class="ref-hero" style="--hero-image:url('${esc(image)}')">
    <div class="ref-hero-overlay"></div>
    <div class="ref-hero-content">
      <p class="eyebrow">${esc(label)}</p>
      <h1>${esc(page.title)}</h1>
      <p>${esc(page.intro || '')}</p>
      <div class="ref-hero-actions"><a class="primary" href="#packages">View Packages</a><a class="secondary light" href="https://wa.me/${String(site.settings.whatsappNumber || '').replace(/\D/g,'')}">Book on WhatsApp</a></div>
    </div>
  </section>`;
}

function sectionByTitle(page, pattern) {
  return (page.sections || []).find(section => section.visible !== false && pattern.test(section.title));
}

function cardsFromSection(section, limit = 8) {
  if (!section) return '';
  const items = section.items?.length ? section.items : [section.body].filter(Boolean);
  return `<section class="ref-section ref-icon-section">
    <div class="ref-section-head centered"><p class="eyebrow">Experience overview</p><h2>${esc(section.title)}</h2>${section.body && section.items?.length ? `<p>${esc(section.body)}</p>` : ''}</div>
    <div class="ref-icon-grid">${items.slice(0,limit).map((item,index) => `<article><span>${['◈','✦','✓','⌖','◷','★','☼','♡'][index%8]}</span><h3>${esc(String(item).split(':')[0])}</h3><p>${esc(String(item).includes(':') ? String(item).split(':').slice(1).join(':').trim() : item)}</p></article>`).join('')}</div>
  </section>`;
}

function narrativeSection(section, index) {
  if (!section || section.visible === false) return '';
  const items = section.items || [];
  const visual = index % 2 ? 'right' : 'left';
  return `<section class="ref-section ref-story ${visual}">
    <div class="ref-story-copy">
      <p class="eyebrow">Plan your experience</p>
      <h2>${esc(section.title)}</h2>
      ${section.body ? `<p>${esc(section.body)}</p>` : ''}
      ${items.length ? `<ul>${items.map(item => `<li>✓ ${esc(item)}</li>`).join('')}</ul>` : ''}
      <a href="#packages" class="ref-text-link">Compare matching packages →</a>
    </div>
    <div class="ref-story-visual"><span>${String(index+1).padStart(2,'0')}</span><b>${esc(section.title)}</b><small>Editable from the SEO Pages section in /admin</small></div>
  </section>`;
}

function menuSection(category) {
  const packages = visiblePackages(category);
  const packageWithFood = packages.find(pkg => pkg.buffetDetails) || packages[0];
  const buffet = packageWithFood?.buffetDetails || 'International buffet with vegetarian and non-vegetarian dishes. Final menu depends on the selected package.';
  const columns = [
    ['Vegetarian Options',['Fresh salads and mezze','Vegetable starters','Rice and vegetarian mains','Fresh seasonal fruit']],
    ['Non-Vegetarian Options',['Chicken and fish dishes','Selected BBQ items','Rice and curry dishes','Package-specific main courses']],
    ['Desserts & Drinks',['Dessert selection','Water and soft drinks','Tea and coffee where listed','Welcome drink where included']]
  ];
  return `<section class="ref-section ref-menu">
    <div class="ref-section-head centered"><p class="eyebrow">Package-specific dining</p><h2>Dinner Menu Highlights</h2><p>${esc(buffet)}</p></div>
    <div class="ref-menu-grid">${columns.map(([title,items],i) => `<article><span>${['🥗','🍖','🍰'][i]}</span><h3>${title}</h3><ul>${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul></article>`).join('')}</div>
  </section>`;
}

function bookingSteps() {
  return `<section class="ref-section ref-steps"><div class="ref-section-head centered"><p class="eyebrow">Simple booking process</p><h2>How to Book Your Dubai Cruise</h2><p>Choose the exact package first, then send one complete request with the date, guests and preferred options.</p></div><div class="ref-step-grid">
    <article><span>1</span><h3>Choose Date & Package</h3><p>Compare the route, price, menu, seating, timing and inclusions.</p></article>
    <article><span>2</span><h3>Complete Booking Details</h3><p>Add adults, children, deck preference, pickup and optional upgrades.</p></article>
    <article><span>3</span><h3>Receive Confirmation</h3><p>Get the final availability, boarding point and operator confirmation on WhatsApp.</p></article>
  </div><div class="ref-inline-cta"><strong>Ready to book your cruise?</strong><a class="primary" href="#packages">View Packages</a></div></section>`;
}

function seasonsSection() {
  const seasons = [
    ['Winter','November – March','Cool evenings and popular upper-deck weather.'],
    ['Spring','April – May','Warm evenings with good sunset conditions.'],
    ['Summer','June – September','Use the air-conditioned lower deck and later departures.'],
    ['Autumn','October – November','Cooling weather and comfortable evening trips.']
  ];
  return `<section class="ref-section ref-seasons"><div class="ref-section-head centered"><p class="eyebrow">Plan around the weather</p><h2>The Ideal Time to Take a Cruise</h2></div><div class="ref-season-grid">${seasons.map(([title,months,copy],index) => `<article class="${index===0?'best':''}">${index===0?'<span>BEST TIME</span>':''}<h3>${title}</h3><b>${months}</b><p>${copy}</p></article>`).join('')}</div><aside class="ref-pro-tip"><b>Pro Tip</b><p>Confirm the exact trip time and deck before travel. Weekends and special-event dates usually sell earlier.</p></aside></section>`;
}

function sightsSection(page) {
  const sights = sectionByTitle(page,/sights|landmarks|area/i);
  const items = sights?.items || ['Waterfront skyline','Illuminated bridges','Modern city views','Photo opportunities','Route-specific landmarks','Evening reflections'];
  return `<section class="ref-section ref-sights"><div class="ref-section-head centered"><p class="eyebrow">Route highlights</p><h2>Top Sights & Attractions to See</h2><p>Visibility depends on the selected route, vessel, duration and marine instructions.</p></div><div class="ref-sight-grid">${items.slice(0,6).map(item => `<article><div></div><h3>${esc(String(item).split(' - ')[0])}</h3><p>${esc(String(item).split(' - ').slice(1).join(' - ') || 'Included where the confirmed route passes this landmark.')}</p></article>`).join('')}</div></section>`;
}

function seatingSection(category) {
  const newYear = category === 'new-year';
  const decks = newYear ? [
    ['Lower Deck','Climate-Controlled Comfort',['Air-conditioned seating','Dining near the buffet','Suitable for families']],
    ['Upper Deck','Open-Air Views',['Fresh-air experience','Stronger photo opportunities','Route-dependent viewing']],
    ['VIP Seating','Reserved Experience',['Priority table allocation','Package-specific service','Limited availability']]
  ] : [
    ['Upper Deck','Open-Air Seating',['Panoramic route views','Fresh evening air','Popular for photography']],
    ['Lower Deck','Air-Conditioned Comfort',['Climate-controlled seating','Cushioned dining area','Better during hot weather']]
  ];
  return `<section class="ref-section ref-seating"><div class="ref-section-head centered"><p class="eyebrow">Choose your comfort</p><h2>Sitting Options: Upper Deck & Lower Deck</h2><p>Deck allocation must match the selected package. Guaranteed seating may carry an extra charge.</p></div><div class="ref-deck-grid">${decks.map(([title,subtitle,items]) => `<article><div class="ref-deck-art"></div><p class="eyebrow">${esc(subtitle)}</p><h3>${esc(title)}</h3><ul>${items.map(item=>`<li>✓ ${esc(item)}</li>`).join('')}</ul></article>`).join('')}</div></section>`;
}

function celebrationSection(category) {
  const title = category === 'new-year' ? 'Celebrate New Year in Style' : 'Celebrate in Style on a Dubai Cruise';
  const options = category === 'new-year' ? ['Countdown Moments','Festive Decorations','Party Ambiance','Special Event Service'] : ['Birthday Celebrations','Anniversaries','Corporate Events','Special Occasions'];
  return `<section class="ref-section ref-celebrations"><div class="ref-section-head centered"><p class="eyebrow">Special occasions</p><h2>${title}</h2><p>Add celebration requirements inside the booking form so the team can confirm the exact setup and price.</p></div><div class="ref-celebration-grid">${options.map((option,index)=>`<article><span>${['🎂','♡','◈','✦'][index]}</span><h3>${option}</h3><p>Decoration, cake, private setup or entertainment can be arranged where available.</p></article>`).join('')}</div></section>`;
}

function entertainmentSection(category) {
  const items = category === 'new-year' ? [
    ['Live DJ & Dance Party',['Event music','Countdown program','Package-specific entertainment']],
    ['Fireworks Viewing Experience',['Confirmed viewing zone','Midnight atmosphere','Photo opportunities']],
    ['Midnight Celebration',['Countdown moment','Party setup','Operator-confirmed inclusions']]
  ] : [
    ['Live Music & Background Music',['Route-specific program','Family atmosphere','Confirmed vessel schedule']],
    ['Cultural Shows',['Tanoura or listed performance','Package-specific timing','Family entertainment']],
    ['Photo Opportunities',['Skyline backdrop','Waterfront lights','Open-deck views']]
  ];
  return `<section class="ref-section ref-entertainment"><div class="ref-section-head centered"><p class="eyebrow">Onboard experience</p><h2>${category==='new-year'?'New Year Entertainment & Live Experiences':'Entertainment Options on Dubai Cruise'}</h2></div><div class="ref-entertainment-grid">${items.map(([title,points])=>`<article><div class="ref-entertainment-art"></div><h3>${title}</h3>${points.map(point=>`<span>✓ ${esc(point)}</span>`).join('')}</article>`).join('')}</div></section>`;
}

function policiesSection(category) {
  if (category !== 'new-year') return '';
  const policies = [
    ['A. Boarding & Check-In','Use the package-specific arrival window. Late boarding may not be possible after road or marine access closes.'],
    ['B. Seating Options','The purchased deck and seating category control table allocation.'],
    ['C. Food & Beverage','Only the confirmed event menu and listed drinks are included.'],
    ['D. Safety & Prohibited Items','Guests must follow vessel, venue and authority instructions.'],
    ['E. Transportation','Road closures and pickup restrictions can change normal travel times.'],
    ['F. Booking & Payment','Full guest details and advance payment may be required.'],
    ['G. Cancellation Policy','Use the exact package policy; special-event bookings often have stricter terms.'],
    ['K. Confirmation Delivery','Keep the final voucher, boarding pin and contact details available offline.']
  ];
  return `<section class="ref-section ref-policies"><div class="ref-section-head centered"><p class="eyebrow">Read before payment</p><h2>Important Information & Policies</h2><p>Every field below remains editable from the admin CMS and must be operator-confirmed.</p></div><div class="ref-policy-grid">${policies.map(([title,copy])=>`<article><h3>${title}</h3><p>${copy}</p></article>`).join('')}</div></section>`;
}

function faqSection(category) {
  const questions = category === 'new-year' ? [
    ['What is included in the New Year package?','The selected package page lists the confirmed route, food, seating, entertainment and transport.'],
    ['What time does boarding start?','Use the exact time on the final confirmation because special-event access can close early.'],
    ['Are fireworks views guaranteed?','Only a confirmed viewing zone should be treated as included; routes can change under authority instructions.'],
    ['What is the cancellation policy?','The package-specific policy applies and may be stricter for 31 December.']
  ] : [
    ['What is included in the cruise?','The selected package displays its buffet, drinks, entertainment, route and deck information.'],
    ['How long is the cruise?','Most shared cruises are around two hours; private charter duration is configurable.'],
    ['What are the timings?','Available departures appear in the selected package booking form.'],
    ['Can I choose the deck?','Deck selection depends on the package and may require an upgrade.'],
    ['Where is the boarding point?','The exact gate and Google Maps pin are sent after confirmation.']
  ];
  return `<section class="ref-section ref-faq"><div class="ref-section-head centered"><p class="eyebrow">Before you book</p><h2>Frequently Asked Questions</h2></div><div class="ref-faq-list">${questions.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></section>`;
}

function finalCta(page, category) {
  return `<section class="ref-final-cta"><div><p class="eyebrow">Final availability required</p><h2>${category==='new-year'?'Ready to Book Your New Year Cruise?':`Ready to Book Your ${esc(page.title.replace(/Guide|Dubai/gi,'').trim())}?`}</h2><p>Choose a package and send the date, guest count and required options in one structured request.</p></div><div><a class="primary" href="#packages">View Packages</a><a class="secondary light" href="https://wa.me/${String(site.settings.whatsappNumber || '').replace(/\D/g,'')}">WhatsApp Us</a></div></section>`;
}

function bindPackageTabs(root) {
  root.querySelectorAll('.ref-package-card').forEach(card => {
    const pkgTitle = card.querySelector('h3')?.textContent;
    const pkg = site.packages.find(item => item.title === pkgTitle) || visiblePackages(document.body.dataset.seoPage)[0];
    card.querySelectorAll('[data-package-tab]').forEach(button => {
      button.addEventListener('click', () => {
        const type = button.dataset.packageTab;
        const values = type === 'includes' ? pkg?.inclusions : type === 'sights' ? pkg?.landmarks : type === 'food' ? [pkg?.buffetDetails || 'Menu is shown in the selected package details.'] : [pkg?.boardingLocation || pkg?.location];
        card.querySelector('[data-tab-panel]').innerHTML = (values || []).slice(0,4).map(item => `<span>✓ ${esc(item)}</span>`).join('');
        card.querySelectorAll('[data-package-tab]').forEach(btn => btn.classList.toggle('active',btn===button));
      });
    });
  });
}

function landingMarkup(page, category) {
  const keySections = (page.sections || []).filter(section => section.visible !== false);
  const why = sectionByTitle(page,/why/i) || keySections[0];
  const about = sectionByTitle(page,/about|experience|overview/i) || keySections[1];
  const choose = sectionByTitle(page,/choos|right cruise/i) || keySections[2];
  const extra = keySections.filter(section => ![why,about,choose].includes(section)).slice(0,4);
  const packageHeading = category === 'new-year' ? 'New Year Cruise Packages' : category === 'all-cruises' ? 'Best Dinner Cruises & Tours in Dubai' : `Our ${page.title.replace(/Guide/gi,'').trim()} Packages`;
  return `<main class="ref-page" data-reference-page="${esc(page.slug)}">
    ${hero(page,category)}
    ${featureStrip(category)}
    ${packageSection(category,packageHeading,'Compare the exact price, route, menu, seating, timing and optional upgrades before booking.')}
    ${cardsFromSection(why)}
    ${narrativeSection(choose,0)}
    ${narrativeSection(about,1)}
    ${category==='new-year' ? policiesSection(category) : ''}
    ${extra.map((section,index)=>narrativeSection(section,index+2)).join('')}
    ${menuSection(category)}
    ${bookingSteps()}
    ${seasonsSection()}
    ${sightsSection(page)}
    ${seatingSection(category)}
    ${celebrationSection(category)}
    ${entertainmentSection(category)}
    ${faqSection(category)}
    ${finalCta(page,category)}
  </main>`;
}

function homeMarkup(page) {
  const featured = site.packages.filter(pkg => pkg.visible && pkg.featured).slice(0,8);
  const categories = site.categories.filter(category => category.visible).sort((a,b)=>(a.order||0)-(b.order||0));
  return `<section class="ref-home-content" data-seo-content="home">
    <section class="ref-section ref-home-heading"><div class="ref-section-head centered"><p class="eyebrow">Compare Dubai experiences</p><h2>${esc(page.title)}</h2><p>${esc(page.intro)}</p></div></section>
    <section class="ref-category-grid">${categories.map(category=>`<a href="${category.id==='canal'?'/dubai-canal-cruise/':category.id==='marina'?'/dubai-marina-cruise/':category.id==='yachts'?'/?category=yachts#packages':'/?category=safari#packages'}"><img src="${esc(category.image)}" alt="${esc(category.name)}"><div><h3>${esc(category.name)}</h3><p>${esc(category.description)}</p><span>Explore →</span></div></a>`).join('')}</section>
    <section class="ref-section ref-packages"><div class="ref-section-head"><div><p class="eyebrow">Best-selling experiences</p><h2>Choose the Right Package for You</h2><p>Prices alone do not explain the experience. Compare dining, route, seating, timings and service level.</p></div></div><div class="ref-package-grid">${featured.map(packageCard).join('')}</div></section>
    ${featureStrip('home')}
    <section class="ref-section ref-help-grid"><article><p class="eyebrow">Personal support</p><h2>Need Help Choosing?</h2><p>Send your budget, location, date and group size. The team can shortlist the right cruise, yacht or safari.</p><a class="primary" href="https://wa.me/${String(site.settings.whatsappNumber||'').replace(/\D/g,'')}">Ask on WhatsApp</a></article><article><p class="eyebrow">Larger bookings</p><h2>Group Discounts Available!</h2><p>Schools, companies, families, events and tour groups can request package-specific group pricing.</p><a class="secondary" href="#packages">View Packages</a></article></section>
    <section class="ref-section ref-guide-links"><div class="ref-section-head centered"><p class="eyebrow">Detailed planning guides</p><h2>The Ultimate Guide to Dubai Dhow Cruise</h2><p>Explore each route in the same commercial page structure as the packages, not as a pile of disconnected SEO paragraphs.</p></div><div>${[['Canal','/dubai-canal-cruise/'],['Marina','/dubai-marina-cruise/'],['Creek','/dubai-creek-cruise/'],['Dhow Guide','/dhow-cruise-dubai/'],['New Year','/new-year-dubai-cruise/']].map(([label,href])=>`<a href="${href}">${label}<span>→</span></a>`).join('')}</div></section>
  </section>`;
}

function renderLandingPage() {
  const slug = document.body.dataset.seoPage;
  const page = content[slug];
  const root = document.querySelector('#seo-page-root');
  if (!page || !root) return false;
  const category = pageCategory[slug] || 'all-cruises';
  root.innerHTML = landingMarkup(page,category);
  bindPackageTabs(root);
  document.title = `${page.title} | Get Your Guide Dubai`;
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.append(meta); }
  meta.content = page.intro;
  return true;
}

function renderHomeContent() {
  if (document.querySelector('[data-seo-content="home"]')) return;
  const overview = document.querySelector('#view-overview, [data-view-panel="overview"], .view.active, main');
  if (!overview) return;
  const holder = document.createElement('div');
  holder.innerHTML = homeMarkup(content.home);
  overview.append(holder.firstElementChild);
  bindPackageTabs(overview);
}

if (!renderLandingPage()) {
  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; renderHomeContent(); });
  };
  new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
  queue();
  setTimeout(queue,200);
  setTimeout(queue,800);
}
