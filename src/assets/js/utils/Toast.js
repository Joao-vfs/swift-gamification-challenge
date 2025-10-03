export class Toast {
    static instance = null;
    static toasts = [];
    static container = null;

    /**
     * Initialize toast system
     */
    static init() {
        if (!Toast.container) {
            Toast.createContainer();
        }
    }

    /**
     * Create container of toasts
     */
    static createContainer() {
        Toast.container = document.createElement('div');
        Toast.container.className = 'toast-container';
        Toast.container.id = 'toast-container';
        document.body.appendChild(Toast.container);
    }

    /**
     * Show success toast
     * @param {string} message - Message of the toast
     * @param {number} duration - Duration in milliseconds
     */
    static success(message, duration = 4000) {
        Toast.show(message, 'success', duration);
    }

    /**
     * Show error toast
     * @param {string} message - Message of the toast
     * @param {number} duration - Duration in milliseconds
     */
    static error(message, duration = 5000) {
        Toast.show(message, 'error', duration);
    }

    /**
     * Show info toast
     * @param {string} message - Message of the toast
     * @param {number} duration - Duration in milliseconds
     */
    static info(message, duration = 4000) {
        Toast.show(message, 'info', duration);
    }

    /**
     * Show warning toast
     * @param {string} message - Message of the toast
     * @param {number} duration - Duration in milliseconds
     */
    static warning(message, duration = 4000) {
        Toast.show(message, 'warning', duration);
    }

    /**
     * Show toast
     * @param {string} message - Message of the toast
     * @param {string} type - Type of the toast (success, error, info, warning)
     * @param {number} duration - Duration in milliseconds
     */
    static show(message, type = 'info', duration = 4000) {
        Toast.init();

        const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const toast = Toast.createElement(toastId, message, type);

        Toast.toasts.push({
            id: toastId,
            element: toast,
            timer: null
        });

        Toast.container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-show');
        }, 10);

        const toastData = Toast.toasts.find(t => t.id === toastId);
        if (toastData) {
            toastData.timer = setTimeout(() => {
                Toast.hide(toastId);
            }, duration);
        }

        Toast.limitToasts();
    }

    /**
     * Create toast element
     * @param {string} id - Unique ID of the toast
     * @param {string} message - Message of the toast
     * @param {string} type - Type of the toast
     * @returns {HTMLElement} Element of the toast
     */
    static createElement(id, message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.id = id;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');

        const icon = Toast.getIcon(type);
        const closeButton = Toast.createCloseButton(id);

        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">
                    ${icon}
                </div>
                <div class="toast-message">
                    ${message}
                </div>
                ${closeButton}
            </div>
            <div class="toast-progress"></div>
        `;

        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                Toast.hide(id);
            });
        }

        toast.addEventListener('mouseenter', () => {
            Toast.pauseTimer(id);
        });

        toast.addEventListener('mouseleave', () => {
            Toast.resumeTimer(id);
        });

        return toast;
    }

    /**
     * Get icon based on type
     * @param {string} type - Type of the toast
     * @returns {string} HTML of the icon
     */
    static getIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };
        return icons[type] || icons.info;
    }

    /**
     * Create close button
     * @param {string} id - ID of the toast
     * @returns {string} HTML of the button
     */
    static createCloseButton(id) {
        return `
            <button class="toast-close" aria-label="Fechar notificação">
                <i class="fas fa-times"></i>
            </button>
        `;
    }

    /**
     * Hide toast
     * @param {string} id - ID of the toast
     */
    static hide(id) {
        const toastData = Toast.toasts.find(t => t.id === id);
        if (!toastData) return;

        if (toastData.timer) {
            clearTimeout(toastData.timer);
        }

        toastData.element.classList.add('toast-hide');

        setTimeout(() => {
            if (toastData.element.parentNode) {
                toastData.element.parentNode.removeChild(toastData.element);
            }
            Toast.toasts = Toast.toasts.filter(t => t.id !== id);
        }, 300);
    }

    /**
     * Pause timer of the toast
     * @param {string} id - ID of the toast
     */
    static pauseTimer(id) {
        const toastData = Toast.toasts.find(t => t.id === id);
        if (toastData && toastData.timer) {
            clearTimeout(toastData.timer);
            toastData.timer = null;
        }
    }

    /**
     * Resume timer of the toast
     * @param {string} id - ID of the toast
     */
    static resumeTimer(id) {
        const toastData = Toast.toasts.find(t => t.id === id);
        if (toastData && !toastData.timer) {
            toastData.timer = setTimeout(() => {
                Toast.hide(id);
            }, 2000);
        }
    }

    /**
     * Limit number of visible toasts
     */
    static limitToasts() {
        const maxToasts = 5;
        while (Toast.toasts.length > maxToasts) {
            const oldestToast = Toast.toasts[0];
            Toast.hide(oldestToast.id);
        }
    }

    /**
     * Clear all toasts
     */
    static clear() {
        Toast.toasts.forEach(toast => {
            Toast.hide(toast.id);
        });
    }

    /**
     * Check if there are active toasts
     * @returns {boolean} If there are active toasts
     */
    static hasActiveToasts() {
        return Toast.toasts.length > 0;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        Toast.init();
    });
} else {
    Toast.init();
}
