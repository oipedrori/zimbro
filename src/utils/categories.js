export const CATEGORIAS_DESPESA = [
    { id: 'alimentacao', label: 'Alimentação', icon: '🥑', color: '#f59e0b' },
    { id: 'comunicacao', label: 'Comunicação', icon: '📱', color: '#6366f1' },
    { id: 'doacao', label: 'Doação', icon: '🤲', color: '#8b5cf6' },
    { id: 'educacao', label: 'Educação', icon: '📚', color: '#3b82f6' },
    { id: 'equipamentos', label: 'Equipamentos', icon: '💻', color: '#14b8a6' },
    { id: 'impostos', label: 'Impostos', icon: '🏛️', color: '#64748b' },
    { id: 'investimento', label: 'Investimento', icon: '📈', color: '#ec4899' },
    { id: 'lazer', label: 'Lazer', icon: '🎭', color: '#f43f5e' },
    { id: 'moradia', label: 'Moradia', icon: '🏠', color: '#0ea5e9' },
    { id: 'pet', label: 'Pet', icon: '🐾', color: '#f97316' },
    { id: 'saude', label: 'Saúde', icon: '💊', color: '#d946ef' },
    { id: 'seguro', label: 'Seguro', icon: '🛡️', color: '#06b6d4' },
    { id: 'transporte', label: 'Transporte', icon: '🚗', color: '#a855f7' },
    { id: 'vestuario', label: 'Vestuário', icon: '👕', color: '#d946ef' },
    { id: 'higiene', label: 'Higiene Pessoal', icon: '🪥', color: '#0ea5e9' },
    { id: 'indeterminado', label: 'Indeterminado', icon: '❓', color: '#64748b' },
    { id: 'outros', label: 'Outros', icon: '📌', color: '#9ca3af' },
];

export const CATEGORIAS_RECEITA = [
    { id: 'salario', label: 'Salário', icon: '💵', color: '#10b981' },
    { id: 'freela', label: 'Freelance', icon: '💼', color: '#3b82f6' },
    { id: 'investimento', label: 'Rendimentos', icon: '📈', color: '#8b5cf6' },
    { id: 'reembolso', label: 'Reembolso', icon: '🔄', color: '#f59e0b' },
    { id: 'outros', label: 'Outros', icon: '➕', color: '#9ca3af' },
];

export const getCategoryInfo = (id, type = 'expense') => {
    const list = type === 'income' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;
    return list.find(c => c.id === id) || list[list.length - 1];
};
