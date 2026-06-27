import { PEOPLE, AREAS } from './constants.js';
import { getPersonStats, getAreaStats, getPersonAreaStats } from './store.js';

export function renderDashboard(container) {
  const { stats, total } = getPersonStats();
  const { stats: areaStats } = getAreaStats();
  const personAreaStats = getPersonAreaStats();

  let maxPerson = '';
  let maxCount = -1;
  let minPerson = '';
  let minCount = Infinity;

  for (const p of PEOPLE) {
    if (stats[p.name] > maxCount) {
      maxCount = stats[p.name];
      maxPerson = p.name;
    }
    if (stats[p.name] < minCount) {
      minCount = stats[p.name];
      minPerson = p.name;
    }
  }

  if (total === 0) {
    container.innerHTML = `
      <div class="text-center py-16">
        <svg class="w-16 h-16 text-[#D6CDC0] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
        </svg>
        <h2 class="text-xl font-semibold text-[#1B2A4A] mb-2">No hay registros aún</h2>
        <p class="text-[#8B7D6B]">Ve al calendario para registrar la primera limpieza.</p>
      </div>
    `;
    return;
  }

  const maxAreaCount = Math.max(...AREAS.map(a => areaStats[a.id]));

  container.innerHTML = `
    <div class="border-b border-[#D6CDC0] pb-3 mb-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-display text-[#1B2A4A]">Dashboard</h1>
        <span class="text-sm text-[#8B7D6B]">${total} limpieza${total !== 1 ? 's' : ''} en total</span>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-xl border border-[#D6CDC0] p-6">
        <p class="text-sm font-medium text-[#8B7D6B] uppercase tracking-wider">Total</p>
        <p class="text-3xl font-bold text-[#1B2A4A] mt-2">${total}</p>
      </div>
      ${PEOPLE.map(p => `
        <div class="bg-white rounded-xl border border-[#D6CDC0] p-6" style="border-left: 4px solid ${p.color}">
          <p class="text-sm font-medium text-[#8B7D6B] uppercase tracking-wider">${p.name}</p>
          <p class="text-3xl font-bold mt-2" style="color: ${p.color}">${stats[p.name]}</p>
        </div>
      `).join('')}
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <div class="bg-white rounded-xl border border-[#D6CDC0] p-6">
        <div class="flex items-center gap-3 mb-1">
          <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
          <p class="text-sm font-medium text-[#8B7D6B] uppercase tracking-wider">Más limpiezas</p>
        </div>
        <p class="text-xl font-bold text-[#1B2A4A] mt-1">${maxPerson} <span class="text-[#8B7D6B] font-normal">(${maxCount})</span></p>
      </div>
      <div class="bg-white rounded-xl border border-[#D6CDC0] p-6">
        <div class="flex items-center gap-3 mb-1">
          <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
          </svg>
          <p class="text-sm font-medium text-[#8B7D6B] uppercase tracking-wider">Menos limpiezas</p>
        </div>
        <p class="text-xl font-bold text-[#1B2A4A] mt-1">${minPerson} <span class="text-[#8B7D6B] font-normal">(${minCount})</span></p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-[#D6CDC0] p-6 mb-8">
      <h3 class="text-lg font-display text-[#1B2A4A] mb-4">Participación</h3>
      <div class="space-y-4">
        ${PEOPLE.map(p => {
          const pct = total > 0 ? ((stats[p.name] / total) * 100).toFixed(1) : 0;
          return `
            <div>
              <div class="flex justify-between text-sm mb-1.5">
                <span class="font-medium text-[#1B2A4A]">${p.name}</span>
                <span class="text-[#8B7D6B]">${pct}%</span>
              </div>
              <div class="w-full bg-[#EBE5DC] rounded-full h-3 overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700 ease-out" style="width: ${pct}%; background-color: ${p.color}"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div class="bg-white rounded-xl border border-[#D6CDC0] p-6 mb-8">
      <h3 class="text-lg font-display text-[#1B2A4A] mb-4">Áreas Más Limpiadas</h3>
      <div class="space-y-4">
        ${AREAS.map(a => {
          const pct = total > 0 ? ((areaStats[a.id] / total) * 100).toFixed(1) : 0;
          const barWidth = maxAreaCount > 0 ? (areaStats[a.id] / maxAreaCount) * 100 : 0;
          return `
            <div>
              <div class="flex justify-between text-sm mb-1.5">
                <span class="font-medium text-[#1B2A4A]">${a.icon} ${a.name}</span>
                <span class="text-[#8B7D6B]">${areaStats[a.id]} (${pct}%)</span>
              </div>
              <div class="w-full bg-[#EBE5DC] rounded-full h-3 overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700 ease-out bg-[#1B2A4A]" style="width: ${barWidth}%"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div class="bg-white rounded-xl border border-[#D6CDC0] p-6">
      <h3 class="text-lg font-display text-[#1B2A4A] mb-4">Distribución por Persona</h3>
      <div class="space-y-6">
        ${PEOPLE.map(p => {
          const personTotal = stats[p.name];
          return `
            <div>
              <div class="flex items-center gap-2 mb-3">
                <span class="w-3 h-3 rounded-full" style="background-color: ${p.color}"></span>
                <span class="font-medium text-[#1B2A4A]">${p.name}</span>
                <span class="text-sm text-[#8B7D6B]">(${personTotal} total)</span>
              </div>
              <div class="space-y-2 ml-5">
                ${AREAS.map(a => {
                  const count = personAreaStats[p.name][a.id];
                  const pctPerson = personTotal > 0 ? ((count / personTotal) * 100).toFixed(1) : 0;
                  return `
                    <div>
                      <div class="flex justify-between text-xs mb-1">
                        <span class="text-[#8B7D6B]">${a.icon} ${a.name}</span>
                        <span class="text-[#8B7D6B]">${count} (${pctPerson}%)</span>
                      </div>
                      <div class="w-full bg-[#EBE5DC] rounded-full h-2 overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-700 ease-out" style="width: ${pctPerson}%; background-color: ${p.color}"></div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
