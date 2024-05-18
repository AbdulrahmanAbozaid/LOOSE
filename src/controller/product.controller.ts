import { Request, Response, NextFunction, RequestHandler } from "express";
import Product from "../model/product/model";
import asyncHandler from "../middlewares/async_handler";
import AppError from "../utils/app_error";
import User from "../model/user/model";
import fs from "fs";
import cloudinary from "./../middlewares/cloudinary_uploader";

const CLOUD_OPTS = {
  use_filename: true,
  unique_filename: false,
  overwrite: true,
  folder: "Loose/products",
};

class ProductController {
  // Method to create a new product
  public createProduct: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      let photos: { url: string; public_id: string }[] = [];
      if (req.files?.length) {
        for (let file of req.files as Express.Multer.File[]) {
          const res = await cloudinary.uploader.upload(file.path, CLOUD_OPTS);
          photos.push({ url: res.secure_url, public_id: res.public_id });
          if (res?.public_id) {
            fs.unlinkSync(file.path);
          }
        }

        req.body.photos = photos;
      }

      console.log(req.body);

      const product = await Product.create(req.body);
      res.status(201).json({ success: true, data: { product } });
    }
  );

  // Method to get all products
  public getAllProducts: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const products = await Product.find();
      res.status(200).json({ success: true, data: { products } });
    }
  );

  // Method to get a product by ID
  public getProductById: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return next(new AppError("Product not found", 404));
      }
      if ((req as any)?.user?.role !== "admin") {
        await product.increaseViews();
      }
      res.status(200).json({ success: true, data: { product } });
    }
  );

  // Method to update a product by ID
  // @req.body {restPhotos, photos}
  public updateProducts: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // get the product
      const product = await Product.findById(req.params.id);

      if (!product) {
        return next(new AppError("Product not found", 404));
      }

      // if there is deleted photos, delete'em
      if (req.body?.deletedPhotos) {
        req.body.deletedPhotos = req.body.deletedPhotos.split(" ");
        console.log(req.body.deletedPhotos);

        for (let photo of req.body.deletedPhotos) {
          await cloudinary.uploader.destroy(photo);
        }
        delete req.body.deletedPhotos;

        req.body.photos = req.body.restPhotos;
        delete req.body.restPhotos;
      }

      // get the new uploaded photos
      if (req.files?.length) {
        let newPhotos: { url: string; public_id: string }[] = [];

        for (let file of req.files as Express.Multer.File[]) {
          const { secure_url, public_id } = await cloudinary.uploader.upload(
            file.path,
            CLOUD_OPTS
          );
          newPhotos.push({ url: secure_url, public_id: public_id });
          if (public_id) {
            fs.unlinkSync(file.path);
          }
        }

        // add the new photos to the existing photos array
        if (req.body?.restPhotos) {
          newPhotos = [...newPhotos, ...req.body.restPhotos];
          delete req.body.restPhotos;
        }

        req.body.photos = [...newPhotos, ...req.body.photos];
      }

      //update the product
      await product.updateOne(req.body);
      const fproduct: any = await product.save();
      res.status(200).json({ success: true, data: { fproduct } });
    }
  );

  // Method to delete a product by ID
  public deleteProduct: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return next(new AppError("Product not found", 404));
      }

      console.log(product);

      let { photos } = product;

      // Delete photos from cloudinary
      for (let photo of photos as { url: string; public_id: string }[]) {
        await cloudinary.uploader.destroy(photo.public_id);
      }

      res
        .status(200)
        .json({ success: true, message: "Product deleted successfully" });
    }
  );

  // Method to draft a product by ID
  public draftProduct: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { status: "draft" },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!product) {
        return next(new AppError("Product not found", 404));
      }
      res
        .status(200)
        .json({ success: true, message: "Product drafted successfully" });
    }
  );

  // add a product to the cart
  public addToCart = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const productId = req.params.id;
      const { quantity } = req.body;

      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return next(new AppError("Product not found", 404));
      }

      // Check if user exists
      const user = await User.findById((req as any).user.id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      // Check if quantity is valid
      if (typeof quantity !== "number" || quantity <= 0) {
        return next(new AppError("Invalid quantity", 400));
      }

      // Add product to user's cart
      await user.addToCart(product.id, quantity, product.price);

      res
        .status(200)
        .json({ success: true, message: "Product added to cart successfully" });
    }
  );

  // remove a product to the cart
  public removeFromCart = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const productId = req.params.id;
      const { quantity } = req.body;

      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return next(new AppError("Product not found", 404));
      }

      // Check if user exists
      const user = await User.findById((req as any).user.id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      // Check if quantity is valid
      if (typeof quantity !== "number" || quantity <= 0) {
        return next(new AppError("Invalid quantity", 400));
      }

      // remove product to user's cart
      await user.removeFromCart(product.id, quantity, product.price);

      res.status(200).json({
        success: true,
        message: "Product removed from cart successfully",
      });
    }
  );

  //   public checkoutCart: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  //     const userId = (req as any).user.id;
  //     const user = await User.findById(userId).populate('cart.items.product');

  //     if (!user) {
  //       return next(new AppError('User not found', 404));
  //     }

  //     if (user.cart.items.length === 0) {
  //       return next(new AppError('Cart is empty', 400));
  //     }

  //     let message = `Order Details:\n`;

  //     for (const item of user.cart.items) {
  //       const product = item.product as any; // Cast to any to access product fields
  //       message += `Product: ${product.name}, Quantity: ${item.quantity}`;

  //       // Update the number of sales
  //       product.numOfSales += item.quantity;
  //       await product.save();
  //     }

  //     message += `Total Price: ${user.cart.totalPrice}, Total Quantity: ${user.cart.totalQuantity}`;

  //     // Send the message to admin's WhatsApp
  //     // await sendToWhatsapp(process.env.ADMIN_WHATSAPP_NUMBER!, message);

  //     // Reset the cart
  //     user.cart.items = [];
  //     user.cart.totalPrice = 0;
  //     user.cart.totalQuantity = 0;
  //     await user.save();

  //     res.status(200).json({ success: true, message: 'Checkout successful and cart cleared', phone: process.env.ADMIN_WHATSAPP_NUMBER });
  //   });
}

export default new ProductController();
