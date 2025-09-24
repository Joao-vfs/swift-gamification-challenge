/**
 * COMPONENTIZED ROUTING SYSTEM
 * Manage navigation and rendering of pages of the Swift Gamification application
 */

class Router extends BaseComponent {
    constructor(element, options = {}) {
        super(element, options);

        this.routes = new Map();
        this.currentRoute = null;
        this.currentComponent = null;
        this.history = [];
        this.maxHistorySize = 50;

        // Default configurations
        this.options = {
            mode: 'hash', // 'hash' or 'history'
            root: '/',
            container: '#content',
            defaultRoute: 'dashboard',
            animationDuration: 300,
            preloadRoutes: false,
            ...options
        };

        // Bind methods
        this.navigate = this.navigate.bind(this);
        this.back = this.back.bind(this);
        this.forward = this.forward.bind(this);
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    /**
     * Initialize the router
     */
    init() {
        this.setupEventListeners();
        this.loadInitialRoute();
        return super.init();
    }

    /**
     * Event listeners configuration
     */
    setupEventListeners() {
        // Listen to changes in hash/URL
        if (this.options.mode === 'hash') {
            window.addEventListener('hashchange', this.handleRouteChange);
        } else {
            window.addEventListener('popstate', this.handleRouteChange);
        }

        // Intercept clicks on navigation links
        document.addEventListener('click', e => {
            const link = e.target.closest('a[data-route], [data-navigate]');
            if (link) {
                e.preventDefault();
                const route = link.dataset.route || link.dataset.navigate;
                this.navigate(route);
            }
        });

        // Listen to navigation commands from StateManager
        stateManager.subscribe('app.currentPage', newPage => {
            if (newPage && newPage !== this.currentRoute?.name) {
                this.navigate(newPage, { fromState: true });
            }
        });
    }

    /**
     * Register a route
     */
    addRoute(name, config) {
        if (typeof config === 'function') {
            config = { component: config };
        }

        const route = {
            name,
            path: config.path || `/${name}`,
            component: config.component,
            template: config.template,
            title: config.title || name,
            meta: config.meta || {},
            guards: config.guards || [],
            preload: config.preload || false,
            animation: config.animation || 'fade',
            ...config
        };

        this.routes.set(name, route);

        // Pre-load if configured
        if (route.preload && this.options.preloadRoutes) {
            this.preloadRoute(route);
        }

        return this;
    }

    /**
     * Remove a route
     */
    removeRoute(name) {
        return this.routes.delete(name);
    }

    /**
     * Navigate to a route
     */
    async navigate(routeName, options = {}) {
        const { replace = false, params = {}, query = {}, fromState = false, animate = true } = options;

        // Search the route
        const route = this.routes.get(routeName);
        if (!route) {
            console.error(`Route not found: ${routeName}`);
            return this.navigateToDefault();
        }

        // Execute guards (access checks)
        const canNavigate = await this.runGuards(route, this.currentRoute);
        if (!canNavigate) {
            return false;
        }

        // Executa hook beforeLeave da rota atual
        if (this.currentComponent && typeof this.currentComponent.beforeLeave === 'function') {
            const canLeave = await this.currentComponent.beforeLeave(route);
            if (canLeave === false) {
                return false;
            }
        }

        const prevRoute = this.currentRoute;

        // Update URL if not coming from StateManager
        if (!fromState) {
            this.updateURL(route, params, query, replace);
        }

        // Update state in StateManager if not coming from it
        if (!fromState) {
            stateManager.dispatch('NAVIGATE_TO', routeName);
        }

        // Render new route
        await this.renderRoute(route, params, query, animate);

        // Add to history
        this.addToHistory(prevRoute, route, params, query);

        // Emit navigation event
        this.emit('navigate', {
            from: prevRoute,
            to: route,
            params,
            query
        });

        return true;
    }

    /**
     * Render a route
     */
    async renderRoute(route, params = {}, query = {}, animate = true) {
        const container = this.getContainer();
        if (!container) {
            console.error('Container não encontrado:', this.options.container);
            return;
        }

        // Exit animation
        if (animate && this.currentComponent) {
            await this.animateOut();
        }

        // Destroy current component
        if (this.currentComponent) {
            this.destroyCurrentComponent();
        }

        // Update page title
        if (route.title) {
            document.title = `${route.title} - Swift Gamificação`;
        }

        // Create and render new component
        try {
            if (route.component) {
                // Component as class
                this.currentComponent = new route.component(container, {
                    route,
                    params,
                    query,
                    router: this
                });

                if (this.currentComponent.init) {
                    this.currentComponent.init();
                }
            } else if (route.template) {
                // Template as function or string
                const template =
                    typeof route.template === 'function' ? route.template(params, query, route) : route.template;
                container.innerHTML = template;
            }

            this.currentRoute = route;

            // Entrance animation
            if (animate) {
                await this.animateIn();
            }

            // Execute hook afterEnter of the new route
            if (this.currentComponent && typeof this.currentComponent.afterEnter === 'function') {
                await this.currentComponent.afterEnter(route, params, query);
            }

            // Auto-inicializa componentes filhos se existirem
            ComponentFactory.autoInit(container);
        } catch (error) {
            console.error('Erro ao renderizar rota:', error);
            this.handleRenderError(error, route);
        }
    }

    /**
     * Execute guards of a route
     */
    async runGuards(route, fromRoute) {
        for (const guard of route.guards) {
            const result = await guard(route, fromRoute);
            if (result === false) {
                return false;
            }
            if (typeof result === 'string') {
                // Redirect to another route
                await this.navigate(result);
                return false;
            }
        }
        return true;
    }

    /**
     * Go back to the previous route
     */
    back() {
        if (this.history.length > 1) {
            const prevRoute = this.history[this.history.length - 2];
            this.navigate(prevRoute.route.name, {
                params: prevRoute.params,
                query: prevRoute.query,
                replace: true
            });
        }
    }

    /**
     * Go to the next route (if there is)
     */
    forward() {
        // Implement if there is history of "forward"
        console.log('Forward navigation not implemented');
    }

    /**
     * Update URL based on mode
     */
    updateURL(route, params, query, replace = false) {
        let url;

        if (this.options.mode === 'hash') {
            url = `${window.location.pathname}${window.location.search}#${route.path}`;
        } else {
            url = this.buildURL(route.path, params, query);
        }

        if (replace) {
            window.history.replaceState(null, route.title, url);
        } else {
            window.history.pushState(null, route.title, url);
        }
    }

    /**
     * Constrói URL com parâmetros
     */
    buildURL(path, params, query) {
        let url = path;

        // Replace parameters in URL
        Object.keys(params).forEach(key => {
            url = url.replace(`:${key}`, params[key]);
        });

        // Add query parameters
        const queryString = new URLSearchParams(query).toString();
        if (queryString) {
            url += `?${queryString}`;
        }

        return url;
    }

    /**
     * Get container for rendering
     */
    getContainer() {
        const selector = this.options.container;
        return typeof selector === 'string' ? document.querySelector(selector) : selector;
    }

    /**
     * Load initial route
     */
    loadInitialRoute() {
        let initialRoute;

        if (this.options.mode === 'hash') {
            initialRoute = window.location.hash.slice(1) || this.options.defaultRoute;
        } else {
            initialRoute = window.location.pathname.slice(1) || this.options.defaultRoute;
        }

        // Remove '/' from the beginning if it exists
        initialRoute = initialRoute.replace(/^\/+/, '');

        this.navigate(initialRoute || this.options.defaultRoute, { replace: true });
    }

    /**
     * Navigate to default route
     */
    navigateToDefault() {
        return this.navigate(this.options.defaultRoute, { replace: true });
    }

    /**
     * Handle route changes
     */
    handleRouteChange() {
        this.loadInitialRoute();
    }

    /**
     * Destroy current component
     */
    destroyCurrentComponent() {
        if (this.currentComponent && typeof this.currentComponent.destroy === 'function') {
            this.currentComponent.destroy();
        }
        this.currentComponent = null;
    }

    /**
     * Add to history
     */
    addToHistory(fromRoute, toRoute, params, query) {
        this.history.push({
            route: toRoute,
            params,
            query,
            timestamp: Date.now()
        });

        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(-this.maxHistorySize);
        }
    }

