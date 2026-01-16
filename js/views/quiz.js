/**
 * Maggy - Quiz View
 */

import { quiz as quizModule } from '../modules/quiz.js';
import { voice } from '../modules/voice.js';

let currentQuiz = null;

export async function renderQuiz(params) {
    const lessonId = params.id;

    try {
        currentQuiz = quizModule.startQuiz(lessonId);
    } catch (error) {
        return `
      <div class="view" style="text-align: center; padding: 40px;">
        <h2>Quiz not available</h2>
        <p>${error.message}</p>
        <button class="btn btn-primary" onclick="location.hash='lessons'">Back to Lessons</button>
      </div>
    `;
    }

    return renderQuizQuestion();
}

function renderQuizQuestion() {
    const question = quizModule.getCurrentQuestion();

    if (!question) {
        // Quiz finished - this shouldn't happen, but handle it
        return '<div class="view">Loading results...</div>';
    }

    const optionsHTML = question.options.map((option, i) => {
        const letter = String.fromCharCode(65 + i); // A, B, C...
        return `
      <button class="quiz-option" data-answer="${option}">
        <span class="quiz-option__letter">${letter}</span>
        <span class="quiz-option__text">${option}</span>
      </button>
    `;
    }).join('');

    return `
    <div class="view quiz-view">
      <!-- Header -->
      <div class="quiz-header">
        <button class="quiz-header__close" id="quit-quiz">✕</button>
        <div class="quiz-header__progress flex-1">
          <div class="progress-bar">
            <div class="progress-bar__fill" style="width: ${question.progress}%"></div>
          </div>
        </div>
        <span class="quiz-header__count">${question.index + 1}/${question.total}</span>
      </div>

      <!-- Question -->
      <div class="quiz-question" id="quiz-content">
        <div class="quiz-question__prompt">
          <p class="quiz-question__text">${question.question}</p>
          ${question.hint ? `<p class="quiz-question__hint">${question.hint}</p>` : ''}
        </div>

        <div class="quiz-options" id="quiz-options">
          ${optionsHTML}
        </div>
      </div>

      <!-- Feedback (hidden initially) -->
      <div class="quiz-feedback hidden" id="quiz-feedback"></div>

      <!-- Footer -->
      <div class="quiz-footer">
        <button class="btn btn-primary btn-lg w-full hidden" id="next-question">
          Continue →
        </button>
      </div>
    </div>
  `;
}

function renderFeedback(result) {
    const feedbackClass = result.correct ? 'quiz-feedback--correct' : 'quiz-feedback--incorrect';
    const icon = result.correct ? '🎉' : '💡';
    const title = result.correct ? 'Correct!' : 'Not quite...';

    return `
    <div class="${feedbackClass}">
      <span class="quiz-feedback__icon">${icon}</span>
      <h3 class="quiz-feedback__title">${title}</h3>
      <p class="quiz-feedback__explanation">${result.explanation}</p>
      ${!result.correct ? `<p class="mt-2"><strong>Correct answer:</strong> ${result.correctAnswer}</p>` : ''}
      ${result.aiFeedback ? `<p class="mt-3 text-secondary">${result.aiFeedback}</p>` : ''}
    </div>
  `;
}

