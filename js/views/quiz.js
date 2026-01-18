/**
 * Maggy - Quiz View
 * Supports multiple question types: fill-blank, multiple-choice, reorder, listening, word-scramble
 */

import { quiz as quizModule } from '../modules/quiz.js';
import { voice } from '../modules/voice.js';

let currentQuiz = null;
let reorderSelectedWords = [];

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
  reorderSelectedWords = [];

  if (!question) {
    return '<div class="view">Loading results...</div>';
  }

  let questionContent = '';

  switch (question.type) {
    case 'reorder':
      questionContent = renderReorderQuestion(question);
      break;
    case 'listening':
      questionContent = renderListeningQuestion(question);
      break;
    case 'word-scramble':
      questionContent = renderWordScrambleQuestion(question);
      break;
    default:
      // fill-blank, multiple-choice, transform, etc.
      questionContent = renderOptionsQuestion(question);
  }

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
          ${questionContent}
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

// Standard options (fill-blank, multiple-choice, etc.)
function renderOptionsQuestion(question) {
  if (!question.options || question.options.length === 0) {
    return '<p>No options available</p>';
  }

  return question.options.map((option, i) => {
    const letter = String.fromCharCode(65 + i);
    return `
      <button class="quiz-option" data-answer="${option}">
        <span class="quiz-option__letter">${letter}</span>
        <span class="quiz-option__text">${option}</span>
      </button>
    `;
  }).join('');
}

// Reorder words question
function renderReorderQuestion(question) {
  const words = question.words || [];
  const shuffledWords = [...words].sort(() => Math.random() - 0.5);

  return `
    <div class="reorder-container">
      <div class="reorder-sentence" id="reorder-sentence">
        <p class="reorder-placeholder">Toca las palabras en orden</p>
      </div>
      <div class="reorder-words" id="reorder-words">
        ${shuffledWords.map((word, i) => `
          <button class="reorder-word" data-word="${word}" data-index="${i}">
            ${word}
          </button>
        `).join('')}
      </div>
      <button class="btn btn-primary btn-lg w-full mt-4" id="submit-reorder" disabled>
        Check Answer
      </button>
    </div>
  `;
}

// Listening/dictation question
function renderListeningQuestion(question) {
  return `
    <div class="listening-container">
      <div class="listening-controls">
        <button class="btn-listen" id="play-audio" title="Escuchar">
          🔊
        </button>
        <button class="btn-listen-slow" id="play-audio-slow" title="Escuchar lento">
          🐢
        </button>
      </div>
      <p class="listening-hint">Escucha y escribe lo que oyes</p>
      <input type="text" 
             class="listening-input" 
             id="listening-input" 
             placeholder="Escribe la frase aquí..."
             autocomplete="off"
             autocapitalize="off">
      <button class="btn btn-primary btn-lg w-full mt-4" id="submit-listening">
        Check Answer
      </button>
    </div>
  `;
}

// Word scramble question
function renderWordScrambleQuestion(question) {
  const scrambled = question.scrambled || '';
  const letters = scrambled.split('');

  return `
    <div class="scramble-container">
      <div class="scramble-letters">
        ${letters.map((letter, i) => `
          <span class="scramble-letter">${letter}</span>
        `).join('')}
      </div>
      ${question.hint ? `<p class="scramble-hint">${question.hint}</p>` : ''}
      <input type="text" 
             class="scramble-input" 
             id="scramble-input" 
             placeholder="Escribe la palabra..."
             autocomplete="off"
             autocapitalize="characters"
             style="text-transform: uppercase;">
      <button class="btn btn-primary btn-lg w-full mt-4" id="submit-scramble">
        Check Answer
      </button>
    </div>
  `;
}

function renderFeedback(result) {
  const feedbackClass = result.correct ? 'quiz-feedback--correct' : 'quiz-feedback--incorrect';
  const icon = result.correct ? '🎉' : '💡';
  const title = result.correct ? '¡Correcto!' : 'No exactamente...';

  return `
    <div class="${feedbackClass}">
      <span class="quiz-feedback__icon">${icon}</span>
      <h3 class="quiz-feedback__title">${title}</h3>
      <p class="quiz-feedback__explanation">${result.explanation}</p>
      ${!result.correct ? `<p class="mt-2"><strong>Respuesta correcta:</strong> ${result.correctAnswer}</p>` : ''}
      ${result.aiFeedback ? `<p class="mt-3 text-secondary">${result.aiFeedback}</p>` : ''}
    </div>
  `;
}

