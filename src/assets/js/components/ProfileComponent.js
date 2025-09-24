/**
 * COMPONENT PROFILE
 * Manages the profile and user information in the Swift Gamification application
 */

class ProfileComponent extends BaseComponent {
    constructor(element, options = {}) {
        super(element, options);

        this.state = {
            user: null,
            isEditing: false,
            activeTab: 'overview',
            achievements: [],
            statistics: {},
            activityHistory: [],
            isLoading: false,
            hasChanges: false
        };

        this.originalUserData = null;
    }

    getDefaults() {
        return {
            editable: true,
            showAchievements: true,
            showStatistics: true,
            showActivity: true,
            showProgress: true,
            tabs: ['overview', 'achievements', 'statistics', 'activity'],
            avatarUpload: true,
            autoSave: false,
            showPrivacySettings: true
        };
    }

    setupEventListeners() {
        // Listen to current user changes
        this.unsubscribeUser = stateManager.subscribe(
            'currentUser',
            user => {
                this.setState({ user: user ? { ...user } : null });
                this.originalUserData = user ? { ...user } : null;
                if (user) {
                    this.loadUserStatistics();
                    this.loadUserActivity();
                }
            },
            { immediate: true }
        );

        // Listen to achievements changes
        this.unsubscribeAchievements = stateManager.subscribe(
            'achievements',
            achievements => {
                this.setState({ achievements: achievements || [] });
            },
            { immediate: true }
        );

        this.setupActionListeners();
    }

    setupActionListeners() {
        // Navigation between tabs
        this.addEventListener('[data-action="switch-tab"]', 'click', e => {
            const tab = e.target.dataset.tab;
            this.switchTab(tab);
        });

        // Profile editing
        this.addEventListener('[data-action="edit-profile"]', 'click', () => {
            this.toggleEditMode(true);
        });

        this.addEventListener('[data-action="save-profile"]', 'click', () => {
            this.saveProfile();
        });

        this.addEventListener('[data-action="cancel-edit"]', 'click', () => {
            this.cancelEdit();
        });

        // Avatar upload
        this.addEventListener('[data-action="upload-avatar"]', 'click', () => {
            this.triggerAvatarUpload();
        });

        this.addEventListener('#avatar-input', 'change', e => {
            this.handleAvatarUpload(e);
        });

        // Form fields
        this.addEventListener('.profile-form input, .profile-form textarea, .profile-form select', 'input', () => {
            this.handleFieldChange();
        });

        // Reset password
        this.addEventListener('[data-action="change-password"]', 'click', () => {
            this.showPasswordChangeModal();
        });

        // Privacy settings
        this.addEventListener('[data-action="toggle-privacy"]', 'change', e => {
            this.handlePrivacyToggle(e);
        });
    }

    template() {
        const { user, isLoading, activeTab } = this.state;

        if (isLoading || !user) {
            return this.renderLoadingState();
        }

        return `
            <div class="profile-container">
                <div class="profile-header">
                    ${this.renderProfileHeader()}
                </div>

                <div class="profile-tabs">
                    ${this.renderTabs()}
                </div>

                <div class="profile-content">
                    ${this.renderTabContent(activeTab)}
                </div>
            </div>
        `;
    }

    renderProfileHeader() {
        const { user, isEditing } = this.state;
        const { editable } = this.options;

        return `
            <div class="profile-banner">
                <div class="profile-avatar-section">
                    <div class="profile-avatar-container">
                        <div class="profile-avatar-large">
                            ${
                                user.avatar
                                    ? `<img src="${user.avatar}" alt="${user.name}" class="avatar-img">`
                                    : `<span class="avatar-initials">${user.name.charAt(0).toUpperCase()}</span>`
                            }
                        </div>
                        
                        ${
                            editable && isEditing
                                ? `
                            <button class="avatar-upload-btn" data-action="upload-avatar" title="Alterar foto">
                                📷
                            </button>
                            <input type="file" id="avatar-input" accept="image/*" style="display: none;">
                        `
                                : ''
                        }
                    </div>

                    <div class="profile-basic-info">
                        ${isEditing ? this.renderEditableBasicInfo() : this.renderBasicInfo()}
                    </div>
                </div>

                <div class="profile-actions">
                    ${this.renderProfileActions()}
                </div>
            </div>

            <div class="profile-stats-banner">
                ${this.renderQuickStats()}
            </div>
        `;
    }

