import crypto from "crypto";
import userRepo from "../../model/user/user.repo";
import User from "../../model/user/model";
import sendEmail from "../../utils/mailer";
import asyncHandler from "../../middlewares/async_handler";
import AppError from "../../utils/app_error";
import { generateToken } from "../../utils/token.service";
class AuthController {
    async createSendToken(user) {
        const token = await generateToken({
            id: user._id,
            email: user.email,
            role: user.role,
        });
        return {
            token,
            user: {
                ...user.toObject(),
                password: undefined,
            },
        };
    }
    signup = asyncHandler(async (req, res, next) => {
        const existingEmailUser = await userRepo.findByEmail(req.body.email);
        if (existingEmailUser) {
            throw new AppError("email-duplicated", 400);
        }
        const newUser = await userRepo.create(req.body);
        res.status(201).json({ success: true, user: newUser.toObject() });
    });
    login = asyncHandler(async (req, res, next) => {
        const { email, password } = req.body;
        const user = await userRepo.findByEmail(email);
        console.log(user);
        user.active = true;
        await user.save();
        if (!user || !(await user.correctPassword(password, user.password))) {
            throw new AppError("invalid-credentials", 401);
        }
        const { token, user: userData } = await this.createSendToken(user);
        res.status(200).json({ success: true, token, user: userData });
    });
    forgotPassword = asyncHandler(async (req, res, next) => {
        const user = await userRepo.findByEmail(req.body.email);
        if (!user) {
            throw new AppError("There is no user with email address.", 404);
        }
        const OTP = Math.floor(1000 + Math.random() * 9000).toString();
        await user.createForgetPasswordOTP(OTP);
        await user.save({ validateBeforeSave: false });
        const message = `Forgot your password ? \n Your OTP Code is ${OTP}.\nIf you didn't forget your password, please ignore this email!`;
        await sendEmail(user.email, "Your password reset token (valid for 10 min)", message);
        res.status(200).json({ success: true, message: "OTP sent to email!" });
    });
    verifyForgotPasswordOTP = asyncHandler(async (req, res, next) => {
        const HashedOTP = crypto.createHash("sha256").update(req.params.OTP).digest("hex");
        console.log("Hashed OTP: ", HashedOTP, req.params.OTP);
        const user = await User.findOne({
            forgotPasswordOTP: HashedOTP,
            passwordResetExpires: { $gt: Date.now() },
        });
        if (!user) {
            throw new AppError("invalid-otp", 401);
        }
        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });
        res.status(200).json({ success: true, token: resetToken });
    });
    resetPassword = asyncHandler(async (req, res, next) => {
        const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });
        if (!user) {
            throw new AppError("Token is invalid or has expired", 400);
        }
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        await user.save();
        const { token: newToken, user: userData } = await this.createSendToken(user);
        res.status(200).json({ success: true, token: newToken, user: userData });
    });
    verifyEmail = asyncHandler(async (req, res, next) => {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new AppError('User not found', 404);
        }
        if (user.verifyEmailOTPToken !== otp) {
            throw new AppError('Invalid OTP', 400);
        }
        user.emailActive = true;
        user.verifyEmailOTPToken = undefined;
        user.verifyEmailExpires = undefined;
        await user.save();
        res.status(200).json({ success: true, message: 'Email verified successfully' });
    });
    resendVerifyOTPEmail = asyncHandler(async (req, res, next) => {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new AppError('User not found', 404);
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verifyEmailOTPToken = otp;
        user.verifyEmailExpiresAt = Date.now() + 10 * 60 * 1000;
        await user.save();
        const message = `Your verification OTP: ${otp}`;
        res.status(200).json({ success: true, message: 'Verification OTP resent successfully' });
    });
    changePassword = asyncHandler(async (req, res, next) => {
        const { password } = req.body;
        const user = await User.findById(req.params.id).select("+password");
        if (!user) {
            throw new AppError('User not found', 404);
        }
        if (!(await user.correctPassword(password, user.password))) {
            throw new AppError('Incorrect old password', 400);
        }
        user.password = password;
        await user.save();
        res.status(200).json({ success: true, message: 'Password changed successfully' });
    });
}
export default new AuthController();
