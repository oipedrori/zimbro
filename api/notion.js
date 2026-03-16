/**
 * Generic Notion API Proxy - Zimbroo App
 * This avoids CORS and "Invalid request URL" issues by making absolute server-side calls to Notion.
 */
export default async function handler(req, res) {
    // Only allow POST to the proxy to keep it simple and secure
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { endpoint, method = 'GET', body, secret } = req.body;

    if (!endpoint || !secret) {
        return res.status(400).json({ error: 'Endpoint and secret are required' });
    }

    // Ensure the endpoint doesn't have double slashes
    const cleanEndpoint = endpoint.replace(/^\//, '');
    const url = `https://api.notion.com/v1/${cleanEndpoint}`;

    console.log(`[NotionProxy] Forwarding to: ${url}`);

    try {
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${secret}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        };

        if (['POST', 'PATCH', 'PUT'].includes(method.toUpperCase()) && body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            console.error(`[NotionProxy] Notion Error (${response.status}):`, data);
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("[NotionProxy] Proxy Error:", error);
        return res.status(500).json({ error: 'Internal server error during Notion proxy' });
    }
}
