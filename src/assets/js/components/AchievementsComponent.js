/**
 * COMPONENTE ACHIEVEMENTS (CONQUISTAS)
 * Manage the achievements system of the Swift Gamification application
 */

class AchievementsComponent extends BaseComponent {
    constructor(element, options = {}) {
        super(element, options);

        this.state = {
            achievements: [],
            userAchievements: [],
            categories: ['all', 'sales', 'goals', 'teamwork', 'leadership'],
            selectedCategory: 'all',
            unlockedCount: 0,
            totalCount: 0,
            recentUnlocks: [],
            showOnlyUnlocked: false,
            sortBy: 'name', // 'name', 'difficulty', 'recent', 'points'
            isLoading: false
        };

        this.animationQueue = [];
        this.celebrationTimeout = null;
    }

    getDefaults() {
        return {
            showProgress: true,
            showCategories: true,
            showStats: true,
            animated: true,
            autoCheckProgress: true,
            checkInterval: 10000,
            showUnlockNotifications: true,
            compactMode: false,
            maxRecentUnlocks: 5
        };
    }

    init() {
        this.loadAchievementsData();
        return super.init();
    }

    setupEventListeners() {
        // Listen to changes of the current user
        this.unsubscribeUser = stateManager.subscribe(
            'currentUser',
            user => {
                this.setState({
                    userAchievements: user?.achievements || []
                });
                this.updateProgress();
            },
            { immediate: true }
        );

        // Auto-verification of progress
        if (this.options.autoCheckProgress) {
            this.progressCheckInterval = setInterval(() => {
                this.checkAchievementProgress();
            }, this.options.checkInterval);
        }

        this.setupActionListeners();
    }

    setupActionListeners() {
        // Category filters
        this.addEventListener('[data-action="filter-category"]', 'click', e => {
            const category = e.target.dataset.category;
            this.setCategory(category);
        });

        // Toggle unlocked achievements
        this.addEventListener('[data-action="toggle-unlocked"]', 'change', e => {
            this.setState({ showOnlyUnlocked: e.target.checked });
        });

        // Sorting
        this.addEventListener('[data-action="sort-achievements"]', 'change', e => {
            this.setSorting(e.target.value);
        });

        // Actions of achievements
        this.addEventListener('[data-action="view-achievement"]', 'click', e => {
            const achievementId = e.target.dataset.achievementId;
            this.showAchievementDetail(achievementId);
        });

        // Share achievement
        this.addEventListener('[data-action="share-achievement"]', 'click', e => {
            const achievementId = e.target.dataset.achievementId;
            this.shareAchievement(achievementId);
        });

        // Claim achievement manually (for test)
        this.addEventListener('[data-action="claim-achievement"]', 'click', e => {
            const achievementId = e.target.dataset.achievementId;
            this.claimAchievement(achievementId);
        });
    }

    template() {
        const { isLoading, achievements, selectedCategory } = this.state;

        if (isLoading) {
            return this.renderLoadingState();
        }

        const filteredAchievements = this.getFilteredAchievements();

        return `
            <div class="achievements-container ${this.options.compactMode ? 'compact' : ''}">
                ${this.options.showStats ? this.renderStatsHeader() : ''}
                
                <div class="achievements-header">
                    <div class="achievements-title-section">
                        <h2>🏅 Conquistas</h2>
                        <p class="achievements-subtitle">Desbloqueie conquistas e mostre seu progresso</p>
                    </div>
                </div>

                ${this.options.showCategories ? this.renderCategories() : ''}
                
                <div class="achievements-controls">
                    ${this.renderControls()}
                </div>

                <div class="achievements-grid">
                    ${
                        filteredAchievements.length > 0
                            ? filteredAchievements.map(achievement => this.renderAchievementCard(achievement)).join('')
                            : this.renderEmptyState()
                    }
                </div>

                ${this.renderRecentUnlocks()}
            </div>
        `;
    }

