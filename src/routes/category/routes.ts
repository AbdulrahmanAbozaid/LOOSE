import express from 'express';
import categoryController from '../../controller/category.controller';
import { authorize, restrictTo } from '../../utils/auth.service';

const router = express.Router();

router.route('/')
	.all(authorize)
  .post(categoryController.createCategory)
  .get(categoryController.getAllCategories);

router.route('/:id')
	.all(authorize)
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(restrictTo("Admin"), categoryController.deleteCategory);

router.put('/:id', restrictTo("Admin"), categoryController.draftCategory);

export default router;
