import { PEOPLE, AREAS } from './constants.js';
import { getRecords, saveRecord, getDayRecords } from './store.js';

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
const today = new Date();
const todayStr = formatDate(today);

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getMonthName(month) {
  const names = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  return names[month];
}

export function renderCalendar(container) {
  container.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'flex items-center justify-between mb-6';
  header.innerHTML = `
    <button id="prev-month" class="p-2 hover:bg-[#F6F4EF] dark:hover:bg-[#2f2f32] rounded-lg transition-colors" aria-label="Mes anterior">
      <svg class="w-5 h-5 text-[#8B7D6B] dark:text-[#909296]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
    </button>
    <h2 class="text-xl font-display text-[#1B2A4A] dark:text-[#e9ecef]">${getMonthName(currentMonth)} ${currentYear}</h2>
    <button id="next-month" class="p-2 hover:bg-[#F6F4EF] dark:hover:bg-[#2f2f32] rounded-lg transition-colors" aria-label="Mes siguiente">
      <svg class="w-5 h-5 text-[#8B7D6B] dark:text-[#909296]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </button>
  `;
  container.appendChild(header);

  const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const labelsGrid = document.createElement('div');
  labelsGrid.className = 'grid grid-cols-7 gap-1 mb-2';
  for (const label of dayLabels) {
    const div = document.createElement('div');
    div.className = 'text-center text-xs font-medium text-[#8B7D6B] dark:text-[#909296] py-2';
    div.textContent = label;
    labelsGrid.appendChild(div);
  }
  container.appendChild(labelsGrid);

  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-7 gap-1';

  const firstDay = new Date(currentYear, currentMonth, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const allRecords = getRecords();

  for (let i = 0; i < startOffset; i++) {
    const empty = document.createElement('div');
    grid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('div');
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = dateStr === todayStr;
    const isFuture = dateStr > todayStr;
    const dayRecs = allRecords[dateStr] || [];

    let classes = 'calendar-cell relative h-10 sm:h-14 md:h-20 rounded-lg border border-[#D6CDC0] dark:border-[#373a40] flex flex-col items-center justify-center';

    if (isToday) {
      classes += ' ring-2 ring-[#C8733A] ring-offset-2 cursor-pointer hover:scale-105';
    } else if (isFuture) {
      classes += ' opacity-30 cursor-not-allowed';
    } else if (dayRecs.length > 0) {
      classes += ' cursor-default';
    } else {
      classes += ' cursor-default';
    }

    cell.className = classes;

    const dayNum = document.createElement('span');
    dayNum.className = 'text-sm sm:text-base font-medium text-[#1B2A4A] dark:text-[#e9ecef]';
    dayNum.textContent = day;
    cell.appendChild(dayNum);

    if (dayRecs.length > 0) {
      const dotRow = document.createElement('div');
      dotRow.className = 'flex items-center gap-0.5 mt-0.5 max-w-full overflow-hidden px-1';

      const maxVisible = 5;
      const visible = dayRecs.slice(0, maxVisible);
      const remainder = dayRecs.length - maxVisible;

      for (const rec of visible) {
        const dot = document.createElement('span');
        dot.className = 'w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0';
        dot.style.backgroundColor = rec.color;
        dot.title = `${rec.person} - ${rec.area}`;
        dotRow.appendChild(dot);
      }

      if (remainder > 0) {
        const more = document.createElement('span');
        more.className = 'text-[10px] text-[#8B7D6B] dark:text-[#909296] flex-shrink-0 ml-0.5 font-medium';
        more.textContent = `+${remainder}`;
        dotRow.appendChild(more);
      }

      cell.appendChild(dotRow);
    }

    if (isToday) {
      cell.addEventListener('click', () => showRegistrationModal(dateStr));
    }

    grid.appendChild(cell);
  }

  container.appendChild(grid);

  document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(container);
  });

  document.getElementById('next-month').addEventListener('click', () => {
    const nextDate = new Date(currentYear, currentMonth + 1, 1);
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    if (nextDate > currentMonthStart) return;
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(container);
  });
}

