class RankingComponent extends BaseComponent {
    constructor(element, options = {}) {
        super(element, options);
        
        this.state = {
            users: [],
            currentFilter: 'all',
            sortBy: 'points',
            timePeriod: 'alltime',
            isLoading: false
        };

        this.animationQueue = [];
    }

    getDefaults() {
        return {
            showFilters: true,
            showTimePeriods: true,
            animated: true,
            autoRefresh: true,
            refreshInterval: 10000,
            maxUsers: 20
        };
    }

    setupEventListeners() {
        // Listen to user changes
        this.unsubscribeUsers = stateManager.subscribe('users', (users) => {
            this.setState({ users: users || [] });
        }, { immediate: true });

        // Auto-refresh if enabled
        if (this.options.autoRefresh) {
            this.refreshInterval = setInterval(() => {
                this.simulateRealTimeUpdates();
            }, this.options.refreshInterval);
        }
    }

    template() {
        const { users, isLoading } = this.state;

        if (isLoading) {
            return this.renderLoadingState();
        }

        const sortedUsers = this.getSortedUsers();

        return `
            <div class="ranking-container">
                <div class="ranking-header">
                    <div class="ranking-title-section">
                        <h2>🏆 Rankings</h2>
                        <p class="ranking-subtitle">Veja como você está se saindo em relação aos outros colaboradores</p>
                    </div>
                </div>

                ${this.options.showFilters ? this.renderFilters() : ''}

                <div class="ranking-content">
                    <div class="ranking-list">
                        ${sortedUsers.map((user, index) => this.renderUserRank(user, index)).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderLoadingState() {
        return `
            <div class="ranking-loading">
                <div class="loading-spinner"></div>
                <p>Carregando rankings...</p>
            </div>
        `;
    }

    renderFilters() {
        const { currentFilter } = this.state;

        return `
            <div class="ranking-controls">
                <div class="filter-buttons">
                    <button class="btn btn-sm filter-btn ${currentFilter === 'all' ? 'active' : ''}" 
                            data-filter="all">Todos</button>
                    <button class="btn btn-sm filter-btn ${currentFilter === 'vendedores' ? 'active' : ''}" 
                            data-filter="vendedores">Vendedores</button>
                    <button class="btn btn-sm filter-btn ${currentFilter === 'supervisores' ? 'active' : ''}" 
                            data-filter="supervisores">Supervisores</button>
                    <button class="btn btn-sm filter-btn ${currentFilter === 'minha-loja' ? 'active' : ''}" 
                            data-filter="minha-loja">Minha Loja</button>
                </div>
                
                <div class="sort-controls">
                    <label>Ordenar por:</label>
                    <select class="sort-select">
                        <option value="points">Pontuação</option>
                        <option value="level">Nível</option>
                        <option value="achievements">Conquistas</option>
                        <option value="weekly">Performance Semanal</option>
                    </select>
                </div>

                ${this.options.showTimePeriods ? this.renderTimePeriods() : ''}
            </div>
        `;
    }

    renderTimePeriods() {
        const { timePeriod } = this.state;

        return `
            <div class="time-periods">
                <button class="btn btn-sm period-btn ${timePeriod === 'daily' ? 'active' : ''}" 
                        data-period="daily">Hoje</button>
                <button class="btn btn-sm period-btn ${timePeriod === 'weekly' ? 'active' : ''}" 
                        data-period="weekly">Esta Semana</button>
                <button class="btn btn-sm period-btn ${timePeriod === 'monthly' ? 'active' : ''}" 
                        data-period="monthly">Este Mês</button>
                <button class="btn btn-sm period-btn ${timePeriod === 'alltime' ? 'active' : ''}" 
                        data-period="alltime">Todos os Tempos</button>
            </div>
        `;
    }

    renderUserRank(user, index) {
        const position = index + 1;
        const weeklyPoints = Math.floor(user.points * 0.3 + Math.random() * 100);
        const performanceIndicator = this.getPerformanceIndicator(user, position);

        return `
            <div class="ranking-item" data-user-id="${user.id}">
                <div class="ranking-position ${position === 1 ? 'first' : position === 2 ? 'second' : position === 3 ? 'third' : ''}">${position}º</div>
                <div class="ranking-avatar">${user.name.charAt(0)}</div>
                <div class="ranking-info">
                    <div class="ranking-name">${user.name} ${performanceIndicator}</div>
                    <div class="ranking-details">${user.position} - ${user.store}</div>
                    <div class="ranking-extra">
                        <span class="badge badge-primary">Nível ${user.level}</span>
                        <span class="badge badge-warning">+${weeklyPoints} esta semana</span>
                    </div>
                </div>
                <div class="ranking-score">
                    <div>${user.points} pts</div>
                    <div class="score-trend">${this.getTrendIcon(user)}</div>
                </div>
            </div>
        `;
    }

    getSortedUsers() {
        let { users, currentFilter, sortBy } = this.state;
        let filteredUsers = [...users];

        // Filtrage
        switch (currentFilter) {
            case 'vendedores':
                filteredUsers = filteredUsers.filter(user => user.position.includes('Vendedor'));
                break;
            case 'supervisores':
                filteredUsers = filteredUsers.filter(user => user.position.includes('Supervisor'));
                break;
            case 'minha-loja':
                const currentUser = stateManager.getState('currentUser');
                if (currentUser) {
                    filteredUsers = filteredUsers.filter(user => user.store === currentUser.store);
                }
                break;
        }

        // Sorting
        switch (sortBy) {
            case 'points':
                filteredUsers.sort((a, b) => b.points - a.points);
                break;
            case 'level':
                filteredUsers.sort((a, b) => b.level - a.level);
                break;
            case 'achievements':
                filteredUsers.sort((a, b) => b.achievements.length - a.achievements.length);
                break;
            case 'weekly':
                filteredUsers.sort((a, b) => b.points * 0.8 - a.points * 0.8);
                break;
        }

        return filteredUsers.slice(0, this.options.maxUsers);
    }

    init() {
        this.setupFilterControls();
        this.setupSortControls();
        this.animateRankingEntries();
        this.startLeaderboardUpdates();
    }

    setupFilterControls() {
        const filtersHTML = `
            <div class="ranking-controls">
                <div class="filter-buttons">
                    <button class="btn btn-sm filter-btn active" data-filter="all">Todos</button>
                    <button class="btn btn-sm filter-btn" data-filter="vendedores">Vendedores</button>
                    <button class="btn btn-sm filter-btn" data-filter="supervisores">Supervisores</button>
                    <button class="btn btn-sm filter-btn" data-filter="minha-loja">Minha Loja</button>
                </div>
                <div class="sort-controls">
                    <label>Ordenar por:</label>
                    <select class="sort-select">
                        <option value="points">Pontuação</option>
                        <option value="level">Nível</option>
                        <option value="achievements">Conquistas</option>
                        <option value="weekly">Performance Semanal</option>
                    </select>
                </div>
            </div>
        `;

        const rankingCard = document.querySelector('.card .card-header');
        if (rankingCard) {
            rankingCard.insertAdjacentHTML('afterend', filtersHTML);
        }

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                this.handleFilterChange(e.target.dataset.filter);
            });
        });

        const sortSelect = document.querySelector('.sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', e => {
                this.handleSortChange(e.target.value);
            });
        }
    }

    setupSortControls() {
        const timePeriodsHTML = `
            <div class="time-periods">
                <button class="btn btn-sm period-btn active" data-period="daily">Hoje</button>
                <button class="btn btn-sm period-btn" data-period="weekly">Esta Semana</button>
                <button class="btn btn-sm period-btn" data-period="monthly">Este Mês</button>
                <button class="btn btn-sm period-btn" data-period="alltime">Todos os Tempos</button>
            </div>
        `;

        const controlsContainer = document.querySelector('.ranking-controls');
        if (controlsContainer) {
            controlsContainer.insertAdjacentHTML('beforeend', timePeriodsHTML);
        }

        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                this.handlePeriodChange(e.target.dataset.period);
            });
        });
    }

    animateRankingEntries() {
        const rankingItems = document.querySelectorAll('.ranking-item');

        rankingItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-50px)';

            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';

                if (index < 3) {
                    setTimeout(() => {
                        item.classList.add('top-performer');
                    }, 500);
                }
            }, index * 100);
        });
    }

    handleFilterChange(filter) {
        this.currentFilter = filter;

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        this.filterAndRenderRanking();

        this.animateFilterTransition();
    }

    handleSortChange(sortBy) {
        this.sortBy = sortBy;
        this.filterAndRenderRanking();
        this.animateRankingEntries();
    }

    handlePeriodChange(period) {
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-period="${period}"]`).classList.add('active');

