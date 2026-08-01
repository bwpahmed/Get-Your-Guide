import { cloneDefaultData } from './data.js';
const STORAGE_KEY = 'get-your-guide-site-data-v1';
export function loadData(){const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return cloneDefaultData();try{return JSON.parse(raw)}catch{return cloneDefaultData()}}
export function saveData(data){const next={...data,updatedAt:new Date().toISOString()};localStorage.setItem(STORAGE_KEY,JSON.stringify(next));return next}
export function resetData(){const next=cloneDefaultData();saveData(next);return next}
export function downloadBackup(data){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`get-your-guide-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url)}
