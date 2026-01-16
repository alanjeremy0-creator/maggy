/**
 * Maggy - Progress Tracking Module
 * Handles all progress persistence using IndexedDB
 */

const DB_NAME = 'maggy-progress';
const DB_VERSION = 1;

// Database schema stores
const STORES = {
    PROFILE: 'profile',
    LESSONS: 'lessons',
    ERRORS: 'errors',
    SESSIONS: 'sessions'
};

class ProgressModule {
    constructor() {
        this.db = null;
        this.ready = this.initDB();
    }

    // Initialize IndexedDB
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);

            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Profile store - single record with user profile
                if (!db.objectStoreNames.contains(STORES.PROFILE)) {
                    db.createObjectStore(STORES.PROFILE, { keyPath: 'id' });
                }

                // Lessons store - progress for each lesson
                if (!db.objectStoreNames.contains(STORES.LESSONS)) {
                    const lessonsStore = db.createObjectStore(STORES.LESSONS, { keyPath: 'lessonId' });
                    lessonsStore.createIndex('status', 'status', { unique: false });
                }

                // Errors store - tracking common mistakes
                if (!db.objectStoreNames.contains(STORES.ERRORS)) {
                    const errorsStore = db.createObjectStore(STORES.ERRORS, { keyPath: 'id', autoIncrement: true });
                    errorsStore.createIndex('type', 'type', { unique: false });
                    errorsStore.createIndex('lessonId', 'lessonId', { unique: false });
                }

                // Sessions store - daily practice sessions
                if (!db.objectStoreNames.contains(STORES.SESSIONS)) {
                    const sessionsStore = db.createObjectStore(STORES.SESSIONS, { keyPath: 'date' });
                }
            };
        });
    }

    // Ensure DB is ready
    async ensureReady() {
        await this.ready;
        return this.db;
    }

    // Generic get from store
    async get(storeName, key) {
        await this.ensureReady();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Generic put to store
    async put(storeName, data) {
        await this.ensureReady();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Generic getAll from store
    async getAll(storeName) {
        await this.ensureReady();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // ==========================================
    // PROFILE METHODS
    // ==========================================

    async getProfile() {
        const profile = await this.get(STORES.PROFILE, 'user');

        if (!profile) {
            // Create default profile
            const defaultProfile = {
                id: 'user',
                createdAt: new Date().toISOString(),
                totalTimeSpent: 0,
                currentStreak: 0,
                longestStreak: 0,
                lastPracticeDate: null,
                settings: {
                    silentMode: false,
                    speechRate: 1.0,
                    dailyGoal: 5 // exercises per day
                }
            };
            await this.put(STORES.PROFILE, defaultProfile);
            return defaultProfile;
        }

        return profile;
    }

    async updateProfile(updates) {
        const profile = await this.getProfile();
        const updatedProfile = { ...profile, ...updates };
        await this.put(STORES.PROFILE, updatedProfile);
        return updatedProfile;
    }

    async updateSettings(settings) {
        const profile = await this.getProfile();
        profile.settings = { ...profile.settings, ...settings };
        await this.put(STORES.PROFILE, profile);
        return profile.settings;
    }

    // ==========================================
    // STREAK METHODS
    // ==========================================

    async updateStreak() {
        const profile = await this.getProfile();
        const today = new Date().toDateString();
        const lastPractice = profile.lastPracticeDate;

        if (lastPractice === today) {
            // Already practiced today
            return profile.currentStreak;
        }

        const yesterday = new Date(Date.now() - 86400000).toDateString();
        let newStreak;

        if (lastPractice === yesterday) {
            // Continuing streak
            newStreak = profile.currentStreak + 1;
        } else if (!lastPractice) {
            // First day
            newStreak = 1;
        } else {
            // Streak broken
            newStreak = 1;
        }

        await this.updateProfile({
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, profile.longestStreak),
            lastPracticeDate: today
        });

        return newStreak;
    }

    async getStreak() {
        const profile = await this.getProfile();
        return {
            current: profile.currentStreak,
            longest: profile.longestStreak,
            lastPractice: profile.lastPracticeDate
        };
    }

    // ==========================================
    // LESSON PROGRESS METHODS
    // ==========================================

    async getLessonProgress(lessonId) {
        const progress = await this.get(STORES.LESSONS, lessonId);

        if (!progress) {
            return {
                lessonId,
                status: 'locked',
                masteryPercent: 0,
                attempts: [],
                timeSpent: 0,
                lastAttempt: null
            };
        }

        return progress;
    }

    async getAllLessonsProgress() {
        return await this.getAll(STORES.LESSONS);
    }

    async updateLessonProgress(lessonId, updates) {
        const progress = await this.getLessonProgress(lessonId);
        const updatedProgress = { ...progress, ...updates, lessonId };
        await this.put(STORES.LESSONS, updatedProgress);
        return updatedProgress;
    }

    async recordAttempt(lessonId, attempt) {
        const progress = await this.getLessonProgress(lessonId);

        const newAttempt = {
            date: new Date().toISOString(),
            ...attempt
        };

        progress.attempts.push(newAttempt);
        progress.lastAttempt = newAttempt.date;

        // Recalculate mastery
        progress.masteryPercent = this.calculateMastery(progress.attempts);

        // Update status
        if (progress.status === 'locked') {
            progress.status = 'in-progress';
        }
        if (progress.masteryPercent >= 70) {
            progress.status = 'completed';
        }

        await this.put(STORES.LESSONS, progress);
        return progress;
    }

    calculateMastery(attempts) {
        if (!attempts || attempts.length === 0) return 0;

        // Weight recent attempts more heavily
        const recentAttempts = attempts.slice(-10);
        const totalScore = recentAttempts.reduce((sum, a) => sum + (a.score || 0), 0);
        return Math.round(totalScore / recentAttempts.length);
    }

    async unlockLesson(lessonId) {
        const progress = await this.getLessonProgress(lessonId);
        if (progress.status === 'locked') {
            progress.status = 'available';
            await this.put(STORES.LESSONS, progress);
        }
        return progress;
    }

    // ==========================================
    // ERROR TRACKING METHODS
    // ==========================================

    async recordError(errorData) {
        await this.ensureReady();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(STORES.ERRORS, 'readwrite');
            const store = transaction.objectStore(STORES.ERRORS);

            const error = {
                date: new Date().toISOString(),
                ...errorData
            };

            const request = store.add(error);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getFrequentErrors(limit = 5) {
        const allErrors = await this.getAll(STORES.ERRORS);

        // Group and count errors by pattern
        const errorCounts = {};
        allErrors.forEach(error => {
            const key = error.pattern || error.type;
            if (!errorCounts[key]) {
                errorCounts[key] = { count: 0, examples: [] };
            }
            errorCounts[key].count++;
            if (errorCounts[key].examples.length < 3) {
                errorCounts[key].examples.push(error.example);
            }
        });

        // Sort by frequency and return top N
        return Object.entries(errorCounts)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, limit)
            .map(([pattern, data]) => ({ pattern, ...data }));
    }

    // ==========================================
    // SESSION METHODS
    // ==========================================

    async getTodaySession() {
        const today = new Date().toDateString();
        let session = await this.get(STORES.SESSIONS, today);

        if (!session) {
            session = {
                date: today,
                exercisesCompleted: 0,
                timeSpent: 0,
                lessonsWorkedOn: [],
                quizScores: []
            };
            await this.put(STORES.SESSIONS, session);
        }

        return session;
    }

    async updateTodaySession(updates) {
        const session = await this.getTodaySession();
        const updatedSession = { ...session, ...updates };
        await this.put(STORES.SESSIONS, updatedSession);
        return updatedSession;
    }

    async incrementExercise() {
        const session = await this.getTodaySession();
        session.exercisesCompleted++;
        await this.put(STORES.SESSIONS, session);

        // Also update streak
        await this.updateStreak();

        return session;
    }

    async recordQuizScore(lessonId, score) {
        const session = await this.getTodaySession();
        session.quizScores.push({ lessonId, score, date: new Date().toISOString() });

        if (!session.lessonsWorkedOn.includes(lessonId)) {
            session.lessonsWorkedOn.push(lessonId);
        }

        await this.put(STORES.SESSIONS, session);
        return session;
    }

    // ==========================================
    // AGGREGATE METHODS
    // ==========================================

    async getOverallProgress() {
        const profile = await this.getProfile();
        const lessons = await this.getAllLessonsProgress();
        const session = await this.getTodaySession();
        const streak = await this.getStreak();
        const errors = await this.getFrequentErrors();

        const completedLessons = lessons.filter(l => l.status === 'completed');
        const inProgressLessons = lessons.filter(l => l.status === 'in-progress');
        const totalLessons = 6; // From curriculum

        const overallMastery = lessons.length > 0
            ? Math.round(lessons.reduce((sum, l) => sum + l.masteryPercent, 0) / totalLessons)
            : 0;

        return {
            profile,
            streak,
            session,
            lessons: {
                completed: completedLessons.length,
                inProgress: inProgressLessons.length,
                total: totalLessons,
                progress: lessons
            },
            overallMastery,
            frequentErrors: errors,
            // For AI context
            masteredLessons: completedLessons.map(l => l.lessonId),
            currentLesson: inProgressLessons[0]?.lessonId || completedLessons.slice(-1)[0]?.lessonId || 'to-be-intro'
        };
    }

    // For AI coach context
    async getAIContext() {
        const overall = await this.getOverallProgress();
        const errors = await this.getFrequentErrors();

        return {
            currentLesson: overall.currentLesson,
            masteredTopics: overall.masteredLessons,
            frequentErrors: errors.map(e => e.pattern),
            streak: overall.streak.current,
            sessionExercises: overall.session.exercisesCompleted,
            targetExercises: overall.profile.settings?.dailyGoal || 5,
            weakAreas: errors.slice(0, 3).map(e => e.pattern)
        };
    }

    // ==========================================
    // DATA MANAGEMENT
    // ==========================================

    async clearAllData() {
        await this.ensureReady();

        const transaction = this.db.transaction(
            [STORES.PROFILE, STORES.LESSONS, STORES.ERRORS, STORES.SESSIONS],
            'readwrite'
        );

        transaction.objectStore(STORES.PROFILE).clear();
        transaction.objectStore(STORES.LESSONS).clear();
        transaction.objectStore(STORES.ERRORS).clear();
        transaction.objectStore(STORES.SESSIONS).clear();

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve(true);
            transaction.onerror = () => reject(transaction.error);
        });
    }

    async exportData() {
        const profile = await this.getProfile();
        const lessons = await this.getAllLessonsProgress();
        const errors = await this.getAll(STORES.ERRORS);
        const sessions = await this.getAll(STORES.SESSIONS);

        return {
            exportDate: new Date().toISOString(),
            profile,
            lessons,
            errors,
            sessions
        };
    }
}

// Export singleton instance
export const progress = new ProgressModule();
export default progress;
