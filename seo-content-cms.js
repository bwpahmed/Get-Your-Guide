import { loadSeoContent, saveSeoContent, resetSeoContent } from './seo-content-data.js';

let content = loadSeoContent();
const esc = (value = '') => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const lines = value => String(value || '').split('\n').map(item => item.trim()).filter(Boolean);
const uid = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;

function pageOptions(selected) {
  return Object.values(content).map(page => `<option value="${esc(page.slug)}" ${page.slug === selected ? 'selected' : ''}>${esc(page.title)}</option>`).join('');
}

function sectionRow(section) {
  return `<article class="seo-cms-row" data-section-id="${esc(section.id)}">
    <div><strong>${esc(section.title)}</strong><small>${section.visible === false ? 'Hidden' : 'Visible'} · ${section.type === 'list' ? `${section.items?.length || 0} list items` : 'Text section'}</small></div>
    <div class="row-actions"><button data-action="up">↑</button><button data-action="down">↓</button><button data-action="toggle">${section.visible === false ? '○' : '◉'}</button><button data-action="edit">✎</button><button data-action="delete" class="danger-icon">⌫</button></div>
  </article>`;
}

function overlayMarkup(selectedSlug) {
  const page = content[selectedSlug] || Object.values(content)[0];
  return `<div class="seo-cms-overlay" id="seoCmsOverlay">
    <section class="seo-cms-panel">
      <header class="seo-cms-head"><div><p class="eyebrow">Search content manager</p><h2>SEO Pages & Guides</h2><p>Edit the homepage guide, Canal, Marina, Creek and New Year content without changing the public layout.</p></div><button id="closeSeoCms">Close</button></header>
      <div class="seo-cms-toolbar">
        <label>Page<select id="seoPageSelect">${pageOptions(page.slug)}</select></label>
        <button class="secondary" id="previewSeoPage">Preview</button>
        <button class="secondary" id="resetSeoContent">Reset baseline</button>
        <button class="primary" id="saveSeoContent">Save SEO content</button>
      </div>
      <form class="seo-page-form" id="seoPageForm">
        <div class="form-grid">
          <label>Page title<input name="title" value="${esc(page.title)}"></label>
          <label>Eyebrow<input name="eyebrow" value="${esc(page.eyebrow || '')}"></label>
          <label class="wide">Introduction<textarea name="intro" rows="3">${esc(page.intro || '')}</textarea></label>
          <label>CTA label<input name="ctaLabel" value="${esc(page.ctaLabel || '')}"></label>
          <label>CTA link<input name="ctaHref" value="${esc(page.ctaHref || '')}"></label>
        </div>
      </form>
      <div class="seo-cms-section-head"><div><h3>Page sections</h3><p>Reorder, hide, edit, remove or create new sections.</p></div><button class="primary" id="addSeoSection">＋ Add section</button></div>
      <div class="seo-cms-list">${(page.sections || []).map(sectionRow).join('')}</div>
    </section>
  </div>`;
}

function ensureButton() {
  const sidebar = document.querySelector('.admin-sidebar');
  if (!sidebar || sidebar.querySelector('#openSeoCms')) return;
  const button = document.createElement('button');
  button.id = 'openSeoCms';
  button.innerHTML = '<span>⌕</span>SEO Pages';
  const link = sidebar.querySelector('a');
  if (link) sidebar.insertBefore(button, link); else sidebar.append(button);
  button.addEventListener('click', () => openOverlay('home'));
}

function openOverlay(slug) {
  document.querySelector('#seoCmsOverlay')?.remove();
  document.body.insertAdjacentHTML('beforeend', overlayMarkup(slug));
  bindOverlay(slug);
}

function savePageBasics(slug) {
  const form = document.querySelector('#seoPageForm');
  if (!form || !content[slug]) return;
  const data = new FormData(form);
  content[slug] = {
    ...content[slug],
    title: String(data.get('title') || '').trim(),
    eyebrow: String(data.get('eyebrow') || '').trim(),
    intro: String(data.get('intro') || '').trim(),
    ctaLabel: String(data.get('ctaLabel') || '').trim(),
    ctaHref: String(data.get('ctaHref') || '').trim()
  };
}

