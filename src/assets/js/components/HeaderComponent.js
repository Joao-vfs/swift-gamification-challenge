/**
 * COMPONENT HEADER
 * Manage the header of the Swift Gamification application
 */

class HeaderComponent extends BaseComponent {
    constructor(element, options = {}) {
        super(element, options);

        this.state = {
            user: null,
            notifications: [],
            isMenuOpen: false,
            theme: 'light'
        };
    }

    getDefaults() {
        return {
            showNotifications: true,
            showProfile: true,
            showThemeToggle: true,
            maxNotifications: 5,
            autoClose: true
        };
    }

    setupEventListeners() {
        // Listen to changes of the current user
        this.unsubscribeUser = stateManager.subscribe(
            'currentUser',
            user => {
                this.setState({ user }, false);
                this.updateProfileInfo();
            },
            { immediate: true }
        );

        // Listen to changes of the theme
        this.unsubscribeTheme = stateManager.subscribe(
            'ui.theme',
            theme => {
                this.setState({ theme }, false);
                this.updateTheme();
            },
            { immediate: true }
        );

        // Click outside to close menu
        if (this.options.autoClose) {
            this.addEventListener(document, 'click', e => {
                if (!this.element.contains(e.target)) {
                    this.setState({ isMenuOpen: false });
                }
            });
        }

        // ESC key to close menu
        this.addEventListener(document, 'keydown', e => {
            if (e.key === 'Escape' && this.state.isMenuOpen) {
                this.setState({ isMenuOpen: false });
            }
        });
    }

    template() {
        const { user, notifications, isMenuOpen, theme } = this.state;
        const { showNotifications, showProfile, showThemeToggle } = this.options;

        return `
            <div class="header-container">
                <div class="header-left">
                    <div class="logo">
                        <img src="assets/images/Swift Logo.svg" alt="Swift Logo" class="logo-img">
                        <h1>Swift Gamificação</h1>
                    </div>
                </div>

                <div class="header-center">
                    <nav class="main-navigation" data-component="navigation"></nav>
                </div>

                <div class="header-right">
                    ${showThemeToggle ? this.renderThemeToggle() : ''}
                    ${showNotifications ? this.renderNotifications() : ''}
                    ${showProfile ? this.renderProfile() : ''}
                </div>

                ${isMenuOpen ? this.renderMobileMenu() : ''}
            </div>
        `;
    }

    renderThemeToggle() {
        const { theme } = this.state;

        return `
            <button class="theme-toggle" data-action="toggle-theme" 
                    title="Alternar tema ${theme === 'light' ? 'escuro' : 'claro'}">
                <span class="theme-icon">
                    ${theme === 'light' ? '🌙' : '☀️'}
                </span>
            </button>
        `;
    }

    renderNotifications() {
        const { notifications } = this.state;
        const unreadCount = notifications.filter(n => !n.read).length;

        return `
            <div class="notifications-container">
                <button class="notifications-trigger" data-action="toggle-notifications"
                        title="Notificações">
                    <span class="notifications-icon">🔔</span>
                    ${unreadCount > 0 ? `<span class="notifications-badge">${unreadCount}</span>` : ''}
                </button>
                
                <div class="notifications-dropdown ${notifications.length > 0 ? 'has-notifications' : 'empty'}">
                    <div class="notifications-header">
                        <h3>Notificações</h3>
                        ${
                            unreadCount > 0
                                ? `<button class="mark-all-read" data-action="mark-all-read">Marcar todas como lidas</button>`
                                : ''
                        }
                    </div>
                    
                    <div class="notifications-list">
                        ${
                            notifications.length > 0
                                ? notifications
                                      .slice(0, this.options.maxNotifications)
                                      .map(notification => this.renderNotification(notification))
                                      .join('')
                                : '<div class="no-notifications">Nenhuma notificação</div>'
                        }
                    </div>
                    
                    ${
                        notifications.length > this.options.maxNotifications
                            ? `<div class="notifications-footer">
                            <button class="view-all-notifications" data-action="view-all-notifications">
                                Ver todas as notificações
                            </button>
                        </div>`
                            : ''
                    }
                </div>
            </div>
        `;
    }

    renderNotification(notification) {
        return `
            <div class="notification-item ${notification.read ? 'read' : 'unread'} ${notification.type || 'info'}"
                 data-notification-id="${notification.id}">
                <div class="notification-icon">
                    ${this.getNotificationIcon(notification.type)}
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
                </div>
                <button class="notification-close" data-action="dismiss-notification" 
                        data-notification-id="${notification.id}" title="Dispensar">
                    ×
                </button>
            </div>
        `;
    }

    renderProfile() {
        const { user } = this.state;

        if (!user) {
            return `
                <div class="profile-container">
                    <button class="profile-login" data-route="login">
                        Entrar
                    </button>
                </div>
            `;
        }

        return `
            <div class="profile-container">
                <button class="profile-trigger" data-action="toggle-profile" 
                        title="Menu do usuário">
                    <div class="profile-avatar">
                        ${
                            user.avatar
                                ? `<img src="${user.avatar}" alt="${user.name}">`
                                : user.name.charAt(0).toUpperCase()
                        }
                    </div>
                    <div class="profile-info">
                        <div class="profile-name">${user.name}</div>
                        <div class="profile-role">${user.position}</div>
                    </div>
                    <span class="profile-arrow">▼</span>
                </button>
                
                <div class="profile-dropdown">
                    <div class="profile-header">
                        <div class="profile-avatar-large">
                            ${
                                user.avatar
                                    ? `<img src="${user.avatar}" alt="${user.name}">`
                                    : user.name.charAt(0).toUpperCase()
                            }
                        </div>
                        <div>
                            <div class="profile-name-large">${user.name}</div>
                            <div class="profile-email">${user.email}</div>
                            <div class="profile-stats">
                                <span class="profile-points">🏆 ${user.points.toLocaleString()} pts</span>
                                <span class="profile-level">📊 Nível ${user.level}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="profile-menu">
                        <a href="#" data-route="perfil" class="profile-menu-item">
                            <span class="menu-icon">👤</span>
                            Meu Perfil
                        </a>
                        <a href="#" data-route="configuracoes" class="profile-menu-item">
                            <span class="menu-icon">⚙️</span>
                            Configurações
                        </a>
                        <a href="#" data-route="ajuda" class="profile-menu-item">
                            <span class="menu-icon">❓</span>
                            Ajuda
                        </a>
                        <hr class="profile-divider">
                        <button class="profile-menu-item logout" data-action="logout">
                            <span class="menu-icon">🚪</span>
                            Sair
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderMobileMenu() {
        return `
            <div class="mobile-menu-overlay">
                <div class="mobile-menu">
                    <div class="mobile-menu-header">
                        <h2>Menu</h2>
                        <button class="mobile-menu-close" data-action="close-mobile-menu">×</button>
                    </div>
                    <nav class="mobile-navigation" data-component="navigation"></nav>
                </div>
            </div>
        `;
    }

    afterRender() {
        // Initialize the navigation component
        const navElements = this.findAll('[data-component="navigation"]');
        navElements.forEach(navElement => {
            const navigation = ComponentFactory.create('navigation', navElement, {
                mobile: navElement.closest('.mobile-menu') !== null
            });
        });

        // Configure event listeners of the buttons
        this.setupButtonListeners();
    }

    setupButtonListeners() {
        // Toggle theme
        this.addEventListener('[data-action="toggle-theme"]', 'click', () => {
            this.toggleTheme();
        });

        // Toggle notifications
        this.addEventListener('[data-action="toggle-notifications"]', 'click', () => {
            this.toggleNotifications();
        });

        // Toggle profile
        this.addEventListener('[data-action="toggle-profile"]', 'click', () => {
            this.toggleProfile();
        });

        // Mark all as read
        this.addEventListener('[data-action="mark-all-read"]', 'click', () => {
            this.markAllNotificationsRead();
        });

        // Dismiss notification
        this.addEventListener('[data-action="dismiss-notification"]', 'click', e => {
            const notificationId = e.target.dataset.notificationId;
            this.dismissNotification(notificationId);
        });

        // Logout
        this.addEventListener('[data-action="logout"]', 'click', () => {
            this.logout();
        });

        // Menu mobile
        this.addEventListener('[data-action="toggle-mobile-menu"]', 'click', () => {
            this.toggleMobileMenu();
        });

        this.addEventListener('[data-action="close-mobile-menu"]', 'click', () => {
            this.setState({ isMenuOpen: false });
        });
    }

    // Action methods
    toggleTheme() {
        const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
        stateManager.setState({ ui: { theme: newTheme } });
        this.emit('themeChanged', { theme: newTheme });
    }

    toggleNotifications() {
        const dropdown = this.find('.notifications-dropdown');
        dropdown?.classList.toggle('show');
    }

    toggleProfile() {
        const dropdown = this.find('.profile-dropdown');
        dropdown?.classList.toggle('show');
    }

    toggleMobileMenu() {
        this.setState({ isMenuOpen: !this.state.isMenuOpen });
    }

    markAllNotificationsRead() {
        const updatedNotifications = this.state.notifications.map(n => ({ ...n, read: true }));
        this.setState({ notifications: updatedNotifications });
        this.emit('notificationsRead', { notifications: updatedNotifications });
    }

    dismissNotification(notificationId) {
        const updatedNotifications = this.state.notifications.filter(n => n.id !== notificationId);
        this.setState({ notifications: updatedNotifications });
        this.emit('notificationDismissed', { notificationId });
    }

    addNotification(notification) {
        const newNotification = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            read: false,
            type: 'info',
            ...notification
        };

        const updatedNotifications = [newNotification, ...this.state.notifications];
        this.setState({ notifications: updatedNotifications });

        // Auto-remove after 5 seconds if temporary
        if (notification.temporary !== false) {
            setTimeout(() => {
                this.dismissNotification(newNotification.id);
            }, 5000);
        }

        this.emit('notificationAdded', { notification: newNotification });
    }

    logout() {
        // Clear user data
        stateManager.setState({
            currentUser: null,
            users: [],
            goals: [],
            achievements: []
        });

        // Navigate to login page
        router.navigate('login');

        this.emit('logout');
    }

    // Utility methods
    updateProfileInfo() {
        const profileElements = this.findAll('.profile-name, .profile-name-large');
        profileElements.forEach(el => {
            if (this.state.user) {
                el.textContent = this.state.user.name;
            }
        });
    }

    updateTheme() {
        document.documentElement.setAttribute('data-theme', this.state.theme);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            warning: '⚠️',
            error: '❌',
            info: 'ℹ️',
            achievement: '🏆',
            goal: '🎯'
        };
        return icons[type] || icons.info;
    }

    formatTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;

        if (diff < 60000) return 'Agora mesmo';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m atrás`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h atrás`;

        return new Date(timestamp).toLocaleDateString('pt-BR');
    }

    destroy() {
        // Remove subscriptions
        if (this.unsubscribeUser) this.unsubscribeUser();
        if (this.unsubscribeTheme) this.unsubscribeTheme();

        return super.destroy();
    }
}

// Register the component
ComponentFactory.register('header', HeaderComponent);

// Export for global use
window.HeaderComponent = HeaderComponent;
