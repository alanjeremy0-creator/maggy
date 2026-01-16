/**
 * Maggy - Simple SPA Router
 * Hash-based routing for single-page navigation
 */

class Router {
    constructor() {
        this.routes = {};
        this.currentView = null;
        this.currentParams = {};
        this.container = null;
        this.onNavigate = null;

        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    /**
     * Initialize router with container element
     */
    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container #${containerId} not found`);
        }
        return this;
    }

    /**
     * Register a route
     * @param {string} path - Route path (e.g., 'home', 'lesson/:id')
     * @param {Function} handler - Function that returns view HTML or a View instance
     */
    route(path, handler) {
        this.routes[path] = handler;
        return this;
    }

    /**
     * Navigate to a path
     */
    navigate(path) {
        window.location.hash = path;
    }

    /**
     * Get current route path
     */
    getCurrentPath() {
        return window.location.hash.slice(1) || 'home';
    }

    /**
     * Parse route with parameters
     * e.g., 'lesson/to-be-intro' matches 'lesson/:id' with { id: 'to-be-intro' }
     */
    matchRoute(hash) {
        const path = hash.slice(1) || 'home';
        const pathParts = path.split('/');

        for (const [routePath, handler] of Object.entries(this.routes)) {
            const routeParts = routePath.split('/');

            if (routeParts.length !== pathParts.length) continue;

            const params = {};
            let match = true;

            for (let i = 0; i < routeParts.length; i++) {
                if (routeParts[i].startsWith(':')) {
                    // Parameter
                    params[routeParts[i].slice(1)] = pathParts[i];
                } else if (routeParts[i] !== pathParts[i]) {
                    match = false;
                    break;
                }
            }

            if (match) {
                return { handler, params };
            }
        }

        return null;
    }

    /**
     * Handle route change
     */
    async handleRoute() {
        const hash = window.location.hash;
        const matched = this.matchRoute(hash);

        if (!matched) {
            // Default to home if no match
            this.navigate('home');
            return;
        }

        const { handler, params } = matched;
        this.currentParams = params;

        try {
            // Get view content - handler can be a function or a view object
            let content;
            if (typeof handler === 'function') {
                content = await handler(params);
            } else if (handler && handler.render) {
                // Handler is already a view object
                content = handler;
            } else {
                throw new Error('Invalid route handler');
            }

            // Render to container
            if (typeof content === 'string') {
                this.container.innerHTML = content;
            } else if (content && content.render) {
                // View instance
                this.container.innerHTML = await content.render(params);
                if (content.afterRender) {
                    await content.afterRender(params);
                }
                this.currentView = content;
            }

            // Update navigation
            this.updateNavigation(hash.slice(1).split('/')[0]);

            // Call navigate callback
            if (this.onNavigate) {
                this.onNavigate(hash.slice(1), params);
            }

        } catch (error) {
            console.error('Router error:', error);
            this.container.innerHTML = `
        <div class="view" style="text-align: center; padding: 40px;">
          <h2>Oops! Something went wrong</h2>
          <p>${error.message}</p>
          <button class="btn btn-primary" onclick="location.hash='home'">Go Home</button>
        </div>
      `;
        }
    }

    /**
     * Update bottom navigation active state
     */
    updateNavigation(currentRoute) {
        const nav = document.getElementById('bottom-nav');
        if (!nav) return;

        // Show/hide nav based on route
        const hideNavRoutes = ['quiz', 'onboarding'];
        const shouldHide = hideNavRoutes.some(r => currentRoute.startsWith(r));
        nav.classList.toggle('hidden', shouldHide);

        // Update active state
        const items = nav.querySelectorAll('.nav-item');
        items.forEach(item => {
            const view = item.dataset.view;
            item.classList.toggle('active',
                currentRoute === view ||
                (view === 'lessons' && currentRoute.startsWith('lesson'))
            );
        });
    }

    /**
     * Set navigation callback
     */
    setOnNavigate(callback) {
        this.onNavigate = callback;
        return this;
    }
}

// Export singleton
export const router = new Router();
export default router;
