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
    createProduct = asyncHandler(async (req, res, next) => {
        let photos = [];
        if (req.files?.length) {
            for (let file of req.files) {
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
    });
    saleStatistics = asyncHandler(async (req, res, next) => {
        const products = await Product.find().sort({ numOfSales: -1 }).limit(10);
        res.status(200).json({ success: true, data: { products } });
    });
    getAllProducts = asyncHandler(async (req, res, next) => {
        const products = await Product.find();
        res.status(200).json({ success: true, data: { products } });
    });
    getProductById = asyncHandler(async (req, res, next) => {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new AppError("Product not found", 404));
        }
        if (req?.user?.role.toLowerCase() !== "admin") {
            await product.increaseViews();
        }
        res.status(200).json({ success: true, data: { product } });
    });
    updateProducts = asyncHandler(async (req, res, next) => {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new AppError("Product not found", 404));
        }
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
        if (req.files?.length) {
            let newPhotos = [];
            for (let file of req.files) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, CLOUD_OPTS);
                newPhotos.push({ url: secure_url, public_id: public_id });
                if (public_id) {
                    fs.unlinkSync(file.path);
                }
            }
            if (req.body?.restPhotos) {
                newPhotos = [...newPhotos, ...req.body.restPhotos];
                delete req.body.restPhotos;
            }
            req.body.photos = [...newPhotos, ...req.body.photos];
        }
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res
            .status(200)
            .json({ success: true, data: { product: updatedProduct } });
    });
    deleteProduct = asyncHandler(async (req, res, next) => {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return next(new AppError("Product not found", 404));
        }
        console.log(product);
        let { photos } = product;
        for (let photo of photos) {
            await cloudinary.uploader.destroy(photo.public_id);
        }
        res
            .status(200)
            .json({ success: true, message: "Product deleted successfully" });
    });
    draftProduct = asyncHandler(async (req, res, next) => {
        const product = await Product.findByIdAndUpdate(req.params.id, { status: "draft" }, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            return next(new AppError("Product not found", 404));
        }
        res
            .status(200)
            .json({ success: true, message: "Product drafted successfully" });
    });
    addToCart = asyncHandler(async (req, res, next) => {
        const productId = req.params.id;
        const { quantity = 1, sizes, colors } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return next(new AppError("Product not found", 404));
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new AppError("User not found", 404));
        }
        if (typeof quantity !== "number" || quantity <= 0) {
            return next(new AppError("Invalid quantity", 400));
        }
        let cart = user.cart;
        let { id: prodID, price } = product;
        let cartProduct = cart.items.find((item) => item.product.toString() === prodID.toString());
        if (cartProduct) {
            cartProduct.quantity += quantity;
            cartProduct.total += price * quantity;
            cartProduct.colors = [...colors, ...cartProduct.colors];
            cartProduct.sizes = [...sizes, ...cartProduct.sizes];
        }
        else {
            cart.items.push({
                product: prodID,
                quantity,
                total: price * quantity,
                colors,
                sizes,
            });
        }
        user.cart.totalQuantity += quantity;
        user.cart.totalPrice += price * quantity;
        await user.save();
        res
            .status(200)
            .json({ success: true, message: "Product added to cart successfully" });
    });
    removeFromCart = asyncHandler(async (req, res, next) => {
        const productId = req.params.id;
        const { quantity = 1, colors = [], sizes = [] } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return next(new AppError("Product not found", 404));
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new AppError("User not found", 404));
        }
        if (typeof quantity !== "number" || quantity <= 0) {
            return next(new AppError("Invalid quantity", 400));
        }
        let cart = user.cart;
        let { id: prodID, price } = product;
        let cartProduct = cart.items.find((item) => item.product.toString() === prodID.toString());
        if (cartProduct) {
            if (quantity > cartProduct.quantity) {
                return next(new AppError("Invalid quantity", 400));
            }
            if (quantity === cartProduct.quantity) {
                cart.items = cart.items.filter((item) => item.product.toString() !== prodID.toString());
            }
            else {
                cartProduct.quantity -= quantity;
                cartProduct.total -= price * quantity;
                if (colors?.length > 0) {
                    for (let color of colors) {
                        let ind = cartProduct.colors.findIndex((c) => color.toLowerCase() == c.toLowerCase());
                        if (ind >= 0) {
                            cartProduct.colors.splice(ind, 1);
                        }
                    }
                }
                if (sizes?.length > 0) {
                    for (let size of sizes) {
                        let ind = cartProduct.sizes.findIndex((sz) => size.toUpperCase() == sz.toUpperCase());
                        if (ind >= 0) {
                            cartProduct.sizes.splice(ind, 1);
                        }
                    }
                }
            }
        }
        else {
            return new AppError("Product not found in cart", 404);
        }
        user.cart.totalQuantity -= quantity;
        user.cart.totalPrice -= price * quantity;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Product removed from cart successfully",
        });
    });
}
export default new ProductController();
