import asyncHandler from "../middlewares/async_handler";
import User from "../model/user/model";
import AppError from "../utils/app_error";
import { hash } from "bcrypt";
import Order from './../model/order/model';
const getUsers = asyncHandler(async (_req, res) => {
    const users = await User.find();
    res.status(200).json({ success: true, data: { users } });
});
const getUserById = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    res.status(200).json({ success: true, data: { user } });
});
const getUserFavorites = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate("favorites");
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    res
        .status(200)
        .json({ success: true, data: { favorites: user.favorites } });
});
const updateUser = asyncHandler(async (req, res, next) => {
    const userData = req.body;
    if (userData?.password) {
        userData.password = await hash(userData.password, 10);
    }
    let user = await User.findByIdAndUpdate(req.params.id, userData, {
        new: true,
    });
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    res.status(200).json({ success: true, data: { user } });
});
const deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    await user.deleteOne();
    res.status(200).json({ success: true, message: "User removed" });
});
const getUserCart = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate("cart.items.product");
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    res.status(200).json({ success: true, data: { cart: user.cart } });
});
const updateUserCart = asyncHandler(async (req, res, next) => {
    const { items, totalPrice, totalQuantity } = req.body;
    let user = await User.findById(req.params.id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    user.cart = {
        items: items || user.cart.items,
        totalPrice: totalPrice || user.cart.totalPrice,
        totalQuantity: totalQuantity || user.cart.totalQuantity,
    };
    await user.save();
    res
        .status(200)
        .json({ success: true, message: "Cart updated successfully" });
});
const addUserCart = asyncHandler(async (req, res, next) => {
    const { items, totalPrice, totalQuantity } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    user.cart = {
        items,
        totalPrice,
        totalQuantity,
    };
    await user.save();
    res.status(201).json({ success: true, message: "Cart added successfully" });
});
const checkoutCart = asyncHandler(async (req, res, next) => {
    const userId = req.params.id || req.user.id;
    const user = await User.findById(userId).populate("cart.items.product");
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    if (user.cart.items.length === 0) {
        return next(new AppError("Cart is empty", 400));
    }
    let message = `Order Details:\n`;
    message += `Customer Name: ${user.fullName}\n`;
    message += `Phone: ${user.phone}\n`;
    message += `Email: ${user.email}\n`;
    if (Object.values(user.address).some((address) => Boolean(address))) {
        const { street, city, country, state, zipCode } = user.address;
        message += `Address:\n`;
        if (street)
            message += `\tStreet: ${street || "N/A"}\n`;
        if (city)
            message += `\tCity: ${city || "N/A"}\n`;
        if (state)
            message += `\tState: ${state || "N/A"}\n`;
        if (country)
            message += `\tCountry: ${country || "N/A"}\n`;
        if (zipCode)
            message += `\tZip Code: ${zipCode || "N/A"}\n`;
    }
    message += `\nProducts:\n`;
    for (const item of user.cart.items) {
        const product = item.product;
        message += `Name: ${product.name}\nQuantity: ${item.quantity}\n`;
        if (item?.colors?.length &&
            item?.sizes?.length &&
            item?.colors?.length === item?.sizes?.length) {
            for (let i = 0; i < item.colors.length; i++) {
                message += `\tColor: ${item.colors[i]}, Size: ${item.sizes[i]}\n`;
            }
        }
        else {
            message += `\tColor(s): ${item.colors.join(", ")}, Size(s): ${item.sizes.join(", ")}\n`;
        }
        product.numOfSales += item.quantity;
        await product.save();
    }
    message += `\nTotal Price: ${user.cart.totalPrice}\n`;
    message += `Total Quantity: ${user.cart.totalQuantity}`;
    await Order.create({
        customer: user._id,
        totalPrice: user.cart.totalPrice,
        totalQuantity: user.cart.totalQuantity,
        statement: message,
    });
    user.cart.items = [];
    user.cart.totalPrice = 0;
    user.cart.totalQuantity = 0;
    await user.save();
    console.log(message);
    res.status(200).json({
        success: true,
        message: "Order placed successfully",
        data: {
            wa_message: message,
            phone: process.env.ADMIN_WHATSAPP_NUMBER,
        },
    });
});
const addToFavs = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const { product } = req.body;
    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    await user.addToFavs(product);
    res
        .status(200)
        .json({ success: true, message: "Product added to favorites" });
});
const removeFromFavs = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const { product } = req.body;
    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    await user.removeFromFavs(product);
    res
        .status(200)
        .json({ success: true, message: "Product removed from favorites" });
});
export { getUsers, getUserById, updateUser, deleteUser, getUserCart, updateUserCart, addUserCart, checkoutCart, addToFavs, removeFromFavs, getUserFavorites, };
