// src/controllers/cartController.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await prisma.cart.findFirst({
      where: { customer_id: userId },
      include: {
        cart_item: {
          include: {
            books_product: {
              include: {
                book: {
                  select: {
                    title: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!cart) {
      // Create new cart if doesn't exist
      cart = await prisma.cart.create({
        data: {
          customer_id: userId
        },
        include: {
          cart_item: {
            include: {
              books_product: {
                include: {
                  book: {
                    select: {
                      title: true
                    }
                  }
                }
              }
            }
          }
        }
      });
    }

    const response = {
      id: cart.id,
      customer_id: cart.customer_id,
      created_at: cart.created_at,
      items: cart.cart_item.map(item => ({
        id: item.id,
        books_product_id: item.books_product_id,
        quantity: item.quantity,
        created_at: item.created_at,
        product: {
          book: {
            title: item.books_product.book.title
          },
          format: item.books_product.format,
          price: parseFloat(item.books_product.price)
        }
      }))
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { books_product_id, quantity } = req.body;

    // Find or create cart
    let cart = await prisma.cart.findFirst({
      where: { customer_id: userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          customer_id: userId
        }
      });
    }

    // Check if product exists
    const product = await prisma.books_product.findUnique({
      where: { id: books_product_id }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cart_item.findFirst({
      where: {
        cart_id: cart.id,
        books_product_id: books_product_id
      }
    });

    let cartItem;
    if (existingItem) {
      // Update quantity
      cartItem = await prisma.cart_item.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity
        }
      });
    } else {
      // Create new item
      cartItem = await prisma.cart_item.create({
        data: {
          cart_id: cart.id,
          books_product_id,
          quantity
        }
      });
    }

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkout = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find cart with items
    const cart = await prisma.cart.findFirst({
      where: { customer_id: userId },
      include: {
        cart_item: {
          include: {
            books_product: true
          }
        }
      }
    });

    if (!cart || cart.cart_item.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total amount
    let totalAmount = 0;
    for (const item of cart.cart_item) {
      totalAmount += parseFloat(item.books_product.price) * item.quantity;
    }

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        cart_id: cart.id,
        customer_id: userId,
        total_amount: totalAmount,
        status: 'pending'
      }
    });

    // Create invoice items
    for (const item of cart.cart_item) {
      await prisma.invoice_item.create({
        data: {
          invoice_id: invoice.id,
          books_product_id: item.books_product_id,
          quantity: item.quantity,
          price: item.books_product.price
        }
      });

      // Update stock
      await prisma.books_product.update({
        where: { id: item.books_product_id },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    // Clear cart
    await prisma.cart_item.deleteMany({
      where: { cart_id: cart.id }
    });

    res.json({
      invoice_id: invoice.id,
      status: invoice.status,
      total_amount: parseFloat(invoice.total_amount),
      issued_at: invoice.issued_at
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCart, addToCart, checkout };