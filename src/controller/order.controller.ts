import { Request, Response, NextFunction, RequestHandler } from "express";
import asyncHandler from "../middlewares/async_handler";
import Order from "./../model/order/model";
import AppError from "../utils/app_error";
import Product from "../model/product/model";

// Get all orders
export const getAllOrders = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orders: any = await Order.find();

    res.status(200).json({
      success: true,
      data: { orders },
    });
  }
);

// Get order by ID
export const getOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    res.status(200).json({
      success: true,
      data: { order },
    });
  }
);

// Delete order by ID
export const deleteOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;

    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  }
);

// Method to get all products
export const saleStatistics: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let { page = 1, limit = 7 } = req.query;
    page = parseInt(page as string);
    limit = parseInt(limit as string);
    const products = await Product.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ numOfSales: -1 });
    res.status(200).json({ success: true, data: { products } });
  }
);

// Method to get all products
export const viewStatistics: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let { page = 1, limit = 7 } = req.query;
    page = parseInt(page as string);
    limit = parseInt(limit as string);
    const products = await Product.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ views: -1 });
    res.status(200).json({ success: true, data: { products } });
  }
);
