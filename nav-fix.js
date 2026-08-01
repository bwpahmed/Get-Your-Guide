const anchorMap = { '#canal': 'group-canal', '#marina': 'group-marina', '#yachts': 'group-yachts', '#safari': 'group-safari' };
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href]');
  const targetId = link ? anchorMap[link.getAttribute('href')] : null;
  if (!targetId) return;
  event.preventDefault();
  document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
