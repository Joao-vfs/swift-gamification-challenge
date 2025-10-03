import { MOCK_DASHBOARD_DATA } from '../utils/mockData.js';
import { Toast } from '../utils/Toast.js';

/**
 * DashboardScreen - Main dashboard view for logged-in users
 * Displays KPIs, missions, user stats, and notifications
 */
export class DashboardScreen {
    constructor(router) {
        this.router = router;
        this.data = this.loadData();
        this.currentTab = 'daily';
    }

    /**
     * Load dashboard data from localStorage or use mock data
     * Integrates logged user data with dashboard information
     * @returns {Object} Dashboard data
     */
    loadData() {
        const savedMissions = localStorage.getItem('swiftMissions');
        const user = this.router.getCurrentUser();

        // Create a copy of mock data
        const dashboardData = { ...MOCK_DASHBOARD_DATA };

        // Load saved missions or use defaults
        if (savedMissions) {
            try {
                const missions = JSON.parse(savedMissions);
                dashboardData.missions = missions;
            } catch (error) {
                Toast.error('Erro ao carregar missões do banco de dados');
            }
        } else {
            this.saveMissions(MOCK_DASHBOARD_DATA.missions);
        }

        // Integrate logged user name into dashboard data
        if (user && user.name) {
            dashboardData.userInfo = {
                ...dashboardData.userInfo,
                name: user.name
            };
        }

        return dashboardData;
    }

    /**
     * Save missions to localStorage
     * @param {Object} missions - Object containing daily and weekly missions
     */
    saveMissions(missions) {
        localStorage.setItem('swiftMissions', JSON.stringify(missions));
    }

    /**
     * Render dashboard screen
     * @returns {string} Dashboard HTML
     */
    render() {
        const user = this.router.getCurrentUser();

        if (!user) {
            this.router.navigate('login');
            return '';
        }

        const { kpis, missions, userStats, userInfo } = this.data;

        return `
            <div class="dashboard-container">
                ${this.renderHeader(user, userInfo)}
                ${this.renderContent(userStats, userInfo, kpis, missions)}
            </div>
        `;
    }

    /**
     * Render main header with navigation and user menu
     * @param {Object} user - Current logged user
     * @param {Object} userInfo - User display information
     * @returns {string} Header HTML
     */
    renderHeader(user, userInfo) {
        return `
            <header class="main-header">
                <div class="header-left">
                    <img src="assets/images/Swift Logo.svg" alt="Swift Logo" class="header-logo">
                    <div class="header-divider"></div>
                    <span class="header-location">${userInfo.store}</span>
                </div>
                <div class="search-bar">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Pesquisar">
                </div>
                <div class="user-profile">
                    ${this.renderNotifications()}
                    ${this.renderUserMenu(user)}
                </div>
            </header>
        `;
    }

    /**
     * Render notifications dropdown
     * @returns {string} Notifications HTML
     */
    renderNotifications() {
        return `
            <div class="notification-icon" id="notification-btn">
                <i class="fas fa-bell"></i>
                <span class="notification-badge" />
            </div>
            <div class="notification-dropdown" id="notification-dropdown">
                <div class="notification-header">
                    <h4>Notificações</h4>
                    <button class="mark-all-read">Marcar todas como lidas</button>
                </div>
                <div class="notification-list">
                    ${this.renderNotificationItems()}
                </div>                                
            </div>
        `;
    }

