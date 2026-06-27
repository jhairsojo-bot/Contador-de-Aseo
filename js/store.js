import { PEOPLE, AREAS } from './constants.js';

let records = {};

function normalizeRecords(raw) {
  const normalized = {};
  for (const date in raw) {
    const val = raw[date];
    if (Array.isArray(val)) {
      normalized[date] = val.map(r => ({
        person: r.person,
        color: r.color,
        area: r.area || 'cocina',
      }));
    } else {
      normalized[date] = [{ person: val.person, color: val.color, area: val.area || 'cocina' }];
    }
  }
  return normalized;
}

export function loadRecords() {
  records = {};
  return records;
}

export function getRecords() {
  return records;
}

export function saveRecord(date, person, color, area) {
  if (!records[date]) {
    records[date] = [];
  }
  if (area !== 'cocina' && records[date].some(r => r.area === area)) {
    return false;
  }
  records[date].push({ person, color, area });
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

export function getAreaStats() {
  const stats = {};
  for (const a of AREAS) {
    stats[a.id] = 0;
  }
  let total = 0;
  for (const date in records) {
    for (const record of records[date]) {
      if (stats[record.area] !== undefined) {
        stats[record.area]++;
        total++;
      }
    }
  }
  return { stats, total };
}

export function getPersonAreaStats() {
  const result = {};
  for (const p of PEOPLE) {
    result[p.name] = {};
    for (const a of AREAS) {
      result[p.name][a.id] = 0;
    }
  }
  for (const date in records) {
    for (const record of records[date]) {
      if (result[record.person] && result[record.person][record.area] !== undefined) {
        result[record.person][record.area]++;
      }
    }
  }
  return result;
}

export function getMonthlyStats(year, month) {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthly = {};
  const monthlyByArea = {};
  for (const p of PEOPLE) {
    monthly[p.name] = 0;
    monthlyByArea[p.name] = {};
    for (const a of AREAS) {
      monthlyByArea[p.name][a.id] = 0;
    }
  }
  let total = 0;
  for (const date in records) {
    if (date.startsWith(prefix)) {
      for (const record of records[date]) {
        if (monthly[record.person] !== undefined) {
          monthly[record.person]++;
          monthlyByArea[record.person][record.area]++;
          total++;
        }
      }
    }
  }
  return { monthly, monthlyByArea, total };
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

