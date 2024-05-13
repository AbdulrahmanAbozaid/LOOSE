// import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import AppError from "../../utils/app_error";
import { AuthService } from "../../model/user/user.repo";
import sendEmail from "../../utils/mailer";

class AuthController implements AuthService {
	private user_repo: any;
	constructor(UserRepo: any) {
		this.user_repo = UserRepo;
	}

  private signToken(id: string): string {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN!,
    });
  }

  private createSendToken(user: any): { token: string; user: any } {
    const token = this.signToken(user._id);

    return {
      token,
      user: {
        ...user,
        password: undefined,
      },
    };
  }

  async signup(userData: {
    fullName: string;
    phone: string;
    email: string;
    password: string;
  }): Promise<{
    success: boolean;
    token?: string;
    user?: any;
    message?: string;
  }> {
    try {
      // Check for duplicate email
      const existingEmailUser = await this.user_repo.findByEmail(userData.email);
      if (existingEmailUser) {
        return new AppError("email-duplicated", 400);
      }

      // Create new user
      const newUser = await this.user_repo.create(userData);

      // Create and send token
      const { token, user } = this.createSendToken(newUser);
      return { success: true, token, user };
    } catch (error: any) {
      return new AppError(error.message, error.status || 500);
    }
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{
    success: boolean;
    token?: string;
    user?: any;
    message?: string;
  }> {
    try {
      const { email, password } = credentials;

      // Find user by email
      const user = await this.user_repo.findByEmail(email);
      if (!user || !(await user.correctPassword(password, user.password))) {
        return new AppError("invalid-credentials", 401);
      }

      // Create and send token
      const { token, user: userData } = this.createSendToken(user);
      return { success: true, token, user: userData };
    } catch (error: any) {
      return new AppError(error.message, error.status || 500);
    }
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const user = await this.user_repo.findByEmail(email);
      if (!user) {
        return new AppError("There is no user with email address.", 404);
      }

      // Generate OTP
      const OTP = Math.floor(100000 + Math.random() * 900000).toString();
      await user.createForgetPasswordOTP(OTP);
      await user.save({ validateBeforeSave: false });

      // Send email with OTP
      const message = `Forgot your password ? \n Your OTP Code is ${OTP}.\nIf you didn't forget your password, please ignore this email!`;
      await sendEmail(user.email, "Your password reset token (valid for 10 min)", message);

      return { success: true, message: "OTP sent to email!" };
    } catch (error: any) {
      return new AppError(error.message, error.status || 500);
    }
  }

  async verifyForgotPasswordOTP(OTP: string): Promise<{ success: boolean; token?: string }> {
    try {
      const HashedOTP = crypto.createHash("sha256").update(OTP).digest("hex");

      const user = await this.user_repo.findOne({
        forgetPasswordOTP: HashedOTP,
        passwordResetExpires: { $gt: Date.now() },
      });

      const resetToken = user.createPasswordResetTokenOTP();
      await user.save({ validateBeforeSave: false });

      return { success: true, token: resetToken };
    } catch (error: any) {
      return new AppError(error.message, error.status || 500);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; token?: string; user?: any }> {
    try {
      const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

      const user = await this.user_repo.findOne({
        passwordResetTokenOTP: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      });

      if (!user) {
        return new AppError("Token is invalid or has expired", 400);
      }

      user.password = newPassword;
      user.passwordConfirm = newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      const { token: newToken, user: userData } = this.createSendToken(user);
      return { success: true, token: newToken, user: userData };
    } catch (error: any) {
      return new AppError(error.message, error.status || 500);
    }
  }
}

export default AuthController;
