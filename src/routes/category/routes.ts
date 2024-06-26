import express from 'express';
import categoryController from '../../controller/category.controller';
// import { authorize, restrictTo } from '../../utils/auth.service';
import FileUploader from '../../middlewares/file_uploader';
import { authorize } from '../../utils/auth.service';


const router = express.Router();
const upload = FileUploader();

router.get('/:id/products', authorize, categoryController.getCategoryProducts)

router.route('/')
	.all()
  .post(upload.single("thumbnail"), categoryController.createCategory)
  .get(categoryController.getAllCategories);

router.route('/:id')
	.all()
  .get(categoryController.getCategory)
  .patch(upload.single("thumbnail"), categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

router.put('/:id', categoryController.draftCategory);

export default router;
