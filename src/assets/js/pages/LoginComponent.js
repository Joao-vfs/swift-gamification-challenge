class LoginComponent extends BaseComponent {
    static STORAGE_KEYS = {
        REMEMBER_CPF: 'swift_remember_cpf',
        REMEMBER_CODIGO_LOJA: 'swift_remember_codigo_loja',
        AUTH_TOKEN: 'swift_auth_token',
    };

    constructor(element, options = {}) {
        super(element, options);
        this.state = this._getInitialState();
    }

    _getInitialState() {
        return {
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
            redirectRoute: 'dashboard',
        };
    }

    beforeInit() {

        const savedCPF = localStorage.getItem(LoginComponent.STORAGE_KEYS.REMEMBER_CPF);
        const savedCodigoLoja = localStorage.getItem(LoginComponent.STORAGE_KEYS.REMEMBER_CODIGO_LOJA);

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

setupEventListeners() {
    // A única mudança aqui é passar o evento 'e' inteiro para o handleInputChange
    const form = this.element.querySelector('.auth-form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    this.addEventListener('.form-input', 'input', e => {
        // Passando o evento completo para a função de tratamento
        this.handleInputChange(e);
    });

    this.addEventListener('.password-toggle', 'click', e => {
        const button = e.target.closest('.password-toggle');
        this.togglePasswordVisibility(button.dataset.field);
    });

    this.addEventListener('.remember-checkbox', 'change', e => {
        this.setState({ rememberMe: e.target.checked });
    });
}

    template() {
        return `
            <div class="auth-container">
                <main class="auth-content">
                    <img src="assets/images/Swift 2.svg" alt="Swift Logo" class="auth-logo" onclick="window.router.navigate('home')" />
                    <div class="auth-card">
                        <img src="assets/images/Vector 5.png" class="auth-vector-1" alt=""/>
                        ${this._renderForm()}
                        <img src="assets/images/Vector 5.png" class="auth-vector-2" alt=""/>
                    </div>
                </main>
            </div>
        `;
    }

    _renderForm() {
        const { isLoading, errors } = this.state;
        return `
            <form class="auth-form" novalidate>
                <div class="auth-card-header">
                    <h1 class="auth-title">Log<strong class="auth-title-strong">-in</strong></h1>
                </div>

                ${this._renderInputField('codigoLoja', 'Código da loja', 'text', 'Insira o código da sua loja')}
                ${this._renderInputField('codigoFuncionario', 'Código de funcionário', 'text', 'Insira o seu código')}
                ${this._renderInputField('cpf', 'CPF', 'text', 'Insira o seu CPF', 14)}
                ${this._renderPasswordField('senha', 'Senha', 'Insira sua senha')}

                <div class="form-options">
                    <label class="checkbox-wrapper">
                        <input type="checkbox" class="remember-checkbox" ${this.state.rememberMe ? 'checked' : ''} ${isLoading ? 'disabled' : ''}/>
                        <span class="checkmark"></span>
                        Lembrar meu login
                    </label>
                    <a class="auth-link">Esqueci minha senha</a>
                </div>
                
                ${errors.general ? `<div class="form-error general-error">${errors.general}</div>` : ''}

                <button type="submit" class="btn-auth" ${isLoading ? 'disabled' : ''}>
                    ${isLoading ? '<span>Entrando...</span>' : 'Entrar'}
                </button>

                <div class="auth-link-container">
                    <span class="auth-link-text">Não tem uma conta?</span>
                    <a class="auth-link" href="#register">Cadastre-se aqui</a>
                </div>
            </form>
        `;
    }

    _renderInputField(name, label, type, placeholder, maxlength = '') {
        const { formData, errors, isLoading } = this.state;
        return `
            <div class="form-group">
                <label for="${name}" class="form-label">${label}</label>
                <input
                    type="${type}" id="${name}" name="${name}"
                    class="form-input" placeholder="${placeholder}"
                    value="${formData[name]}"
                    ${isLoading ? 'disabled' : ''}
                    ${maxlength ? `maxlength="${maxlength}"` : ''}
                    required
                />
                ${errors[name] ? `<div class="form-error">${errors[name]}</div>` : ''}
            </div>
        `;
    }

    _renderPasswordField(name, label, placeholder) {
        const { formData, errors, isLoading, showPassword } = this.state;
        return `
            <div class="form-group">
                <label for="${name}" class="form-label">${label}</label>
                <div class="password-input-container">
                    <input
                        type="${showPassword ? 'text' : 'password'}"
                        id="${name}" name="${name}" class="form-input"
                        placeholder="${placeholder}" value="${formData[name]}"
                        ${isLoading ? 'disabled' : ''} required
                    />
                    <button type="button" class="password-toggle" data-field="${name}">
                        <i class="fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}"></i>
                    </button>
                </div>
                ${errors[name] ? `<div class="form-error">${errors[name]}</div>` : ''}
            </div>
        `;
    }

handleInputChange(e) {
    // Pega o nome e o valor do campo a partir do evento
    const { name, value } = e.target;

    try {
        let processedValue = value;

        if (name === 'cpf') {
            // Este bloco 'try...catch' vai capturar o erro exato.
            processedValue = ValidationUtils.formatCPF(value);
        }

        this.setState({
            formData: { ...this.state.formData, [name]: processedValue },
            errors: { ...this.state.errors, [name]: '', general: '' }
        }, true);

    } catch (error) {
        // SE ALGO DER ERRADO, ESTE ALERTA VAI APARECER!
        alert("ERRO CAPTURADO! Mensagem: " + error.message);

        // Medida de segurança para parar qualquer outra ação
        e.preventDefault();
        e.stopPropagation();
    }
}

    togglePasswordVisibility() {
        this.setState({ showPassword: !this.state.showPassword });
    }

    async handleLogin() {
        if (this.state.isLoading) return;


        this.setState({ isLoading: true, errors: {} });

        try {

            await new Promise(resolve => setTimeout(resolve, 1500));


            const { cpf, senha } = this.state.formData;
            if (cpf && senha) {
                const user = { name: 'Usuário Swift', cpf: cpf };
                this._handleSuccessfulLogin(user);
            } else {
                throw new Error("CPF e Senha são obrigatórios.");
            }

        } catch (error) {
            this.setState({ errors: { general: error.message } });
        } finally {
            this.setState({ isLoading: false });
        }
    }

    _handleSuccessfulLogin(user) {
        stateManager.setState({ currentUser: user });
        alert('Login realizado com sucesso!');
        window.router.navigate(this.options.redirectRoute);
    }
}

window.LoginComponent = LoginComponent;