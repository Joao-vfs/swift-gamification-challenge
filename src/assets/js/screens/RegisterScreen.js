import { Toast } from '../utils/Toast.js';
import { userManager } from '../utils/UserManager.js';
import { CommonUtils } from '../utils/CommonUtils.js';
import { FormUtils } from '../utils/FormUtils.js';

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
     * @returns {string} HTML of the screen
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
     * Render register logo
     * @returns {string} HTML of the logo
     */
    renderLogo() {
        return `
            <img src="assets/images/Swift 2.svg" alt="Swift Logo" class="auth-logo" onclick="window.router.navigate('home')" />
        `;
    }

    /**
     * Render main card
     * @returns {string} HTML of the card
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
     * Render register form
     * @returns {string} HTML of the form
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
                ${this.renderPasswordField(
                    'confirmSenha',
                    'Confirmar senha',
                    'Digite a senha novamente',
                    'showConfirmPassword'
                )}

                ${errors.general ? `<div class="form-error general-error">${errors.general}</div>` : ''}

                <button type="submit" class="btn-auth" ${this.state.isLoading ? 'disabled' : ''}>
                    ${this.state.isLoading ? 'Cadastrando...' : 'Cadastrar'}
                </button>

               ${this.renderLinkLogin()}
            </form>
        `;
    }

    /**
     * Render input field using FormUtils
     * @param {string} name - Name of the field
     * @param {string} label - Label of the field
     * @param {string} type - Type of the input
     * @param {string} placeholder - Placeholder
     * @param {number} maxlength - Maximum length
     * @returns {string} HTML of the field
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
     * Render password field using FormUtils
     * @param {string} name - Name of the field
     * @param {string} label - Label of the field
     * @param {string} placeholder - Placeholder
     * @param {string} showPasswordKey - Key of the state to show password
     * @returns {string} HTML of the password field
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
     * Render link to login using FormUtils
     * @returns {string} HTML of the link
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
     * Update field in state using CommonUtils for formatting
     * @param {HTMLInputElement} element - The input element that was changed
     */
    updateField(element) {
        const { name, value } = element;
        let processedValue = value;

        // Format CPF using CommonUtils
        if (name === 'cpf') {
            processedValue = CommonUtils.formatCPF(value);
        }

        this.state.formData[name] = processedValue;
        element.value = processedValue;
    }

    /**
     * Toggle password visibility (handled by FormUtils)
     * @param {string} showPasswordKey - Key of the state to control visibility
     */
    togglePasswordVisibility(showPasswordKey) {
        this.state[showPasswordKey] = !this.state[showPasswordKey];
        // FormUtils handles the actual DOM updates
    }

    /**
     * Validate form data
     * @param {FormData} formData - Data of the form
     * @returns {boolean} If the data is valid
     */
    validateForm(formData) {
        const errors = {};

        const codigoLoja = formData.get('codigoLoja');
        const codigoFuncionario = formData.get('codigoFuncionario');
        const nome = formData.get('nome');
        const cpf = formData.get('cpf');
        const senha = formData.get('senha');
        const confirmSenha = formData.get('confirmSenha');

        if (!codigoLoja) errors.codigoLoja = 'Código da loja é obrigatório';
        if (!codigoFuncionario) errors.codigoFuncionario = 'Código de funcionário é obrigatório';
        if (!nome) errors.nome = 'Nome completo é obrigatório';
        if (!cpf) errors.cpf = 'CPF é obrigatório';
        if (!senha) errors.senha = 'Senha é obrigatória';
        if (!confirmSenha) errors.confirmSenha = 'Confirmação de senha é obrigatória';

        if (nome && nome.length < 2) {
            errors.nome = 'Nome deve ter pelo menos 2 caracteres';
        }

        if (cpf && cpf.replace(/\D/g, '').length !== 11) {
            errors.cpf = 'CPF deve ter 11 dígitos';
        }

        if (senha && senha.length < 6) {
            errors.senha = 'Senha deve ter pelo menos 6 caracteres';
        }

        if (senha && confirmSenha && senha !== confirmSenha) {
            errors.confirmSenha = 'As senhas não coincidem';
        }

        this.state.errors = errors;
        return Object.keys(errors).length === 0;
    }

    /**
     * Process register
     * @param {FormData} formData - Data of the form
     */
    async processRegister(formData) {
        if (this.state.isLoading) return;

        if (!this.validateForm(formData)) {
            this.renderErrors();
            return;
        }

        this.state.isLoading = true;
        this.state.errors = {};
        this.updateSubmitButton();

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const userData = {
                codigoLoja: formData.get('codigoLoja'),
                codigoFuncionario: formData.get('codigoFuncionario'),
                nome: formData.get('nome'),
                cpf: formData.get('cpf'),
                senha: formData.get('senha')
            };

            const newUser = userManager.registerUser(userData);

            Toast.success(`Cadastro realizado com sucesso! Bem-vindo, ${newUser.name}! Faça login para continuar.`);

            setTimeout(() => {
                this.router.navigate('login');
            }, 2000);
        } catch (error) {
            this.state.errors.general = error.message;
            this.renderErrors();
            Toast.error(error.message);
        } finally {
            this.state.isLoading = false;
            this.updateSubmitButton();
        }
    }

    /**
     * Render errors in the form
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
     * Update submit button using FormUtils
     */
    updateSubmitButton() {
        const button = document.querySelector('.btn-auth');
        FormUtils.updateButtonState(button, this.state.isLoading, 'Cadastrando...', 'Cadastrar');
    }

    // Removed duplicate utility functions - now using CommonUtils

    /**
     * Setup events of the screen
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

        // Setup form inputs using FormUtils
        FormUtils.setupFormInputs(this, this.updateField);

        // Setup password toggles using FormUtils
        FormUtils.setupPasswordToggle(this.state, 'senha', 'showPassword');
        FormUtils.setupPasswordToggle(this.state, 'confirmSenha', 'showConfirmPassword');

        // Setup viewport listeners using CommonUtils
        CommonUtils.setupViewportListeners();
    }
}
