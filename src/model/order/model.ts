import mongoose, { Schema, Document } from "mongoose";

export interface Order extends Document {
  status: "pending" | "processing" | "delivered" | "cancelled";
  orderDate: Date;
  customer: Schema.Types.ObjectId;
  orderMessage: string;
  totalPrice: number;
  quantity: number;
  remove(): void;
}

const orderSchema = new Schema<Order>({
  status: {
    type: String,
    enum: ["pending", "processing", "delivered", "cancelled"],
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  orderMessage: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

// Middleware to automatically delete orders when their status is changed to "cancelled" or "delivered"
orderSchema.pre<Order>("save", function (next) {
  if (
    this.isModified("status") &&
    (this.status === "cancelled" || this.status === "delivered")
  ) {
    // Remove the order from the database
    this.remove();
  }
  next();
});

export default mongoose.model<Order>("Order", orderSchema);
