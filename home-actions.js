function bindHomeActions() {
  document.querySelectorAll('.home-second-hero [data-go="comparison"], .home-help-grid [data-go="comparison"]').forEach(button => {
    if (button.dataset.homeActionBound) return;
    button.dataset.homeActionBound = '1';
    button.addEventListener('click', () => document.querySelector('.topnav [data-view="comparison"]')?.click());
  });
}

let queued = false;
const queue = () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; bindHomeActions(); });
};
new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
queue();
