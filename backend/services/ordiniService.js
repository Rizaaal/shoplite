const crypto = require('crypto');
const db = require('../config/db');
const { createPaymentIntentForOrdine } = require('./pagamentiService');

const mapOrdineRow = (row) => {
  return {
    id: row.id_ordine,
    idCliente: row.id_cliente,
    emailCliente: row.email_cliente,
    nomeCliente: row.nome_cliente,
    cognomeCliente: row.cognome_cliente,
    guestToken: row.guest_token,
    stripePaymentIntentId: row.stripe_payment_intent_id,
    paymentStatus: row.payment_status,
    dataOrdine: row.data_ordine,
    stato: row.stato,
    totale: Number(row.totale),
    indirizzoSpedizione: row.indirizzo_spedizione,
    postalCode: row.postal_code,
    city: row.city,
  };
};

const getOrdineById = async (idOrdine) => {
  const [rows] = await db.query(
    `
    SELECT
      id_ordine,
      id_cliente,
      email_cliente,
      nome_cliente,
      cognome_cliente,
      guest_token,
      stripe_payment_intent_id,
      payment_status,
      data_ordine,
      stato,
      totale,
      indirizzo_spedizione,
      postal_code,
      city
    FROM ordini
    WHERE id_ordine = ?
    LIMIT 1
    `,
    [idOrdine],
  );

  if (rows.length === 0) {
    return null;
  }

  return mapOrdineRow(rows[0]);
};

const getOrdineByPaymentIntentId = async (paymentIntentId) => {
  const [rows] = await db.query(
    `
    SELECT
      id_ordine,
      id_cliente,
      email_cliente,
      nome_cliente,
      cognome_cliente,
      guest_token,
      stripe_payment_intent_id,
      payment_status,
      data_ordine,
      stato,
      totale,
      indirizzo_spedizione,
      postal_code,
      city
    FROM ordini
    WHERE stripe_payment_intent_id = ?
    LIMIT 1
    `,
    [paymentIntentId],
  );

  if (rows.length === 0) {
    return null;
  }

  return mapOrdineRow(rows[0]);
};

const getDettagliOrdineByIdOrdine = async (idOrdine) => {
  const [rows] = await db.query(
    `
    SELECT
      do.id_dettaglio,
      do.id_ordine,
      do.id_prodotto,
      p.nome AS nome_prodotto,
      do.quantita,
      do.prezzo_unitario,
      do.subtotale
    FROM dettaglio_ordine do
    INNER JOIN prodotti p ON p.id_prodotto = do.id_prodotto
    WHERE do.id_ordine = ?
    ORDER BY do.id_dettaglio ASC
    `,
    [idOrdine],
  );

  return rows.map((row) => ({
    idDettaglio: row.id_dettaglio,
    idOrdine: row.id_ordine,
    idProdotto: row.id_prodotto,
    nomeProdotto: row.nome_prodotto,
    quantita: row.quantita,
    prezzoUnitario: Number(row.prezzo_unitario),
    subtotale: Number(row.subtotale),
  }));
};

const getOrdineCompletoById = async (idOrdine) => {
  const ordine = await getOrdineById(idOrdine);

  if (!ordine) {
    return null;
  }

  const dettagli = await getDettagliOrdineByIdOrdine(idOrdine);

  return {
    ...ordine,
    dettagli,
  };
};

