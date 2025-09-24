/**
 * COMPONENT REGISTER
 * Register screen of Swift Gamification
 */

class RegisterComponent extends BaseComponent {
    constructor(element, options = {}) {
        super(element, options);

        this.state = {
            formData: {
                codigoLoja: '',
                codigoFuncionario: '',
                cpf: '',
                senha: '',
                confirmarSenha: ''
            },
            isLoading: false,
            errors: {},
            showPassword: false,
            showConfirmPassword: false
        };
    }

    getDefaults() {
        return {
            animated: true,
            showLogo: true,
            redirectRoute: 'login',
            enableValidation: true,
            autoFocus: true
        };
    }

    setupEventListeners() {
        // Submit form
        this.addEventListener('submit', '.register-form', e => {
            e.preventDefault();
            this.handleRegister();
        });

        // Form fields
        this.addEventListener('input', '.register-input', e => {
            this.handleInputChange(e);
        });

        // Automatic CPF formatting
        this.addEventListener('input', 'input[name="cpf"]', e => {
            e.target.value = this.formatCPF(e.target.value);
        });

        // Toggle password
        this.addEventListener('click', '.password-toggle', e => {
            e.preventDefault();
            this.togglePasswordVisibility(e.target);
        });

        // Link to go back to login
        this.addEventListener('click', '.back-to-login', e => {
            e.preventDefault();
            this.handleBackToLogin();
        });

        // Go back to home
        this.addEventListener('click', '.back-to-home', e => {
            e.preventDefault();
            this.handleBackToHome();
        });
    }

    template() {
        const { showLogo } = this.options;
        const { isLoading, errors, showPassword, showConfirmPassword } = this.state;

        return `
            <div class="login-container">   
            <main class="login-content">
            <img src="assets/images/Swift 2.svg" alt="Swift Logo" class="logo-login" onclick="window.location.href='#/home';" />
            <div class="login-card">
            <img src="assets/images/Vector 5.png" class="vector-login" />
            <form class="register-form">  
                        <div class="login-card-header">
                            <h1 class="login-title">Cadastre<strong class="login-title-strong">-se</strong></h1>
                        </div>

                        <div class="form-group">
                            <label for="codigoLoja" class="form-label">Código da loja</label>
                            <input 
                                type="text" 
                                id="codigoLoja" 
                                name="codigoLoja" 
                                class="register-input form-control" 
                                placeholder="Insira o código da sua loja"
                                value="${this.state.formData.codigoLoja}"
                                ${this.state.isLoading ? 'disabled' : ''}
                                required
                            />
                            ${
                                this.state.errors.codigoLoja
                                    ? `<div class="form-error">${this.state.errors.codigoLoja}</div>`
                                    : ''
                            }
                        </div>

                        <div class="form-group">
                            <label for="codigoFuncionario" class="form-label">Código de funcionário</label>
                            <input 
                                type="text" 
                                id="codigoFuncionario" 
                                name="codigoFuncionario" 
                                class="register-input form-control" 
                                placeholder="Insira o seu código de funcionário"
                                value="${this.state.formData.codigoFuncionario}"
                                ${this.state.isLoading ? 'disabled' : ''}
                                required
                            />
                            ${
                                this.state.errors.codigoFuncionario
                                    ? `<div class="form-error">${this.state.errors.codigoFuncionario}</div>`
                                    : ''
                            }
                        </div>

                        <div class="form-group">
                            <label for="cpf" class="form-label">CPF</label>
                            <input 
                                type="text" 
                                id="cpf" 
                                name="cpf" 
                                class="register-input form-control" 
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
                                    class="register-input form-control" 
                                    placeholder="Insira sua senha"
                                    value="${this.state.formData.senha}"
                                    ${this.state.isLoading ? 'disabled' : ''}
                                    required
                                />
                                <button type="button" class="password-toggle" data-field="senha" aria-label="${
                                    this.state.showPassword ? 'Ocultar senha' : 'Mostrar senha'
                                }">
                                    <i class="fas ${this.state.showPassword ? 'fa-eye-slash' : 'fa-eye'}"></i>
                                </button>
                            </div>
                            ${this.state.errors.senha ? `<div class="form-error">${this.state.errors.senha}</div>` : ''}
                        </div>

                        <div class="form-group">
                            <label for="confirmarSenha" class="form-label">Confirmar Senha</label>
                            <div class="password-input-container">
                                <input 
                                    type="${this.state.showConfirmPassword ? 'text' : 'password'}" 
                                    id="confirmarSenha" 
                                    name="confirmarSenha" 
                                    class="register-input form-control" 
                                    placeholder="Insira sua confirmação de senha"
                                    value="${this.state.formData.confirmarSenha}"
                                    ${this.state.isLoading ? 'disabled' : ''}
                                    required
                                />
                                <button type="button" class="password-toggle" data-field="confirmarSenha" aria-label="${
                                    this.state.showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'
                                }">
                                    <i class="fas ${this.state.showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}"></i>
                                </button>
                            </div>
                            ${
                                this.state.errors.confirmarSenha
                                    ? `<div class="form-error">${this.state.errors.confirmarSenha}</div>`
                                    : ''
                            }
                        </div>

                        <div class="form-options">
                            <a class="back-to-login" onclick="window.location.href='#/login';">Já tem uma conta? Faça login</a>
                        </div>

                        ${
                            this.state.errors.general
                                ? `<div class="form-error general-error">${this.state.errors.general}</div>`
                                : ''
                        }

                        <button type="submit" class="btn-login" ${this.state.isLoading ? 'disabled' : ''}>
                            ${this.state.isLoading ? this.renderLoader() : 'Registrar'}
                        </button>
                    </form> 
                <img src="assets/images/Vector 5.png" class="vector-login-2" />             
                    </div>
                </main>
                ${this.renderFooter()}
            </div>
        `;
    }

