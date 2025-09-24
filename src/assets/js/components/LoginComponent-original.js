/**
 * COMPONENT LOGIN
 * Authentication page of the Swift Gamification
 */

class LoginComponent extends BaseComponent {
    constructor(element, options = {}) {
        super(element, options);

        this.state = {
            formData: {
                codigoLoja: '',
                codigoFuncionario: '',
                cpf: '',
                senha: ''
            },
            isLoading: false,
            errors: {},
            showPassword: false,
            rememberMe: false
        };
    }

    getDefaults() {
        return {
            animated: true,
            allowRememberMe: true,
            allowForgotPassword: true,
            showLogo: true,
            redirectRoute: 'dashboard',
            enableValidation: true,
            autoFocus: true
        };
    }

    setupEventListeners() {
        // Submit form
        this.addEventListener('submit', '.login-form', e => {
            e.preventDefault();
            this.handleLogin();
        });

        // Form fields
        this.addEventListener('input', '.login-input', e => {
            this.handleInputChange(e);
        });

        // Automatic CPF formatting
        this.addEventListener('input', 'input[name="cpf"]', e => {
            e.target.value = this.formatCPF(e.target.value);
        });

        // Toggle password
        this.addEventListener('click', '.password-toggle', e => {
            e.preventDefault();
            this.togglePasswordVisibility();
        });

        // Checkbox "Remember me"
        this.addEventListener('change', '.remember-checkbox', e => {
            this.setState({
                rememberMe: e.target.checked
            });
        });

        // Link "Forgot password"
        this.addEventListener('click', '.forgot-password-link', e => {
            e.preventDefault();
            this.handleForgotPassword();
        });

        // Link "Register here"
        this.addEventListener('click', '.register-link', e => {
            e.preventDefault();
            this.handleGoToRegister();
        });

        // Back to home
        this.addEventListener('click', '.back-to-home', e => {
            e.preventDefault();
            this.handleBackToHome();
        });
    }

