import mongoose, { Schema } from "mongoose";
const orderSchema = new Schema({
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
export default mongoose.model("Order", orderSchema);
