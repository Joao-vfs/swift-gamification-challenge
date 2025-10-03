import { Toast } from '../utils/Toast.js';
import { userManager } from '../utils/UserManager.js';
import { CommonUtils } from '../utils/CommonUtils.js';
import { FormUtils } from '../utils/FormUtils.js';

/**
 * RegisterScreen - User registration view
 * Handles new user registration with validation
 */
export class RegisterScreen {
    constructor(router) {
        this.router = router;
        this.state = {
            formData: {
                codigoLoja: '',
                codigoFuncionario: '',
                nome: '',
                cpf: '',
                senha: '',
                confirmSenha: ''
            },
            isLoading: false,
            showPassword: false,
            showConfirmPassword: false,
            errors: {}
        };
    }

    /**
     * Render register screen
     * @returns {string} Register screen HTML
     */
    render() {
        return `
            <div class="auth-container">
                <main class="auth-content">
                    ${this.renderLogo()}
                    ${this.renderCard()}
                </main>
            </div>
        `;
    }

    /**
     * Render logo section
     * @returns {string} Logo HTML
     */
    renderLogo() {
        return `
            <img src="assets/images/Swift 2.svg" alt="Swift Logo" class="auth-logo" onclick="window.router.navigate('home')" />
        `;
    }

    /**
     * Render main card container
     * @returns {string} Card HTML
     */
    renderCard() {
        return `
            <div class="auth-card">
                <img src="assets/images/Vector 5.png" class="auth-vector-1" alt=""/>
                ${this.renderForm()}
                <img src="assets/images/Vector 5.png" class="auth-vector-2" alt=""/>
            </div>
        `;
    }

    /**
     * Render registration form
     * @returns {string} Form HTML
     */
    renderForm() {
        const { errors } = this.state;
        return `
            <form id="registerForm" class="auth-form" novalidate>
                <div class="auth-card-header">
                    <h1 class="auth-title">Cadastre<strong class="auth-title-strong">-se</strong></h1>
                </div>

                ${this.renderInputField('codigoLoja', 'Código da loja', 'text', 'Insira o código da sua loja')}
                ${this.renderInputField('codigoFuncionario', 'Código de funcionário', 'text', 'Insira o seu código')}
                ${this.renderInputField('nome', 'Nome completo', 'text', 'Digite seu nome completo')}
                ${this.renderInputField('cpf', 'CPF', 'text', 'Insira o seu CPF', 14)}
                ${this.renderPasswordField('senha', 'Senha', 'Crie uma senha forte', 'showPassword')}
                ${this.renderPasswordField('confirmSenha', 'Confirmar senha', 'Digite a senha novamente', 'showConfirmPassword')}

                ${errors.general ? `<div class="form-error general-error">${errors.general}</div>` : ''}

                <button type="submit" class="btn-auth" ${this.state.isLoading ? 'disabled' : ''}>
                    ${this.state.isLoading ? 'Cadastrando...' : 'Cadastrar'}
                </button>

               ${this.renderLinkLogin()}
            </form>
        `;
    }

    /**
     * Render text input field
     * @param {string} name - Field name
     * @param {string} label - Field label
     * @param {string} type - Input type
     * @param {string} placeholder - Placeholder text
     * @param {number} maxlength - Maximum length
     * @returns {string} Input field HTML
     */
    renderInputField(name, label, type, placeholder, maxlength = '') {
        const value = this.state.formData[name] || '';
        return FormUtils.createTextField({
            name,
            label,
            type,
            placeholder,
            value,
            maxlength,
            required: true,
            disabled: this.state.isLoading
        });
    }

    /**
     * Render password field with toggle visibility
     * @param {string} name - Field name
     * @param {string} label - Field label
     * @param {string} placeholder - Placeholder text
     * @param {string} showPasswordKey - State key for password visibility
     * @returns {string} Password field HTML
     */
    renderPasswordField(name, label, placeholder, showPasswordKey) {
        const value = this.state.formData[name] || '';
        return FormUtils.createPasswordField({
            name,
            label,
            placeholder,
            value,
            showPassword: this.state[showPasswordKey],
            required: true,
            disabled: this.state.isLoading
        });
    }

    /**
     * Render navigation link to login page
     * @returns {string} Nav link HTML
     */
    renderLinkLogin() {
        return FormUtils.createNavLink({
            text: 'Já tem uma conta?',
            linkText: 'Faça login aqui',
            route: 'login',
            router: this.router
        });
    }

    /**
     * Update form field value in state
     * @param {HTMLInputElement} element - Input element that changed
     */
    updateField(element) {
        const { name, value } = element;
        let processedValue = value;

        // Apply CPF formatting
        if (name === 'cpf') {
            processedValue = CommonUtils.formatCPF(value);
        }

        this.state.formData[name] = processedValue;
        element.value = processedValue;
    }

