import { PACKAGE_LEVELS } from './data.js';
import { downloadBackup, loadData, resetData, saveData } from './storage.js';

let data = loadData();
let activeTab = 'overview';
const $ = (selector, root = document) => root.querySelector(selector);
const esc = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const lines = (value) => String(value || '').split('\n').map((item) => item.trim()).filter(Boolean);
const joinLines = (value) => Array.isArray(value) ? value.join('\n') : '';
const joinTimeSlots = (value) => Array.isArray(value) ? value.map((slot) => [slot.label, slot.boardingTime, slot.sailingTime, slot.returnTime, slot.days].join(' | ')).join('\n') : '';
const parseTimeSlots = (value) => lines(value).map((line, index) => { const [label = 'Trip', boardingTime = '', sailingTime = '', returnTime = '', days = 'Daily'] = line.split('|').map((part) => part.trim()); return { id: uid(`slot-${index + 1}`), label, boardingTime, sailingTime, returnTime, days }; });

function applyTheme() {
  document.documentElement.style.setProperty('--primary', data.settings.primaryColor);
  document.documentElement.style.setProperty('--accent', data.settings.accentColor);
}

function sidebar() {
  const tabs = [['overview','▦','Overview'],['packages','▣','Packages'],['categories','▤','Categories'],['addons','＋','Add-ons'],['sections','☷','Page Sections'],['navigation','↗','Navigation'],['settings','⚙','Site Settings'],['data','⇩','Data & Backup']];
  return `<aside class="admin-sidebar"><div class="admin-brand"><span>G</span><div><strong>Get Your Guide</strong><small>Full Control Admin</small></div></div>${tabs.map(([id, icon, label]) => `<button data-tab="${id}" class="${activeTab === id ? 'active' : ''}"><span>${icon}</span>${label}</button>`).join('')}<a href="index.html" target="_blank">View website</a></aside>`;
}

function top() {
  return `<header class="admin-top"><div><span class="eyebrow">Content management</span><h1>${esc(activeTab[0].toUpperCase() + activeTab.slice(1))}</h1></div><div><span class="saved-indicator" id="save-state">Draft changes</span><button class="primary" id="save-all">Save changes</button></div></header>`;
}

function row(item, subtitle, type, duplicate = false) {
  return `<article class="admin-row" data-id="${esc(item.id)}"><div><strong>${esc(item.title || item.name || item.label || item.type)}</strong><small>${esc(subtitle)}</small></div><span class="status ${item.visible ? 'visible' : 'hidden'}">${item.visible ? 'Visible' : 'Hidden'}</span><div class="row-actions"><button data-action="up">↑</button><button data-action="down">↓</button>${duplicate ? '<button data-action="duplicate">⧉</button>' : ''}<button data-action="toggle">${item.visible ? '◉' : '○'}</button><button data-action="edit">✎</button><button class="danger-icon" data-action="delete">⌫</button></div></article>`;
}

function overview() {
  return `<div class="admin-dashboard"><div class="stat-card"><span>Packages</span><strong>${data.packages.length}</strong><small>${data.packages.filter((item) => item.visible).length} visible</small></div><div class="stat-card"><span>Categories</span><strong>${data.categories.length}</strong><small>Canal, Marina, Yachts, Safari</small></div><div class="stat-card"><span>Add-ons</span><strong>${data.addOns.length}</strong><small>Reusable upgrades</small></div><div class="stat-card"><span>Sections</span><strong>${data.sections.length}</strong><small>Header to footer</small></div><article class="admin-notice"><h2>Everything is editable</h2><p>Create, update, hide, reorder, duplicate or delete packages, cards, categories, sections, navigation, header, footer and add-ons.</p></article></div>`;
}

function listView(title, type, items, subtitles, duplicate = false) {
  return `<div class="admin-list"><div class="list-head"><h2>${esc(title)}</h2><button class="primary" data-create="${type}">＋ Create new</button></div>${items.map((item) => row(item, subtitles(item), type, duplicate)).join('')}</div>`;
}

function settingsView() {
  const keys = ['brandName','shortName','tagline','whatsappNumber','supportPhone','supportEmail','logoUrl','heroImage','footerText','instagramUrl','facebookUrl','currency'];
  return `<form class="editor-panel embedded" id="settings-form"><div class="form-grid">${keys.map((key) => `<label class="${['tagline','footerText'].includes(key) ? 'wide' : ''}">${esc(key.replace(/([A-Z])/g, ' $1'))}<input name="${key}" value="${esc(data.settings[key])}"></label>`).join('')}<label>Primary color<input type="color" name="primaryColor" value="${esc(data.settings.primaryColor)}"></label><label>Accent color<input type="color" name="accentColor" value="${esc(data.settings.accentColor)}"></label></div><div class="editor-actions"><button class="primary">Apply settings</button></div></form>`;
}

