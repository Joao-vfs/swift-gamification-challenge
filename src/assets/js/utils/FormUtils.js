import { CommonUtils } from './CommonUtils.js';
import { Toast } from './Toast.js';

/**
 * Form utilities for authentication screens and general form handling
 */
export class FormUtils {
    /**
     * Create a text input field with standard styling
     * @param {Object} config - Field configuration
     * @returns {string} HTML for the input field
     */
    static createTextField(config) {
        const {
            name,
            label,
            type = 'text',
            placeholder = '',
            value = '',
            maxlength = '',
            required = false,
            disabled = false
        } = config;

        const maxlengthAttr = maxlength ? `maxlength="${maxlength}"` : '';
        const requiredAttr = required ? 'required' : '';
        const disabledAttr = disabled ? 'disabled' : '';

        return `
            <div class="form-group">
                <label for="${name}" class="form-label">${label}</label>
                <input
                    type="${type}" 
                    id="${name}" 
                    name="${name}"
                    class="form-input" 
                    placeholder="${placeholder}"
                    value="${value}"
                    ${requiredAttr}
                    ${maxlengthAttr}
                    ${disabledAttr}
                />
            </div>
        `;
    }

    /**
     * Create a password input field with toggle visibility
     * @param {Object} config - Field configuration
     * @returns {string} HTML for the password field
     */
    static createPasswordField(config) {
        const {
            name,
            label,
            placeholder = '',
            value = '',
            showPassword = false,
            required = false,
            disabled = false
        } = config;

        const requiredAttr = required ? 'required' : '';
        const disabledAttr = disabled ? 'disabled' : '';

        return `
            <div class="form-group">
                <label for="${name}" class="form-label">${label}</label>
                <div class="password-input-container">
                    <input
                        type="${showPassword ? 'text' : 'password'}"
                        id="${name}" 
                        name="${name}" 
                        class="form-input"
                        placeholder="${placeholder}" 
                        value="${value}"
                        ${requiredAttr}
                        ${disabledAttr}
                    />
                    <button type="button" class="password-toggle" data-field="${name}">
                        <i class="fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}"></i>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Setup password toggle functionality for password fields
     * @param {Object} state - Component state object
     * @param {string} passwordField - Name of the password field
     * @param {string} stateKey - Key in state object for visibility toggle
     */
    static setupPasswordToggle(state, passwordField, stateKey) {
        const toggleButton = document.querySelector(`.password-toggle[data-field="${passwordField}"]`);
        const passwordInput = document.getElementById(passwordField);
        
        if (!toggleButton || !passwordInput) return;

        toggleButton.addEventListener('click', () => {
            state[stateKey] = !state[stateKey];
            passwordInput.type = state[stateKey] ? 'text' : 'password';
            
            const icon = toggleButton.querySelector('i');
            if (icon) {
                icon.className = `fas ${state[stateKey] ? 'fa-eye-slash' : 'fa-eye'}`;
            }
        });
    }

    /**
     * Setup form input event listeners with common behaviors
     * @param {Object} context - Component context (this)
     * @param {Function} updateFieldCallback - Callback for field updates
     */
    static setupFormInputs(context, updateFieldCallback) {
        const inputs = document.querySelectorAll('.form-input');
        
        inputs.forEach(input => {
            // Setup input change handler
            input.addEventListener('input', (e) => {
                if (updateFieldCallback) {
                    updateFieldCallback.call(context, e.target);
                }
            });
        });

        // Setup touch-friendly behavior
        CommonUtils.setupTouchFriendlyInputs(inputs);
    }

    /**
     * Create and handle CPF input field with automatic formatting
     * @param {Object} config - Field configuration
     * @returns {string} HTML for CPF field
     */
    static createCPFField(config) {
        const {
            name = 'cpf',
            label = 'CPF',
            placeholder = '000.000.000-00',
            value = '',
            required = true,
            disabled = false
        } = config;

        return FormUtils.createTextField({
            name,
            label,
            type: 'text',
            placeholder,
            value,
            maxlength: 14,
            required,
            disabled
        });
    }

    /**
     * Update button state during loading
     * @param {HTMLElement} button - Button element
     * @param {boolean} isLoading - Loading state
     * @param {string} loadingText - Text to show during loading
     * @param {string} normalText - Normal button text
     */
    static updateButtonState(button, isLoading, loadingText = 'Loading...', normalText = 'Submit') {
        if (!button) return;
        
        button.disabled = isLoading;
        button.textContent = isLoading ? loadingText : normalText;
        
        // Add/remove loading class for styling
        if (isLoading) {
            button.classList.add('loading');
        } else {
            button.classList.remove('loading');
        }
    }

    /**
     * Show validation errors in form
     * @param {Object} errors - Object with field names as keys and error messages as values
     */
    static showValidationErrors(errors) {
        // Clear previous errors
        document.querySelectorAll('.form-error').forEach(error => {
            error.style.display = 'none';
            error.textContent = '';
        });

        // Show new errors
        Object.keys(errors).forEach(fieldName => {
            const field = document.querySelector(`[name="${fieldName}"]`);
            if (field) {
                let errorElement = field.parentNode.querySelector('.form-error');
                
                if (!errorElement) {
                    errorElement = document.createElement('div');
                    errorElement.className = 'form-error';
                    field.parentNode.appendChild(errorElement);
                }
                
                errorElement.textContent = errors[fieldName];
                errorElement.style.display = 'block';
                
                // Add error styling to field
                field.classList.add('error');
            }
        });

        // Show general error if exists
        if (errors.general) {
            let generalError = document.querySelector('.general-error');
            if (!generalError) {
                const form = document.querySelector('.auth-form');
                if (form) {
                    generalError = document.createElement('div');
                    generalError.className = 'form-error general-error';
                    form.appendChild(generalError);
                }
            }
            
            if (generalError) {
                generalError.textContent = errors.general;
                generalError.style.display = 'block';
            }
        }
    }

    /**
     * Clear all form errors
     */
    static clearFormErrors() {
        document.querySelectorAll('.form-error').forEach(error => {
            error.style.display = 'none';
            error.textContent = '';
        });

        document.querySelectorAll('.form-input.error').forEach(field => {
            field.classList.remove('error');
        });
    }

    /**
     * Validate authentication form data
     * @param {FormData} formData - Form data to validate
     * @param {Object} config - Validation configuration
     * @returns {Object} Validation result
     */
    static validateAuthForm(formData, config = {}) {
        const {
            requireName = false,
            requirePasswordConfirm = false,
            minPasswordLength = 6
        } = config;

        const errors = {};

        const codigoLoja = formData.get('codigoLoja');
        const codigoFuncionario = formData.get('codigoFuncionario');
        const cpf = formData.get('cpf');
        const senha = formData.get('senha');
        const nome = formData.get('nome');
        const confirmSenha = formData.get('confirmSenha');

        // Required field validation
        if (!codigoLoja) errors.codigoLoja = 'Store code is required';
        if (!codigoFuncionario) errors.codigoFuncionario = 'Employee code is required';
        if (!cpf) errors.cpf = 'CPF is required';
        if (!senha) errors.senha = 'Password is required';

        // Conditional validations
        if (requireName && !nome) {
            errors.nome = 'Full name is required';
        }

        if (requirePasswordConfirm && !confirmSenha) {
            errors.confirmSenha = 'Password confirmation is required';
        }

        // Format validations
        if (nome && nome.length < 2) {
            errors.nome = 'Name must have at least 2 characters';
        }

        if (cpf && !CommonUtils.isValidCPF(cpf)) {
            errors.cpf = 'Please enter a valid CPF';
        }

        if (senha && senha.length < minPasswordLength) {
            errors.senha = `Password must have at least ${minPasswordLength} characters`;
        }

        if (requirePasswordConfirm && senha && confirmSenha && senha !== confirmSenha) {
            errors.confirmSenha = 'Passwords do not match';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Process form submission with loading state and error handling
     * @param {Object} context - Component context
     * @param {FormData} formData - Form data
     * @param {Function} submitHandler - Function to handle actual submission
     * @param {Object} config - Configuration options
     */
    static async processFormSubmission(context, formData, submitHandler, config = {}) {
        const {
            loadingStateKey = 'isLoading',
            buttonSelector = '.btn-auth',
            loadingText = 'Processing...',
            normalText = 'Submit'
        } = config;

        if (context.state[loadingStateKey]) return;

        context.state[loadingStateKey] = true;
        
        const button = document.querySelector(buttonSelector);
        FormUtils.updateButtonState(button, true, loadingText, normalText);

        try {
            await submitHandler(formData);
        } catch (error) {
            if (error.message) {
                Toast.error(error.message);
            }
            throw error;
        } finally {
            context.state[loadingStateKey] = false;
            FormUtils.updateButtonState(button, false, loadingText, normalText);
        }
    }

    /**
     * Create navigation link with event handling
     * @param {Object} config - Link configuration
     * @returns {string} HTML for the navigation link
     */
    static createNavLink(config) {
        const {
            text,
            linkText,
            route,
            router,
            id = CommonUtils.generateId('nav-link')
        } = config;

        // Setup click handler
        setTimeout(() => {
            const linkElement = document.getElementById(id);
            if (linkElement && router) {
                linkElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    router.navigate(route);
                });
            }
        }, 0);

        return `
            <div class="auth-link-container">
                <span class="auth-link-text">${text}</span>
                <a class="auth-link" id="${id}">${linkText}</a>
            </div>
        `;
    }
}
