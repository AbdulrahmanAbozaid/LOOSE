// Import necessary modules and classes
import express from 'express';
import productController, {searchProducts} from '../../controller/product.controller';
import { authorize } from '../../utils/auth.service';
import FileUploader from "../../middlewares/file_uploader"

// Create a router instance
const router = express.Router();
const upload = FileUploader();


// Search
router.get('/search', authorize, searchProducts);

// Define routes
router.route('/')
	.all()
  .post(upload.array("photos", 10), productController.createProduct)
  .get(productController.getAllProducts);

router.route('/:id')
.all()
  .patch(upload.array("photos", 10), productController.updateProducts)
  .get(productController.getProductById)
  .delete(productController.deleteProduct)
  .put(productController.draftProduct);

router.route('/:id/add-to-cart')
  .put(authorize, productController.addToCart);

router.route('/:id/remove-from-cart')
  .put(authorize, productController.removeFromCart);

// Export router
export default router;
