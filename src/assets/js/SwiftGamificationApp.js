/**
 * SWIFT GAMIFICAÇÃO - APP PRINCIPAL
 * Responsável por inicializar o StateManager e o Router.
 */
class SwiftGamificationApp {
    constructor() {
        this.router = new Router('#content');
    }

    init() {
        console.log('🚀 Inicializando Swift Gamificação...');
        this.registerRoutes();
        this.router.init();

        document.dispatchEvent(new CustomEvent('app:initialized'));
        console.log('✅ Aplicação inicializada com sucesso!');
    }

    registerRoutes() {
        this.router.addRoute('home', {
            title: 'Jornada Premiada',
            component: HomeComponent,
        });

        this.router.addRoute('login', {
            title: 'Login',
            component: LoginComponent,
            guard: commonGuards.redirectIfAuth,
        });

        this.router.addRoute('register', {
            title: 'Cadastro',
            component: RegisterComponent,
            guard: commonGuards.redirectIfAuth,
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.swiftApp = new SwiftGamificationApp();
    window.swiftApp.init();
});