    template() {
        const { showLogo, allowRememberMe, allowForgotPassword } = this.options;
        const { isLoading, errors, showPassword, rememberMe } = this.state;

        return `
            <div class="login-container">   
            <main class="login-content">
            <img src="assets/images/Swift 2.svg" alt="Swift Logo" class="logo-login" onclick="window.location.href='#/home';" />
            <div class="login-card">
            <img src="assets/images/Vector 5.png" class="vector-login" />
            <form class="login-form">  
                        <div class="login-card-header">
                            <h1 class="login-title">Log<strong class="login-title-strong">-in</strong></h1>
                        </div>

                        <div class="form-group">
                            <label for="codigoLoja" class="form-label">Código da loja</label>
                            <input 
                                type="text" 
                                id="codigoLoja" 
                                name="codigoLoja" 
                                class="login-input form-control" 
                                placeholder="Insira o código da sua loja"
                                value="${this.state.formData.codigoLoja}"
                                ${this.state.isLoading ? 'disabled' : ''}
                                required
                            />
                            ${this.state.errors.codigoLoja ? `<div class="form-error">${this.state.errors.codigoLoja}</div>` : ''}
                        </div>

                        <div class="form-group">
                            <label for="codigoFuncionario" class="form-label">Código de funcionário</label>
                            <input 
                                type="text" 
                                id="codigoFuncionario" 
                                name="codigoFuncionario" 
                                class="login-input form-control" 
                                placeholder="Insira o seu código de funcionário"
                                value="${this.state.formData.codigoFuncionario}"
                                ${this.state.isLoading ? 'disabled' : ''}
                                required
                            />
                            ${this.state.errors.codigoFuncionario ? `<div class="form-error">${this.state.errors.codigoFuncionario}</div>` : ''}
                        </div>

                        <div class="form-group">
                            <label for="cpf" class="form-label">CPF</label>
                            <input 
                                type="text" 
                                id="cpf" 
                                name="cpf" 
                                class="login-input form-control" 
                                placeholder="Insira o seu CPF"
                                value="${this.state.formData.cpf}"
                                ${this.state.isLoading ? 'disabled' : ''}
                                maxlength="14"
                                required
                            />
                            ${this.state.errors.cpf ? `<div class="form-error">${this.state.errors.cpf}</div>` : ''}
                        </div>

                        <div class="form-group">
                            <label for="senha" class="form-label">Senha</label>
                            <div class="password-input-container">
                                <input 
                                    type="${this.state.showPassword ? 'text' : 'password'}" 
                                    id="senha" 
                                    name="senha" 
                                    class="login-input form-control" 
                                    placeholder="Insira sua senha"
                                    value="${this.state.formData.senha}"
                                    ${this.state.isLoading ? 'disabled' : ''}
                                    required
                                />
                                <button type="button" class="password-toggle" aria-label="${this.state.showPassword ? 'Ocultar senha' : 'Mostrar senha'}">
                                    <i class="fas ${this.state.showPassword ? 'fa-eye-slash' : 'fa-eye'}"></i>
                                </button>
                            </div>
                            ${this.state.errors.senha ? `<div class="form-error">${this.state.errors.senha}</div>` : ''}
                        </div>

                        <div class="form-options">
                            <label class="checkbox-wrapper">
                                <input 
                                    type="checkbox" 
                                    class="remember-checkbox" 
                                    ${this.state.rememberMe ? 'checked' : ''}
                                    ${this.state.isLoading ? 'disabled' : ''}
                                />
                                <span class="checkmark"></span>
                                Lembrar meu login
                            </label>
                            <a class="forgot-password-link">Esqueci minha senha</a>
                        </div>

                        <div class="register-link-container" onclick="window.location.href='#/register';">
                            <span class="register-text">Não tem uma conta?</span>
                            <a class="register-link">Cadastre-se aqui</a>
                        </div>

                        ${this.state.errors.general ? `<div class="form-error general-error">${this.state.errors.general}</div>` : ''}

                        <button type="submit" class="btn-login" ${this.state.isLoading ? 'disabled' : ''}>
                            ${this.state.isLoading ? this.renderLoader() : 'Entrar'}
                        </button>
                    </form> 
                <img src="assets/images/Vector 5.png" class="vector-login-2" />             
                    </div>
                </main>
                ${this.renderFooter()}
            </div>
        `;
    }

    renderFooter() {
        return `
           <footer class="footer">
                <div class="container">
                    <div class="footer-content">
                        <img src="assets/images/Swift 2.svg" alt="Swift Logo" class="footer-logo" />
                        <div class="footer-section">2025 - Swift - Todos os direitos reservados</div>
                    </div>
                </div>
            </footer>
        `;
    }

    renderLoader() {
        return `
            <div class="button-loader">
                <div class="loader-spinner"></div>
                <span>Entrando...</span>
            </div>
        `;
    }

    afterRender() {
        // Auto-focus no primeiro campo se habilitado
        if (this.options.autoFocus) {
            const firstInput = this.element?.querySelector('.login-input');
            if (firstInput && !this.state.isLoading) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }

        // Entrance animation
        if (this.options.animated) {
            this.animateEntrance();
        }
    }