async function renderResults() {
  const results = await quizModule.finishQuiz();

  const lessonUrl = `lesson/${results.lessonId}`;
  const isPassed = results.passed;

  const circumference = 226;
  const offset = circumference - (results.score / 100) * circumference;

  const unlockedMessage = results.unlockedLessons.length > 0
    ? `<p class="text-success mt-4">🎉 Desbloqueaste: ${results.unlockedLessons.map(l => l.title).join(', ')}</p>`
    : '';

  const streakMessage = results.streakMilestone
    ? `<div class="glass-card p-4 mt-4 text-center">
        <h3>${results.streakMilestone.title}</h3>
        <p class="text-secondary">${results.streakMilestone.message}</p>
      </div>`
    : '';

  const container = document.getElementById('main-content');
  container.innerHTML = `
    <div class="view" style="text-align: center; padding: 40px 20px;">
      <h1 class="view-title mb-6">${isPassed ? '🎉 ¡Excelente!' : '💪 ¡Sigue practicando!'}</h1>
      
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
      
      <p class="text-lg mt-4">${results.correctCount} de ${results.totalQuestions} correctas</p>
      
      ${unlockedMessage}
      ${streakMessage}
      
      <div class="flex flex-col gap-4 mt-8" style="max-width: 300px; margin: 2rem auto 0;">
        ${!isPassed ? `
          <button class="btn btn-primary btn-lg w-full" onclick="location.hash='quiz/${results.lessonId}'">
            Intentar de nuevo
          </button>
        ` : ''}
        <button class="btn btn-secondary btn-lg w-full" onclick="location.hash='${lessonUrl}'">
          Volver a la lección
        </button>
        <button class="btn btn-ghost w-full" onclick="location.hash='lessons'">
          Todas las lecciones
        </button>
      </div>
    </div>
  `;
}

export async function initQuizEvents(params) {
  // Quit button
  document.getElementById('quit-quiz')?.addEventListener('click', () => {
    if (confirm('¿Seguro que quieres salir? Tu progreso se perderá.')) {
      quizModule.reset();
      location.hash = `lesson/${params.id}`;
    }
  });

  // Setup listeners based on question type
  const question = quizModule.getCurrentQuestion();

  if (question) {
    switch (question.type) {
      case 'reorder':
        setupReorderListeners(question);
        break;
      case 'listening':
        setupListeningListeners(question);
        break;
      case 'word-scramble':
        setupScrambleListeners(question);
        break;
      default:
        setupOptionListeners();
    }
  }
}

function setupOptionListeners() {
  const options = document.querySelectorAll('.quiz-option');
  const nextBtn = document.getElementById('next-question');
  const feedbackEl = document.getElementById('quiz-feedback');

  options.forEach(option => {
    option.addEventListener('click', async () => {
      options.forEach(o => o.disabled = true);
      option.classList.add('selected');

      const answer = option.dataset.answer;
      const result = await quizModule.submitAnswer(answer);

      options.forEach(o => {
        const isCorrect = o.dataset.answer === result.correctAnswer;
        const isSelected = o === option;

        if (isCorrect) o.classList.add('correct');
        if (isSelected && !result.correct) o.classList.add('incorrect');
      });

      showFeedbackAndNext(result, feedbackEl, nextBtn);
    });
  });
}

function setupReorderListeners(question) {
  const wordsContainer = document.getElementById('reorder-words');
  const sentenceContainer = document.getElementById('reorder-sentence');
  const submitBtn = document.getElementById('submit-reorder');
  const feedbackEl = document.getElementById('quiz-feedback');
  const nextBtn = document.getElementById('next-question');

  if (!wordsContainer || !sentenceContainer || !submitBtn) return;

  reorderSelectedWords = [];

  // Click on words to add to sentence
  wordsContainer.querySelectorAll('.reorder-word').forEach(wordBtn => {
    wordBtn.addEventListener('click', () => {
      if (wordBtn.classList.contains('used')) return;

      wordBtn.classList.add('used');
      reorderSelectedWords.push(wordBtn.dataset.word);
      updateReorderSentence(sentenceContainer);
      submitBtn.disabled = false;
    });
  });

  // Click on sentence words to remove
  sentenceContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('sentence-word')) {
      const word = e.target.dataset.word;
      const index = reorderSelectedWords.indexOf(word);
      if (index > -1) {
        reorderSelectedWords.splice(index, 1);
        // Re-enable the word button
        wordsContainer.querySelector(`[data-word="${word}"]`)?.classList.remove('used');
        updateReorderSentence(sentenceContainer);
      }
    }
  });

  // Submit answer
  submitBtn.addEventListener('click', async () => {
    const answer = reorderSelectedWords.join(' ');
    const result = await quizModule.submitAnswer(answer);

    submitBtn.disabled = true;
    wordsContainer.querySelectorAll('.reorder-word').forEach(w => w.disabled = true);

    showFeedbackAndNext(result, feedbackEl, nextBtn);
  });
}

