# Swift Gamificação - Versão Simplificada

Sistema de gamificação estático para colaboradores das lojas Swift.

## ✨ Características

- **Projeto estático**: Funciona com JavaScript vanilla, sem frameworks pesados
- **Minimalista**: Apenas as dependências essenciais
- **Rápido**: Sem processos de build complexos

## 📦 Dependências

- `live-server`: Servidor de desenvolvimento local (apenas para desenvolvimento)

## 🚀 Como usar

### 1. Instalar dependências

```bash
npm install
```

### 2. Executar em desenvolvimento

```bash
npm start
# ou
npm run dev
```

O projeto será executado em http://localhost:3000

### 3. Para produção

Como é um projeto estático, você pode:

- Hospedar a pasta `src/` diretamente em qualquer servidor web
- Usar GitHub Pages, Netlify, Vercel, etc.
- Servir com nginx, Apache ou qualquer servidor HTTP

## 📁 Estrutura do Projeto

```
src/
├── index.html                 # Página principal
├── assets/
│   ├── css/                  # Estilos
│   ├── js/                   # Scripts JavaScript
│   └── images/               # Imagens
```

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript ES6+ (Vanilla)
- LocalStorage para persistência

## 📝 Scripts Disponíveis

- `npm start` - Inicia servidor de desenvolvimento
- `npm run dev` - Mesmo que start, com watch automático

## 🎯 Funcionalidades

- Dashboard com métricas
- Sistema de ranking
- Metas e objetivos
- Perfil do usuário
- Sistema de conquistas
- Navegação por rotas

---

**Versão simplificada** - Mantém apenas o essencial para um projeto estático funcional.