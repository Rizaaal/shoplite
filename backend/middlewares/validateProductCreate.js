const { sendError } = require('../utils/response');

const allowedCategories = ['GPU', 'Memoria', 'Accessori', 'Case', 'CPU', 'Scheda Madre'];

const validateProductCreate = (req, res, next) => {
  const { nome, descrizione, prezzo, stock, categoria, image } = req.body;

  if (!nome || typeof nome !== 'string' || !nome.trim()) {
    return sendError(res, 'Il nome è obbligatorio', 400);
  }

  if (descrizione !== undefined && typeof descrizione !== 'string') {
    return sendError(res, 'La descrizione deve essere una stringa', 400);
  }

  if (prezzo === undefined || prezzo === null || Number.isNaN(Number(prezzo))) {
    return sendError(res, 'Il prezzo è obbligatorio e deve essere un numero valido', 400);
  }

  if (Number(prezzo) < 0) {
    return sendError(res, 'Il prezzo deve essere maggiore o uguale a 0', 400);
  }

  if (stock === undefined || stock === null || Number.isNaN(Number(stock))) {
    return sendError(res, 'Lo stock è obbligatorio e deve essere un numero valido', 400);
  }

  if (!Number.isInteger(Number(stock))) {
    return sendError(res, 'Lo stock deve essere un numero intero', 400);
  }

  if (Number(stock) < 0) {
    return sendError(res, 'Lo stock deve essere maggiore o uguale a 0', 400);
  }

  if (!categoria || typeof categoria !== 'string') {
    return sendError(res, 'La categoria è obbligatoria', 400);
  }

  if (!allowedCategories.includes(categoria)) {
    return sendError(
      res,
      `Categoria non valida. Valori ammessi: ${allowedCategories.join(', ')}`,
      400,
    );
  }

  if (image !== undefined && image !== null && typeof image !== 'string') {
    return sendError(res, "L'immagine deve essere una stringa valida", 400);
  }

  req.body = {
    ...req.body,
    nome: nome.trim(),
    descrizione: typeof descrizione === 'string' ? descrizione.trim() : descrizione,
    prezzo: Number(prezzo),
    stock: Number(stock),
    categoria: categoria.trim(),
  };

  next();
};

module.exports = {
  validateProductCreate,
  allowedCategories,
};
