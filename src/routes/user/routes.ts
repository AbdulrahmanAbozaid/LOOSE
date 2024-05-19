import { Router } from "express";
import AuthController from "../../controller/authController/user_auth_controller";
import * as userController from "../../controller/user.controller";
import { authorize } from "../../utils/auth.service";

const router = Router();


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 */

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
router.get('/', userController.getUsers);

// GET /api/v1/users/:id - Get a user by ID
router.get('/:id', userController.getUserById);

// PUT /api/v1/users/:id - Update a user
router.put('/:id', userController.updateUser);

// DELETE /api/v1/users/:id - Delete a user
router.delete('/:id', userController.deleteUser);

// GET /api/v1/users/:id/cart - Get the cart for a user
router.get('/:id/cart', authorize, userController.getUserCart);

// PUT /api/v1/users/:id/cart - Update or create the cart for a user
router.put('/:id/cart', authorize, userController.updateUserCart);

// POST /api/v1/users/:id/cart - Add a whole cart for a user
router.post('/:id/cart', authorize, userController.addUserCart);

// PATCH /api/v1/users/cart
router.patch('/:id/cart', authorize, userController.checkoutCart);

// POST /api/v1/users/favorites/add
router.post('/favorites/add', authorize, userController.addToFavs);

// DELETE /api/v1/users/favorites/remove
router.delete('/favorites/remove', authorize, userController.removeFromFavs);

// GET /api/v1/users/favorites
router.get('/:id/favorites', authorize, userController.getUserFavorites);

export default router;
