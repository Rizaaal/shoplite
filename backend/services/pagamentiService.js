const stripe = require('../config/stripe');

const createPaymentIntentForOrdine = async ({ idOrdine, amount, email, guestToken, idCliente }) => {
  const amountInCents = Math.round(Number(amount) * 100);

  if (!amountInCents || amountInCents <= 0) {
    const error = new Error('Importo ordine non valido');
    error.statusCode = 400;
    throw error;
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'eur',
    payment_method_types: ['card'],
    receipt_email: email,
    metadata: {
      idOrdine: String(idOrdine),
      guestToken: guestToken ? String(guestToken) : '',
      idCliente: idCliente ? String(idCliente) : '',
    },
  });

  return paymentIntent;
};

module.exports = {
  createPaymentIntentForOrdine,
};