    renderStatsHeader() {
        const { unlockedCount, totalCount, userAchievements } = this.state;
        const progressPercent = totalCount > 0 ? ((unlockedCount / totalCount) * 100).toFixed(1) : 0;
        const totalPoints = this.calculateTotalPoints();

        return `
            <div class="achievements-stats">
                <div class="stat-card">
                    <div class="stat-icon">🏆</div>
                    <div class="stat-content">
                        <div class="stat-value">${unlockedCount}/${totalCount}</div>
                        <div class="stat-label">Conquistadas</div>
                        <div class="stat-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progressPercent}%"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-content">
                        <div class="stat-value">${progressPercent}%</div>
                        <div class="stat-label">Progresso</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">💎</div>
                    <div class="stat-content">
                        <div class="stat-value">${totalPoints}</div>
                        <div class="stat-label">Pontos Possíveis</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">⭐</div>
                    <div class="stat-content">
                        <div class="stat-value">${this.getRarityStats()}</div>
                        <div class="stat-label">Raras Desbloqueadas</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderCategories() {
        const { categories, selectedCategory } = this.state;

        const categoryLabels = {
            all: '🎯 Todas',
            sales: '💰 Vendas',
            goals: '🎯 Metas',
            teamwork: '👥 Trabalho em Equipe',
            leadership: '⭐ Liderança'
        };

        return `
            <div class="achievements-categories">
                ${categories
                    .map(
                        category => `
                    <button class="category-btn ${category === selectedCategory ? 'active' : ''}" 
                            data-action="filter-category" data-category="${category}">
                        ${categoryLabels[category] || category}
                    </button>
                `
                    )
                    .join('')}
            </div>
        `;
    }

    renderControls() {
        const { showOnlyUnlocked, sortBy } = this.state;

        return `
            <div class="achievements-filters">
                <label class="filter-toggle">
                    <input type="checkbox" ${showOnlyUnlocked ? 'checked' : ''} 
                           data-action="toggle-unlocked">
                    <span>Mostrar apenas desbloqueadas</span>
                </label>

                <select class="sort-select" data-action="sort-achievements">
                    <option value="name" ${sortBy === 'name' ? 'selected' : ''}>Nome (A-Z)</option>
                    <option value="difficulty" ${sortBy === 'difficulty' ? 'selected' : ''}>Dificuldade</option>
                    <option value="recent" ${sortBy === 'recent' ? 'selected' : ''}>Recentes primeiro</option>
                    <option value="points" ${sortBy === 'points' ? 'selected' : ''}>Pontos</option>
                </select>
            </div>
        `;
    }

    renderAchievementCard(achievement) {
        const { userAchievements } = this.state;
        const isUnlocked = userAchievements.includes(achievement.id);
        const progress = this.getAchievementProgress(achievement);

        return `
            <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'} ${achievement.rarity || 'common'}" 
                 data-achievement-id="${achievement.id}">
                 
                <div class="achievement-icon-container">
                    <div class="achievement-icon">
                        ${isUnlocked ? achievement.icon : '🔒'}
                    </div>
                    ${
                        achievement.rarity && isUnlocked
                            ? `
                        <div class="rarity-badge ${achievement.rarity}">${this.getRarityLabel(achievement.rarity)}</div>
                    `
                            : ''
                    }
                </div>

                <div class="achievement-content">
                    <div class="achievement-header">
                        <h3 class="achievement-name">
                            ${isUnlocked ? achievement.name : '???'}
                        </h3>
                        <div class="achievement-points">
                            ${achievement.points || 0} pts
                        </div>
                    </div>

                    <p class="achievement-description">
                        ${isUnlocked ? achievement.description : achievement.hint || 'Conquista bloqueada'}
                    </p>

                    ${
                        this.options.showProgress && !isUnlocked
                            ? this.renderAchievementProgress(achievement, progress)
                            : ''
                    }

                    <div class="achievement-meta">
                        <div class="achievement-category">
                            ${this.getCategoryIcon(achievement.category)} ${achievement.category || 'Geral'}
                        </div>
                        ${
                            isUnlocked
                                ? `
                            <div class="achievement-unlock-date">
                                Desbloqueada ${this.formatUnlockDate(achievement.unlockedAt)}
                            </div>
                        `
                                : ''
                        }
                    </div>

                    <div class="achievement-actions">
                        <button class="achievement-action-btn" data-action="view-achievement" 
                                data-achievement-id="${achievement.id}" title="Ver detalhes">
                            👁️
                        </button>
                        ${
                            isUnlocked
                                ? `
                            <button class="achievement-action-btn" data-action="share-achievement" 
                                    data-achievement-id="${achievement.id}" title="Compartilhar">
                                📤
                            </button>
                        `
                                : ''
                        }
                        ${
                            !isUnlocked && this.canClaimManually(achievement)
                                ? `
                            <button class="achievement-action-btn claim" data-action="claim-achievement" 
                                    data-achievement-id="${achievement.id}" title="Reivindicar">
                                ⚡
                            </button>
                        `
                                : ''
                        }
                    </div>
                </div>
            </div>
        `;
    }

    renderAchievementProgress(achievement, progress) {
        if (!progress || progress.current >= progress.target) return '';

        const progressPercent = (progress.current / progress.target) * 100;

        return `
            <div class="achievement-progress">
                <div class="progress-info">
                    <span>Progresso: ${progress.current}/${progress.target}</span>
                    <span>${progressPercent.toFixed(0)}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
            </div>
        `;
    }

    renderRecentUnlocks() {
        const { recentUnlocks } = this.state;

        if (!recentUnlocks.length) return '';

        return `
            <div class="recent-unlocks-section">
                <h3>🎉 Conquistas Recentes</h3>
                <div class="recent-unlocks">
                    ${recentUnlocks
                        .slice(0, this.options.maxRecentUnlocks)
                        .map(unlock => this.renderRecentUnlock(unlock))
                        .join('')}
                </div>
            </div>
        `;
    }

    renderRecentUnlock(unlock) {
        return `
            <div class="recent-unlock-item">
                <div class="unlock-icon">${unlock.achievement.icon}</div>
                <div class="unlock-info">
                    <div class="unlock-name">${unlock.achievement.name}</div>
                    <div class="unlock-time">${this.formatUnlockDate(unlock.timestamp)}</div>
                </div>
                <div class="unlock-points">+${unlock.achievement.points}pts</div>
            </div>
        `;
    }

    renderLoadingState() {
        return `
            <div class="achievements-loading">
                <div class="loading-spinner"></div>
                <p>Carregando conquistas...</p>
            </div>
        `;
    }

    renderEmptyState() {
        const { selectedCategory, showOnlyUnlocked } = this.state;

        return `
            <div class="achievements-empty">
                <div class="empty-icon">🏆</div>
                <h3>Nenhuma conquista encontrada</h3>
                <p>
                    ${
                        showOnlyUnlocked
                            ? 'Você ainda não desbloqueou conquistas nesta categoria.'
                            : 'Não há conquistas disponíveis nesta categoria.'
                    }
                </p>
            </div>
        `;
    }

    // Data and logic methods
    loadAchievementsData() {
        this.setState({ isLoading: true });

        // Simulate loading data
        setTimeout(() => {
            const achievements = this.getAllAchievements();
            this.setState({
                achievements,
                totalCount: achievements.length,
                isLoading: false
            });

            this.updateProgress();
        }, 500);
    }

    getAllAchievements() {
        return [
            {
                id: 'first-sale',
                name: 'Primeira Venda',
                description: 'Realize sua primeira venda',
                hint: 'Complete uma venda para desbloquear',
                icon: '🎉',
                category: 'sales',
                points: 100,
                rarity: 'common',
                requirements: { sales: 1 }
            },
            {
                id: 'sales-rookie',
                name: 'Vendedor Iniciante',
                description: 'Realize 10 vendas',
                hint: 'Continue vendendo para desbloquear',
                icon: '👋',
                category: 'sales',
                points: 200,
                rarity: 'common',
                requirements: { sales: 10 }
            },
            {
                id: 'monthly-goal',
                name: 'Meta Mensal',
                description: 'Complete sua meta mensal de vendas',
                hint: 'Atinja sua meta mensal',
                icon: '🏆',
                category: 'goals',
                points: 500,
                rarity: 'uncommon',
                requirements: { monthlyGoalComplete: true }
            },
            {
                id: 'team-player',
                name: 'Jogador de Equipe',
                description: 'Colabore ativamente com a equipe',
                hint: 'Participe de atividades em equipe',
                icon: '👥',
                category: 'teamwork',
                points: 300,
                rarity: 'common',
                requirements: { teamActivities: 5 }
            },
            {
                id: 'leadership',
                name: 'Liderança Natural',
                description: 'Demonstre qualidades de liderança',
                hint: 'Lidere projetos e ajude colegas',
                icon: '⭐',
                category: 'leadership',
                points: 750,
                rarity: 'rare',
                requirements: { leadershipActions: 3 }
            },
            {
                id: 'sales-master',
                name: 'Mestre das Vendas',
                description: 'Supere todas as expectativas de vendas',
                hint: 'Seja consistentemente excepcional',
                icon: '💰',
                category: 'sales',
                points: 1000,
                rarity: 'epic',
                requirements: { salesExcellence: 3 }
            },
            {
                id: 'mentor',
                name: 'Mentor',
                description: 'Ajude outros colaboradores a crescer',
                hint: 'Ensine e apoie seus colegas',
                icon: '🎓',
                category: 'leadership',
                points: 600,
                rarity: 'uncommon',
                requirements: { mentoring: 2 }
            },
            {
                id: 'customer-love',
                name: 'Amor do Cliente',
                description: 'Receba avaliações excepcionais dos clientes',
                hint: 'Mantenha alta satisfação do cliente',
                icon: '❤️',
                category: 'sales',
                points: 400,
                rarity: 'uncommon',
                requirements: { customerRating: 4.8 }
            },
            {
                id: 'consistent-performer',
                name: 'Performance Consistente',
                description: 'Mantenha alta performance por 3 meses',
                hint: 'Seja consistente ao longo do tempo',
                icon: '📈',
                category: 'goals',
                points: 800,
                rarity: 'rare',
                requirements: { consistentMonths: 3 }
            },
            {
                id: 'legend',
                name: 'Lenda da Swift',
                description: 'Alcance o status lendário na empresa',
                hint: 'Seja excepcional em todas as áreas',
                icon: '👑',
                category: 'leadership',
                points: 2000,
                rarity: 'legendary',
                requirements: { allAchievements: 8, level: 10 }
            }
        ];
    }

    getFilteredAchievements() {
        let { achievements, selectedCategory, showOnlyUnlocked, userAchievements, sortBy } = this.state;

        // Filter by category
        let filtered = achievements.filter(achievement => {
            if (selectedCategory === 'all') return true;
            return achievement.category === selectedCategory;
        });

        // Filter by unlocked
        if (showOnlyUnlocked) {
            filtered = filtered.filter(achievement => userAchievements.includes(achievement.id));
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'difficulty':
                    const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
                    return (rarityOrder[a.rarity] || 1) - (rarityOrder[b.rarity] || 1);
                case 'recent':
                    const aUnlocked = userAchievements.includes(a.id);
                    const bUnlocked = userAchievements.includes(b.id);
                    if (aUnlocked !== bUnlocked) return aUnlocked ? -1 : 1;
                    return b.unlockedAt - a.unlockedAt;
                case 'points':
                    return b.points - a.points;
                default:
                    return 0;
            }
        });

        return filtered;
    }

    updateProgress() {
        const { achievements, userAchievements } = this.state;
        const unlockedCount = userAchievements.length;

        this.setState({
            unlockedCount,
            totalCount: achievements.length
        });
    }

    getAchievementProgress(achievement) {
        // Simulate progress based on requirements
        if (!achievement.requirements) return null;

        const user = stateManager.getState('currentUser');
        if (!user) return null;

        // Example of progress calculation
        if (achievement.requirements.sales) {
            return {
                current: Math.min(user.salesCount || 0, achievement.requirements.sales),
                target: achievement.requirements.sales
            };
        }

        return null;
    }

    checkAchievementProgress() {
        const { achievements, userAchievements } = this.state;
        const user = stateManager.getState('currentUser');

        if (!user) return;

        achievements.forEach(achievement => {
            if (userAchievements.includes(achievement.id)) return;

            if (this.checkAchievementRequirements(achievement, user)) {
                this.unlockAchievement(achievement.id);
            }
        });
    }

    checkAchievementRequirements(achievement, user) {
        const req = achievement.requirements;
        if (!req) return false;

        // Example of checks
        if (req.sales && (user.salesCount || 0) < req.sales) return false;
        if (req.level && user.level < req.level) return false;
        if (req.customerRating && (user.averageRating || 0) < req.customerRating) return false;

        return true;
    }

    // Action methods
    setCategory(category) {
        this.setState({ selectedCategory: category });
        this.emit('categoryChanged', { category });
    }

    setSorting(sortBy) {
        this.setState({ sortBy });
        this.emit('sortChanged', { sortBy });
    }

    unlockAchievement(achievementId) {
        const achievement = this.state.achievements.find(a => a.id === achievementId);
        if (!achievement) return;

        // Update local state
        const updatedUserAchievements = [...this.state.userAchievements, achievementId];
        this.setState({ userAchievements: updatedUserAchievements });

        // Update global state
        stateManager.dispatch('ADD_ACHIEVEMENT', {
            userId: stateManager.getState('currentUser.id'),
            achievementId
        });

        // Add to recent
        const recentUnlock = {
            achievement: { ...achievement, unlockedAt: Date.now() },
            timestamp: Date.now()
        };

        const updatedRecent = [recentUnlock, ...this.state.recentUnlocks];
        this.setState({ recentUnlocks: updatedRecent });

        // Celebration
        if (this.options.animated) {
            this.celebrateUnlock(achievement);
        }

        // Notification
        if (this.options.showUnlockNotifications && window.headerComponent) {
            headerComponent.addNotification({
                type: 'achievement',
                title: 'Nova Conquista! 🏆',
                message: `Você desbloqueou "${achievement.name}"`,
                temporary: false
            });
        }

        this.emit('achievementUnlocked', { achievement });
    }

    claimAchievement(achievementId) {
        // For demonstration - normally would be automatically verified
        this.unlockAchievement(achievementId);
    }

    celebrateUnlock(achievement) {
        // Celebration animation
        const achievementCard = this.find(`[data-achievement-id="${achievement.id}"]`);
        if (achievementCard) {
            achievementCard.classList.add('celebrating');

            // Visual effect based on rarity
            const rarityEffects = {
                legendary: 'legendary-celebration',
                epic: 'epic-celebration',
                rare: 'rare-celebration'
            };

            const effectClass = rarityEffects[achievement.rarity];
            if (effectClass) {
                achievementCard.classList.add(effectClass);
            }

            this.celebrationTimeout = setTimeout(() => {
                achievementCard.classList.remove('celebrating');
                if (effectClass) {
                    achievementCard.classList.remove(effectClass);
                }
            }, 3000);
        }
    }

    showAchievementDetail(achievementId) {
        const achievement = this.state.achievements.find(a => a.id === achievementId);
        if (!achievement) return;

        this.emit('achievementDetailRequested', { achievement });
    }

    shareAchievement(achievementId) {
        const achievement = this.state.achievements.find(a => a.id === achievementId);
        if (!achievement) return;

        // Implement social sharing
        const message = `Acabei de desbloquear a conquista "${achievement.name}" na Swift Gamificação! 🏆`;

        if (navigator.share) {
            navigator.share({
                title: 'Nova Conquista Swift!',
                text: message,
                url: window.location.href
            });
        } else {
            // Fallback to copy to clipboard
            navigator.clipboard.writeText(message);

            if (window.headerComponent) {
                headerComponent.addNotification({
                    type: 'info',
                    title: 'Copiado!',
                    message: 'Mensagem copiada para a área de transferência'
                });
            }
        }

        this.emit('achievementShared', { achievement });
    }

    // Utility methods
    canClaimManually(achievement) {
        // For demonstration - allow claiming some achievements
        return ['first-sale', 'team-player'].includes(achievement.id);
    }

    getRarityLabel(rarity) {
        const labels = {
            common: 'Comum',
            uncommon: 'Incomum',
            rare: 'Raro',
            epic: 'Épico',
            legendary: 'Lendário'
        };
        return labels[rarity] || 'Comum';
    }

    getRarityStats() {
        const { userAchievements, achievements } = this.state;
        return achievements
            .filter(a => userAchievements.includes(a.id))
            .filter(a => ['rare', 'epic', 'legendary'].includes(a.rarity)).length;
    }

    getCategoryIcon(category) {
        const icons = {
            sales: '💰',
            goals: '🎯',
            teamwork: '👥',
            leadership: '⭐'
        };
        return icons[category] || '🎖️';
    }

    calculateTotalPoints() {
        return this.state.achievements.reduce((sum, achievement) => {
            return sum + (achievement.points || 0);
        }, 0);
    }

    formatUnlockDate(timestamp) {
        if (!timestamp) return 'Recentemente';

        const now = Date.now();
        const diff = now - timestamp;

        if (diff < 60000) return 'agora mesmo';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m atrás`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h atrás`;

        return new Date(timestamp).toLocaleDateString('pt-BR');
    }

    destroy() {
        // Remove subscriptions and timeouts
        if (this.unsubscribeUser) this.unsubscribeUser();
        if (this.progressCheckInterval) clearInterval(this.progressCheckInterval);
        if (this.celebrationTimeout) clearTimeout(this.celebrationTimeout);

        return super.destroy();
    }
}

// Register the component
ComponentFactory.register('achievements', AchievementsComponent);

// Export for global use
window.AchievementsComponent = AchievementsComponent;
