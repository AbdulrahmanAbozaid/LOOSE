import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
const SALT = 10;
const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "Please provide your full name."],
    },
    phone: {
        type: String,
        required: [true, "Please provide your phone number."],
        validate: {
            validator: function (v) {
                return /^\+?\d{1,3}[- ]?\d{3,14}$/.test(v);
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
                colors: { type: [{ type: String, lowercase: true }], default: [] },
                sizes: { type: [{ type: String, uppercase: true }], default: [] },
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
}, {
    timestamps: true,
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcrypt.hash(this.password, SALT);
    console.log(this.password);
    this.passwordChangedAt = new Date(Date.now() - 1000);
    next();
});
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};
userSchema.methods.createVerifyEmailOTP = function (OTP) {
    this.verifyEmailOTPToken = crypto
        .createHash("sha256")
        .update(OTP)
        .digest("hex");
    this.verifyEmailExpires = new Date(Date.now() + 10 * 60 * 1000);
    return OTP;
};
userSchema.methods.createForgetPasswordOTP = function (OTP) {
    this.forgotPasswordOTP = crypto
        .createHash("sha256")
        .update(OTP)
        .digest("hex");
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    return OTP;
};
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    return resetToken;
};
userSchema.methods.addToFavs = async function (productId) {
    if (!this.favorites.includes(productId)) {
        this.favorites.push(productId);
        await this.save();
    }
};
userSchema.methods.removeFromFavs = async function (productId) {
    this.favorites = this.favorites.filter((fav) => fav.toString() !== productId.toString());
    await this.save();
};
export default mongoose.model("Users", userSchema);
