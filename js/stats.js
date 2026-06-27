import { PEOPLE, AREAS } from './constants.js';
import { getPersonStats, getAreaStats, getPersonAreaStats, getSortedRecords, getAllMonths, getMonthlyStats } from './store.js';

function getConicGradient(stats, total) {
  if (total === 0) return 'conic-gradient(#e5e7eb 0deg, #e5e7eb 360deg)';
  const segments = [];
  let currentAngle = 0;
  for (const p of PEOPLE) {
    const count = stats[p.name];
    if (count > 0) {
      const pct = count / total;
      const startAngle = currentAngle;
      const endAngle = currentAngle + pct * 360;
      segments.push(`${p.color} ${startAngle}deg ${endAngle}deg`);
      currentAngle = endAngle;
    }
  }
  if (segments.length === 0) return 'conic-gradient(#e5e7eb 0deg, #e5e7eb 360deg)';
  return `conic-gradient(${segments.join(', ')})`;
}

function getAreaIcon(areaId) {
  const area = AREAS.find(a => a.id === areaId);
  return area ? area.icon : '📦';
}

function getAreaName(areaId) {
  const area = AREAS.find(a => a.id === areaId);
  return area ? area.name : areaId;
}

export function renderStats(container) {
  const { stats, total } = getPersonStats();
  const { stats: areaStats } = getAreaStats();
  const personAreaStats = getPersonAreaStats();
  const records = getSortedRecords();
  const months = getAllMonths();

  const ranking = PEOPLE.map(p => ({
    name: p.name,
    count: stats[p.name],
    color: p.color,
    bg: p.bg,
  })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const maxCount = ranking.length > 0 ? ranking[0].count : 0;

  const areaRanking = AREAS.map(a => ({
    id: a.id,
    name: a.name,
    icon: a.icon,
    count: areaStats[a.id],
  })).sort((a, b) => b.count - a.count);

  container.innerHTML = `
    <div class="border-b border-[#D6CDC0] dark:border-[#373a40] pb-3 mb-6">
      <h1 class="text-2xl font-display text-[#1B2A4A] dark:text-[#e9ecef]">Estadísticas</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white dark:bg-[#25262b] rounded-xl border border-[#D6CDC0] dark:border-[#373a40] p-6 transition-colors duration-300">
        <h3 class="text-lg font-display text-[#1B2A4A] dark:text-[#e9ecef] mb-4">Ranking General</h3>
        ${total === 0 ? `
          <p class="text-[#8B7D6B] dark:text-[#909296] text-center py-8">No hay registros aún.</p>
        ` : `
          <div class="space-y-3">
            ${ranking.map((p, i) => {
              const barWidth = maxCount > 0 ? (p.count / maxCount) * 100 : 0;
              const medals = ['🥇', '🥈', '🥉'];
              const rankIcon = i < 3 ? medals[i] : `<span class="w-6 h-6 rounded-full bg-[#EBE5DC] dark:bg-[#373a40] flex items-center justify-center text-xs font-bold text-[#8B7D6B] dark:text-[#909296]">${i + 1}</span>`;
              return `
                <div class="flex items-center gap-3 py-2">
                  <div class="w-8 flex-shrink-0 flex justify-center text-sm">
                    ${rankIcon}
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between items-center mb-1">
                      <div class="flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full" style="background-color: ${p.color}"></span>
                        <span class="font-medium text-[#1B2A4A] dark:text-[#e9ecef] text-sm">${p.name}</span>
                      </div>
                      <span class="font-bold text-[#1B2A4A] dark:text-[#e9ecef] text-sm">${p.count}</span>
                    </div>
                    <div class="w-full bg-[#EBE5DC] dark:bg-[#373a40] rounded-full h-2 overflow-hidden">
                      <div class="h-full rounded-full transition-all duration-700" style="width: ${barWidth}%; background-color: ${p.color}"></div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>

      <div class="bg-white dark:bg-[#25262b] rounded-xl border border-[#D6CDC0] dark:border-[#373a40] p-6 transition-colors duration-300">
        <h3 class="text-lg font-display text-[#1B2A4A] dark:text-[#e9ecef] mb-4">Participación</h3>
        ${total === 0 ? `
          <p class="text-[#8B7D6B] dark:text-[#909296] text-center py-8">No hay registros aún.</p>
        ` : `
          <div class="flex flex-col items-center">
            <div class="relative w-48 h-48 mb-6">
              <div class="w-full h-full rounded-full" style="background: ${getConicGradient(stats, total)}"></div>
              <div class="absolute inset-6 bg-white dark:bg-[#25262b] rounded-full flex items-center justify-center shadow-inner transition-colors duration-300">
                <div class="text-center">
                  <span class="text-3xl font-bold text-[#1B2A4A] dark:text-[#e9ecef] block">${total}</span>
                  <span class="text-xs text-[#8B7D6B] dark:text-[#909296] uppercase tracking-wider">Total</span>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap gap-5 justify-center">
              ${PEOPLE.map(p => {
                const pct = total > 0 ? ((stats[p.name] / total) * 100).toFixed(1) : 0;
                return `
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full" style="background-color: ${p.color}"></span>
                    <span class="text-sm text-[#8B7D6B] dark:text-[#909296]">${p.name}</span>
                    <span class="text-sm font-semibold text-[#1B2A4A] dark:text-[#e9ecef]">${pct}%</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `}
      </div>
    </div>

    <div class="bg-white dark:bg-[#25262b] rounded-xl border border-[#D6CDC0] dark:border-[#373a40] p-6 mb-8 transition-colors duration-300">
      <h3 class="text-lg font-display text-[#1B2A4A] dark:text-[#e9ecef] mb-4">Ranking por Área</h3>
      ${total === 0 ? `
        <p class="text-[#8B7D6B] dark:text-[#909296] text-center py-8">No hay registros aún.</p>
      ` : `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${areaRanking.map(a => {
            const topPerson = PEOPLE.reduce((top, p) => {
              const count = personAreaStats[p.name][a.id];
              return count > top.count ? { name: p.name, color: p.color, count } : top;
            }, { name: '', color: '', count: 0 });
            const pct = total > 0 ? ((a.count / total) * 100).toFixed(1) : 0;
            return `
              <div class="border border-[#D6CDC0] dark:border-[#373a40] rounded-xl p-4 transition-colors duration-300">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl">${a.icon}</span>
                    <span class="font-medium text-[#1B2A4A] dark:text-[#e9ecef]">${a.name}</span>
                  </div>
                  <span class="text-sm font-bold text-[#1B2A4A] dark:text-[#e9ecef]">${a.count} <span class="text-[#8B7D6B] dark:text-[#909296] font-normal">(${pct}%)</span></span>
                </div>
                ${topPerson.name ? `
                  <div class="text-xs text-[#8B7D6B] dark:text-[#909296]">
                    Más limpia: <span class="font-semibold" style="color: ${topPerson.color}">${topPerson.name}</span> (${topPerson.count})
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>

    <div class="bg-white dark:bg-[#25262b] rounded-xl border border-[#D6CDC0] dark:border-[#373a40] p-6 mb-8 transition-colors duration-300">
      <h3 class="text-lg font-display text-[#1B2A4A] dark:text-[#e9ecef] mb-4">Estadísticas Mensuales</h3>
      ${months.length === 0 ? `
        <p class="text-[#8B7D6B] dark:text-[#909296] text-center py-8">No hay registros aún.</p>
      ` : `
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-[#D6CDC0] dark:border-[#373a40]">
                <th class="text-left py-3 px-4 font-medium text-[#8B7D6B] dark:text-[#909296]">Mes</th>
                ${PEOPLE.map(p => `<th class="text-center py-3 px-4 font-medium text-[#8B7D6B] dark:text-[#909296]">${p.name}</th>`).join('')}
                <th class="text-center py-3 px-4 font-medium text-[#8B7D6B] dark:text-[#909296]">Total</th>
              </tr>
            </thead>
            <tbody>
              ${months.map(m => {
                const [y, mo] = m.split('-');
                const { monthly, total: monthTotal } = getMonthlyStats(+y, +mo - 1);
                const monthDate = new Date(+y, +mo - 1);
                const monthName = monthDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
                return `
                  <tr class="border-b border-[#D6CDC0] dark:border-[#373a40] hover:bg-[#F6F4EF] dark:hover:bg-[#2f2f32] transition-colors">
                    <td class="py-3 px-4 font-medium text-[#1B2A4A] dark:text-[#e9ecef] capitalize">${monthName}</td>
                    ${PEOPLE.map(p => `
                      <td class="text-center py-3 px-4 text-[#8B7D6B] dark:text-[#909296]">
                        ${monthly[p.name] > 0 ? `<span class="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold" style="background-color: ${p.color}22; color: ${p.color}">${monthly[p.name]}</span>` : '<span class="text-[#D6CDC0] dark:text-[#373a40]">0</span>'}
                      </td>
                    `).join('')}
                    <td class="text-center py-3 px-4 font-bold text-[#1B2A4A] dark:text-[#e9ecef]">${monthTotal}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>

    <div class="bg-white dark:bg-[#25262b] rounded-xl border border-[#D6CDC0] dark:border-[#373a40] p-6 transition-colors duration-300">
      <h3 class="text-lg font-display text-[#1B2A4A] dark:text-[#e9ecef] mb-4">Historial</h3>
      ${records.length === 0 ? `
        <p class="text-[#8B7D6B] dark:text-[#909296] text-center py-8">No hay registros aún.</p>
      ` : `
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-[#D6CDC0] dark:border-[#373a40]">
                <th class="text-left py-3 px-4 font-medium text-[#8B7D6B] dark:text-[#909296]">Fecha</th>
                <th class="text-left py-3 px-4 font-medium text-[#8B7D6B] dark:text-[#909296]">Día</th>
                <th class="text-left py-3 px-4 font-medium text-[#8B7D6B] dark:text-[#909296]">Persona</th>
                <th class="text-left py-3 px-4 font-medium text-[#8B7D6B] dark:text-[#909296]">Área</th>
              </tr>
            </thead>
            <tbody>
              ${records.map(([date, record]) => {
                const d = new Date(date + 'T12:00:00');
                const dayName = d.toLocaleDateString('es-ES', { weekday: 'long' });
                const formattedDate = d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
                return `
                  <tr class="border-b border-[#D6CDC0] dark:border-[#373a40] hover:bg-[#F6F4EF] dark:hover:bg-[#2f2f32] transition-colors">
                    <td class="py-3 px-4 text-[#8B7D6B] dark:text-[#909296]">${formattedDate}</td>
                    <td class="py-3 px-4 text-[#8B7D6B] dark:text-[#909296] capitalize">${dayName}</td>
                    <td class="py-3 px-4">
                      <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white" style="background-color: ${record.color}">
                        ${record.person}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-[#F6F4EF] dark:bg-[#373a40] text-[#1B2A4A] dark:text-[#e9ecef] transition-colors duration-300">
                        ${getAreaIcon(record.area)} ${getAreaName(record.area)}
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}
