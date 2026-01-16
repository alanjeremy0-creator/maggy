/**
 * Maggy - Main Application
 * Entry point and app initialization
 */

import { router } from './router.js';
import { progress } from './modules/progress.js';
import { voice } from './modules/voice.js';
import { aiCoach } from './modules/ai-coach.js';

// Import views
import homeView from './views/home.js';
import lessonsView from './views/lessons.js';
import lessonDetailView from './views/lesson-detail.js';
import quizView from './views/quiz.js';
import conversationView from './views/conversation.js';
import progressView from './views/progress.js';

class MaggyApp {
    constructor() {
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        console.log('🎓 Initializing Maggy...');

        try {
            // Initialize progress database
            await progress.ensureReady();

            // Load user settings
            const profile = await progress.getProfile();

            // Apply settings
            if (profile.settings?.silentMode) {
                voice.setSilentMode(true);
            }

            // Initialize router with routes
            router
                .init('main-content')
                .route('home', homeView)
                .route('lessons', lessonsView)
                .route('lesson/:id', lessonDetailView)
                .route('quiz/:id', quizView)
                .route('conversation', conversationView)
                .route('conversation/:id', conversationView)
                .route('progress', progressView);

            // Setup navigation handlers
            this.setupNavigation();

            // Hide loading screen
            this.hideLoadingScreen();

            // Handle initial route
            await router.handleRoute();

            this.initialized = true;
            console.log('🎓 Maggy initialized successfully!');

        } catch (error) {
            console.error('Failed to initialize Maggy:', error);
            this.showError(error);
        }
    }

    setupNavigation() {
        // Bottom navigation clicks
        const nav = document.getElementById('bottom-nav');
        if (nav) {
            nav.classList.remove('hidden');

            nav.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', () => {
                    const view = item.dataset.view;
                    router.navigate(view);
                });
            });
        }
    }

    hideLoadingScreen() {
        const loading = document.getElementById('loading-screen');
        if (loading) {
            loading.style.opacity = '0';
            loading.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                loading.remove();
            }, 300);
        }
    }

    showError(error) {
        const container = document.getElementById('main-content');
        if (container) {
            container.innerHTML = `
        <div class="view" style="text-align: center; padding: 40px;">
          <h1>😔 Oops!</h1>
          <p style="color: var(--text-secondary); margin: 20px 0;">
            Something went wrong while loading Maggy.
          </p>
          <pre style="text-align: left; background: var(--bg-card); padding: 16px; border-radius: 8px; overflow: auto; font-size: 12px;">
${error.message}
          </pre>
          <button class="btn btn-primary mt-6" onclick="location.reload()">
            Try Again
          </button>
        </div>
      `;
        }

        // Hide loading screen even on error
        this.hideLoadingScreen();
    }
}

// Create and initialize app
const app = new MaggyApp();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Export for debugging
window.MaggyApp = app;
window.MaggyDebug = {
    progress,
    voice,
    aiCoach,
    router
};
