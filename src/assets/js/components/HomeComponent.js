/**
 * COMPONENT HOME (INITIAL PAGE)
 * Presentation page of the Swift Gamification
 */

class HomeComponent extends BaseComponent {
    constructor(element, options = {}) {
        super(element, options);

        this.state = {
            isAnimating: false
        };
    }

    getDefaults() {
        return {
            animated: false,
            autoNavigate: true,
            ctaRoute: 'login'
        };
    }

    setupEventListeners() {
        // Main button event
        this.addEventListener('click', '.main-content-button', e => {
            e.preventDefault();
            this.handleCTAClick();
        });
    }

    template() {
        // Exactly replicate the original HTML
        return `
            <!-- Header com navegação -->
            <header>
                <div class="container">
                    <img src="assets/images/Swift Logo.svg" alt="Swift Logo" class="logo" />
                </div>
            </header>

            <!-- Conteúdo principal -->
            <main class="main-content">
                <div class="main-content-text">
                    <span class="main-content-text-title">Vamos nessa,</span><br />
                    <span class="main-content-text-subtitle"
                        >Jornada <br /><strong class="main-content-text-subtitle-strong">Premiada</strong></span
                    >
                    <p class="main-content-text-description">
                        Entre na disputa! Funcionários e franquias competem em um ranking mensal onde resultados
                        viram pontos — e pontos viram prêmios. A cada mês, a Swift reconhece e premia os
                        melhores. Bora pro topo?
                    </p>
                    <button class="main-content-button" onclick="window.location.href='#/login';">Vamos nessa!</button>
                </div>
                <img src="assets/images/Group 3.png" class="main-content-image" alt="Group 3" />
            </main>

            <!-- Footer -->
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

    handleCTAClick() {
        // Navigate to the login page
        if (this.options.autoNavigate && window.router) {
            window.router.navigate(this.options.ctaRoute);
        }

        // Emit custom event
        this.emit('cta-clicked', {
            route: this.options.ctaRoute,
            timestamp: Date.now()
        });
    }
}

// Register the component globally
window.HomeComponent = HomeComponent;

// Export for global use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomeComponent;
}
