/**
 * Common utilities for form handling, viewport management and device detection
 */
export class CommonUtils {
    /**
     * Format CPF with mask XXX.XXX.XXX-XX
     * @param {string} cpf - CPF string to format
     * @returns {string} Formatted CPF
     */
    static formatCPF(cpf) {
        if (!cpf) return '';
        
        // Remove all non-numeric characters
        let cleaned = cpf.replace(/\D/g, '');
        
        // Limit to 11 digits
        cleaned = cleaned.substring(0, 11);
        
        // Apply formatting
        cleaned = cleaned.replace(/(\d{3})(\d)/, '$1.$2');
        cleaned = cleaned.replace(/(\d{3})(\d)/, '$1.$2');
        cleaned = cleaned.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        
        return cleaned;
    }

    /**
     * Mask CPF showing only first 3 and last 2 digits
     * Example: 123.456.789-01 becomes 123.***.***-01
     * @param {string} cpf - CPF string to mask
     * @returns {string} Masked CPF
     */
    static maskCPF(cpf) {
        if (!cpf) return '';
        
        // Remove all non-numeric characters
        const cleaned = cpf.replace(/\D/g, '');
        
        // Need at least 5 digits to show first 3 and last 2
        if (cleaned.length < 5) return cpf;
        
        // Get first 3 and last 2 digits
        const firstThree = cleaned.substring(0, 3);
        const lastTwo = cleaned.substring(cleaned.length - 2);
        
        // Format: 123.***.***-01
        return `${firstThree}.***.***-${lastTwo}`;
    }

    /**
     * Format number with thousands separator (Brazilian format)
     * @param {number} number - Number to format
     * @returns {string} Formatted number
     */
    static formatNumber(number) {
        return new Intl.NumberFormat('pt-BR').format(number);
    }

    /**
     * Format points for display
     * @param {number} points - Points to format
     * @returns {string} Formatted points with "pts" suffix
     */
    static formatPoints(points) {
        return `${this.formatNumber(points)} pts`;
    }

    /**
     * Capitalize first letter of each word
     * @param {string} str - String to capitalize
     * @returns {string} Capitalized string
     */
    static capitalize(str) {
        if (!str) return '';
        return str.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }

    /**
     * Detect if device has touch capabilities
     * @returns {boolean} True if touch device
     */
    static isTouchDevice() {
        return 'ontouchstart' in window || 
               navigator.maxTouchPoints > 0 || 
               navigator.msMaxTouchPoints > 0;
    }

    /**
     * Get current viewport information
     * @returns {Object} Viewport data
     */
    static getViewportInfo() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            aspectRatio: window.innerWidth / window.innerHeight,
            isLandscape: window.innerWidth > window.innerHeight,
            devicePixelRatio: window.devicePixelRatio || 1
        };
    }

    /**
     * Handle viewport changes for responsive behavior
     * @param {Function} callback - Optional callback to execute after viewport change
     */
    static handleViewportChange(callback = null) {
        const viewport = CommonUtils.getViewportInfo();

        // Adjust minimum height on small mobile devices
        if (viewport.width <= 479 && viewport.height <= 600) {
            document.documentElement.style.setProperty('--viewport-height', `${viewport.height}px`);
        }

        // Optimize layout for ultra-wide screens
        if (viewport.aspectRatio > 2.3) {
            document.body.classList.add('ultra-wide');
        } else {
            document.body.classList.remove('ultra-wide');
        }

        // Execute callback if provided
        if (callback && typeof callback === 'function') {
            callback(viewport);
        }
    }

    /**
     * Handle orientation changes with delay for proper measurement
     * @param {Function} callback - Optional callback to execute after orientation change
     */
    static handleOrientationChange(callback = null) {
        // Wait for the orientation change to complete
        setTimeout(() => {
            CommonUtils.handleViewportChange(callback);

            // Reposition focused elements if necessary
            const activeElement = document.activeElement;
            if (activeElement && activeElement.classList.contains('form-input')) {
                activeElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 100);
    }

    /**
     * Setup viewport event listeners
     * @param {Function} viewportCallback - Callback for viewport changes
     * @param {Function} orientationCallback - Callback for orientation changes
     */
    static setupViewportListeners(viewportCallback = null, orientationCallback = null) {
        window.addEventListener('resize', () => {
            CommonUtils.handleViewportChange(viewportCallback);
        });

        window.addEventListener('orientationchange', () => {
            CommonUtils.handleOrientationChange(orientationCallback);
        });

        // Initial call
        CommonUtils.handleViewportChange(viewportCallback);
    }

    /**
     * Setup touch-friendly focus behavior for form inputs
     * @param {NodeList|Array} inputs - Input elements to enhance
     */
    static setupTouchFriendlyInputs(inputs) {
        if (!CommonUtils.isTouchDevice()) return;

        inputs.forEach(input => {
            input.addEventListener('focus', (e) => {
                // Smooth scroll to focused field on mobile devices
                if (window.innerWidth <= 767) {
                    setTimeout(() => {
                        e.target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }, 300);
                }
            });
        });
    }

    /**
     * Generate unique ID with prefix
     * @param {string} prefix - Prefix for the ID
     * @returns {string} Unique ID
     */
    static generateId(prefix = 'id') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @param {boolean} immediate - Execute immediately
     * @returns {Function} Debounced function
     */
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    /**
     * Validate CPF format and digits
     * @param {string} cpf - CPF to validate
     * @returns {boolean} True if valid CPF
     */
    static isValidCPF(cpf) {
        if (!cpf) return false;
        
        const cleanCPF = cpf.replace(/\D/g, '');
        
        // Check if has 11 digits
        if (cleanCPF.length !== 11) return false;
        
        // Check if all digits are the same
        if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
        
        return true; // For demo purposes, we skip full CPF algorithm validation
    }

    /**
     * Validate required fields in a form
     * @param {FormData} formData - Form data to validate
     * @param {Array} requiredFields - Array of required field names
     * @returns {Object} Validation result with errors object
     */
    static validateRequiredFields(formData, requiredFields) {
        const errors = {};
        
        requiredFields.forEach(field => {
            const value = formData.get(field);
            if (!value || value.trim() === '') {
                errors[field] = `${field} is required`;
            }
        });
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}
