import { Request, Response, NextFunction, RequestHandler } from "express";
import asyncHandler from "../middlewares/async_handler";
import User, { User as Users } from "../model/user/model";
import AppError from "../utils/app_error";
import { hash } from "bcrypt";

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Public
const getUsers: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const users: any = await User.find();
    res.status(200).json({ success: true, data: { users } });
  }
);

// @desc    Get a user by ID
// @route   GET /api/v1/users/:id
// @access  Public
const getUserById: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res.status(200).json({ success: true, data: { user } });
  }
);

// @desc    Get a user favs by ID
// @route   GET /api/v1/users/:id/favorites
// @access  Public
const getUserFavorites: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id).populate("favorites");
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res
      .status(200)
      .json({ success: true, data: { favorites: user.favorites } });
  }
);

// @desc    Update a user
// @route   PUT /api/v1/users/:id
// @access  Private (admin or user)
const updateUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userData: any = req.body;

    if (userData?.password) {
      userData.password = await hash(userData.password, 10);
    }

    //   let user: Users | null = await User.findById(req.params.id);
    let user: Users | null = await User.findByIdAndUpdate(
      req.params.id,
      userData,
      {
        new: true,
      }
    );
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({ success: true, data: { user } });
  }
);

// @desc    Delete a user
// @route   DELETE /api/v1/users/:id
// @access  Private (admin only)
const deleteUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    await user.deleteOne();

    res.status(200).json({ success: true, message: "User removed" });
  }
);

// @desc    Get the cart of a user
// @route   GET /api/v1/users/:id/cart
// @access  Private (user only)
const getUserCart: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id).populate(
      "cart.items.product"
    );
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({ success: true, data: { cart: user.cart } });
  }
);

// @desc    Update or create the cart of a user
// @route   PUT /api/v1/users/:id/cart
// @access  Private (user only)
const updateUserCart: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { items, totalPrice, totalQuantity } = req.body;

    let user: Users | null = await User.findById(req.params.id);
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
  }
);

// @desc    Add a whole cart to a user
// @route   POST /api/v1/users/:id/cart
// @access  Private (user only)
const addUserCart: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

// @desc    Checkout and proceed the order
// @route   PATCH /api/v1/users/:id/cart
// @access  Private (user only)
const checkoutCart: RequestHandler = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
	  const userId = req.params.id || (req as any).user.id;
	  const user = await User.findById(userId).populate("cart.items.product");
  
	  if (!user) {
		return next(new AppError("User not found", 404));
	  }
  
	  if (user.cart.items.length === 0) {
		return next(new AppError("Cart is empty", 400));
	  }
  
	  let message = `Order Details:\n`;
  
	  // Customer details
	  message += `Customer Name: ${user.fullName}\n`;
	  message += `Phone: ${user.phone}\n`;
	  message += `Email: ${user.email}\n`;
	  if (Object.values(user.address).some(address => Boolean(address))) {
		const { street, city, country, state, zipCode } = user.address;
		message += `Address:\n`;
		if (street) message += `\tStreet: ${street || "N/A"}\n`;
		if (city) message += `\tCity: ${city || "N/A"}\n`;
		if (state) message += `\tState: ${state || "N/A"}\n`;
		if (country) message += `\tCountry: ${country || "N/A"}\n`;
		if (zipCode) message += `\tZip Code: ${zipCode || "N/A"}\n`;
	  }
	  message += `\nProducts:\n`;
  
	  for (const item of user.cart.items) {
		const product = item.product as any; // Cast to any to access product fields
		message += `Name: ${product.name}\nQuantity: ${item.quantity}\n`;
		if (
		  item?.colors?.length &&
		  item?.sizes?.length &&
		  item?.colors?.length === item?.sizes?.length
		) {
		  for (let i = 0; i < item.colors.length; i++) {
			message += `\tColor: ${item.colors[i]}, Size: ${item.sizes[i]}\n`;
		  }
		} else {
		  message += `\tColor(s): ${item.colors.join(", ")}, Size(s): ${item.sizes.join(", ")}\n`;
		}
  
		// Update the number of sales
		product.numOfSales += item.quantity;
		await product.save();
	  }
  
	  message += `\nTotal Price: ${user.cart.totalPrice}\n`;
	  message += `Total Quantity: ${user.cart.totalQuantity}`;
  
	  // Reset the cart
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
		}
	  });
	}
  );

// Method to add a product to favorites
const addToFavs: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const { product } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    await user.addToFavs(product);

    res
      .status(200)
      .json({ success: true, message: "Product added to favorites" });
  }
);

// Method to remove a product from favorites
const removeFromFavs: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const { product } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    await user.removeFromFavs(product);

    res
      .status(200)
      .json({ success: true, message: "Product removed from favorites" });
  }
);

export {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserCart,
  updateUserCart,
  addUserCart,
  checkoutCart,
  addToFavs,
  removeFromFavs,
  getUserFavorites,
};