function dataView() {
  return `<div class="data-tools"><article><span>⇩</span><div><h3>Export backup</h3><p>Download packages, settings and layout as JSON.</p></div><button id="export-data">Export JSON</button></article><article><span>⇧</span><div><h3>Import backup</h3><p>Replace the current draft with an exported JSON file.</p></div><button id="import-data">Import JSON</button><input id="import-file" hidden type="file" accept="application/json"></article><article><span>↻</span><div><h3>Reset demo data</h3><p>Restore Canal, Marina, Yacht and Safari seed packages.</p></div><button class="danger" id="reset-data">Reset</button></article></div>`;
}

function content() {
  if (activeTab === 'overview') return overview();
  if (activeTab === 'packages') return listView('Packages','package',[...data.packages].sort((a,b)=>a.order-b.order),(item)=>`${item.level} · ${data.settings.currency} ${item.offerPrice} · ${data.categories.find((cat)=>cat.id===item.categoryId)?.name || ''}`,true);
  if (activeTab === 'categories') return listView('Categories','category',[...data.categories].sort((a,b)=>a.order-b.order),(item)=>`${item.kind} · ${data.packages.filter((pkg)=>pkg.categoryId===item.id).length} packages`);
  if (activeTab === 'addons') return listView('Add-ons','addon',[...data.addOns].sort((a,b)=>a.order-b.order),(item)=>`${data.settings.currency} ${item.price} · ${item.unit}`);
  if (activeTab === 'sections') return listView('Homepage Sections','section',[...data.sections].sort((a,b)=>a.order-b.order),(item)=>`${item.type} · position ${item.order}`);
  if (activeTab === 'navigation') return listView('Navigation Links','nav',[...data.navLinks].sort((a,b)=>a.order-b.order),(item)=>item.href);
  if (activeTab === 'settings') return settingsView();
  return dataView();
}

function render() {
  applyTheme();
  $('#admin-app').innerHTML = `${sidebar()}<section class="admin-main">${top()}${content()}</section><div id="drawer"></div>`;
  document.querySelectorAll('[data-tab]').forEach((button) => button.addEventListener('click', () => { activeTab = button.dataset.tab; render(); }));
  $('#save-all').onclick = () => { data = saveData(data); $('#save-state').textContent = 'All changes saved'; };
  bindTab();
}

function typeConfig(type) {
  if (type === 'package') return { key: 'packages', empty: { id: uid('package'), title: 'New Package', slug: `new-package-${Date.now()}`, categoryId: data.categories[0]?.id || 'canal', level: 'Standard', shortDescription: '', description: '', originalPrice: 0, offerPrice: 0, childPrice: 0, infantPolicy: '', image: '', gallery: [], location: '', boardingLocation: '', duration: '', capacity: '', seating: '', highlights: [], inclusions: [], exclusions: [], landmarks: [], addOnIds: [], timeSlots: [], badges: [], featured: false, visible: true, order: data.packages.length + 1, whatsappMessage: '', notes: [], boatName: '', boatType: '', availableDays: 'Daily', upperDeckDetails: '', lowerDeckDetails: '', acDetails: '', buffetDetails: '', drinks: '', entertainment: '', parkingInfo: '', mapUrl: '', paymentMethod: '', cancellationPolicy: '', bestSuitedFor: '', seoTitle: '', metaDescription: '' } };
  if (type === 'category') return { key: 'categories', empty: { id: uid('category'), name: 'New Category', slug: `new-category-${Date.now()}`, kind: 'cruise', description: '', image: '', visible: true, order: data.categories.length + 1 } };
  if (type === 'addon') return { key: 'addOns', empty: { id: uid('addon'), name: 'New Add-on', price: 0, unit: 'per person', description: '', visible: true, order: data.addOns.length + 1 } };
  if (type === 'section') return { key: 'sections', empty: { id: uid('section'), type: 'custom', title: 'New Section', subtitle: '', content: '<p>Edit this section.</p>', visible: true, order: data.sections.length + 1 } };
  return { key: 'navLinks', empty: { id: uid('nav'), label: 'New Link', href: '#packages', visible: true, order: data.navLinks.length + 1 } };
}

