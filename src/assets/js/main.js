import { Router } from './utils/router.js';
import { HomeScreen } from './screens/HomeScreen.js';
import { LoginScreen } from './screens/LoginScreen.js';
import { RegisterScreen } from './screens/RegisterScreen.js';
import { DashboardScreen } from './screens/DashboardScreen.js';
import { Toast } from './utils/Toast.js';

class SwiftGamificationApp {
    constructor() {
        this.router = new Router();
        this.screens = {};
        this.currentScreen = null;

        window.router = this.router;
        window.Toast = Toast;
    }

    async init() {
        this.initializeScreens();
        this.setupEventListeners();
        this.router.init();
        this.hideLoading();
    }

    initializeScreens() {
        this.screens = {
            home: new HomeScreen(this.router),
            login: new LoginScreen(this.router),
            register: new RegisterScreen(this.router),
            dashboard: new DashboardScreen(this.router)
        };
    }

    setupEventListeners() {
        document.addEventListener('routeChange', event => {
            this.handleRouteChange(event.detail);
        });

        document.addEventListener('click', e => {
            if (e.target.classList.contains('auth-logo') || e.target.classList.contains('dashboard-logo')) {
                this.router.navigate('home');
            }
        });
    }

    /**
     * Handle route changes
     * @param {Object} detail - Route details
     */
    handleRouteChange(detail) {
        const { page } = detail;
        const screen = this.screens[page];

        if (!screen) {
            console.warn(`Screen "${page}" not found. Redirecting to home.`);
            this.router.navigate('home');
            return;
        }

        this.renderScreen(screen, page);
    }

    /**
     * Render current screen
     * @param {Object} screen - Screen to be rendered
     * @param {string} pageName - Name of the page
     */
    renderScreen(screen, pageName) {
        const content = document.getElementById('content');
        if (!content) {
            Toast.error('Element #content not found');
            return;
        }

        try {
            content.innerHTML = screen.render();

            if (screen.setupEvents) {
                screen.setupEvents();
            }

            this.currentScreen = screen;

            this.updatePageTitle(pageName);
        } catch (error) {
            Toast.error(`Error rendering screen "${pageName}":`, error);
            content.innerHTML = this.getErrorScreen();
        }
    }

    /**
     * Update page title
     * @param {string} pageName - Page name
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
     * Get error screen
     * @returns {string} HTML of the error screen
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
     * Hide loading screen
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

document.addEventListener('DOMContentLoaded', () => {
    const app = new SwiftGamificationApp();
    app.init();

    window.swiftApp = app;
});
