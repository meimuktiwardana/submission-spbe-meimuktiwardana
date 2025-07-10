// src/routes/cart.js
const express = require('express');
const { getCart, addToCart, checkout } = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, getCart);
router.post('/items', authenticateToken, addToCart);
router.post('/checkout', authenticateToken, checkout);

module.exports = router;