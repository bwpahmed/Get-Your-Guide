import { cloneDefaultData } from './data.js';
import { enrichSiteData } from './data-enrichment.js';

const STORAGE_KEY = 'get-your-guide-site-data-v2';

function hydrate(raw) {
  const enriched = enrichSiteData(raw);
  const sourcePackages = new Map((raw.packages || []).map(item => [item.id, item]));
  enriched.packages = enriched.packages.map(item => ({ ...item, ...(sourcePackages.get(item.id) || {}) }));
  enriched.settings = { ...enriched.settings, ...(raw.settings || {}), adminPath: '/admin/' };
  return enriched;
}

export function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return hydrate(cloneDefaultData());
  try {
    return hydrate(JSON.parse(raw));
  } catch {
    return hydrate(cloneDefaultData());
  }
}

export function saveData(data) {
  const next = hydrate({ ...data, updatedAt: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function resetData() {
  const next = hydrate(cloneDefaultData());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function downloadBackup(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `get-your-guide-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
