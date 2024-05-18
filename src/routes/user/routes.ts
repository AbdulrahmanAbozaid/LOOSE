import { Router } from "express";
import AuthController from "../../controller/authController/user_auth_controller";
import * as userController from "../../controller/user.controller";
import { authorize, restrictTo } from "../../utils/auth.service";

const router = Router();

// POST /api/v1/users/signup
router.post('/', AuthController.signup);

// POST /api/v1/users/login
router.post("/auth/login", AuthController.login);

// POST /api/v1/users/forgot-password
router.post("/auth/forgot-password", AuthController.forgotPassword);

// POST /api/v1/users/verify-forgot-password-otp/:OTP
router.post("/auth/verify-forgot-password-otp/:OTP", AuthController.verifyForgotPasswordOTP);

// POST /api/v1/users/reset-password/:token
router.post("/auth/reset-password/:token", AuthController.resetPassword);

// PATCH /api/v1/users/password
router.post("/:id/password/", AuthController.changePassword);

// GET /api/v1/users - Get all users
router.get('/', authorize, restrictTo("Admin"), userController.getUsers);

// GET /api/v1/users/:id - Get a user by ID
router.get('/:id', authorize, userController.getUserById);

// PUT /api/v1/users/:id - Update a user
router.put('/:id', authorize, userController.updateUser);

// DELETE /api/v1/users/:id - Delete a user
router.delete('/:id', authorize, restrictTo("Admin"), userController.deleteUser);

// GET /api/v1/users/:id/cart - Get the cart for a user
router.get('/:id/cart', authorize, userController.getUserCart);

// PUT /api/v1/users/:id/cart - Update or create the cart for a user
router.put('/:id/cart', authorize, userController.updateUserCart);

// POST /api/v1/users/:id/cart - Add a whole cart for a user
router.post('/:id/cart', authorize, userController.addUserCart);

// POST /api/v1/users/checkout-cart
router.post('/:id/checkout-cart', authorize, userController.checkoutCart);

// POST /api/v1/users/favorites/add
router.post('/favorites/add', authorize, userController.addToFavs);

// POST /api/v1/users/favorites/remove
router.delete('/favorites/remove', authorize, userController.removeFromFavs);

// GET /api/v1/users/favorites
router.get('/favorites', authorize, userController.getUserFavourites);

export default router;
