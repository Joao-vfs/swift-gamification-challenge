class BaseComponent {
    constructor(element, options = {}) {
        this.element = element;
        this.options = { ...this.getDefaults(), ...options };
        this.state = {};
        this._eventListeners = [];
    }

    getDefaults() { return {}; }

    init() {
        if (this.beforeInit) this.beforeInit();
        this.render();
        this.setupEventListeners();
        if (this.afterInit) this.afterInit();
        return this;
    }

setState(newState, shouldRender = true) {
    const prevState = { ...this.state };
    this.state = { ...prevState, ...newState };

    if (shouldRender) {
        this.render();
    }
}

    render() {
        if (this.element) {
            this.element.innerHTML = this.template();
        }
        if (this.afterRender) this.afterRender();
    }

    template() { return ''; }
    setupEventListeners() { }

    /**
     * MÉTODO CRÍTICO CORRIGIDO:
     * Adiciona um "ouvinte" ao elemento principal do componente.
     * Quando um evento ocorre, ele verifica se o alvo (`e.target`)
     * corresponde ao seletor que você passou (ex: '.form-input').
     */
    addEventListener(selector, eventType, handler) {
        if (!this.element) {
            console.error("Componente sem elemento principal. Não é possível adicionar listener.");
            return;
        }

        const eventHandler = (e) => {
            // Verifica se o elemento clicado (ou um de seus pais) corresponde ao seletor
            if (e.target.closest(selector)) {
                handler(e); // Se corresponder, executa a função
            }
        };

        // Adiciona o ouvinte ao elemento PAI do componente
        this.element.addEventListener(eventType, eventHandler);
        this._eventListeners.push({ selector, eventType, handler: eventHandler });
    }

    destroy() {
        // Limpa os listeners para evitar vazamento de memória
        if (this.element) {
            this._eventListeners.forEach(({ eventType, handler }) => {
                this.element.removeEventListener(eventType, handler);
            });
        }
        this._eventListeners = [];
        if (this.element) this.element.innerHTML = '';
    }
}