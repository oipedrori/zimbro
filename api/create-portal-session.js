import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

const YOUR_DOMAIN = process.env.PUBLIC_URL || 'http://localhost:5173';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { customerId } = req.body;

        if (!customerId) {
            return res.status(400).json({ error: 'ID do cliente Stripe (customerId) não fornecido.' });
        }

        // Isso cria a URL para o Customer Portal onde ele pode cancelar ou trocar de plano
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${YOUR_DOMAIN}/perfil`,
        });

        res.status(200).json({ url: portalSession.url });
    } catch (error) {
        console.error('Erro ao criar portal de gerencimanto:', error);
        res.status(500).json({ error: error.message });
    }
}
