import { GoogleGenerativeAI } from '@google/generative-ai';
import { CATEGORIAS_DESPESA, CATEGORIAS_RECEITA } from '../utils/categories';

// Chave exposta conforme solicitado pelo usuário para agilidade no MVP pessoal
const API_KEY = "AIzaSyAZCEw0QKIUXQA5Dj3Y7O3IMp932hmCFK0";
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeTextWithGemini = async (text) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const categoriesExpenseStr = CATEGORIAS_DESPESA.map(c => c.id).join(', ');
        const categoriesIncomeStr = CATEGORIAS_RECEITA.map(c => c.id).join(', ');

        const prompt = `
Você é um assistente financeiro de um aplicativo chamado Zimbro.
O usuário enviará uma mensagem de voz transcrita. Sua função é extrair os dados dessa mensagem e retornar EXCLUSIVAMENTE um objeto JSON estruturado para registrar a transação, ou retornar uma mensagem de erro caso falte valor ou informações cruciais.

As categorias de DESPESA válidas são: [${categoriesExpenseStr}].
As categorias de RECEITA válidas são: [${categoriesIncomeStr}].

REGRAS:
1. Se for uma despesa, type é 'expense'. Se receita, type é 'income'.
2. amount é sempre um NUMERO FLOAT POSITIVO (ex: 45.50).
3. description é um resumo curto (1 a 3 palavras) do que foi gasto (ex: "Mercado", "Ifood", "Salário").
4. category é o id exato de uma das categorias válidas. Tente deduzir a categoria pelo contexto.
5. date: você não pode saber o dia exato, então sempre retorne date no modelo omitido ("") e nós preencheremos a data atual no frontend, a não ser que ele seja explícito ("ontem", "dia 5"). Mas se for apenas "hoje", retorne "".
6. repeatType: se o usuário disse "parcelado em 10x" ou "em 10 vezes", repeatType é 'installment' e installments é 10. Se ele disse "todo mês" ou "assinatura", repeatType é 'recurring' e installments é 1. Caso contrário é 'none' e installments 1.
7. Se faltar a informação de VALOR, e não for possível deduzir que é uma mera pergunta, retorne um objeto JSON assim: { "error": "Preciso saber qual foi o valor! Pode me dizer?" }.
8. Se for um pedido de conselho financeiro (ex: "como economizo mais?"), retorne o JSON assim: { "advice": "Seu conselho aqui em texto amigável." }

Se for uma transação válida, o JSON deve ter EXATAMENTE esta estrutura de exemplo:
{
  "isValid": true,
  "type": "expense",
  "amount": 45.50,
  "description": "Ifood",
  "category": "alimentacao",
  "repeatType": "none",
  "installments": 1
}

Mensagem do Usuário: "${text}"
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Parse the JSON. Gemini might wrap it in ```json ticks
        let cleanJsonStr = responseText.trim();
        if (cleanJsonStr.startsWith('```json')) {
            cleanJsonStr = cleanJsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
        } else if (cleanJsonStr.startsWith('```')) {
            cleanJsonStr = cleanJsonStr.replace(/```/g, '').trim();
        }

        return JSON.parse(cleanJsonStr);

    } catch (error) {
        console.error("Gemini AI Error:", error);
        return { error: "Ops, tive um problema ao analisar o que você disse." };
    }
};
