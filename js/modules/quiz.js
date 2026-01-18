/**
 * Maggy - Quiz Module
 * Handles quiz logic, scoring, and exercise types
 */

import { getLessonById } from '../data/lessons-content.js';
import { gamification } from './gamification.js';
import { voice } from './voice.js';
import { aiCoach } from './ai-coach.js';

class QuizModule {
    constructor() {
        this.currentLesson = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.isActive = false;
    }

    /**
     * Start a quiz for a specific lesson
     */
    startQuiz(lessonId) {
        const lesson = getLessonById(lessonId);
        if (!lesson || !lesson.quiz) {
            throw new Error('Lesson or quiz not found');
        }

        this.currentLesson = lesson;
        this.questions = [...lesson.quiz]; // Clone to avoid mutation
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.isActive = true;

        return {
            lessonId,
            lessonTitle: `${lesson.title} - ${lesson.subtitle}`,
            totalQuestions: this.questions.length,
            firstQuestion: this.getCurrentQuestion()
        };
    }

    /**
     * Get current question with formatted data
     */
    getCurrentQuestion() {
        if (!this.isActive || this.currentQuestionIndex >= this.questions.length) {
            return null;
        }

        const question = this.questions[this.currentQuestionIndex];

        return {
            ...question,
            index: this.currentQuestionIndex,
            total: this.questions.length,
            progress: ((this.currentQuestionIndex) / this.questions.length) * 100
        };
    }

    /**
     * Submit an answer for the current question
     * @returns {Object} { correct, explanation, correctAnswer, aiFeedback }
     */
    async submitAnswer(answer) {
        if (!this.isActive) {
            throw new Error('No active quiz');
        }

        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = this.checkAnswer(question, answer);

        // Record answer
        this.answers.push({
            questionId: question.id,
            userAnswer: answer,
            correctAnswer: question.correct,
            isCorrect
        });

        // Get AI feedback
        let aiFeedback = null;
        try {
            aiFeedback = await aiCoach.getQuizFeedback(
                question.question,
                answer,
                question.correct,
                isCorrect
            );
        } catch (error) {
            console.warn('Could not get AI feedback:', error);
        }

        return {
            correct: isCorrect,
            explanation: question.explanation,
            correctAnswer: question.correct,
            aiFeedback,
            hasNext: this.currentQuestionIndex < this.questions.length - 1
        };
    }

    /**
     * Check if answer is correct
     */
    checkAnswer(question, answer) {
        const normalize = (str) => str?.toLowerCase().trim().replace(/[.,!?;:'"]/g, '');

        switch (question.type) {
            case 'fill-blank':
            case 'multiple-choice':
            case 'transform':
            case 'stress':
                return normalize(answer) === normalize(question.correct);

            case 'reorder':
                // Compare normalized sentences
                return normalize(answer) === normalize(question.correct);

            case 'listening':
                // More lenient for listening - allow minor differences
                const userInput = normalize(answer);
                const correctAnswer = normalize(question.correct);
                // Exact match or very close (allowing for minor typos)
                if (userInput === correctAnswer) return true;
                // Check similarity (at least 90% similar)
                return this.similarity(userInput, correctAnswer) >= 0.9;

            case 'word-scramble':
                // Case insensitive comparison
                return answer?.toUpperCase().trim() === question.correct?.toUpperCase().trim();

            case 'audio-match':
                // For pronunciation, we're more lenient
                return normalize(answer) === normalize(question.target || question.correct);

            default:
                return normalize(answer) === normalize(question.correct);
        }
    }

    /**
     * Calculate similarity between two strings (Levenshtein distance based)
     */
    similarity(str1, str2) {
        if (!str1 || !str2) return 0;
        if (str1 === str2) return 1;

        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;

        if (longer.length === 0) return 1;

        // Simple character-by-character comparison
        let matches = 0;
        const longerArr = longer.split('');
        const shorterArr = shorter.split('');

        shorterArr.forEach((char, i) => {
            if (longerArr[i] === char) matches++;
        });

        return matches / longer.length;
    }

    /**
     * Move to next question
     */
    nextQuestion() {
        if (!this.isActive) return null;

        this.currentQuestionIndex++;

        if (this.currentQuestionIndex >= this.questions.length) {
            return null; // Quiz finished
        }

        return this.getCurrentQuestion();
    }

    /**
     * End the quiz and calculate results
     */
    async finishQuiz() {
        if (!this.isActive) {
            throw new Error('No active quiz');
        }

        const correctCount = this.answers.filter(a => a.isCorrect).length;
        const totalQuestions = this.questions.length;

        // Process results through gamification
        const result = await gamification.processQuizResult(
            this.currentLesson.id,
            null, // score calculated in processQuizResult
            totalQuestions,
            correctCount
        );

        // Speak results
        if (!voice.silentMode) {
            const message = result.passed
                ? `Great job! You scored ${result.score} percent!`
                : `You scored ${result.score} percent. Let's practice more!`;
            voice.speak(message);
        }

        // Reset state
        const finalResult = {
            lessonId: this.currentLesson.id,
            lessonTitle: `${this.currentLesson.title} - ${this.currentLesson.subtitle}`,
            correctCount,
            totalQuestions,
            answers: this.answers,
            ...result
        };

        this.reset();

        return finalResult;
    }

    /**
     * Reset quiz state
     */
    reset() {
        this.currentLesson = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.isActive = false;
    }

    /**
     * Get quiz progress
     */
    getProgress() {
        if (!this.isActive) return null;

        return {
            current: this.currentQuestionIndex + 1,
            total: this.questions.length,
            percent: ((this.currentQuestionIndex + 1) / this.questions.length) * 100,
            correctSoFar: this.answers.filter(a => a.isCorrect).length,
            incorrectSoFar: this.answers.filter(a => !a.isCorrect).length
        };
    }
}

// Export singleton
export const quiz = new QuizModule();
export default quiz;
