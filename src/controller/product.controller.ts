import { Request, Response, NextFunction, RequestHandler } from "express";
import Product from "../model/product/model";
import asyncHandler from "../middlewares/async_handler";
import AppError from "../utils/app_error";
import User from "../model/user/model";
import cloud from "../middlewares/cloudinary_uploader";
import fs from "fs";

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
          const res = await cloud.uploader.upload(file.path, CLOUD_OPTS);
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
		console.log(req.body);
		
      const product = await Product.findById(req.params.id);
      if (!product) {
        return next(new AppError("Product not found", 404));
      }
      res.status(200).json({ success: true, data: { product } });
    }
  );

  // Method to update a product by ID
  // @req.body {oldPhotos, photos}
  public updateProduct: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // upload the images to cloudinary
      if (req.files?.length) {
		// the old photos in the product
        req.body.oldPhotos = req.body.oldPhotos || [];

		// loop over the files and upload to cloud
        for (let file of req.files as Express.Multer.File[]) {
          const { secure_url, public_id } = await cloud.uploader.upload(
            file.path,
            CLOUD_OPTS
          );
          req.body.oldPhotos.push({ url: secure_url, public_id });

		  // remove the file from the local disk after uplodaing
          if (public_id) {
            fs.unlinkSync(file.path);
          }
        }

        req.body.photos = req.body.oldPhotos;
		delete req.body.oldPhotos;
      }

      // delete the past photos, the request has the public_ids
      let deletedPhotos: string | string[] = req.body.deletedPhotos || [];
	  
	  if (process.env.NODE_ENV == 'development' && req.body.deletedPhotos instanceof String) {
		deletedPhotos = (deletedPhotos as string).split(" ");
	  }

	  // deleting unnecessary photos
      for (let photo of deletedPhotos) {
        await cloud.uploader.destroy(photo);
      }

	  // update the model
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!product) {
        return next(new AppError("Product not found", 404));
      }
      res.status(200).json({ success: true, data: { product } });
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
        await cloud.uploader.destroy(photo.public_id);
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
      user.addToCart(product.id, quantity, product.price);

      res
        .status(200)
        .json({ success: true, message: "Product added to cart successfully" });
    }
  );


}

export default new ProductController();
