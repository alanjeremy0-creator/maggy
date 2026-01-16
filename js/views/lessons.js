/**
 * Maggy - Lessons List View
 */

import { gamification } from '../modules/gamification.js';

export async function renderLessons() {
    const summary = await gamification.getSummary();
    const lessons = summary.lessons;

    const lessonsHTML = lessons.map((lesson, index) => {
        const statusClass = lesson.status === 'locked' ? 'lesson-card--locked' :
            lesson.status === 'completed' ? 'lesson-card--completed' : '';

        const statusIcon = lesson.status === 'completed' ? '✅' :
            lesson.status === 'locked' ? '🔒' :
                lesson.status === 'in-progress' ? '📝' : '📖';

        const masteryBadge = lesson.status !== 'locked' && lesson.masteryPercent > 0
            ? `<span class="badge ${lesson.masteryLevel.percent >= 70 ? 'badge-success' : 'badge-primary'}">${lesson.masteryPercent}%</span>`
            : lesson.status === 'locked'
                ? '<span class="badge badge-locked">Locked</span>'
                : '';

        return `
      <div class="lesson-card ${statusClass} animate-fadeInUp stagger-${index + 1}" 
           data-lesson-id="${lesson.id}"
           data-available="${lesson.available}">
        <div class="lesson-card__icon">
          <span>${lesson.icon}</span>
        </div>
        <div class="lesson-card__content">
          <h3 class="lesson-card__title">${lesson.title}</h3>
          <p class="lesson-card__description">${lesson.subtitle} - ${lesson.description}</p>
        </div>
        <div class="lesson-card__status">
          ${masteryBadge}
          <span class="lesson-card__${lesson.status === 'locked' ? 'lock' : 'check'}">${statusIcon}</span>
        </div>
      </div>
    `;
    }).join('');

    return `
    <div class="view lessons-view">
      <header class="view-header">
        <h1 class="view-title">Lessons</h1>
        <p class="view-subtitle">Master English fundamentals step by step</p>
      </header>

      <!-- Overall Progress -->
      <div class="lessons-progress">
        <div class="lessons-progress__header">
          <span class="lessons-progress__title">Overall Progress</span>
          <span class="lessons-progress__count">${summary.completedCount}/${summary.totalLessons} completed</span>
        </div>
        <div class="progress-bar progress-bar--lg">
          <div class="progress-bar__fill" style="width: ${summary.progressPercent}%"></div>
        </div>
      </div>

      <!-- Lessons List -->
      <div class="lessons-list">
        ${lessonsHTML}
      </div>
    </div>
  `;
}

export function initLessonsEvents() {
    document.querySelectorAll('.lesson-card').forEach(card => {
        card.addEventListener('click', () => {
            const isAvailable = card.dataset.available === 'true';
            const lessonId = card.dataset.lessonId;

            if (isAvailable) {
                location.hash = `lesson/${lessonId}`;
            } else {
                // Show locked message
                showToast('Complete previous lessons first!', 'warning');
            }
        });
    });
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
    <span class="toast__icon">${icons[type]}</span>
    <div class="toast__content">
      <p class="toast__message">${message}</p>
    </div>
  `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

export default { render: renderLessons, afterRender: initLessonsEvents };
