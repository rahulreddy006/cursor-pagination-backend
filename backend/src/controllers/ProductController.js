const ProductService = require('../services/ProductService');

const VALID_CATEGORIES = [
  'Electronics', 'Clothing', 'Home & Garden', 
  'Sports', 'Toys', 'Automotive', 'Books'
];

class ProductController {
  static async list(req, res) {
    try {
      const { category, limit, cursor_updated_at, cursor_id } = req.query;

      // 1. Validate Category
      if (category && !VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({
          success: false,
          message: `Invalid category. Allowed values: ${VALID_CATEGORIES.join(', ')}`
        });
      }

      // 2. Validate Limit
      let finalLimit = 50; 
      if (limit !== undefined) {
        const parsedLimit = parseInt(limit, 10);
        if (isNaN(parsedLimit) || parsedLimit <= 0) {
          return res.status(400).json({
            success: false,
            message: "Invalid limit. Must be a positive integer."
          });
        }
        finalLimit = Math.min(parsedLimit, 100); 
      }

      // 3. Validate Cursor Date
      let parsedDate = null;
      if (cursor_updated_at) {
        parsedDate = new Date(cursor_updated_at);
        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid cursor_updated_at date format."
          });
        }
      }

      const result = await ProductService.getProducts({
        category,
        limit: finalLimit,
        cursorDate: parsedDate,
        cursor_id,
      });

      return res.status(200).json({
        success: true,
        data: result.products,
        meta: result.pagination
      });

    } catch (error) {
      console.error("Error in ProductController.list:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error while fetching products"
      });
    }
  }
}

module.exports = ProductController;