    /**
     * Animations
     */
    async animateOut() {
        const container = this.getContainer();
        if (!container || !this.options.animate) return;

        return new Promise(resolve => {
            container.style.transition = `opacity ${this.options.animationDuration}ms ease`;
            container.style.opacity = '0';
            setTimeout(resolve, this.options.animationDuration);
        });
    }

    async animateIn() {
        const container = this.getContainer();
        if (!container || !this.options.animate) return;

        return new Promise(resolve => {
            requestAnimationFrame(() => {
                container.style.transition = `opacity ${this.options.animationDuration}ms ease`;
                container.style.opacity = '1';
                setTimeout(resolve, this.options.animationDuration);
            });
        });
    }

    /**
     * Handle rendering errors
     */
    handleRenderError(error, route) {
        console.error('Erro na renderização da rota:', route.name, error);

        // Could render an error page
        const container = this.getContainer();
        if (container) {
            container.innerHTML = `
                <div class="error-page">
                    <h2>Erro ao carregar página</h2>
                    <p>Ocorreu um erro ao carregar a página "${route.title || route.name}".</p>
                    <button onclick="router.navigateToDefault()" class="btn btn-primary">
                        Voltar ao Dashboard
                    </button>
                </div>
            `;
        }
    }

    /**
     * Pre-load a route
     */
    async preloadRoute(route) {
        if (route.component && typeof route.component === 'function') {
            // Could do lazy loading here
            return Promise.resolve();
        }
    }

