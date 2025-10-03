/**
 * Mock Data for Dashboard
 * Contains sample data for development and testing purposes
 */

export const MOCK_USERS = [];

const loggedUser = JSON.parse(localStorage.getItem('swift_logged_user')) || { name: 'John Doe' };

export const MOCK_DASHBOARD_DATA = {
    // User profile information
    userInfo: {
        name: loggedUser.name,
        role: 'Vendedor',
        ranking: '5º Colocado da loja',
        store: 'Loja Paulista'
    },

    // User statistics and progress
    userStats: {
        monthPoints: 2350,
        monthPointsProgress: 75,
        totalPoints: 7800,
        totalPointsProgress: 75
    },

    // Key Performance Indicators
    kpis: [
        {
            id: 1,
            title: 'RECEITA GERADA',
            value: '83.000',
            percentage: 82,
            icon: 'fa-box'
        },
        {
            id: 2,
            title: 'CROSS-SELL',
            value: '56',
            percentage: 84,
            icon: 'fa-hdd'
        },
        {
            id: 3,
            title: 'ITEMS/TICKET',
            value: '3.2',
            percentage: 80,
            icon: 'fa-line-chart'
        }
    ],

    // Daily and weekly missions
    missions: {
        daily: [
            {
                id: 1,
                product: 'Sassami Empanado',
                target: 4,
                current: 2,
                points: 150,
                expiresIn: '2 dias'
            },
            {
                id: 2,
                product: 'Peito de Frango',
                target: 8,
                current: 8,
                points: 220,
                expiresIn: '3 dias'
            },
            {
                id: 3,
                product: 'Linguiça Toscana',
                target: 6,
                current: 1,
                points: 180,
                expiresIn: '1 dia'
            }
        ],
        weekly: [
            {
                id: 4,
                product: 'Picanha Bovina',
                target: 10,
                current: 10,
                points: 500,
                expiresIn: '5 dias'
            },
            {
                id: 5,
                product: 'Costela Suína',
                target: 12,
                current: 4,
                points: 450,
                expiresIn: '7 dias'
            },
            {
                id: 6,
                product: 'Filé de Tilápia',
                target: 15,
                current: 8,
                points: 550,
                expiresIn: '6 dias'
            },
            {
                id: 7,
                product: 'Alcatra Premium',
                target: 8,
                current: 0,
                points: 400,
                expiresIn: '4 dias'
            },
            {
                id: 8,
                product: 'Maminha Fatiada',
                target: 18,
                current: 18,
                points: 650,
                expiresIn: '5 dias'
            },
            {
                id: 9,
                product: 'Fraldinha',
                target: 20,
                current: 12,
                points: 700,
                expiresIn: '6 dias'
            }
        ]
    },

    // Overall statistics
    stats: {
        totalPoints: 1250,
        monthlyGoals: { completed: 8, total: 10 },
        rankingPosition: 3,
        achievements: 5
    },

    // User achievements/badges
    achievements: [
        {
            id: 1,
            icon: '⭐',
            title: 'Vendedor Estrela',
            description: 'Meta de vendas atingida'
        },
        {
            id: 2,
            icon: '🎯',
            title: 'Pontualidade',
            description: '7 dias consecutivos no horário'
        },
        {
            id: 3,
            icon: '🏆',
            title: 'Top Performer',
            description: 'Entre os 3 melhores do mês'
        }
    ],

    // Leaderboard ranking
    ranking: [
        {
            position: 1,
            name: 'Ana Costa',
            points: 1450
        },
        {
            position: 2,
            name: 'Pedro Lima',
            points: 1380
        },
        {
            position: 3,
            name: 'Você',
            points: 1250,
            isCurrentUser: true
        },
        {
            position: 4,
            name: 'Carlos Oliveira',
            points: 1180
        }
    ]
};

// Demo credentials for testing
export const DEMO_CREDENTIALS = [
    {
        id: 'demo1',
        codigoLoja: '001',
        codigoFuncionario: '12345',
        cpf: '123.456.789-00',
        senha: '123456',
        label: 'Loja 001 - Funcionário 12345'
    },
    {
        id: 'demo2',
        codigoLoja: '002',
        codigoFuncionario: '54321',
        cpf: '987.654.321-00',
        senha: 'swift123',
        label: 'Loja 002 - Funcionário 54321'
    }
];