function bindTab() {
  document.querySelectorAll('[data-create]').forEach((button) => button.addEventListener('click', () => openEditor(button.dataset.create, typeConfig(button.dataset.create).empty)));
  const type = { packages: 'package', categories: 'category', addons: 'addon', sections: 'section', navigation: 'nav' }[activeTab];
  if (type) {
    const { key } = typeConfig(type);
    document.querySelectorAll('.admin-row').forEach((element) => element.addEventListener('click', (event) => {
      const action = event.target.closest('[data-action]')?.dataset.action;
      if (!action) return;
      const id = element.dataset.id;
      const list = data[key];
      const index = list.findIndex((item) => item.id === id);
      if (index < 0) return;
      if (action === 'edit') return openEditor(type, list[index]);
      if (action === 'delete') { if (confirm('Delete this item?')) { list.splice(index, 1); render(); } return; }
      if (action === 'toggle') { list[index].visible = !list[index].visible; render(); return; }
      if (action === 'duplicate') { const copy = structuredClone(list[index]); copy.id = uid(type); copy.title = `${copy.title} Copy`; copy.slug = `${copy.slug}-copy`; copy.order = list.length + 1; list.push(copy); render(); return; }
      const target = action === 'up' ? index - 1 : index + 1;
      if (target >= 0 && target < list.length) { [list[index], list[target]] = [list[target], list[index]]; list.forEach((item, order) => item.order = order + 1); render(); }
    }));
  }
  $('#settings-form')?.addEventListener('submit', (event) => { event.preventDefault(); const form = new FormData(event.target); Object.keys(data.settings).forEach((key) => { if (form.has(key)) data.settings[key] = form.get(key); }); applyTheme(); alert('Settings applied. Click Save changes.'); });
  $('#export-data')?.addEventListener('click', () => downloadBackup(data));
  $('#import-data')?.addEventListener('click', () => $('#import-file').click());
  $('#import-file')?.addEventListener('change', async (event) => { try { data = JSON.parse(await event.target.files[0].text()); render(); } catch { alert('Invalid JSON file.'); } });
  $('#reset-data')?.addEventListener('click', () => { if (confirm('Reset everything?')) { data = resetData(); render(); } });
}

function field(name, label, value, type = 'text', wide = false, options = []) {
  if (type === 'textarea') return `<label class="${wide ? 'wide' : ''}">${label}<textarea name="${name}">${esc(value)}</textarea></label>`;
  if (type === 'select') return `<label>${label}<select name="${name}">${options.map((item) => `<option ${item === value ? 'selected' : ''}>${esc(item)}</option>`).join('')}</select></label>`;
  if (type === 'checkbox') return `<label class="toggle"><input type="checkbox" name="${name}" ${value ? 'checked' : ''}>${label}</label>`;
  return `<label class="${wide ? 'wide' : ''}">${label}<input type="${type}" name="${name}" value="${esc(value)}"></label>`;
}

