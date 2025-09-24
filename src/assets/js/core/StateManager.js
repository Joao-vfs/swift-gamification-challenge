/**
 * CENTRALIZED STATE MANAGER
 * Gerencia o estado global da aplicação Swift Gamificação
 */

class StateManager {
    constructor() {
        this.state = {
            // Application state
            app: {
                currentPage: 'dashboard',
                isLoading: false,
                error: null,
                lastUpdate: null
            },

            // Current user state
            currentUser: null,

            // Application data
            users: [],
            goals: [],
            achievements: [],
            rankings: [],

            // UI settings
            ui: {
                theme: 'light',
                animations: true,
                notifications: true
            },

            // Cache for performance
            cache: new Map()
        };

        this.listeners = new Map();
        this.middleware = [];
        this.history = [];
        this.maxHistorySize = 50;

        // Bind methods to class instance
        this.getState = this.getState.bind(this);
        this.setState = this.setState.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.dispatch = this.dispatch.bind(this);
    }

    /**
     * Get the current state or a specific part
     */
    getState(path = null) {
        if (!path) return { ...this.state };

        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, this.state);
    }

    /**
     * Update the state
     */
    setState(updates, options = {}) {
        const { silent = false, merge = true, validate = true } = options;

        const prevState = { ...this.state };

        if (validate && !this.validateStateUpdate(updates)) {
            console.warn('Invalid state update:', updates);
            return false;
        }

        // Execute middleware before the update
        const processedUpdates = this.runMiddleware('before', updates, prevState);

        // Update the state
        if (merge) {
            this.state = this.deepMerge(this.state, processedUpdates);
        } else {
            this.state = { ...processedUpdates };
        }

        // Add to history
        this.addToHistory(prevState, this.state);

        // Update timestamp
        this.state.app.lastUpdate = Date.now();

        // Execute middleware after the update
        this.runMiddleware('after', this.state, prevState);

        // Notifica subscribers
        if (!silent) {
            this.notifyListeners(prevState, this.state);
        }

        return true;
    }

    /**
     * Subscribe a listener for state changes
     */
    subscribe(path, callback, options = {}) {
        const { immediate = false, once = false, deep = false } = options;

        const listenerId = this.generateId();
        const listener = {
            id: listenerId,
            path,
            callback,
            once,
            deep,
            lastValue: this.getState(path)
        };

        if (!this.listeners.has(path)) {
            this.listeners.set(path, []);
        }

        this.listeners.get(path).push(listener);

        // Execute immediately if requested
        if (immediate) {
            callback(listener.lastValue, null, path);
        }

        // Return unsubscribe function
        return () => this.unsubscribe(listenerId);
    }

    /**
     * Remove a listener
     */
    unsubscribe(listenerId) {
        for (const [path, listeners] of this.listeners) {
            const index = listeners.findIndex(l => l.id === listenerId);
            if (index !== -1) {
                listeners.splice(index, 1);
                if (listeners.length === 0) {
                    this.listeners.delete(path);
                }
                return true;
            }
        }
        return false;
    }

    /**
     * Dispatch an action
     */
    dispatch(action, payload = {}) {
        if (typeof action === 'string') {
            action = { type: action, payload };
        }

        console.log(`[StateManager] Dispatching action:`, action);

        switch (action.type) {
            case 'LOAD_USER_DATA':
                return this.loadUserData(action.payload);

            case 'UPDATE_USER_POINTS':
                return this.updateUserPoints(action.payload);

            case 'COMPLETE_GOAL':
                return this.completeGoal(action.payload);

            case 'ADD_ACHIEVEMENT':
                return this.addAchievement(action.payload);

            case 'NAVIGATE_TO':
                return this.navigateTo(action.payload);

            case 'SET_LOADING':
                return this.setState({
                    app: { ...this.state.app, isLoading: action.payload }
                });

            case 'SET_ERROR':
                return this.setState({
                    app: { ...this.state.app, error: action.payload }
                });

            case 'CLEAR_CACHE':
                return this.clearCache(action.payload);

            default:
                console.warn(`[StateManager] Ação desconhecida: ${action.type}`);
                return false;
        }
    }

    /**
     * Business specific actions
     */
    loadUserData(userData) {
        return this.setState({
            currentUser: userData,
            users: userData.users || this.state.users,
            goals: userData.goals || this.state.goals,
            achievements: userData.achievements || this.state.achievements
        });
    }

    updateUserPoints(pointsData) {
        const { userId, points, reason } = pointsData;

        const updatedUsers = this.state.users.map(user => {
            if (user.id === userId) {
                const newPoints = user.points + points;
                const newLevel = Math.floor(newPoints / 1000) + 1;

                return {
                    ...user,
                    points: newPoints,
                    level: Math.max(user.level, newLevel)
                };
            }
            return user;
        });

        // Update current user if necessary
        const updatedCurrentUser =
            this.state.currentUser?.id === userId ? updatedUsers.find(u => u.id === userId) : this.state.currentUser;

        return this.setState({
            users: updatedUsers,
            currentUser: updatedCurrentUser
        });
    }

    completeGoal(goalId) {
        const updatedGoals = this.state.goals.map(goal => {
            if (goal.id === goalId) {
                return { ...goal, status: 'completed', current: goal.target };
            }
            return goal;
        });

        const completedGoal = updatedGoals.find(g => g.id === goalId);
        if (completedGoal && this.state.currentUser) {
            // Add points by completing the goal
            this.updateUserPoints({
                userId: this.state.currentUser.id,
                points: completedGoal.points,
                reason: `Meta completada: ${completedGoal.title}`
            });
        }

        return this.setState({ goals: updatedGoals });
    }

    addAchievement(achievementData) {
        const { userId, achievementId } = achievementData;

        const updatedUsers = this.state.users.map(user => {
            if (user.id === userId && !user.achievements.includes(achievementId)) {
                return {
                    ...user,
                    achievements: [...user.achievements, achievementId]
                };
            }
            return user;
        });

        const updatedCurrentUser =
            this.state.currentUser?.id === userId ? updatedUsers.find(u => u.id === userId) : this.state.currentUser;

        return this.setState({
            users: updatedUsers,
            currentUser: updatedCurrentUser
        });
    }

    navigateTo(page) {
        return this.setState({
            app: { ...this.state.app, currentPage: page }
        });
    }

    /**
     * Utilities
     */
    validateStateUpdate(updates) {
        // Implement basic validations
        if (updates.currentUser && !updates.currentUser.id) {
            return false;
        }

        if (updates.goals && !Array.isArray(updates.goals)) {
            return false;
        }

        return true;
    }

    deepMerge(target, source) {
        const result = { ...target };

        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (this.isObject(source[key]) && this.isObject(result[key])) {
                    result[key] = this.deepMerge(result[key], source[key]);
                } else {
                    result[key] = source[key];
                }
            }
        }

        return result;
    }

    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    generateId() {
        return `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    addToHistory(prevState, newState) {
        this.history.unshift({
            timestamp: Date.now(),
            prevState: prevState,
            newState: newState
        });

        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(0, this.maxHistorySize);
        }
    }

    notifyListeners(prevState, newState) {
        for (const [path, listeners] of this.listeners) {
            const newValue = this.getState(path);

            listeners.forEach(listener => {
                const hasChanged = JSON.stringify(listener.lastValue) !== JSON.stringify(newValue);

                if (hasChanged || listener.deep) {
                    listener.callback(newValue, listener.lastValue, path);
                    listener.lastValue = newValue;

                    if (listener.once) {
                        this.unsubscribe(listener.id);
                    }
                }
            });
        }
    }

    runMiddleware(phase, data, context) {
        return this.middleware
            .filter(m => m.phase === phase)
            .reduce((acc, middleware) => middleware.handler(acc, context), data);
    }

    addMiddleware(phase, handler, options = {}) {
        const middleware = { phase, handler, ...options };
        this.middleware.push(middleware);

        return () => {
            const index = this.middleware.indexOf(middleware);
            if (index !== -1) {
                this.middleware.splice(index, 1);
            }
        };
    }

    clearCache(pattern = null) {
        if (pattern) {
            for (const key of this.state.cache.keys()) {
                if (key.includes(pattern)) {
                    this.state.cache.delete(key);
                }
            }
        } else {
            this.state.cache.clear();
        }

        return this.setState({}, { silent: true });
    }

    getCache(key) {
        return this.state.cache.get(key);
    }

    setCache(key, value, ttl = null) {
        const cacheEntry = {
            value,
            timestamp: Date.now(),
            ttl
        };

        this.state.cache.set(key, cacheEntry);

        if (ttl) {
            setTimeout(() => {
                this.state.cache.delete(key);
            }, ttl);
        }
    }

    // Debug and development methods
    getHistory() {
        return [...this.history];
    }

    resetState() {
        this.state = {
            app: { currentPage: 'dashboard', isLoading: false, error: null },
            currentUser: null,
            users: [],
            goals: [],
            achievements: [],
            rankings: [],
            ui: { theme: 'light', animations: true, notifications: true },
            cache: new Map()
        };

        this.notifyListeners({}, this.state);
    }

    exportState() {
        const exportableState = { ...this.state };
        delete exportableState.cache; // Cache is not serializable
        return JSON.stringify(exportableState, null, 2);
    }

    importState(stateJson) {
        try {
            const importedState = JSON.parse(stateJson);
            importedState.cache = new Map();
            this.setState(importedState, { merge: false });
            return true;
        } catch (error) {
            console.error('Erro ao importar estado:', error);
            return false;
        }
    }
}

// Singleton instance of the state manager
const stateManager = new StateManager();

// Export for global use
window.StateManager = StateManager;
window.stateManager = stateManager;
