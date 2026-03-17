const {
  getAllProdotti,
  getProdottoById,
  getProdottiByCategoria,
  createProdotto,
  deleteProdottoById,
} = require('../services/prodottiService');
const { sendSuccess, sendError } = require('../utils/response');

const getProdotti = async (req, res) => {
  try {
    const prodotti = await getAllProdotti();
    return sendSuccess(res, prodotti);
  } catch (error) {
    console.error(error);
    return sendError(res, "server error: couldn't get prodotti", 500);
  }
};

const getSingleProdotto = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const prodotto = await getProdottoById(id);

    if (!prodotto) {
      return sendError(res, `prodotto with id ${id} not found`, 404);
    }

    return sendSuccess(res, prodotto);
  } catch (error) {
    console.error(error);
    return sendError(res, "server error: couldn't get prodotto", 500);
  }
};

const getProdottiByCategoriaController = async (req, res) => {
  try {
    const { categoria } = req.params;
    const prodotti = await getProdottiByCategoria(categoria);

    if (prodotti.length === 0) {
      return sendError(res, 'no prodotti in categoria', 404);
    }

    return sendSuccess(res, prodotti);
  } catch (error) {
    console.error(error);
    return sendError(res, "server error: couldn't get prodotti", 500);
  }
};

const addProdotto = async (req, res) => {
  try {
    const { nome, descrizione, prezzo, stock, categoria, image } = req.body;

    if (!nome || prezzo === undefined) {
      return sendError(res, 'nome e prezzo sono obbligatori', 400);
    }

    const createdProdotto = await createProdotto({
      nome,
      descrizione,
      prezzo,
      stock,
      categoria,
      image,
    });

    return sendSuccess(res, createdProdotto, 201);
  } catch (error) {
    console.error(error);
    return sendError(res, "server error: couldn't add prodotto", 500);
  }
};

const removeProdotto = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteProdottoById(id);

    if (!deleted) {
      return sendError(res, 'Prodotto non trovato', 404);
    }

    return sendSuccess(res, { success: true });
  } catch (error) {
    console.error(error);
    return sendError(res, "server error: couldn't delete prodotto", 500);
  }
};

module.exports = {
  getProdotti,
  getSingleProdotto,
  getProdottiByCategoriaController,
  addProdotto,
  removeProdotto,
};
