const stripe = require('../config/stripe');
const {
  getOrdineByPaymentIntentId,
  markOrdineAsPaid,
  markOrdineAsPaymentFailed,
  markOrdineAsProcessing,
} = require('../services/ordiniService');

const handleStripeWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;

        const ordine = await getOrdineByPaymentIntentId(paymentIntent.id);

        if (!ordine) {
          console.warn(`Ordine non trovato per paymentIntent ${paymentIntent.id}`);
          break;
        }

        await markOrdineAsPaid({
          idOrdine: ordine.id,
          paymentIntentId: paymentIntent.id,
        });

        break;
      }

      case 'payment_intent.processing': {
        const paymentIntent = event.data.object;
        await markOrdineAsProcessing({ paymentIntentId: paymentIntent.id });
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        await markOrdineAsPaymentFailed({ paymentIntentId: paymentIntent.id });
        break;
      }

      default:
        break;
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Stripe webhook handling error:', error);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
};

module.exports = {
  handleStripeWebhook,
};
