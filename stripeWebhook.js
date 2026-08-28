const express = require('express');
app.use('/api/stripe/webhook', stripeWebhook);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post('/', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
      return res.status(400).send('Webhook Error: ' + err.message);  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const subscriptionId = session.subscription;
    try {
      const db = require('./db'); // assumes each project exports its sqlite db instance
const stripeWebhook = require('./stripeWebhook');
      db.run('ALTER TABLE jobs ADD COLUMN stripe_subscription_id TEXT', [], () => {});
      db.run('ALTER TABLE jobs ADD COLUMN paid INTEGER DEFAULT 0', [], () => {});
      db.run('UPDATE jobs SET stripe_subscription_id = ?, paid = 1 WHERE user_id = ? AND status = 'pending'', [subscriptionId, userId]);
      if (global.logAudit) logAudit('stripe_webhook', userId, {subscriptionId});
    } catch (e) {
      console.log('DB update error in webhook:', e.message);
    }
  }
  res.json({received: true});
});

module.exports = router;
