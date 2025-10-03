# 🏆 Swift Gamificação - Jornada Premiada

<div align="center">
  <img src="src/assets/images/Swift Logo.svg" alt="Swift Logo" width="200"/>
  
  <p><strong>Sistema de gamificação para motivar e reconhecer colaboradores das lojas Swift</strong></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
</div>

---

## 📋 Sobre o Projeto

O **Swift Gamificação** é uma plataforma web desenvolvida para transformar as metas de vendas em uma jornada premiada e engajadora. Funcionários e franquias competem em um ranking mensal onde resultados viram pontos, e pontos viram prêmios reais.

### 🎯 Diagnóstico

A gamificação ajuda a resolver problemas que vemos nas lojas Swift. As metas aparecem só nos relatórios mensais, então o engajamento cai porque o time não entende como o esforço do dia mexe nos números. Sem visão em tempo real, fica difícil ajustar a rota, o cross sell vira exceção e o NPS sobe e desce sem explicação. 

**Quando transformamos metas grandes em pequenos objetivos claros**, mostrados na hora e recompensados logo depois, o trabalho ganha contexto, o comportamento certo se repete e a motivação dura o mês inteiro.

O **Swift Colaboradores** coloca isso em prática com uma mecânica simples:
- ✅ Cada venda vale pontos
- ✅ Mais pontos se incluir produto complementar
- ✅ Pontos extras quando o cliente dá nota alta
- ✅ Acompanhamento em tempo real
- ✅ Ranking interno com disputa saudável
- ✅ Missões com contagem regressiva
- ✅ Catálogo de recompensas palpáveis

### ✨ Principais Funcionalidades

- 🎮 **Sistema de Missões**: Missões diárias e semanais com recompensas em pontos
- 📊 **Dashboard Interativo**: Visualização de KPIs, progresso e estatísticas
- 🏅 **Sistema de Pontuação**: Acumule pontos e resgate recompensas
- 🔔 **Notificações em Tempo Real**: Acompanhe suas conquistas
- 👤 **Gestão de Perfil**: Cadastro e autenticação de usuários
- 📱 **Design Responsivo**: Interface moderna e acessível em todos os dispositivos

---

## 🚀 Tecnologias Utilizadas

### Core
- **JavaScript ES6+** (Vanilla JS)
- **HTML5**
- **CSS3**

### Bibliotecas e Ferramentas
- **Font Awesome 6.4.2** - Ícones
- **Google Fonts (Poppins)** - Tipografia
- **Live Server** - Desenvolvimento local

### Arquitetura
- **SPA (Single Page Application)** com roteamento client-side
- **Modular JavaScript** - Organização em componentes e utilitários
- **LocalStorage** - Persistência de dados do lado do cliente

---

## 📁 Estrutura do Projeto

```
swift-gamification-challenge/
│
├── src/
│   ├── index.html                 # Ponto de entrada da aplicação
│   │
│   └── assets/
│       ├── css/
│       │   ├── base/              # Estilos base (reset, variáveis, layout)
│       │   ├── components/        # Componentes reutilizáveis (buttons, cards, forms)
│       │   ├── screens/           # Estilos específicos de telas
│       │   ├── responsive/        # Media queries e acessibilidade
│       │   └── main.css           # Arquivo CSS principal
│       │
│       ├── images/                # Assets visuais e logos
│       │
│       └── js/
│           ├── main.js            # Inicializador da aplicação
│           │
│           ├── screens/           # Telas da aplicação
│           │   ├── HomeScreen.js
│           │   ├── LoginScreen.js
│           │   ├── RegisterScreen.js
│           │   └── DashboardScreen.js
│           │
│           ├── utils/             # Utilitários e serviços
│           │   ├── router.js      # Sistema de roteamento
│           │   ├── UserManager.js # Gerenciamento de usuários
│           │   ├── FormUtils.js   # Validações e helpers de formulários
│           │   ├── CommonUtils.js # Funções auxiliares gerais
│           │   ├── Toast.js       # Sistema de notificações
│           │   └── mockData.js    # Dados mockados para desenvolvimento
│           │
│           └── components/        # Componentes reutilizáveis
│
├── package.json                   # Configurações e dependências do projeto
└── README.md                      # Este arquivo
```

---

## 🛠️ Instalação e Configuração

### Pré-requisitos

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0 ou **pnpm**

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/swift-gamification-challenge.git
   cd swift-gamification-challenge
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   pnpm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm start
   # ou
   npm run dev
   ```

4. **Acesse a aplicação**
   
   O navegador abrirá automaticamente em `http://localhost:8080`

---

## 🎯 Como Usar

### 1️⃣ Página Inicial
- Conheça a proposta da jornada premiada
- Clique em "Vamos nessa!" para começar

