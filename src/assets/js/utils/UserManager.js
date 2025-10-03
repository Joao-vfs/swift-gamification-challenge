import { Toast } from './Toast.js';

/**
 * UserManager - Handles user registration and authentication
 * Manages user data in localStorage and provides default user access
 */
export class UserManager {
    constructor() {
        this.STORAGE_KEY = 'swift_registered_users';
        this.DEFAULT_USER = {
            id: 'default',
            codigoLoja: '000',
            codigoFuncionario: 'JOHNDOE',
            cpf: '000.000.000-00',
            senha: 'johndoe',
            name: 'John Doe',
            isDefault: true
        };
    }

    /**
     * Get all registered users from localStorage
     * @returns {Array} List of registered users
     */
    getRegisteredUsers() {
        try {
            const usersJson = localStorage.getItem(this.STORAGE_KEY);
            return usersJson ? JSON.parse(usersJson) : [];
        } catch (error) {
            Toast.error('Erro ao obter usuários registrados:', error);
            return [];
        }
    }

    /**
     * Save users to localStorage
     * @param {Array} users - List of users to save
     */
    saveUsers(users) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
        } catch (error) {
            Toast.error('Erro ao salvar usuários');
        }
    }

    /**
     * Register a new user
     * @param {Object} userData - User data to register
     * @returns {Object} Newly registered user
     * @throws {Error} If user already exists
     */
    registerUser(userData) {
        const users = this.getRegisteredUsers();

        const existingUser = users.find(
            user =>
                user.cpf === userData.cpf &&
                user.codigoLoja === userData.codigoLoja &&
                user.codigoFuncionario === userData.codigoFuncionario
        );

        if (existingUser) {
            throw new Error('Usuário já cadastrado com esses dados. Tente fazer login ou use dados diferentes.');
        }

        const newUser = {
            id: Date.now().toString(),
            codigoLoja: userData.codigoLoja,
            codigoFuncionario: userData.codigoFuncionario,
            cpf: userData.cpf,
            senha: userData.senha,
            name: userData.nome,
            registeredAt: new Date().toISOString()
        };

        users.push(newUser);
        this.saveUsers(users);

        return newUser;
    }

    /**
     * Authenticate user credentials
     * Checks both localStorage users and default user
     * @param {Object} credentials - Login credentials
     * @returns {Object|null} Authenticated user or null if invalid
     */
    authenticateUser(credentials) {
        const { codigoLoja, codigoFuncionario, cpf, senha } = credentials;

        // Check if credentials match default user
        if (this.isDefaultUser(credentials)) {
            return this.DEFAULT_USER;
        }

        // Check registered users in localStorage
        const users = this.getRegisteredUsers();
        const user = users.find(
            u =>
                u.codigoLoja === codigoLoja &&
                u.codigoFuncionario === codigoFuncionario &&
                u.cpf === cpf &&
                u.senha === senha
        );

        return user || null;
    }

    /**
     * Check if credentials match the default user
     * @param {Object} credentials - Credentials to check
     * @returns {boolean} True if credentials match default user
     */
    isDefaultUser(credentials) {
        const { codigoLoja, codigoFuncionario, cpf, senha } = credentials;
        return (
            codigoLoja === this.DEFAULT_USER.codigoLoja &&
            codigoFuncionario === this.DEFAULT_USER.codigoFuncionario &&
            cpf === this.DEFAULT_USER.cpf &&
            senha === this.DEFAULT_USER.senha
        );
    }

    /**
     * Get default user information for display purposes
     * @returns {Object} Default user information (without password)
     */
    getDefaultUserInfo() {
        return {
            codigoLoja: this.DEFAULT_USER.codigoLoja,
            codigoFuncionario: this.DEFAULT_USER.codigoFuncionario,
            cpf: this.DEFAULT_USER.cpf,
            name: this.DEFAULT_USER.name
        };
    }

    /**
     * Clear all registered users from localStorage
     * Useful for debugging and reset operations
     */
    clearAllUsers() {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    /**
     * Get total count of registered users
     * @returns {number} Total number of registered users
     */
    getTotalRegisteredUsers() {
        return this.getRegisteredUsers().length;
    }

    /**
     * Check if a user with the given CPF exists
     * @param {string} cpf - CPF to check
     * @returns {boolean} True if user with this CPF exists
     */
    userExistsByCPF(cpf) {
        const users = this.getRegisteredUsers();
        return users.some(user => user.cpf === cpf);
    }
}

// Export singleton instance
export const userManager = new UserManager();
