import { Router } from './utils/router.js';
import { HomeScreen } from './screens/HomeScreen.js';
import { LoginScreen } from './screens/LoginScreen.js';
import { RegisterScreen } from './screens/RegisterScreen.js';
import { DashboardScreen } from './screens/DashboardScreen.js';
import { Toast } from './utils/Toast.js';

/**
 * SwiftGamificationApp - Main application controller
 * Manages screen initialization, routing, and global state
 */
class SwiftGamificationApp {
    constructor() {
        this.router = new Router();
        this.screens = {};
        this.currentScreen = null;

        // Expose router and Toast globally for easy access
        window.router = this.router;
        window.Toast = Toast;
    }

    /**
     * Initialize the application
     */
    async init() {
        this.initializeScreens();
        this.setupEventListeners();
        this.router.init();
        this.hideLoading();
    }

    /**
     * Initialize all application screens
     */
    initializeScreens() {
        this.screens = {
            home: new HomeScreen(this.router),
            login: new LoginScreen(this.router),
            register: new RegisterScreen(this.router),
            dashboard: new DashboardScreen(this.router)
        };
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Listen for route changes
        document.addEventListener('routeChange', event => {
            this.handleRouteChange(event.detail);
        });

        // Handle logo clicks to return to home
        document.addEventListener('click', e => {
            if (e.target.classList.contains('auth-logo') || e.target.classList.contains('dashboard-logo')) {
                this.router.navigate('home');
            }
        });
    }

    /**
     * Handle route change events
     * @param {Object} detail - Route change details (page, user)
     */
    handleRouteChange(detail) {
        const { page } = detail;
        const screen = this.screens[page];

        if (!screen) {
            Toast.warning(`Tela "${page}" não encontrada. Redirecionando para a home.`);
            this.router.navigate('home');
            return;
        }

        this.renderScreen(screen, page);
    }

    /**
     * Render a screen
     * @param {Object} screen - Screen instance to render
     * @param {string} pageName - Name of the page being rendered
     */
    renderScreen(screen, pageName) {
        const content = document.getElementById('content');
        if (!content) {
            Toast.error('Content container not found');
            return;
        }

        try {
            content.innerHTML = screen.render();

            // Setup screen-specific events if available
            if (screen.setupEvents) {
                screen.setupEvents();
            }

            this.currentScreen = screen;
            this.updatePageTitle(pageName);
        } catch (error) {
            Toast.error(`Erro ao renderizar a tela "${pageName}"`);
            content.innerHTML = this.getErrorScreen();
        }
    }

    /**
     * Update browser page title
     * @param {string} pageName - Name of the current page
     */
    updatePageTitle(pageName) {
        const titles = {
            home: 'Swift Gamification - Journey of Rewards',
            login: 'Swift Gamification - Login',
            register: 'Swift Gamification - Register',
            dashboard: 'Swift Gamification - Dashboard'
        };

        document.title = titles[pageName] || 'Swift Gamification';
    }

    /**
     * Get error screen HTML
     * @returns {string} HTML for error screen
     */
    getErrorScreen() {
        return `
            <div style="text-align: center; padding: 4rem; color: #e74c3c;">
                <h1>⚠️ Ops! Algo deu errado</h1>
                <p>Não foi possível carregar esta página.</p>
                <button onclick="window.router.navigate('home')" class="btn-primary" style="margin-top: 2rem;">
                    Voltar à Home
                </button>
            </div>
        `;
    }

    /**
     * Hide loading screen and show content
     */
    hideLoading() {
        setTimeout(() => {
            const loading = document.getElementById('app-loading');
            const content = document.getElementById('content');

            if (loading) {
                loading.style.display = 'none';
            }

            if (content) {
                content.style.display = 'block';
            }
        }, 500);
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new SwiftGamificationApp();
    app.init();

    // Expose app instance globally for debugging
    window.swiftApp = app;
});
