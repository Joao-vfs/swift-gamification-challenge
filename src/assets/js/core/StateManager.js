class StateManager {
    constructor() {
        this.state = {
            currentUser: null,
        };
        this.listeners = new Map();
    }

    getState(path = null) {
        if (!path) return { ...this.state };
        return path.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : null), this.state);
    }

    setState(updates) {
        const prevState = { ...this.state };
        this.state = { ...this.state, ...updates };

        for (const [path, listeners] of this.listeners) {
            const prevValue = path.split('.').reduce((obj, key) => (obj ? obj[key] : null), prevState);
            const newValue = this.getState(path);
            if (JSON.stringify(prevValue) !== JSON.stringify(newValue)) {
                listeners.forEach(callback => callback(newValue, prevValue));
            }
        }
    }

    subscribe(path, callback) {
        if (!this.listeners.has(path)) {
            this.listeners.set(path, []);
        }
        this.listeners.get(path).push(callback);

        return () => {
            const listeners = this.listeners.get(path);
            if (listeners) {
                const index = listeners.indexOf(callback);
                if (index > -1) {
                    listeners.splice(index, 1);
                }
            }
        };
    }
}

const stateManager = new StateManager();
window.stateManager = stateManager;