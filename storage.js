import { cloneDefaultData } from './data.js';
import { enrichSiteData } from './data-enrichment.js';

const STORAGE_KEY = 'get-your-guide-site-data-v2';

export function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return enrichSiteData(cloneDefaultData());
  try {
    return enrichSiteData(JSON.parse(raw));
  } catch {
    return enrichSiteData(cloneDefaultData());
  }
}

export function saveData(data) {
  const next = enrichSiteData({ ...data, updatedAt: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function resetData() {
  const next = enrichSiteData(cloneDefaultData());
  saveData(next);
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
