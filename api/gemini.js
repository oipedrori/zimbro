import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Gemini AI Serverless Function - Zimbroo App
 * Protects the API Key by running AI logic on the server.
 */
export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type, payload } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ 
            error: 'Erro de Configuração', 
            details: 'Chave de API não encontrada no servidor (GEMINI_API_KEY).' 
        });
    }

    try {
        const model = "gemini-1.5-flash";
        const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${API_KEY}`;
        
        const geminiResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: payload.prompt }] }]
            })
        });

        const data = await geminiResponse.json();

        if (!geminiResponse.ok) {
            console.error("[GeminiAPI] Error from Google:", data);
            return res.status(geminiResponse.status).json({ 
                error: 'Erro na API do Google', 
                details: data.error?.message || JSON.stringify(data)
            });
        }

        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!responseText) {
            return res.status(500).json({ error: 'Resposta vazia da IA', details: 'Nenhum conteúdo gerado.' });
        }

        return res.status(200).json({ text: responseText });

    } catch (error) {
        console.error("[GeminiAPI] Critical Exception:", error);
        return res.status(500).json({ error: 'Erro crítico no servidor de IA', details: error.message });
    }
}
