import AuthController from "../../src/controller/authController/user.auth";
import AppError from "../../src/utils/app_error";

describe("AuthController", () => {
  let authController: AuthController;

  beforeEach(() => {
    // authController = new AuthController();
  });

  describe("signup", () => {
    it("should return success true and token if signup is successful", async () => {
      // Mock the userRepo methods
      const mockUserRepo = {
        findByEmail: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ _id: "user_id", email: "test@example.com" }),
      };

      const userData = {
        fullName: "John Doe",
        phone: "1234567890",
        email: "test@example.com",
        password: "password",
      };

      authController = new AuthController(mockUserRepo as any);

      const result = await authController.signup(userData);

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(mockUserRepo.create).toHaveBeenCalledWith(userData);
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
    });

    it("should throw AppError with status 400 if email is duplicated", async () => {
      // Mock the userRepo methods
      const mockUserRepo = {
        findByEmail: jest.fn().mockResolvedValue({ email: "test@example.com" }),
      };

      const userData = {
        fullName: "John Doe",
        phone: "1234567890",
        email: "test@example.com",
        password: "password",
      };

      authController = new AuthController(mockUserRepo as any);

      await expect(authController.signup(userData)).rejects.toThrow(AppError);
      await expect(authController.signup(userData)).rejects.toThrow("email-duplicated");
    });
  });

  describe("login", () => {
    it("should return success true and token if login is successful", async () => {
      // Mock the userRepo methods
      const mockUserRepo = {
        findByEmail: jest.fn().mockResolvedValue({ email: "test@example.com", correctPassword: jest.fn().mockResolvedValue(true) }),
      };

      const credentials = {
        email: "test@example.com",
        password: "password",
      };

      authController = new AuthController(mockUserRepo as any);

      const result = await authController.login(credentials);

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
    });

    it("should throw AppError with status 401 if credentials are invalid", async () => {
      // Mock the userRepo methods
      const mockUserRepo = {
        findByEmail: jest.fn().mockResolvedValue({ email: "test@example.com", correctPassword: jest.fn().mockResolvedValue(false) }),
      };

      const credentials = {
        email: "test@example.com",
        password: "password",
      };

      authController = new AuthController(mockUserRepo as any);

      await expect(authController.login(credentials)).rejects.toThrow(AppError);
      await expect(authController.login(credentials)).rejects.toThrow("invalid-credentials");
    });
  });

  describe("forgotPassword", () => {
    it("should return success true if forgot password email sent successfully", async () => {
      // Mock the userRepo methods
      const mockUserRepo = {
        findByEmail: jest.fn().mockResolvedValue({ email: "test@example.com", createForgetPasswordOTP: jest.fn() }),
        save: jest.fn(),
      };

      const email = "test@example.com";

      authController = new AuthController(mockUserRepo as any);

      const result = await authController.forgotPassword(email);

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(mockUserRepo.save).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it("should throw AppError with status 404 if user email not found", async () => {
      // Mock the userRepo methods
      const mockUserRepo = {
        findByEmail: jest.fn().mockResolvedValue(null),
      };

      const email = "test@example.com";

      authController = new AuthController(mockUserRepo as any);

      await expect(authController.forgotPassword(email)).rejects.toThrow(AppError);
      await expect(authController.forgotPassword(email)).rejects.toThrow("There is no user with email address.");
    });
  });

  describe("verifyForgotPasswordOTP", () => {
    it("should return success true and token if OTP verification is successful", async () => {
      // Mock the userRepo methods
      const mockUserRepo = {
        findOne: jest.fn().mockResolvedValue({ createPasswordResetTokenOTP: jest.fn(), save: jest.fn() }),
      };

      const OTP = "123456";

      authController = new AuthController(mockUserRepo as any);

      const result = await authController.verifyForgotPasswordOTP(OTP);

      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
    });

    it("should throw AppError with status 400 if OTP verification fails", async () => {
      // Mock the userRepo methods
      const mockUserRepo = {
        findOne: jest.fn().mockResolvedValue(null),
      };

      const OTP = "123456";

      authController = new AuthController(mockUserRepo as any);

      await expect(authController.verifyForgotPasswordOTP(OTP)).rejects.toThrow(AppError);
      await expect(authController.verifyForgotPasswordOTP(OTP)).rejects.toThrow("Invalid OTP or expired token");
    });
  });

  describe("resetPassword", () => {
    it("should return success true and token if password reset is successful", async () => {
      // Mock the userRepo methods
      const mockUserRepo = {
        findOne: jest.fn().mockResolvedValue({ password: "old_password", passwordResetToken: "reset_token", passwordResetExpires: Date.now() + 3600000, save: jest.fn() }),
      };

      const token = "reset_token";
      const newPassword = "new_password";

      authController = new AuthController(mockUserRepo as any);

      const result = await authController.resetPassword(token, newPassword);

      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
    });

    it("should throw AppError with status 400 if token is invalid or expired", async () => {
      // Mock the userRepo methods
      const mockUserRepo = {
        findOne: jest.fn().mockResolvedValue({}),
      };

      const token = "reset_token";
      const newPassword = "new_password";

      authController = new AuthController(mockUserRepo as any);

      await expect(authController.resetPassword(token, newPassword)).rejects.toThrow(AppError);
      await expect(authController.resetPassword(token, newPassword)).rejects.toThrow("Token is invalid or has expired");
    });
  });
});
