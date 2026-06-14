import { STORAGE_KEY, PEOPLE } from './constants.js';

let records = {};

function normalizeRecords(raw) {
  const normalized = {};
  for (const date in raw) {
    const val = raw[date];
    if (Array.isArray(val)) {
      normalized[date] = val;
    } else {
      normalized[date] = [{ person: val.person, color: val.color }];
    }
  }
  return normalized;
}

export function loadRecords() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    records = data ? normalizeRecords(JSON.parse(data)) : {};
  } catch {
    records = {};
  }
  return records;
}

export function getRecords() {
  return records;
}

export function saveRecord(date, person, color) {
  if (!records[date]) {
    records[date] = [];
  }
  records[date].push({ person, color });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  window.dispatchEvent(new CustomEvent('records-changed'));
  return true;
}

export function getDayRecords(date) {
  return records[date] || [];
}

export function getPersonStats() {
  const stats = {};
  for (const p of PEOPLE) {
    stats[p.name] = 0;
  }
  let total = 0;
  for (const date in records) {
    for (const record of records[date]) {
      if (stats[record.person] !== undefined) {
        stats[record.person]++;
        total++;
      }
    }
  }
  return { stats, total };
}

export function getMonthlyStats(year, month) {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthly = {};
  for (const p of PEOPLE) {
    monthly[p.name] = 0;
  }
  let total = 0;
  for (const date in records) {
    if (date.startsWith(prefix)) {
      for (const record of records[date]) {
        if (monthly[record.person] !== undefined) {
          monthly[record.person]++;
          total++;
        }
      }
    }
  }
  return { monthly, total };
}

export function getAllMonths() {
  const monthsSet = new Set();
  for (const date in records) {
    const [y, m] = date.split('-');
    monthsSet.add(`${y}-${m}`);
  }
  return Array.from(monthsSet).sort();
}

export function getSortedRecords() {
  const result = [];
  for (const [date, dayRecords] of Object.entries(records)) {
    for (const record of dayRecords) {
      result.push([date, record]);
    }
  }
  return result.sort(([a], [b]) => a.localeCompare(b));
}

window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) {
    loadRecords();
    window.dispatchEvent(new CustomEvent('records-changed'));
  }
});
