function cleanPublicAdminReferences() {
  document.querySelectorAll('a[href*="admin"], [data-view="workflow"], [data-go="workflow"], .admin-chip').forEach(node => node.remove());
  document.querySelector('#view-workflow')?.remove();

  document.querySelectorAll('.review-banner .status-pill').forEach(node => { node.textContent = 'Instant WhatsApp support'; });
  document.querySelectorAll('.feature-grid article').forEach(card => {
    const heading = card.querySelector('h3');
    if (heading?.textContent.trim() === 'Full admin control') {
      heading.textContent = 'Easy package comparison';
      const copy = card.querySelector('p');
      if (copy) copy.textContent = 'Compare prices, inclusions, timings, routes and upgrades before sending your booking request.';
    }
  });
  document.querySelectorAll('.note').forEach(note => {
    if (/admin panel|admin/i.test(note.textContent)) note.textContent = 'Final route, timing and operating details are confirmed before travel.';
  });

  document.querySelectorAll('.site-footer').forEach(footer => {
    footer.querySelectorAll('a[href*="admin"]').forEach(link => link.remove());
    const visible = [...footer.children].filter(child => child.textContent.trim() || child.querySelector('a'));
    if (!visible.length) footer.remove();
  });
}

const observer = new MutationObserver(cleanPublicAdminReferences);
observer.observe(document.documentElement,{childList:true,subtree:true});
cleanPublicAdminReferences();
