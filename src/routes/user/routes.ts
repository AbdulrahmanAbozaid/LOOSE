import { Router } from "express";
import AuthController from "../../controller/authController/user_auth_controller";

const router = Router();

// POST /api/v1/users/signup
router.post('/', AuthController.signup);

// POST /api/v1/users/login
router.post("/login", AuthController.login);

// POST /api/v1/users/forgot-password
router.post("/forgot-password", AuthController.forgotPassword);

// POST /api/v1/users/verify-forgot-password-otp/:OTP
router.post("/verify-forgot-password-otp/:OTP", AuthController.verifyForgotPasswordOTP);

// POST /api/v1/users/reset-password/:token
router.post("/reset-password/:token", AuthController.resetPassword);


export default router;
