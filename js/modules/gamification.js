/**
 * Maggy - Gamification Module
 * Handles XP, mastery levels, streaks, and lesson unlocking
 */

import progress from './progress.js';
import { CURRICULUM, isLessonAvailable, getLessonById } from '../data/lessons-content.js';

// Gamification configuration
export const GAMIFICATION_CONFIG = {
    // Mastery thresholds
    masteryLevels: {
        learning: { min: 0, max: 49, label: 'Learning', color: '#F59E0B', icon: '📖' },
        practicing: { min: 50, max: 79, label: 'Practicing', color: '#06B6D4', icon: '🎯' },
        mastered: { min: 80, max: 100, label: 'Mastered', color: '#10B981', icon: '✅' }
    },

    // Streak configuration
    streak: {
        minimumDailyExercises: 5,
        milestones: [3, 7, 14, 30, 60, 100],
        milestoneRewards: {
            3: { title: 'Getting Started! 🌱', message: '3 days in a row!' },
            7: { title: 'One Week Strong! 💪', message: 'A full week of practice!' },
            14: { title: 'Two Weeks! 🔥', message: 'Consistency is key!' },
            30: { title: 'Monthly Master! 🏆', message: 'One month of dedication!' },
            60: { title: 'Unstoppable! ⚡', message: 'Two months strong!' },
            100: { title: 'Century Club! 👑', message: '100 days of learning!' }
        }
    },

    // Unlock requirements
    unlockRequirements: {
        minMastery: 70,
        minQuizScore: 60
    },

    // Points system (future feature)
    points: {
        exerciseComplete: 10,
        quizPerfect: 50,
        quizPass: 25,
        streakDay: 15,
        lessonComplete: 100
    }
};

class GamificationModule {
    constructor() {
        this.progress = progress;
    }

    // ==========================================
    // MASTERY METHODS
    // ==========================================

    /**
     * Get mastery level info for a percentage
     */
    getMasteryLevel(percent) {
        const { masteryLevels } = GAMIFICATION_CONFIG;

        if (percent >= masteryLevels.mastered.min) {
            return { ...masteryLevels.mastered, percent };
        }
        if (percent >= masteryLevels.practicing.min) {
            return { ...masteryLevels.practicing, percent };
        }
        return { ...masteryLevels.learning, percent };
    }

    /**
     * Calculate mastery for a lesson
     */
    async calculateLessonMastery(lessonId) {
        const lessonProgress = await this.progress.getLessonProgress(lessonId);
        return this.getMasteryLevel(lessonProgress.masteryPercent || 0);
    }

    /**
     * Get overall mastery across all lessons
     */
    async getOverallMastery() {
        const allProgress = await this.progress.getAllLessonsProgress();

        if (allProgress.length === 0) return 0;

        const totalMastery = allProgress.reduce((sum, l) => sum + (l.masteryPercent || 0), 0);
        return Math.round(totalMastery / CURRICULUM.length);
    }

    // ==========================================
    // STREAK METHODS
    // ==========================================

    /**
     * Get streak info with milestones
     */
    async getStreakInfo() {
        const streak = await this.progress.getStreak();
        const nextMilestone = this.getNextMilestone(streak.current);

        return {
            ...streak,
            nextMilestone,
            daysToMilestone: nextMilestone ? nextMilestone - streak.current : null,
            isAtMilestone: GAMIFICATION_CONFIG.streak.milestones.includes(streak.current)
        };
    }

    /**
     * Get next streak milestone
     */
    getNextMilestone(currentStreak) {
        const { milestones } = GAMIFICATION_CONFIG.streak;
        return milestones.find(m => m > currentStreak) || null;
    }

    /**
     * Check if streak milestone reached
     */
    checkMilestone(streak) {
        const { milestoneRewards } = GAMIFICATION_CONFIG.streak;
        return milestoneRewards[streak] || null;
    }

    /**
     * Update and check streak (called after practice)
     */
    async updateStreak() {
        const newStreak = await this.progress.updateStreak();
        const milestone = this.checkMilestone(newStreak);

        return {
            streak: newStreak,
            milestone // null or { title, message }
        };
    }

    // ==========================================
    // LESSON UNLOCKING
    // ==========================================

    /**
     * Get all lessons with their unlock status
     */
    async getLessonsWithStatus() {
        const allProgress = await this.progress.getAllLessonsProgress();

        return CURRICULUM.map(lesson => {
            const lessonProgress = allProgress.find(p => p.lessonId === lesson.id);
            const mastery = lessonProgress?.masteryPercent || 0;
            const status = lessonProgress?.status || 'locked';

            // Check if unlocked
            let available = lesson.unlocked;
            if (!available && lesson.prerequisites) {
                available = lesson.prerequisites.every(prereqId => {
                    const prereqProgress = allProgress.find(p => p.lessonId === prereqId);
                    return prereqProgress && prereqProgress.masteryPercent >= GAMIFICATION_CONFIG.unlockRequirements.minMastery;
                });
            }

            return {
                ...lesson,
                status: available ? (status === 'locked' ? 'available' : status) : 'locked',
                available,
                masteryPercent: mastery,
                masteryLevel: this.getMasteryLevel(mastery)
            };
        });
    }

    /**
     * Check if a specific lesson can be unlocked
     */
    async canUnlockLesson(lessonId) {
        const lesson = getLessonById(lessonId);
        if (!lesson) return false;
        if (lesson.unlocked) return true;

        if (!lesson.prerequisites) return true;

        const allProgress = await this.progress.getAllLessonsProgress();

        return lesson.prerequisites.every(prereqId => {
            const prereqProgress = allProgress.find(p => p.lessonId === prereqId);
            return prereqProgress && prereqProgress.masteryPercent >= GAMIFICATION_CONFIG.unlockRequirements.minMastery;
        });
    }

    /**
     * Unlock a lesson and check for newly available lessons
     */
    async unlockNextLessons() {
        const allProgress = await this.progress.getAllLessonsProgress();
        const newlyUnlocked = [];

        for (const lesson of CURRICULUM) {
            if (lesson.unlocked) continue;

            const lessonProgress = allProgress.find(p => p.lessonId === lesson.id);
            if (lessonProgress?.status !== 'locked') continue;

            const canUnlock = await this.canUnlockLesson(lesson.id);
            if (canUnlock) {
                await this.progress.unlockLesson(lesson.id);
                newlyUnlocked.push(lesson);
            }
        }

        return newlyUnlocked;
    }

    // ==========================================
    // QUIZ SCORING
    // ==========================================

    /**
     * Process quiz results
     * @returns {Object} { passed, score, mastery, unlockedLessons }
     */
    async processQuizResult(lessonId, score, totalQuestions, correctAnswers) {
        const scorePercent = Math.round((correctAnswers / totalQuestions) * 100);
        const passed = scorePercent >= GAMIFICATION_CONFIG.unlockRequirements.minQuizScore;

        // Record attempt
        await this.progress.recordAttempt(lessonId, {
            type: 'quiz',
            score: scorePercent,
            correct: passed
        });

        // Record quiz score for session
        await this.progress.recordQuizScore(lessonId, scorePercent);

        // Get updated mastery
        const lessonProgress = await this.progress.getLessonProgress(lessonId);
        const mastery = this.getMasteryLevel(lessonProgress.masteryPercent);

        // Check for newly unlocked lessons
        const unlockedLessons = await this.unlockNextLessons();

        // Update streak
        const streakResult = await this.updateStreak();

        return {
            passed,
            score: scorePercent,
            mastery,
            lessonStatus: lessonProgress.status,
            unlockedLessons,
            streak: streakResult.streak,
            streakMilestone: streakResult.milestone
        };
    }

    // ==========================================
    // CONVERSATION TRACKING
    // ==========================================

    /**
     * Track a conversation exchange
     */
    async trackConversation(lessonId, wasCorrect) {
        // Record as attempt with lower weight
        const score = wasCorrect ? 100 : 30;

        await this.progress.recordAttempt(lessonId, {
            type: 'conversation',
            score,
            correct: wasCorrect
        });

        // Update streak
        await this.updateStreak();

        return await this.progress.getLessonProgress(lessonId);
    }

    // ==========================================
    // PROGRESS SUMMARY
    // ==========================================

    /**
     * Get complete gamification summary
     */
    async getSummary() {
        const overall = await this.progress.getOverallProgress();
        const streakInfo = await this.getStreakInfo();
        const lessonsWithStatus = await this.getLessonsWithStatus();
        const overallMastery = await this.getOverallMastery();

        const completedCount = lessonsWithStatus.filter(l => l.status === 'completed').length;
        const inProgressCount = lessonsWithStatus.filter(l => l.status === 'in-progress').length;

        return {
            // Streak
            streak: streakInfo,

            // Mastery
            overallMastery,
            masteryLevel: this.getMasteryLevel(overallMastery),

            // Lessons
            lessons: lessonsWithStatus,
            completedCount,
            inProgressCount,
            totalLessons: CURRICULUM.length,
            progressPercent: Math.round((completedCount / CURRICULUM.length) * 100),

            // Session
            todayExercises: overall.session.exercisesCompleted,
            dailyGoal: overall.profile.settings?.dailyGoal || 5,

            // Next suggested action
            nextAction: this.suggestNextAction(lessonsWithStatus, overall.session)
        };
    }

    /**
     * Suggest what the user should do next
     */
    suggestNextAction(lessons, session) {
        // Find in-progress lessons
        const inProgress = lessons.find(l => l.status === 'in-progress');
        if (inProgress) {
            return {
                type: 'continue',
                lessonId: inProgress.id,
                lessonTitle: inProgress.title,
                message: `Continue: ${inProgress.title}`
            };
        }

        // Find next available lesson
        const nextAvailable = lessons.find(l => l.status === 'available');
        if (nextAvailable) {
            return {
                type: 'start',
                lessonId: nextAvailable.id,
                lessonTitle: nextAvailable.title,
                message: `Start: ${nextAvailable.title}`
            };
        }

        // All complete - suggest practice
        const lowestMastery = lessons
            .filter(l => l.status === 'completed')
            .sort((a, b) => a.masteryPercent - b.masteryPercent)[0];

        if (lowestMastery) {
            return {
                type: 'practice',
                lessonId: lowestMastery.id,
                lessonTitle: lowestMastery.title,
                message: `Practice: ${lowestMastery.title}`
            };
        }

        return {
            type: 'conversation',
            message: 'Free conversation with Maggy'
        };
    }
}

// Export singleton
export const gamification = new GamificationModule();
export default gamification;
