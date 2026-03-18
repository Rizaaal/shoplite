const express = require('express');
const {
  createCheckoutOrdine,
  getSingleOrdine,
  confirmOrdinePagamento,
} = require('../controllers/ordiniController');
const { optionalAuth } = require('../middlewares/optionalAuth');

const router = express.Router();

router.post('/checkout', optionalAuth, createCheckoutOrdine);
router.get('/:id', optionalAuth, getSingleOrdine);
router.post('/:id/conferma-pagamento', optionalAuth, confirmOrdinePagamento);

module.exports = router;
