/**
 * Maggy - Home View
 */

import { gamification } from '../modules/gamification.js';
import { progress } from '../modules/progress.js';

export async function renderHome() {
    const summary = await gamification.getSummary();
    const profile = await progress.getProfile();

    const streakDisplay = summary.streak.current > 0
        ? `<div class="streak-counter">
        <span class="streak-counter__icon">🔥</span>
        <span class="streak-counter__value">${summary.streak.current}</span>
        <span class="streak-counter__label">day streak</span>
      </div>`
        : '';

    const continueCard = summary.nextAction.type !== 'conversation'
        ? `<div class="home-action-card continue-card" data-action="continue" data-lesson="${summary.nextAction.lessonId}">
        <div class="home-action-card__icon home-action-card__icon--primary">
          <span>▶️</span>
        </div>
        <div class="home-action-card__content">
          <h3 class="home-action-card__title">${summary.nextAction.message}</h3>
          <p class="home-action-card__description">Pick up where you left off</p>
        </div>
        <span class="home-action-card__arrow">→</span>
      </div>`
        : '';

    return `
    <div class="view home-view">
      <!-- Greeting Section -->
      <div class="home-greeting animate-fadeIn">
        <span class="home-greeting__emoji">🎓</span>
        <h1 class="home-greeting__title">Hey there!</h1>
        <p class="home-greeting__subtitle">Ready to practice your English?</p>
        ${streakDisplay}
      </div>

      <!-- Stats Section -->
      <div class="home-stats">
        <div class="stat-card animate-fadeInUp stagger-1">
          <span class="stat-card__icon">📚</span>
          <span class="stat-card__value">${summary.completedCount}/${summary.totalLessons}</span>
          <span class="stat-card__label">Lessons</span>
        </div>
        <div class="stat-card animate-fadeInUp stagger-2">
          <span class="stat-card__icon">🎯</span>
          <span class="stat-card__value">${summary.overallMastery}%</span>
          <span class="stat-card__label">Mastery</span>
        </div>
        <div class="stat-card animate-fadeInUp stagger-3">
          <span class="stat-card__icon">✨</span>
          <span class="stat-card__value">${summary.todayExercises}/${summary.dailyGoal}</span>
          <span class="stat-card__label">Today</span>
        </div>
        <div class="stat-card animate-fadeInUp stagger-4">
          <span class="stat-card__icon">🔥</span>
          <span class="stat-card__value">${summary.streak.current}</span>
          <span class="stat-card__label">Streak</span>
        </div>
      </div>

      <!-- Action Cards -->
      <div class="home-actions">
        ${continueCard}

        <div class="home-action-card" data-action="lessons">
          <div class="home-action-card__icon home-action-card__icon--success">
            <span>📚</span>
          </div>
          <div class="home-action-card__content">
            <h3 class="home-action-card__title">All Lessons</h3>
            <p class="home-action-card__description">Browse and select a topic</p>
          </div>
          <span class="home-action-card__arrow">→</span>
        </div>

        <div class="home-action-card" data-action="conversation">
          <div class="home-action-card__icon home-action-card__icon--warning">
            <span>💬</span>
          </div>
          <div class="home-action-card__content">
            <h3 class="home-action-card__title">Free Conversation</h3>
            <p class="home-action-card__description">Chat with Maggy</p>
          </div>
          <span class="home-action-card__arrow">→</span>
        </div>
      </div>
    </div>
  `;
}

export function initHomeEvents() {
    // Action card clicks
    document.querySelectorAll('.home-action-card').forEach(card => {
        card.addEventListener('click', () => {
            const action = card.dataset.action;
            const lessonId = card.dataset.lesson;

            switch (action) {
                case 'continue':
                    location.hash = `lesson/${lessonId}`;
                    break;
                case 'lessons':
                    location.hash = 'lessons';
                    break;
                case 'conversation':
                    location.hash = 'conversation';
                    break;
            }
        });
    });
}

export default { render: renderHome, afterRender: initHomeEvents };
