import mongoose, { Schema, Document } from "mongoose";

export interface Order extends Document {
  status: "pending" | "processing" | "delivered" | "cancelled";
  orderDate: Date;
  customer: Schema.Types.ObjectId;
  totalPrice: number;
  totalQuantity: number;
  statement: string;
}

const orderSchema = new Schema<Order>({
  status: {
    type: String,
    enum: ["pending", "processing", "delivered", "cancelled"],
    required: false,
    default: "pending",
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: false,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  totalQuantity: {
    type: Number,
    required: true,
  },
  statement: {
    type: String,
  },
});

export default mongoose.model<Order>("Order", orderSchema);
