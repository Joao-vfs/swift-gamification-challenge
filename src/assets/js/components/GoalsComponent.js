/**
 * COMPONENT GOALS (GOALS)
 * Manage the goals and objectives of the Swift Gamification application
 */

class GoalsComponent extends BaseComponent {
    constructor(element, options = {}) {
        super(element, options);

        this.state = {
            goals: [],
            filter: 'all', // 'all', 'active', 'completed', 'overdue'
            sortBy: 'deadline', // 'deadline', 'progress', 'points', 'title'
            sortOrder: 'asc',
            selectedGoal: null,
            isLoading: false,
            showCompletedGoals: true
        };

        this.progressAnimations = new Map();
    }

    getDefaults() {
        return {
            showCreateButton: true,
            showFilters: true,
            showStats: true,
            animated: true,
            autoRefresh: true,
            refreshInterval: 30000,
            maxGoalsPerPage: 10,
            showProgress: true,
            compactMode: false
        };
    }

    setupEventListeners() {
        // Listen to changes of the goals
        this.unsubscribeGoals = stateManager.subscribe(
            'goals',
            goals => {
                this.setState({ goals: goals || [] });
                if (this.options.animated) {
                    this.animateProgressBars();
                }
            },
            { immediate: true }
        );

        // Auto-refresh if enabled
        if (this.options.autoRefresh) {
            this.refreshInterval = setInterval(() => {
                this.refreshGoals();
            }, this.options.refreshInterval);
        }

        // Event listeners for interactions
        this.setupActionListeners();
    }

    setupActionListeners() {
        // Filters
        this.addEventListener('[data-action="filter-goals"]', 'click', e => {
            const filter = e.target.dataset.filter;
            this.setFilter(filter);
        });

        // Sorting
        this.addEventListener('[data-action="sort-goals"]', 'change', e => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            this.setSorting(sortBy, sortOrder);
        });

        // Actions of goals
        this.addEventListener('[data-action="complete-goal"]', 'click', e => {
            const goalId = parseInt(e.target.dataset.goalId);
            this.completeGoal(goalId);
        });

        this.addEventListener('[data-action="view-goal"]', 'click', e => {
            const goalId = parseInt(e.target.dataset.goalId);
            this.viewGoalDetails(goalId);
        });

        this.addEventListener('[data-action="edit-goal"]', 'click', e => {
            const goalId = parseInt(e.target.dataset.goalId);
            this.editGoal(goalId);
        });

        this.addEventListener('[data-action="delete-goal"]', 'click', e => {
            const goalId = parseInt(e.target.dataset.goalId);
            this.deleteGoal(goalId);
        });

        // Creation of new goal
        this.addEventListener('[data-action="create-goal"]', 'click', () => {
            this.showCreateGoalModal();
        });

