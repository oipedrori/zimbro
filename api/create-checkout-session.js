import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

// Zimbroo URLs for Redirects
const YOUR_DOMAIN = process.env.PUBLIC_URL || 'http://localhost:5173';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { priceId, userId, customerEmail } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'É necessário fornecer o userId (Firebase UID).' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            customer_email: customerEmail,
            line_items: [
                {
                    price: priceId, // ID do preço Mensal ou Anual configurado no Stripe Dashboard
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            // O REQUISITO CHAVE: 7 Dias de Trial
            subscription_data: {
                trial_period_days: 7,
                metadata: {
                    firebaseUID: userId
                }
            },
            client_reference_id: userId, // Essencial para ligar a sessão de volta ao usuário do Firebase no Webhook
            success_url: `${YOUR_DOMAIN}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${YOUR_DOMAIN}/?canceled=true`,
        });

        res.status(200).json({ id: session.id, url: session.url });
    } catch (error) {
        console.error('Erro ao criar sessão do Stripe:', error);
        res.status(500).json({ error: error.message });
    }
}
