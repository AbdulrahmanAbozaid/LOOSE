import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
// import Product from "../product/model";
type HookNextFunction = () => void;
const SALT = 10;

// product Entry
interface ItemDetail {
  color: string;
  size: string;
}
interface CartItem {
  product: Schema.Types.ObjectId;
  quantity: number;
  total: number;
  details?: ItemDetail[];
  colors: string[];
  sizes: string[];
}

interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
}

interface User extends Document {
  fullName: string;
  phone: string;
  sex: "male" | "female";
  email: string;
  emailActive: boolean;
  password: string;
  language: "arabic" | "english";
  verifyEmailOTPToken?: string;
  verifyEmailExpires?: Date;
  forgotPasswordOTP?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  role: "customer" | "admin";
  avatar: object;
  address: {
    street: string;
    city: string;
    country: string;
    state: string;
    zipCode: string;
  };
  cart: Cart;
  lastActivityDate: Date;
  passwordChangedAt?: Date;
  active: boolean;
  favorites: Array<Schema.Types.ObjectId>;
  // methods
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  checkoutCart(): Promise<void>;
  addToFavs(productId: Schema.Types.ObjectId): Promise<void>;
  removeFromFavs(productId: Schema.Types.ObjectId): Promise<void>;
  increaseSeen(): Promise<void>;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         fullName:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         phone:
 *           type: string
 *           description: The phone number of the user
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             country:
 *               type: string
 *             zipCode:
 *               type: string
 *         favorites:
 *           type: array
 *           items:
 *             type: string
 *             description: The favorite products of the user
 *         cart:
 *           type: object
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   product:
 *                     type: string
 *                   quantity:
 *                     type: number
 *                   colors:
 *                     type: array
 *                     items:
 *                       type: string
 *                   sizes:
 *                     type: array
 *                     items:
 *                       type: string
 *             totalPrice:
 *               type: number
 *             totalQuantity:
 *               type: number
 *     CreateUser:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *       properties:
 *         fullName:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         phone:
 *           type: string
 *           description: The phone number of the user
 *     UserResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           $ref: '#/components/schemas/User'
 */
const userSchema = new Schema<User>(
  {
    fullName: {
      type: String,
      required: [true, "Please provide your full name."],
    },
    phone: {
      type: String,
      required: [true, "Please provide your phone number."],
      validate: {
        validator: function (v: string) {
          return /^\+?\d{1,3}[- ]?\d{3,14}$/.test(v); // Regular expression for phone number validation
        },
        message: "Please provide a valid phone number.",
      },
    },
    sex: { type: String, enum: ["male", "female"], default: "female" },
    email: {
      type: String,
      required: [true, "Please provide your email address."],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address."],
    },
    emailActive: { type: Boolean, default: false },
    password: {
      type: String,
      required: [true, "Please provide a password."],
      minlength: [8, "Password must have at least 8 characters."],
      select: false,
    },
    language: { type: String, enum: ["arabic", "english"], default: "english" },
    verifyEmailOTPToken: { type: String },
    verifyEmailExpires: { type: Date },
    forgotPasswordOTP: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    avatar: { type: Object },
    address: {
      street: { type: String },
      city: { type: String },
      country: { type: String },
      state: { type: String },
      zipCode: { type: String },
    },
    cart: {
      items: [
        {
          product: { type: Schema.Types.ObjectId, ref: "Products" },
          quantity: { type: Number, default: 0 },
          total: { type: Number, default: 0 },
          details: {
            type: [
              {
                color: { type: String },
                size: { type: String },
                quantity: { type: Number, default: 0 },
              },
            ],
            default: [],
          },
          colors: { type: [{type: String, lowercase: true}], default: [] },
          sizes: { type: [{type: String, uppercase: true}], default: [] },
        },
      ],
      totalPrice: { type: Number, default: 0 },
      totalQuantity: { type: Number, default: 0 },
    },
    lastActivityDate: { type: Date },
    passwordChangedAt: { type: Date, select: false },
    active: { type: Boolean, default: false },
    favorites: {
      type: [{ type: Schema.Types.ObjectId, ref: "Products" }],
      default: [],
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

// Hash password before saving
userSchema.pre<User>("save", async function (next: HookNextFunction) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, SALT);
  console.log(this.password);

  this.passwordChangedAt = new Date(Date.now() - 1000); // Set to a second ago to ensure consistency
  next();
});

// Compare entered password with stored password
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if password was changed after a certain timestamp
userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Create and store a verification OTP for email
userSchema.methods.createVerifyEmailOTP = function (OTP: string) {
  this.verifyEmailOTPToken = crypto
    .createHash("sha256")
    .update(OTP)
    .digest("hex");
  this.verifyEmailExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return OTP;
};

// Create and store a forget password OTP
userSchema.methods.createForgetPasswordOTP = function (OTP: string) {
  this.forgotPasswordOTP = crypto
    .createHash("sha256")
    .update(OTP)
    .digest("hex");
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return OTP;
};

// Create and store a password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return resetToken;
};

userSchema.methods.addToFavs = async function (
  productId: Schema.Types.ObjectId
): Promise<void> {
  if (!this.favorites.includes(productId)) {
    this.favorites.push(productId);
    await this.save();
  }
};

userSchema.methods.removeFromFavs = async function (
  productId: Schema.Types.ObjectId
): Promise<void> {
  this.favorites = this.favorites.filter(
    (fav: Schema.Types.ObjectId) => fav.toString() !== productId.toString()
  );
  await this.save();
};

export default mongoose.model<User>("Users", userSchema);
export { User };
