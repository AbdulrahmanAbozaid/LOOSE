// Import necessary modules and classes
import { Request, Response, NextFunction, RequestHandler } from "express";
// import jwt from "jsonwebtoken";
import crypto from "crypto";
import userRepo from "../../model/user/user.repo";
import User from "../../model/user/model"
import sendEmail from "../../utils/mailer";
import asyncHandler from "../../middlewares/async_handler";
import AppError from "../../utils/app_error";
import { generateToken } from "../../utils/token.service";

// Define the AuthController class implementing the AuthService interface
class AuthController  {
  // Function to create and send JWT token
  private async createSendToken(user: any): Promise<{ token: string; user: any }> {
    // const token = this.signToken(user._id);
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

  // Function to handle user signup
  public signup: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Check for duplicate email
    const existingEmailUser = await userRepo.findByEmail(req.body.email);
    if (existingEmailUser) {
      throw new AppError("email-duplicated", 400);
    }

    // Create new user
    const newUser = await userRepo.create(req.body);

    // Create and send token
    // const { token, user } = this.createSendToken(newUser);
    res.status(201).json({ success: true, user: newUser.toObject() });
  });

  // Function to handle user login
  public login: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await userRepo.findByEmail(email);
	console.log(user);
	user.active = true;
	await user.save();
	
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new AppError("invalid-credentials", 401);
    }

    // Create and send token
    const { token, user: userData } =  await this.createSendToken(user);
    res.status(200).json({ success: true, token, user: userData });
  });

  // Function to handle forgotten password
  public forgotPassword: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userRepo.findByEmail(req.body.email);
    if (!user) {
      throw new AppError("There is no user with email address.", 404);
    }

    // Generate OTP
    const OTP = Math.floor(1000 + Math.random() * 9000).toString();
    await user.createForgetPasswordOTP(OTP);
    await user.save({ validateBeforeSave: false });

    // Send email with OTP
    const message = `Forgot your password ? \n Your OTP Code is ${OTP}.\nIf you didn't forget your password, please ignore this email!`;

    await sendEmail(user.email, "Your password reset token (valid for 10 min)", message);

    res.status(200).json({ success: true, message: "OTP sent to email!" });
  });

  // Function to handle verification of forgot password OTP
  public verifyForgotPasswordOTP: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const HashedOTP = crypto.createHash("sha256").update(req.params.OTP).digest("hex");

	console.log("Hashed OTP: ", HashedOTP, req.params.OTP);
	
    const user = await User.findOne({
		forgotPasswordOTP: HashedOTP,
		passwordResetExpires: { $gt: Date.now() },
    });

	if (!user) {
		throw new AppError("invalid-otp", 401);
	}

    const resetToken = (user as any).createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, token: resetToken });
  });

  // Function to handle password reset
  public resetPassword: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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

  public verifyEmail: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if the OTP matches
    if (user.verifyEmailOTPToken !== otp) {
      throw new AppError('Invalid OTP', 400);
    }

    // Verify the email
    user.emailActive = true;
    user.verifyEmailOTPToken = undefined;
    user.verifyEmailExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified successfully' });
  });

  // Function to resend verification OTP email
  public resendVerifyOTPEmail: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyEmailOTPToken = otp;
    user.verifyEmailExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
    await user.save();

    // Send OTP email
    const message = `Your verification OTP: ${otp}`;
    // Add logic to send email
    await sendEmail(user.email, "Verify Email token (valid for 10 min)", message);

    res.status(200).json({ success: true, message: 'Verification OTP resent successfully' });
  });

  public changePassword: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;

    // Find user by email
    const user = await User.findById(req.params.id).select("+password");
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if old password matches
    if (!(await user.correctPassword(password, user.password))) {
      throw new AppError('Incorrect old password', 400);
    }

    // Update user's password
    user.password = password;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  });
}

export default new AuthController();
