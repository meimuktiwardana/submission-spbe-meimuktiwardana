// src/routes/invoices.js
const express = require('express');
const { getInvoices } = require('../controllers/invoiceController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, getInvoices);

module.exports = router;