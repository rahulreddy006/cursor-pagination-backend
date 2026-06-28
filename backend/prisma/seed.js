const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

const CATEGORIES = [
  'Electronics', 'Clothing', 'Home & Garden', 
  'Sports', 'Toys', 'Automotive', 'Books'
];

const TOTAL_RECORDS = 200000;
const BATCH_SIZE = 10000;

async function main() {
  const existingCount = await prisma.product.count();
  if (existingCount > 0) {
    console.log(`Found ${existingCount} products. Clearing database for clean run...`);
    await prisma.product.deleteMany({});
  }

  console.log(`Starting database seed... Targeting ${TOTAL_RECORDS} products.`);
  const startTime = Date.now();

  for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
    const batch = [];
    
    for (let j = 0; j < BATCH_SIZE; j++) {
      const createdAt = faker.date.past({ years: 2 });
      // Realistic data: updated_at is strictly between created_at and NOW
      const updatedAt = faker.date.between({ from: createdAt, to: new Date() });

      batch.push({
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        category: faker.helpers.arrayElement(CATEGORIES),
        price: faker.commerce.price({ min: 10, max: 2000, dec: 2 }),
        created_at: createdAt,
        updated_at: updatedAt
      });
    }

    await prisma.product.createMany({
      data: batch,
    });

    console.log(`Inserted batch ${(i / BATCH_SIZE) + 1} of ${TOTAL_RECORDS / BATCH_SIZE}...`);
  }

  const endTime = Date.now();
  console.log(`Seeding complete in ${(endTime - startTime) / 1000} seconds.`);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });