import express from 'express';
import categoryController from '../../controller/category.controller';
import { authorize, restrictTo } from '../../utils/auth.service';
import FileUploader from '../../middlewares/file_uploader';


const router = express.Router();
const upload = FileUploader();

router.route('/')
	.all(authorize)
  .post(upload.single("thumbnail"), categoryController.createCategory)
  .get(categoryController.getAllCategories);

router.route('/:id')
	.all(authorize)
  .get(categoryController.getCategory)
  .patch(upload.single("thumbnail"), categoryController.updateCategory)
  .delete(restrictTo("Admin", "Customer"), categoryController.deleteCategory);

router.put('/:id', [authorize, restrictTo("Admin", "Customer")], categoryController.draftCategory);

export default router;