    renderHeader() {
        return `
            <header class="login-header">
                <div class="container">
                    <img src="assets/images/Swift Logo.svg" alt="Swift Logo" class="logo" />
                </div>
            </header>
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
                <span>Cadastrando...</span>
            </div>
        `;
    }

    afterRender() {
        // Auto-focus on first field if enabled
        if (this.options.autoFocus) {
            const firstInput = this.element?.querySelector('.register-input');
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

            case 'confirmarSenha':
                if (!value.trim()) {
                    errors.confirmarSenha = 'Confirmação de senha é obrigatória';
                } else if (value !== this.state.formData.senha) {
                    errors.confirmarSenha = 'As senhas não conferem';
                } else {
                    errors.confirmarSenha = '';
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
        const { codigoLoja, codigoFuncionario, cpf, senha, confirmarSenha } = this.state.formData;
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

        if (!confirmarSenha.trim()) {
            errors.confirmarSenha = 'Confirmação de senha é obrigatória';
        } else if (confirmarSenha !== senha) {
            errors.confirmarSenha = 'As senhas não conferem';
        }

        return errors;
    }

    async handleRegister() {
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
            const { codigoLoja, codigoFuncionario, cpf, senha } = this.state.formData;
            const success = await this.registerUser(codigoLoja, codigoFuncionario, cpf, senha);

            if (success) {
                // Notify success
                this.showSuccessMessage('Cadastro realizado com sucesso! Redirecionando para o login...');

                // Redirect after a delay
                setTimeout(() => {
                    if (window.router) {
                        window.router.navigate(this.options.redirectRoute);
                    }
                }, 2000);
            } else {
                throw new Error('Este CPF já está cadastrado');
            }
        } catch (error) {
            this.setState({
                errors: {
                    general: error.message || 'Erro ao realizar cadastro. Tente novamente.'
                }
            });
        } finally {
            this.setState({ isLoading: false });
        }
    }

    async registerUser(codigoLoja, codigoFuncionario, cpf, senha) {
        // Simulate registration (replace with real API call)
        return new Promise(resolve => {
            setTimeout(() => {
                // Check if the CPF already exists
                const existingUsers = JSON.parse(localStorage.getItem('swift_users') || '[]');
                const userExists = existingUsers.some(user => user.cpf === cpf);

                if (userExists) {
                    resolve(false);
                    return;
                }

                // Create new user
                const newUser = {
                    id: Date.now(),
                    codigoLoja,
                    codigoFuncionario,
                    cpf,
                    senha,
                    nome: 'Usuário Swift',
                    avatar: null,
                    createdAt: new Date().toISOString()
                };

                // Save in localStorage (replace with real API)
                const users = [...existingUsers, newUser];
                localStorage.setItem('swift_users', JSON.stringify(users));

                resolve(true);
            }, 1500);
        });
    }

    togglePasswordVisibility(button) {
        const field = button.getAttribute('data-field');

        if (field === 'senha') {
            this.setState({
                showPassword: !this.state.showPassword
            });
        } else if (field === 'confirmarSenha') {
            this.setState({
                showConfirmPassword: !this.state.showConfirmPassword
            });
        }
    }

    handleBackToLogin() {
        if (window.router) {
            window.router.navigate('login');
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

    /**
     * Public methods
     */
    prefillCredentials(codigoLoja = '', codigoFuncionario = '', cpf = '') {
        this.setState({
            formData: {
                ...this.state.formData,
                codigoLoja,
                codigoFuncionario,
                cpf
            }
        });
        this.render();
    }

    clearForm() {
        this.setState({
            formData: {
                codigoLoja: '',
                codigoFuncionario: '',
                cpf: '',
                senha: '',
                confirmarSenha: ''
            },
            errors: {}
        });
        this.render();
    }

    destroy() {
        // Clear sensitive data
        this.state.formData = {
            codigoLoja: '',
            codigoFuncionario: '',
            cpf: '',
            senha: '',
            confirmarSenha: ''
        };
        super.destroy();
    }
}

// Register the component globally
window.RegisterComponent = RegisterComponent;

// Export for global use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RegisterComponent;
}
