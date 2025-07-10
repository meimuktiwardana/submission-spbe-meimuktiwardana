// src/controllers/bookController.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllBooks = async (req, res) => {
  try {
    const books = await prisma.books.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBookDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await prisma.books.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        books_product: {
          include: {
            warehouse: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const response = {
      id: book.id,
      title: book.title,
      isbn: book.isbn,
      publication_year: book.publication_year,
      genre: book.genre,
      author: book.author,
      products: book.books_product.map(product => ({
        id: product.id,
        format: product.format,
        price: parseFloat(product.price),
        stock: product.stock,
        warehouse: product.warehouse
      }))
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllBooks, getBookDetail };