const createCheckoutOrdineService = async ({
  idCliente = null,
  prodotti,
  indirizzoSpedizione,
  postalCode,
  city,
  email,
  nome = null,
  cognome = null,
}) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    if (!Array.isArray(prodotti) || prodotti.length === 0) {
      const error = new Error("L'ordine deve contenere almeno un prodotto");
      error.statusCode = 400;
      throw error;
    }

    let totaleOrdine = 0;
    const righeOrdine = [];

    for (const item of prodotti) {
      const idProdotto = Number(item.idProdotto);
      const quantita = Number(item.quantita);

      if (!idProdotto || !quantita || quantita <= 0) {
        const error = new Error('Prodotti ordine non validi');
        error.statusCode = 400;
        throw error;
      }

      const [prodottoRows] = await connection.query(
        `
        SELECT
          id_prodotto,
          nome,
          prezzo,
          stock
        FROM prodotti
        WHERE id_prodotto = ?
        LIMIT 1
        `,
        [idProdotto],
      );

      if (prodottoRows.length === 0) {
        const error = new Error(`Prodotto con id ${idProdotto} non trovato`);
        error.statusCode = 404;
        throw error;
      }

      const prodotto = prodottoRows[0];

      if (Number(prodotto.stock) < quantita) {
        const error = new Error(`Stock insufficiente per il prodotto ${prodotto.nome}`);
        error.statusCode = 400;
        throw error;
      }

      const prezzoUnitario = Number(prodotto.prezzo);
      const subtotale = prezzoUnitario * quantita;

      totaleOrdine += subtotale;

      righeOrdine.push({
        idProdotto,
        quantita,
        prezzoUnitario,
        subtotale,
      });
    }

    const guestToken = idCliente ? null : crypto.randomBytes(32).toString('hex');

    const [ordineResult] = await connection.query(
      `
      INSERT INTO ordini (
        id_cliente,
        email_cliente,
        nome_cliente,
        cognome_cliente,
        guest_token,
        stato,
        payment_status,
        totale,
        indirizzo_spedizione,
        postal_code,
        city
      )
      VALUES (?, ?, ?, ?, ?, 'in_attesa', 'requires_payment', ?, ?, ?, ?)
      `,
      [
        idCliente,
        email,
        nome,
        cognome,
        guestToken,
        totaleOrdine,
        indirizzoSpedizione,
        postalCode,
        city,
      ],
    );

    const idOrdine = ordineResult.insertId;

    for (const riga of righeOrdine) {
      await connection.query(
        `
        INSERT INTO dettaglio_ordine (
          id_ordine,
          id_prodotto,
          quantita,
          prezzo_unitario,
          subtotale
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [idOrdine, riga.idProdotto, riga.quantita, riga.prezzoUnitario, riga.subtotale],
      );
    }

    const paymentIntent = await createPaymentIntentForOrdine({
      idOrdine,
      amount: totaleOrdine,
      email,
      guestToken,
      idCliente,
    });

    await connection.query(
      `
      UPDATE ordini
      SET stripe_payment_intent_id = ?, payment_status = 'requires_payment'
      WHERE id_ordine = ?
      `,
      [paymentIntent.id, idOrdine],
    );

    await connection.commit();

    return {
      idOrdine,
      guestToken,
      clientSecret: paymentIntent.client_secret,
      amount: totaleOrdine,
      currency: 'eur',
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const markOrdineAsPaid = async ({ idOrdine, paymentIntentId }) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [ordineRows] = await connection.query(
      `
      SELECT
        id_ordine,
        stato,
        payment_status,
        stripe_payment_intent_id
      FROM ordini
      WHERE id_ordine = ?
      LIMIT 1
      FOR UPDATE
      `,
      [idOrdine],
    );

    if (ordineRows.length === 0) {
      const error = new Error('Ordine non trovato');
      error.statusCode = 404;
      throw error;
    }

    const ordine = ordineRows[0];

    if (ordine.stato === 'pagato' && ordine.payment_status === 'succeeded') {
      await connection.commit();
      return;
    }

    const [righe] = await connection.query(
      `
      SELECT id_prodotto, quantita
      FROM dettaglio_ordine
      WHERE id_ordine = ?
      `,
      [idOrdine],
    );

    for (const riga of righe) {
      const [productRows] = await connection.query(
        `
        SELECT id_prodotto, stock
        FROM prodotti
        WHERE id_prodotto = ?
        LIMIT 1
        FOR UPDATE
        `,
        [riga.id_prodotto],
      );

      if (productRows.length === 0) {
        const error = new Error(`Prodotto con id ${riga.id_prodotto} non trovato`);
        error.statusCode = 404;
        throw error;
      }

      const stockAttuale = Number(productRows[0].stock);
      const quantita = Number(riga.quantita);

      if (stockAttuale < quantita) {
        const error = new Error(`Stock insufficiente durante finalizzazione ordine ${idOrdine}`);
        error.statusCode = 400;
        throw error;
      }

      await connection.query(
        `
        UPDATE prodotti
        SET stock = stock - ?
        WHERE id_prodotto = ?
        `,
        [quantita, riga.id_prodotto],
      );
    }

    await connection.query(
      `
      UPDATE ordini
      SET
        stato = 'pagato',
        payment_status = 'succeeded',
        stripe_payment_intent_id = ?
      WHERE id_ordine = ?
      `,
      [paymentIntentId, idOrdine],
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const markOrdineAsPaymentFailed = async ({ paymentIntentId }) => {
  await db.query(
    `
    UPDATE ordini
    SET payment_status = 'failed'
    WHERE stripe_payment_intent_id = ?
    `,
    [paymentIntentId],
  );
};

const markOrdineAsProcessing = async ({ paymentIntentId }) => {
  await db.query(
    `
    UPDATE ordini
    SET payment_status = 'processing'
    WHERE stripe_payment_intent_id = ?
    `,
    [paymentIntentId],
  );
};

const confirmPagamentoOrdineService = async ({ idOrdine, paymentIntentId }) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [ordineRows] = await connection.query(
      `
      SELECT
        id_ordine,
        stato,
        payment_status
      FROM ordini
      WHERE id_ordine = ?
      LIMIT 1
      FOR UPDATE
      `,
      [idOrdine],
    );

    if (ordineRows.length === 0) {
      const error = new Error('Ordine non trovato');
      error.statusCode = 404;
      throw error;
    }

    const ordine = ordineRows[0];

    if (ordine.stato === 'pagato' && ordine.payment_status === 'succeeded') {
      await connection.commit();
      return { alreadyConfirmed: true };
    }

    const [righe] = await connection.query(
      `
      SELECT id_prodotto, quantita
      FROM dettaglio_ordine
      WHERE id_ordine = ?
      `,
      [idOrdine],
    );

    for (const riga of righe) {
      const [productRows] = await connection.query(
        `
        SELECT id_prodotto, stock
        FROM prodotti
        WHERE id_prodotto = ?
        LIMIT 1
        FOR UPDATE
        `,
        [riga.id_prodotto],
      );

      if (productRows.length === 0) {
        const error = new Error(`Prodotto con id ${riga.id_prodotto} non trovato`);
        error.statusCode = 404;
        throw error;
      }

      const stockAttuale = Number(productRows[0].stock);
      const quantita = Number(riga.quantita);

      if (stockAttuale < quantita) {
        const error = new Error(`Stock insufficiente durante finalizzazione ordine ${idOrdine}`);
        error.statusCode = 400;
        throw error;
      }

      await connection.query(
        `
        UPDATE prodotti
        SET stock = stock - ?
        WHERE id_prodotto = ?
        `,
        [quantita, riga.id_prodotto],
      );
    }

    await connection.query(
      `
      UPDATE ordini
      SET
        stato = 'pagato',
        payment_status = 'succeeded',
        stripe_payment_intent_id = ?
      WHERE id_ordine = ?
      `,
      [paymentIntentId, idOrdine],
    );

    await connection.commit();

    return { confirmed: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  getOrdineById,
  getOrdineByPaymentIntentId,
  getDettagliOrdineByIdOrdine,
  getOrdineCompletoById,
  createCheckoutOrdineService,
  markOrdineAsPaid,
  markOrdineAsPaymentFailed,
  markOrdineAsProcessing,
  confirmPagamentoOrdineService,
};