function openSectionEditor(slug, section) {
  const modal = document.createElement('div');
  modal.className = 'seo-cms-modal';
  modal.innerHTML = `<form class="seo-cms-modal-card" id="seoSectionForm">
    <header><div><p class="eyebrow">Editable guide section</p><h3>${esc(section.title || 'New section')}</h3></div><button type="button" id="closeSeoSection">Close</button></header>
    <div class="form-grid">
      <label>Heading<input name="title" value="${esc(section.title || '')}" required></label>
      <label>Section type<select name="type"><option value="text" ${section.type === 'text' ? 'selected' : ''}>Text</option><option value="list" ${section.type === 'list' ? 'selected' : ''}>Text + list</option></select></label>
      <label class="wide">Paragraph<textarea name="body" rows="5">${esc(section.body || '')}</textarea></label>
      <label class="wide">List items, one per line<textarea name="items" rows="7">${esc((section.items || []).join('\n'))}</textarea></label>
      <label class="toggle wide"><input type="checkbox" name="visible" ${section.visible === false ? '' : 'checked'}>Visible on website</label>
    </div>
    <footer><button type="button" class="secondary" id="cancelSeoSection">Cancel</button><button class="primary">Save section</button></footer>
  </form>`;
  document.body.append(modal);
  const close = () => modal.remove();
  modal.querySelector('#closeSeoSection').onclick = close;
  modal.querySelector('#cancelSeoSection').onclick = close;
  modal.querySelector('#seoSectionForm').onsubmit = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const updated = {
      ...section,
      title: String(data.get('title') || '').trim(),
      type: String(data.get('type') || 'text'),
      body: String(data.get('body') || '').trim(),
      items: lines(data.get('items')),
      visible: data.has('visible')
    };
    const index = content[slug].sections.findIndex(item => item.id === section.id);
    if (index >= 0) content[slug].sections[index] = updated;
    else content[slug].sections.push(updated);
    close();
    openOverlay(slug);
  };
}

function bindOverlay(slug) {
  const overlay = document.querySelector('#seoCmsOverlay');
  const page = content[slug];
  overlay.querySelector('#closeSeoCms').onclick = () => overlay.remove();
  overlay.querySelector('#seoPageSelect').onchange = event => { savePageBasics(slug); openOverlay(event.target.value); };
  overlay.querySelector('#saveSeoContent').onclick = () => { savePageBasics(slug); saveSeoContent(content); overlay.remove(); alert('SEO content saved. Refresh public pages to see the changes.'); };
  overlay.querySelector('#resetSeoContent').onclick = () => { if (confirm('Reset all SEO guide content to the original baseline?')) { content = resetSeoContent(); openOverlay('home'); } };
  overlay.querySelector('#previewSeoPage').onclick = () => {
    const urls = { home:'/', 'dhow-cruise-dubai':'/dhow-cruise-dubai/', 'dubai-canal-cruise':'/dubai-canal-cruise/', 'dubai-marina-cruise':'/dubai-marina-cruise/', 'dubai-creek-cruise':'/dubai-creek-cruise/', 'new-year-dubai-cruise':'/new-year-dubai-cruise/' };
    window.open(urls[slug] || '/', '_blank', 'noopener');
  };
  overlay.querySelector('#addSeoSection').onclick = () => openSectionEditor(slug, { id:uid('section'), title:'New Section', body:'', items:[], type:'text', visible:true });
  overlay.querySelectorAll('.seo-cms-row').forEach(row => {
    row.addEventListener('click', event => {
      const action = event.target.closest('[data-action]')?.dataset.action;
      if (!action) return;
      const list = page.sections;
      const index = list.findIndex(section => section.id === row.dataset.sectionId);
      if (index < 0) return;
      const section = list[index];
      if (action === 'edit') return openSectionEditor(slug, section);
      if (action === 'toggle') section.visible = section.visible === false;
      if (action === 'delete') {
        if (!confirm(`Delete “${section.title}”?`)) return;
        list.splice(index,1);
      }
      if (action === 'up' && index > 0) [list[index-1],list[index]] = [list[index],list[index-1]];
      if (action === 'down' && index < list.length-1) [list[index+1],list[index]] = [list[index],list[index+1]];
      openOverlay(slug);
    });
  });
}

let queued = false;
const queue = () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; ensureButton(); });
};
new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
queue();