    /**
     * Render notification items
     * @returns {string} Notification items HTML
     */
    renderNotificationItems() {
        const notifications = [
            {
                icon: 'fa-check-circle',
                type: 'success',
                title: 'Missão Concluída!',
                text: 'Você completou a missão "Venda 5 Swift Giga"',
                time: 'Há 2 horas',
                unread: true
            },
            {
                icon: 'fa-clock',
                type: 'warning',
                title: 'Missão Expirando!',
                text: 'A missão "Venda 10 Swift Turbo" expira em 2 dias',
                time: 'Há 5 horas',
                unread: true
            },
            {
                icon: 'fa-trophy',
                type: 'info',
                title: 'Novo Ranking!',
                text: 'Você subiu para o 3º lugar no ranking mensal',
                time: 'Ontem',
                unread: true
            },
            {
                icon: 'fa-gift',
                type: 'success',
                title: 'Recompensa Resgatada!',
                text: 'Você resgatou 50 pontos',
                time: 'Há 2 dias',
                unread: false
            }
        ];

        return notifications
            .map(
                notif => `
            <div class="notification-item ${notif.unread ? 'unread' : ''}">
                <div class="notification-icon-wrapper ${notif.type}">
                    <i class="fas ${notif.icon}"></i>
                </div>
                <div class="notification-content">
                    <p class="notification-text"><strong>${notif.title}</strong> ${notif.text}</p>
                    <span class="notification-time">${notif.time}</span>
                </div>
                ${notif.unread ? '<span class="unread-dot"></span>' : ''}
            </div>
        `
            )
            .join('');
    }

    /**
     * Render user menu dropdown
     * @param {Object} user - Current logged user
     * @returns {string} User menu HTML
     */
    renderUserMenu(user) {
        return `
            <div class="user-avatar" id="user-avatar-btn">
                <img src="https://i.pravatar.cc/40?u=${user.cpf}" alt="Avatar do Usuário">
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="user-dropdown" id="user-dropdown">
                <div class="user-dropdown-header">
                    <img src="https://i.pravatar.cc/60?u=${user.cpf}" alt="Avatar do Usuário">
                    <div class="user-dropdown-info">
                        <strong>${user.name}</strong>
                        <span>Código: ${user.codigoFuncionario}</span>
                    </div>
                </div>
                <div class="user-dropdown-menu">
                    <a href="#profile" class="dropdown-item">
                        <i class="fas fa-user"></i>
                        <span>Meu Perfil</span>
                    </a>
                    <a href="#settings" class="dropdown-item">
                        <i class="fas fa-cog"></i>
                        <span>Configurações</span>
                    </a>
                    <a href="#help" class="dropdown-item">
                        <i class="fas fa-question-circle"></i>
                        <span>Ajuda</span>
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="#logout" class="dropdown-item logout" id="logout-btn">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Sair</span>
                    </a>
                </div>
            </div>
        `;
    }

    /**
     * Render dashboard content (sidebar + main content)
     * @param {Object} userStats - User statistics
     * @param {Object} userInfo - User information
     * @param {Array} kpis - Key Performance Indicators
     * @param {Object} missions - Daily and weekly missions
     * @returns {string} Content HTML
     */
    renderContent(userStats, userInfo, kpis, missions) {
        return `
            <div class="dashboard-content">
                ${this.renderSidebar()}
                ${this.renderMainContent(userStats, userInfo, kpis, missions)}
            </div>
        `;
    }

    /**
     * Render sidebar navigation
     * @returns {string} Sidebar HTML
     */
    renderSidebar() {
        return `
            <aside class="sidebar">
                <nav class="sidebar-nav">
                    <ul>
                        <li class="active"><a href="#dashboard"><i class="fas fa-home"></i> Home</a></li>
                        <li class="disabled"><a href="#rankings"><i class="fas fa-medal"></i> Rankings</a></li>
                        <li class="disabled"><a href="#rewards"><i class="fas fa-gift"></i> Recompensas</a></li>
                    </ul>
                </nav>
            </aside>
        `;
    }

    /**
     * Render main content area
     * @param {Object} userStats - User statistics
     * @param {Object} userInfo - User information
     * @param {Array} kpis - Key Performance Indicators
     * @param {Object} missions - Daily and weekly missions
     * @returns {string} Main content HTML
     */
    renderMainContent(userStats, userInfo, kpis, missions) {
        return `
            <main class="main-content">
                <section class="content-body">
                    ${this.renderStatsOverview(userStats, userInfo)}
                    ${this.renderKPICards(kpis)}
                    ${this.renderMissionsSection(missions)}
                </section>
            </main>
        `;
    }

