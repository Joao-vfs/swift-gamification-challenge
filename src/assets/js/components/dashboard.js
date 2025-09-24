/**
 * COMPONENT DASHBOARD REFACORED
 * Manage specific dashboard features using the new component system
 */

class DashboardComponent extends BaseComponent {
    constructor(element, options = {}) {
        super(element, options);
        
        this.state = {
            user: null,
            goals: [],
            achievements: [],
            stats: {},
            isLoading: false
        };

        this.charts = {};
        this.animationIntervals = {};
    }

    getDefaults() {
        return {
            showWelcome: true,
            showStats: true,
            showGoals: true,
            showAchievements: true,
            showChart: true,
            animated: true,
            autoRefresh: true,
            refreshInterval: 30000
        };
    }

    setupEventListeners() {
        // Listen to changes of the current user
        this.unsubscribeUser = stateManager.subscribe('currentUser', (user) => {
            this.setState({ user });
        }, { immediate: true });

        // Listen to changes of the goals
        this.unsubscribeGoals = stateManager.subscribe('goals', (goals) => {
            this.setState({ goals: goals || [] });
        }, { immediate: true });

        // Auto-refresh if enabled
        if (this.options.autoRefresh) {
            this.refreshInterval = setInterval(() => {
                this.refreshData();
            }, this.options.refreshInterval);
        }
    }

    template() {
        const { user, goals, isLoading } = this.state;
        const { showWelcome, showStats, showGoals, showAchievements, showChart } = this.options;

        if (isLoading || !user) {
            return this.renderLoadingState();
        }

        const completedGoals = goals.filter(g => g.status === 'completed').length;
        const totalGoals = goals.length;
        const progressPercentage = totalGoals > 0 ? ((completedGoals / totalGoals) * 100).toFixed(0) : 0;

        return `
            <div class="dashboard-container">
                ${showWelcome ? this.renderWelcomeSection() : ''}
                
                ${showStats ? this.renderStatsCards() : ''}
                
                <div class="dashboard-content-grid">
                    <div class="dashboard-left">
                        ${showGoals ? this.renderGoalsSection() : ''}
                        ${showChart ? this.renderChartSection() : ''}
                    </div>
                    
                    <div class="dashboard-right">
                        ${showAchievements ? this.renderAchievementsSection() : ''}
                    </div>
                </div>
            </div>
        `;
    }

    renderLoadingState() {
        return `
            <div class="dashboard-loading">
                <div class="loading-spinner"></div>
                <p>Carregando seu dashboard...</p>
            </div>
        `;
    }

    renderWelcomeSection() {
        const { user } = this.state;
        
        return `
            <div class="dashboard-welcome">
                <div class="welcome-content">
                    <h1>Olá, ${user.name}! 👋</h1>
                    <p class="welcome-subtitle">Bem-vindo ao seu painel de gamificação Swift</p>
                </div>
                <div class="welcome-avatar">
                    <div class="user-avatar">
                        ${user.avatar ? 
                            `<img src="${user.avatar}" alt="${user.name}">` : 
                            user.name.charAt(0).toUpperCase()
                        }
                    </div>
                </div>
            </div>
        `;
    }

