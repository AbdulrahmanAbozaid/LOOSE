// Import necessary modules and classes
import express from 'express';
import productController from '../../controller/product.controller';
import { authorize, restrictTo } from '../../utils/auth.service';
import FileUploader from "../../middlewares/file_uploader"

// Create a router instance
const router = express.Router();
const upload = FileUploader();

// Define routes
router.route('/')
	.all(authorize)
  .post(upload.array("photos", 10), productController.createProduct)
  .get(productController.getAllProducts);

router.route('/:id')
.all(authorize)
  .patch(upload.array("photos", 10), productController.updateProduct)
  .get(productController.getProductById)
  .delete(restrictTo("Admin"), productController.deleteProduct)
  .put(productController.draftProduct);

router.route('/:id/add-to-cart')
  .put(authorize, productController.addToCart);

// Export router
export default router;
