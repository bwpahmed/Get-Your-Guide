function cleanPublicAdminReferences() {
  document.querySelectorAll('a[href*="admin"], [data-view="workflow"], [data-go="workflow"]').forEach(node => node.remove());
  document.querySelector('#view-workflow')?.remove();
  document.querySelectorAll('.site-footer').forEach(footer => {
    const visible = [...footer.children].filter(child => child.textContent.trim() || child.querySelector('a'));
    if (!visible.length) footer.remove();
  });
}
const observer = new MutationObserver(cleanPublicAdminReferences);
observer.observe(document.documentElement, { childList: true, subtree: true });
cleanPublicAdminReferences();
