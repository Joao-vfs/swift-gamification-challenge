export const MOCK_USERS = [];

export const MOCK_DASHBOARD_DATA = {
    stats: {
        totalPoints: 1250,
        monthlyGoals: { completed: 8, total: 10 },
        rankingPosition: 3,
        achievements: 5
    },

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
