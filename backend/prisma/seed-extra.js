const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

const CATEGORIES = [
  'Electronics', 'Clothing', 'Home & Garden', 
  'Sports', 'Toys', 'Automotive', 'Books'
];

async function addExtraProducts(count = 50) {
  console.log(`Adding ${count} new products...`);

  const newProducts = Array.from({ length: count }).map(() => {
    const createdAt = faker.date.past({ years: 1 });
    const updatedAt = new Date(); // These are "newly updated" / "new" items

    return {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      category: faker.helpers.arrayElement(CATEGORIES),
      price: faker.commerce.price({ min: 10, max: 2000, dec: 2 }),
      created_at: createdAt,
      updated_at: updatedAt // Setting this to NOW ensures they appear at the TOP
    };
  });

  await prisma.product.createMany({
    data: newProducts,
  });

  console.log(`Successfully added ${count} new products.`);
}

addExtraProducts(50)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });