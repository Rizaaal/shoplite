const express = require('express');
const {
  getProdotti,
  getSingleProdotto,
  getProdottiByCategoriaController,
  addProdotto,
  updateProdotto,
  removeProdotto,
} = require('../controllers/prodottiController');
const { protectedRoute } = require('../middlewares/protectedRoute');
const { adminOnly } = require('../middlewares/adminOnly');
const { validateProductCreate } = require('../middlewares/validateProductCreate');

const router = express.Router();

// Lettura prodotti pubblica
router.get('/', getProdotti);
router.get('/categoria/:categoria', getProdottiByCategoriaController);
router.get('/:id', getSingleProdotto);

// Solo admin può creare, modificare o cancellare prodotti
router.post('/', protectedRoute, adminOnly, validateProductCreate, addProdotto);
router.patch('/:id', protectedRoute, adminOnly, updateProdotto);
router.delete('/:id', protectedRoute, adminOnly, removeProdotto);

module.exports = router;