    animateEntrance() {
        const card = this.element?.querySelector('.login-card');
        if (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    handleInputChange(e) {
        const { name, value } = e.target;

        this.setState({
            formData: {
                ...this.state.formData,
                [name]: value
            },
            errors: {
                ...this.state.errors,
                [name]: '' // Clear field error when typing
            }
        });

        // Real-time validation if enabled
        if (this.options.enableValidation) {
            this.validateField(name, value);
        }
    }

    validateField(fieldName, value) {
        const errors = { ...this.state.errors };

        switch (fieldName) {
            case 'codigoLoja':
                if (!value.trim()) {
                    errors.codigoLoja = 'Código da loja é obrigatório';
                } else if (value.length < 3) {
                    errors.codigoLoja = 'Código da loja deve ter pelo menos 3 caracteres';
                } else {
                    errors.codigoLoja = '';
                }
                break;

            case 'codigoFuncionario':
                if (!value.trim()) {
                    errors.codigoFuncionario = 'Código de funcionário é obrigatório';
                } else if (value.length < 3) {
                    errors.codigoFuncionario = 'Código de funcionário deve ter pelo menos 3 caracteres';
                } else {
                    errors.codigoFuncionario = '';
                }
                break;

            case 'cpf':
                if (!value.trim()) {
                    errors.cpf = 'CPF é obrigatório';
                } else if (!this.isValidCPF(value)) {
                    errors.cpf = 'CPF inválido';
                } else {
                    errors.cpf = '';
                }
                break;

            case 'senha':
                if (!value.trim()) {
                    errors.senha = 'Senha é obrigatória';
                } else if (value.length < 6) {
                    errors.senha = 'Senha deve ter pelo menos 6 caracteres';
                } else {
                    errors.senha = '';
                }
                break;
        }

        this.setState({ errors });
    }

    isValidCPF(cpf) {
        // Remove dots and hyphens
        cpf = cpf.replace(/[^\d]/g, '');

        // Check if has 11 digits
        if (cpf.length !== 11) return false;

        // Check if all digits are the same
        if (/^(\d)\1{10}$/.test(cpf)) return false;

        // Validator digits validation
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(10))) return false;

        return true;
    }

    formatCPF(cpf) {
        // Remove non-numeric characters
        cpf = cpf.replace(/\D/g, '');

        // Apply mask XXX.XXX.XXX-XX
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        return cpf;
    }

    validateForm() {
        const { codigoLoja, codigoFuncionario, cpf, senha } = this.state.formData;
        const errors = {};

        if (!codigoLoja.trim()) {
            errors.codigoLoja = 'Código da loja é obrigatório';
        } else if (codigoLoja.length < 3) {
            errors.codigoLoja = 'Código da loja deve ter pelo menos 3 caracteres';
        }

        if (!codigoFuncionario.trim()) {
            errors.codigoFuncionario = 'Código de funcionário é obrigatório';
        } else if (codigoFuncionario.length < 3) {
            errors.codigoFuncionario = 'Código de funcionário deve ter pelo menos 3 caracteres';
        }

        if (!cpf.trim()) {
            errors.cpf = 'CPF é obrigatório';
        } else if (!this.isValidCPF(cpf)) {
            errors.cpf = 'CPF inválido';
        }

        if (!senha.trim()) {
            errors.senha = 'Senha é obrigatória';
        } else if (senha.length < 6) {
            errors.senha = 'Senha deve ter pelo menos 6 caracteres';
        }

        return errors;
    }

    async handleLogin() {
        if (this.state.isLoading) return;

        // Validation
        const errors = this.validateForm();
        if (Object.keys(errors).length > 0) {
            this.setState({ errors });
            return;
        }

        this.setState({
            isLoading: true,
            errors: {}
        });

        try {
            // Simulate authentication (replace with real API)
            const { codigoLoja, codigoFuncionario, cpf, senha } = this.state.formData;
            const success = await this.authenticateUser(codigoLoja, codigoFuncionario, cpf, senha);

            if (success) {
                // Save "remember me" state if selected
                if (this.state.rememberMe) {
                    localStorage.setItem('swift_remember_cpf', cpf);
                    localStorage.setItem('swift_remember_codigo_loja', codigoLoja);
                } else {
                    localStorage.removeItem('swift_remember_cpf');
                    localStorage.removeItem('swift_remember_codigo_loja');
                }

                // Notify success
                this.showSuccessMessage('Login realizado com sucesso!');

                // Redirect after a delay
                setTimeout(() => {
                    if (window.router) {
                        window.router.navigate(this.options.redirectRoute);
                    }
                }, 1500);
            } else {
                throw new Error('Credenciais inválidas');
            }
        } catch (error) {
            this.setState({
                errors: {
                    general: error.message || 'Erro ao fazer login. Tente novamente.'
                }
            });
        } finally {
            this.setState({ isLoading: false });
        }
    }

