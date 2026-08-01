import { cloneDefaultData } from './data.js';
import { enrichSiteData } from './data-enrichment.js';
import { applyCatalogBaseline } from './catalog-baseline.js';

const STORAGE_KEY = 'get-your-guide-site-data-v3';
const LEGACY_KEY = 'get-your-guide-site-data-v2';

function parseStored(value) {
  if (!value) return null;
  try { return JSON.parse(value); } catch { return null; }
}

function bookingDefaults(item) {
  return {
    ...item,
    upperDeckCharge:item.upperDeckCharge ?? 25,
    pickupPrice:item.pickupPrice ?? 35,
    bookingNotice:item.bookingNotice || 'Final availability and operator confirmation are required.',
    conversionLabel:item.conversionLabel || item.slug
  };
}

function hydrate(raw, forceBaseline = false) {
  const source = structuredClone(raw || cloneDefaultData());
  const needsBaseline = forceBaseline || Number(source.schemaVersion || 0) < 3;
  let next = enrichSiteData(source);

  if (needsBaseline) {
    const structural = new Map((source.packages || []).map(item => [item.id, {
      visible:item.visible,
      featured:item.featured,
      order:item.order
    }]));
    next = applyCatalogBaseline(next);
    next.packages = next.packages.map(item => {
      const defaultAddOns = ['canal','marina'].includes(item.categoryId) ? ['birthday-decor','cake'] : item.addOnIds;
      return bookingDefaults({ ...item, addOnIds:defaultAddOns, ...(structural.get(item.id) || {}) });
    });
  } else {
    const sourcePackages = new Map((source.packages || []).map(item => [item.id, item]));
    next.packages = next.packages.map(item => bookingDefaults({ ...item, ...(sourcePackages.get(item.id) || {}) }));
    next.settings = { ...next.settings, ...(source.settings || {}) };
  }

  next.schemaVersion = 3;
  next.settings = { ...next.settings, adminPath:'/admin/' };
  return next;
}

export function loadData() {
  const current = parseStored(localStorage.getItem(STORAGE_KEY));
  if (current) return hydrate(current);

  const legacy = parseStored(localStorage.getItem(LEGACY_KEY));
  const migrated = hydrate(legacy || cloneDefaultData(), true);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
  return migrated;
}

export function saveData(data) {
  const next = hydrate({ ...data, schemaVersion:3, updatedAt:new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function resetData() {
  const next = hydrate(cloneDefaultData(), true);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function downloadBackup(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `get-your-guide-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
