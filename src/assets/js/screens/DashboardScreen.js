import { MOCK_DASHBOARD_DATA } from '../utils/mockData.js';

export class DashboardScreen {
    constructor(router) {
        this.router = router;
        this.data = MOCK_DASHBOARD_DATA;
    }

    /**
     * Render dashboard screen
     * @returns {string} HTML da tela
     */
    render() {
        const user = this.router.getCurrentUser();

        if (!user) {
            this.router.navigate('login');
            return '';
        }

        return `
            <div class="dashboard-container">Dashboard</div>
        `;
    }

    setupEvents() {}
}