### 2️⃣ Cadastro
- Preencha seus dados (Nome, CPF, Código de Funcionário)
- Crie uma senha segura
- Aceite os termos de uso

### 3️⃣ Login
- Faça login com seu CPF e senha
- A sessão é mantida mesmo após fechar o navegador

### 4️⃣ Dashboard
- **Visualize seus KPIs**: Vendas, desempenho, metas
- **Complete Missões**: Diárias e semanais com recompensas em pontos
- **Acompanhe seu Progresso**: Círculos de progresso animados
- **Resgate Pontos**: Quando completar missões, resgate suas recompensas
- **Notificações**: Fique atualizado sobre suas conquistas

---

## 🎮 Mecânica de Gamificação

### 👤 Para o Colaborador

#### Sistema de Pontuação
- **Pontos por Venda**: Cada transação gera pontos que aparecem no placar pessoal em tempo real
- **Cross-Sell Premiado**: Vender produto complementar (ex.: carvão junto com picanha) dá pontos extras
- **NPS Coletivo**: NPS alto distribui pontos extras para todos os colaboradores da loja
- **Cálculo Dinâmico**: Quanto maior o NPS, mais pontos são distribuídos

#### Missões e Desafios
- 📅 **Missões Diárias e Semanais**: Objetivos claros com contagem regressiva
- 📊 **Barra de Progresso**: Acompanhamento visual do andamento
- 🎉 **Celebração Instantânea**: Ao bater a meta, animação rápida e pontos somados na hora
- 🔄 **Atualização Automática**: Ranking da loja renovado a cada transação

#### Ranking e Competição
- 🏆 **Ranking Interno**: Posição em relação aos colegas em tempo real
- 👥 **Disputa Saudável**: Transparência e motivação coletiva
- 📈 **Projeções**: Visualize onde pode chegar até o final do período

#### Catálogo de Recompensas
- 🥩 **Cortes Premium**: Troque pontos por produtos nobres
- 🎫 **Cupons e Vales**: Benefícios monetários diretos
- ✨ **Experiências**: Prêmios únicos e memoráveis
- 📱 **Resgate Integrado**: Tudo sem sair do aplicativo

#### Insights e Relatórios
- 📊 **Exportação Rápida**: Gere relatórios para reuniões
- 📈 **Análise de Desempenho**: Entenda seus padrões de venda
- 🎯 **Metas Personalizadas**: Visualize seu progresso individual

---

### 👔 Para o Gerente da Loja

#### Painel de Controle em Tempo Real
- 💰 **Vendas**: Acompanhamento do faturamento instantâneo
- 🎯 **Ticket Médio**: Monitore o valor médio das transações
- 🔗 **Cross-Sell**: Índice de vendas complementares
- ⭐ **NPS**: Satisfação do cliente atualizada continuamente

#### Gestão de Equipe
- 📊 **Ranking de Funcionários**: Veja quem está perto da meta e quem precisa suporte
- 🎓 **Treinamento Direcionado**: Use dados para desenvolver talentos específicos
- 🚨 **Alertas Automáticos**: Notificações quando indicadores fogem da meta diária ou semanal
- 👥 **Análise Individual**: Histórico completo de cada colaborador

#### Criação de Missões
- ✏️ **Editor Simples**: Crie missões com poucos cliques
- ⚙️ **Configuração Flexível**: Define tarefa, prazo, valor em pontos e recompensa
- ⚡ **Atualização Instantânea**: Mudanças aparecem imediatamente no app dos colaboradores
- 🎯 **Templates**: Use modelos prontos para missões comuns

#### Análise Comparativa
- 🏪 **Ranking de Filiais**: Veja a posição da loja no ranking global
- 📈 **Projeção Mensal**: Antecipe o fechamento do mês
- 📊 **Benchmarking**: Compare indicadores com outras lojas
- 🎯 **Metas Globais**: Acompanhe o atingimento de objetivos da rede

#### Tomada de Decisão
- 📱 **Mobilidade**: Acesse de qualquer lugar
- 🔔 **Notificações Inteligentes**: Receba alertas relevantes
- 📊 **Relatórios Executivos**: Dados consolidados para apresentações
- 🎯 **Ajustes Rápidos**: Mude estratégias em tempo real

---

## 📈 Impacto Esperado

### 💼 Para o Colaborador

| Área | Benefício | Resultado |
|------|-----------|-----------|
| **Visibilidade** | Sabe em tempo real onde está em relação às metas | Caminho claro para promoções |
| **Motivação** | Reconhecimento imediato pelo esforço | Redução de turnover |
| **Capacitação** | Domínio de técnicas de venda e cross-sell | Ticket médio maior e comissões elevadas |
| **Engajamento** | Desempenho conectado a prêmios concretos | Senso de dono e orgulho pelo resultado |
| **Atendimento** | Foco em qualidade, não só volume | NPS alto e feedback positivo |