function showRegistrationModal(dateStr) {
  const modal = document.getElementById('registration-modal');
  const dateDisplay = document.getElementById('modal-date');
  const buttonsContainer = document.getElementById('modal-people');

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.classList.add('overflow-hidden');

  const [y, m, d] = dateStr.split('-');
  const dateObj = new Date(+y, +m - 1, +d);
  dateDisplay.textContent = dateObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  renderPeopleStep(buttonsContainer, dateStr);

  const overlayClick = (e) => {
    if (e.target === modal) {
      closeModal();
    }
  };
  modal.addEventListener('click', overlayClick, { once: true });
}

function renderPeopleStep(container, dateStr) {
  const existing = getDayRecords(dateStr);
  container.innerHTML = '';

  for (const person of PEOPLE) {
    const btn = document.createElement('button');
    btn.className = `flex items-center gap-3 w-full p-4 rounded-xl border-2 border-gray-200 dark:border-[#373a40] transition-all duration-200 hover:shadow-md`;
    btn.style.borderColor = '#e5e7eb';

    const personRecs = existing.filter(r => r.person === person.name);
    const count = personRecs.length;

    btn.innerHTML = `
      <div class="flex flex-col items-center flex-shrink-0 w-10">
        <span class="w-10 h-10 rounded-full ${person.bg}"></span>
        ${count > 0 ? `<span class="text-xs font-bold text-gray-500 dark:text-[#909296] mt-0.5">x${count}</span>` : ''}
      </div>
      <span class="text-lg font-medium text-gray-800 dark:text-[#e9ecef]">${person.name}</span>
    `;

    btn.addEventListener('mouseenter', () => {
      btn.style.borderColor = person.color;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.borderColor = '#e5e7eb';
    });
    btn.addEventListener('click', () => {
      renderAreaStep(container, dateStr, person);
    });
    container.appendChild(btn);
  }
}

function renderAreaStep(container, dateStr, person) {
  const existing = getDayRecords(dateStr);

  container.innerHTML = '';

  const backBtn = document.createElement('button');
  backBtn.className = 'flex items-center gap-2 text-sm text-[#8B7D6B] dark:text-[#909296] hover:text-[#1B2A4A] dark:hover:text-[#e9ecef] mb-3 transition-colors';
  backBtn.innerHTML = `
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
    </svg>
    Volver
  `;
  backBtn.addEventListener('click', () => {
    renderPeopleStep(container, dateStr);
  });
  container.appendChild(backBtn);

  const personHeader = document.createElement('div');
  personHeader.className = 'flex items-center gap-3 mb-4 pb-3 border-b border-gray-100 dark:border-[#373a40]';
  personHeader.innerHTML = `
    <span class="w-8 h-8 rounded-full ${person.bg}"></span>
    <span class="font-semibold text-[#1B2A4A] dark:text-[#e9ecef]">${person.name}</span>
  `;
  container.appendChild(personHeader);

  for (const area of AREAS) {
    const registration = existing.find(r => r.area === area.id);
    const isRegistered = area.id !== 'cocina' && area.id !== 'otro' && registration;
    const btn = document.createElement('button');
    btn.className = `flex items-center gap-3 w-full p-4 rounded-xl border-2 transition-all duration-200 ${
      isRegistered ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
    }`;
    btn.style.borderColor = isRegistered ? '#e5e7eb' : person.color + '40';

    btn.innerHTML = `
      <span class="text-2xl">${area.icon}</span>
      <div class="flex-1 text-left">
        <span class="font-medium text-[#1B2A4A] dark:text-white">${area.name}</span>
        ${isRegistered ? `<span class="block text-xs text-[#8B7D6B] dark:text-gray-300">Registrado por ${registration.person}</span>` : ''}
      </div>
      ${isRegistered ? `
        <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
      ` : ''}
    `;

    if (!isRegistered) {
      btn.addEventListener('mouseenter', () => {
        btn.style.borderColor = person.color;
        btn.style.backgroundColor = person.color + '10';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.borderColor = person.color + '40';
        btn.style.backgroundColor = 'transparent';
      });
      btn.addEventListener('click', () => {
        saveRecord(dateStr, person.name, person.color, area.id);
        closeModal();
        const calendarContainer = document.getElementById('calendar-container');
        renderCalendar(calendarContainer);
      });
    }
    container.appendChild(btn);
  }
}

export function closeModal() {
  const modal = document.getElementById('registration-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.classList.remove('overflow-hidden');
}
