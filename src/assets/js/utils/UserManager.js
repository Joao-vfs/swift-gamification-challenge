import { Toast } from './Toast.js';

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
     * Get all registered users in localStorage
     * @returns {Array} List of users
     */
    getRegisteredUsers() {
        try {
            const usersJson = localStorage.getItem(this.STORAGE_KEY);
            return usersJson ? JSON.parse(usersJson) : [];
        } catch (error) {
            Toast.error('Error getting registered users:', error);
            return [];
        }
    }

    /**
     * Save users in localStorage
     * @param {Array} users - List of users to save
     */
    saveUsers(users) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
        } catch (error) {
            Toast.error('Error saving users:', error);
        }
    }

    /**
     * Register a new user
     * @param {Object} userData - User data
     * @returns {Object} Registered user
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
            Toast.error('User already registered with these data');
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
     * Authenticate user (check localStorage + default user)
     * @param {Object} credentials - Login credentials
     * @returns {Object|null} Authenticated user or null
     */
    authenticateUser(credentials) {
        const { codigoLoja, codigoFuncionario, cpf, senha } = credentials;

        if (this.isDefaultUser(credentials)) {
            return this.DEFAULT_USER;
        }

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
     * Check if credentials are of the default user
     * @param {Object} credentials - Credentials
     * @returns {boolean} If it is the default user
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
     * Get default user information for display
     * @returns {Object} Default user information
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
     * Clear all registered users (for debug/reset)
     */
    clearAllUsers() {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    /**
     * Count total of registered users
     * @returns {number} Total of users
     */
    getTotalRegisteredUsers() {
        return this.getRegisteredUsers().length;
    }

    /**
     * Check if there is a user with a certain CPF
     * @param {string} cpf - CPF to check
     * @returns {boolean} If there is a user with that CPF
     */
    userExistsByCPF(cpf) {
        const users = this.getRegisteredUsers();
        return users.some(user => user.cpf === cpf);
    }
}

export const userManager = new UserManager();
