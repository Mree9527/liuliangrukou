// Webhook Handler for Payment Status Updates
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const webhook = req.body;

  // Validate signature (Security Best Practice)
  // if (!validateWebhookSignature(req.headers['x-signature'], req.body)) {
  //   return res.status(401).json({ error: 'Invalid signature' });
  // }

  if (webhook.type === 'payment.completed') {
    console.log('Payment detected:', webhook);
    
    // Trigger USDT Withdrawal here
    // await withdrawUSDT(webhook.order_id, webhook.user_address);
  }

  res.status(200).json({ received: true });
}

export const config = {
  api: { bodyParser: true },
};
