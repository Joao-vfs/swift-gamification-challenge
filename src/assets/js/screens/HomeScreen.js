/**
 * HomeScreen - Landing page view
 * Entry point showing welcome message and call-to-action
 */
export class HomeScreen {
    constructor(router) {
        this.router = router;
    }

    /**
     * Render home screen
     * @returns {string} Home screen HTML
     */
    render() {
        return `
            <main class="home-container">
                ${this.renderLogo()}
                ${this.renderContent()}
                ${this.renderImage()}
            </main>
        `;
    }

    /**
     * Render logo section
     * @returns {string} Logo HTML
     */
    renderLogo() {
        return `
            <div class="home-logo">
                <img src="assets/images/Swift Logo.svg" alt="Swift Logo" />
            </div>
        `;
    }

    /**
     * Render main content with title, description and CTA
     * @returns {string} Content HTML
     */
    renderContent() {
        return `
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
                ${this.renderButton()}
            </div>
        `;
    }

    /**
     * Render call-to-action button
     * @returns {string} Button HTML
     */
    renderButton() {
        const buttonId = 'home-cta-button';

        // Setup button click handler asynchronously
        setTimeout(() => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', e => {
                    e.preventDefault();
                    this.router.navigate('login');
                });
            }
        }, 0);

        return `<button id="${buttonId}" class="home-button">Vamos nessa!</button>`;
    }

    /**
     * Render home image illustration
     * @returns {string} Image HTML
     */
    renderImage() {
        return `
            <div class="home-image-container">
                <img src="assets/images/Group 3.png" class="home-image" alt="Ilustração da jornada premiada" />
            </div>
        `;
    }

    /**
     * Setup event listeners for the home screen
     * (No additional events needed - button handler is setup in render)
     */
    setupEvents() {
        // No additional events to setup
    }
}