function updateReorderSentence(container) {
  if (reorderSelectedWords.length === 0) {
    container.innerHTML = '<p class="reorder-placeholder">Toca las palabras en orden</p>';
  } else {
    container.innerHTML = reorderSelectedWords.map(word =>
      `<span class="sentence-word" data-word="${word}">${word}</span>`
    ).join(' ');
  }
}

function setupListeningListeners(question) {
  const playBtn = document.getElementById('play-audio');
  const playSlowBtn = document.getElementById('play-audio-slow');
  const input = document.getElementById('listening-input');
  const submitBtn = document.getElementById('submit-listening');
  const feedbackEl = document.getElementById('quiz-feedback');
  const nextBtn = document.getElementById('next-question');

  if (!playBtn || !input || !submitBtn) return;

  // Play audio
  playBtn.addEventListener('click', () => {
    voice.speak(question.audio || question.correct);
  });

  // Play slow
  playSlowBtn?.addEventListener('click', () => {
    voice.speakSlow(question.audio || question.correct);
  });

  // Submit on Enter
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitBtn.click();
    }
  });

  // Submit answer
  submitBtn.addEventListener('click', async () => {
    const answer = input.value.trim();
    if (!answer) return;

    const result = await quizModule.submitAnswer(answer);

    input.disabled = true;
    submitBtn.disabled = true;

    showFeedbackAndNext(result, feedbackEl, nextBtn);
  });

  // Auto-play audio when question loads
  setTimeout(() => {
    voice.speak(question.audio || question.correct);
  }, 500);
}

function setupScrambleListeners(question) {
  const input = document.getElementById('scramble-input');
  const submitBtn = document.getElementById('submit-scramble');
  const feedbackEl = document.getElementById('quiz-feedback');
  const nextBtn = document.getElementById('next-question');

  if (!input || !submitBtn) return;

  // Submit on Enter
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitBtn.click();
    }
  });

  // Submit answer
  submitBtn.addEventListener('click', async () => {
    const answer = input.value.trim().toUpperCase();
    if (!answer) return;

    const result = await quizModule.submitAnswer(answer);

    input.disabled = true;
    submitBtn.disabled = true;

    showFeedbackAndNext(result, feedbackEl, nextBtn);
  });
}

function showFeedbackAndNext(result, feedbackEl, nextBtn) {
  // Show feedback
  if (feedbackEl) {
    feedbackEl.innerHTML = renderFeedback(result);
    feedbackEl.classList.remove('hidden');
  }

  // Speak feedback
  if (!voice.silentMode) {
    const message = result.correct ? '¡Correcto!' : `La respuesta correcta es: ${result.correctAnswer}`;
    voice.speak(message);
  }

  // Show next button
  if (nextBtn) {
    nextBtn.classList.remove('hidden');
    nextBtn.textContent = result.hasNext ? 'Continuar →' : 'Ver resultados';

    nextBtn.onclick = async () => {
      if (result.hasNext) {
        quizModule.nextQuestion();
        const container = document.getElementById('main-content');
        container.innerHTML = renderQuizQuestion();

        // Re-setup event listeners
        const question = quizModule.getCurrentQuestion();
        if (question) {
          switch (question.type) {
            case 'reorder':
              setupReorderListeners(question);
              break;
            case 'listening':
              setupListeningListeners(question);
              break;
            case 'word-scramble':
              setupScrambleListeners(question);
              break;
            default:
              setupOptionListeners();
          }
        }

        // Re-setup quit button
        document.getElementById('quit-quiz')?.addEventListener('click', () => {
          if (confirm('¿Salir del quiz?')) {
            quizModule.reset();
            history.back();
          }
        });
      } else {
        await renderResults();
      }
    };
  }
}

export default {
  render: renderQuiz,
  afterRender: initQuizEvents
};