    async authenticateUser(codigoLoja, codigoFuncionario, cpf, senha) {
        // Simulate authentication (replace with real API call)
        return new Promise(resolve => {
            setTimeout(() => {
                // Test credentials
                const validCredentials = [
                    { codigoLoja: '001', codigoFuncionario: '12345', cpf: '123.456.789-00', senha: '123456' },
                    { codigoLoja: '002', codigoFuncionario: '54321', cpf: '987.654.321-00', senha: '123456' },
                    { codigoLoja: '001', codigoFuncionario: '67890', cpf: '111.222.333-44', senha: '123456' }
                ];

                const isValid = validCredentials.some(
                    cred =>
                        cred.codigoLoja === codigoLoja &&
                        cred.codigoFuncionario === codigoFuncionario &&
                        cred.cpf === cpf &&
                        cred.senha === senha
                );

                // Update global state if authenticated
                if (isValid) {
                    const users = stateManager.getState('users') || [];
                    const user = users.find(u => u.cpf === cpf);
                    let currentUser;
                    
                    if (user) {
                        currentUser = user;
                    } else {
                        // Create temporary user if not exists
                        currentUser = {
                            id: Date.now(),
                            codigoLoja,
                            codigoFuncionario,
                            cpf,
                            name: 'Usuário Swift',
                            email: `${codigoFuncionario}@swift.com`,
                            position: 'Funcionário',
                            store: `Loja ${codigoLoja}`,
                            points: 1500,
                            level: 3,
                            achievements: ['first-login'],
                            avatar: null
                        };
                    }
                    
                    // Save current user in state
                    stateManager.setState({ currentUser });
                    
                    // Save authentication token
                    localStorage.setItem('swift_auth_token', JSON.stringify({
                        userId: currentUser.id,
                        cpf: currentUser.cpf,
                        loginTime: Date.now(),
                        expiresIn: 24 * 60 * 60 * 1000 // 24 horas
                    }));
                }

                resolve(isValid);
            }, 1500);
        });
    }

    togglePasswordVisibility() {
        this.setState({
            showPassword: !this.state.showPassword
        });
    }

    handleForgotPassword() {
        // Implementar modal ou navegação para recuperação de senha
        alert('Funcionalidade de recuperação de senha será implementada em breve!');
    }

    handleGoToRegister() {
        if (window.router) {
            window.router.navigate('register');
        }
    }

    handleBackToHome() {
        if (window.router) {
            window.router.navigate('home');
        }
    }

    showSuccessMessage(message) {
        // Add success notification
        if (window.headerComponent) {
            headerComponent.addNotification({
                title: 'Sucesso',
                message,
                type: 'success',
                temporary: true
            });
        }
    }

    beforeInit() {
        // Load saved data if exists
        const savedCPF = localStorage.getItem('swift_remember_cpf');
        const savedCodigoLoja = localStorage.getItem('swift_remember_codigo_loja');

        if (savedCPF && savedCodigoLoja) {
            this.setState({
                formData: {
                    ...this.state.formData,
                    cpf: savedCPF,
                    codigoLoja: savedCodigoLoja
                },
                rememberMe: true
            });
        }
    }

    /**
     * Public methods
     */
    prefillCredentials(codigoLoja = '', codigoFuncionario = '', cpf = '', senha = '') {
        this.setState({
            formData: { codigoLoja, codigoFuncionario, cpf, senha }
        });
        this.render();
    }

    clearForm() {
        this.setState({
            formData: { codigoLoja: '', codigoFuncionario: '', cpf: '', senha: '' },
            errors: {},
            rememberMe: false
        });
        this.render();
    }

    destroy() {
        // Clear sensitive data
        this.state.formData = { codigoLoja: '', codigoFuncionario: '', cpf: '', senha: '' };
        super.destroy();
    }
}

// Register the component globally
window.LoginComponent = LoginComponent;

// Export for global use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoginComponent;
}
