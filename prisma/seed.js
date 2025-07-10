// prisma/seed.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create authors
  const author1 = await prisma.authors.create({
    data: {
      name: 'Robert C. Martin',
      bio: 'Software engineer and author',
      birthdate: new Date('1952-12-05')
    }
  });

  const author2 = await prisma.authors.create({
    data: {
      name: 'Martin Fowler',
      bio: 'Software developer and author',
      birthdate: new Date('1963-12-18')
    }
  });

  // Create warehouse
  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: 'Gudang Jakarta',
      address: 'Jl. Gudang No. 1, Jakarta',
      capacity: 1000
    }
  });

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: 'Gudang Surabaya',
      address: 'Jl. Gudang No. 2, Surabaya',
      capacity: 800
    }
  });

  // Create books
  const book1 = await prisma.books.create({
    data: {
      title: 'Clean Code',
      isbn: '9780132350884',
      publication_year: 2008,
      genre: 'Programming',
      author_id: author1.id
    }
  });

  const book2 = await prisma.books.create({
    data: {
      title: 'Refactoring',
      isbn: '9780134757599',
      publication_year: 2019,
      genre: 'Programming',
      author_id: author2.id
    }
  });

  // Create products
  await prisma.books_product.createMany({
    data: [
      {
        book_id: book1.id,
        price: 350000,
        stock: 12,
        format: 'hardcover',
        warehouse_id: warehouse1.id
      },
      {
        book_id: book1.id,
        price: 250000,
        stock: 25,
        format: 'paperback',
        warehouse_id: warehouse1.id
      },
      {
        book_id: book2.id,
        price: 400000,
        stock: 8,
        format: 'hardcover',
        warehouse_id: warehouse2.id
      },
      {
        book_id: book2.id,
        price: 300000,
        stock: 15,
        format: 'paperback',
        warehouse_id: warehouse2.id
      }
    ]
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });