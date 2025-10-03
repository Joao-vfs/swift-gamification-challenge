import { Toast } from '../utils/Toast.js';
import { userManager } from '../utils/UserManager.js';
import { CommonUtils } from '../utils/CommonUtils.js';
import { FormUtils } from '../utils/FormUtils.js';

/**
 * LoginScreen - User authentication view
 * Handles user login with validation and session management
 */
export class LoginScreen {
    constructor(router) {
        const defaultUser = userManager.getDefaultUserInfo();
        this.REMEMBER_USER_KEY = 'swift_remember_user';
        this.router = router;
        this.state = {
            formData: {
                codigoLoja: defaultUser.codigoLoja,
                codigoFuncionario: defaultUser.codigoFuncionario,
                cpf: defaultUser.cpf,
                senha: 'johndoe'
            },
            rememberMe: false,
            isLoading: false,
            showPassword: false
        };
    }

    /**
     * Render login screen
     * @returns {string} Login screen HTML
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
     * Render login form
     * @returns {string} Form HTML
     */
    renderForm() {
        return `
            <form id="loginForm" class="auth-form" novalidate>
                <div class="auth-card-header">
                    <h1 class="auth-title">Log<strong class="auth-title-strong">-in</strong></h1>
                </div>

                ${this.renderInputField('codigoLoja', 'Código da loja', 'text', 'Insira o código da sua loja')}
                ${this.renderInputField('codigoFuncionario', 'Código de funcionário', 'text', 'Insira o seu código')}
                ${this.renderInputField('cpf', 'CPF', 'text', 'Insira o seu CPF', 14)}
                ${this.renderPasswordField('senha', 'Senha', 'Insira sua senha')}

                <div class="form-options">
                    <label class="checkbox-wrapper">
                        <input type="checkbox" class="remember-checkbox" id="rememberMe" ${
                            this.state.rememberMe ? 'checked' : ''
                        } ${this.state.isLoading ? 'disabled' : ''}/>
                        <span class="checkmark"></span>
                        Lembrar meu login
                    </label>
                    <a class="auth-link" onclick="Toast.info('Funcionalidade em desenvolvimento')">Esqueci minha senha</a>
                </div>

                <button type="submit" class="btn-auth" ${this.state.isLoading ? 'disabled' : ''}>
                    ${this.state.isLoading ? 'Entrando...' : 'Entrar'}
                </button>
                ${this.renderLinkRegister()}
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
            value: CommonUtils.maskCPF(value),
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
     * @returns {string} Password field HTML
     */
    renderPasswordField(name, label, placeholder) {
        const value = this.state.formData[name] || '';
        return FormUtils.createPasswordField({
            name,
            label,
            placeholder,
            value,
            showPassword: this.state.showPassword,
            required: true,
            disabled: this.state.isLoading
        });
    }

    /**
     * Render navigation link to register page
     * @returns {string} Nav link HTML
     */
    renderLinkRegister() {
        return FormUtils.createNavLink({
            text: 'Não tem uma conta?',
            linkText: 'Cadastre-se aqui',
            route: 'register',
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
     * Process login form submission
     * @param {FormData} formData - Form data
     */
    async processLogin(formData) {
        if (this.state.isLoading) return;

        this.state.isLoading = true;
        this.updateSubmitButton();

        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const credentials = {
                codigoLoja: formData.get('codigoLoja'),
                codigoFuncionario: formData.get('codigoFuncionario'),
                cpf: formData.get('cpf'),
                senha: formData.get('senha')
            };

            // Authenticate user
            const user = userManager.authenticateUser(credentials);

            if (user) {
                // Save credentials if remember me is checked
                if (this.state.rememberMe) {
                    localStorage.setItem(this.REMEMBER_USER_KEY, JSON.stringify(credentials));
                }

                this.router.setCurrentUser(user);

                let welcomeMessage = `Login realizado com sucesso! Bem-vindo, ${user.name}!`;
                if (user.isDefault) {
                    welcomeMessage += ' (Usuário Padrão)';
                }

                Toast.success(welcomeMessage);

                // Navigate to dashboard after showing toast
                setTimeout(() => {
                    this.router.navigate('dashboard');
                }, 1500);
            } else {
                Toast.error('Credenciais inválidas. Verifique seus dados ou cadastre-se.');
            }
        } catch (error) {
            Toast.error('Erro no login: ' + error.message);
        } finally {
            this.state.isLoading = false;
            this.updateSubmitButton();
        }
    }

    /**
     * Update submit button loading state
     */
    updateSubmitButton() {
        const button = document.querySelector('.btn-auth');
        FormUtils.updateButtonState(button, this.state.isLoading, 'Entrando...', 'Entrar');
    }

    /**
     * Setup event listeners for the login screen
     */
    setupEvents() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', e => {
                e.preventDefault();
                const formData = new FormData(form);
                this.processLogin(formData);
            });
        }

        // Setup form input handlers
        FormUtils.setupFormInputs(this, this.updateField);

        // Setup password visibility toggle
        FormUtils.setupPasswordToggle(this.state, 'senha', 'showPassword');

        // Setup remember me checkbox
        const rememberCheckbox = document.getElementById('rememberMe');
        if (rememberCheckbox) {
            rememberCheckbox.addEventListener('change', e => {
                this.state.rememberMe = e.target.checked;
            });
        }

        // Setup viewport listeners for responsive behavior
        CommonUtils.setupViewportListeners();

        // Load saved credentials if available
        // this.loadSavedCredentials();
    }

    /**
     * Load saved credentials from localStorage
     */
    loadSavedCredentials() {
        const savedUser = JSON.parse(localStorage.getItem('swift_remember_user'));

        if (savedUser) {
            document.getElementById('cpf').value = savedUser.cpf;
            document.getElementById('codigoLoja').value = savedUser.codigoLoja;
            document.getElementById('codigoFuncionario').value = savedUser.codigoFuncionario;
            document.getElementById('rememberMe').checked = true;

            this.state.formData.cpf = savedCPF;
            this.state.formData.codigoLoja = savedCodigoLoja;
            this.state.rememberMe = true;
        }
    }
}
