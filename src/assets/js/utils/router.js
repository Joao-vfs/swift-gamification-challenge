/**
 * Router - Handles client-side routing and navigation
 * Manages page state, user session, and route changes
 */
export class Router {
    constructor() {
        this.currentPage = 'home';
        this.currentUser = null;
        this.LOGGED_USER_KEY = 'swift_logged_user';

        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });
    }

    /**
     * Navigate to a specific page
     * @param {string} page - Name of the page to navigate to
     */
    navigate(page) {
        if (this.currentPage !== page) {
            this.currentPage = page;
            history.pushState(null, null, `#${page}`);
            this.renderCurrentPage();
        }
    }

    /**
     * Handle browser hash change events
     */
    handleRouteChange() {
        const hash = window.location.hash.slice(1);
        const page = hash || 'home';

        if (page !== this.currentPage) {
            this.currentPage = page;
            this.renderCurrentPage();
        }
    }

    /**
     * Render the current page by dispatching route change event
     */
    renderCurrentPage() {
        const content = document.getElementById('content');
        if (!content) return;

        const event = new CustomEvent('routeChange', {
            detail: {
                page: this.currentPage,
                user: this.currentUser
            }
        });

        document.dispatchEvent(event);
    }

    /**
     * Set the current logged-in user
     * Persists user data to localStorage
     * @param {Object} user - User data
     */
    setCurrentUser(user) {
        this.currentUser = user;
        
        // Persist user to localStorage for session management
        if (user) {
            localStorage.setItem(this.LOGGED_USER_KEY, JSON.stringify(user));
        }
    }

    /**
     * Get the current logged-in user
     * @returns {Object|null} Current user or null if not logged in
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Logout user and clear session
     * Removes user data from memory and localStorage
     */
    logout() {
        this.currentUser = null;
        localStorage.removeItem(this.LOGGED_USER_KEY);
        this.navigate('home');
    }

    /**
     * Initialize the router
     * Restores user session and renders initial page
     */
    init() {
        // Restore user session from localStorage
        this.restoreLoggedUser();
        
        const initialPage = window.location.hash.slice(1) || 'home';
        this.currentPage = initialPage;
        this.renderCurrentPage();
    }

    /**
     * Restore logged user from localStorage
     * Called during initialization to maintain session across page reloads
     */
    restoreLoggedUser() {
        try {
            const savedUser = localStorage.getItem(this.LOGGED_USER_KEY);
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
            }
        } catch (error) {
            Toast.error('Erro ao restaurar usuário logado');
            localStorage.removeItem(this.LOGGED_USER_KEY);
        }
    }
}