    /**
     * Render user statistics overview with progress circles
     * @param {Object} userStats - User statistics
     * @param {Object} userInfo - User information
     * @returns {string} Stats overview HTML
     */
    renderStatsOverview(userStats, userInfo) {
        return `
            <div class="stats-overview">
                ${this.renderProgressCircle(userStats.monthPoints, userStats.monthPointsProgress, 'Pontos no<br>Mês')}
                ${this.renderProgressCircle(userStats.totalPoints, userStats.totalPointsProgress, 'Pontos<br>Totais')}
                <div class="user-info">
                    <h3>${userInfo.name}</h3>
                    <p>${userInfo.role}</p>
                    <strong>${userInfo.ranking}</strong>
                </div>
            </div>
        `;
    }

    /**
     * Render individual progress circle
     * @param {number} value - Progress value
     * @param {number} progress - Progress percentage
     * @param {string} label - Circle label
     * @returns {string} Progress circle HTML
     */
    renderProgressCircle(value, progress, label) {
        return `
            <div class="circle-stat">
                <svg class="progress-ring" width="200" height="200" viewBox="0 0 200 200">
                    <circle class="progress-ring__circle-bg" stroke="#EBEBEB" stroke-width="24" fill="transparent" r="88" cx="100" cy="100" stroke-linecap="round"/>
                    <circle class="progress-ring__circle" data-progress="${progress}" stroke-width="24" fill="transparent" r="88" cx="100" cy="100" stroke-linecap="round"/>
                </svg>
                <div class="circle-text">
                    <strong>${value}</strong>
                    <span>${label}</span>
                </div>
            </div>
        `;
    }

    /**
     * Render KPI cards
     * @param {Array} kpis - Key Performance Indicators
     * @returns {string} KPI cards HTML
     */
    renderKPICards(kpis) {
        return `
            <div class="kpi-cards">
                ${kpis
                    .map(
                        kpi => `
                    <div class="kpi-card">
                        <div class="card-header">
                            <div class="icon-box">
                                <i class="fas ${kpi.icon}"></i>
                            </div>
                            <span class="percentage-badge">${kpi.percentage}%</span>
                        </div>
                        <div class="kpi-card-title">
                            <span>${kpi.title}</span>
                        </div>
                        <div class="card-body">
                            <span class="value">${
                                kpi.id === 1 ? `<strong class="currency">R$</strong>` : ''
                            } ${kpi.value} </span>
                        </div>
                        <div class="graph-icon">
                            <img src="assets/images/Vector 2.png" alt="Graph" />
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${kpi.percentage}%;"></div>
                        </div>
                    </div>
                `
                    )
                    .join('')}
            </div>
        `;
    }

    /**
     * Render missions section with tabs
     * @param {Object} missions - Daily and weekly missions
     * @returns {string} Missions section HTML
     */
    renderMissionsSection(missions) {
        return `
            <div class="missions-section">
                <div class="mission-tabs">
                    <button class="tab-link active" data-tab="daily">Missões Diárias</button>
                    <button class="tab-link" data-tab="weekly">Missões Semanais</button>
                </div>
                <div class="mission-list" id="mission-list">
                    ${this.renderMissions(missions.daily, 'daily')}
                </div>
            </div>
        `;
    }

    /**
     * Render mission cards
     * @param {Array} missions - List of missions
     * @param {string} missionType - Type of mission (daily or weekly)
     * @returns {string} Mission cards HTML
     */
    renderMissions(missions, missionType = 'daily') {
        if (!missions || missions.length === 0) {
            return `
                <div class="no-missions">
                    <p>🎉 Parabéns! Você completou todas as missões ${
                        missionType === 'daily' ? 'diárias' : 'semanais'
                    }!</p>
                </div>
            `;
        }

        return missions
            .map(mission => {
                const progressPercentage = (mission.current / mission.target) * 100;
                const canRedeem = mission.current >= mission.target;

                return `
                <div class="mission-card">
                    <div class="mission-card-header">
                        <h4>Venda ${mission.target} pacotes de <span class="highlight">${mission.product}</span></h4>
                        <span class="mission-points">${mission.points}Pts</span>
                    </div>
                    <p class="mission-description">Complete essa missão e ao finalizar resgate sua recompensa</p>
                    <div class="mission-expiry-status">
                        <span class="expiry"><i class="far fa-clock"></i> A recompensa expira em ${
                            mission.expiresIn
                        }</span>
                        ${!canRedeem ? '<span class="mission-status-blocked">Bloqueado</span>' : ''}
                    </div>
                    <div class="mission-footer">
                        <div class="mission-progress-info">
                            <span>Progresso:</span>
                            <span class="progress-count">${mission.current}/${mission.target} vendidos</span>
                        </div>
                        <button class="btn-rescue" ${!canRedeem ? 'disabled' : ''} data-mission-id="${
                    mission.id
                }" data-mission-type="${missionType}">Resgatar</button>
                    </div>
                </div>
            `;
            })
            .join('');
    }

    /**
     * Setup all event listeners for the dashboard
     */
    setupEvents() {
        this.setupProgressCircles();
        this.setupMissionTabs();
        this.setupRedeemButtons();
        this.setupSidebarLinks();
        this.setupNotificationDropdown();
        this.setupUserDropdown();
        this.setupLogout();
    }

    /**
     * Animate progress circles
     */
    setupProgressCircles() {
        const circles = document.querySelectorAll('.progress-ring__circle');

        circles.forEach(circle => {
            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            const progress = circle.dataset.progress;

            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = circumference;

            setTimeout(() => {
                const offset = circumference - (progress / 100) * circumference;
                circle.style.strokeDashoffset = offset;
            }, 100);
        });
    }

    /**
     * Setup mission tab switching
     */
    setupMissionTabs() {
        const tabs = document.querySelectorAll('.tab-link');
        const missionList = document.getElementById('mission-list');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const tabType = tab.dataset.tab;
                this.currentTab = tabType;
                const missions = tabType === 'daily' ? this.data.missions.daily : this.data.missions.weekly;

                missionList.innerHTML = this.renderMissions(missions, tabType);
                this.setupRedeemButtons();
            });
        });
    }

    /**
     * Setup sidebar navigation links
     */
    setupSidebarLinks() {
        const rankingsLink = document.querySelector('a[href="#rankings"]');
        const rewardsLink = document.querySelector('a[href="#rewards"]');

        if (rankingsLink) {
            rankingsLink.addEventListener('click', e => {
                e.preventDefault();
                Toast.info('⚠️ A funcionalidade de Rankings ainda está sendo desenvolvida!');
            });
        }

        if (rewardsLink) {
            rewardsLink.addEventListener('click', e => {
                e.preventDefault();
                Toast.info('⚠️ A funcionalidade de Recompensas ainda está sendo desenvolvida!');
            });
        }
    }

    /**
     * Setup mission redeem buttons
     */
    setupRedeemButtons() {
        const redeemButtons = document.querySelectorAll('.btn-rescue');

        redeemButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (!button.disabled) {
                    const missionId = parseInt(button.dataset.missionId);
                    const missionType = button.dataset.missionType;
                    this.redeemMission(missionId, missionType);
                }
            });
        });
    }

    /**
     * Redeem a completed mission
     * @param {number} missionId - ID of the mission to redeem
     * @param {string} missionType - Type of mission (daily or weekly)
     */
    redeemMission(missionId, missionType) {
        const mission = this.data.missions[missionType].find(m => m.id === missionId);

        if (!mission) {
            Toast.error('Missão não encontrada');
            return;
        }

        if (mission.current < mission.target) {
            Toast.warning('Você ainda não completou esta missão!');
            return;
        }

        // Remove mission from array
        this.data.missions[missionType] = this.data.missions[missionType].filter(m => m.id !== missionId);

        // Save to localStorage
        this.saveMissions(this.data.missions);

        Toast.success(`Parabéns! Você resgatou ${mission.points} pontos!`);

        // Re-render mission list
        this.updateMissionsList();
    }

    /**
     * Update displayed mission list
     */
    updateMissionsList() {
        const missionList = document.getElementById('mission-list');
        const missions = this.data.missions[this.currentTab];

        if (missionList) {
            missionList.innerHTML = this.renderMissions(missions, this.currentTab);
            this.setupRedeemButtons();
        }
    }

    /**
     * Setup notification dropdown functionality
     */
    setupNotificationDropdown() {
        const notificationBtn = document.getElementById('notification-btn');
        const notificationDropdown = document.getElementById('notification-dropdown');
        const markAllReadBtn = document.querySelector('.mark-all-read');

        if (notificationBtn && notificationDropdown) {
            notificationBtn.addEventListener('click', e => {
                e.stopPropagation();
                notificationDropdown.classList.toggle('show');
                
                // Close user dropdown if open
                const userDropdown = document.getElementById('user-dropdown');
                if (userDropdown) {
                    userDropdown.classList.remove('show');
                }
            });

            if (markAllReadBtn) {
                markAllReadBtn.addEventListener('click', () => {
                    const unreadItems = document.querySelectorAll('.notification-item.unread');
                    unreadItems.forEach(item => item.classList.remove('unread'));
                    
                    const badge = document.querySelector('.notification-badge');
                    if (badge) {
                        badge.textContent = '0';
                        badge.style.display = 'none';
                    }
                    Toast.success('Todas as notificações foram marcadas como lidas!');
                });
            }
        }
    }

    /**
     * Setup user dropdown menu functionality
     */
    setupUserDropdown() {
        const userAvatarBtn = document.getElementById('user-avatar-btn');
        const userDropdown = document.getElementById('user-dropdown');

        if (userAvatarBtn && userDropdown) {
            userAvatarBtn.addEventListener('click', e => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
                
                // Close notification dropdown if open
                const notificationDropdown = document.getElementById('notification-dropdown');
                if (notificationDropdown) {
                    notificationDropdown.classList.remove('show');
                }
            });

            // Setup menu item click handlers
            this.setupUserDropdownLinks(userDropdown);
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            if (userDropdown) userDropdown.classList.remove('show');
            const notificationDropdown = document.getElementById('notification-dropdown');
            if (notificationDropdown) notificationDropdown.classList.remove('show');
        });
    }

    /**
     * Setup user dropdown menu links
     * @param {HTMLElement} userDropdown - User dropdown element
     */
    setupUserDropdownLinks(userDropdown) {
        const profileLink = userDropdown.querySelector('a[href="#profile"]');
        const settingsLink = userDropdown.querySelector('a[href="#settings"]');
        const helpLink = userDropdown.querySelector('a[href="#help"]');

        if (profileLink) {
            profileLink.addEventListener('click', e => {
                e.preventDefault();
                Toast.info('⚠️ A funcionalidade de Perfil ainda está sendo desenvolvida!');
                userDropdown.classList.remove('show');
            });
        }

        if (settingsLink) {
            settingsLink.addEventListener('click', e => {
                e.preventDefault();
                Toast.info('⚠️ A funcionalidade de Configurações ainda está sendo desenvolvida!');
                userDropdown.classList.remove('show');
            });
        }

        if (helpLink) {
            helpLink.addEventListener('click', e => {
                e.preventDefault();
                Toast.info('⚠️ A funcionalidade de Ajuda ainda está sendo desenvolvida!');
                userDropdown.classList.remove('show');
            });
        }
    }

    /**
     * Setup logout button functionality
     */
    setupLogout() {
        const logoutBtn = document.getElementById('logout-btn');

        if (logoutBtn) {
            logoutBtn.addEventListener('click', e => {
                e.preventDefault();
                this.router.logout();
            });
        }
    }
}
