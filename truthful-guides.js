const page = document.body.dataset.seoPage;
const whatsapp = '971554397575';

function interestSection(type) {
  const creek = type === 'dubai-creek-cruise';
  const title = creek ? 'Verified Dubai Creek Packages Are Being Prepared' : 'New Year 2027 Packages Will Be Published After Confirmation';
  const copy = creek
    ? 'We will not rename Canal products and sell them as Creek cruises. Real Creek vessels, boarding points, route details, menus and prices will appear here after verification.'
    : 'Regular daily cruise packages are not automatically New Year packages. Event prices, route, seating, menu, check-in and cancellation terms will appear only after the operating vessel confirms them.';
  const message = creek
    ? 'Hello, please notify me when verified Dubai Creek cruise packages are available.'
    : 'Hello, please send me verified Dubai New Year 2027 cruise packages when available.';
  return `<section class="ref-section ref-verified-interest" id="packages"><div class="ref-section-head centered"><p class="eyebrow">Verified information only</p><h2>${title}</h2><p>${copy}</p></div><div class="ref-inline-cta"><strong>Register your interest without paying an unverified price.</strong><a class="primary" target="_blank" rel="noopener" href="https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}">Register on WhatsApp</a></div></section>`;
}

function cleanGuide() {
  document.querySelectorAll('.ref-save').forEach(node => node.remove());
  document.querySelectorAll('.ref-package-meta span').forEach(node => {
    if (node.textContent.trim().startsWith('★')) node.remove();
  });
  document.querySelectorAll('.ref-story-visual small').forEach(node => {
    node.textContent = 'Information is reviewed before publishing.';
  });

  if (!['dubai-creek-cruise','new-year-dubai-cruise'].includes(page)) return;
  const root = document.querySelector('[data-reference-page]');
  if (!root || root.dataset.truthfulGuide === '1') return;
  root.dataset.truthfulGuide = '1';
  root.querySelector('.ref-packages')?.remove();
  const trust = root.querySelector('.ref-trust-strip');
  if (trust) trust.insertAdjacentHTML('afterend', interestSection(page));

  const heroPrimary = root.querySelector('.ref-hero-actions .primary');
  if (heroPrimary) {
    heroPrimary.textContent = 'Register Interest';
    heroPrimary.href = '#packages';
  }
}

let queued = false;
function queueClean() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; cleanGuide(); });
}

new MutationObserver(queueClean).observe(document.documentElement,{childList:true,subtree:true});
queueClean();
setTimeout(queueClean,250);
setTimeout(queueClean,800);
