/**
 * COMPONENT NAVIGATION
 * Manages the navigation of the Swift Gamification application
 */

class NavigationComponent extends BaseComponent {
    constructor(element, options = {}) {
        super(element, options);

        this.state = {
            currentRoute: null,
            menuItems: [],
            isCollapsed: false,
            breadcrumb: []
        };
    }

    getDefaults() {
        return {
            mobile: false,
            showBreadcrumb: false,
            showIcons: true,
            collapsible: false,
            menuItems: [
                {
                    id: 'dashboard',
                    label: 'Dashboard',
                    icon: '📊',
                    route: 'dashboard',
                    active: true
                },
                {
                    id: 'rankings',
                    label: 'Rankings',
                    icon: '🏆',
                    route: 'rankings'
                },
                {
                    id: 'metas',
                    label: 'Metas',
                    icon: '🎯',
                    route: 'metas'
                },
                {
                    id: 'perfil',
                    label: 'Perfil',
                    icon: '👤',
                    route: 'perfil'
                }
            ]
        };
    }

    init() {
        // Initialize with default items
        this.setState({ menuItems: this.options.menuItems });
        return super.init();
    }

    setupEventListeners() {
        // Listen to current route changes
        this.unsubscribeRoute = stateManager.subscribe(
            'app.currentPage',
            currentRoute => {
                this.setState({ currentRoute }, false);
                this.updateActiveMenuItem();
                if (this.options.showBreadcrumb) {
                    this.updateBreadcrumb();
                }
            },
            { immediate: true }
        );

        // Click on menu items
        this.addEventListener(this.element, 'click', e => {
            const menuItem = e.target.closest('[data-route]');
            if (menuItem) {
                e.preventDefault();
                const route = menuItem.dataset.route;
                this.navigateToRoute(route);
            }
        });

        // Toggle collapse (if enabled)
        if (this.options.collapsible) {
            this.addEventListener('[data-action="toggle-collapse"]', 'click', () => {
                this.toggleCollapse();
            });
        }

        // Keyboard shortcuts
        this.addEventListener(document, 'keydown', e => {
            if (e.ctrlKey || e.metaKey) {
                this.handleKeyboardShortcuts(e);
            }
        });
    }

    template() {
        const { menuItems, isCollapsed, currentRoute, breadcrumb } = this.state;
        const { mobile, showBreadcrumb, showIcons, collapsible } = this.options;

        return `
            <div class="navigation-container ${mobile ? 'mobile' : 'desktop'} ${isCollapsed ? 'collapsed' : ''}">
                ${collapsible ? this.renderCollapseToggle() : ''}
                
                ${showBreadcrumb && breadcrumb.length > 0 ? this.renderBreadcrumb() : ''}
                
                <ul class="navigation-menu" role="menubar">
                    ${menuItems.map(item => this.renderMenuItem(item)).join('')}
                </ul>
                
                ${!mobile ? this.renderShortcutsHint() : ''}
            </div>
        `;
    }

    renderMenuItem(item) {
        const { currentRoute } = this.state;
        const { showIcons } = this.options;
        const isActive = item.route === currentRoute || item.active;
        const hasSubmenu = item.submenu && item.submenu.length > 0;

        return `
            <li class="navigation-item ${isActive ? 'active' : ''} ${hasSubmenu ? 'has-submenu' : ''}" 
                role="none">
                <a href="#${item.route}" 
                   class="navigation-link ${item.badge ? 'has-badge' : ''}"
                   data-route="${item.route}"
                   data-shortcut="${item.shortcut || ''}"
                   title="${item.description || item.label}"
                   role="menuitem"
                   ${item.disabled ? 'aria-disabled="true"' : ''}
                   ${isActive ? 'aria-current="page"' : ''}>
                   
                    ${showIcons && item.icon ? `<span class="navigation-icon">${item.icon}</span>` : ''}
                    
                    <span class="navigation-label">${item.label}</span>
                    
                    ${
                        item.badge
                            ? `<span class="navigation-badge ${item.badge.type || 'default'}">${
                                  item.badge.value
                              }</span>`
                            : ''
                    }
                    
                    ${
                        item.shortcut
                            ? `<span class="navigation-shortcut">${this.formatShortcut(item.shortcut)}</span>`
                            : ''
                    }
                    
                    ${hasSubmenu ? '<span class="navigation-arrow">▶</span>' : ''}
                </a>
                
                ${hasSubmenu ? this.renderSubmenu(item.submenu) : ''}
            </li>
        `;
    }

    renderSubmenu(submenuItems) {
        return `
            <ul class="navigation-submenu" role="menu">
                ${submenuItems
                    .map(
                        item => `
                    <li class="navigation-subitem" role="none">
                        <a href="#${item.route}" 
                           class="navigation-sublink"
                           data-route="${item.route}"
                           role="menuitem">
                            ${item.icon ? `<span class="navigation-icon">${item.icon}</span>` : ''}
                            <span class="navigation-label">${item.label}</span>
                        </a>
                    </li>
                `
                    )
                    .join('')}
            </ul>
        `;
    }

    renderCollapseToggle() {
        const { isCollapsed } = this.state;

        return `
            <button class="navigation-toggle" 
                    data-action="toggle-collapse"
                    title="${isCollapsed ? 'Expandir menu' : 'Recolher menu'}"
                    aria-expanded="${!isCollapsed}"
                    aria-label="Toggle navigation">
                <span class="toggle-icon">${isCollapsed ? '▶' : '◀'}</span>
            </button>
        `;
    }

    renderBreadcrumb() {
        const { breadcrumb } = this.state;

        return `
            <nav class="breadcrumb-container" aria-label="Breadcrumb">
                <ol class="breadcrumb">
                    ${breadcrumb
                        .map(
                            (crumb, index) => `
                        <li class="breadcrumb-item ${index === breadcrumb.length - 1 ? 'active' : ''}">
                            ${
                                index < breadcrumb.length - 1
                                    ? `<a href="#${crumb.route}" data-route="${crumb.route}">${crumb.label}</a>`
                                    : `<span>${crumb.label}</span>`
                            }
                        </li>
                    `
                        )
                        .join('')}
                </ol>
            </nav>
        `;
    }

    renderShortcutsHint() {
        return `
            <div class="shortcuts-hint">
                <small>💡 Use Ctrl+1-4 para navegação rápida</small>
            </div>
        `;
    }

    // Action methods
    navigateToRoute(route) {
        if (router) {
            router.navigate(route);
        } else {
            // Fallback when router is not available
            stateManager.dispatch('NAVIGATE_TO', route);
        }

        this.emit('navigate', { route });
    }

    updateActiveMenuItem() {
        const { menuItems, currentRoute } = this.state;

        const updatedItems = menuItems.map(item => ({
            ...item,
            active: item.route === currentRoute
        }));

        this.setState({ menuItems: updatedItems }, false);

        // Update CSS classes on elements
        this.findAll('.navigation-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeItem = this.find(`[data-route="${currentRoute}"]`)?.closest('.navigation-item');
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    updateBreadcrumb() {
        const { currentRoute, menuItems } = this.state;
        const breadcrumb = this.buildBreadcrumb(currentRoute, menuItems);
        this.setState({ breadcrumb }, false);
    }

    buildBreadcrumb(currentRoute, menuItems) {
        const breadcrumb = [{ label: 'Início', route: 'dashboard' }];

        // Find the current item in the menu
        const findItem = (items, route) => {
            for (const item of items) {
                if (item.route === route) return item;
                if (item.submenu) {
                    const found = findItem(item.submenu, route);
                    if (found) return found;
                }
            }
            return null;
        };

        const currentItem = findItem(menuItems, currentRoute);
        if (currentItem && currentItem.route !== 'dashboard') {
            breadcrumb.push({
                label: currentItem.label,
                route: currentItem.route
            });
        }

        return breadcrumb;
    }

    toggleCollapse() {
        this.setState({ isCollapsed: !this.state.isCollapsed });
        this.emit('collapseToggled', { collapsed: this.state.isCollapsed });
    }

    handleKeyboardShortcuts(e) {
        const shortcutMap = {
            1: 'dashboard',
            2: 'rankings',
            3: 'metas',
            4: 'perfil'
        };

        const route = shortcutMap[e.key];
        if (route) {
            e.preventDefault();
            this.navigateToRoute(route);
        }
    }

    formatShortcut(shortcut) {
        return shortcut.replace('ctrl', 'Ctrl').replace('cmd', '⌘').replace('alt', 'Alt').replace('shift', 'Shift');
    }

    // Métodos públicos para gerenciar menu
    addMenuItem(item, position = -1) {
        const menuItems = [...this.state.menuItems];

        if (position >= 0) {
            menuItems.splice(position, 0, item);
        } else {
            menuItems.push(item);
        }

        this.setState({ menuItems });
        this.emit('menuItemAdded', { item, position });
    }

    removeMenuItem(itemId) {
        const menuItems = this.state.menuItems.filter(item => item.id !== itemId);
        this.setState({ menuItems });
        this.emit('menuItemRemoved', { itemId });
    }

    updateMenuItem(itemId, updates) {
        const menuItems = this.state.menuItems.map(item => (item.id === itemId ? { ...item, ...updates } : item));

        this.setState({ menuItems });
        this.emit('menuItemUpdated', { itemId, updates });
    }

    setBadge(itemId, badge) {
        this.updateMenuItem(itemId, { badge });
    }

    removeBadge(itemId) {
        this.updateMenuItem(itemId, { badge: null });
    }

    disableMenuItem(itemId) {
        this.updateMenuItem(itemId, { disabled: true });
    }

    enableMenuItem(itemId) {
        this.updateMenuItem(itemId, { disabled: false });
    }

    // Animations and visual effects
    highlightMenuItem(itemId, duration = 2000) {
        const menuItem = this.find(`[data-route="${itemId}"]`)?.closest('.navigation-item');
        if (menuItem) {
            menuItem.classList.add('highlight');
            setTimeout(() => {
                menuItem.classList.remove('highlight');
            }, duration);
        }
    }

    // Persistence of the collapse state
    saveCollapseState() {
        localStorage.setItem('navigation-collapsed', this.state.isCollapsed.toString());
    }

    loadCollapseState() {
        const saved = localStorage.getItem('navigation-collapsed');
        if (saved !== null) {
            this.setState({ isCollapsed: saved === 'true' });
        }
    }

    onStateChange(prevState, newState) {
        // Save collapse state when changes
        if (prevState.isCollapsed !== newState.isCollapsed) {
            this.saveCollapseState();
        }
    }

    afterInit() {
        // Load saved state
        if (this.options.collapsible) {
            this.loadCollapseState();
        }
    }

    destroy() {
        // Remove subscription
        if (this.unsubscribeRoute) this.unsubscribeRoute();

        return super.destroy();
    }
}

// Register the component
ComponentFactory.register('navigation', NavigationComponent);

// Export for global use
window.NavigationComponent = NavigationComponent;
