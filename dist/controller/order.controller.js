import asyncHandler from "../middlewares/async_handler";
import Order from "./../model/order/model";
import AppError from "../utils/app_error";
import Product from "../model/product/model";
export const getAllOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find();
    res.status(200).json({
        success: true,
        data: { orders },
    });
});
export const getOrder = asyncHandler(async (req, res, next) => {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
        return next(new AppError("Order not found", 404));
    }
    res.status(200).json({
        success: true,
        data: { order },
    });
});
export const deleteOrder = asyncHandler(async (req, res, next) => {
    const orderId = req.params.id;
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
        return next(new AppError("Order not found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Order deleted successfully",
    });
});
export const saleStatistics = asyncHandler(async (req, res, next) => {
    let { page = 1, limit = 7 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const products = await Product.find().limit(limit).skip((page - 1) * limit).sort({ numOfSales: -1 });
    res.status(200).json({ success: true, data: { products } });
});
