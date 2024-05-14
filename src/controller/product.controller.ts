import { Request, Response, NextFunction, RequestHandler } from 'express';
import Product from '../model/product/model';
import asyncHandler from '../middlewares/async_handler';
import AppError from '../utils/app_error';
import User from "../model/user/model"

class ProductController {
  // Method to create a new product
  public createProduct: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: { product } });
  });

  // Method to get all products
  public getAllProducts: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find();
    res.status(200).json({ success: true, data: { products } });
  });

  // Method to get a product by ID
  public getProductById: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    res.status(200).json({ success: true, data: { product } });
  });

  // Method to update a product by ID
  public updateProduct: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    res.status(200).json({ success: true, data: { product } });
  });

  // Method to delete a product by ID
  public deleteProduct: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  });

  // Method to draft a product by ID
  public draftProduct: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findByIdAndUpdate(req.params.id, { status: 'draft' }, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    res.status(200).json({ success: true, message: 'Product drafted successfully' });
  });

  public addToCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.id;
    const { quantity, colors, size } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Check if user exists
    const user = await User.findById((req as any).user.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Check if quantity is valid
    if (typeof quantity !== 'number' || quantity <= 0) {
      return next(new AppError('Invalid quantity', 400));
    }

    // Add product to user's cart
    user.addToCart(productId, quantity, colors, size);

    res.status(200).json({ success: true, message: 'Product added to cart successfully' });
  });
}

export default new ProductController();
