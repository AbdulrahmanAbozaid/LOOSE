import { Request, Response, NextFunction, RequestHandler } from "express";
import CategoryModel, { Category } from "../model/category/model";
import asyncHandler from "../middlewares/async_handler";
import AppError from "../utils/app_error";
import cloudinary from "../middlewares/cloudinary_uploader";
import fs from "fs";
import Product from "../model/product/model";


type opt = {
  use_filename?: boolean;
  unique_filename?: boolean;
  overwrite: boolean;
  folder?: string;
  public_id?: string;
};

const CLOUD_OPTS: opt = {
  use_filename: true,
  unique_filename: false,
  overwrite: true,
  folder: "Loose/categories",
};

class CategoryController {
  // Method to create a new category
  public createCategory: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      let tpub: string = "";
      if (req?.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          req.file.path,
          CLOUD_OPTS
        );
        tpub = public_id;
        req.body.thumbnail = { url: secure_url, public_id };
        if (public_id) {
          fs.unlinkSync(req.file.path);
        }
      }

      try {
        const category: Category = await CategoryModel.create(req.body);

        res.status(201).json({ success: true, data: { category } });
      } catch (error: any) {
        if (tpub) await cloudinary.uploader.destroy(tpub);

        if (error.code === 11000) {
          return next(new AppError("Category already exists", 400));
        }

        return next(new AppError(error.message, 400));
      }
    }
  );

  public getAllCategories: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const categories: Category[] = await CategoryModel.find();

      res.status(200).json({ success: true, data: { categories } });
    }
  );

  public getCategory: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const categoryId: string = req.params.id;

      const category: Category | null = await CategoryModel.findById(
        categoryId
      );

      if (!category) {
        return next(new AppError("Category not found", 404));
      }

      res.status(200).json({ success: true, data: { category } });
    }
  );

  public updateCategory: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const category = await CategoryModel.findById(req.params.id);

      if (!category) {
        return next(new AppError("Category not found", 404));
      }

      // updating the thumbnail
      if (req?.file) {
        let OPTS: opt = { ...CLOUD_OPTS };

        if (category.thumbnail?.public_id) {
          OPTS = {
            overwrite: true,
            public_id: category.thumbnail.public_id,
          };
        }

        const { secure_url, public_id } = await cloudinary.uploader.upload(
          req.file.path,
          OPTS
        );

        req.body.thumbnail = { url: secure_url, public_id };
        if (public_id) {
          fs.unlinkSync(req.file.path);
        }
      }

      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      res
        .status(200)
        .json({ success: true, data: { category: updatedCategory } });
    }
  );

  public deleteCategory: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const categoryId: string = req.params.id;

      const category: Category | null = await CategoryModel.findByIdAndDelete(
        categoryId
      );

      if (!category) {
        return next(new AppError("Category not found", 404));
      }

      if (category.thumbnail?.public_id) {
        await cloudinary.uploader.destroy(category.thumbnail.public_id);
      }

      res
        .status(200)
        .json({ success: true, message: "Category deleted successfully" });
    }
  );

  public draftCategory: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const categoryId: string = req.params.id;

      const category: Category | null = await CategoryModel.findByIdAndUpdate(
        categoryId,
        { status: "draft" },
        { new: true }
      );

      if (!category) {
        return next(new AppError("Category not found", 404));
      }

      res
        .status(200)
        .json({ success: true, message: "Category drafted successfully" });
    }
  );

  // Method to get all products related to category
  public getCategoryProducts: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const products = await Product.find({
		category: req.params.id
	  });
      res.status(200).json({ success: true, data: { products } });
    }
  );
}

export default new CategoryController();
