import { createClient } from '@google/genai/server';

/**
 * Gemini AI Serverless Function - Zimbroo App (New GenAI SDK)
 * Protects the API Key and uses the ultra-performant gemini-2.5-flash.
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type, payload } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ 
            error: 'Erro de Configuração', 
            details: 'Chave de API não encontrada no servidor.' 
        });
    }

    try {
        const client = createClient({ apiKey: API_KEY });
        
        // Using gemini-2.5-flash by default as requested
        const modelName = "gemini-2.5-flash";
        
        const response = await client.models.generateContent({
            model: modelName,
            contents: [{ parts: [{ text: payload.prompt }] }]
        });

        // The new SDK structure for response
        const responseText = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!responseText) {
            console.error("[GeminiAPI] Empty response:", response);
            return res.status(500).json({ error: 'Resposta vazia da IA', details: 'O modelo não gerou conteúdo.' });
        }

        return res.status(200).json({ text: responseText });

    } catch (error) {
        console.error("[GeminiAPI] SDK Error:", error);
        return res.status(500).json({ 
            error: 'Erro no novo SDK da IA', 
            details: error.message 
        });
    }
}