        this.loadPeriodData(period);
    }

    filterAndRenderRanking() {
        const allUsers = window.swiftApp.data.users;
        let filteredUsers = [...allUsers];

        switch (this.currentFilter) {
            case 'vendedores':
                filteredUsers = filteredUsers.filter(user => user.position.includes('Vendedor'));
                break;
            case 'supervisores':
                filteredUsers = filteredUsers.filter(user => user.position.includes('Supervisor'));
                break;
            case 'minha-loja':
                const currentUserStore = window.swiftApp.currentUser.store;
                filteredUsers = filteredUsers.filter(user => user.store === currentUserStore);
                break;
        }

        switch (this.sortBy) {
            case 'points':
                filteredUsers.sort((a, b) => b.points - a.points);
                break;
            case 'level':
                filteredUsers.sort((a, b) => b.level - a.level);
                break;
            case 'achievements':
                filteredUsers.sort((a, b) => b.achievements.length - a.achievements.length);
                break;
            case 'weekly':
                filteredUsers.sort((a, b) => b.points * 0.8 - a.points * 0.8);
                break;
        }

        this.renderFilteredRanking(filteredUsers);
    }

    renderFilteredRanking(users) {
        const container = document.querySelector('.card .ranking-item').parentElement;
        const controlsElement = container.querySelector('.ranking-controls');

        const rankingItems = container.querySelectorAll('.ranking-item');
        rankingItems.forEach(item => item.remove());

        const rankingHTML = users
            .map((user, index) => {
                const weeklyPoints = Math.floor(user.points * 0.3 + Math.random() * 100);
                const performanceIndicator = this.getPerformanceIndicator(user, index);

                return `
                <div class="ranking-item" data-user-id="${user.id}">
                    <div class="ranking-position ${index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : ''}">${index + 1}º</div>
                    <div class="ranking-avatar">${user.name.charAt(0)}</div>
                    <div class="ranking-info">
                        <div class="ranking-name">${user.name} ${performanceIndicator}</div>
                        <div class="ranking-details">${user.position} - ${user.store}</div>
                        <div class="ranking-extra">
                            <span class="badge badge-primary">Nível ${user.level}</span>
                            <span class="badge badge-warning">+${weeklyPoints} esta semana</span>
                        </div>
                    </div>
                    <div class="ranking-score">
                        <div>${user.points} pts</div>
                        <div class="score-trend">${this.getTrendIcon(user)}</div>
                    </div>
                </div>
            `;
            })
            .join('');

        controlsElement.insertAdjacentHTML('afterend', rankingHTML);

        setTimeout(() => {
            this.animateRankingEntries();
        }, 100);
    }

    getPerformanceIndicator(user, position) {
        if (position === 0) return '👑';
        if (user.points > 3000) return '🔥';
        if (user.level >= 5) return '⭐';
        return '';
    }

    getTrendIcon(user) {
        const trends = ['📈', '📊', '📉'];

        if (user.points > 3000) return '<span style="color: var(--success-color);">📈</span>';
        if (user.points > 2500) return '<span style="color: var(--warning-color);">📊</span>';
        return '<span style="color: var(--danger-color);">📉</span>';
    }

    loadPeriodData(period) {
        const loadingHTML = `
            <div class="loading-overlay">
                <div class="spinner"></div>
                <p>Carregando dados de ${period}...</p>
            </div>
        `;

        const container = document.querySelector('.card');
        container.insertAdjacentHTML('beforeend', loadingHTML);

        setTimeout(() => {
            document.querySelector('.loading-overlay')?.remove();
            this.filterAndRenderRanking();
        }, 1000);
    }

    animateFilterTransition() {
        const rankingItems = document.querySelectorAll('.ranking-item');

        rankingItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                item.style.opacity = '0';
                item.style.transform = 'translateY(-20px)';
            }, index * 50);
        });
    }

    startLeaderboardUpdates() {
        setInterval(() => {
            this.simulateRealTimeUpdates();
        }, 10000);
    }

    simulateRealTimeUpdates() {
        const rankingItems = document.querySelectorAll('.ranking-item');

        if (Math.random() < 0.3) {
            const randomItem = rankingItems[Math.floor(Math.random() * rankingItems.length)];

            const scoreElement = randomItem.querySelector('.ranking-score div');
            const currentScore = parseInt(scoreElement.textContent);
            const newScore = currentScore + Math.floor(Math.random() * 50) + 10;

            scoreElement.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                scoreElement.textContent = `${newScore} pts`;
                scoreElement.style.animation = '';

                this.showScoreUpdate(randomItem, newScore - currentScore);
            }, 250);
        }
    }

    showScoreUpdate(item, pointsAdded) {
        const updateIndicator = document.createElement('div');
        updateIndicator.className = 'score-update';
        updateIndicator.textContent = `+${pointsAdded}`;
        updateIndicator.style.cssText = `
            position: absolute;
            top: -10px;
            right: 10px;
            background: var(--success-color);
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            animation: scoreUpdate 2s ease-out forwards;
            z-index: 10;
        `;

        item.style.position = 'relative';
        item.appendChild(updateIndicator);

        setTimeout(() => {
            updateIndicator.remove();
        }, 2000);
    }

    afterRender() {
        if (this.options.animated) {
            this.animateRankingEntries();
        }
        this.setupFilterControls();
        this.setupSortControls();
    }

    destroy() {
        // Remove subscriptions
        if (this.unsubscribeUsers) this.unsubscribeUsers();
        if (this.refreshInterval) clearInterval(this.refreshInterval);
        
        return super.destroy();
    }
}

