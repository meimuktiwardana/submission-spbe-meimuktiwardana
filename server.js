const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const bookRoutes = require('./src/routes/books');
const cartRoutes = require('./src/routes/cart');
const invoiceRoutes = require('./src/routes/invoices');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/cart', cartRoutes);
app.use('/invoices', invoiceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});