    /**
     * Get information of the current route
     */
    getCurrentRoute() {
        return this.currentRoute;
    }

    /**
     * Get navigation history
     */
    getHistory() {
        return [...this.history];
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.history = [];
    }

    /**
     * Destroy the router
     */
    destroy() {
        window.removeEventListener('hashchange', this.handleRouteChange);
        window.removeEventListener('popstate', this.handleRouteChange);

        this.destroyCurrentComponent();
        this.routes.clear();

        return super.destroy();
    }
}

// Common guards for reuse
const commonGuards = {
    // Check if user is logged in
    requireAuth: (route, fromRoute) => {
        const currentUser = stateManager.getState('currentUser');
        const authToken = localStorage.getItem('swift_auth_token');

        // Check if user exists in state
        if (!currentUser) {
            console.log('Redirecting to login - user not found in state');
            // Clear invalid token if exists
            if (authToken) {
                localStorage.removeItem('swift_auth_token');
            }
            return 'login';
        }

        // Check if there is a valid token
        if (!authToken) {
            console.log('Redirecting to login - authentication token not found');
            // Clear user state
            stateManager.setState({ currentUser: null });
            return 'login';
        }

        try {
            const tokenData = JSON.parse(authToken);
            const now = Date.now();

            // Check if the token expired
            if (now - tokenData.loginTime > tokenData.expiresIn) {
                console.log('Redirecionando para login - token expirado');
                localStorage.removeItem('swift_auth_token');
                stateManager.setState({ currentUser: null });

                // Show expired session notification
                if (window.headerComponent) {
                    headerComponent.addNotification({
                        title: 'Sessão Expirada',
                        message: 'Sua sessão expirou. Faça login novamente.',
                        type: 'warning',
                        temporary: true
                    });
                }

                return 'login';
            }

            // Check if the user in the token matches the one in the state
            if (tokenData.cpf !== currentUser.cpf) {
                console.log('Redirecting to login - user in the token does not match the one in the state');
                localStorage.removeItem('swift_auth_token');
                stateManager.setState({ currentUser: null });
                return 'login';
            }

            console.log('User authenticated successfully');
            return true;
        } catch (error) {
            console.error('Erro ao validar token:', error);
            localStorage.removeItem('swift_auth_token');
            stateManager.setState({ currentUser: null });
            return 'login';
        }
    },

    // Check if user has specific permission
    requirePermission: permission => (route, fromRoute) => {
        const currentUser = stateManager.getState('currentUser');
        if (!currentUser || !currentUser.permissions?.includes(permission)) {
            return 'unauthorized';
        }
        return true;
    },

    // Redirect logged users to dashboard (used in login/register)
    redirectIfAuth: (route, fromRoute) => {
        const currentUser = stateManager.getState('currentUser');
        const authToken = localStorage.getItem('swift_auth_token');

        if (currentUser && authToken) {
            try {
                const tokenData = JSON.parse(authToken);
                const now = Date.now();

                // If token is still valid, redirect to dashboard
                if (now - tokenData.loginTime <= tokenData.expiresIn) {
                    console.log('User already logged in, redirecting to dashboard');
                    return 'dashboard';
                }
            } catch (error) {
                // Invalid token, clear data
                localStorage.removeItem('swift_auth_token');
                stateManager.setState({ currentUser: null });
            }
        }

        return true;
    }
};

// Export for global use
window.Router = Router;
window.commonGuards = commonGuards;
