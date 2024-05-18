import mongoose, { Schema, Document } from "mongoose";

// Define interface for Product document
interface IProduct extends Document {
  name: string;
  description: string;
  category: Schema.Types.ObjectId;
  status: "active" | "scheduled" | "draft";
  photos: object[];
  price: number;
  colors: string[];
  sizes: string[];
  publishDate: Date;
  discount: number;
  numOfSales: number;
  views: number;
  increaseViews(): Promise<void>;
}

// Define schema for Product
const ProductSchema: Schema = new Schema<IProduct>(
  {
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
    //   default: ["red", "blue", "green", "yellow"],
    },
    sizes: {
      type: [String],
      required: false,
    //   default: ["S", "L", "XL", "XXL"],
    },
    publishDate: { type: Date, required: false, default: new Date() },
    discount: { type: Number, default: 0 },
    numOfSales: { type: Number, default: 0 },
	views: {
		type: Number,
		default: 0,
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

ProductSchema.methods.increaseViews = async function (): Promise<void> {
  this.views += 1;
  await this.save();
};

// Create and export the Product model
export default mongoose.model<IProduct>("Products", ProductSchema);
export type ProductType = IProduct;
