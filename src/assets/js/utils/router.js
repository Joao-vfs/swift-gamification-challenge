export class Router {
    constructor() {
        this.currentPage = 'home';
        this.currentUser = null;

        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });
    }

    /**
     * Navigate to a page
     * @param {string} page - Name of the page
     */
    navigate(page) {
        if (this.currentPage !== page) {
            this.currentPage = page;
            history.pushState(null, null, `#${page}`);
            this.renderCurrentPage();
        }
    }

    /**
     * Handle route changes
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
     * Render current page
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
     * Set current user
     * @param {Object} user - User data
     */
    setCurrentUser(user) {
        this.currentUser = user;
    }

    /**
     * Get current user
     * @returns {Object|null} Current user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Logout - clear user and go to home
     */
    logout() {
        this.currentUser = null;
        this.navigate('home');
    }

    /**
     * Initialize router
     */
    init() {
        const initialPage = window.location.hash.slice(1) || 'home';
        this.currentPage = initialPage;
        this.renderCurrentPage();
    }
}
