/**
 * Maggy - Progress View
 * Dashboard showing overall learning progress
 */

import { gamification } from '../modules/gamification.js';
import { progress } from '../modules/progress.js';

export async function renderProgress() {
    const summary = await gamification.getSummary();
    const profile = await progress.getProfile();

    // Calculate streak ring offset
    const maxStreak = 30; // Show progress toward 30-day streak
    const streakPercent = Math.min(100, (summary.streak.current / maxStreak) * 100);
    const streakOffset = 226 - (streakPercent / 100) * 226;

    // Calculate mastery ring offset
    const masteryOffset = 226 - (summary.overallMastery / 100) * 226;

    // Lessons progress list
    const lessonsHTML = summary.lessons.map(lesson => {
        const statusIcon = lesson.status === 'completed' ? '✅' :
            lesson.status === 'in-progress' ? '📝' :
                lesson.status === 'locked' ? '🔒' : '📖';

        return `
      <div class="progress-lesson-item">
        <span class="progress-lesson-item__status">${statusIcon}</span>
        <span class="progress-lesson-item__name">${lesson.title}</span>
        <span class="progress-lesson-item__percent">${lesson.masteryPercent}%</span>
      </div>
    `;
    }).join('');

    // Time spent (convert minutes to hours/minutes)
    const totalMinutes = profile.totalTimeSpent || 0;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const timeDisplay = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    return `
    <div class="view progress-view">
      <header class="view-header">
        <h1 class="view-title">Progress</h1>
        <p class="view-subtitle">Track your English learning journey</p>
      </header>

      <!-- Overview Cards -->
      <div class="progress-overview">
        <!-- Streak -->
        <div class="progress-stat animate-fadeInUp stagger-1">
          <div class="progress-stat__visual">
            <svg class="mastery-ring__circle" viewBox="0 0 80 80" width="80" height="80">
              <defs>
                <linearGradient id="streak-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#F59E0B" />
                  <stop offset="100%" stop-color="#EF4444" />
                </linearGradient>
              </defs>
              <circle class="mastery-ring__bg" cx="40" cy="40" r="36" fill="none" stroke="var(--bg-card)" stroke-width="6" />
              <circle cx="40" cy="40" r="36" fill="none" stroke="url(#streak-gradient)" stroke-width="6" 
                      stroke-linecap="round" stroke-dasharray="226" stroke-dashoffset="${streakOffset}"
                      style="transform: rotate(-90deg); transform-origin: center;" />
            </svg>
            <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;">
              🔥
            </div>
          </div>
          <span class="progress-stat__value">${summary.streak.current}</span>
          <span class="progress-stat__label">Day Streak</span>
        </div>

        <!-- Mastery -->
        <div class="progress-stat animate-fadeInUp stagger-2">
          <div class="progress-stat__visual">
            <svg class="mastery-ring__circle" viewBox="0 0 80 80" width="80" height="80">
              <defs>
                <linearGradient id="progress-mastery-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#7C3AED" />
                  <stop offset="100%" stop-color="#06B6D4" />
                </linearGradient>
              </defs>
              <circle class="mastery-ring__bg" cx="40" cy="40" r="36" fill="none" stroke="var(--bg-card)" stroke-width="6" />
              <circle cx="40" cy="40" r="36" fill="none" stroke="url(#progress-mastery-gradient)" stroke-width="6" 
                      stroke-linecap="round" stroke-dasharray="226" stroke-dashoffset="${masteryOffset}"
                      style="transform: rotate(-90deg); transform-origin: center;" />
            </svg>
            <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 700;">
              ${summary.overallMastery}%
            </div>
          </div>
          <span class="progress-stat__value">${summary.masteryLevel.label}</span>
          <span class="progress-stat__label">Overall Mastery</span>
        </div>

        <!-- Lessons -->
        <div class="progress-stat animate-fadeInUp stagger-3">
          <span class="progress-stat__icon" style="font-size: 32px; margin-bottom: 8px;">📚</span>
          <span class="progress-stat__value">${summary.completedCount}/${summary.totalLessons}</span>
          <span class="progress-stat__label">Completed</span>
        </div>

        <!-- Longest Streak -->
        <div class="progress-stat animate-fadeInUp stagger-4">
          <span class="progress-stat__icon" style="font-size: 32px; margin-bottom: 8px;">🏆</span>
          <span class="progress-stat__value">${summary.streak.longest || summary.streak.current}</span>
          <span class="progress-stat__label">Best Streak</span>
        </div>
      </div>

      <!-- Today's Goal -->
      <div class="glass-card p-4 mt-6 animate-fadeInUp stagger-5">
        <div class="flex justify-between items-center mb-3">
          <span class="font-semibold">Today's Goal</span>
          <span class="text-secondary">${summary.todayExercises}/${summary.dailyGoal} exercises</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar__fill" style="width: ${Math.min(100, (summary.todayExercises / summary.dailyGoal) * 100)}%"></div>
        </div>
        ${summary.todayExercises >= summary.dailyGoal
            ? '<p class="text-success text-sm mt-2">✅ Goal completed for today!</p>'
            : `<p class="text-muted text-sm mt-2">${summary.dailyGoal - summary.todayExercises} more to go!</p>`
        }
      </div>

      <!-- Lessons Breakdown -->
      <div class="progress-lessons mt-6 animate-fadeInUp stagger-6">
        <h2 class="progress-lessons__title">Lesson Progress</h2>
        ${lessonsHTML}
      </div>

      <!-- Next Milestone -->
      ${summary.streak.nextMilestone ? `
        <div class="glass-card p-4 mt-6 text-center animate-fadeInUp">
          <p class="text-secondary">Next streak milestone</p>
          <p class="text-2xl font-bold gradient-text">${summary.streak.nextMilestone} days</p>
          <p class="text-muted text-sm">${summary.streak.daysToMilestone} days to go!</p>
        </div>
      ` : ''}
    </div>
  `;
}

export function initProgressEvents() {
    // No interactive events needed for this view
}

export default {
    render: renderProgress,
    afterRender: initProgressEvents
};
