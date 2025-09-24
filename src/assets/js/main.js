/**
 * SWIFT GAMIFICAÇÃO - APP PRINCIPAL
 * Gamification system for Swift's employees
 */

class SwiftGamificationApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.data = {
            users: [],
            goals: [],
            achievements: [],
            rankings: []
        };

        this.init();
    }

    init() {
        this.loadMockData();
        this.setupEventListeners();
        this.loadCurrentUser();
        this.renderCurrentPage();
    }

    loadMockData() {
        this.data.users = [
            {
                id: 1,
                name: 'Ana Silva',
                email: 'ana.silva@swift.com',
                position: 'Vendedora',
                store: 'Swift Shopping Center',
                points: 2850,
                level: 5,
                achievements: ['first-sale', 'monthly-goal', 'team-player']
            },
            {
                id: 2,
                name: 'Carlos Santos',
                email: 'carlos.santos@swift.com',
                position: 'Supervisor',
                store: 'Swift Plaza Norte',
                points: 3200,
                level: 6,
                achievements: ['leadership', 'sales-master', 'mentor']
            },
            {
                id: 3,
                name: 'Maria Oliveira',
                email: 'maria.oliveira@swift.com',
                position: 'Vendedora',
                store: 'Swift Shopping Center',
                points: 2650,
                level: 4,
                achievements: ['customer-love', 'consistent-performer']
            }
        ];

        this.data.goals = [
            {
                id: 1,
                title: 'Meta de Vendas Mensais',
                description: 'Alcançar R$ 15.000 em vendas este mês',
                target: 15000,
                current: 12500,
                deadline: '2025-09-30',
                points: 500,
                status: 'in-progress'
            },
            {
                id: 2,
                title: 'Atendimento ao Cliente',
                description: 'Manter avaliação média acima de 4.5 estrelas',
                target: 4.5,
                current: 4.7,
                deadline: '2025-09-30',
                points: 300,
                status: 'completed'
            },
            {
                id: 3,
                title: 'Capacitação Técnica',
                description: 'Completar curso de vendas avançadas',
                target: 1,
                current: 0.75,
                deadline: '2025-10-15',
                points: 400,
                status: 'in-progress'
            }
        ];

        this.currentUser = this.data.users[0];
    }

    setupEventListeners() {
        document.querySelectorAll('.navbar a').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const page = e.target.getAttribute('href').substring(1);
                this.navigateTo(page);
            });
        });

        setInterval(() => {
            this.updateData();
        }, 30000);
    }

    loadCurrentUser() {
        const userData = localStorage.getItem('swiftGamification_currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    navigateTo(page) {
        this.currentPage = page;
        this.updateNavigation();
        this.renderCurrentPage();
    }

    updateNavigation() {
        document.querySelectorAll('.navbar a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${this.currentPage}`) {
                link.classList.add('active');
            }
        });
    }

    renderCurrentPage() {
        const contentDiv = document.getElementById('content');

        switch (this.currentPage) {
            case 'dashboard':
                contentDiv.innerHTML = this.renderDashboard();
                break;
            case 'rankings':
                contentDiv.innerHTML = this.renderRankings();
                break;
            case 'metas':
                contentDiv.innerHTML = this.renderGoals();
                break;
            case 'perfil':
                contentDiv.innerHTML = this.renderProfile();
                break;
            default:
                contentDiv.innerHTML = this.renderDashboard();
        }

        contentDiv.classList.add('animate-fade-in');
        setTimeout(() => {
            contentDiv.classList.remove('animate-fade-in');
        }, 600);
    }

    renderDashboard() {
        const user = this.currentUser;
        const completedGoals = this.data.goals.filter(g => g.status === 'completed').length;
        const totalGoals = this.data.goals.length;
        const progressPercentage = ((completedGoals / totalGoals) * 100).toFixed(0);

        return `
            <div class="row">
                <div class="col-12">
                    <h1>Olá, ${user.name}! 👋</h1>
                    <p class="text-secondary">Bem-vindo ao seu painel de gamificação Swift</p>
                </div>
            </div>
            
            <div class="row">
                <div class="col-4">
                    <div class="card">
                        <div class="points-display">
                            <span class="points-icon">🏆</span>
                            <div>
                                <div>${user.points}</div>
                                <small>Pontos</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-4">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Nível Atual</h3>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; color: var(--primary-color);">${user.level}</div>
                            <div class="progress-container">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${(user.points % 1000) / 10}%"></div>
                                </div>
                                <small class="text-secondary">${user.points % 1000}/1000 XP para próximo nível</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-4">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Progresso das Metas</h3>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; color: var(--success-color);">${completedGoals}/${totalGoals}</div>
                            <div class="progress-container">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                                </div>
                                <small class="text-secondary">${progressPercentage}% concluído</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-6">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Metas em Andamento</h3>
                        </div>
                        ${this.renderGoalsList(true)}
                    </div>
                </div>
                
                <div class="col-6">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Conquistas Recentes</h3>
                        </div>
                        ${this.renderAchievements()}
                    </div>
                </div>
            </div>
        `;
    }

    renderRankings() {
        const sortedUsers = [...this.data.users].sort((a, b) => b.points - a.points);

        return `
            <div class="row">
                <div class="col-12">
                    <h1>🏆 Rankings</h1>
                    <p class="text-secondary">Veja como você está se saindo em relação aos outros colaboradores</p>
                </div>
            </div>
            
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Ranking Geral de Pontuação</h3>
                        </div>
                        ${sortedUsers
                            .map(
                                (user, index) => `
                            <div class="ranking-item">
                                <div class="ranking-position ${index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : ''}">${index + 1}º</div>
                                <div class="ranking-avatar">${user.name.charAt(0)}</div>
                                <div class="ranking-info">
                                    <div class="ranking-name">${user.name}</div>
                                    <div class="ranking-details">${user.position} - ${user.store}</div>
                                </div>
                                <div class="ranking-score">${user.points} pts</div>
                            </div>
                        `
                            )
                            .join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderGoals() {
        return `
            <div class="row">
                <div class="col-12">
                    <h1>🎯 Metas</h1>
                    <p class="text-secondary">Acompanhe suas metas e objetivos</p>
                </div>
            </div>
            
            <div class="row">
                <div class="col-12">
                    ${this.data.goals
                        .map(
                            goal => `
                        <div class="card goal-card ${goal.status}">
                            <div class="card-header">
                                <h3 class="card-title">${goal.title}</h3>
                                <span class="goal-status ${goal.status}">
                                    ${
                                        goal.status === 'completed'
                                            ? '✅ Concluída'
                                            : goal.status === 'in-progress'
                                              ? '⏳ Em Andamento'
                                              : '📋 Pendente'
                                    }
                                </span>
                            </div>
                            <p>${goal.description}</p>
                            <div class="progress-container">
                                <div class="progress-label">
                                    <span>Progresso</span>
                                    <span>${((goal.current / goal.target) * 100).toFixed(0)}%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${(goal.current / goal.target) * 100}%"></div>
                                </div>
                            </div>
                            <div style="margin-top: 1rem;">
                                <small class="text-secondary">Prazo: ${new Date(goal.deadline).toLocaleDateString('pt-BR')}</small>
                                <span class="badge badge-warning" style="float: right;">${goal.points} pontos</span>
                            </div>
                        </div>
                    `
                        )
                        .join('')}
                </div>
            </div>
        `;
    }

    renderProfile() {
        const user = this.currentUser;

        return `
            <div class="row">
                <div class="col-12">
                    <h1>👤 Perfil</h1>
                    <p class="text-secondary">Suas informações e conquistas</p>
                </div>
            </div>
            
            <div class="row">
                <div class="col-4">
                    <div class="card">
                        <div style="text-align: center;">
                            <div class="ranking-avatar" style="width: 100px; height: 100px; font-size: 2rem; margin: 0 auto 1rem;">
                                ${user.name.charAt(0)}
                            </div>
                            <h3>${user.name}</h3>
                            <p class="text-secondary">${user.position}</p>
                            <p class="text-secondary">${user.store}</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-8">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Estatísticas</h3>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <div style="text-align: center; padding: 1rem;">
                                    <div style="font-size: 2rem; color: var(--primary-color);">${user.points}</div>
                                    <small>Total de Pontos</small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div style="text-align: center; padding: 1rem;">
                                    <div style="font-size: 2rem; color: var(--success-color);">${user.level}</div>
                                    <small>Nível Atual</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Conquistas</h3>
                        </div>
                        ${this.renderUserAchievements(user.achievements)}
                    </div>
                </div>
            </div>
        `;
    }

    renderGoalsList(dashboardMode = false) {
        const goals = dashboardMode
            ? this.data.goals.filter(g => g.status === 'in-progress').slice(0, 3)
            : this.data.goals;

        return goals
            .map(
                goal => `
            <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #e9ecef;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong>${goal.title}</strong>
                    <span class="badge badge-warning">${goal.points} pts</span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="height: 8px;">
                        <div class="progress-fill" style="width: ${(goal.current / goal.target) * 100}%"></div>
                    </div>
                </div>
                <small class="text-secondary">${((goal.current / goal.target) * 100).toFixed(0)}% concluído</small>
            </div>
        `
            )
            .join('');
    }

    renderAchievements() {
        const achievements = [
            { id: 'first-sale', name: 'Primeira Venda', icon: '🎉' },
            { id: 'monthly-goal', name: 'Meta Mensal', icon: '🏆' },
            { id: 'team-player', name: 'Jogador de Equipe', icon: '👥' },
            { id: 'customer-love', name: 'Amor do Cliente', icon: '❤️' }
        ];

        return achievements
            .map(
                achievement => `
            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                <span style="font-size: 2rem; margin-right: 1rem;">${achievement.icon}</span>
                <div>
                    <strong>${achievement.name}</strong>
                    <div class="text-secondary" style="font-size: 0.875rem;">Conquistado recentemente</div>
                </div>
            </div>
        `
            )
            .join('');
    }

    renderUserAchievements(userAchievements) {
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

        return userAchievements
            .map(achievementId => {
                const achievement = allAchievements[achievementId];
                return `
                <div style="display: flex; align-items: center; margin-bottom: 1rem; padding: 0.5rem; background: #f8f9fa; border-radius: 8px;">
                    <span style="font-size: 2rem; margin-right: 1rem;">${achievement.icon}</span>
                    <div>
                        <strong>${achievement.name}</strong>
                        <div class="text-secondary" style="font-size: 0.875rem;">${achievement.description}</div>
                    </div>
                </div>
            `;
            })
            .join('');
    }

    updateData() {
        console.log('Atualizando dados da aplicação...');
    }

    saveToLocalStorage() {
        localStorage.setItem('swiftGamification_currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('swiftGamification_data', JSON.stringify(this.data));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.swiftApp = new SwiftGamificationApp();
    console.log('🚀 Swift Gamificação App iniciado com sucesso!');
});
