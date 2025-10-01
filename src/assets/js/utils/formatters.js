import { CommonUtils } from './CommonUtils.js';

/**
 * Legacy formatter class - DEPRECATED
 * Use CommonUtils instead for better organization
 * This class is kept for backward compatibility
 */
export class Formatters {
    
    /**
     * @deprecated Use CommonUtils.formatCPF() instead
     */
    static formatCPF(cpf) {
        return CommonUtils.formatCPF(cpf);
    }

    /**
     * @deprecated Use CommonUtils.formatNumber() instead
     */
    static formatNumber(number) {
        return CommonUtils.formatNumber(number);
    }

    /**
     * @deprecated Use CommonUtils.formatPoints() instead
     */
    static formatPoints(points) {
        return CommonUtils.formatPoints(points);
    }

    /**
     * @deprecated Use CommonUtils.capitalize() instead
     */
    static capitalize(str) {
        return CommonUtils.capitalize(str);
    }
}
