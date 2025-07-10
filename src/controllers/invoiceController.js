// src/controllers/invoiceController.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getInvoices = async (req, res) => {
  try {
    const userId = req.user.id;

    const invoices = await prisma.invoice.findMany({
      where: { customer_id: userId },
      orderBy: {
        issued_at: 'desc'
      }
    });

    const response = invoices.map(invoice => ({
      id: invoice.id,
      cart_id: invoice.cart_id,
      total_amount: parseFloat(invoice.total_amount),
      status: invoice.status,
      issued_at: invoice.issued_at
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getInvoices };