async function renderResults() {
    const results = await quizModule.finishQuiz();

    const lessonUrl = `lesson/${results.lessonId}`;
    const isPassed = results.passed;

    // Mastery ring SVG
    const circumference = 226;
    const offset = circumference - (results.score / 100) * circumference;

    // Unlocked lessons message
    const unlockedMessage = results.unlockedLessons.length > 0
        ? `<p class="text-success mt-4">🎉 You unlocked: ${results.unlockedLessons.map(l => l.title).join(', ')}</p>`
        : '';

    // Streak milestone
    const streakMessage = results.streakMilestone
        ? `<div class="glass-card p-4 mt-4 text-center">
        <h3>${results.streakMilestone.title}</h3>
        <p class="text-secondary">${results.streakMilestone.message}</p>
      </div>`
        : '';

    const container = document.getElementById('main-content');
    container.innerHTML = `
    <div class="view" style="text-align: center; padding: 40px 20px;">
      <h1 class="view-title mb-6">${isPassed ? '🎉 Great Job!' : '💪 Keep Practicing!'}</h1>
      
      <!-- Score Ring -->
      <div class="mastery-ring" style="width: 150px; height: 150px; margin: 0 auto;">
        <svg class="mastery-ring__circle" viewBox="0 0 80 80">
          <defs>
            <linearGradient id="mastery-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${isPassed ? '#10B981' : '#F59E0B'}" />
              <stop offset="100%" stop-color="${isPassed ? '#059669' : '#EF4444'}" />
            </linearGradient>
          </defs>
          <circle class="mastery-ring__bg" cx="40" cy="40" r="36" />
          <circle class="mastery-ring__progress" cx="40" cy="40" r="36" 
                  style="stroke-dashoffset: ${offset}" />
        </svg>
        <span class="mastery-ring__value" style="font-size: 2rem;">${results.score}%</span>
      </div>
      
      <p class="text-lg mt-4">${results.correctCount} of ${results.totalQuestions} correct</p>
      
      ${unlockedMessage}
      ${streakMessage}
      
      <div class="flex flex-col gap-4 mt-8" style="max-width: 300px; margin: 2rem auto 0;">
        ${!isPassed ? `
          <button class="btn btn-primary btn-lg w-full" onclick="location.hash='quiz/${results.lessonId}'">
            Try Again
          </button>
        ` : ''}
        <button class="btn btn-secondary btn-lg w-full" onclick="location.hash='${lessonUrl}'">
          Back to Lesson
        </button>
        <button class="btn btn-ghost w-full" onclick="location.hash='lessons'">
          All Lessons
        </button>
      </div>
    </div>
  `;
}

export async function initQuizEvents(params) {
    // Quit button
    document.getElementById('quit-quiz')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
            quizModule.reset();
            location.hash = `lesson/${params.id}`;
        }
    });

    // Option selection
    setupOptionListeners();
}

function setupOptionListeners() {
    const options = document.querySelectorAll('.quiz-option');
    const nextBtn = document.getElementById('next-question');
    const feedbackEl = document.getElementById('quiz-feedback');

    options.forEach(option => {
        option.addEventListener('click', async () => {
            // Disable all options
            options.forEach(o => o.disabled = true);

            // Visual selection
            option.classList.add('selected');

            // Submit answer
            const answer = option.dataset.answer;
            const result = await quizModule.submitAnswer(answer);

            // Show correct/incorrect state
            options.forEach(o => {
                const isCorrect = o.dataset.answer === result.correctAnswer;
                const isSelected = o === option;

                if (isCorrect) o.classList.add('correct');
                if (isSelected && !result.correct) o.classList.add('incorrect');
            });

            // Show feedback
            if (feedbackEl) {
                feedbackEl.innerHTML = renderFeedback(result);
                feedbackEl.classList.remove('hidden');
            }

            // Speak feedback
            if (!voice.silentMode) {
                const message = result.correct ? 'Correct!' : `The correct answer is: ${result.correctAnswer}`;
                voice.speak(message);
            }

            // Show next button
            if (nextBtn) {
                nextBtn.classList.remove('hidden');
                nextBtn.textContent = result.hasNext ? 'Continue →' : 'See Results';

                nextBtn.onclick = async () => {
                    if (result.hasNext) {
                        // Load next question
                        quizModule.nextQuestion();
                        const container = document.getElementById('main-content');
                        container.innerHTML = renderQuizQuestion();
                        setupOptionListeners();

                        // Re-setup quit button
                        document.getElementById('quit-quiz')?.addEventListener('click', () => {
                            if (confirm('Quit quiz?')) {
                                quizModule.reset();
                                history.back();
                            }
                        });
                    } else {
                        // Show results
                        await renderResults();
                    }
                };
            }
        });
    });
}

export default {
    render: renderQuiz,
    afterRender: initQuizEvents
};