// Register the component
ComponentFactory.register('ranking', RankingComponent);

const rankingStyles = `
    .ranking-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: var(--bg-secondary);
        border-radius: var(--border-radius);
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    .filter-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    .filter-btn, .period-btn {
        padding: 0.375rem 0.75rem;
        font-size: 0.875rem;
        border: 1px solid #dee2e6;
        background: white;
        color: var(--text-secondary);
        transition: all 0.3s ease;
    }
    
    .filter-btn.active, .period-btn.active {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }
    
    .sort-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .sort-select {
        padding: 0.375rem 0.75rem;
        border: 1px solid #dee2e6;
        border-radius: var(--border-radius);
        background: white;
    }
    
    .time-periods {
        display: flex;
        gap: 0.25rem;
        flex-wrap: wrap;
    }
    
    .ranking-extra {
        margin-top: 0.5rem;
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    .ranking-extra .badge {
        font-size: 0.7rem;
    }
    
    .score-trend {
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
    
    .top-performer {
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
        border-left: 3px solid gold;
    }
    
    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 100;
    }
    
    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes scoreUpdate {
        0% { opacity: 0; transform: translateY(10px); }
        20% { opacity: 1; transform: translateY(-5px); }
        80% { opacity: 1; transform: translateY(-5px); }
        100% { opacity: 0; transform: translateY(-20px); }
    }
    
    @media (max-width: 768px) {
        .ranking-controls {
            flex-direction: column;
            align-items: stretch;
        }
        
        .filter-buttons {
            justify-content: center;
        }
        
        .time-periods {
            justify-content: center;
        }
    }
`;

if (!document.getElementById('ranking-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'ranking-styles';
    styleSheet.textContent = rankingStyles;
    document.head.appendChild(styleSheet);
}

window.RankingComponent = RankingComponent;