    /**
     * Validate registration form data
     * @param {FormData} formData - Form data to validate
     * @returns {boolean} True if form is valid
     */
    validateForm(formData) {
        const errors = {};

        const codigoLoja = formData.get('codigoLoja')?.trim();
        const codigoFuncionario = formData.get('codigoFuncionario')?.trim();
        const nome = formData.get('nome')?.trim();
        const cpf = formData.get('cpf')?.trim();
        const senha = formData.get('senha');
        const confirmSenha = formData.get('confirmSenha');

        // Required field validation
        if (!codigoLoja) {
            errors.codigoLoja = 'Código da loja é obrigatório';
        }
        
        if (!codigoFuncionario) {
            errors.codigoFuncionario = 'Código de funcionário é obrigatório';
        }
        
        if (!nome) {
            errors.nome = 'Nome completo é obrigatório';
        } else if (nome.length < 2) {
            errors.nome = 'Nome deve ter pelo menos 2 caracteres';
        }

        // CPF validation
        if (!cpf) {
            errors.cpf = 'CPF é obrigatório';
        } else if (cpf.replace(/\D/g, '').length !== 11) {
            errors.cpf = 'CPF deve ter 11 dígitos';
        }

        // Password validation
        if (!senha) {
            errors.senha = 'Senha é obrigatória';
        } else if (senha.length < 6) {
            errors.senha = 'Senha deve ter pelo menos 6 caracteres';
        }

        // Password confirmation validation
        if (!confirmSenha) {
            errors.confirmSenha = 'Confirmação de senha é obrigatória';
        } else if (senha && confirmSenha && senha !== confirmSenha) {
            errors.confirmSenha = 'As senhas não coincidem';
        }

        this.state.errors = errors;
        
        // Show first error in toast for immediate feedback
        if (Object.keys(errors).length > 0) {
            const firstError = Object.values(errors)[0];
            Toast.warning(firstError);
        }
        
        return Object.keys(errors).length === 0;
    }

    /**
     * Process registration form submission
     * @param {FormData} formData - Form data
     */
    async processRegister(formData) {
        if (this.state.isLoading) return;

        // Clear previous errors
        this.state.errors = {};

        if (!this.validateForm(formData)) {
            this.renderErrors();
            return;
        }

        this.state.isLoading = true;
        this.updateSubmitButton();

        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const userData = {
                codigoLoja: formData.get('codigoLoja')?.trim(),
                codigoFuncionario: formData.get('codigoFuncionario')?.trim(),
                nome: formData.get('nome')?.trim(),
                cpf: formData.get('cpf')?.trim(),
                senha: formData.get('senha')
            };

            const newUser = userManager.registerUser(userData);

            Toast.success(`✅ Cadastro realizado com sucesso! Bem-vindo, ${newUser.name}! Redirecionando para o login...`);

            // Navigate to login after success
            setTimeout(() => {
                this.router.navigate('login');
            }, 2000);
        } catch (error) {
            Toast.error('Erro ao cadastrar usuário');
            this.state.errors.general = error.message;
            this.renderErrors();
            Toast.error(`❌ ${error.message}`);
        } finally {
            this.state.isLoading = false;
            this.updateSubmitButton();
        }
    }

    /**
     * Render validation errors in the form
     */
    renderErrors() {
        Object.keys(this.state.errors).forEach(fieldName => {
            const errorElement = document.querySelector(`input[name="${fieldName}"] + .form-error`);
            if (errorElement) {
                errorElement.textContent = this.state.errors[fieldName];
                errorElement.style.display = 'block';
            }
        });

        const generalError = document.querySelector('.general-error');
        if (generalError && this.state.errors.general) {
            generalError.textContent = this.state.errors.general;
            generalError.style.display = 'block';
        }
    }

    /**
     * Update submit button loading state
     */
    updateSubmitButton() {
        const button = document.querySelector('.btn-auth');
        FormUtils.updateButtonState(button, this.state.isLoading, 'Cadastrando...', 'Cadastrar');
    }

    /**
     * Setup event listeners for the register screen
     */
    setupEvents() {
        const form = document.getElementById('registerForm');
        if (form) {
            form.addEventListener('submit', e => {
                e.preventDefault();
                const formData = new FormData(form);
                this.processRegister(formData);
            });
        }

        // Setup form input handlers
        FormUtils.setupFormInputs(this, this.updateField);

        // Setup password visibility toggles
        FormUtils.setupPasswordToggle(this.state, 'senha', 'showPassword');
        FormUtils.setupPasswordToggle(this.state, 'confirmSenha', 'showConfirmPassword');

        // Setup viewport listeners for responsive behavior
        CommonUtils.setupViewportListeners();
    }
}
