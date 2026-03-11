/**
 * Utilitário para mapear descrições de transações para emojis específicos.
 * Isso permite que o app mostre ícones mais relevantes do que apenas o ícone da categoria.
 */

const emojiRules = [
    // Alimentação / Bebida
    { emoji: '🥖', keywords: ['padaria', 'pão', 'bakery', 'pao', 'panificadora'] },
    { emoji: '🍕', keywords: ['pizza', 'ifood', 'pizzaria', 'dominos'] },
    { emoji: '🍔', keywords: ['burger', 'hamburguer', 'mcdonalds', 'mc donalds', 'bk', 'burger king'] },
    { emoji: '☕', keywords: ['café', 'cafe', 'starbucks', 'coffee', 'nespresso'] },
    { emoji: '🍣', keywords: ['japa', 'sushi', 'temaki'] },
    { emoji: '🍦', keywords: ['sorvete', 'gelato', 'açai', 'acai'] },
    { emoji: '🍺', keywords: ['cerveja', 'bar', 'boteco', 'beira mar'] },
    { emoji: '🍷', keywords: ['vinho', 'adega'] },
    { emoji: '🥩', keywords: ['churrasco', 'açougue', 'acougue', 'meat'] },
    { emoji: '🛒', keywords: ['mercado', 'supermercado', 'carrefour', 'extra', 'pão de açucar', 'assai', 'atacadao'] },

    // Transporte
    { emoji: '🚗', keywords: ['uber', '99app', 'cabify', 'corrida', 'carro', 'estacionamento'] },
    { emoji: '⛽', keywords: ['posto', 'gasolina', 'combustivel', 'etanol', 'shell', 'ipiranga', 'br'] },
    { emoji: '🚇', keywords: ['metro', 'metrô', 'cptm', 'trem'] },
    { emoji: '🚌', keywords: ['ônibus', 'onibus', 'bus'] },
    { emoji: '✈️', keywords: ['viagem', 'vôo', 'voo', 'passagem aérea', 'latam', 'azul', 'gol'] },
    { emoji: '🚲', keywords: ['bike', 'bicicleta', 'itau bike'] },

    // Lazer / Entretenimento
    { emoji: '🎬', keywords: ['netflix', 'hbo', 'disney', 'cinema', 'ingresso', 'prime video', 'globoplay'] },
    { emoji: '🎧', keywords: ['spotify', 'deezer', 'apple music', 'musica', 'música'] },
    { emoji: '🎮', keywords: ['psn', 'xbox', 'steam', 'jogos', 'game', 'nintendo'] },
    { emoji: '🏟️', keywords: ['estadio', 'estádio', 'futebol', 'ingresso'] },

    // Saúde / Bem-estar
    { emoji: '🏋️‍♂️', keywords: ['wellhub', 'gympass', 'academia', 'gym', 'treino', 'smart fit', 'bluefit'] },
    { emoji: '💊', keywords: ['farmácia', 'farmacia', 'droga raia', 'drogasil', 'pague menos', 'medicamento'] },
    { emoji: '🩺', keywords: ['médico', 'medico', 'consulta', 'exame', 'hospital'] },
    { emoji: '🦷', keywords: ['dentista', 'odonto'] },

    // Moradia / Contas
    { emoji: '💡', keywords: ['luz', 'energia', 'enel', 'cpfl', 'conta de luz'] },
    { emoji: '💧', keywords: ['água', 'agua', 'sabesp'] },
    { emoji: '🌐', keywords: ['internet', 'wi-fi', 'wifi', 'vivo', 'claro', 'tim', 'net'] },
    { emoji: '🏠', keywords: ['aluguel', 'condominio', 'condomínio', 'iptu'] },
    { emoji: '📱', keywords: ['celular', 'recarga', 'iphone'] },

    // Compras
    { emoji: '📦', keywords: ['amazon', 'mercadolivre', 'mercado livre', 'shopee', 'aliexpress', 'magalu'] },
    { emoji: '👕', keywords: ['roupa', 'vestuario', 'zara', 'renner', 'cea', 'riachuelo', 'nike', 'adidas'] },
    { emoji: '💄', keywords: ['maquiagem', 'beleza', 'sephora', 'boticario'] },

    // Receitas
    { emoji: '💰', keywords: ['salário', 'salario', 'pagamento', 'rendimento'] },
    { emoji: '🧧', keywords: ['presente', 'pix recebido', 'transferência recebida'] },
];

/**
 * Retorna um emoji baseado na descrição da transação.
 * @param {string} description - Descrição da transação
 * @param {string} fallbackEmoji - Emoji da categoria para usar caso não encontre um específico
 */
export const getEmojiForDescription = (description = '', fallbackEmoji = '❓') => {
    if (!description) return fallbackEmoji;

    const lowerDesc = description.toLowerCase();

    // Procura uma regra que dê match
    const rule = emojiRules.find(r => 
        r.keywords.some(keyword => lowerDesc.includes(keyword.toLowerCase()))
    );

    return rule ? rule.emoji : fallbackEmoji;
};