        // Toggle visibility of completed goals
        this.addEventListener('[data-action="toggle-completed"]', 'click', () => {
            this.toggleCompletedGoals();
        });
    }

    template() {
        const { goals, filter, isLoading } = this.state;
        const { showCreateButton, showFilters, showStats, compactMode } = this.options;

        if (isLoading) {
            return this.renderLoadingState();
        }

        const filteredGoals = this.getFilteredGoals();
        const stats = this.calculateStats(goals);

        return `
            <div class="goals-container ${compactMode ? 'compact' : ''}">
                ${showStats ? this.renderStatsSection(stats) : ''}
                
                <div class="goals-header">
                    <div class="goals-title-section">
                        <h2>🎯 Suas Metas</h2>
                        <p class="goals-subtitle">Acompanhe seu progresso e conquiste seus objetivos</p>
                    </div>
                    
                    <div class="goals-actions">
                        ${
                            showCreateButton
                                ? `
                            <button class="btn btn-primary" data-action="create-goal">
                                <span class="btn-icon">➕</span>
                                Nova Meta
                            </button>
                        `
                                : ''
                        }
                    </div>
                </div>

                ${showFilters ? this.renderFilters() : ''}

                <div class="goals-content">
                    ${filteredGoals.length > 0 ? this.renderGoalsList(filteredGoals) : this.renderEmptyState()}
                </div>
            </div>
        `;
    }

    renderStatsSection(stats) {
        return `
            <div class="goals-stats">
                <div class="stat-card">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.total}</div>
                        <div class="stat-label">Total de Metas</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">✅</div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.completed}</div>
                        <div class="stat-label">Completadas</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">⏳</div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.inProgress}</div>
                        <div class="stat-label">Em Andamento</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">🏆</div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.totalPoints}</div>
                        <div class="stat-label">Pontos Possíveis</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderFilters() {
        const { filter, sortBy, sortOrder, showCompletedGoals } = this.state;

        return `
            <div class="goals-filters">
                <div class="filter-buttons">
                    <button class="filter-btn ${filter === 'all' ? 'active' : ''}" 
                            data-action="filter-goals" data-filter="all">
                        Todas
                    </button>
                    <button class="filter-btn ${filter === 'active' ? 'active' : ''}" 
                            data-action="filter-goals" data-filter="active">
                        Ativas
                    </button>
                    <button class="filter-btn ${filter === 'completed' ? 'active' : ''}" 
                            data-action="filter-goals" data-filter="completed">
                        Completadas
                    </button>
                    <button class="filter-btn ${filter === 'overdue' ? 'active' : ''}" 
                            data-action="filter-goals" data-filter="overdue">
                        Atrasadas
                    </button>
                </div>

                <div class="filter-controls">
                    <select class="sort-select" data-action="sort-goals" value="${sortBy}-${sortOrder}">
                        <option value="deadline-asc">Prazo (Próximo primeiro)</option>
                        <option value="deadline-desc">Prazo (Distante primeiro)</option>
                        <option value="progress-desc">Progresso (Maior primeiro)</option>
                        <option value="progress-asc">Progresso (Menor primeiro)</option>
                        <option value="points-desc">Pontos (Maior primeiro)</option>
                        <option value="points-asc">Pontos (Menor primeiro)</option>
                        <option value="title-asc">Nome (A-Z)</option>
                        <option value="title-desc">Nome (Z-A)</option>
                    </select>

                    <label class="toggle-completed">
                        <input type="checkbox" ${showCompletedGoals ? 'checked' : ''} 
                               data-action="toggle-completed">
                        <span>Mostrar completadas</span>
                    </label>
                </div>
            </div>
        `;
    }

    renderGoalsList(goals) {
        return `
            <div class="goals-list">
                ${goals.map(goal => this.renderGoalCard(goal)).join('')}
            </div>
        `;
    }

    renderGoalCard(goal) {
        const progress = Math.min((goal.current / goal.target) * 100, 100);
        const isCompleted = goal.status === 'completed';
        const isOverdue = this.isGoalOverdue(goal);
        const daysLeft = this.getDaysUntilDeadline(goal.deadline);

        return `
            <div class="goal-card ${goal.status} ${isOverdue ? 'overdue' : ''}" 
                 data-goal-id="${goal.id}">
                 
                <div class="goal-header">
                    <div class="goal-title-section">
                        <h3 class="goal-title">${goal.title}</h3>
                        <div class="goal-meta">
                            <span class="goal-category">${goal.category || 'Geral'}</span>
                            <span class="goal-deadline">
                                📅 ${this.formatDeadline(goal.deadline, daysLeft)}
                            </span>
                        </div>
                    </div>

                    <div class="goal-actions">
                        <button class="goal-action-btn" data-action="view-goal" 
                                data-goal-id="${goal.id}" title="Ver detalhes">
                            👁️
                        </button>
                        <button class="goal-action-btn" data-action="edit-goal" 
                                data-goal-id="${goal.id}" title="Editar">
                            ✏️
                        </button>
                        ${
                            !isCompleted
                                ? `
                            <button class="goal-action-btn success" data-action="complete-goal" 
                                    data-goal-id="${goal.id}" title="Marcar como completada">
                                ✅
                            </button>
                        `
                                : ''
                        }
                    </div>
                </div>

                <div class="goal-description">
                    ${goal.description}
                </div>

                ${this.options.showProgress ? this.renderGoalProgress(goal, progress) : ''}

                <div class="goal-footer">
                    <div class="goal-points">
                        <span class="points-icon">🏆</span>
                        <span class="points-value">${goal.points} pontos</span>
                    </div>

                    <div class="goal-status">
                        ${this.renderGoalStatus(goal, isOverdue, daysLeft)}
                    </div>
                </div>
            </div>
        `;
    }

    renderGoalProgress(goal, progress) {
        const progressId = `progress-${goal.id}`;

        return `
            <div class="goal-progress-section">
                <div class="progress-info">
                    <span class="progress-label">Progresso</span>
                    <span class="progress-value">${progress.toFixed(1)}%</span>
                </div>
                
                <div class="progress-bar-container">
                    <div class="progress-bar">
                        <div class="progress-fill" 
                             id="${progressId}"
                             style="width: 0%"
                             data-target-width="${progress}%">
                        </div>
                    </div>
                </div>

                <div class="progress-details">
                    <span class="current-value">${this.formatValue(goal.current, goal.type)}</span>
                    <span class="progress-separator">de</span>
                    <span class="target-value">${this.formatValue(goal.target, goal.type)}</span>
                </div>
            </div>
        `;
    }

    renderGoalStatus(goal, isOverdue, daysLeft) {
        if (goal.status === 'completed') {
            return `<span class="status-badge completed">✅ Completada</span>`;
        }

        if (isOverdue) {
            return `<span class="status-badge overdue">⏰ Atrasada</span>`;
        }

        if (daysLeft <= 3) {
            return `<span class="status-badge urgent">⚠️ Urgente</span>`;
        }

        return `<span class="status-badge active">⏳ Em Andamento</span>`;
    }

    renderLoadingState() {
        return `
            <div class="goals-loading">
                <div class="loading-spinner"></div>
                <p>Carregando suas metas...</p>
            </div>
        `;
    }

    renderEmptyState() {
        const { filter } = this.state;

        const messages = {
            all: {
                title: 'Nenhuma meta encontrada',
                message: 'Comece criando sua primeira meta para acompanhar seu progresso!',
                action: 'Criar primeira meta'
            },
            active: {
                title: 'Nenhuma meta ativa',
                message: 'Todas as suas metas foram completadas ou ainda não há metas ativas.',
                action: 'Ver todas as metas'
            },
            completed: {
                title: 'Nenhuma meta completada',
                message: 'Continue trabalhando nas suas metas ativas para vê-las aqui!',
                action: 'Ver metas ativas'
            },
            overdue: {
                title: 'Nenhuma meta atrasada',
                message: 'Parabéns! Você está em dia com todas as suas metas.',
                action: 'Ver todas as metas'
            }
        };

        const config = messages[filter] || messages.all;

        return `
            <div class="goals-empty-state">
                <div class="empty-icon">🎯</div>
                <h3>${config.title}</h3>
                <p>${config.message}</p>
                <button class="btn btn-primary" data-action="create-goal">
                    ${config.action}
                </button>
            </div>
        `;
    }

    // Methods of filtering and sorting
    getFilteredGoals() {
        let { goals, filter, sortBy, sortOrder, showCompletedGoals } = this.state;

        // Filter by status
        let filteredGoals = goals.filter(goal => {
            if (filter === 'active') {
                return goal.status === 'in-progress' || goal.status === 'pending';
            }
            if (filter === 'completed') {
                return goal.status === 'completed';
            }
            if (filter === 'overdue') {
                return this.isGoalOverdue(goal) && goal.status !== 'completed';
            }
            return true; // 'all'
        });

        // Remove completed if not should show
        if (!showCompletedGoals) {
            filteredGoals = filteredGoals.filter(goal => goal.status !== 'completed');
        }

        // Sort
        filteredGoals.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'deadline':
                    comparison = new Date(a.deadline) - new Date(b.deadline);
                    break;
                case 'progress':
                    const progressA = (a.current / a.target) * 100;
                    const progressB = (b.current / b.target) * 100;
                    comparison = progressA - progressB;
                    break;
                case 'points':
                    comparison = a.points - b.points;
                    break;
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                default:
                    comparison = 0;
            }

            return sortOrder === 'desc' ? -comparison : comparison;
        });

        return filteredGoals.slice(0, this.options.maxGoalsPerPage);
    }

    calculateStats(goals) {
        const completed = goals.filter(g => g.status === 'completed').length;
        const inProgress = goals.filter(g => g.status === 'in-progress').length;
        const totalPoints = goals.reduce((sum, goal) => sum + goal.points, 0);

        return {
            total: goals.length,
            completed,
            inProgress,
            totalPoints,
            completionRate: goals.length > 0 ? ((completed / goals.length) * 100).toFixed(1) : 0
        };
    }

    // Action methods
    setFilter(filter) {
        this.setState({ filter });
        this.emit('filterChanged', { filter });
    }

    setSorting(sortBy, sortOrder) {
        this.setState({ sortBy, sortOrder });
        this.emit('sortingChanged', { sortBy, sortOrder });
    }

    toggleCompletedGoals() {
        this.setState({ showCompletedGoals: !this.state.showCompletedGoals });
    }

    completeGoal(goalId) {
        stateManager.dispatch('COMPLETE_GOAL', goalId);
        this.emit('goalCompleted', { goalId });

        // Celebration animation
        this.celebrateGoalCompletion(goalId);
    }

    celebrateGoalCompletion(goalId) {
        const goalCard = this.find(`[data-goal-id="${goalId}"]`);
        if (goalCard) {
            goalCard.classList.add('celebrating');
            setTimeout(() => {
                goalCard.classList.remove('celebrating');
            }, 2000);
        }

        // Add notification of congratulations
        if (window.headerComponent) {
            const goal = this.state.goals.find(g => g.id === goalId);
            headerComponent.addNotification({
                type: 'success',
                title: 'Meta Completada! 🎉',
                message: `Parabéns! Você completou "${goal?.title}"`,
                temporary: false
            });
        }
    }

    viewGoalDetails(goalId) {
        const goal = this.state.goals.find(g => g.id === goalId);
        this.setState({ selectedGoal: goal });
        this.showGoalModal(goal, 'view');
    }

    editGoal(goalId) {
        const goal = this.state.goals.find(g => g.id === goalId);
        this.setState({ selectedGoal: goal });
        this.showGoalModal(goal, 'edit');
    }

    deleteGoal(goalId) {
        if (confirm('Tem certeza que deseja excluir esta meta?')) {
            const updatedGoals = this.state.goals.filter(g => g.id !== goalId);
            stateManager.setState({ goals: updatedGoals });
            this.emit('goalDeleted', { goalId });
        }
    }

    showCreateGoalModal() {
        this.showGoalModal(null, 'create');
    }

    showGoalModal(goal, mode) {
        // Implement modal to create/edit/view goal
        console.log(`Modal de meta (${mode}):`, goal);
        this.emit('modalRequested', { goal, mode });
    }

    refreshGoals() {
        this.setState({ isLoading: true });

        // Simulate refresh of data
        setTimeout(() => {
            this.setState({ isLoading: false });
        }, 1000);
    }

    // Utility methods
    isGoalOverdue(goal) {
        return goal.status !== 'completed' && new Date(goal.deadline) < new Date();
    }

    getDaysUntilDeadline(deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    formatDeadline(deadline, daysLeft) {
        if (daysLeft < 0) {
            return `Atrasada ${Math.abs(daysLeft)} dia(s)`;
        } else if (daysLeft === 0) {
            return 'Hoje';
        } else if (daysLeft === 1) {
            return 'Amanhã';
        } else if (daysLeft <= 7) {
            return `${daysLeft} dias`;
        } else {
            return new Date(deadline).toLocaleDateString('pt-BR');
        }
    }

    formatValue(value, type) {
        switch (type) {
            case 'currency':
                return new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(value);
            case 'percentage':
                return `${value}%`;
            case 'number':
                return value.toLocaleString('pt-BR');
            default:
                return value;
        }
    }

    // Animations
    animateProgressBars() {
        if (!this.options.animated) return;

        requestAnimationFrame(() => {
            this.findAll('.progress-fill').forEach(progressBar => {
                const targetWidth = progressBar.dataset.targetWidth;
                if (targetWidth) {
                    progressBar.style.width = targetWidth;
                }
            });
        });
    }

    afterRender() {
        if (this.options.animated) {
            // Animate the progress bars after rendering
            setTimeout(() => {
                this.animateProgressBars();
            }, 100);
        }
    }

    destroy() {
        // Remove subscriptions and intervals
        if (this.unsubscribeGoals) this.unsubscribeGoals();
        if (this.refreshInterval) clearInterval(this.refreshInterval);

        // Clear animations
        this.progressAnimations.clear();

        return super.destroy();
    }
}

// Register the component
ComponentFactory.register('goals', GoalsComponent);

// Export for global use
window.GoalsComponent = GoalsComponent;
