import mongoose, { Schema } from "mongoose";
const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    status: {
        type: String,
        enum: ["active", "scheduled", "draft"],
        default: "draft",
    },
    photos: {
        type: [Object],
        required: false,
        default: [
            {
                url: "https://res.cloudinary.com/dquzat4lc/image/upload/v1715714089/Loose/pxczt8xvzvpxdslcy605.jpg",
            },
        ],
    },
    price: { type: Number, required: true },
    colors: {
        type: [String],
        required: false,
    },
    sizes: {
        type: [String],
        required: false,
    },
    publishDate: { type: Date, required: false, default: Date.now },
    discount: { type: Number, default: 0 },
    numOfSales: { type: Number, default: 0 },
    views: {
        type: Number,
        default: 0,
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
ProductSchema.methods.increaseViews = async function () {
    this.views += 1;
    await this.save();
};
export default mongoose.model("Products", ProductSchema);
