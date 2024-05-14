// Import necessary modules and classes
import express from 'express';
import productController from '../../controller/product.controller';
import { authorize, restrictTo } from '../../utils/auth.service';

// Create a router instance
const router = express.Router();

// Define routes
router.route('/')
	.all(authorize)
  .post(productController.createProduct)
  .get(productController.getAllProducts);

router.route('/:id')
.all(authorize)
  .patch(productController.updateProduct)
  .get(productController.getProductById)
  .delete(restrictTo("Admin"), productController.deleteProduct)
  .put(productController.draftProduct);

router.route('/:id/add-to-cart')
  .put(authorize, productController.addToCart);

// Export router
export default router;
