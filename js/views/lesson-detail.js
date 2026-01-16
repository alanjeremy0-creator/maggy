/**
 * Maggy - Lesson Detail View
 */

import { getLessonById } from '../data/lessons-content.js';
import { progress } from '../modules/progress.js';
import { voice } from '../modules/voice.js';

export async function renderLessonDetail(params) {
    const lessonId = params.id;
    const lesson = getLessonById(lessonId);

    if (!lesson) {
        return `
      <div class="view" style="text-align: center; padding: 40px;">
        <h2>Lesson not found</h2>
        <button class="btn btn-primary" onclick="location.hash='lessons'">Back to Lessons</button>
      </div>
    `;
    }

    const lessonProgress = await progress.getLessonProgress(lessonId);
    const masteryPercent = lessonProgress.masteryPercent || 0;

    // Build examples HTML
    const examplesHTML = lesson.examples.map((example, i) => `
    <div class="lesson-example" data-index="${i}">
      <button class="lesson-example__play" data-text="${example.english}" title="Listen">
        🔊
      </button>
      <div class="lesson-example__english">${example.english}</div>
      <div class="lesson-example__spanish">${example.spanish}</div>
    </div>
  `).join('');

    // Build key points HTML
    const keyPointsHTML = lesson.theory.keyPoints.map(point => `
    <li>${point}</li>
  `).join('');

    return `
    <div class="view lesson-detail-view">
      <!-- Header -->
      <div class="lesson-header">
        <button class="lesson-header__back" onclick="location.hash='lessons'">←</button>
        <div class="lesson-header__info">
          <span class="lesson-header__badge badge badge-primary">${lesson.subtitle}</span>
          <h1 class="lesson-header__title">${lesson.title}</h1>
        </div>
      </div>

      <!-- Progress -->
      <div class="glass-card p-4 mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-secondary">Your mastery</span>
          <span class="font-bold ${masteryPercent >= 70 ? 'text-success' : ''}">${masteryPercent}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar__fill" style="width: ${masteryPercent}%"></div>
        </div>
      </div>

      <!-- Theory Section -->
      <section class="lesson-section mb-4">
        <h2 class="lesson-section__title">
          <span>📖</span> What you'll learn
        </h2>
        <p class="lesson-theory">${lesson.theory.explanation}</p>
        
        <h3 class="text-lg font-semibold mt-6 mb-3">Key Points:</h3>
        <ul class="lesson-theory" style="list-style: none; padding: 0;">
          ${keyPointsHTML}
        </ul>
      </section>

      <!-- Examples Section -->
      <section class="lesson-section mb-4">
        <h2 class="lesson-section__title">
          <span>💡</span> Examples
        </h2>
        <p class="text-secondary mb-4">Tap 🔊 to hear each example</p>
        <div class="lesson-examples">
          ${examplesHTML}
        </div>
      </section>

      <!-- Actions -->
      <div class="lesson-actions">
        <button class="btn btn-primary btn-lg w-full" data-action="start-quiz">
          📝 Take the Quiz
        </button>
        <button class="btn btn-secondary btn-lg w-full" data-action="start-practice">
          💬 Practice with Maggy
        </button>
      </div>
    </div>
  `;
}

export function initLessonDetailEvents(params) {
    const lessonId = params.id;

    // Play audio buttons
    document.querySelectorAll('.lesson-example__play').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const text = btn.dataset.text;

            // Visual feedback
            btn.textContent = '⏳';
            btn.disabled = true;

            try {
                await voice.speak(text);
            } catch (error) {
                console.error('Speech error:', error);
            }

            btn.textContent = '🔊';
            btn.disabled = false;
        });
    });

    // Start quiz button
    document.querySelector('[data-action="start-quiz"]')?.addEventListener('click', () => {
        location.hash = `quiz/${lessonId}`;
    });

    // Practice button
    document.querySelector('[data-action="start-practice"]')?.addEventListener('click', () => {
        location.hash = `conversation/${lessonId}`;
    });
}

export default {
    render: renderLessonDetail,
    afterRender: initLessonDetailEvents
};
