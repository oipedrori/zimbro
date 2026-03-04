import { GoogleGenerativeAI } from '@google/generative-ai';
import { CATEGORIAS_DESPESA, CATEGORIAS_RECEITA } from '../utils/categories';

// Lendo a chave de um arquivo .env para evitar vazamentos
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeTextWithGemini = async (text, transactions = [], conversationContext = null) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const categoriesExpenseStr = CATEGORIAS_DESPESA.map(c => c.id).join(', ');
    const categoriesIncomeStr = CATEGORIAS_RECEITA.map(c => c.id).join(', ');

    const recentTxsStr = transactions.slice(0, 15).map(t =>
      `ID: ${t.id} | Tipo: ${t.type === 'expense' ? 'Despesa' : 'Receita'} | Valor: R$${t.amount} | Desc: ${t.description} | Cat: ${t.category}`
    ).join('\n');

    const currentDateStr = new Date().toLocaleDateString('pt-BR'); // Ex: 04/03/2026

    const prompt = `
Você é um assistente financeiro do aplicativo Zimbro. O usuário enviará uma transcrição de voz.

Data de Hoje: ${currentDateStr}. Sempre que o usuário mencionar uma data específica (ex: "dia 10", "10 de marco"), calcule a data correta no formato YYYY-MM-DD considerando o mês/ano atual. Se não falar data, retorne um texto vazio "".

CONTEXTO FINANCEIRO RECENTE (Últimas transações):
${recentTxsStr || "Nenhuma transação recente"}

Categorias de Despesa: [${categoriesExpenseStr}]
Categorias de Receita: [${categoriesIncomeStr}]

CONVERSA PENDENTE ANTERIOR (O usuário está respondendo a uma pergunta sua):
${conversationContext ? JSON.stringify(conversationContext) : "Nenhuma pendência"}

REGRAS ESTRITAS:
Você DEVE retornar APENAS um ÚNICO objeto JSON válido. NÃO inclua marcações markdown (\`\`\`json), nem texto antes ou depois. APENAS o JSON puro.

Selecione APENAS UMA das 4 estruturas abaixo de acordo com a intenção do usuário:

2. ADICIONAR TRANSAÇÃO (Quando tem todos os dados ou ao finalizar uma conversa pendente):
ATENÇÃO PARCELAMENTOS: O campo "amount" no JSON é o valor numérico de CADA PARCELA. Divida o valor total pelo número de parcelas (installments).
"type" deve ser "expense" ou "income".
"date" deve ser no formato "YYYY-MM-DD" ou vazio "".
"repeatType" deve ser "none" ou "recurring" ou "installment".
{
  "isValid": true,
  "type": "expense",
  "amount": 4.55,
  "description": "Resumo curto",
  "category": "alimentacao",
  "date": "2026-03-04",
  "repeatType": "installment",
  "installments": 10
}

3. DÚVIDAS E DEPENDÊNCIAS (Contexto Conversacional):
IMPORTANTE: Se a intenção era adicionar despesa mas faltou dado crítico, NÃO RETORNE A TRANSAÇÃO. Retorne uma pergunta.
Regra A: Se parcelou mas NÃO DISSE em quantas vezes.
Regra B: Se a categoria deduzida for "moradia" (aluguel, luz), "apps_software" (netflix, spotify), "servicos" ou "educacao" (faculdade, curso) E o usuário NÃO especificou se é recorrente nem a quantidade de vezes, VOCÊ DEVE OBRIGATORIAMENTE PERGUNTAR se é um gasto recorrente mensal.
Exemplo da Regra B:
{
  "action": "need_info",
  "message": "É um gasto fixo mensal recorrente?",
  "pendingData": {
    "type": "expense",
    "amount": 100,
    "description": "Resumo",
    "category": "alimentacao",
    "date": "",
    "repeatType": "installment",
    "installments": null
  }
}
!! Use o JSON do "CONVERSA PENDENTE ANTERIOR" acima. Se houver uma conversa pendente, combine a pendência com a resposta ATUAL do usuário ("Sim", "10 vezes") para finalizar e retornar OBRIGATORIAMENTE a Estrutura 2 (Adicionar Transação), definindo o repeatType como "recurring", "installment" ou "none"!

4. REMOVER TRANSAÇÃO:
"targetId" é o ID_ENCONTRADO_NO_CONTEXTO.
{
  "action": "delete",
  "targetId": "xyz123",
  "message": "A transação X foi apagada."
}

5. ANÁLISE / CONSELHO:
{
  "action": "analysis",
  "message": "Seu texto de análise amigável."
}

Mensagem do usuário: "${text}"
        `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // Fallback: strip markdown ticks if Gemini included them despite instructions
    responseText = responseText.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();

    // Use regex to strictly extract JSON object
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      console.error("Gemini didn't return a valid JSON object:", responseText);
      throw new Error("Invalid output format");
    }

  } catch (error) {
    console.error("Gemini AI Error:", error);
    return { error: "Ops, tive um problema ao analisar o que você disse." };
  }
};
