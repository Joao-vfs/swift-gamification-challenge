import { Toast } from '../utils/Toast.js';
import { userManager } from '../utils/UserManager.js';
import { CommonUtils } from '../utils/CommonUtils.js';
import { FormUtils } from '../utils/FormUtils.js';

export class LoginScreen {
    constructor(router) {
        const defaultUser = userManager.getDefaultUserInfo();
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
     * Render login logo
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
     * Render login form
     * @returns {string} HTML of the form
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
     * @returns {string} HTML of the field
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
     * Render link to register using FormUtils
     * @returns {string} HTML of the link
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
     * Update field in state and on the screen
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
     */
    togglePasswordVisibility() {
        this.state.showPassword = !this.state.showPassword;
        // FormUtils handles the actual DOM updates
    }

    /**
     * Process login
     * @param {FormData} formData - Data of the form
     */
    async processLogin(formData) {
        if (this.state.isLoading) return;

        this.state.isLoading = true;
        this.updateSubmitButton();

        try {
            // Simulate authentication delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const credentials = {
                codigoLoja: formData.get('codigoLoja'),
                codigoFuncionario: formData.get('codigoFuncionario'),
                cpf: formData.get('cpf'),
                senha: formData.get('senha')
            };

            // Authenticate using UserManager (check localStorage + default user)
            const user = userManager.authenticateUser(credentials);

            if (user) {
                // Save data if "remember login" is checked
                if (this.state.rememberMe) {
                    localStorage.setItem('swift_remember_cpf', credentials.cpf);
                    localStorage.setItem('swift_remember_codigo_loja', credentials.codigoLoja);
                }

                this.router.setCurrentUser(user);

                let welcomeMessage = `Login realizado com sucesso! Bem-vindo, ${user.name}!`;
                if (user.isDefault) {
                    welcomeMessage += ' (Usuário Padrão)';
                }

                Toast.success(welcomeMessage);

                // Wait a little to show the toast before navigating
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
     * Update submit button using FormUtils
     */
    updateSubmitButton() {
        const button = document.querySelector('.btn-auth');
        FormUtils.updateButtonState(button, this.state.isLoading, 'Entrando...', 'Entrar');
    }

    /**
     * Setup events of the screen
     */
    setupEvents() {
        // Expose instance globally for demo buttons
        window.loginScreen = this;

        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', e => {
                e.preventDefault();
                const formData = new FormData(form);
                this.processLogin(formData);
            });
        }

        // Setup form inputs using FormUtils
        FormUtils.setupFormInputs(this, this.updateField);

        // Setup password toggle using FormUtils
        FormUtils.setupPasswordToggle(this.state, 'senha', 'showPassword');

        // Event listener for checkbox
        const rememberCheckbox = document.getElementById('rememberMe');
        if (rememberCheckbox) {
            rememberCheckbox.addEventListener('change', e => {
                this.state.rememberMe = e.target.checked;
            });
        }

        // Setup viewport listeners using CommonUtils
        CommonUtils.setupViewportListeners();

        // Load saved data if exist
        this.loadSavedCredentials();
    }

    // Removed duplicate utility functions - now using CommonUtils

    /**
     * Load saved credentials
     */
    loadSavedCredentials() {
        const savedCPF = localStorage.getItem('swift_remember_cpf');
        const savedCodigoLoja = localStorage.getItem('swift_remember_codigo_loja');

        if (savedCPF && savedCodigoLoja) {
            document.getElementById('cpf').value = savedCPF;
            document.getElementById('codigoLoja').value = savedCodigoLoja;
            document.getElementById('rememberMe').checked = true;

            this.state.formData.cpf = savedCPF;
            this.state.formData.codigoLoja = savedCodigoLoja;
            this.state.rememberMe = true;
        }
    }
}
