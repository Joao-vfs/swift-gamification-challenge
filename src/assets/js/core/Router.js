class Router {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.routes = new Map();
        this.currentComponent = null;
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    init() {
        window.addEventListener('hashchange', this.handleRouteChange);
        this.handleRouteChange();
    }

    addRoute(name, config) {
        this.routes.set(name, config);
    }

    async handleRouteChange() {
        const routeName = window.location.hash.slice(1) || 'home';
        const route = this.routes.get(routeName) || this.routes.get('not-found');


        if (route.guard) {
            const redirectRoute = await route.guard();
            if (redirectRoute) {
                this.navigate(redirectRoute);
                return;
            }
        }

        if (this.currentComponent) {
            this.currentComponent.destroy();
        }

        document.title = route.title || 'Swift Gamificação';
        this.currentComponent = new route.component(this.container);
        this.currentComponent.init();
    }

    navigate(routeName) {
        window.location.hash = routeName;
    }
}


const commonGuards = {
    requireAuth: () => {
        if (!stateManager.getState('currentUser')) {
            return 'login';
        }
        return null;
    },
    redirectIfAuth: () => {
        if (stateManager.getState('currentUser')) {
            return 'home';
        }
        return null;
    }
};

window.Router = Router;
window.commonGuards = commonGuards;