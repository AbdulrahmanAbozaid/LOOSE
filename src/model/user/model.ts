import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
type HookNextFunction = () => void;

interface User extends Document {
  fullName: string;
  phone: string;
  sex: 'male' | 'female';
  email: string;
  emailActive: boolean;
  password: string;
  language: 'arabic' | 'english';
  verifyEmailOTPToken?: string;
  verifyEmailExpires?: Date;
  forgotPasswordOTP?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  role: 'Customers' | 'Admins';
  avatar: object;
  address: {
    street: string;
    city: string;
    country: string;
    state: string;
    zipCode: string;
  };
  cart: {
    items: Array<{
      product: mongoose.Types.ObjectId;
      quantity: number;
      colors: string[];
      size: string;
    }>;
    totalPrice: number;
    totalQuantity: number;
  };
  lastActivityDate: Date;
  passwordChangedAt?: Date;
  active: boolean;
}

const userSchema = new Schema<User>({
  fullName: { type: String, required: [true, 'Please provide your full name.'] },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number.'],
    validate: {
      validator: function(v: string) {
        return /^\+?\d{1,3}[- ]?\d{3,14}$/.test(v); // Regular expression for phone number validation
      },
      message: 'Please provide a valid phone number.'
    }
  },
  sex: { type: String, enum: ['male', 'female'], default: "female" },
  email: {
    type: String,
    required: [true, 'Please provide your email address.'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.']
  },
  emailActive: { type: Boolean, default: false },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: [8, 'Password must have at least 8 characters.'],
	select: false,
  },
  language: { type: String, enum: ['arabic', 'english'], default: 'english' },
  verifyEmailOTPToken: { type: String },
  verifyEmailExpires: { type: Date },
  forgotPasswordOTP: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  role: { type: String, enum: ['Customers', 'Admins'], default: 'Customers' },
  avatar: { type: Object },
  address: {
    street: { type: String },
    city: { type: String },
    country: { type: String },
    state: { type: String },
    zipCode: { type: String }
  },
  cart: {
    items: [{
      product: { type: Schema.Types.ObjectId, ref: 'Products' },
      quantity: { type: Number },
      colors: [{ type: String }],
      size: { type: String }
    }],
    totalPrice: { type: Number },
    totalQuantity: { type: Number }
  },
  lastActivityDate: { type: Date },
  passwordChangedAt: { type: Date, select: false },
  active: { type: Boolean, default: false }
});

// Hash password before saving
userSchema.pre<User>('save', async function (next: HookNextFunction) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = new Date(Date.now() - 1000); // Set to a second ago to ensure consistency
  next();
});

// Compare entered password with stored password
userSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if password was changed after a certain timestamp
userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Create and store a verification OTP for email
userSchema.methods.createVerifyEmailOTP = function (OTP: string) {
  this.verifyEmailOTPToken = crypto.createHash('sha256').update(OTP).digest('hex');
  this.verifyEmailExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return OTP;
};

// Create and store a forget password OTP
userSchema.methods.createForgetPasswordOTP = function (OTP: string) {
  this.forgotPasswordOTP = crypto.createHash('sha256').update(OTP).digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return OTP;
};

// Create and store a password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return resetToken;
};

export default mongoose.model<User>('Users', userSchema);
export {
	User
}
