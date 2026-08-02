const HOME_CATEGORIES = [
  {
    id:'canal',
    icon:'◉',
    title:'Dubai Canal Cruises',
    description:'Dinner cruises through Business Bay, Festival City and Dubai Canal.',
    href:'/dubai-canal-cruise/'
  },
  {
    id:'marina',
    icon:'◎',
    title:'Dubai Marina Cruises',
    description:'Marina skyline, JBR, Bluewaters and Ain Dubai views.',
    href:'/dubai-marina-cruise/'
  },
  {
    id:'creek',
    icon:'◇',
    title:'Dubai Creek Cruises',
    description:'Old Dubai heritage routes, traditional waterfront and verified Creek updates.',
    href:'/dubai-creek-cruise/'
  },
  {
    id:'new-year',
    icon:'✦',
    title:'New Year Cruises',
    description:'Special-event route, seating, check-in, menu and booking information.',
    href:'/new-year-dubai-cruise/'
  },
  {
    id:'safari',
    icon:'◆',
    title:'Desert Safari',
    description:'Self-drive, bus, 4×4 pickup, premium camp and private car options.',
    href:'/desert-safari-dubai/'
  }
];

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

function applyHomeCategories() {
  const switcher = document.querySelector('#view-overview.active .architecture-card .category-switcher');
  if (!switcher || switcher.dataset.confirmedCategories === '1') return;
  switcher.dataset.confirmedCategories = '1';
  switcher.classList.add('home-five-categories');
  switcher.innerHTML = HOME_CATEGORIES.map((item,index) => `
    <a class="category-switch home-category-link ${index === 0 ? 'active' : ''}" href="${item.href}" data-home-category="${item.id}">
      <span>${item.icon}</span>
      <b>${escapeHtml(item.title)}</b>
      <small>${escapeHtml(item.description)}</small>
    </a>`).join('');
}

let queued = false;
function queueCategories() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    applyHomeCategories();
  });
}

new MutationObserver(queueCategories).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',event => {
  if (event.target.closest('[data-view="overview"],[data-go="overview"]')) setTimeout(queueCategories,0);
},true);
queueCategories();
setTimeout(queueCategories,250);
setTimeout(queueCategories,900);
