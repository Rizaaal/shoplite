const {
  createCheckoutOrdineService,
  getOrdineCompletoById,
  confirmPagamentoOrdineService,
} = require('../services/ordiniService');
const { getClienteById } = require('../services/clientiService');
const { sendSuccess, sendError } = require('../utils/response');

const createCheckoutOrdine = async (req, res) => {
  try {
    const { prodotti, indirizzoSpedizione, postalCode, city, email, nome, cognome } = req.body;

    const idCliente = Number(req.user?.id ?? req.user?.id_cliente ?? req.user?.userId ?? 0) || null;

    if (!Array.isArray(prodotti) || prodotti.length === 0) {
      return sendError(res, "L'ordine deve contenere almeno un prodotto", 400);
    }

    if (!indirizzoSpedizione || !postalCode || !city) {
      return sendError(res, 'indirizzoSpedizione, postalCode e city sono obbligatori', 400);
    }

    let checkoutEmail = email || null;
    let checkoutNome = nome || null;
    let checkoutCognome = cognome || null;

    if (idCliente) {
      const cliente = await getClienteById(idCliente);

      if (!cliente) {
        return sendError(res, 'Cliente non trovato', 404);
      }

      checkoutEmail = cliente.email;
      checkoutNome = cliente.nome;
      checkoutCognome = cliente.cognome;
    } else {
      if (!checkoutEmail) {
        return sendError(res, 'Email obbligatoria per guest checkout', 400);
      }
    }

    const result = await createCheckoutOrdineService({
      idCliente,
      prodotti,
      indirizzoSpedizione,
      postalCode,
      city,
      email: checkoutEmail,
      nome: checkoutNome,
      cognome: checkoutCognome,
    });

    return sendSuccess(res, result, 201);
  } catch (error) {
    console.error(error);
    return sendError(
      res,
      error.message || "server error: couldn't create checkout ordine",
      error.statusCode || 500,
    );
  }
};

const getSingleOrdine = async (req, res) => {
  try {
    const idOrdine = Number(req.params.id);
    const guestToken = req.query.guestToken || req.headers['x-guest-token'] || null;

    const ordine = await getOrdineCompletoById(idOrdine);

    if (!ordine) {
      return sendError(res, 'Ordine non trovato', 404);
    }

    if (ordine.idCliente) {
      if (!req.user) {
        return sendError(res, 'Autenticazione richiesta', 401);
      }

      if (req.user.role !== 'admin' && Number(req.user.id) !== Number(ordine.idCliente)) {
        return sendError(res, 'Forbidden', 403);
      }

      return sendSuccess(res, ordine);
    }

    if (!guestToken || guestToken !== ordine.guestToken) {
      return sendError(res, 'Forbidden', 403);
    }

    return sendSuccess(res, ordine);
  } catch (error) {
    console.error(error);
    return sendError(res, "server error: couldn't get ordine", 500);
  }
};

const confirmOrdinePagamento = async (req, res) => {
  try {
    const idOrdine = Number(req.params.id);
    const { paymentIntentId } = req.body;
    const guestToken = req.headers['x-guest-token'] || req.body.guestToken || null;

    if (!paymentIntentId) {
      return sendError(res, 'paymentIntentId obbligatorio', 400);
    }

    const ordine = await getOrdineCompletoById(idOrdine);

    if (!ordine) {
      return sendError(res, 'Ordine non trovato', 404);
    }

    if (ordine.idCliente) {
      if (!req.user) {
        return sendError(res, 'Autenticazione richiesta', 401);
      }

      if (req.user.role !== 'admin' && Number(req.user.id) !== Number(ordine.idCliente)) {
        return sendError(res, 'Forbidden', 403);
      }
    } else {
      if (!guestToken || guestToken !== ordine.guestToken) {
        return sendError(res, 'Forbidden', 403);
      }
    }

    const result = await confirmPagamentoOrdineService({
      idOrdine,
      paymentIntentId,
    });

    return sendSuccess(res, result);
  } catch (error) {
    console.error(error);
    return sendError(
      res,
      error.message || "server error: couldn't confirm ordine pagamento",
      error.statusCode || 500,
    );
  }
};

module.exports = {
  createCheckoutOrdine,
  getSingleOrdine,
  confirmOrdinePagamento,
};