    renderBasicInfo() {
        const { user } = this.state;

        return `
            <div class="basic-info-display">
                <h1 class="profile-name">${user.name}</h1>
                <div class="profile-role">${user.position}</div>
                <div class="profile-location">📍 ${user.store}</div>
                <div class="profile-email">✉️ ${user.email}</div>
                ${user.bio ? `<p class="profile-bio">${user.bio}</p>` : ''}
            </div>
        `;
    }

    renderEditableBasicInfo() {
        const { user } = this.state;

        return `
            <div class="basic-info-form">
                <input type="text" class="form-input profile-name-input" 
                       value="${user.name}" placeholder="Nome completo">
                
                <select class="form-select profile-position-select">
                    <option value="Vendedor" ${user.position === 'Vendedor' ? 'selected' : ''}>Vendedor</option>
                    <option value="Supervisor" ${user.position === 'Supervisor' ? 'selected' : ''}>Supervisor</option>
                    <option value="Gerente" ${user.position === 'Gerente' ? 'selected' : ''}>Gerente</option>
                </select>
                
                <select class="form-select profile-store-select">
                    <option value="Swift Shopping Center" ${
                        user.store === 'Swift Shopping Center' ? 'selected' : ''
                    }>Swift Shopping Center</option>
                    <option value="Swift Plaza Norte" ${
                        user.store === 'Swift Plaza Norte' ? 'selected' : ''
                    }>Swift Plaza Norte</option>
                    <option value="Swift Mall Sul" ${
                        user.store === 'Swift Mall Sul' ? 'selected' : ''
                    }>Swift Mall Sul</option>
                </select>
                
                <input type="email" class="form-input profile-email-input" 
                       value="${user.email}" placeholder="Email">
                
                <textarea class="form-textarea profile-bio-input" 
                          placeholder="Conte um pouco sobre você...">${user.bio || ''}</textarea>
            </div>
        `;
    }

    renderProfileActions() {
        const { isEditing, hasChanges } = this.state;
        const { editable } = this.options;

        if (!editable) return '';

        if (isEditing) {
            return `
                <div class="profile-edit-actions">
                    <button class="btn btn-success" data-action="save-profile" 
                            ${!hasChanges ? 'disabled' : ''}>
                        💾 Salvar
                    </button>
                    <button class="btn btn-secondary" data-action="cancel-edit">
                        ❌ Cancelar
                    </button>
                </div>
            `;
        }

        return `
            <div class="profile-view-actions">
                <button class="btn btn-primary" data-action="edit-profile">
                    ✏️ Editar Perfil
                </button>
                <button class="btn btn-secondary" data-action="change-password">
                    🔒 Alterar Senha
                </button>
            </div>
        `;
    }

