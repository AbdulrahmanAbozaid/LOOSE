import { Request, Response, NextFunction, RequestHandler } from 'express';
import CategoryModel, { Category } from '../model/category/model';
import asyncHandler from '../middlewares/async_handler';
import AppError from '../utils/app_error';

class CategoryController {
  public createCategory: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, status, thumbnail } = req.body;

    const category: Category = await CategoryModel.create({ name, description, status, thumbnail });

    res.status(201).json({ success: true, data: { category } });
  });

  public getAllCategories: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const categories: Category[] = await CategoryModel.find();

    res.status(200).json({ success: true, data: { categories } });
  });

  public getCategory: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const categoryId: string = req.params.id;

    const category: Category | null = await CategoryModel.findById(categoryId);

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.status(200).json({ success: true, data: { category } });
  });

  public updateCategory: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const categoryId: string = req.params.id;
    const { name, description, status, thumbnail } = req.body;

    const category: Category | null = await CategoryModel.findByIdAndUpdate(
      categoryId,
      { name, description, status, thumbnail },
      { new: true }
    );

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.status(200).json({ success: true, data: { category } });
  });

  public deleteCategory: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const categoryId: string = req.params.id;

    const category: Category | null = await CategoryModel.findByIdAndDelete(categoryId);

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  });

  public draftCategory: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const categoryId: string = req.params.id;

    const category: Category | null = await CategoryModel.findByIdAndUpdate(
      categoryId,
      { status: 'draft' },
      { new: true }
    );

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.status(200).json({ success: true, message: 'Category drafted successfully' });
  });
}

export default new CategoryController();
