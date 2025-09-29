// /services/AuthService.js

class AuthService {
    /**
     * Simula a autenticação de um usuário.
     */
    static async authenticate(codigoLoja, cpf, senha) {
        // ... (código do login que já tínhamos) ...
    }

    /**
     * Simula o registro de um novo usuário.
     */
    static async register(userData) {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const existingUsers = JSON.parse(localStorage.getItem('swift_users') || '[]');
        const userExists = existingUsers.some(user => user.cpf === userData.cpf);

        if (userExists) {
            throw new Error('Este CPF já está cadastrado.');
        }

        const newUser = {
            id: Date.now(),
            ...userData,
            createdAt: new Date().toISOString()
        };

        const users = [...existingUsers, newUser];
        localStorage.setItem('swift_users', JSON.stringify(users));
        
        return newUser;
    }
}

window.AuthService = AuthService;