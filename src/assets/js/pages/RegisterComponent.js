/**
 * COMPONENTE REGISTER
 * Tela de cadastro da Gamificação Swift.
 */
class RegisterComponent extends BaseComponent {
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
                senha: '',
                confirmarSenha: ''
            },
            isLoading: false,
            errors: {},
            showPassword: false,
            showConfirmPassword: false
        };
    }

setupEventListeners() {
    this.addEventListener('.auth-form', 'submit', e => {
        e.preventDefault();
        this.handleLogin();
    });

    // ESTA LINHA É CRUCIAL para a formatação em tempo real
    this.addEventListener('.form-input', 'input', e => {
        this.handleInputChange(e.target.name, e.target.value);
    });

        this.addEventListener('.password-toggle', 'click', e => {
            const button = e.target.closest('.password-toggle');
            this.togglePasswordVisibility(button.dataset.field);
        });

        // Adiciona um listener para o link de 'voltar ao login'
        this.addEventListener('.auth-link-login', 'click', () => window.router.navigate('login'));
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
                    <h1 class="auth-title">Cadastre<strong class="auth-title-strong">-se</strong></h1>
                </div>

                ${this._renderInputField('codigoLoja', 'Código da loja', 'text', 'Insira o código da sua loja')}
                ${this._renderInputField('codigoFuncionario', 'Código de funcionário', 'text', 'Insira seu código')}
                ${this._renderInputField('cpf', 'CPF', 'text', 'Insira o seu CPF', 14)}
                ${this._renderPasswordField('senha', 'Senha', 'Crie sua senha')}
                ${this._renderPasswordField('confirmarSenha', 'Confirmar Senha', 'Confirme sua senha')}
                
                ${errors.general ? `<div class="form-error general-error">${errors.general}</div>` : ''}

                <button type="submit" class="btn-auth" ${isLoading ? 'disabled' : ''}>
                    ${isLoading ? '<span>Cadastrando...</span>' : 'Registrar'}
                </button>
                
                <div class="auth-link-container">
                  <a class="auth-link auth-link-login" href="#login">Já tem uma conta? Faça login</a>
                </div>
            </form>
        `;
    }

    // CORRIGIDO: Este método estava vazio, agora ele gera o HTML dos campos.
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
        const { formData, errors, isLoading } = this.state;
        const isVisible = name === 'senha' ? this.state.showPassword : this.state.showConfirmPassword;
        return `
            <div class="form-group">
                <label for="${name}" class="form-label">${label}</label>
                <div class="password-input-container">
                    <input
                        type="${isVisible ? 'text' : 'password'}"
                        id="${name}" name="${name}"
                        class="form-input"
                        placeholder="${placeholder}"
                        value="${formData[name]}"
                        ${isLoading ? 'disabled' : ''}
                        required
                    />
                    <button type="button" class="password-toggle" data-field="${name}">
                        <i class="fas ${isVisible ? 'fa-eye-slash' : 'fa-eye'}"></i>
                    </button>
                </div>
                ${errors[name] ? `<div class="form-error">${errors[name]}</div>` : ''}
            </div>
        `;
    }

    handleInputChange(name, value) {
        let processedValue = value;
        if (name === 'cpf') {
            // Usa o utilitário compartilhado
            processedValue = ValidationUtils.formatCPF(value);
        }
        this.setState({
            formData: { ...this.state.formData, [name]: processedValue },
            errors: { ...this.state.errors, [name]: '', general: '' }
        });
    }

    togglePasswordVisibility(fieldName) {
        if (fieldName === 'senha') {
            this.setState({ showPassword: !this.state.showPassword });
        } else if (fieldName === 'confirmarSenha') {
            this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
        }
    }

    async handleRegister() {
        if (this.state.isLoading) return;

        const errors = this._validateForm();
        if (Object.keys(errors).length > 0) {
            this.setState({ errors });
            return;
        }

        this.setState({ isLoading: true, errors: {} });

        try {
            // Usa o serviço centralizado
            await AuthService.register(this.state.formData);
            alert('Cadastro realizado com sucesso! Redirecionando para o login...');
            window.router.navigate('login');
        } catch (error) {
            this.setState({ errors: { general: error.message } });
        } finally {
            this.setState({ isLoading: false });
        }
    }

    _validateForm() {
        const { formData } = this.state;
        const errors = {};

        if (!formData.codigoLoja.trim()) errors.codigoLoja = 'Código da loja é obrigatório';
        if (!formData.codigoFuncionario.trim()) errors.codigoFuncionario = 'Código de funcionário é obrigatório';

        if (!formData.cpf.trim()) {
            errors.cpf = 'CPF é obrigatório';
        } else if (!ValidationUtils.isValidCPF(formData.cpf)) {
            errors.cpf = 'CPF inválido';
        }

        if (!formData.senha) errors.senha = 'Senha é obrigatória';
        else if (formData.senha.length < 6) errors.senha = 'A senha deve ter no mínimo 6 caracteres';

        if (formData.senha !== formData.confirmarSenha) {
            errors.confirmarSenha = 'As senhas não conferem';
        }

        return errors;
    }
}

window.RegisterComponent = RegisterComponent;