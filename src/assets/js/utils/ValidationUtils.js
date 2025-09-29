/**
 * =================================================================
 * UTILITIES (idealmente em arquivos separados, ex: /utils/validation.js)
 * =================================================================
 */
const ValidationUtils = {
    /**
     * Valida um CPF brasileiro.
     * @param {string} cpf - O CPF a ser validado.
     * @returns {boolean} - True se o CPF for válido.
     */
    isValidCPF(cpf) {
        if (!cpf) return false;
        const cpfLimpio = cpf.replace(/[^\d]/g, '');

        if (cpfLimpio.length !== 11 || /^(\d)\1{10}$/.test(cpfLimpio)) {
            return false;
        }

        let sum = 0;
        let remainder;

        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpfLimpio.substring(i - 1, i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpfLimpio.substring(9, 10))) return false;

        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpfLimpio.substring(i - 1, i)) * (12 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpfLimpio.substring(10, 11))) return false;

        return true;
    },

    /**
     * Formata um CPF com a máscara XXX.XXX.XXX-XX.
     * @param {string} cpf - O CPF a ser formatado.
     * @returns {string} - O CPF formatado.
     */
    formatCPF(cpf) {
        if (!cpf) return ''; // Adicione esta verificação para segurança
        return cpf
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
};

/**
 * =================================================================
 * API SERVICE (idealmente em /services/authService.js)
 * =================================================================
 */
class AuthService {
    /**
     * Simula a autenticação de um usuário.
     */
    static async authenticate(codigoLoja, codigoFuncionario, cpf, senha) {
        // Simulação de chamada de API
        await new Promise(resolve => setTimeout(resolve, 1500));

        const validCredentials = [
            { codigoLoja: '001', codigoFuncionario: '12345', cpf: '123.456.789-00', senha: '123456' },
            { codigoLoja: '002', codigoFuncionario: '54321', cpf: '987.654.321-00', senha: '123456' },
        ];

        const isValid = validCredentials.some(cred =>
            cred.codigoLoja === codigoLoja &&
            cred.codigoFuncionario === codigoFuncionario &&
            cred.cpf === cpf &&
            cred.senha === senha
        );

        if (!isValid) {
            throw new Error('Credenciais inválidas. Verifique os dados e tente novamente.');
        }

        // Se válido, retorna um objeto de usuário mockado
        return {
            id: Date.now(),
            codigoLoja,
            codigoFuncionario,
            cpf,
            name: 'Usuário Swift',
            email: `${codigoFuncionario}@swift.com`,
            points: 1500
        };
    }
}