    renderQuickStats() {
        const { user, statistics } = this.state;

        return `
            <div class="quick-stats">
                <div class="stat-item">
                    <div class="stat-icon">🏆</div>
                    <div class="stat-info">
                        <div class="stat-value">${user.points.toLocaleString()}</div>
                        <div class="stat-label">Pontos</div>
                    </div>
                </div>

                <div class="stat-item">
                    <div class="stat-icon">📊</div>
                    <div class="stat-info">
                        <div class="stat-value">Nível ${user.level}</div>
                        <div class="stat-label">Atual</div>
                    </div>
                </div>

                <div class="stat-item">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-info">
                        <div class="stat-value">${statistics.completedGoals || 0}</div>
                        <div class="stat-label">Metas Completas</div>
                    </div>
                </div>

                <div class="stat-item">
                    <div class="stat-icon">🏅</div>
                    <div class="stat-info">
                        <div class="stat-value">${user.achievements?.length || 0}</div>
                        <div class="stat-label">Conquistas</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderTabs() {
        const { activeTab } = this.state;
        const { tabs } = this.options;

        const tabLabels = {
            overview: 'Visão Geral',
            achievements: 'Conquistas',
            statistics: 'Estatísticas',
            activity: 'Atividade'
        };

        return `
            <div class="tab-navigation">
                ${tabs
                    .map(
                        tab => `
                    <button class="tab-btn ${tab === activeTab ? 'active' : ''}" 
                            data-action="switch-tab" data-tab="${tab}">
                        ${tabLabels[tab]}
                    </button>
                `
                    )
                    .join('')}
            </div>
        `;
    }

    renderTabContent(tab) {
        switch (tab) {
            case 'overview':
                return this.renderOverviewTab();
            case 'achievements':
                return this.renderAchievementsTab();
            case 'statistics':
                return this.renderStatisticsTab();
            case 'activity':
                return this.renderActivityTab();
            default:
                return '<div>Conteúdo não encontrado</div>';
        }
    }

    renderOverviewTab() {
        const { user } = this.state;

        return `
            <div class="tab-content overview-tab">
                <div class="overview-grid">
                    <div class="overview-card">
                        <h3>📈 Progresso do Nível</h3>
                        ${this.renderLevelProgress()}
                    </div>

                    <div class="overview-card">
                        <h3>🎯 Metas Recentes</h3>
                        ${this.renderRecentGoals()}
                    </div>

                    <div class="overview-card">
                        <h3>🏅 Últimas Conquistas</h3>
                        ${this.renderRecentAchievements()}
                    </div>

                    <div class="overview-card">
                        <h3>⚙️ Configurações</h3>
                        ${this.renderProfileSettings()}
                    </div>
                </div>
            </div>
        `;
    }

    renderLevelProgress() {
        const { user } = this.state;
        const pointsInLevel = user.points % 1000;
        const progressPercent = (pointsInLevel / 1000) * 100;
        const pointsToNextLevel = 1000 - pointsInLevel;

        return `
            <div class="level-progress">
                <div class="level-info">
                    <span class="current-level">Nível ${user.level}</span>
                    <span class="next-level">Nível ${user.level + 1}</span>
                </div>
                
                <div class="progress-bar-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
                
                <div class="progress-details">
                    <small>${pointsInLevel}/1000 XP • ${pointsToNextLevel} para o próximo nível</small>
                </div>
            </div>
        `;
    }

    renderRecentGoals() {
        const goals = stateManager.getState('goals') || [];
        const recentGoals = goals.slice(0, 3);

        if (recentGoals.length === 0) {
            return '<p class="empty-message">Nenhuma meta encontrada</p>';
        }

        return `
            <div class="recent-goals">
                ${recentGoals
                    .map(
                        goal => `
                    <div class="goal-item-mini">
                        <div class="goal-icon">${goal.status === 'completed' ? '✅' : '⏳'}</div>
                        <div class="goal-info">
                            <div class="goal-title">${goal.title}</div>
                            <div class="goal-progress">${Math.round(
                                (goal.current / goal.target) * 100
                            )}% concluído</div>
                        </div>
                    </div>
                `
                    )
                    .join('')}
            </div>
        `;
    }

    renderRecentAchievements() {
        const { user } = this.state;
        const userAchievements = user.achievements || [];

        if (userAchievements.length === 0) {
            return '<p class="empty-message">Nenhuma conquista ainda</p>';
        }

        return `
            <div class="recent-achievements">
                ${userAchievements
                    .slice(0, 3)
                    .map(achievementId => {
                        const achievement = this.getAchievementInfo(achievementId);
                        return `
                        <div class="achievement-item-mini">
                            <span class="achievement-icon">${achievement.icon}</span>
                            <div class="achievement-info">
                                <div class="achievement-name">${achievement.name}</div>
                                <small class="achievement-desc">${achievement.description}</small>
                            </div>
                        </div>
                    `;
                    })
                    .join('')}
            </div>
        `;
    }

    renderProfileSettings() {
        return `
            <div class="profile-settings">
                <div class="setting-item">
                    <label class="setting-label">
                        <input type="checkbox" data-action="toggle-privacy" data-setting="publicProfile" checked>
                        <span>Perfil público</span>
                    </label>
                </div>
                
                <div class="setting-item">
                    <label class="setting-label">
                        <input type="checkbox" data-action="toggle-privacy" data-setting="showEmail">
                        <span>Mostrar email</span>
                    </label>
                </div>
                
                <div class="setting-item">
                    <label class="setting-label">
                        <input type="checkbox" data-action="toggle-privacy" data-setting="notifications" checked>
                        <span>Receber notificações</span>
                    </label>
                </div>
            </div>
        `;
    }

    renderAchievementsTab() {
        const { user, achievements } = this.state;
        const userAchievements = user.achievements || [];

        return `
            <div class="tab-content achievements-tab">
                <div class="achievements-grid">
                    ${
                        achievements.length > 0
                            ? achievements
                                  .map(achievement =>
                                      this.renderAchievementCard(achievement, userAchievements.includes(achievement.id))
                                  )
                                  .join('')
                            : this.renderAllAchievements(userAchievements)
                    }
                </div>
            </div>
        `;
    }

    renderAllAchievements(userAchievements) {
        const allAchievements = {
            'first-sale': { name: 'Primeira Venda', icon: '🎉', description: 'Fez sua primeira venda' },
            'monthly-goal': { name: 'Meta Mensal', icon: '🏆', description: 'Atingiu a meta mensal' },
            'team-player': { name: 'Jogador de Equipe', icon: '👥', description: 'Colaborou ativamente com a equipe' },
            leadership: { name: 'Liderança', icon: '⭐', description: 'Demonstrou qualidades de liderança' },
            'sales-master': { name: 'Mestre das Vendas', icon: '💰', description: 'Superou expectativas de vendas' },
            mentor: { name: 'Mentor', icon: '🎓', description: 'Ajudou outros colaboradores' },
            'customer-love': { name: 'Amor do Cliente', icon: '❤️', description: 'Recebeu excelentes avaliações' },
            'consistent-performer': {
                name: 'Performance Consistente',
                icon: '📈',
                description: 'Manteve performance alta'
            }
        };

        return Object.entries(allAchievements)
            .map(([id, achievement]) =>
                this.renderAchievementCard({ ...achievement, id }, userAchievements.includes(id))
            )
            .join('');
    }

    renderAchievementCard(achievement, isUnlocked) {
        return `
            <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${isUnlocked ? achievement.icon : '🔒'}</div>
                <div class="achievement-content">
                    <h4 class="achievement-name">${achievement.name}</h4>
                    <p class="achievement-description">${achievement.description}</p>
                    <div class="achievement-status">
                        ${
                            isUnlocked
                                ? '<span class="status-unlocked">✅ Conquistada</span>'
                                : '<span class="status-locked">🔒 Bloqueada</span>'
                        }
                    </div>
                </div>
            </div>
        `;
    }

    renderStatisticsTab() {
        const { statistics } = this.state;

        return `
            <div class="tab-content statistics-tab">
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>📊 Vendas</h3>
                        <div class="stat-value-large">${statistics.totalSales || 0}</div>
                        <div class="stat-trend positive">↗️ +15% este mês</div>
                    </div>

                    <div class="stat-card">
                        <h3>⭐ Avaliação Média</h3>
                        <div class="stat-value-large">${statistics.averageRating || '4.8'}</div>
                        <div class="rating-stars">${'⭐'.repeat(5)}</div>
                    </div>

                    <div class="stat-card">
                        <h3>🎯 Taxa de Conclusão</h3>
                        <div class="stat-value-large">${statistics.completionRate || '87'}%</div>
                        <div class="stat-trend positive">↗️ +8% este mês</div>
                    </div>

                    <div class="stat-card">
                        <h3>⏱️ Tempo Médio</h3>
                        <div class="stat-value-large">${statistics.averageTime || '12'}min</div>
                        <div class="stat-description">por atendimento</div>
                    </div>
                </div>

                <div class="performance-chart">
                    <h3>📈 Performance dos Últimos 6 Meses</h3>
                    ${this.renderPerformanceChart()}
                </div>
            </div>
        `;
    }

    renderPerformanceChart() {
        const monthlyData = [
            { month: 'Jun', sales: 85, rating: 4.6 },
            { month: 'Jul', sales: 92, rating: 4.7 },
            { month: 'Ago', sales: 78, rating: 4.5 },
            { month: 'Set', sales: 95, rating: 4.8 },
            { month: 'Out', sales: 88, rating: 4.7 },
            { month: 'Nov', sales: 96, rating: 4.9 }
        ];

        return `
            <div class="chart-container">
                <div class="chart-bars">
                    ${monthlyData
                        .map(
                            data => `
                        <div class="chart-bar-container">
                            <div class="chart-bar" 
                                 style="height: ${data.sales}%"
                                 title="${data.month}: ${data.sales}% vendas, ${data.rating} ⭐">
                            </div>
                            <div class="chart-label">${data.month}</div>
                        </div>
                    `
                        )
                        .join('')}
                </div>
            </div>
        `;
    }

    renderActivityTab() {
        const { activityHistory } = this.state;

        return `
            <div class="tab-content activity-tab">
                <div class="activity-timeline">
                    ${
                        activityHistory.length > 0
                            ? activityHistory.map(activity => this.renderActivityItem(activity)).join('')
                            : this.renderMockActivity()
                    }
                </div>
            </div>
        `;
    }

    renderMockActivity() {
        const mockActivities = [
            {
                type: 'achievement',
                title: 'Nova conquista desbloqueada',
                description: 'Mentor',
                time: '2 horas atrás',
                icon: '🏅'
            },
            {
                type: 'goal',
                title: 'Meta completada',
                description: 'Meta de Vendas Mensais',
                time: '1 dia atrás',
                icon: '🎯'
            },
            { type: 'level', title: 'Novo nível alcançado', description: 'Nível 5', time: '3 dias atrás', icon: '⬆️' },
            { type: 'sale', title: 'Venda realizada', description: 'R$ 2.500,00', time: '5 dias atrás', icon: '💰' }
        ];

        return mockActivities.map(activity => this.renderActivityItem(activity)).join('');
    }

    renderActivityItem(activity) {
        return `
            <div class="activity-item ${activity.type}">
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `;
    }

    renderLoadingState() {
        return `
            <div class="profile-loading">
                <div class="loading-spinner"></div>
                <p>Carregando perfil...</p>
            </div>
        `;
    }

    // Action methods
    switchTab(tab) {
        this.setState({ activeTab: tab });
        this.emit('tabChanged', { tab });
    }

    toggleEditMode(editing) {
        this.setState({ isEditing: editing });

        if (editing) {
            this.emit('editStarted');
        } else {
            this.emit('editEnded');
        }
    }

    handleFieldChange() {
        this.setState({ hasChanges: true });
    }

    saveProfile() {
        const formData = this.collectFormData();

        // Update state
        stateManager.setState({
            currentUser: { ...this.state.user, ...formData }
        });

        this.setState({
            isEditing: false,
            hasChanges: false
        });

        this.originalUserData = { ...this.state.user };

        this.emit('profileSaved', { user: this.state.user });
    }

    cancelEdit() {
        // Restore original data
        this.setState({
            user: { ...this.originalUserData },
            isEditing: false,
            hasChanges: false
        });

        this.emit('editCancelled');
    }

    collectFormData() {
        const nameInput = this.find('.profile-name-input');
        const positionSelect = this.find('.profile-position-select');
        const storeSelect = this.find('.profile-store-select');
        const emailInput = this.find('.profile-email-input');
        const bioTextarea = this.find('.profile-bio-input');

        return {
            name: nameInput?.value || this.state.user.name,
            position: positionSelect?.value || this.state.user.position,
            store: storeSelect?.value || this.state.user.store,
            email: emailInput?.value || this.state.user.email,
            bio: bioTextarea?.value || this.state.user.bio || ''
        };
    }

    triggerAvatarUpload() {
        const input = this.find('#avatar-input');
        input?.click();
    }

    handleAvatarUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = event => {
                const user = { ...this.state.user, avatar: event.target.result };
                this.setState({ user, hasChanges: true });
            };
            reader.readAsDataURL(file);
        }
    }

    handlePrivacyToggle(e) {
        const setting = e.target.dataset.setting;
        const value = e.target.checked;

        this.emit('privacyChanged', { setting, value });
    }

    showPasswordChangeModal() {
        this.emit('passwordChangeRequested');
    }

    // Utility methods
    getAchievementInfo(achievementId) {
        const achievements = {
            'first-sale': { name: 'Primeira Venda', icon: '🎉', description: 'Fez sua primeira venda' },
            'monthly-goal': { name: 'Meta Mensal', icon: '🏆', description: 'Atingiu a meta mensal' },
            'team-player': { name: 'Jogador de Equipe', icon: '👥', description: 'Colaborou ativamente com a equipe' },
            leadership: { name: 'Liderança', icon: '⭐', description: 'Demonstrou qualidades de liderança' },
            'sales-master': { name: 'Mestre das Vendas', icon: '💰', description: 'Superou expectativas de vendas' },
            mentor: { name: 'Mentor', icon: '🎓', description: 'Ajudou outros colaboradores' },
            'customer-love': { name: 'Amor do Cliente', icon: '❤️', description: 'Recebeu excelentes avaliações' },
            'consistent-performer': {
                name: 'Performance Consistente',
                icon: '📈',
                description: 'Manteve performance alta'
            }
        };

        return (
            achievements[achievementId] || { name: 'Desconhecida', icon: '❓', description: 'Conquista desconhecida' }
        );
    }

    loadUserStatistics() {
        // Simulate loading statistics
        setTimeout(() => {
            this.setState({
                statistics: {
                    totalSales: 42,
                    averageRating: 4.8,
                    completionRate: 87,
                    averageTime: 12,
                    completedGoals: 8
                }
            });
        }, 500);
    }

    loadUserActivity() {
        // Simulate loading activity
        setTimeout(() => {
            this.setState({
                activityHistory: []
            });
        }, 500);
    }

    destroy() {
        // Remove subscriptions
        if (this.unsubscribeUser) this.unsubscribeUser();
        if (this.unsubscribeAchievements) this.unsubscribeAchievements();

        return super.destroy();
    }
}

// Register the component
ComponentFactory.register('profile', ProfileComponent);

// Export for global use
window.ProfileComponent = ProfileComponent;
