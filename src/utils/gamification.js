export const GAMIFICATION_CATEGORIES = {
    transactions: {
        id: 'transactions',
        title: 'Movimentações',
        color: '#ef4444', // Red (Tailwind red-500)
        textColor: '#ffffff',
        milestones: [
            { id: 'tx_50', trigger: 50, label: 'Iniciante' },
            { id: 'tx_250', trigger: 250, label: 'Constante' },
            { id: 'tx_500', trigger: 500, label: 'Frequente' },
            { id: 'tx_1000', trigger: 1000, label: 'Ativo' },
            { id: 'tx_2500', trigger: 2500, label: 'Engajado' },
            { id: 'tx_10000', trigger: 10000, label: 'Mestre' }
        ]
    },
    savings: {
        id: 'savings',
        title: 'Economias',
        color: '#22c55e', // Green (Tailwind green-500)
        textColor: '#ffffff',
        milestones: [
            { id: 'save_100', trigger: 100, label: 'Poupador' },
            { id: 'save_500', trigger: 500, label: 'Econômico' },
            { id: 'save_1000', trigger: 1000, label: 'Visionário' },
            { id: 'save_5000', trigger: 5000, label: 'Investidor' },
            { id: 'save_10000', trigger: 10000, label: 'Acumulador' },
            { id: 'save_20000', trigger: 20000, label: 'Magnata' }
        ]
    },
    time: {
        id: 'time',
        title: 'Tempo de uso',
        color: '#3b82f6', // Blue (Tailwind blue-500)
        textColor: '#ffffff',
        milestones: [
            { id: 'time_7', trigger: 7, label: '1 Semana' },
            { id: 'time_30', trigger: 30, label: '1 Mês' },
            { id: 'time_180', trigger: 180, label: '6 Meses' },
            { id: 'time_365', trigger: 365, label: '1 Ano' },
            { id: 'time_730', trigger: 730, label: '2 Anos' },
            { id: 'time_1825', trigger: 1825, label: '5 Anos' }
        ]
    }
};

/**
 * Checks which milestones have been achieved for a specific category.
 * @param {string} categoryId - 'transactions', 'savings', 'time'
 * @param {number} currentValue - The current user value (tx count, total savings, days since creation)
 * @returns {Array} List of achieved milestone IDs
 */
export const getUnlockedMilestones = (categoryId, currentValue) => {
    const category = GAMIFICATION_CATEGORIES[categoryId];
    if (!category) return [];

    return category.milestones
        .filter(m => currentValue >= m.trigger)
        .map(m => m.id);
};

/**
 * Calculate total savings from all transactions.
 * Savings = Incomes - Expenses
 */
export const calculateTotalSavings = (transactions) => {
    return transactions.reduce((acc, tx) => {
        if (tx.type === 'income') return acc + tx.amount;
        if (tx.type === 'expense') return acc - tx.amount;
        return acc;
    }, 0);
};

/**
 * Calculate days since account creation
 */
export const calculateDaysSinceCreation = (creationTimeStr) => {
    if (!creationTimeStr) return 0;
    const creationDate = new Date(creationTimeStr);
    const today = new Date();
    // Calculate difference in milliseconds, then convert to days
    const diffTime = Math.abs(today - creationDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};
