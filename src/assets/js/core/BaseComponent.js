/**
 * BASE COMPONENT SYSTEM
 * Base class for all components of the Swift Gamification application
 */

class BaseComponent {
    constructor(element, options = {}) {
        this.element = element;
        this.options = { ...this.getDefaults(), ...options };
        this.state = {};
        this.children = new Map();
        this.eventListeners = [];
        this.isInitialized = false;
        this.isDestroyed = false;

        // Bind methods
        this.render = this.render.bind(this);
        this.setState = this.setState.bind(this);
        this.destroy = this.destroy.bind(this);
    }

    /**
     * Default values of the component (override in child components)
     */
    getDefaults() {
        return {};
    }

    /**
     * Initialize the component
     */
    init() {
        if (this.isInitialized) return this;

        this.beforeInit();
        this.setupEventListeners();
        this.render();
        this.afterInit();

        this.isInitialized = true;
        this.emit('initialized');

        return this;
    }

    /**
     * Life cycle hooks - override in child components
     */
    beforeInit() {}
    afterInit() {}
    beforeRender() {}
    afterRender() {}
    beforeDestroy() {}
    afterDestroy() {}

    /**
     * Event listeners configuration - override in child components
     */
    setupEventListeners() {}

    /**
     * Render the component
     */
    render() {
        if (this.isDestroyed) return this;

        this.beforeRender();

        const content = this.template();
        if (content && this.element) {
            this.element.innerHTML = content;
        }

        this.afterRender();
        this.emit('rendered');

        return this;
    }

    /**
     * Template of the component (must be implemented in child components)
     */
    template() {
        return '';
    }

    /**
     * Manage the state of the component
     */
    setState(newState, shouldRender = true) {
        const prevState = { ...this.state };

        if (typeof newState === 'function') {
            this.state = { ...this.state, ...newState(prevState) };
        } else {
            this.state = { ...this.state, ...newState };
        }

        this.onStateChange(prevState, this.state);

        if (shouldRender) {
            this.render();
        }

        this.emit('stateChanged', { prevState, newState: this.state });

        return this;
    }

    /**
     * Callback for state change (override in child components)
     */
    onStateChange(prevState, newState) {}

    /**
     * Add event listener and keep reference for cleanup
     */
    addEventListener(target, event, handler, options = {}) {
        const element =
            typeof target === 'string' ? this.element?.querySelector(target) || document.querySelector(target) : target;

        if (element) {
            element.addEventListener(event, handler, options);
            this.eventListeners.push({ element, event, handler, options });
        }
    }

    /**
     * Remove a specific event listener
     */
    removeEventListener(target, event, handler) {
        const element =
            typeof target === 'string' ? this.element?.querySelector(target) || document.querySelector(target) : target;

        if (element) {
            element.removeEventListener(event, handler);
            this.eventListeners = this.eventListeners.filter(
                listener => !(listener.element === element && listener.event === event && listener.handler === handler)
            );
        }
    }

    /**
     * Add child component
     */
    addChild(name, component) {
        this.children.set(name, component);
        return this;
    }

    /**
     * Remove child component
     */
    removeChild(name) {
        const child = this.children.get(name);
        if (child && typeof child.destroy === 'function') {
            child.destroy();
        }
        this.children.delete(name);
        return this;
    }

    /**
     * Search element inside the component
     */
    find(selector) {
        return this.element?.querySelector(selector);
    }

    /**
     * Search all elements inside the component
     */
    findAll(selector) {
        return this.element?.querySelectorAll(selector) || [];
    }

    /**
     * Emit custom event
     */
    emit(eventName, data = {}) {
        if (this.element) {
            const event = new CustomEvent(`component:${eventName}`, {
                detail: { component: this, data },
                bubbles: true
            });
            this.element.dispatchEvent(event);
        }
        return this;
    }

    /**
     * Listen to custom event from component
     */
    on(eventName, handler) {
        if (this.element) {
            this.addEventListener(this.element, `component:${eventName}`, handler);
        }
        return this;
    }

    /**
     * Remove listen to custom event
     */
    off(eventName, handler) {
        if (this.element) {
            this.removeEventListener(this.element, `component:${eventName}`, handler);
        }
        return this;
    }

    /**
     * Check if the component is visible
     */
    isVisible() {
        if (!this.element) return false;
        const rect = this.element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    }

    /**
     * Destroy the component and clear resources
     */
    destroy() {
        if (this.isDestroyed) return this;

        this.beforeDestroy();

        // Destroy child components
        this.children.forEach(child => {
            if (typeof child.destroy === 'function') {
                child.destroy();
            }
        });
        this.children.clear();

        // Remove event listeners
        this.eventListeners.forEach(({ element, event, handler, options }) => {
            element.removeEventListener(event, handler, options);
        });
        this.eventListeners = [];

        // Clear element
        if (this.element) {
            this.element.innerHTML = '';
        }

        this.afterDestroy();
        this.emit('destroyed');

        this.isDestroyed = true;
        this.isInitialized = false;

        return this;
    }

    /**
     * Utility for debounce of functions
     */
    debounce(func, wait, immediate = false) {
        let timeout;
        return (...args) => {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }

    /**
     * Utility for throttle of functions
     */
    throttle(func, limit) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    /**
     * Simple fade in animation
     */
    fadeIn(duration = 300) {
        if (!this.element) return Promise.resolve();

        return new Promise(resolve => {
            this.element.style.opacity = '0';
            this.element.style.transition = `opacity ${duration}ms ease`;

            requestAnimationFrame(() => {
                this.element.style.opacity = '1';
                setTimeout(resolve, duration);
            });
        });
    }

    /**
     * Simple fade out animation
     */
    fadeOut(duration = 300) {
        if (!this.element) return Promise.resolve();

        return new Promise(resolve => {
            this.element.style.opacity = '1';
            this.element.style.transition = `opacity ${duration}ms ease`;

            requestAnimationFrame(() => {
                this.element.style.opacity = '0';
                setTimeout(resolve, duration);
            });
        });
    }
}

/**
 * Factory to create components
 */
class ComponentFactory {
    static components = new Map();

    static register(name, ComponentClass) {
        this.components.set(name, ComponentClass);
    }

    static create(name, element, options = {}) {
        const ComponentClass = this.components.get(name);
        if (!ComponentClass) {
            throw new Error(`Componente "${name}" não encontrado`);
        }
        return new ComponentClass(element, options).init();
    }

    static createFromElement(element) {
        const componentName = element.dataset.component;
        if (!componentName) return null;

        const options = element.dataset.options ? JSON.parse(element.dataset.options) : {};

        return this.create(componentName, element, options);
    }

    static autoInit(container = document) {
        const elements = container.querySelectorAll('[data-component]');
        const components = [];

        elements.forEach(element => {
            const component = this.createFromElement(element);
            if (component) {
                components.push(component);
            }
        });

        return components;
    }
}

// Export for global use
window.BaseComponent = BaseComponent;
window.ComponentFactory = ComponentFactory;
