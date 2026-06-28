import { loadRecords } from './store.js';
import { renderCalendar, closeModal } from './calendar.js';
import { renderDashboard } from './dashboard.js';
import { renderStats } from './stats.js';

let isSectionAnimating = false;
let hasRenderedOnce = false;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getActiveSection() {
  return document.querySelector('.section:not(.hidden)');
}

function animateSectionOut(section) {
  return new Promise(resolve => {
    if (!section || prefersReducedMotion()) {
      resolve();
      return;
    }
    section.classList.add('section-exit');
    section.addEventListener('animationend', () => {
      section.classList.remove('section-exit');
      resolve();
    }, { once: true });
  });
}

function animateSectionIn(section) {
  return new Promise(resolve => {
    if (!section || prefersReducedMotion()) {
      resolve();
      return;
    }
    void section.offsetWidth;
    section.classList.add('section-enter');
    section.addEventListener('animationend', () => {
      section.classList.remove('section-enter');
      resolve();
    }, { once: true });
  });
}

function renderSection(section) {
  const container = document.getElementById(`${section}-container`);
  if (!container) return;
  container.innerHTML = '';
  switch (section) {
    case 'dashboard': renderDashboard(container); break;
    case 'calendar': renderCalendar(container); break;
    case 'stats': renderStats(container); break;
  }
}

async function navigateTo(section) {
  if (isSectionAnimating) return;
  isSectionAnimating = true;

  const currentSection = getActiveSection();

  if (hasRenderedOnce) {
    await animateSectionOut(currentSection);
  }

  document.querySelectorAll('.section').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-link').forEach(el => {
    el.classList.remove('text-[#C8733A]', 'border-[#C8733A]');
  });

  const sectionEl = document.getElementById(`section-${section}`);
  const navLink = document.querySelector(`.nav-link[data-section="${section}"]`);

  if (sectionEl) {
    sectionEl.classList.remove('hidden');
  }
  if (navLink) {
    navLink.classList.add('text-[#C8733A]', 'border-[#C8733A]');
  }

  renderSection(section);

  if (hasRenderedOnce) {
    await animateSectionIn(sectionEl);
  } else {
    hasRenderedOnce = true;
  }

  isSectionAnimating = false;
}

function reRenderCurrent() {
  const hash = window.location.hash.replace('#', '') || 'dashboard';
  renderSection(hash);
}

function handleHashChange() {
  const hash = window.location.hash.replace('#', '') || 'dashboard';
  navigateTo(hash);
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  loadRecords();

  const modal = document.getElementById('registration-modal');
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.getElementById('modal-close').addEventListener('click', () => closeModal());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const section = link.dataset.section;
      window.location.hash = section;
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }
    });
  });

  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  window.addEventListener('records-changed', reRenderCurrent);

  window.addEventListener('hashchange', handleHashChange);

  if (!window.location.hash) {
    window.location.hash = 'dashboard';
  } else {
    handleHashChange();
  }
});

function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
  updateThemeIcon();
}

function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon();
}

function updateThemeIcon() {
  const isDark = document.documentElement.classList.contains('dark');
  const sunIcon = document.getElementById('theme-icon-sun');
  const moonIcon = document.getElementById('theme-icon-moon');
  if (sunIcon && moonIcon) {
    sunIcon.classList.toggle('hidden', !isDark);
    moonIcon.classList.toggle('hidden', isDark);
  }
}
