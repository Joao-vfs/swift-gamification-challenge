/**
 * COMPONENT HOME (PÁGINA INICIAL)
 * Página de apresentação da Gamificação Swift.
 * Responsável apenas pelo conteúdo principal da home.
 */
class HomeComponent extends BaseComponent {
    static SELECTORS = {
        ctaButton: '.home-button',
    };

    constructor(element, options = {}) {
        super(element, options);
    }

    getDefaults() {
        return {
            ctaRoute: 'login'
        };
    }

    setupEventListeners() {
        this.addEventListener(HomeComponent.SELECTORS.ctaButton, 'click', e => {
            e.preventDefault();
            this.handleCTAClick();
        });
    }

    template() {
        return `
        <main class="home-container">
            <div class="home-logo">
                <img src="assets/images/Swift Logo.svg" alt="Swift Logo" />
            </div>

            <div class="home-text-content">
                <span class="home-title">Vamos nessa,</span><br />
                <span class="home-subtitle">
                    Jornada <br /><strong class="home-subtitle-strong">Premiada</strong>
                </span>
                <p class="home-description">
                    Entre na disputa! Funcionários e franquias competem em um ranking mensal onde resultados
                    viram pontos — e pontos viram prêmios. A cada mês, a Swift reconhece e premia os
                    melhores. Bora pro topo?
                </p>
                <button class="home-button">Vamos nessa!</button>
            </div>

            <div class="home-image-container">
                <img src="assets/images/Group 3.png" class="home-image" alt="Ilustração da jornada premiada" />
            </div>
        </main>
    `;
    }

    handleCTAClick() {
        if (window.router) {
            window.router.navigate(this.options.ctaRoute);
        }
    }
}

window.HomeComponent = HomeComponent;