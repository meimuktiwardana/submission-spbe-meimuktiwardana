// src/routes/books.js
const express = require('express');
const { getAllBooks, getBookDetail } = require('../controllers/bookController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, getAllBooks);
router.get('/:id', authenticateToken, getBookDetail);

module.exports = router;