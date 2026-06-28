const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ProductService {
  static async getProducts({ category, limit, cursorDate, cursor_id }) {
    

    const andConditions = [];

    if (category) {
      andConditions.push({ category: category });
    }

    if (cursorDate && cursor_id) {
      andConditions.push({
        OR: [
          { updated_at: { lt: cursorDate } },
          {
            updated_at: cursorDate,
            id: { lt: cursor_id },
          },
        ]
      });
    }

    const whereClause = andConditions.length > 0 ? { AND: andConditions } : {};

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: [
        { updated_at: 'desc' },
        { id: 'desc' },
      ],
      take: limit + 1, 
    });

    const hasNextPage = products.length > limit;
    
    if (hasNextPage) {
      products.pop();
    }

    let nextCursor = null;
    if (products.length > 0) {
      const lastItem = products[products.length - 1];
      nextCursor = {
        updated_at: lastItem.updated_at,
        id: lastItem.id,
      };
    }

    return {
      products,
      pagination: {
        limit, 
        hasNextPage,
        nextCursor,
      }
    };
  }
}

module.exports = ProductService;