    renderStatsCards() {
        const { user, goals } = this.state;
        const completedGoals = goals.filter(g => g.status === 'completed').length;
        const totalGoals = goals.length;
        const progressPercentage = totalGoals > 0 ? ((completedGoals / totalGoals) * 100).toFixed(0) : 0;

        return `
            <div class="dashboard-stats">
                <div class="stat-card points">
                    <div class="stat-icon">🏆</div>
                    <div class="stat-content">
                        <div class="stat-value">${user.points.toLocaleString()}</div>
                        <div class="stat-label">Pontos</div>
                    </div>
                </div>
                
                <div class="stat-card level">
                    <div class="stat-icon">📊</div>
                    <div class="stat-content">
                        <div class="stat-value">Nível ${user.level}</div>
                        <div class="stat-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(user.points % 1000) / 10}%"></div>
                            </div>
                            <small>${user.points % 1000}/1000 XP</small>
                        </div>
                    </div>
                </div>
                
                <div class="stat-card goals">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-content">
                        <div class="stat-value">${completedGoals}/${totalGoals}</div>
                        <div class="stat-label">Metas</div>
                        <div class="stat-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                            </div>
                            <small>${progressPercentage}% concluído</small>
                        </div>
                    </div>
                </div>

                <div class="stat-card achievements">
                    <div class="stat-icon">🏅</div>
                    <div class="stat-content">
                        <div class="stat-value">${user.achievements?.length || 0}</div>
                        <div class="stat-label">Conquistas</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderGoalsSection() {
        const { goals } = this.state;
        const activeGoals = goals.filter(g => g.status === 'in-progress').slice(0, 3);

        return `
            <div class="dashboard-section goals-section">
                <div class="section-header">
                    <h3>🎯 Metas em Andamento</h3>
                    <a href="#" data-route="metas" class="section-link">Ver todas</a>
                </div>
                
                <div class="goals-list">
                    ${activeGoals.length > 0 ? 
                        activeGoals.map(goal => this.renderGoalItem(goal)).join('') :
                        '<p class="empty-message">Nenhuma meta ativa</p>'
                    }
                </div>
            </div>
        `;
    }

    renderGoalItem(goal) {
        const progress = Math.min((goal.current / goal.target) * 100, 100);
        
        return `
            <div class="goal-item">
                <div class="goal-header">
                    <div class="goal-title">${goal.title}</div>
                    <div class="goal-points">+${goal.points} pts</div>
                </div>
                
                <div class="goal-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <small>${progress.toFixed(0)}% concluído</small>
                </div>
            </div>
        `;
    }

    renderAchievementsSection() {
        const { user } = this.state;
        const recentAchievements = user.achievements?.slice(0, 4) || [];

        return `
            <div class="dashboard-section achievements-section">
                <div class="section-header">
                    <h3>🏅 Conquistas Recentes</h3>
                    <a href="#" data-route="perfil" class="section-link">Ver todas</a>
                </div>
                
                <div class="achievements-list">
                    ${recentAchievements.length > 0 ? 
                        recentAchievements.map(achievementId => this.renderAchievementItem(achievementId)).join('') :
                        '<p class="empty-message">Nenhuma conquista ainda</p>'
                    }
                </div>
            </div>
        `;
    }

    renderAchievementItem(achievementId) {
        const achievement = this.getAchievementInfo(achievementId);
        
        return `
            <div class="achievement-item">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <small class="achievement-desc">${achievement.description}</small>
                </div>
            </div>
        `;
    }

    renderChartSection() {
        return `
            <div class="dashboard-section chart-section">
                <div class="section-header">
                    <h3>📈 Performance</h3>
                </div>
                <div id="performance-chart" class="chart-container">
                    <!-- Chart será renderizado aqui -->
                </div>
            </div>
        `;
    }

    afterRender() {
        if (this.options.showChart) {
            this.createPerformanceChart();
        }
        
        if (this.options.animated) {
            this.startRealTimeUpdates();
        }
        
        this.setupDashboardInteractions();
    }

    refreshData() {
        // Simulate refresh of data
        console.log('Atualizando dados do dashboard...');
    }

    getAchievementInfo(achievementId) {
        const achievements = {
            'first-sale': { name: 'Primeira Venda', icon: '🎉', description: 'Fez sua primeira venda' },
            'monthly-goal': { name: 'Meta Mensal', icon: '🏆', description: 'Atingiu a meta mensal' },
            'team-player': { name: 'Jogador de Equipe', icon: '👥', description: 'Colaborou ativamente com a equipe' },
            'leadership': { name: 'Liderança', icon: '⭐', description: 'Demonstrou qualidades de liderança' },
            'sales-master': { name: 'Mestre das Vendas', icon: '💰', description: 'Superou expectativas de vendas' },
            'mentor': { name: 'Mentor', icon: '🎓', description: 'Ajudou outros colaboradores' },
            'customer-love': { name: 'Amor do Cliente', icon: '❤️', description: 'Recebeu excelentes avaliações' },
            'consistent-performer': { name: 'Performance Consistente', icon: '📈', description: 'Manteve performance alta' }
        };
        
        return achievements[achievementId] || { name: 'Desconhecida', icon: '❓', description: 'Conquista desconhecida' };
    }

    init() {
        this.createPerformanceChart();
        this.startRealTimeUpdates();
        this.setupDashboardInteractions();
    }

    createPerformanceChart() {
        const chartContainer = document.getElementById('performance-chart');
        if (!chartContainer) return;

        const salesData = [
            { month: 'Jan', sales: 85 },
            { month: 'Fev', sales: 92 },
            { month: 'Mar', sales: 78 },
            { month: 'Abr', sales: 95 },
            { month: 'Mai', sales: 88 },
            { month: 'Jun', sales: 96 }
        ];

        const chartHTML = `
            <div class="chart-container">
                <h4>Performance de Vendas (Últimos 6 meses)</h4>
                <div class="bar-chart">
                    ${salesData
                        .map(
                            data => `
                        <div class="bar-container">
                            <div class="bar" style="height: ${data.sales}%; background: linear-gradient(135deg, var(--primary-color), var(--success-color));">
                                <span class="bar-value">${data.sales}%</span>
                            </div>
                            <span class="bar-label">${data.month}</span>
                        </div>
                    `
                        )
                        .join('')}
                </div>
            </div>
        `;

        chartContainer.innerHTML = chartHTML;

        setTimeout(() => {
            document.querySelectorAll('.bar').forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.animation = 'growUp 0.8s ease-out forwards';
                }, index * 100);
            });
        }, 500);
    }

    setupDashboardInteractions() {
        const pointsDisplay = document.querySelector('.points-display');
        if (pointsDisplay) {
            pointsDisplay.addEventListener('mouseenter', () => {
                this.showTooltip(pointsDisplay, 'Pontos ganhos através de vendas, metas e conquistas');
            });

            pointsDisplay.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        }

        document.querySelectorAll('.goal-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-3px)';
                card.style.boxShadow = 'var(--shadow-lg)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'var(--shadow-sm)';
            });
        });
    }

    startRealTimeUpdates() {
        this.animationIntervals.points = setInterval(() => {
            const pointsElement = document.querySelector('.points-display div div');
            if (pointsElement) {
                const currentPoints = parseInt(pointsElement.textContent);
                const randomIncrease = Math.random() < 0.3 ? Math.floor(Math.random() * 10) + 1 : 0;

                if (randomIncrease > 0) {
                    this.animatePointsIncrease(pointsElement, currentPoints, currentPoints + randomIncrease);
                }
            }
        }, 15000);

        this.animationIntervals.progress = setInterval(() => {
            this.updateProgressBars();
        }, 30000);
    }

    animatePointsIncrease(element, from, to) {
        const duration = 1000;
        const start = Date.now();

        const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);

            const currentValue = Math.floor(from + (to - from) * progress);
            element.textContent = currentValue.toLocaleString('pt-BR');

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.showPointsBonus(to - from);
            }
        };

        requestAnimationFrame(animate);
    }

    showPointsBonus(points) {
        const bonus = document.createElement('div');
        bonus.className = 'points-bonus';
        bonus.textContent = `+${points}`;
        bonus.style.cssText = `
            position: absolute;
            top: -20px;
            right: 10px;
            color: var(--success-color);
            font-weight: 700;
            font-size: 1.2rem;
            z-index: 1000;
            animation: floatUp 2s ease-out forwards;
            pointer-events: none;
        `;

        const pointsContainer = document.querySelector('.points-display').parentElement;
        pointsContainer.style.position = 'relative';
        pointsContainer.appendChild(bonus);

        setTimeout(() => {
            bonus.remove();
        }, 2000);
    }

    updateProgressBars() {
        document.querySelectorAll('.progress-fill').forEach(bar => {
            const currentWidth = parseFloat(bar.style.width) || 0;
            const randomIncrease = Math.random() < 0.2 ? Math.random() * 5 : 0;
            const newWidth = Math.min(currentWidth + randomIncrease, 100);

            if (newWidth > currentWidth) {
                bar.style.width = `${newWidth}%`;

                if (newWidth >= 100) {
                    bar.parentElement.parentElement.classList.add('animate-pulse');
                    setTimeout(() => {
                        bar.parentElement.parentElement.classList.remove('animate-pulse');
                    }, 2000);
                }
            }
        });
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--bg-dark);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: var(--border-radius);
            font-size: 0.875rem;
            z-index: 1000;
            white-space: nowrap;
            box-shadow: var(--shadow-md);
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            opacity: 0;
            animation: fadeIn 0.3s ease-out forwards;
        `;

        element.style.position = 'relative';
        element.appendChild(tooltip);
    }

    hideTooltip() {
        const tooltips = document.querySelectorAll('.tooltip');
        tooltips.forEach(tooltip => {
            tooltip.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                tooltip.remove();
            }, 300);
        });
    }

    destroy() {
        // Remove subscriptions
        if (this.unsubscribeUser) this.unsubscribeUser();
        if (this.unsubscribeGoals) this.unsubscribeGoals();
        if (this.refreshInterval) clearInterval(this.refreshInterval);
        
        // Clear animation intervals
        Object.values(this.animationIntervals).forEach(interval => {
            clearInterval(interval);
        });
        
        return super.destroy();
    }
}

// Register the component
ComponentFactory.register('dashboard', DashboardComponent);

const dashboardStyles = `
    .bar-chart {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        height: 200px;
        padding: 1rem 0;
        border-bottom: 2px solid #e9ecef;
        position: relative;
    }
    
    .bar-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        margin: 0 0.25rem;
    }
    
    .bar {
        width: 100%;
        max-width: 40px;
        background: var(--primary-color);
        border-radius: 4px 4px 0 0;
        position: relative;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 0.5rem;
        transition: all 0.3s ease;
    }
    
    .bar:hover {
        opacity: 0.8;
        transform: scale(1.05);
    }
    
    .bar-value {
        color: white;
        font-size: 0.75rem;
        font-weight: 600;
    }
    
    .bar-label {
        margin-top: 0.5rem;
        font-size: 0.75rem;
        color: var(--text-secondary);
        font-weight: 500;
    }
    
    @keyframes growUp {
        from { height: 0; }
        to { height: var(--target-height, 50%); }
    }
    
    @keyframes floatUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-30px);
        }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    .chart-container h4 {
        margin-bottom: 1rem;
        color: var(--text-primary);
        text-align: center;
    }
`;

if (!document.getElementById('dashboard-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'dashboard-styles';
    styleSheet.textContent = dashboardStyles;
    document.head.appendChild(styleSheet);
}

window.DashboardComponent = DashboardComponent;