function openEditor(type, item) {
  const draft = structuredClone(item);
  let fields = '';
  if (type === 'package') {
    fields = field('title','Title',draft.title)+field('slug','Slug',draft.slug)+`<label>Category<select name="categoryId">${data.categories.map((cat)=>`<option value="${esc(cat.id)}" ${cat.id===draft.categoryId?'selected':''}>${esc(cat.name)}</option>`).join('')}</select></label>`+field('level','Level',draft.level,'select',false,PACKAGE_LEVELS)+field('originalPrice','Original price',draft.originalPrice,'number')+field('offerPrice','Offer price',draft.offerPrice,'number')+field('childPrice','Child price',draft.childPrice||0,'number')+field('image','Main image URL',draft.image)+field('gallery','Gallery URLs, one per line',joinLines(draft.gallery),'textarea')+field('location','Location',draft.location)+field('boardingLocation','Boarding location',draft.boardingLocation)+field('mapUrl','Google Maps URL',draft.mapUrl||'')+field('boatName','Boat name',draft.boatName||'')+field('boatType','Boat type',draft.boatType||'')+field('duration','Duration',draft.duration)+field('availableDays','Available days',draft.availableDays||'Daily')+field('capacity','Capacity',draft.capacity)+field('shortDescription','Short description',draft.shortDescription,'textarea',true)+field('description','Full description',draft.description,'textarea',true)+field('infantPolicy','Infant policy',draft.infantPolicy,'textarea')+field('seating','Seating',draft.seating,'textarea')+field('upperDeckDetails','Upper-deck details',draft.upperDeckDetails||'','textarea')+field('lowerDeckDetails','Lower-deck details',draft.lowerDeckDetails||'','textarea')+field('acDetails','Air-conditioning details',draft.acDetails||'','textarea')+field('buffetDetails','Buffet details',draft.buffetDetails||'','textarea')+field('drinks','Drinks',draft.drinks||'','textarea')+field('entertainment','Entertainment',draft.entertainment||'','textarea')+field('parkingInfo','Parking information',draft.parkingInfo||'','textarea')+field('paymentMethod','Payment method',draft.paymentMethod||'','textarea')+field('cancellationPolicy','Cancellation policy',draft.cancellationPolicy||'','textarea')+field('bestSuitedFor','Best suited for',draft.bestSuitedFor||'','textarea')+field('highlights','Highlights, one per line',joinLines(draft.highlights),'textarea')+field('landmarks','Landmarks, one per line',joinLines(draft.landmarks),'textarea')+field('inclusions','Inclusions, one per line',joinLines(draft.inclusions),'textarea')+field('exclusions','Exclusions, one per line',joinLines(draft.exclusions),'textarea')+field('timeSlots','Time slots: Label | Boarding | Sailing | Return | Days',joinTimeSlots(draft.timeSlots),'textarea',true)+field('badges','Badges, one per line',joinLines(draft.badges),'textarea')+field('notes','Notes, one per line',joinLines(draft.notes),'textarea')+field('seoTitle','SEO title',draft.seoTitle||'')+field('metaDescription','Meta description',draft.metaDescription||'','textarea',true)+field('whatsappMessage','WhatsApp message',draft.whatsappMessage,'textarea',true)+`<fieldset class="wide"><legend>Add-ons</legend><div class="checkbox-grid">${data.addOns.map((addon)=>`<label><input type="checkbox" name="addon" value="${esc(addon.id)}" ${(draft.addOnIds||[]).includes(addon.id)?'checked':''}>${esc(addon.name)}</label>`).join('')}</div></fieldset>`+field('visible','Visible',draft.visible,'checkbox')+field('featured','Featured',draft.featured,'checkbox');
  } else if (type === 'category') fields = field('name','Name',draft.name)+field('slug','Slug',draft.slug)+field('kind','Kind',draft.kind,'select',false,['cruise','yacht','safari'])+field('image','Image URL',draft.image)+field('description','Description',draft.description,'textarea',true)+field('visible','Visible',draft.visible,'checkbox');
  else if (type === 'addon') fields = field('name','Name',draft.name)+field('price','Price',draft.price,'number')+field('unit','Unit',draft.unit)+field('description','Description',draft.description,'textarea',true)+field('visible','Visible',draft.visible,'checkbox');
  else if (type === 'section') fields = field('title','Title',draft.title)+field('type','Type',draft.type,'select',false,['header','hero','categories','packages','trust','cta','custom','footer'])+field('subtitle','Subtitle',draft.subtitle,'textarea',true)+field('content','Custom HTML',draft.content||'','textarea',true)+field('visible','Visible',draft.visible,'checkbox');
  else fields = field('label','Label',draft.label)+field('href','Link / anchor',draft.href)+field('visible','Visible',draft.visible,'checkbox');
  $('#drawer').innerHTML = `<div class="editor-panel"><div class="editor-head"><h2>Edit ${esc(type)}</h2><button id="close-editor">Close</button></div><form id="item-form"><div class="form-grid">${fields}</div><div class="editor-actions"><button type="button" class="secondary" id="cancel-editor">Cancel</button><button class="primary">Save item</button></div></form></div>`;
  $('#close-editor').onclick = $('#cancel-editor').onclick = () => $('#drawer').innerHTML = '';
  $('#item-form').onsubmit = (event) => { event.preventDefault(); const form = new FormData(event.target); const config = typeConfig(type); const next = { ...draft }; for (const [key, value] of form.entries()) { if (key === 'addon') continue; if (['originalPrice','offerPrice','childPrice','price'].includes(key)) next[key] = Number(value); else next[key] = value; } ['visible','featured'].forEach((key) => { if (key in next) next[key] = form.has(key); }); ['gallery','highlights','landmarks','inclusions','exclusions','badges','notes'].forEach((key) => { if (key in next) next[key] = lines(form.get(key)); }); if (type === 'package') { next.addOnIds = form.getAll('addon'); next.timeSlots = parseTimeSlots(form.get('timeSlots')); } const list = data[config.key]; const index = list.findIndex((entry) => entry.id === next.id); if (index >= 0) list[index] = next; else list.push(next); $('#drawer').innerHTML = ''; render(); };
}

render();
