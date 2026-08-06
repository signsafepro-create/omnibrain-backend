const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Stripe webhook handler for production billing
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return res.status(400).json({ error: 'Missing stripe signature or secret.' });
  }

  let event;
  try {
    const payload = req.body;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    if (sig !== expected) throw new Error('Invalid signature');
    event = JSON.parse(payload);
  } catch (err) {
    console.error('Webhook verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature.' });
  }

  console.log('Stripe event:', event.type);

  switch (event.type) {
    case 'invoice.payment_succeeded':
      // Update user subscription status
      console.log('Payment succeeded for customer:', event.data.object.customer);
      break;
    case 'invoice.payment_failed':
      // Notify user of failed payment
      console.log('Payment failed for customer:', event.data.object.customer);
      break;
    case 'customer.subscription.deleted':
      // Downgrade user to free plan
      console.log('Subscription cancelled:', event.data.object.customer);
      break;
    default:
      console.log('Unhandled event type:', event.type);
  }

  res.json({ received: true });
});

module.exports = router;
