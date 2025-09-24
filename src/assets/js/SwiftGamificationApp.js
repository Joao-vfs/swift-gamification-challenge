/**
 * SWIFT GAMIFICAÇÃO - COMPONENTIZED VERSION
 * Refactored gamification system with component architecture
 */

class SwiftGamificationApp {
    constructor() {
        this.router = null;
        this.components = new Map();
        this.isInitialized = false;

        // Application configurations
        this.config = {
            version: '2.0.0',
            environment: 'development',
            features: {
                notifications: true,
                realTimeUpdates: true,
                animations: true,
                persistentState: true
            }
        };

        // Bind methods
        this.init = this.init.bind(this);
        this.initializeStateManager = this.initializeStateManager.bind(this);
        this.setupRouter = this.setupRouter.bind(this);
        this.loadComponents = this.loadComponents.bind(this);
    }

    /**
     * Initialize the application
     */
    async init() {
        if (this.isInitialized) {
            console.warn('Application already initialized');
            return;
        }

        try {
            console.log('🚀 Inicializando Swift Gamificação v2.0...');

            // 1. Initialize the state manager
            await this.initializeStateManager();

            // 2. Restore authentication state if it exists
            await this.restoreAuthenticationState();

            // 3. Load mock data
            await this.loadMockData();

            // 4. Configure the router
            this.setupRouter();

            // 5. Load main components
            this.loadComponents();

            // 6. Configure global listeners
            this.setupGlobalEventListeners();

            // 7. Initialize optional resources
            if (this.config.features.notifications) {
                this.initializeNotifications();
            }

            if (this.config.features.persistentState) {
                this.loadPersistedState();
            }

            this.isInitialized = true;
            console.log('✅ Swift Gamificação initialized successfully!');

            // Emit the initialization complete event
            this.dispatchEvent('app:initialized', {
                version: this.config.version,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error('❌ Erro ao inicializar aplicação:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Initialize the state manager with data
     */
    async initializeStateManager() {
        // The StateManager has already been initialized globally
        stateManager.addMiddleware('before', (data, context) => {
            console.log(`[StateManager] Before update:`, data);
            return data;
        });

        stateManager.addMiddleware('after', (data, context) => {
            if (this.config.features.persistentState) {
                this.persistState();
            }
            return data;
        });

        // Define initial state of the application
        stateManager.setState({
            app: {
                version: this.config.version,
                initialized: true,
                currentPage: 'dashboard'
            }
        });
    }

    /**
     * Restore authentication state if it exists
     */
    async restoreAuthenticationState() {
        try {
            const authToken = localStorage.getItem('swift_auth_token');

            if (!authToken) {
                console.log('Nenhum token de autenticação encontrado');
                return;
            }

            const tokenData = JSON.parse(authToken);
            const now = Date.now();

            // Check if the token has expired
            if (now - tokenData.loginTime > tokenData.expiresIn) {
                console.log('Authentication token expired, removing...');
                localStorage.removeItem('swift_auth_token');
                return;
            }

            console.log('Restoring user session...');

            // Create user based on token data (default user)
            const currentUser = {
                id: tokenData.userId,
                cpf: tokenData.cpf,
                name: 'Usuário Swift',
                email: 'user@swift.com',
                position: 'Funcionário',
                store: 'Swift Store',
                points: 1500,
                level: 3,
                achievements: ['first-login'],
                avatar: null
            };

            // Update state with the restored user
            stateManager.setState({ currentUser });

            console.log('✅ User session restored successfully');
        } catch (error) {
            console.error('Error restoring authentication state:', error);
            localStorage.removeItem('swift_auth_token');
        }
    }

    /**
     * Load mock data for development
     */
    async loadMockData() {
        const mockUsers = [
            {
                id: 1,
                name: 'Ana Silva',
                email: 'ana.silva@swift.com',
                position: 'Vendedora',
                store: 'Swift Shopping Center',
                points: 2850,
                level: 5,
                achievements: ['first-sale', 'monthly-goal', 'team-player'],
                avatar: null,
                bio: 'Vendedora dedicada com foco em excelência no atendimento.'
            },
            {
                id: 2,
                name: 'Carlos Santos',
                email: 'carlos.santos@swift.com',
                position: 'Supervisor',
                store: 'Swift Plaza Norte',
                points: 3200,
                level: 6,
                achievements: ['leadership', 'sales-master', 'mentor']
            },
            {
                id: 3,
                name: 'Maria Oliveira',
                email: 'maria.oliveira@swift.com',
                position: 'Vendedora',
                store: 'Swift Shopping Center',
                points: 2650,
                level: 4,
                achievements: ['customer-love', 'consistent-performer']
            }
        ];

        const mockGoals = [
            {
                id: 1,
                title: 'Meta de Vendas Mensais',
                description: 'Alcançar R$ 15.000 em vendas este mês',
                category: 'sales',
                target: 15000,
                current: 12500,
                deadline: '2025-09-30',
                points: 500,
                status: 'in-progress',
                type: 'currency'
            },
            {
                id: 2,
                title: 'Atendimento ao Cliente',
                description: 'Manter avaliação média acima de 4.5 estrelas',
                category: 'service',
                target: 4.5,
                current: 4.7,
                deadline: '2025-09-30',
                points: 300,
                status: 'completed',
                type: 'rating'
            },
            {
                id: 3,
                title: 'Capacitação Técnica',
                description: 'Completar curso de vendas avançadas',
                category: 'training',
                target: 1,
                current: 0.75,
                deadline: '2025-10-15',
                points: 400,
                status: 'in-progress',
                type: 'percentage'
            }
        ];

        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Update state with mock data
        stateManager.setState({
            users: mockUsers,
            goals: mockGoals,
            currentUser: mockUsers[0] // Ana Silva as default user
        });
    }

    /**
     * Configure the routing system
     */
    setupRouter() {
        // Create instance of the router
        this.router = new Router(null, {
            container: '#content',
            defaultRoute: 'home',
            animated: this.config.features.animations
        });

        // Register routes of the application
        this.registerRoutes();

        // Initialize the router
        this.router.init();

        // Store global reference
        window.router = this.router;
    }

    /**
     * Register all routes of the application
     */
    registerRoutes() {
        // Home route (Initial screen)
        this.router.addRoute('home', {
            title: 'Swift Gamificação - Início',
            component: HomeComponent,
            meta: { icon: '🏠', description: 'Tela inicial da jornada premiada' }
        });

        // Login route
        this.router.addRoute('login', {
            title: 'Login - Swift Gamificação',
            component: LoginComponent,
            guards: [commonGuards.redirectIfAuth],
            meta: { icon: '🔐', description: 'Acesse sua conta' }
        });

        // Register route
        this.router.addRoute('register', {
            title: 'Cadastro - Swift Gamificação',
            component: RegisterComponent,
            guards: [commonGuards.redirectIfAuth],
            meta: { icon: '📝', description: 'Crie sua conta na jornada premiada' }
        });

        // Dashboard route
        this.router.addRoute('dashboard', {
            title: 'Dashboard',
            component: DashboardComponent,
            guards: [commonGuards.requireAuth],
            meta: { icon: '📊', description: 'Visão geral da sua performance' }
        });

        // Rankings route
        this.router.addRoute('rankings', {
            title: 'Rankings',
            component: RankingComponent,
            guards: [commonGuards.requireAuth],
            meta: { icon: '🏆', description: 'Veja sua posição no ranking' }
        });

        // Metas route
        this.router.addRoute('metas', {
            title: 'Metas',
            component: GoalsComponent,
            guards: [commonGuards.requireAuth],
            meta: { icon: '🎯', description: 'Acompanhe suas metas e objetivos' }
        });

        // Perfil route
        this.router.addRoute('perfil', {
            title: 'Perfil',
            component: ProfileComponent,
            guards: [commonGuards.requireAuth],
            meta: { icon: '👤', description: 'Suas informações e conquistas' }
        });

        // Achievements route
        this.router.addRoute('conquistas', {
            title: 'Conquistas',
            component: AchievementsComponent,
            guards: [commonGuards.requireAuth],
            meta: { icon: '🏅', description: 'Todas as conquistas disponíveis' }
        });

        // Not found route
        this.router.addRoute('not-found', {
            title: 'Página não encontrada',
            template: () => `
                <div class="error-page">
                    <h2>🚫 Página não encontrada</h2>
                    <p>A página que você está procurando não existe.</p>
                    <button onclick="router.navigate('home')" class="btn btn-primary">
                        Voltar ao Início
                    </button>
                </div>
            `
        });
    }

    /**
     * Load and initialize main components
     */
    loadComponents() {
        // Header Component
        const headerElement = document.querySelector('.header');
        if (headerElement) {
            const headerComponent = ComponentFactory.create('header', headerElement, {
                showNotifications: this.config.features.notifications,
                showProfile: true,
                showThemeToggle: true
            });

            this.components.set('header', headerComponent);
            window.headerComponent = headerComponent; // Referência global para notificações
        }

        // Footer (if it exists)
        const footerElement = document.querySelector('.footer');
        if (footerElement) {
            // Can add footer component if necessary
        }

        // Auto-initialize components with data-component
        const autoComponents = ComponentFactory.autoInit();
        autoComponents.forEach(component => {
            this.components.set(`auto_${Date.now()}`, component);
        });
    }

    /**
     * Configure global event listeners
     */
    setupGlobalEventListeners() {
        // Listen to unhandled errors
        window.addEventListener('error', event => {
            console.error('Erro global:', event.error);
            this.handleGlobalError(event.error);
        });

        // Listen to connectivity changes
        window.addEventListener('online', () => {
            this.handleConnectivityChange(true);
        });

        window.addEventListener('offline', () => {
            this.handleConnectivityChange(false);
        });

        // Listen to page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handlePageHidden();
            } else {
                this.handlePageVisible();
            }
        });

        // Listener for keyboard shortcuts
        document.addEventListener('keydown', e => {
            this.handleKeyboardShortcuts(e);
        });

        // Prevent accidental reload
        window.addEventListener('beforeunload', e => {
            const hasUnsavedChanges = this.checkUnsavedChanges();
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    /**
     * Initialize notification system
     */
    initializeNotifications() {
        if (!('Notification' in window)) {
            console.warn('Notificações não suportadas neste navegador');
            return;
        }

        // Request permission for notifications
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Configure automatic notifications
        this.setupNotificationTriggers();
    }

    /**
     * Configure automatic notification triggers
     */
    setupNotificationTriggers() {
        // Notification when goal is completed
        stateManager.subscribe('goals', (goals, prevGoals) => {
            if (!prevGoals) return;

            goals.forEach(goal => {
                const prevGoal = prevGoals.find(g => g.id === goal.id);
                if (prevGoal && prevGoal.status !== 'completed' && goal.status === 'completed') {
                    this.showNotification('Meta Completada! 🎯', {
                        body: `Parabéns! Você completou "${goal.title}"`,
                        icon: '/assets/images/Swift Logo.svg'
                    });
                }
            });
        });

        // Notification when user level up
        stateManager.subscribe('currentUser.level', (newLevel, prevLevel) => {
            if (prevLevel && newLevel > prevLevel) {
                this.showNotification('Novo Nível! 📈', {
                    body: `Parabéns! Você alcançou o nível ${newLevel}`,
                    icon: '/assets/images/Swift Logo.svg'
                });
            }
        });
    }

    /**
     * Show notification
     */
    showNotification(title, options = {}) {
        // Notification in the header
        if (window.headerComponent) {
            headerComponent.addNotification({
                title,
                message: options.body,
                type: 'success',
                temporary: true
            });
        }

        // System notification (if allowed)
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: options.body,
                icon: options.icon || '/assets/images/Swift Logo.svg',
                badge: '/assets/images/Swift Logo.svg'
            });
        }
    }

    /**
     * Load persisted state
     */
    loadPersistedState() {
        try {
            const savedState = localStorage.getItem('swiftGamification_state');
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                stateManager.setState(parsedState, { merge: true, validate: true });
            }
        } catch (error) {
            console.warn('Erro ao carregar estado persistido:', error);
        }
    }

    /**
     * Persist current state
     */
    persistState() {
        try {
            const currentState = stateManager.getState();
            // Remove sensitive data before saving
            const stateToSave = {
                ...currentState,
                cache: undefined // Cache should not be persisted
            };

            localStorage.setItem('swiftGamification_state', JSON.stringify(stateToSave));
        } catch (error) {
            console.warn('Error persisting state:', error);
        }
    }

    /**
     * Event handlers
     */
    handleInitializationError(error) {
        document.body.innerHTML = `
            <div class="initialization-error">
                <h1>❌ Erro de Inicialização</h1>
                <p>Ocorreu um erro ao carregar a aplicação Swift Gamificação.</p>
                <details>
                    <summary>Detalhes técnicos</summary>
                    <pre>${error.stack}</pre>
                </details>
                <button onclick="window.location.reload()" class="btn btn-primary">
                    Recarregar Página
                </button>
            </div>
        `;
    }

    handleGlobalError(error) {
        console.error('Erro global capturado:', error);

        if (window.headerComponent) {
            headerComponent.addNotification({
                title: 'Erro na Aplicação',
                message: 'Um erro inesperado ocorreu. A aplicação pode não funcionar corretamente.',
                type: 'error',
                temporary: false
            });
        }
    }

    handleConnectivityChange(isOnline) {
        const message = isOnline ? 'Conexão restaurada' : 'Sem conexão com a internet';

        if (window.headerComponent) {
            headerComponent.addNotification({
                title: isOnline ? 'Online' : 'Offline',
                message,
                type: isOnline ? 'success' : 'warning',
                temporary: true
            });
        }
    }

    handlePageHidden() {
        // Pause real-time updates when page is hidden
        this.components.forEach(component => {
            if (component.pause && typeof component.pause === 'function') {
                component.pause();
            }
        });
    }

    handlePageVisible() {
        // Resume updates when page becomes visible
        this.components.forEach(component => {
            if (component.resume && typeof component.resume === 'function') {
                component.resume();
            }
        });
    }

    handleKeyboardShortcuts(e) {
        // Atalhos globais
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    this.router.navigate('dashboard');
                    break;
                case '2':
                    e.preventDefault();
                    this.router.navigate('rankings');
                    break;
                case '3':
                    e.preventDefault();
                    this.router.navigate('metas');
                    break;
                case '4':
                    e.preventDefault();
                    this.router.navigate('perfil');
                    break;
                case 'h':
                    e.preventDefault();
                    this.showHelpModal();
                    break;
            }
        }
    }

    checkUnsavedChanges() {
        // Check if there are unsaved changes in any component
        return Array.from(this.components.values()).some(component => {
            return component.hasUnsavedChanges && component.hasUnsavedChanges();
        });
    }

    showHelpModal() {
        // Implement help modal
        console.log('Mostrar ajuda');
    }

    /**
     * Authentication system
     */
    logout() {
        console.log('Fazendo logout do usuário...');

        // Remove authentication token
        localStorage.removeItem('swift_auth_token');

        // Clear "remember me" data
        localStorage.removeItem('swift_remember_cpf');
        localStorage.removeItem('swift_remember_codigo_loja');

        // Clear user state
        stateManager.setState({ currentUser: null });

        // Show logout notification
        if (window.headerComponent) {
            headerComponent.addNotification({
                title: 'Logout Realizado',
                message: 'Você foi deslogado com sucesso.',
                type: 'info',
                temporary: true
            });
        }

        // Redirect to home
        if (this.router) {
            this.router.navigate('home');
        }

        console.log('✅ Logout realizado com sucesso');
    }

    /**
     * Utility methods
     */
    dispatchEvent(eventName, data) {
        const event = new CustomEvent(eventName, {
            detail: data,
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    getComponent(name) {
        return this.components.get(name);
    }

    /**
     * Clear application resources
     */
    destroy() {
        // Destroy all components
        this.components.forEach(component => {
            if (component.destroy) {
                component.destroy();
            }
        });
        this.components.clear();

        // Destroy router
        if (this.router) {
            this.router.destroy();
        }

        // Clear state
        stateManager.resetState();

        this.isInitialized = false;
        console.log('🧹 Aplicação Swift Gamificação destruída');
    }

    /**
     * Debug information
     */
    getDebugInfo() {
        return {
            version: this.config.version,
            isInitialized: this.isInitialized,
            componentsCount: this.components.size,
            currentRoute: this.router?.getCurrentRoute()?.name,
            stateSize: JSON.stringify(stateManager.getState()).length,
            features: this.config.features
        };
    }
}

// Automatic initialization when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Create and initialize application
        window.swiftApp = new SwiftGamificationApp();
        await window.swiftApp.init();

        // Make debug information available in development
        if (window.swiftApp.config.environment === 'development') {
            window.debugSwift = () => {
                console.table(window.swiftApp.getDebugInfo());
                console.log('StateManager:', stateManager);
                console.log('Components:', window.swiftApp.components);
            };

            console.log('💡 Use debugSwift() no console para informações de debug');
        }
    } catch (error) {
        console.error('Erro fatal na inicialização:', error);
    }
});

// Export class for use if necessary
window.SwiftGamificationApp = SwiftGamificationApp;