#### Benefícios Diretos:
- ✅ **Carreira**: Promoções baseadas em mérito e dados objetivos
- ✅ **Financeiro**: Aumento de comissões via ticket médio elevado
- ✅ **Reconhecimento**: Valorização pública do desempenho
- ✅ **Desenvolvimento**: Aprendizado contínuo de técnicas de venda
- ✅ **Satisfação**: Trabalho com propósito e recompensas tangíveis

---

### 🎯 Para o Gerente da Loja

| Área | Benefício | Resultado |
|------|-----------|-----------|
| **Operação** | Visão completa e ação rápida | Correção de desvios em tempo real |
| **Gestão de Pessoas** | Treinamento direcionado por dados | Desenvolvimento interno, redução de custos |
| **Faturamento** | Cross-sell incentivado | Aumento consistente de ticket médio |
| **Qualidade** | Time focado em atendimento | NPS estável e crescente |
| **Previsibilidade** | Dados em tempo real | Atingimento de metas globais |

#### Benefícios Estratégicos:
- ✅ **Eficiência Operacional**: Menos tempo apagando incêndios
- ✅ **Retenção de Talentos**: Time motivado permanece na empresa
- ✅ **Crescimento Sustentável**: Resultados previsíveis mês a mês
- ✅ **Vantagem Competitiva**: Equipe de alto desempenho
- ✅ **Carreira**: Fortalecimento da posição dentro da rede Swift

#### ROI da Gamificação:
```
📊 Aumento médio esperado:
   • Ticket Médio: +15% a +25%
   • Cross-Sell: +30% a +40%
   • NPS: +10 a +20 pontos
   • Retenção de Colaboradores: +20% a +35%
   • Atingimento de Metas: +25% a +40%
```

---

## 🎨 Funcionalidades Técnicas

### Sistema de Roteamento
```javascript
// Navegação entre páginas
router.navigate('dashboard');

// Proteção de rotas
if (!user) {
  router.navigate('login');
}
```

### Gerenciamento de Usuários
```javascript
// Registro de novo usuário
UserManager.registerUser(userData);

// Autenticação
const user = UserManager.authenticateUser(cpf, password);

// Validações
UserManager.validateCPF(cpf);
UserManager.validatePassword(password);
```

### Sistema de Toast
```javascript
Toast.success('Operação realizada com sucesso!');
Toast.error('Erro ao processar requisição');
Toast.warning('Atenção! Revise os dados');
Toast.info('Informação importante');
```

### Persistência de Dados
- **LocalStorage** para dados de usuários e sessão
- **Criptografia de senhas** usando `btoa()` (base64)
- **Sessão persistente** entre recarregamentos

---

## 🎭 Componentes Principais

### Screens (Telas)
| Componente | Descrição |
|------------|-----------|
| `HomeScreen` | Landing page com apresentação da plataforma |
| `LoginScreen` | Autenticação de usuários |
| `RegisterScreen` | Cadastro de novos colaboradores |
| `DashboardScreen` | Interface principal com KPIs, missões e progresso |

### Utils (Utilitários)
| Componente | Descrição |
|------------|-----------|
| `Router` | Gerenciamento de rotas e navegação SPA |
| `UserManager` | CRUD de usuários e validações |
| `FormUtils` | Validações, formatações e máscaras de formulários |
| `CommonUtils` | Funções auxiliares gerais |
| `Toast` | Sistema de notificações temporárias |

---

## 🔒 Segurança

- ✅ Validação de CPF (algoritmo de dígitos verificadores)
- ✅ Validação de senha (mínimo 8 caracteres, maiúsculas, números e especiais)
- ✅ Sanitização de inputs
- ✅ Validação de código de funcionário (formato: SWXXXXXX)
- ✅ Proteção contra XSS em campos de formulário

---

## 📱 Responsividade e Acessibilidade

### Breakpoints
- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

### Acessibilidade
- ✅ Semântica HTML5
- ✅ Contraste de cores (WCAG 2.1)
- ✅ Navegação por teclado
- ✅ Labels e ARIA attributes
- ✅ Animações suaves com `prefers-reduced-motion`

---

## 🧪 Scripts Disponíveis

```bash
# Iniciar servidor de desenvolvimento (porta 8080)
npm start

# Modo desenvolvimento (alias para start)
npm run dev

# Servidor silencioso (sem logs)
npm run serve
```

---

## 🚧 Funcionalidades em Desenvolvimento

- 🔄 **Rankings**: Sistema de classificação entre colaboradores
- 🎁 **Loja de Recompensas**: Catálogo completo de prêmios
- 👥 **Perfil do Usuário**: Edição de dados e histórico
- ⚙️ **Configurações**: Personalização da conta
- 📊 **Relatórios**: Análises detalhadas de desempenho
- 🔔 **Notificações Push**: Alertas em tempo real

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---
